import React, { useState, useEffect, useRef, useCallback } from "react";
import "./SpotHoldManagement.css";
import { BASE_URL } from "../../config";

// ─── Main Component ────────────────────────────────────────────────────────────
const SpotHoldManagement = ({ restaurant }) => {
  const [activeHolds, setActiveHolds] = useState([]);
  const [todaysReservations, setTodaysReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [capacityInfo, setCapacityInfo] = useState({
    current: restaurant?.current_occupancy || 0,
    max: restaurant?.max_capacity || 100,
  });
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feeSettings, setFeeSettings] = useState({
    hold_fee: 0,
    min_party_for_fee: 1,
    fee_description: "",
  });

  // useRef keeps the latest activeTab value accessible inside the interval
  // callback without needing to re-create the interval on every tab change.
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // Tracks whether the current tab has completed its first fetch yet.
  // Stored in a ref so it doesn't trigger re-renders.
  const hasLoadedTab = useRef({});

  // ── Auth helper ───────────────────────────────────────────────────────────
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

  // ── Per-tab fetch logic ───────────────────────────────────────────────────
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
          if (data.success) setActiveHolds(data.expired_holds || []);
        }
      } catch (err) {
        console.error("fetchTabData error:", err);
      }
    },
    [fetchWithAuth]
  );

  // ── Primary fetch: shows spinner only on a tab's first visit ─────────────
  const fetchData = useCallback(
    async (tab, force = false) => {
      const isFirstLoad = !hasLoadedTab.current[tab];

      if (isFirstLoad || force) {
        setLoading(true);
        await fetchTabData(tab);
        hasLoadedTab.current[tab] = true;
        setLoading(false);
      } else {
        // Silent background update — no loading state touched
        await fetchTabData(tab);
      }
    },
    [fetchTabData]
  );

  // ── Fee settings ──────────────────────────────────────────────────────────
  const fetchFeeSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/fee-settings`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await response.json();
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
  }, []);

  const saveFeeSettings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/update-fee`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(feeSettings),
      });
      const data = await response.json();
      if (data.success) {
        alert("Fee settings saved!");
        setShowFeeModal(false);
      } else {
        alert("Failed to save: " + data.message);
      }
    } catch (err) {
      console.error("Error saving fee:", err);
      alert("Error saving fee settings");
    }
  };

  // ── Sync capacity from parent prop ───────────────────────────────────────
  useEffect(() => {
    if (restaurant) {
      setCapacityInfo({
        current: restaurant.current_occupancy || 0,
        max: restaurant.max_capacity || 100,
      });
    }
  }, [restaurant]);

  // ── On tab change: fetch for that tab (spinner on first visit only) ───────
  useEffect(() => {
    if (!restaurant) return;
    fetchData(activeTab);
  }, [activeTab, restaurant]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Single interval created once — reads activeTabRef so it's never stale ─
  useEffect(() => {
    if (!restaurant) return;
    fetchFeeSettings();

    const interval = setInterval(() => {
      // Always silent — hasLoadedTab will be true for any tab already visited
      fetchTabData(activeTabRef.current);
    }, 30000);

    return () => clearInterval(interval);
  }, [restaurant]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Action handlers (silent refresh after API call) ───────────────────────
  const handleAcceptHold = async (holdId) => {
    if (!window.confirm("Accept this spot hold? This will confirm the reservation.")) return;
    try {
      const data = await fetchWithAuth(`/my-restaurant/spot-holds/${holdId}/accept`, {
        method: "PUT",
      });
      if (data.success) {
        alert("Spot hold accepted! Reservation confirmed.");
        if (data.restaurant_occupancy) {
          setCapacityInfo({
            current: data.restaurant_occupancy.current,
            max: data.restaurant_occupancy.max,
          });
        }
        await fetchTabData(activeTabRef.current); // silent
      } else {
        alert(`❌ ${data.message || "Failed to accept hold"}`);
      }
    } catch (err) {
      console.error("Error accepting hold:", err);
      alert("Error accepting spot hold.");
    }
  };

  const handleRejectHold = async (holdId) => {
    if (!window.confirm("Reject this spot hold?")) return;
    try {
      const data = await fetchWithAuth(`/my-restaurant/spot-holds/${holdId}/reject`, {
        method: "PUT",
      });
      if (data.success) {
        alert("Spot hold rejected.");
        await fetchTabData(activeTabRef.current); // silent
      } else {
        alert(data.message || "Failed to reject hold");
      }
    } catch (err) {
      console.error("Error rejecting hold:", err);
      alert("Error rejecting spot hold");
    }
  };

  const handleRemoveExpired = () => {
    if (activeTab === "expired") fetchTabData("expired");
  };

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
                holds={activeHolds}
                getHoldTypeLabel={getHoldTypeLabel}
                onRemoveExpired={handleRemoveExpired}
                setActiveHolds={setActiveHolds}
              />
            )}
          </>
        )}
      </div>

      {showFeeModal && (
        <div className="modal-overlay" onClick={() => setShowFeeModal(false)}>
          <div className="modal-content fee-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Spot Hold Fee Settings</h3>
              <button className="close-btn" onClick={() => setShowFeeModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="fee-current">
                <h4>Current Fee: ₱{Number(feeSettings.hold_fee || 0).toFixed(2)}</h4>
                {feeSettings.fee_description && (
                  <p className="fee-desc">{feeSettings.fee_description}</p>
                )}
              </div>
              <div className="form-group">
                <div className="currency-input">
                  <label className="currency-symbol">Php Amount:</label>
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
                <label>Minimum Party Size for Fee</label>
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
              <button className="cancel-btn" onClick={() => setShowFeeModal(false)}>Cancel</button>
              <button className="save-btn" onClick={saveFeeSettings}>Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Active Holds ───────────────────────────────────────────────────────────────
const ActiveHoldsView = ({
  holds,
  onAccept,
  onReject,
  formatTimeRemaining,
  getHoldTypeLabel,
  availableCapacity,
}) => {
  if (holds.length === 0) {
    return (
      <div className="hold-empty-state">
        <p>No active spot holds</p>
        <p className="empty-subtitle">When diners request spot holds, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="holds-list">
      {holds.map((hold) => {
        let isExpired = false;
        let timeRemainingText = "";

        if (hold.hold_status === "pending") {
          isExpired = hold.time_remaining <= 0;
          timeRemainingText = isExpired
            ? "Response deadline passed"
            : `Restaurant response in: ${formatTimeRemaining(hold.time_remaining)}`;
        } else if (hold.hold_status === "accepted") {
          isExpired = hold.time_remaining <= 0;
          timeRemainingText = isExpired
            ? "Hold expired"
            : `Diner arrival time: ${formatTimeRemaining(hold.time_remaining)}`;
        }

        const canAccept = !isExpired && hold.party_size <= availableCapacity;

        return (
          <div key={hold.id} className={`hold-card ${isExpired ? "expired" : ""}`}>
            <div className="hold-header">
              <div className="hold-user">
                <span className="user-name">Username: {hold.user?.name || "Customer"}</span>
                <span className="user-email">User Email: {hold.user?.email}</span>
              </div>
              <div className="hold-meta">
                <span className="party-size">People: {hold.party_size}</span>
                <span className="hold-type">Type: {getHoldTypeLabel(hold.hold_type)}</span>
                <span className="confirmation-code">Code: {hold.confirmation_code}</span>
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
                      : "Accepted - Timer running"}
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
                      Accept Hold
                    </button>
                    <button className="btn-reject" onClick={() => onReject(hold.id)}>
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="expired-label">Reservation Expired</span>
                )
              ) : isExpired ? (
                <span className="expired-label">Hold Expired</span>
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
            <th>Party Size</th>
            <th>Contact</th>
            <th>Confirmation Code</th>
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
const ExpiredHoldsView = ({ holds, getHoldTypeLabel, onRemoveExpired, setActiveHolds }) => {
  if (holds.length === 0) {
    return (
      <div className="hold-empty-state">
        <p>No expired holds</p>
      </div>
    );
  }

  const handleRemove = async (holdId) => {
    if (!window.confirm("Remove this expired hold from view?")) return;
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${BASE_URL}/api/my-restaurant/expired-holds/${holdId}/hide`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }
      );
      const data = await response.json();
      if (data.success) {
        setActiveHolds((prev) => prev.filter((h) => h.id !== holdId));
        if (onRemoveExpired) onRemoveExpired();
        alert("Hold hidden successfully");
      } else {
        alert("Failed to hide hold: " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error hiding hold");
    }
  };

  const formatExpiryDate = (hold) => {
    const dateString = hold.expires_at || hold.original_expires_at || hold.created_at;
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime()) || date.getTime() === 0) return "Date not available";
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
            <span className="customer-name">{hold.user?.name || "Customer"}</span>
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