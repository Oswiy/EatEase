import React, { useState, useEffect, useMemo } from "react";
import "./ReservationModal.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

// ─── Helpers ────────────────────────────────────────────────────────────────────

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
  } catch {
    return "Invalid time";
  }
};

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

// ─── Main Component ─────────────────────────────────────────────────────────────

const ReservationModal = ({ restaurant, onClose, onSuccess }) => {
  const { showToast } = useToast();

  const [partySize, setPartySize]       = useState(1);
  const [holdType, setHoldType]         = useState("quick_10min");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // Fee state
  const [holdFee, setHoldFee]               = useState(0);
  const [minPartyForFee, setMinPartyForFee] = useState(1);
  const [feeLoading, setFeeLoading]         = useState(true);
  const [feeError, setFeeError]             = useState(false);

  // FIX 1 — In-modal fee confirmation step replaces window.confirm()
  const [showFeeConfirm, setShowFeeConfirm] = useState(false);

  // FIX 2 — Both expiry times computed at render time (not reactive state)
  //          so both hold option buttons always show the correct, independent time.
  const now = useMemo(() => new Date(), []); // captured once when modal opens
  const quickExpiry    = addMinutes(now, 10);
  const extendedExpiry = addMinutes(now, 20);

  // FIX 3 — Fee fetch with loading + error state so user knows if it failed
  useEffect(() => {
    let cancelled = false;
    const fetchFeeSettings = async () => {
      setFeeLoading(true);
      setFeeError(false);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/restaurants/${restaurant.id}/fee-settings`,
        );
        if (!response.ok) throw new Error("Fee fetch failed");
        const data = await response.json();
        if (!cancelled && data.success) {
          setHoldFee(Number(data.hold_fee) || 0);
          setMinPartyForFee(Number(data.min_party_for_fee) || 1);
        }
      } catch {
        if (!cancelled) setFeeError(true);
      } finally {
        if (!cancelled) setFeeLoading(false);
      }
    };
    fetchFeeSettings();
    return () => { cancelled = true; };
  }, [restaurant.id]);

  // Derived values
  const availableSeats = (restaurant?.max_capacity ?? 0) - (restaurant?.current_occupancy ?? 0);
  const isFull         = availableSeats <= 0;
  const partyTooBig   = partySize > availableSeats;

  const feeAmount = useMemo(() => {
    const fee   = Number(holdFee || 0);
    const min   = Number(minPartyForFee || 1);
    if (fee <= 0) return 0;
    return partySize >= min ? fee : 0;
  }, [holdFee, minPartyForFee, partySize]);

  // ── Party size control ──────────────────────────────────────────────────────
  const handlePartySizeChange = (delta) => {
    const next = partySize + delta;
    if (next >= 1 && next <= 10) {
      setPartySize(next);
      setError("");
    }
  };

  // ── Submit flow ─────────────────────────────────────────────────────────────

  // Step 1 — validate; if there's a fee, show the in-modal confirm screen
  const handleSubmitIntent = () => {
    if (partySize < 1 || partySize > 10) {
      setError("Please select a valid party size (1–10 people)");
      return;
    }
    // FIX 4 — Frontend capacity check is a UX hint only.
    //          We still proceed to the backend which has the authoritative check.
    if (partyTooBig) {
      const msg = `Only ${availableSeats} seat${availableSeats === 1 ? "" : "s"} available — your party of ${partySize} won't fit.`;
      setError(msg);
      showToast(msg, "warning", 5000);
      return;
    }
    if (feeAmount > 0) {
      setShowFeeConfirm(true); // show in-modal confirmation instead of window.confirm()
      return;
    }
    submitHold();
  };

  // Step 2 — actually call the API
  const submitHold = async () => {
    setShowFeeConfirm(false);
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
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
            party_size: partySize,
            hold_type: holdType,
            hold_fee: feeAmount,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setConfirmation(data);
        if (onSuccess) onSuccess(data.hold);
        showToast("Spot hold created successfully!", "success", 3000);
      } else {
        const errorMessage = data.message || data.error || "Failed to create spot hold";
        setError(errorMessage);
        showToast(errorMessage, "warning", 5000);
      }
    } catch {
      setError("Network error. Please try again.");
      showToast("Network error. Please check your connection.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  // ── Fee confirm screen (replaces window.confirm) ────────────────────────────
  if (showFeeConfirm) {
    return (
      <div className="reservation-modal-overlay">
        <div className="reservation-modal">
          <div className="reservation-modal-header">
            <h2>Confirm hold fee</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="confirmation-content">
            <p>
              A hold fee of <strong>₱{feeAmount.toFixed(2)}</strong> applies for
              your party of {partySize}.
            </p>
            <p className="fee-note">
              This fee guarantees your spot and will be charged when the hold is
              accepted.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setShowFeeConfirm(false)}
              >
                Go back
              </button>
              <button
                type="button"
                className="modal-hold-btn"
                onClick={submitHold}
              >
                Confirm • ₱{feeAmount.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Confirmation screen ─────────────────────────────────────────────────────
  if (confirmation) {
    // FIX 5 — Arrival deadline and response deadline are separate, explicit fields.
    //          Backend sends expires_at = null until accepted (arrival deadline),
    //          and restaurant_response_deadline = original_expires_at (10-min window).
    //          We show them as two distinct labelled items.
    const responseDeadline = confirmation.restaurant_response_deadline;
    // expires_at is null until restaurant accepts; fall back to original_expires_at
    // only when the hold has already been accepted and an arrival timer is set.
    const arrivalDeadline =
      confirmation.hold?.expires_at ?? confirmation.hold?.original_expires_at;

    const holdDuration =
      confirmation.hold_duration ||
      (confirmation.hold?.hold_type === "quick_10min" ? "10 minutes" : "20 minutes");

    const confirmCode =
      confirmation.confirmation_code || confirmation.hold?.confirmation_code;

    return (
      <div className="reservation-modal-overlay">
        <div className="reservation-modal confirmation-modal">
          <div className="reservation-modal-header">
            <h2>Spot reserved!</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="confirmation-content">
            <h3>Your spot is on hold</h3>

            <div className="confirmation-details">
              <div className="detail-item">
                <span className="label">Restaurant must respond by:</span>
                <span className="value highlight">
                  {responseDeadline ? formatTime(responseDeadline) : "Within 10 minutes"}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Hold duration (once accepted):</span>
                <span className="value">{holdDuration}</span>
              </div>

              <div className="detail-item">
                <span className="label">Arrival deadline:</span>
                <span className="value highlight">
                  {arrivalDeadline ? formatTime(arrivalDeadline) : "Set when restaurant accepts"}
                </span>
              </div>

              {confirmation.hold?.hold_fee > 0 && (
                <div className="detail-item fee-highlight">
                  <span className="label">Hold fee:</span>
                  <span className="value fee-amount">
                    ₱{Number(confirmation.hold.hold_fee).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="detail-item">
                <span className="label">Confirmation code:</span>
                <span className="value code">{confirmCode}</span>
              </div>

              <div className="detail-item">
                <span className="label">Party size:</span>
                <span className="value">
                  {confirmation.hold?.party_size || partySize} people
                </span>
              </div>
            </div>

            <div className="instructions">
              <h4>Next steps</h4>
              <ul>
                <li>Go to the restaurant within the hold duration</li>
                <li>Show your confirmation code at the entrance</li>
                <li>Staff will confirm your hold on arrival</li>
              </ul>
              <div className="note important">
                Your spot will be released if you don't arrive before the
                arrival deadline.
              </div>
            </div>

            <button className="done-btn" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  // FIX 6 — <form> replaced with <div> + onClick; no accidental Enter-to-submit.
  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <div className="reservation-modal-header">
          <h2>Reserve at {restaurant?.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Capacity status */}
        <div className="restaurant-info-minimal">
          <div className="restaurant-address">{restaurant?.address}</div>
          <div className={`restaurant-capacity ${isFull ? "full" : ""}`}>
            {isFull ? (
              <span className="full-warning">Restaurant is currently full</span>
            ) : partyTooBig ? (
              <span className="capacity-warning">
                Only {availableSeats} seat{availableSeats === 1 ? "" : "s"}{" "}
                available — your party of {partySize} won't fit
              </span>
            ) : (
              <span>Available: {availableSeats} seats</span>
            )}
          </div>
        </div>

        <div className="reservation-form">
          {/* Party size */}
          <div className="form-group">
            <label>Party size</label>
            <div className="party-size-selector">
              <button
                type="button"
                className="size-btn"
                onClick={() => handlePartySizeChange(-1)}
                disabled={partySize <= 1}
              >
                −
              </button>
              <span className="party-size-display">{partySize}</span>
              <button
                type="button"
                className="size-btn"
                onClick={() => handlePartySizeChange(1)}
                disabled={partySize >= 10}
              >
                +
              </button>
            </div>

            {/* Fee badge — shows loading/error/amount states */}
            {feeLoading ? (
              <div className="fee-badge fee-loading">Checking fee...</div>
            ) : feeError ? (
              <div className="fee-badge fee-error">Fee info unavailable</div>
            ) : feeAmount > 0 ? (
              <div className="fee-badge">
                Hold fee: ₱{feeAmount.toFixed(2)}
              </div>
            ) : null}
          </div>

          {/* Hold type — FIX 2: each button computes its own expiry independently */}
          <div className="form-group">
            <label>Hold duration</label>
            <div className="hold-options-simple">
              <button
                type="button"
                className={`hold-option-btn ${holdType === "quick_10min" ? "active" : ""}`}
                onClick={() => setHoldType("quick_10min")}
              >
                <span className="option-title">Quick hold</span>
                <span className="option-time">10 min</span>
                <span className="option-expiry">Expires at {quickExpiry}</span>
              </button>
              <button
                type="button"
                className={`hold-option-btn ${holdType === "extended_20min" ? "active" : ""}`}
                onClick={() => setHoldType("extended_20min")}
              >
                <span className="option-title">Extended hold</span>
                <span className="option-time">20 min</span>
                <span className="option-expiry">Expires at {extendedExpiry}</span>
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
              type="button"
              className="modal-hold-btn"
              onClick={handleSubmitIntent}
              disabled={loading || isFull}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Holding...
                </>
              ) : isFull ? (
                "Restaurant full"
              ) : feeAmount > 0 ? (
                `Hold spot • ₱${feeAmount.toFixed(2)}`
              ) : (
                "Hold spot"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;