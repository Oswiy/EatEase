import React, { useState, useEffect, useRef, useCallback } from "react";
import "./SpotHoldManagement.css";
import { BASE_URL } from "../../config";
import { useToast } from "../../context/ToastContext";

// ─── Main Component ─────────────────────────────────────────────────────────────

const SpotHoldManagement = ({ restaurant }) => {
  // FIX 1 — Separate state for each tab so switching never clobbers the other
  const [activeHolds, setActiveHolds]           = useState([]);
  const [expiredHolds, setExpiredHolds]         = useState([]);
  const [todaysReservations, setTodaysReservations] = useState([]);

  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [capacityInfo, setCapacityInfo] = useState({
    current: restaurant?.current_occupancy || 0,
    max: restaurant?.max_capacity || 100,
  });
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feeSettings, setFeeSettings]   = useState({
    hold_fee: 0,
    min_party_for_fee: 1,
    fee_description: "",
  });

  const activeTabRef   = useRef(activeTab);
  activeTabRef.current = activeTab;

  // Tracks whether the current tab has completed its first fetch.
  const hasLoadedTab = useRef({});
  const { showToast } = useToast();

  // ── Auth helper — FIX 3: ALL fetches go through here ──────────────────────
  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${BASE_URL}/api${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }, []);

  // ── Per-tab fetch logic ────────────────────────────────────────────────────
  const fetchTabData = useCallback(
    async (tab) => {
      try {
        if (tab === "active") {
          const data = await fetchWithAuth("/my-restaurant/spot-holds");
          if (data.success) setActiveHolds(data.spot_holds || []);
        } else if (tab === "today") {
          const data = await fetchWithAuth("/my-restaurant/todays-reservations");
          if (data.success) setTodaysReservations(data.reservations || []);
        } else if (tab === "expired") {
          const data = await fetchWithAuth("/my-restaurant/spot-holds/expired");
          // FIX 1 — Write to expiredHolds, not activeHolds
          if (data.success) setExpiredHolds(data.expired_holds || []);
        }
      } catch (err) {
        console.error("fetchTabData error:", err);
      }
    },
    [fetchWithAuth],
  );

  // ── Primary fetch: spinner only on first visit ─────────────────────────────
  const fetchData = useCallback(
    async (tab, force = false) => {
      const isFirstLoad = !hasLoadedTab.current[tab];
      if (isFirstLoad || force) {
        setLoading(true);
        await fetchTabData(tab);
        hasLoadedTab.current[tab] = true;
        setLoading(false);
      } else {
        await fetchTabData(tab);
      }
    },
    [fetchTabData],
  );

  // ── Fee settings — FIX 3: uses fetchWithAuth ──────────────────────────────
  const fetchFeeSettings = useCallback(async () => {
    try {
      const data = await fetchWithAuth("/restaurant/fee-settings");
      if (data.success) {
        setFeeSettings({
          hold_fee: Number(data.hold_fee) || 0,
          min_party_for_fee: Number(data.min_party_for_fee) || 1,
          fee_description: data.fee_description || "",
        });
      }
    } catch (err) {
      console.error("Error fetching fee settings:", err);
    }
  }, [fetchWithAuth]);

  // FIX 3 — saveFeeSettings also through fetchWithAuth
  const saveFeeSettings = async () => {
    try {
      const data = await fetchWithAuth("/restaurant/update-fee", {
        method: "PUT",
        body: JSON.stringify(feeSettings),
      });
      if (data.success) {
        showToast("Fee settings saved!", "success", 3000);
        setShowFeeModal(false);
      } else {
        showToast("Failed to save: " + data.message, "error", 3000);
      }
    } catch (err) {
      console.error("Error saving fee:", err);
      showToast("Error saving fee settings", "error", 3000);
    }
  };

  // ── Sync capacity from parent prop ────────────────────────────────────────
  useEffect(() => {
    if (restaurant) {
      setCapacityInfo({
        current: restaurant.current_occupancy || 0,
        max: restaurant.max_capacity || 100,
      });
    }
  }, [restaurant]);

  // ── On tab change ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!restaurant) return;
    fetchData(activeTab);
  }, [activeTab, restaurant]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Single 30-second polling interval ─────────────────────────────────────
  useEffect(() => {
    if (!restaurant) return;
    fetchFeeSettings();
    const interval = setInterval(() => {
      fetchTabData(activeTabRef.current);
    }, 30000);
    return () => clearInterval(interval);
  }, [restaurant]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleAcceptHold = async (holdId) => {
    try {
      const data = await fetchWithAuth(
        `/my-restaurant/spot-holds/${holdId}/accept`,
        { method: "PUT" },
      );
      if (data.success) {
        showToast("Spot hold accepted! Reservation confirmed.", "success", 3000);
        if (data.restaurant_occupancy) {
          setCapacityInfo({
            current: data.restaurant_occupancy.current,
            max: data.restaurant_occupancy.max,
          });
        }
        // FIX 5 — Force refresh so hasLoadedTab doesn't serve stale data
        hasLoadedTab.current["active"] = false;
        await fetchData("active", true);
      } else {
        showToast(data.message || "Failed to accept hold", "error", 3000);
      }
    } catch (err) {
      console.error("Error accepting hold:", err);
      showToast("Error accepting spot hold.", "error", 3000);
    }
  };

  const handleRejectHold = async (holdId) => {
    try {
      const data = await fetchWithAuth(
        `/my-restaurant/spot-holds/${holdId}/reject`,
        { method: "PUT" },
      );
      if (data.success) {
        showToast("Spot hold rejected.", "info", 3000);
        hasLoadedTab.current["active"] = false;
        await fetchData("active", true);
      } else {
        showToast(data.message || "Failed to reject hold", "error", 3000);
      }
    } catch (err) {
      console.error("Error rejecting hold:", err);
      showToast("Error rejecting spot hold", "error", 3000);
    }
  };

  // FIX 4 — onRemoved callback: parent removes the item from expiredHolds state.
  //          ExpiredHoldsView never touches parent state directly.
  const handleExpiredRemoved = useCallback((holdId) => {
    setExpiredHolds((prev) => prev.filter((h) => h.id !== holdId));
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTimeRemaining = (minutes) => {
    if (minutes <= 0) return "Expired";
    if (minutes < 60) return `${minutes}m remaining`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m remaining`;
  };

  const getHoldTypeLabel = (type) => {
    switch (type) {
      case "quick_10min":     return "10-min Quick Hold";
      case "extended_20min":  return "20-min Extended Hold";
      default:                return type;
    }
  };

  const availableCapacity = capacityInfo.max - capacityInfo.current;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="spot-hold-management">
      <div className="management-header">
        <div>
          <h3>Spot Hold Management</h3>
        </div>

        <div className="capacity-status">
          <div className="spot-hold-capacity-bar">
            <div className="capacity-label">
              Capacity: {capacityInfo.current}/{capacityInfo.max}
            </div>
            <div className="capacity-progress">
              <div
                className="hold-capacity-fill"
                style={{
                  width: `${(capacityInfo.current / capacityInfo.max) * 100}%`,
                  backgroundColor:
                    capacityInfo.current >= capacityInfo.max * 0.9
                      ? "var(--red-status)"
                      : capacityInfo.current >= capacityInfo.max * 0.7
                        ? "var(--orange-status)"
                        : "var(--green-status)",
                }}
              />
            </div>
          </div>
          <div className="available-capacity">
            Available: {availableCapacity} seats
          </div>

          <button
            className="fee-settings-btn"
            onClick={() => setShowFeeModal(true)}
            title="Configure hold fees"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
            Fee Settings
          </button>
        </div>
      </div>

      <div className="management-tabs">
        <button
          className={`tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Holds
          {activeTab === "active" && activeHolds.length > 0 && (
            <span className="tab-badge">{activeHolds.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === "today" ? "active" : ""}`}
          onClick={() => setActiveTab("today")}
        >
          Today's Reservations
        </button>
        <button
          className={`tab ${activeTab === "expired" ? "active" : ""}`}
          onClick={() => setActiveTab("expired")}
        >
          Expired Holds
        </button>
      </div>

      <div className="management-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
          </div>
        ) : (
          <>
            {activeTab === "active" && (
              <ActiveHoldsView
                holds={activeHolds}
                onAccept={handleAcceptHold}
                onReject={handleRejectHold}
                formatTimeRemaining={formatTimeRemaining}
                getHoldTypeLabel={getHoldTypeLabel}
                availableCapacity={availableCapacity}
              />
            )}
            {activeTab === "today" && (
              <TodaysReservationsView reservations={todaysReservations} />
            )}
            {activeTab === "expired" && (
              <ExpiredHoldsView
                holds={expiredHolds}
                getHoldTypeLabel={getHoldTypeLabel}
                onRemoved={handleExpiredRemoved}
                fetchWithAuth={fetchWithAuth}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>

      {showFeeModal && (
        <div className="modal-overlay" onClick={() => setShowFeeModal(false)}>
          <div
            className="modal-content fee-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Spot Hold Fee Settings</h3>
              <button
                className="close-btn"
                onClick={() => setShowFeeModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="fee-current">
                <h4>
                  Current fee: ₱{Number(feeSettings.hold_fee || 0).toFixed(2)}
                </h4>
                {feeSettings.fee_description && (
                  <p className="fee-desc">{feeSettings.fee_description}</p>
                )}
              </div>
              <div className="form-group">
                <div className="currency-input">
                  <label className="currency-symbol">Amount (₱):</label>
                  <input
                    type="number"
                    value={
                      feeSettings.hold_fee === 0 || feeSettings.hold_fee === null
                        ? ""
                        : Number(feeSettings.hold_fee)
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setFeeSettings({
                        ...feeSettings,
                        hold_fee: value === "" ? 0 : parseFloat(value),
                      });
                    }}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <small>Set to 0 for free holds</small>
              </div>
              <div className="form-group">
                <label>Minimum party size for fee</label>
                <input
                  type="number"
                  value={feeSettings.min_party_for_fee || 1}
                  onChange={(e) =>
                    setFeeSettings({
                      ...feeSettings,
                      min_party_for_fee: parseInt(e.target.value) || 1,
                    })
                  }
                  min="1"
                  max="20"
                />
                <small>Fee applies only to parties of this size or larger</small>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowFeeModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveFeeSettings}>
                Save settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Active Holds ───────────────────────────────────────────────────────────────
// FIX 6 — Local countdown timer so time_remaining ticks every second,
//          not only on each 30-second poll.

const ActiveHoldsView = ({
  holds,
  onAccept,
  onReject,
  formatTimeRemaining,
  getHoldTypeLabel,
  availableCapacity,
}) => {
  // Mirror the server's time_remaining values into local state
  // and decrement them every second so the display is live.
  const [localRemaining, setLocalRemaining] = useState(() =>
    Object.fromEntries(holds.map((h) => [h.id, h.time_remaining ?? null])),
  );

  // Sync when the holds list changes (new poll arrived)
  useEffect(() => {
    setLocalRemaining(
      Object.fromEntries(holds.map((h) => [h.id, h.time_remaining ?? null])),
    );
  }, [holds]);

  // Tick every second for all pending/accepted holds
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalRemaining((prev) => {
        const next = { ...prev };
        for (const id in next) {
          if (next[id] !== null && next[id] > 0) next[id] -= 1 / 60; // minutes
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (holds.length === 0) {
    return (
      <div className="hold-empty-state">
        <p>No active spot holds</p>
        <p className="empty-subtitle">
          When diners request spot holds, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="holds-list">
      {holds.map((hold) => {
        const remaining = localRemaining[hold.id] ?? hold.time_remaining;
        const isExpired = remaining !== null && remaining <= 0;

        let timeRemainingText = "";
        if (hold.hold_status === "pending") {
          timeRemainingText = isExpired
            ? "Response deadline passed"
            : `Restaurant response in: ${formatTimeRemaining(Math.ceil(remaining))}`;
        } else if (hold.hold_status === "accepted") {
          timeRemainingText = isExpired
            ? "Hold expired"
            : `Diner arrival time: ${formatTimeRemaining(Math.ceil(remaining))}`;
        }

        const canAccept = !isExpired && hold.party_size <= availableCapacity;

        return (
          <div
            key={hold.id}
            className={`hold-card ${isExpired ? "expired" : ""}`}
          >
            <div className="hold-header">
              <div className="hold-user">
                <span className="user-name">
                  Username: {hold.user?.name || "Customer"}
                </span>
                <span className="user-email">User Email: {hold.user?.email}</span>
              </div>
              <div className="hold-meta">
                <span className="party-size">People: {hold.party_size}</span>
                <span className="hold-type">
                  Type: {getHoldTypeLabel(hold.hold_type)}
                </span>
                <span className="confirmation-code">
                  Code: {hold.confirmation_code}
                </span>
                {hold.hold_fee > 0 && (
                  <span className="fee-badge">
                    Fee: ₱{Number(hold.hold_fee || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="hold-details">
              <div className="time-info">
                <div className="time-remaining">
                  <span className="time-label">Status:</span>
                  <span className={`time-value ${isExpired ? "expired" : ""}`}>
                    {hold.hold_status === "pending"
                      ? "Waiting for acceptance"
                      : "Accepted — timer running"}
                  </span>
                </div>
                <div className="time-details">
                  {timeRemainingText && (
                    <div className="time-text">{timeRemainingText}</div>
                  )}
                  {hold.hold_status === "pending" ? (
                    <div className="expires-at">
                      Auto-cancels if not accepted by:{" "}
                      {new Date(hold.original_expires_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ) : hold.accepted_at ? (
                    <div className="accepted-at">
                      Accepted at:{" "}
                      {new Date(hold.accepted_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="hold-actions">
              {hold.hold_status === "pending" ? (
                !isExpired ? (
                  <>
                    <button
                      className="btn-accept"
                      onClick={() => onAccept(hold.id)}
                      disabled={!canAccept}
                      title={!canAccept ? "Not enough capacity" : "Accept this spot hold"}
                    >
                      Accept hold
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => onReject(hold.id)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="expired-label">Reservation expired</span>
                )
              ) : isExpired ? (
                <span className="expired-label">Hold expired</span>
              ) : (
                <span className="accepted-label">Accepted</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Today's Reservations ───────────────────────────────────────────────────────

const TodaysReservationsView = ({ reservations }) => {
  if (reservations.length === 0) {
    return (
      <div className="hold-empty-state">
        <p>No confirmed reservations for today</p>
      </div>
    );
  }

  return (
    <div className="reservations-list">
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Customer</th>
            <th>Party size</th>
            <th>Contact</th>
            <th>Confirmation code</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{res.reservation_time}</td>
              <td>{res.user?.name || "Customer"}</td>
              <td>{res.party_size}</td>
              <td>
                <div>{res.user?.email}</div>
                {res.user?.phone && <div>{res.user.phone}</div>}
              </td>
              <td>
                <code>{res.confirmation_code}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Expired Holds ──────────────────────────────────────────────────────────────
// FIX 4 — Receives fetchWithAuth and onRemoved callback.
//          Never touches parent state directly.

const ExpiredHoldsView = ({
  holds,
  getHoldTypeLabel,
  onRemoved,
  fetchWithAuth,
  showToast,
}) => {
  if (holds.length === 0) {
    return (
      <div className="hold-empty-state">
        <p>No expired holds</p>
      </div>
    );
  }

  const handleRemove = async (holdId) => {
    try {
      const data = await fetchWithAuth(
        `/my-restaurant/expired-holds/${holdId}/hide`,
        { method: "DELETE" },
      );
      if (data.success) {
        onRemoved(holdId); // FIX 4 — parent updates its own state
        showToast("Hold removed from view", "success", 3000);
      } else {
        showToast("Failed to hide hold: " + data.message, "error", 3000);
      }
    } catch {
      showToast("Error hiding hold", "error", 3000);
    }
  };

  const formatExpiryDate = (hold) => {
    // FIX — explicit priority: expires_at for accepted holds,
    //        original_expires_at for pending/expired holds, created_at as last resort.
    const dateString =
      hold.hold_status === "accepted"
        ? hold.expires_at
        : (hold.original_expires_at || hold.created_at);

    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date not available";
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Date not available";
    }
  };

  return (
    <div className="expired-holds">
      {holds.map((hold) => (
        <div key={hold.id} className="expired-hold-card">
          <button
            className="remove-expired-btn"
            onClick={() => handleRemove(hold.id)}
            title="Remove from view"
          >
            ×
          </button>
          <div className="expired-hold-header">
            <span className="customer-name">
              {hold.user?.name || "Customer"}
            </span>
            <span className="hold-type">{getHoldTypeLabel(hold.hold_type)}</span>
            <span className="party-size">{hold.party_size}p</span>
          </div>
          <div className="expired-hold-details">
            <div>Expired: {formatExpiryDate(hold)}</div>
            <div>Code: {hold.confirmation_code}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpotHoldManagement;