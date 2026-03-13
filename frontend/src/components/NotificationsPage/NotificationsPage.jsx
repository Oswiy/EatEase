import React, { useState, useEffect } from "react";
import "./NotificationsPage.css";
import ReservationModal from "../ReservationModal/ReservationModal";
import API_CONFIG from "../../config"; // Adjust path as needed

function NotificationsPage({ user, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantCurrentStatus, setRestaurantCurrentStatus] = useState({});
  const [notificationPreferences, setNotificationPreferences] = useState([]);
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
        setNotificationPreferences(data.preferences || []);
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

      // First get CSRF cookie from Laravel
      await fetch(`${API_CONFIG.BASE_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/user-notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
        },
      );

      if (response.status === 419) {
        console.log("CSRF failed, trying API-only method...");

        const apiResponse = await fetch(
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

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.success) {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notificationId),
            );
            if (
              notifications.find((n) => n.id === notificationId)?.is_read ===
              false
            ) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
            alert("Notification deleted!");
            return;
          }
        }
      }

      const data = await response.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (
          notifications.find((n) => n.id === notificationId)?.is_read === false
        ) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        alert("Notification deleted!");
      } else {
        alert(data.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Delete notification error:", error);
      alert("Failed to delete notification");
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
        alert(
          `All notifications deleted! (${data.deleted_count || notifications.length} removed)`,
        );
      } else {
        alert(data.message || "Failed to delete all notifications");
      }
    } catch (error) {
      console.error("Delete all notifications error:", error);
      alert("Failed to delete all notifications");
    }
  };

  useEffect(() => {
    if (notifications.length > 0) {
      fetchRestaurantsCurrentStatus();
    }
  }, [notifications]);

  const fetchRestaurantsCurrentStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const statusMap = {};

      for (const notification of notifications) {
        if (notification.restaurant_id) {
          try {
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
              statusMap[notification.restaurant_id] =
                restaurant.crowd_level || "unknown";
            }
          } catch (err) {
            console.error(
              `Error fetching restaurant ${notification.restaurant_id}:`,
              err,
            );
            statusMap[notification.restaurant_id] = "unknown";
          }
        }
      }

      setRestaurantCurrentStatus(statusMap);
    } catch (error) {
      console.error("Error fetching restaurant statuses:", error);
    }
  };

  const shouldShowBookNow = (notification) => {
    const currentStatus = restaurantCurrentStatus[notification.restaurant_id];
    const preferredStatus = notification.notify_when_status;

    const statusPriority = {
      green: 0,
      yellow: 1,
      orange: 2,
      red: 3,
      unknown: -1,
    };

    if (!currentStatus || currentStatus === "unknown") {
      return false;
    }

    const currentPriority = statusPriority[currentStatus] || -1;
    const preferredPriority = statusPriority[preferredStatus] || -1;

    return currentPriority <= preferredPriority;
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
      alert("Could not load restaurant details. Please try again.");
    }
  };

  const handleSnoozeNotification = async (notificationId) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications/${notificationId}/snooze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        alert("Notification snoozed for 1 hour");
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error snoozing notification:", error);
    }
  };

  const handleRemoveNotification = async (notificationId) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications/${notificationId}`,
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
        setNotifications(notifications.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Remove notification error:", error);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "green":
        return "Low Crowd";
      case "yellow":
        return "Moderate Crowd";
      case "orange":
        return "Busy";
      case "red":
        return "Full";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "green":
        return "#51CF66";
      case "yellow":
        return "#FCC419";
      case "orange":
        return "#FF922B";
      case "red":
        return "#FF6B6B";
      default:
        return "#666";
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (timeString) {
      return `${date.toLocaleDateString()} at ${timeString}`;
    }

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <button className="bookmarks-back-button" onClick={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="black"
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
            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
          </svg>{" "}
          My Notifications
          {unreadCount > 0 && (
            <span className="unread-counter">({unreadCount} new)</span>
          )}
        </h1>
      </div>

      {loading && (
        <div className="loading-state">
          <p>Loading notifications</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchNotifications}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {notifications.length === 0 ? (
            <div className="notifications-empty-state">
              <div className="empty-icon">
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
              <h3>No notifications yet</h3>
              <p>
                You'll get alerts here when restaurants reach your preferred
                crowd levels
              </p>
            </div>
          ) : (
            <div className="notifications-container">
              <p className="notifications-count">
                {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}
              </p>

              <div className="notifications-list">
                {notifications.map((notification) => {
                  const isCrowdAlert =
                    notification.type === "crowd_alert" ||
                    notification.notification_type === "crowd_alert";

                  return (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-info">
                        <h3>
                          {notification.restaurant_name || "Unknown Restaurant"}
                          {notification.is_read === false && (
                            <span className="unread-badge">NEW</span>
                          )}
                        </h3>
                        <div className="notification-details">
                          <div className="notification-header">
                            <span className="notification-type">
                              {isCrowdAlert ? "Crowd Alert" : "Notification"}
                            </span>
                            <span
                              className={`notifications-status-badge status-${notification.status}`}
                            >
                              {getStatusText(notification.status)}
                            </span>
                          </div>

                          <div className="notification-message">
                            {notification.message}
                          </div>

                          <div className="notification-footer">
                            <span className="notification-time">
                              {formatDateTime(
                                notification.sent_at || notification.created_at,
                              )}
                            </span>
                          </div>
                        </div>

                        {isCrowdAlert && (
                          <button
                            className="hold-action-btn hold-book-now-btn"
                            onClick={() => handleBookNow(notification)}
                          >
                            <span role="img" aria-label="plate"></span> Reserve
                            Now
                          </button>
                        )}
                      </div>

                      <div className="notification-actions">
                        <button
                          className="delete-btn"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete notification"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {showReservationModal && selectedRestaurant && (
        <ReservationModal
          restaurant={selectedRestaurant}
          onClose={() => {
            setShowReservationModal(false);
            setSelectedRestaurant(null);
          }}
          onSuccess={(reservation) => {
            alert(
              `Reservation confirmed! Code: ${reservation.confirmation_code}`,
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