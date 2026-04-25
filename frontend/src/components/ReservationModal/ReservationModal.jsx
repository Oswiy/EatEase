import React, { useState, useEffect } from "react";
import "./ReservationModal.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

const ReservationModal = ({
  restaurant,
  onClose,
  onSuccess,
  notificationData = null,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    party_size: 1,
    hold_type: "quick_10min",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // Fee state
  const [holdFee, setHoldFee] = useState(0);
  const [minPartyForFee, setMinPartyForFee] = useState(1);

  // Calculate expiry times for the form (shows when the hold would expire if created)
  useEffect(() => {
    const now = new Date();
    const expiryMinutes = formData.hold_type === "quick_10min" ? 10 : 20;
    const expiry = new Date(now.getTime() + expiryMinutes * 60000);
    setExpiryTime(
      expiry.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );
  }, [formData.hold_type]);

  // Fetch fee settings
  useEffect(() => {
    const fetchFeeSettings = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/restaurants/${restaurant.id}/fee-settings`,
        );
        const data = await response.json();
        if (data.success) {
          setHoldFee(Number(data.hold_fee) || 0);
          setMinPartyForFee(Number(data.min_party_for_fee) || 1);
        }
      } catch (error) {
        console.error("Error fetching fee settings:", error);
      }
    };
    fetchFeeSettings();
  }, [restaurant.id]);

  const calculateFee = () => {
    const holdFeeNum = Number(holdFee || 0);
    const partySizeNum = Number(formData.party_size || 1);
    const minPartyNum = Number(minPartyForFee || 1);
    if (holdFeeNum <= 0) return 0;
    return partySizeNum >= minPartyNum ? holdFeeNum : 0;
  };

  const feeAmount = calculateFee();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.party_size ||
      formData.party_size < 1 ||
      formData.party_size > 10
    ) {
      setError("Please select a valid party size (1-10 people)");
      return;
    }

    const availableSeats =
      (restaurant?.max_capacity ?? 0) - (restaurant?.current_occupancy ?? 0);

    if (formData.party_size > availableSeats) {
      const msg =
        `Sorry, this restaurant cannot accommodate your party of ${formData.party_size}. ` +
        `Only ${availableSeats} seat${availableSeats === 1 ? "" : "s"} available right now.`;
      setError(msg);
      showToast(msg, "warning", 5000);
      return;
    }

    if (feeAmount > 0) {
      const confirmFee = window.confirm(
        `A hold fee of ₱${Number(feeAmount || 0).toFixed(2)} will apply for your party of ${formData.party_size}.\n\nThis fee guarantees your spot and will be charged when the hold is accepted.\n\nContinue?`,
      );
      if (!confirmFee) return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");

      console.log("Sending hold request with:", {
        restaurant_id: restaurant.id,
        party_size: formData.party_size,
        hold_type: formData.hold_type,
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/reservations/hold-spot`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            restaurant_id: restaurant.id,
            party_size: formData.party_size,
            hold_type: formData.hold_type,
            hold_fee: feeAmount,
          }),
        },
      );

      const data = await response.json();

      console.log("Hold response:", { status: response.status, data });

      if (response.ok && data.success) {
        setConfirmation(data);
        if (onSuccess) onSuccess(data.hold);
        showToast("Spot hold created successfully!", "success", 3000);
      } else {
        // Handle the error message from backend
        const errorMessage =
          data.message || data.error || "Failed to create spot hold";
        setError(errorMessage);

        // Show toast for any error
        showToast(errorMessage, "warning", 5000);

        // Log the full response for debugging
        console.error("Hold creation failed:", data);
      }
    } catch (error) {
      console.error("Error creating spot hold:", error);
      setError("Network error. Please try again.");
      showToast("Network error. Please check your connection.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const handlePartySizeChange = (change) => {
    const newSize = formData.party_size + change;
    if (newSize >= 1 && newSize <= 10) {
      setFormData((prev) => ({ ...prev, party_size: newSize }));
      setError("");
    }
  };

  // Function to format time correctly
  const formatTime = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return "Invalid time";
    }
  };

  // Confirmation screen
  if (confirmation) {
    const arrivalDeadline =
      confirmation.hold?.expires_at ||
      confirmation.hold?.original_expires_at ||
      confirmation.restaurant_response_deadline;

    const restaurantResponseDeadline =
      confirmation.restaurant_response_deadline;
    const holdDuration =
      confirmation.hold_duration ||
      (confirmation.hold?.hold_type === "quick_10min"
        ? "10 minutes"
        : "20 minutes");

    return (
      <div className="reservation-modal-overlay">
        <div className="reservation-modal confirmation-modal">
          <div className="reservation-modal-header">
            <h2>Spot Reserved!</h2>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="confirmation-content">
            <h3>Your spot is on hold!</h3>

            <div className="confirmation-details">
              <div className="detail-item">
                <span className="label">Restaurant Response:</span>
                <span className="value highlight">
                  {restaurantResponseDeadline
                    ? formatTime(restaurantResponseDeadline)
                    : "Waiting"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Hold Duration:</span>
                <span className="value">{holdDuration}</span>
              </div>

              {confirmation.hold_fee > 0 && (
                <div className="detail-item fee-highlight">
                  <span className="label">Hold Fee:</span>
                  <span className="value fee-amount">
                    ₱{Number(confirmation.hold_fee).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="detail-item">
                <span className="label">Arrival Deadline:</span>
                <span className="value highlight">
                  {arrivalDeadline
                    ? formatTime(arrivalDeadline)
                    : "Calculating..."}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Confirmation Code:</span>
                <span className="value code">
                  {confirmation.confirmation_code ||
                    confirmation.hold?.confirmation_code}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Party Size:</span>
                <span className="value">
                  {confirmation.hold?.party_size || formData.party_size} people
                </span>
              </div>
            </div>

            <div className="instructions">
              <h4>Next steps:</h4>
              <ul>
                <li>Go to the restaurant within the hold duration</li>
                <li>Show your confirmation code at the entrance</li>
                <li>The restaurant staff will confirm your hold</li>
              </ul>
              <div className="note important">
                Your spot will be released if you don't arrive before the
                arrival deadline.
              </div>
            </div>

            <button className="done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <div className="reservation-modal-header">
          <h2>Reserve at {restaurant?.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Restaurant Info - Show current occupancy warning if full */}
        <div className="restaurant-info-minimal">
          <div className="restaurant-address">{restaurant?.address}</div>
          <div
            className={`restaurant-capacity ${restaurant?.current_occupancy >= restaurant?.max_capacity ? "full" : ""}`}
          >
            {restaurant?.current_occupancy >= restaurant?.max_capacity ? (
              <span className="full-warning">Restaurant is currently FULL</span>
            ) : formData.party_size >
              restaurant?.max_capacity - restaurant?.current_occupancy ? (
              <span className="capacity-warning">
                Only {restaurant?.max_capacity - restaurant?.current_occupancy}{" "}
                seat
                {restaurant?.max_capacity - restaurant?.current_occupancy === 1
                  ? ""
                  : "s"}{" "}
                available — your party of {formData.party_size} won't fit
              </span>
            ) : (
              <span>
                Available:{" "}
                {restaurant?.max_capacity - restaurant?.current_occupancy} seats
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          {/* Party Size */}
          <div className="form-group">
            <label>Party Size</label>
            <div className="party-size-selector">
              <button
                type="button"
                className="size-btn"
                onClick={() => handlePartySizeChange(-1)}
                disabled={formData.party_size <= 1}
              >
                −
              </button>
              <span className="party-size-display">{formData.party_size}</span>
              <button
                type="button"
                className="size-btn"
                onClick={() => handlePartySizeChange(1)}
                disabled={formData.party_size >= 10}
              >
                +
              </button>
            </div>

            {feeAmount > 0 && (
              <div className="fee-badge">
                <span>Hold Fee: ₱{feeAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Hold Options */}
          <div className="form-group">
            <label>Hold Duration</label>
            <div className="hold-options-simple">
              <button
                type="button"
                className={`hold-option-btn ${formData.hold_type === "quick_10min" ? "active" : ""}`}
                onClick={() =>
                  setFormData({ ...formData, hold_type: "quick_10min" })
                }
              >
                <span className="option-title">Quick Hold</span>
                <span className="option-time">10 min</span>
                <span className="option-expiry">Expires at {expiryTime}</span>
              </button>
              <button
                type="button"
                className={`hold-option-btn ${formData.hold_type === "extended_20min" ? "active" : ""}`}
                onClick={() =>
                  setFormData({ ...formData, hold_type: "extended_20min" })
                }
              >
                <span className="option-title">Extended Hold</span>
                <span className="option-time">20 min</span>
                <span className="option-expiry">Expires at {expiryTime}</span>
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-hold-btn"
              disabled={
                loading ||
                restaurant?.current_occupancy >= restaurant?.max_capacity
              }
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Holding...
                </>
              ) : restaurant?.current_occupancy >= restaurant?.max_capacity ? (
                "Restaurant Full"
              ) : feeAmount > 0 ? (
                `Hold Spot • ₱${feeAmount.toFixed(2)}`
              ) : (
                "Hold Spot"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
