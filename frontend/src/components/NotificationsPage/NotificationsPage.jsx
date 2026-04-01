import React, { useState, useEffect } from "react";
import "./NotificationsPage.css";
import ReservationModal from "../ReservationModal/ReservationModal";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

function NotificationsPage({ user, onBack }) {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Please login to view notifications");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/user-notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const notificationsList = data.notifications || [];
        setNotifications(notificationsList);
        const unread = notificationsList.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      } else {
        setError(data.message || "Failed to load notifications");
      }
    } catch (err) {
      console.error("Notifications fetch error:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications/${notificationId}/mark-read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/user-notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId,
        );
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (deletedNotification?.is_read === false) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        showToast("Notification deleted", "success", 3000);
      } else {
        showToast(
          data.message || "Failed to delete notification",
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Delete notification error:", error);
      showToast("Failed to delete notification", "error", 3000);
    }
  };

  const deleteAllNotifications = async () => {
    if (notifications.length === 0) return;

    if (!window.confirm(`Delete all ${notifications.length} notifications?`))
      return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/user-notifications`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setNotifications([]);
        setUnreadCount(0);
        showToast(
          `All notifications deleted (${data.deleted_count || notifications.length} removed)`,
          "success",
          3000,
        );
      } else {
        showToast(
          data.message || "Failed to delete all notifications",
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Delete all notifications error:", error);
      showToast("Failed to delete all notifications", "error", 3000);
    }
  };

  const handleBookNow = async (notification) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${notification.restaurant_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const restaurant = data.restaurant || data;
        setSelectedRestaurant(restaurant);
        setShowReservationModal(true);
      }
    } catch (error) {
      console.error("Error fetching restaurant for booking:", error);
      showToast("Could not load restaurant details", "error", 3000);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "green":
        return "Low";
      case "yellow":
        return "Moderate";
      case "orange":
        return "Busy";
      case "red":
        return "Full";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "green":
        return "status-green";
      case "yellow":
        return "status-yellow";
      case "orange":
        return "status-orange";
      case "red":
        return "status-red";
      default:
        return "";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type) => {
    if (type === "crowd_alert") {
      return (
        <svg viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-489Zm0 409q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM160-200v-80h80v-280q0-84 50.5-149T422-793q-10 22-15.5 46t-7.5 49q-35 21-57 57t-22 81v280h320v-122q20 3 40 3t40-3v122h80v80H160Zm480-280-12-60q-12-5-22.5-10.5T584-564l-58 18-40-68 46-40q-2-13-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-820l12-60h80l12 60q12 5 22.5 10.5T776-796l58-18 40 68-46 40q2 13 2 26t-2 26l46 40-40 68-58-18q-11 8-21.5 13.5T732-540l-12 60h-80Zm40-120q33 0 56.5-23.5T760-680q0-33-23.5-56.5T680-760q-33 0-56.5 23.5T600-680q0 33 23.5 56.5T680-600Z" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 -960 960 960" fill="currentColor">
        <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-page__loading-state">
          <div className="notifications-page__loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-page__header">
          <button className="notifications-page__back-btn" onClick={onBack}>
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </button>
          <h1 className="notifications-page__title">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
            </svg>
            My Notifications
          </h1>
        </div>
        <div className="notifications-page__error-state">
          <p>{error}</p>
          <button
            onClick={fetchNotifications}
            className="notifications-page__retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="notifications-page__header">
        <button className="notifications-page__back-btn" onClick={onBack}>
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>
        <h1 className="notifications-page__title">
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
          </svg>
          My Notifications
          {unreadCount > 0 && (
            <span className="notifications-page__unread-counter">
              {unreadCount} new
            </span>
          )}
        </h1>
        {notifications.length > 0 && (
          <button
            className="notifications-page__delete-all-btn"
            onClick={deleteAllNotifications}
          >
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
            Delete All
          </button>
        )}
      </div>

      {/* Content */}
      {notifications.length === 0 ? (
        <div className="notifications-page__empty">
          <div className="notifications-page__empty-icon">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
            </svg>
          </div>
          <h3>No Notifications Yet</h3>
          <p>
            You'll get alerts here when restaurants reach your preferred crowd
            levels
          </p>
        </div>
      ) : (
        <div className="notifications-page__list">
          {notifications.map((notification) => {
            const isCrowdAlert =
              notification.type === "crowd_alert" ||
              notification.notification_type === "crowd_alert";

            return (
              <div
                key={notification.id}
                className={`notifications-page__card ${!notification.is_read ? "notifications-page__card--unread" : ""}`}
                onClick={() =>
                  !notification.is_read && markAsRead(notification.id)
                }
              >
                <div className="notifications-page__card-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notifications-page__card-content">
                  <div className="notifications-page__card-header">
                    <h3 className="notifications-page__card-title">
                      {notification.restaurant_name || "Unknown Restaurant"}
                      {!notification.is_read && (
                        <span className="notifications-page__unread-badge">
                          New
                        </span>
                      )}
                    </h3>
                    <button
                      className="notifications-page__delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      <svg viewBox="0 -960 960 960" fill="currentColor">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>
                    </button>
                  </div>

                  <div className="notifications-page__card-meta">
                    {isCrowdAlert && notification.status && (
                      <span
                        className={`notifications-page__status-badge ${getStatusClass(notification.status)}`}
                      >
                        {getStatusText(notification.status)} Crowd
                      </span>
                    )}
                    <span className="notifications-page__notification-type">
                      {isCrowdAlert ? "Crowd Alert" : "Notification"}
                    </span>
                  </div>

                  <p className="notifications-page__card-message">
                    {notification.message}
                  </p>

                  <div className="notifications-page__card-footer">
                    <span className="notifications-page__timestamp">
                      <svg viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                      {formatDateTime(
                        notification.sent_at || notification.created_at,
                      )}
                    </span>
                  </div>

                  {isCrowdAlert && (
                    <button
                      className="notifications-page__book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(notification);
                      }}
                    >
                      <svg viewBox="0 -960 960 960" fill="currentColor">
                        <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520Z" />
                      </svg>
                      Reserve Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && selectedRestaurant && (
        <ReservationModal
          restaurant={selectedRestaurant}
          onClose={() => {
            setShowReservationModal(false);
            setSelectedRestaurant(null);
          }}
          onSuccess={(reservation) => {
            showToast(
              `Reservation confirmed! Code: ${reservation.confirmation_code}`,
              "success",
              4000,
            );
            setShowReservationModal(false);
            setSelectedRestaurant(null);
          }}
        />
      )}
    </div>
  );
}

export default NotificationsPage;
