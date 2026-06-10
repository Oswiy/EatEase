import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ReservationsPage.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

// ── Inline confirm row ─────────────────────────────────────────────────────────
const ConfirmRow = ({ message, confirmLabel = "Confirm", onConfirm, onCancel }) => (
  <div className="rp-confirm-row">
    <span className="rp-confirm-msg">{message}</span>
    <div className="rp-confirm-actions">
      <button className="rp-confirm-cancel" onClick={onCancel}>
        Keep
      </button>
      <button className="rp-confirm-ok" onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const ReservationsPage = ({ user, onBack }) => {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Track which reservation has a pending inline confirm
  // value: { id, action } where action = "cancel" | "remove"
  const [confirming, setConfirming] = useState(null);
  // Track which id is mid-request so we can show a spinner
  const [processingId, setProcessingId] = useState(null);

  // Silent-polling: only show spinner on first load
  const hasLoaded = useRef(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReservations = useCallback(async (showSpinner = false) => {
    const token = localStorage.getItem("auth_token");
    if (!token) { setLoading(false); return; }

    if (showSpinner) setLoading(true);

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/reservations`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        const processed = (data.reservations?.data || data.reservations || []).map(
          processExpiry
        );
        setReservations(processed);
      }
    } catch (err) {
      console.error(err);
      if (showSpinner) showToast("Failed to load reservations", "error", 3000);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchReservations(true); // initial: show spinner
    hasLoaded.current = true;

    // Subsequent polls are always silent
    const interval = setInterval(() => fetchReservations(false), 30000);
    return () => clearInterval(interval);
  }, [fetchReservations]);

  // ── Expiry processing ──────────────────────────────────────────────────────
  const processExpiry = (res) => {
    let isExpired = false;
    const now = new Date();

    if (res.status === "pending_hold") {
      const expiry = res.original_expires_at || res.expires_at;
      if (expiry) {
        isExpired = new Date(expiry) < now;
      } else if (res.created_at) {
        const mins = (now - new Date(res.created_at)) / 60000;
        isExpired = mins > 10 && res.hold_status === "pending";
      }
    } else if (res.status === "confirmed" && res.hold_status === "accepted") {
      if (res.expires_at) isExpired = new Date(res.expires_at) < now;
    }

    return {
      ...res,
      is_expired: isExpired,
      status: isExpired ? "expired" : res.status,
    };
  };

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const requestCancel = (e, id) => {
    e.stopPropagation();
    setConfirming({ id, action: "cancel" });
  };

  const confirmCancel = async (id) => {
    setConfirming(null);
    setProcessingId(id);

    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        showToast("Reservation cancelled", "success", 3000);
        await fetchReservations(false); // silent refresh
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to cancel", "error", 3000);
      }
    } catch (err) {
      console.error(err);
      showToast("Error cancelling reservation", "error", 3000);
    } finally {
      setProcessingId(null);
    }
  };

  // ── Remove (optimistic) ────────────────────────────────────────────────────
  const requestRemove = (e, id) => {
    e.stopPropagation();
    setConfirming({ id, action: "remove" });
  };

  const confirmRemove = async (id) => {
    setConfirming(null);
    setProcessingId(id);

    // Optimistic remove
    const snapshot = reservations;
    setReservations((prev) => prev.filter((r) => r.id !== id));

    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/reservations/${id}/remove`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Reservation removed", "success", 3000);
      } else {
        showToast(data.message || "Failed to remove", "error", 3000);
        setReservations(snapshot); // rollback
      }
    } catch (err) {
      console.error(err);
      showToast("Error removing reservation", "error", 3000);
      setReservations(snapshot);
    } finally {
      setProcessingId(null);
    }
  };

  const cancelConfirm = (e) => {
    if (e) e.stopPropagation();
    setConfirming(null);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDateTime = (date, time) => {
    try {
      const iso = date?.includes("T") ? date : `${date}T${time || "00:00"}`;
      const d = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Asia/Manila" }));
      if (isNaN(d.getTime())) return "Scheduled";
      if (time && time !== "00:00:00" && time !== "00:00") {
        const [h, m] = time.split(":").map(Number);
        d.setHours(h, m || 0, 0);
      }
      return d.toLocaleString("en-PH", {
        weekday: "short", month: "short", day: "numeric",
        year: "numeric", hour: "numeric", minute: "2-digit",
        timeZone: "Asia/Manila",
      });
    } catch {
      return "Scheduled";
    }
  };

  const formatStatus = ({ status, is_expired }) => {
    if (is_expired) return "Expired";
    return (
      {
        pending: "Pending", pending_hold: "Pending Hold",
        confirmed: "Confirmed", cancelled: "Cancelled",
        completed: "Completed", no_show: "No Show",
        expired: "Expired", rejected: "Rejected",
      }[status] ?? status
    );
  };

  const getStatusClass = ({ status, is_expired }) =>
    is_expired ? "expired" : status;

  const formatHoldExpiry = ({ expires_at, original_expires_at, is_expired }) => {
    if (is_expired) return "Expired";
    const expiry = original_expires_at || expires_at;
    if (!expiry) return "";
    try {
      const diff = Math.floor((new Date(expiry) - new Date()) / 60000);
      if (diff <= 0) return "Expired";
      const h = Math.floor(diff / 60), m = diff % 60;
      const label = original_expires_at ? "Response" : "Expires";
      return h > 0 ? `${label} in ${h}h ${m}m` : `${label} in ${diff}m`;
    } catch {
      return "";
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z",
      pending_hold: "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Z",
      expired: "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z",
    };
    const cancelPath = "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z";
    const defaultPath = "M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z";
    const d =
      status === "cancelled" || status === "rejected"
        ? cancelPath
        : icons[status] ?? defaultPath;
    return (
      <svg viewBox="0 -960 960 960" fill="currentColor">
        <path d={d} />
      </svg>
    );
  };

  const canCancel = ({ status, is_expired }) =>
    !is_expired &&
    !["expired", "cancelled", "rejected", "completed"].includes(status) &&
    ["pending_hold", "confirmed", "pending"].includes(status);

  const canRemove = ({ status, is_expired }) =>
    is_expired || ["cancelled", "expired", "rejected", "completed"].includes(status);

  const getFiltered = () => {
    if (activeFilter === "active")
      return reservations.filter(
        (r) => !r.is_expired && !["cancelled", "rejected", "completed"].includes(r.status)
      );
    if (activeFilter === "past")
      return reservations.filter(
        (r) => r.is_expired || ["cancelled", "rejected", "completed"].includes(r.status)
      );
    return reservations;
  };

  const filtered = getFiltered();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="reservations-page">
        <div className="reservations-page__loading-state">
          <div className="reservations-page__loading-spinner" />
          <p>Loading reservations…</p>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="reservations-page">
      <div className="reservations-page__header">
        <button className="reservations-page__back-btn" onClick={onBack}>
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>
        <h1 className="reservations-page__title">My Reservations</h1>
      </div>

      {reservations.length > 0 && (
        <div className="reservations-page__filters">
          {["all", "active", "past"].map((f) => (
            <button
              key={f}
              className={`reservations-page__filter-btn${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="reservations-page__empty">
          <div className="reservations-page__empty-icon">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
            </svg>
          </div>
          <h3>No reservations yet</h3>
          <p>
            {activeFilter === "active"
              ? "No active reservations"
              : activeFilter === "past"
              ? "No past reservations"
              : "Your reservations will appear here"}
          </p>
        </div>
      ) : (
        <div className="reservations-page__list">
          {filtered.map((res) => {
            const isConfirmingThis = confirming?.id === res.id;
            const isProcessing = processingId === res.id;
            const showCancel = canCancel(res);
            const showRemove = canRemove(res);

            return (
              <div key={res.id} className="reservations-page__card">
                <div className="reservations-page__card-header">
                  <div className="reservations-page__card-header-left">
                    <div className="reservations-page__card-icon">
                      {getStatusIcon(res.status)}
                    </div>
                    <h3>{res.restaurant?.name || "Restaurant"}</h3>
                  </div>

                  <div className="reservations-page__card-header-right">
                    <div className="reservations-page__status-container">
                      <span className={`reservations-page__status ${getStatusClass(res)}`}>
                        {formatStatus(res)}
                      </span>
                      {(res.status === "pending_hold" || res.status === "confirmed") && (
                        <span className="reservations-page__expiry">
                          {formatHoldExpiry(res)}
                        </span>
                      )}
                    </div>

                    {/* Remove × button — only shown when card is in a removable state */}
                    {showRemove && !isConfirmingThis && (
                      <button
                        className="reservations-page__remove-btn"
                        onClick={(e) => requestRemove(e, res.id)}
                        disabled={isProcessing}
                        title="Remove from list"
                        aria-label="Remove reservation"
                      >
                        {isProcessing ? (
                          <span className="rp-btn-spinner" />
                        ) : (
                          <svg viewBox="0 -960 960 960" fill="currentColor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="reservations-page__card-details">
                  <div className="reservations-page__detail-item">
                    <span className="reservations-page__detail-label">Date & Time</span>
                    <span className="reservations-page__detail-value">
                      {formatDateTime(res.reservation_date, res.reservation_time)}
                    </span>
                  </div>
                  <div className="reservations-page__detail-item">
                    <span className="reservations-page__detail-label">Party Size</span>
                    <span className="reservations-page__detail-value">
                      {res.party_size} {res.party_size === 1 ? "person" : "people"}
                    </span>
                  </div>
                  {res.confirmation_code && (
                    <div className="reservations-page__detail-item">
                      <span className="reservations-page__detail-label">Confirmation Code</span>
                      <span className="reservations-page__detail-value reservations-page__code">
                        {res.confirmation_code}
                      </span>
                    </div>
                  )}
                  {res.hold_type && (
                    <div className="reservations-page__detail-item">
                      <span className="reservations-page__detail-label">Hold Type</span>
                      <span className="reservations-page__detail-value">
                        {res.hold_type === "quick_10min"
                          ? "10-minute Quick Hold"
                          : "20-minute Extended Hold"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Inline confirm row — replaces action buttons when active */}
                {isConfirmingThis ? (
                  confirming.action === "cancel" ? (
                    <ConfirmRow
                      message={
                        res.status === "pending_hold"
                          ? "Cancel this hold?"
                          : "Cancel this reservation?"
                      }
                      confirmLabel="Yes, cancel"
                      onConfirm={() => confirmCancel(res.id)}
                      onCancel={cancelConfirm}
                    />
                  ) : (
                    <ConfirmRow
                      message="Remove from your list?"
                      confirmLabel="Remove"
                      onConfirm={() => confirmRemove(res.id)}
                      onCancel={cancelConfirm}
                    />
                  )
                ) : (
                  showCancel && (
                    <div className="reservations-page__card-actions">
                      <button
                        className="reservations-page__cancel-btn"
                        onClick={(e) => requestCancel(e, res.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <span className="rp-btn-spinner" />
                        ) : res.status === "pending_hold" ? (
                          "Cancel Hold"
                        ) : (
                          "Cancel Reservation"
                        )}
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;