// Add these imports if not already
import React, { useState, useEffect } from "react";
import "./ReservationModal.css";
import API_CONFIG from "../../config";

const ReservationModal = ({
  restaurant,
  onClose,
  onSuccess,
  notificationData = null,
}) => {
  const [formData, setFormData] = useState({
    party_size: 1,
    hold_type: "quick_10min",
    special_requests: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // ✅ ADD FEE STATE
  const [holdFee, setHoldFee] = useState(0);
  const [minPartyForFee, setMinPartyForFee] = useState(1);
  const [feeDescription, setFeeDescription] = useState("");

  // Calculate expiry times when hold_type changes
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

  // ✅ FETCH FEE SETTINGS WHEN COMPONENT MOUNTS
  useEffect(() => {
    const fetchFeeSettings = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/restaurants/${restaurant.id}/fee-settings`,
        );
        const data = await response.json();
        if (data.success) {
          setHoldFee(Number(data.hold_fee) || 0); // Ensure it's a number
          setMinPartyForFee(Number(data.min_party_for_fee) || 1);
          setFeeDescription(data.fee_description || "");
        }
      } catch (error) {
        console.error("Error fetching fee settings:", error);
        // Set defaults
        setHoldFee(0);
        setMinPartyForFee(1);
        setFeeDescription("");
      }
    };

    fetchFeeSettings();
  }, [restaurant.id]);

  // Pre-fill from notification if available
  useEffect(() => {
    if (notificationData) {
      setFormData((prev) => ({
        ...prev,
        party_size: notificationData.preferred_party_size || 1,
      }));
    }
  }, [notificationData]);

  // ✅ CALCULATE FEE
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

    // ✅ ADD FEE CONFIRMATION
    if (feeAmount > 0) {
      const confirmFee = window.confirm(
        `A hold fee of ₱${Number(feeAmount || 0).toFixed(2)} will apply for your party of ${formData.party_size}.\n\n` +
          "This fee guarantees your spot and will be charged when the hold is accepted.\n\n" +
          "Continue with reservation?",
      );
      if (!confirmFee) return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      // console.log("DEBUG: Making hold-spot request with:", {
      //   restaurant_id: restaurant.id,
      //   party_size: formData.party_size,
      //   hold_type: formData.hold_type,
      //   token_exists: !!token,
      // });

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
            special_requests: formData.special_requests,
            hold_fee: feeAmount,
          }),
        },
      );

      // console.log("DEBUG: Response status:", response.status);

      const data = await response.json();
      // console.log("DEBUG: Response data:", data);

      if (data.success) {
        setConfirmation(data);
        if (onSuccess) onSuccess(data.hold);
      } else {
        setError(data.message || data.error || "Failed to create spot hold");
      }
    } catch (error) {
      console.error("Error creating spot hold:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handlePartySizeChange = (change) => {
    const newSize = formData.party_size + change;
    if (newSize >= 1 && newSize <= 10) {
      setFormData((prev) => ({ ...prev, party_size: newSize }));
      setError("");
    }
  };

  // If we have confirmation, show confirmation screen
  if (confirmation) {
    return (
      <div className="reservation-modal-overlay">
        <div className="reservation-modal">
          <div className="modal-header">
            <h2>Spot Reserved!</h2>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="confirmation-content">
            <div className="confirmation-details">
              <h3>Your spot is on hold!</h3>

              <div className="detail-item">
                <span className="label">Restaurant Response Deadline:</span>
                <span className="value highlight">
                  {new Date(
                    confirmation.restaurant_response_deadline,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Hold Duration (after acceptance):</span>
                <span className="value">{confirmation.hold_duration}</span>
              </div>

              {/* ✅ SHOW FEE IN CONFIRMATION */}
              {confirmation.hold_fee > 0 && (
                <div className="detail-item fee-highlight">
                  <span className="label">Hold Fee:</span>
                  <span className="value fee-amount">
                    ₱{Number(confirmation.hold_fee || 0).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="detail-item">
                <span className="label">Expires at:</span>
                <span className="value highlight">
                  {new Date(confirmation.hold.expires_at).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Confirmation:</span>
                <span className="value code">
                  {confirmation.confirmation_code}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Party Size:</span>
                <span className="value">
                  {confirmation.hold.party_size} people
                </span>
              </div>
            </div>

            <div className="instructions">
              <h4>What to do next:</h4>
              <ul>
                <li>Go to the restaurant within the hold duration</li>
                <li>Show your confirmation code at the entrance</li>
                <li>The restaurant will confirm your hold</li>
              </ul>

              {/*ADD FEE NOTE */}
              {confirmation.hold_fee > 0 && (
                <div className="note important">
                  <strong>Fee Information:</strong> hold fee of ₱
                  {Number(confirmation.hold_fee || 0).toFixed(2)}
                  will be charged when your hold is accepted by the restaurant.
                </div>
              )}

              <div className="note important">
                <strong>Important:</strong> Your spot will be released
                automatically after{" "}
                {confirmation.hold.hold_type === "quick_10min" ? "10" : "20"}{" "}
                minutes if you don't arrive.
              </div>
            </div>

            <div className="confirmation-actions">
              <button className="done-btn" onClick={onClose}>
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main booking form
  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <div className="modal-header">
          <h2>Reserve at {restaurant?.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {restaurant && (
          <div className="restaurant-info">
            <p className="restaurant-name"> {restaurant.name}</p>
            <p className="restaurant-address">{restaurant.address}</p>
            <div className="restaurant-status">
              <span className="crowd-level">
                Current crowd: {restaurant.crowd_level || "Moderate"}
              </span>
              <span className="capacity">
                Max: {restaurant.max_capacity} people
              </span>
            </div>
          </div>
        )}

        {notificationData && (
          <div className="notification-context">
            <div className="notification-badge">Responding to Alert</div>
            <p>
              {notificationData.preferred_crowd_level === "low"
                ? "Low crowd"
                : notificationData.preferred_crowd_level === "moderate"
                  ? "Moderate crowd"
                  : "Ideal crowd"}{" "}
              detected!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group">
            <label>How many people?</label>
            <div className="party-size-selector">
              <button
                type="button"
                className="size-btn"
                onClick={() => handlePartySizeChange(-1)}
                disabled={formData.party_size <= 1}
              >
                −
              </button>
              <span className="party-size-display">
                {formData.party_size}{" "}
                {formData.party_size === 1 ? "person" : "people"}
              </span>
              <button
                type="button"
                className="size-btn"
                onClick={() => handlePartySizeChange(1)}
                disabled={formData.party_size >= 10}
              >
                +
              </button>
            </div>

            {/* ✅ SHOW FEE INFORMATION */}
            {feeAmount > 0 && (
              <div className="fee-notice-small">
                <span className="fee-label">Hold fee applies:</span>
                <span className="fee-amount">
                  ₱{Number(feeAmount || 0).toFixed(2)}
                </span>
                {formData.party_size < minPartyForFee && (
                  <span className="fee-note">
                    (Free for parties under {minPartyForFee})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Choose hold duration:</label>
            <div className="hold-options">
              <label className="hold-option">
                <input
                  type="radio"
                  name="hold_type"
                  value="quick_10min"
                  checked={formData.hold_type === "quick_10min"}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <div className="option-header">
                    <span className="option-title">Quick Hold (10 min)</span>
                    <span className="option-badge">Recommended</span>
                  </div>
                  <div className="option-details">
                    <span className="option-text">I'm ready to go now</span>
                  </div>
                  <div className="option-expiry">
                    Expires at: {expiryTime} (10 min from now)
                  </div>
                </div>
              </label>

              <label className="hold-option">
                <input
                  type="radio"
                  name="hold_type"
                  value="extended_20min"
                  checked={formData.hold_type === "extended_20min"}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <div className="option-header">
                    <span className="option-title">Extended Hold (20 min)</span>
                  </div>
                  <div className="option-details">
                    <span className="option-text">Need a bit more time</span>
                  </div>
                  <div className="option-expiry">
                    Expires at: {expiryTime} (20 min from now)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ✅ SHOW FEE SUMMARY */}
          {feeAmount > 0 && (
            <div className="fee-summary">
              <div className="fee-summary-header">
                <span>Hold Fee Summary</span>
                <span className="fee-total">
                  ₱{Number(feeAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="fee-breakdown">
                <div className="breakdown-item">
                  <span>Party of {formData.party_size}</span>
                  <span>₱{Number(holdFee || 0).toFixed(2)}</span>
                </div>
                {feeDescription && (
                  <div className="fee-description">{feeDescription}</div>
                )}
                <div className="fee-disclaimer">
                  This fee will be charged when your hold is accepted by the
                  restaurant.
                </div>
              </div>
            </div>
          )}

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
            <button type="submit" className="modal-hold-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : feeAmount > 0 ? (
                `Confirm & Pay ₱${Number(feeAmount || 0).toFixed(2)}`
              ) : (
                "Confirm Free Hold"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
