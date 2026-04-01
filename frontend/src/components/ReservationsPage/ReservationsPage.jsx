import React, { useState, useEffect } from "react";
import "./ReservationsPage.css";
import API_CONFIG from "../../config";

const ReservationsPage = ({ user, onBack }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // For fetching reservations
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
          // Process reservations to check for expired holds
          const processedReservations = (
            data.reservations?.data ||
            data.reservations ||
            []
          ).map((res) => {
            let isExpired = false;

            if (res.status === "pending_hold") {
              // Check original_expires_at first (restaurant response deadline)
              if (res.original_expires_at) {
                const expiresAt = new Date(res.original_expires_at);
                const now = new Date();
                if (expiresAt < now) {
                  isExpired = true;
                }
              }
              // If original_expires_at is NULL, check if hold was created more than 10 minutes ago
              else if (res.created_at) {
                const createdAt = new Date(res.created_at);
                const now = new Date();
                const minutesSinceCreation = (now - createdAt) / (1000 * 60);

                // If hold was created more than 10 minutes ago and hasn't been accepted
                if (
                  minutesSinceCreation > 10 &&
                  res.hold_status === "pending"
                ) {
                  isExpired = true;
                }
              }
              // Fallback: check expires_at for old holds
              else if (res.expires_at) {
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
              // Check expires_at for accepted holds
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
              // Update status if expired
              status: isExpired ? "expired" : res.status,
            };
          });

          setReservations(processedReservations);
        }
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date, time) => {
    try {
      // Handle different date formats
      let dateStr = date;
      let timeStr = time;

      // If date is in ISO format
      if (dateStr && dateStr.includes("T")) {
        const dateObj = new Date(dateStr);

        // Adjust for Philippine timezone
        const phTime = new Date(
          dateObj.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
        );

        if (timeStr && timeStr !== "00:00:00" && timeStr !== "00:00") {
          const [hours, minutes] = timeStr.split(":").map(Number);
          phTime.setHours(hours, minutes || 0, 0);
        }

        if (isNaN(phTime.getTime())) {
          console.warn("Invalid date after processing:", date, time);
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

      // Regular date parsing with timezone adjustment
      const dateObj = new Date(`${dateStr}T${timeStr || "00:00"}`);
      const phTime = new Date(
        dateObj.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
      );

      if (isNaN(phTime.getTime())) {
        console.warn("Invalid date:", date, time);
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
    const { status, hold_status, is_expired, expires_at, original_expires_at } =
      reservation;

    // Check if expired
    if (is_expired) {
      return "Expired";
    }

    // Map status to display names
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

  const getStatusClass = (reservation) => {
    const { status, is_expired } = reservation;

    if (is_expired) {
      return "expired";
    }

    return status;
  };

  const formatHoldExpiry = (reservation) => {
    const { expires_at, original_expires_at, is_expired } = reservation;

    if (is_expired) {
      return "Expired";
    }

    const expiryTime = original_expires_at || expires_at;
    if (!expiryTime) return "";

    try {
      const expiresDate = new Date(expiryTime);
      const now = new Date();

      // Calculate time remaining
      const diffMs = expiresDate - now;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins <= 0) {
        return "Expired";
      }

      const diffHours = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;

      if (original_expires_at) {
        if (diffHours > 0) {
          return `Restaurant response in ${diffHours}h ${remainingMins}m`;
        } else {
          return `Restaurant response in ${diffMins}m`;
        }
      } else {
        if (diffHours > 0) {
          return `Expires in ${diffHours}h ${remainingMins}m`;
        } else {
          return `Expires in ${diffMins}m`;
        }
      }
    } catch (error) {
      return "";
    }
  };

  const handleCancel = async (id) => {
    const reservation = reservations.find((r) => r.id === id);

    // Check if reservation can be cancelled
    if (reservation.is_expired) {
      alert("This hold has already expired and cannot be cancelled.");
      return;
    }

    if (reservation.status === "expired") {
      alert("This reservation has expired.");
      return;
    }

    if (!confirm("Cancel this reservation?")) return;

    const token = localStorage.getItem("auth_token");
    // For deleting a reservation
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
        alert("Reservation cancelled");
        fetchReservations();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to cancel reservation");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      alert("Error cancelling reservation");
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this reservation from your list?")) return;

    const token = localStorage.getItem("auth_token");
    // For removing a reservation from view
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
          // Remove from current view immediately
          setReservations((prev) => prev.filter((res) => res.id !== id));
        } else {
          alert(data.message || "Failed to remove reservation");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to remove reservation");
      }
    } catch (error) {
      console.error("Error removing:", error);
      alert("Error removing reservation");
    }
  };

  // Check if reservation can be removed
  const canRemoveReservation = (reservation) => {
    const { status, is_expired } = reservation;
    const removableStatuses = ["cancelled", "expired", "rejected", "completed"];

    return is_expired || removableStatuses.includes(status);
  };

  // Check if reservation can be cancelled
  const canCancelReservation = (reservation) => {
    const { status, hold_status, is_expired } = reservation;

    if (is_expired) return false;
    if (status === "expired") return false;
    if (status === "cancelled") return false;
    if (status === "rejected") return false;
    if (status === "completed") return false;

    // Only pending holds and confirmed reservations can be cancelled
    return (
      status === "pending_hold" ||
      status === "confirmed" ||
      status === "pending"
    );
  };

  return (
    <div className="reservations-page">
      <div className="page-header">
        <button className="reservations-back-button" onClick={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>
        <h1>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="black"
          >
            <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
          </svg>
          My Reservations
        </h1>
      </div>

      {loading ? (
        <div className="loading">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="black"
            >
              <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
            </svg>
          </div>
          <h3>No Reservations Yet</h3>
          <p>Your upcoming reservations will appear here</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((res) => {
            const displayStatus = formatStatus(res);
            const statusClass = getStatusClass(res);
            const canRemove = canRemoveReservation(res);
            const canCancel = canCancelReservation(res);

            return (
              <div key={res.id} className="reservation-card">
                <div className="reservation-header">
                  <div className="header-left">
                    <h3>{res.restaurant?.name || "Restaurant"}</h3>
                  </div>

                  <div className="header-right">
                    <div className="status-container">
                      <span className={`status ${statusClass}`}>
                        {displayStatus}
                      </span>
                      {(res.status === "pending_hold" ||
                        res.status === "confirmed") && (
                        <span className="expiry-info">
                          {formatHoldExpiry(res)}
                        </span>
                      )}
                    </div>

                    {canRemove && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(res.id)}
                        title="Remove from list"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20"
                          viewBox="0 -960 960 960"
                          width="20"
                        >
                          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="reservation-details">
                  <div className="detail-item">
                    <span className="detail-label">Date & Time:</span>
                    <span className="detail-value">
                      {formatDateTime(
                        res.reservation_date,
                        res.reservation_time,
                      )}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">Party Size:</span>
                    <span className="detail-value">
                      {res.party_size} people
                    </span>
                  </div>

                  {res.confirmation_code && (
                    <div className="detail-item">
                      <span className="detail-label">Confirmation Code:</span>
                      <span className="detail-value code">
                        {res.confirmation_code}
                      </span>
                    </div>
                  )}

                  {res.hold_type && (
                    <div className="detail-item">
                      <span className="detail-label">Hold Type:</span>
                      <span className="detail-value">
                        {res.hold_type === "quick_10min"
                          ? "10-minute Quick Hold"
                          : "20-minute Extended Hold"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="reservation-actions">
                  {canCancel && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(res.id)}
                      title={
                        res.status === "pending_hold"
                          ? "Cancel this spot hold"
                          : "Cancel reservation"
                      }
                    >
                      {res.status === "pending_hold"
                        ? "Cancel Hold"
                        : "Cancel Reservation"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
