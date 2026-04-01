import React, { useState, useEffect } from "react";
import "./RestaurantDetails.css";
import pollingService from "../../services/pollingService";

// Tab Components
import OverviewTab from "../OverviewTab/OverviewTab";
import MenuTab from "../MenuTab/MenuTab";
import ReviewsTab from "../ReviewsTab/ReviewsTab";
import PhotosTab from "../PhotosTab/PhotosTab";
import ReservationModal from "../ReservationModal/ReservationModal";
import API_CONFIG from "../../config";

function RestaurantDetails({ restaurantId, onBack, onNotificationChange }) {
  // ✅ Added onNotificationChange prop
  // ========== HELPER FUNCTION ==========
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL (starts with http), use it directly
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If it's a Cloudinary URL without protocol? (unlikely but check)
    if (imagePath.includes("cloudinary.com")) {
      return imagePath;
    }

    // Otherwise, assume it's a local storage path
    const fullUrl = `${API_CONFIG.BASE_URL}${imagePath}`;
    return fullUrl;
  };

  const [selectedNotification, setSelectedNotification] = useState(null);
  // ========== ADD THIS MISSING FUNCTION ==========
  const getStatusText = (status) => {
    switch (status) {
      case "green":
        return "Low";
      case "yellow":
        return "Moderate";
      case "orange":
        return "Busy";
      default:
        return "Unknown";
    }
  };

  // ========== STATE VARIABLES ==========
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    average_rating: 0,
    total_reviews: 0,
  });
  // NEW: Track notification status for each crowd level
  const [notificationStatus, setNotificationStatus] = useState({
    green: false,
    yellow: false,
    orange: false,
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Helper to refresh parent notifications
  const refreshParentNotifications = () => {
    if (onNotificationChange) {
      onNotificationChange();
    }
  };

  // ADD THESE FUNCTIONS
  const handleBookmark = async (e) => {
    e.stopPropagation();

    // OPTIMISTIC UPDATE - change UI immediately
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    setBookmarkLoading(true);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to bookmark restaurants");
      setIsBookmarked(!newBookmarkState);
      setBookmarkLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/bookmarks/${restaurant.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setIsBookmarked(!newBookmarkState);
        alert("Failed to update bookmark. Please try again.");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      setIsBookmarked(!newBookmarkState);
      alert("Failed to update bookmark. Please try again.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSetNotification = async (crowdLevel) => {
    setNotificationLoading((prev) => ({ ...prev, [crowdLevel]: true }));

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications/${restaurant.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ notify_when_status: crowdLevel }),
        },
      );

      const data = await response.json();
      if (data.success) {
        // Update notification status
        setNotificationStatus((prev) => {
          const newStatus = { green: false, yellow: false, orange: false };
          newStatus[crowdLevel] = true;
          return newStatus;
        });
        setSelectedNotification(null);
        setShowNotificationModal(false);

        // ✅ Notify parent to refresh notifications
        refreshParentNotifications();

        alert(`You'll be notified when crowd is ${getStatusText(crowdLevel)}!`);
      } else {
        alert(
          "Failed to set notification: " + (data.message || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Notification error:", error);
      alert("Failed to set notification. Please try again.");
    } finally {
      setNotificationLoading((prev) => ({ ...prev, [crowdLevel]: false }));
    }
  };

  const handleNotificationToggle = async (status) => {
    if (!restaurant || notificationLoading[status]) return;

    // Set loading for this specific status
    setNotificationLoading((prev) => ({ ...prev, [status]: true }));

    try {
      const token = localStorage.getItem("auth_token");

      // Check if notification already exists for this status
      const checkResponse = await fetch(
        `${API_CONFIG.BASE_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();

        // Find existing notification for this restaurant and status
        const existingNotification = checkData.notifications?.find(
          (n) =>
            n.restaurant_id === parseInt(restaurantId) &&
            n.notify_when_status === status,
        );

        if (existingNotification) {
          // Remove existing notification
          const deleteResponse = await fetch(
            `${API_CONFIG.BASE_URL}/api/notifications/${existingNotification.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            },
          );

          if (deleteResponse.ok) {
            setNotificationStatus((prev) => ({ ...prev, [status]: false }));

            // ✅ Notify parent to refresh notifications
            refreshParentNotifications();

            alert(`Notification for ${getStatusText(status)} crowd removed!`);
          }
        } else {
          // Add new notification
          const response = await fetch(
            `${API_CONFIG.BASE_URL}/api/notifications/${restaurantId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ notify_when_status: status }),
            },
          );

          const data = await response.json();
          if (data.success) {
            setNotificationStatus((prev) => ({ ...prev, [status]: true }));

            // ✅ Notify parent to refresh notifications
            refreshParentNotifications();

            alert(`You'll be notified when crowd is ${getStatusText(status)}!`);
          }
        }
      }
    } catch (error) {
      console.error("Notification error:", error);
      alert("Error setting notification");
    } finally {
      // Clear loading for this status
      setNotificationLoading((prev) => ({ ...prev, [status]: false }));
    }
  };

  // ADD THIS EFFECT TO CHECK INITIAL BOOKMARK/NOTIFICATION STATUS
  useEffect(() => {
    if (!restaurantId) return;

    const checkStatus = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        // Check bookmark status
        const bookmarkResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (bookmarkResponse.ok) {
          const data = await bookmarkResponse.json();
          if (data.success && data.bookmarks) {
            const bookmarked = data.bookmarks.some(
              (b) => b.restaurant_id === parseInt(restaurantId),
            );
            setIsBookmarked(bookmarked);
          }
        }

        // Check notification status for ALL statuses
        const notificationResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (notificationResponse.ok) {
          const data = await notificationResponse.json();
          if (data.success && data.notifications) {
            // Reset all notification statuses
            const newStatus = {
              green: false,
              yellow: false,
              orange: false,
            };

            // Set true for each status the user has notifications for
            data.notifications.forEach((notification) => {
              if (notification.restaurant_id === parseInt(restaurantId)) {
                newStatus[notification.notify_when_status] = true;
              }
            });

            setNotificationStatus(newStatus);
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    checkStatus();
  }, [restaurantId]);

  // ========== POLLING FOR REAL-TIME UPDATES ==========
  useEffect(() => {
    if (!restaurantId) return;

    const unsubscribe = pollingService.subscribe(
      restaurantId,
      (updatedData) => {
        setIsUpdating(true);

        // Update restaurant data
        setRestaurant((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            crowd_status: updatedData.crowd_status,
            current_occupancy: updatedData.current_occupancy,
            occupancy_percentage: updatedData.occupancy_percentage,
            crowd_level:
              updatedData.crowd_status === "green"
                ? "Low"
                : updatedData.crowd_status === "yellow"
                  ? "Moderate"
                  : updatedData.crowd_status === "orange"
                    ? "Busy"
                    : "Full",
          };
        });

        // Hide indicator after 1 second
        setTimeout(() => setIsUpdating(false), 1000);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails();
      fetchReviewsData();
    } else {
      setError("No restaurant ID provided");
      setLoading(false);
    }
  }, [restaurantId]);

  // ========== IMAGE URLS (CALCULATED FROM RESTAURANT) ==========
  // Calculate these AFTER restaurant is loaded
  const bannerImageUrl = restaurant?.banner_image
    ? getImageUrl(restaurant.banner_image)
    : null;

  const profileImageUrl = restaurant?.profile_image
    ? getImageUrl(restaurant.profile_image)
    : null;

  const fetchReviewsData = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/reviews`,
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setReviewsData({
            reviews: data.reviews || [],
            average_rating: data.average_rating || 0,
            total_reviews: data.total_reviews || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching reviews for header:", error);
    }
  };

  const fetchRestaurantDetails = async () => {
    try {
      setError(null);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // EXTRACT THE RESTAURANT OBJECT FROM THE RESPONSE
      const data = result.restaurant || result;

      // Transform data to match expected field names
      const transformedData = {
        id: data.id || restaurantId,
        name: data.name || "Unknown Restaurant",
        cuisine_type: data.cuisine || data.cuisine_type || "Not specified",
        address: data.address || "Address not available",
        phone: data.phone || "No phone number",
        hours: data.hours || "Hours not specified",
        max_capacity: data.max_capacity || data.capacity || 50,
        current_occupancy: data.current_occupancy || data.occupancy || 0,
        occupancy_percentage:
          data.occupancy ||
          data.occupancy_percentage ||
          Math.round(
            ((data.current_occupancy || 0) / (data.max_capacity || 50)) * 100,
          ),
        crowd_status: data.status || data.crowd_status || "green",
        crowd_level: data.crowdLevel || "Low",
        is_verified: data.is_verified || false,
        is_featured: data.isFeatured || data.is_featured || false,
        features: data.features || [],
        average_rating: data.average_rating || reviewsData.average_rating || 0,
        total_reviews: data.total_reviews || reviewsData.total_reviews || 0,
        banner_image: data.banner_image || null,
        profile_image: data.profile_image || null,
      };

      setRestaurant(transformedData);

      // Fetch stats
      try {
        const statsResponse = await fetch(
          `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/stats`,
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (statsError) {
        setStats({
          average_rating: 0,
          total_reviews: 0,
          menu_items_count: 0,
          photos_count: 0,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      setError("Failed to load restaurant details");
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!restaurant) return null;

    switch (activeTab) {
      case "overview":
        return (
          <>
            <OverviewTab
              restaurant={restaurant}
              stats={stats}
              reviewsData={reviewsData}
            />
          </>
        );
      case "menu":
        return <MenuTab restaurantId={restaurantId} />;
      case "reviews":
        return (
          <ReviewsTab
            restaurantId={restaurantId}
            restaurantName={restaurant.name}
            reviewsData={reviewsData}
            onReviewsUpdate={fetchReviewsData}
          />
        );
      case "photos":
        return <PhotosTab restaurantId={restaurantId} />;
      default:
        return (
          <>
            <OverviewTab
              restaurant={restaurant}
              stats={stats}
              reviewsData={reviewsData}
            />
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="restaurant-details-page">
        <div className="page-loading-container">
          <div className="page-loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-details-page">
        <div className="error-container">
          <h3>Error Loading Restaurant</h3>
          <p>{error || "Restaurant not found"}</p>
          <button onClick={onBack} className="retry-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-details-page">
      {/* ADD FLOATING BACK BUTTON FOR MOBILE */}
      <button className="mobile-back-btn" onClick={onBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      </button>

      {/* Restaurant Banner */}
      {bannerImageUrl && (
        <div className="restaurant-details-banner">
          <img
            src={bannerImageUrl}
            alt={`${restaurant.name} banner`}
            className="restaurant-details-banner-image"
            onError={(e) => {
              console.error("Banner failed to load:", bannerImageUrl);
              e.target.style.display = "none";
              e.target.parentElement.style.display = "none";
            }}
          />

          {/* ADD BANNER ACTION BUTTONS */}
          <div className="banner-action-buttons">
            {/* Bookmark Button */}
            <button
              className={`action-btn bookmark-btn ${isBookmarked ? "active" : ""}`}
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              aria-label={
                isBookmarked ? "Remove bookmark" : "Bookmark restaurant"
              }
            >
              {bookmarkLoading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                <svg className="bookmark-icon" viewBox="0 0 24 24" fill="black">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
              )}
            </button>

            {/* Notification Button - Opens Modal */}
            <button
              className={`action-btn notification-btn ${
                Object.values(notificationStatus).some((status) => status)
                  ? "active"
                  : ""
              }`}
              onClick={() => setShowNotificationModal(true)}
              aria-label="Set notifications"
            >
              <svg
                className="notification-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>
          </div>
          <div className="banner-background"></div>
        </div>
      )}

      <div className="restaurant-header">
        <div className="restaurant-basic-info">
          <div className="restaurant-header-profile">
            {/* Profile Image */}
            <div className="restaurant-profile-image-container">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`${restaurant.name} profile`}
                  className="restaurant-profile-image"
                  onError={(e) => {
                    console.error(
                      "Profile image failed to load:",
                      profileImageUrl,
                    );
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="profile-image-placeholder">
                  {restaurant.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Restaurant Name and Meta */}
            <div className="restaurant-header-info">
              <h1 className="details-restaurant-name">{restaurant.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="quick-stats-bar">
        <div className="stat-item">
          <span className="stat-value">
            {restaurant.current_occupancy}/{restaurant.max_capacity}
          </span>
          <span className="stat-label">Current Capacity</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {restaurant.crowd_status === "green" && (
              <span className="status-circle green" title="Low Crowd">
                🟢
              </span>
            )}
            {restaurant.crowd_status === "yellow" && (
              <span className="status-circle yellow" title="Moderate Crowd">
                🟡
              </span>
            )}
            {restaurant.crowd_status === "orange" && (
              <span className="status-circle orange" title="Busy">
                🟠
              </span>
            )}
            {restaurant.crowd_status === "red" && (
              <span className="status-circle red" title="Full">
                🔴
              </span>
            )}
            {!["green", "yellow", "orange", "red"].includes(
              restaurant.crowd_status,
            ) && (
              <span className="status-circle gray" title="Unknown">
                ⚪
              </span>
            )}
          </span>
          <span className="stat-label">
            {restaurant.crowd_status === "green" && "Low"}
            {restaurant.crowd_status === "yellow" && "Moderate"}
            {restaurant.crowd_status === "orange" && "Busy"}
            {restaurant.crowd_status === "red" && "Full"}
          </span>
        </div>
      </div>

      {/* Reservation Action Bar */}
      <div className="reservation-action-bar">
        <button
          className="reservation-btn"
          onClick={() => setShowReservationModal(true)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Make Reservation
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>
        <button
          className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
        <button
          className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          Photos
          {stats && stats.photos_count > 0 && (
            <span className="tab-badge">{stats.photos_count}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">{renderTabContent()}</div>

      {/* Reservation Modal */}
      {showReservationModal && restaurant && (
        <ReservationModal
          restaurant={restaurant}
          onClose={() => setShowReservationModal(false)}
          onSuccess={(reservation) => {
            alert(
              `Reservation confirmed! Your code: ${reservation.confirmation_code}`,
            );
          }}
        />
      )}

      {/* Notification Modal */}
      {showNotificationModal && restaurant && (
        <div
          className="notification-modal-overlay"
          onClick={() => {
            setShowNotificationModal(false);
            setSelectedNotification(null);
          }}
        >
          <div
            className="notification-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Notify me when {restaurant.name} is:</h4>

            <div className="notification-options">
              {["green", "yellow", "orange"].map((status) => (
                <button
                  key={status}
                  className={`notification-option ${status} ${
                    selectedNotification === status
                      ? "selected"
                      : notificationStatus[status]
                        ? "selected"
                        : ""
                  }`}
                  onClick={() => setSelectedNotification(status)}
                  disabled={notificationLoading[status]}
                >
                  <div className="status-indicator-wrapper">
                    <div className={`status-indicator ${status}`}></div>
                    {(selectedNotification === status ||
                      (!selectedNotification &&
                        notificationStatus[status])) && (
                      <div className="selected-check">✓</div>
                    )}
                  </div>
                  <div className="option-text">
                    <span className="option-title">
                      {getStatusText(status)} Crowd
                    </span>
                    <small className="option-desc">
                      {status === "green" && "Get a table easily"}
                      {status === "yellow" && "Consider going soon"}
                      {status === "orange" && "Some wait time"}
                    </small>
                  </div>
                </button>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="notification-cancel-btn"
                onClick={() => {
                  setShowNotificationModal(false);
                  setSelectedNotification(null);
                }}
                disabled={
                  notificationLoading[Object.keys(notificationLoading)[0]]
                }
              >
                Cancel
              </button>
              {selectedNotification &&
                selectedNotification !==
                  (() => {
                    const active = Object.keys(notificationStatus).find(
                      (k) => notificationStatus[k],
                    );
                    return active;
                  })() && (
                  <button
                    className="notification-confirm-btn"
                    onClick={() => {
                      handleSetNotification(selectedNotification);
                    }}
                    disabled={notificationLoading[selectedNotification]}
                  >
                    {notificationLoading[selectedNotification] ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span className="save-spinner"></span>
                        Saving...
                      </span>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                )}
            </div>

            {Object.values(notificationStatus).some((v) => v === true) && (
              <button
                className="remove-all-btn"
                onClick={async () => {
                  const activeStatus = Object.keys(notificationStatus).find(
                    (k) => notificationStatus[k] === true,
                  );
                  if (activeStatus) {
                    setNotificationLoading((prev) => ({
                      ...prev,
                      [activeStatus]: true,
                    }));
                    await handleNotificationToggle(activeStatus);
                    setNotificationLoading((prev) => ({
                      ...prev,
                      [activeStatus]: false,
                    }));
                    setSelectedNotification(null);
                    setShowNotificationModal(false);
                  }
                }}
                disabled={Object.values(notificationLoading).some(
                  (v) => v === true,
                )}
              >
                {Object.values(notificationLoading).some((v) => v === true) ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      className="save-spinner"
                      style={{ borderLeftColor: "#fc0000" }}
                    ></span>
                    Removing...
                  </span>
                ) : (
                  "Remove Notification"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDetails;
