import React, { useState, useEffect } from "react";
import "./ReservationsPage.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

const ReservationsPage = ({ user, onBack }) => {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchReservations();

    // Refresh every 30 seconds to update expired status
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReservations = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const processedReservations = (
            data.reservations?.data ||
            data.reservations ||
            []
          ).map((res) => {
            let isExpired = false;

            if (res.status === "pending_hold") {
              if (res.original_expires_at) {
                const expiresAt = new Date(res.original_expires_at);
                const now = new Date();
                if (expiresAt < now) {
                  isExpired = true;
                }
              } else if (res.created_at) {
                const createdAt = new Date(res.created_at);
                const now = new Date();
                const minutesSinceCreation = (now - createdAt) / (1000 * 60);

                if (
                  minutesSinceCreation > 10 &&
                  res.hold_status === "pending"
                ) {
                  isExpired = true;
                }
              } else if (res.expires_at) {
                const expiresAt = new Date(res.expires_at);
                const now = new Date();
                if (expiresAt < now) {
                  isExpired = true;
                }
              }
            } else if (
              res.status === "confirmed" &&
              res.hold_status === "accepted"
            ) {
              if (res.expires_at) {
                const expiresAt = new Date(res.expires_at);
                const now = new Date();
                if (expiresAt < now) {
                  isExpired = true;
                }
              }
            }

            return {
              ...res,
              is_expired: isExpired,
              status: isExpired ? "expired" : res.status,
            };
          });

          setReservations(processedReservations);
        }
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      showToast("Failed to load reservations", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date, time) => {
    try {
      let dateStr = date;
      let timeStr = time;

      if (dateStr && dateStr.includes("T")) {
        const dateObj = new Date(dateStr);
        const phTime = new Date(
          dateObj.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
        );

        if (timeStr && timeStr !== "00:00:00" && timeStr !== "00:00") {
          const [hours, minutes] = timeStr.split(":").map(Number);
          phTime.setHours(hours, minutes || 0, 0);
        }

        if (isNaN(phTime.getTime())) {
          return "Scheduled";
        }

        return phTime.toLocaleString("en-PH", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        });
      }

      const dateObj = new Date(`${dateStr}T${timeStr || "00:00"}`);
      const phTime = new Date(
        dateObj.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
      );

      if (isNaN(phTime.getTime())) {
        return "Scheduled";
      }

      return phTime.toLocaleString("en-PH", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Manila",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Scheduled";
    }
  };

  const formatStatus = (reservation) => {
    const { status, hold_status, is_expired } = reservation;

    if (is_expired) {
      return "Expired";
    }

    const statusMap = {
      pending: "Pending",
      pending_hold: "Pending Hold",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      completed: "Completed",
      no_show: "No Show",
      expired: "Expired",
      rejected: "Rejected",
    };

    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        );
      case "pending_hold":
        return (
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-80q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Z" />
          </svg>
        );
      case "expired":
        return (
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        );
      case "cancelled":
      case "rejected":
        return (
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z" />
          </svg>
        );
    }
  };

  const getStatusClass = (reservation) => {
    const { status, is_expired } = reservation;
    if (is_expired) return "expired";
    return status;
  };

  const formatHoldExpiry = (reservation) => {
    const { expires_at, original_expires_at, is_expired } = reservation;

    if (is_expired) return "Expired";

    const expiryTime = original_expires_at || expires_at;
    if (!expiryTime) return "";

    try {
      const expiresDate = new Date(expiryTime);
      const now = new Date();
      const diffMs = expiresDate - now;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins <= 0) return "Expired";

      const diffHours = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;

      if (original_expires_at) {
        if (diffHours > 0) {
          return `Response in ${diffHours}h ${remainingMins}m`;
        }
        return `Response in ${diffMins}m`;
      } else {
        if (diffHours > 0) {
          return `Expires in ${diffHours}h ${remainingMins}m`;
        }
        return `Expires in ${diffMins}m`;
      }
    } catch (error) {
      return "";
    }
  };

  const handleCancel = async (id) => {
    const reservation = reservations.find((r) => r.id === id);

    if (reservation.is_expired) {
      showToast(
        "This hold has already expired and cannot be cancelled.",
        "warning",
        3000,
      );
      return;
    }

    if (reservation.status === "expired") {
      showToast("This reservation has expired.", "warning", 3000);
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;

    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/reservations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        showToast("Reservation cancelled successfully", "success", 3000);
        fetchReservations();
      } else {
        const errorData = await response.json();
        showToast(
          errorData.message || "Failed to cancel reservation",
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      showToast("Error cancelling reservation", "error", 3000);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this reservation from your list?")) return;

    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/reservations/${id}/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReservations((prev) => prev.filter((res) => res.id !== id));
          showToast("Reservation removed", "success", 3000);
        } else {
          showToast(
            data.message || "Failed to remove reservation",
            "error",
            3000,
          );
        }
      } else {
        const errorData = await response.json();
        showToast(
          errorData.message || "Failed to remove reservation",
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Error removing:", error);
      showToast("Error removing reservation", "error", 3000);
    }
  };

  const canRemoveReservation = (reservation) => {
    const { status, is_expired } = reservation;
    const removableStatuses = ["cancelled", "expired", "rejected", "completed"];
    return is_expired || removableStatuses.includes(status);
  };

  const canCancelReservation = (reservation) => {
    const { status, hold_status, is_expired } = reservation;

    if (is_expired) return false;
    if (status === "expired") return false;
    if (status === "cancelled") return false;
    if (status === "rejected") return false;
    if (status === "completed") return false;

    return (
      status === "pending_hold" ||
      status === "confirmed" ||
      status === "pending"
    );
  };

  const getFilteredReservations = () => {
    if (activeFilter === "all") return reservations;
    if (activeFilter === "active") {
      return reservations.filter(
        (r) =>
          !r.is_expired &&
          r.status !== "cancelled" &&
          r.status !== "rejected" &&
          r.status !== "completed",
      );
    }
    if (activeFilter === "past") {
      return reservations.filter(
        (r) =>
          r.is_expired ||
          r.status === "cancelled" ||
          r.status === "rejected" ||
          r.status === "completed",
      );
    }
    return reservations;
  };

  const filteredReservations = getFilteredReservations();

  if (loading) {
    return (
      <div className="reservations-page">
        <div className="reservations-page__loading-state">
          <div className="reservations-page__loading-spinner"></div>
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      {/* Header */}
      <div className="reservations-page__header">
        <button className="reservations-page__back-btn" onClick={onBack}>
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>
        <h1 className="reservations-page__title">
          My Reservations
        </h1>
      </div>

      {/* Filter Tabs */}
      {reservations.length > 0 && (
        <div className="reservations-page__filters">
          <button
            className={`reservations-page__filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`reservations-page__filter-btn ${activeFilter === "active" ? "active" : ""}`}
            onClick={() => setActiveFilter("active")}
          >
            Active
          </button>
          <button
            className={`reservations-page__filter-btn ${activeFilter === "past" ? "active" : ""}`}
            onClick={() => setActiveFilter("past")}
          >
            Past
          </button>
        </div>
      )}

      {/* Content */}
      {filteredReservations.length === 0 ? (
        <div className="reservations-page__empty">
          <div className="reservations-page__empty-icon">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
            </svg>
          </div>
          <h3>No Reservations Yet</h3>
          <p>
            {activeFilter === "all"
              ? "Your reservations will appear here"
              : activeFilter === "active"
                ? "No active reservations"
                : "No past reservations"}
          </p>
        </div>
      ) : (
        <div className="reservations-page__list">
          {filteredReservations.map((res) => {
            const displayStatus = formatStatus(res);
            const statusClass = getStatusClass(res);
            const canRemove = canRemoveReservation(res);
            const canCancel = canCancelReservation(res);

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
                      <span
                        className={`reservations-page__status ${statusClass}`}
                      >
                        {displayStatus}
                      </span>
                      {(res.status === "pending_hold" ||
                        res.status === "confirmed") && (
                        <span className="reservations-page__expiry">
                          {formatHoldExpiry(res)}
                        </span>
                      )}
                    </div>

                    {canRemove && (
                      <button
                        className="reservations-page__remove-btn"
                        onClick={() => handleRemove(res.id)}
                        title="Remove from list"
                      >
                        <svg viewBox="0 -960 960 960" fill="currentColor">
                          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="reservations-page__card-details">
                  <div className="reservations-page__detail-item">
                    <span className="reservations-page__detail-label">
                      Date & Time
                    </span>
                    <span className="reservations-page__detail-value">
                      {formatDateTime(
                        res.reservation_date,
                        res.reservation_time,
                      )}
                    </span>
                  </div>

                  <div className="reservations-page__detail-item">
                    <span className="reservations-page__detail-label">
                      Party Size
                    </span>
                    <span className="reservations-page__detail-value">
                      {res.party_size}{" "}
                      {res.party_size === 1 ? "person" : "people"}
                    </span>
                  </div>

                  {res.confirmation_code && (
                    <div className="reservations-page__detail-item">
                      <span className="reservations-page__detail-label">
                        Confirmation Code
                      </span>
                      <span className="reservations-page__detail-value reservations-page__code">
                        {res.confirmation_code}
                      </span>
                    </div>
                  )}

                  {res.hold_type && (
                    <div className="reservations-page__detail-item">
                      <span className="reservations-page__detail-label">
                        Hold Type
                      </span>
                      <span className="reservations-page__detail-value">
                        {res.hold_type === "quick_10min"
                          ? "10-minute Quick Hold"
                          : "20-minute Extended Hold"}
                      </span>
                    </div>
                  )}
                </div>

                {canCancel && (
                  <div className="reservations-page__card-actions">
                    <button
                      className="reservations-page__cancel-btn"
                      onClick={() => handleCancel(res.id)}
                    >
                      {res.status === "pending_hold"
                        ? "Cancel Hold"
                        : "Cancel Reservation"}
                    </button>
                  </div>
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
