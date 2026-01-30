import React, { useState, useEffect } from "react";
import "./RestaurantDetails.css";
import profileImage from "../../Assets/Images/profile1.jpg";
import pollingService from "../../services/pollingService"; // Adjust path

// Tab Components
import OverviewTab from "../OverviewTab/OverviewTab";
import MenuTab from "../MenuTab/MenuTab";
import ReviewsTab from "../ReviewsTab/ReviewsTab";
import PhotosTab from "../PhotosTab/PhotosTab";
import PremiumRecommendations from "../PremiumRecommendations/PremiumRecommendations";
import ReservationModal from "../ReservationModal/ReservationModal";

function RestaurantDetails({ restaurantId, onBack }) {
  // ========== HELPER FUNCTION ==========
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // ✅ CORRECT: Use WAMP URL
    const backendBase = "http://localhost/EatEase/backend/public";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // The API returns paths like "/storage/restaurant-banners/..."
    return `${backendBase}${imagePath}`;
  };

  // ========== STATE VARIABLES ==========
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ ADD THIS
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    average_rating: 0,
    total_reviews: 0,
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // ADD THESE FUNCTIONS
  const handleBookmark = async () => {
    if (!restaurant || bookmarkLoading) return;

    setBookmarkLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const endpoint = isBookmarked ? "remove-bookmark" : "add-bookmark";

      const response = await fetch(
        `http://localhost/EatEase/backend/public/api/bookmarks/${restaurantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setIsBookmarked(!isBookmarked);
        alert(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks!");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleNotification = async () => {
    if (!restaurant || notificationLoading) return;

    setNotificationLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const endpoint = isNotifying ? "remove-notification" : "add-notification";

      const response = await fetch(
        `http://localhost/EatEase/backend/public/api/notifications/${restaurantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ notify_when_status: "green" }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setIsNotifying(!isNotifying);
        alert(
          isNotifying
            ? "Notification removed"
            : "You'll be notified when crowd status changes!",
        );
      }
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setNotificationLoading(false);
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
          `http://localhost/EatEase/backend/public/api/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

        // Check notification status
        const notificationResponse = await fetch(
          `http://localhost/EatEase/backend/public/api/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (notificationResponse.ok) {
          const data = await notificationResponse.json();
          if (data.success && data.notifications) {
            const notifying = data.notifications.some(
              (n) => n.restaurant_id === parseInt(restaurantId),
            );
            setIsNotifying(notifying);
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

    console.log(`🏪 [Details] MOUNTED for restaurant ${restaurantId}`);

    const unsubscribe = pollingService.subscribe(
      restaurantId,
      (updatedData) => {
        console.log(
          `🔄 [Details] RECEIVED UPDATE for ${restaurantId}:`,
          updatedData.crowd_status,
          `at ${new Date().toLocaleTimeString()}`,
        );

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
      console.log(`[Details] UNMOUNTING for restaurant ${restaurantId}`);
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
        `http://localhost:8000/api/restaurants/${restaurantId}/reviews`,
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Reviews data for header:", data);

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
      // Don't set error here - we don't want to break the page
    }
  };

  const fetchRestaurantDetails = async () => {
    try {
      setError(null);

      const response = await fetch(
        `http://localhost:8000/api/restaurants/${restaurantId}`,
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
      console.log("API Response:", result);

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
        // ADD THESE LINES - Get rating from reviewsData if not in restaurant data
        average_rating: data.average_rating || reviewsData.average_rating || 0,
        total_reviews: data.total_reviews || reviewsData.total_reviews || 0,
        // ADD THESE LINES - Banner and Profile images
        banner_image: data.banner_image || null,
        profile_image: data.profile_image || null,
      };

      console.log("Transformed data:", transformedData);
      setRestaurant(transformedData);

      // Fetch stats
      try {
        const statsResponse = await fetch(
          `http://localhost:8000/api/restaurants/${restaurantId}/stats`,
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (statsError) {
        console.log("Stats using defaults");
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
            <OverviewTab restaurant={restaurant} stats={stats} />
            {/* Premium Recommendations - Only in overview tab */}
            <PremiumRecommendations
              currentRestaurantId={restaurantId}
              limit={1}
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
            reviewsData={reviewsData} // PASS THE DATA
            onReviewsUpdate={fetchReviewsData} // PASS UPDATE FUNCTION
          />
        );
      case "photos":
        return <PhotosTab restaurantId={restaurantId} />;
      default:
        return (
          <>
            <OverviewTab restaurant={restaurant} stats={stats} />
            <PremiumRecommendations
              currentRestaurantId={restaurantId}
              limit={1}
            />
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="restaurant-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-details-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Restaurant</h3>
          <p>{error || "Restaurant not found"}</p>
          <button onClick={onBack} className="retry-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate crowd status text
  const getCrowdStatusText = (status) => {
    switch (status) {
      case "green":
        return "Low Crowd";
      case "yellow":
        return "Moderate";
      case "orange":
        return "Busy";
      case "red":
        return "Full";
      default:
        return "Unknown";
    }
  };

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
              ) : isBookmarked ? (
                <svg
                  className="bookmark-icon"
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
              ) : (
                <svg
                  className="bookmark-icon"
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
              )}
            </button>

            {/* Notification Button */}
            <button
              className={`action-btn notification-btn ${isNotifying ? "active" : ""}`}
              onClick={handleNotification}
              disabled={notificationLoading}
              aria-label={
                isNotifying ? "Stop notifications" : "Get notifications"
              }
            >
              {notificationLoading ? (
                <div className="loading-spinner-small"></div>
              ) : isNotifying ? (
                <svg
                  className="notification-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              ) : (
                <svg
                  className="notification-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="restaurant-header">
        <div className="restaurant-basic-info">
          {/* UPDATED RESTAURANT HEADER LAYOUT */}
          <div className="restaurant-header-profile">
            {/* Profile Image */}
            <div className="restaurant-profile-image-container">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={`${restaurant.name} profile`}
                  className="restaurant-profile-image"
                  onError={(e) => {
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
              <h1 className="restaurant-name">{restaurant.name}</h1>

              {/* UPDATED RESTAURANT META SECTION */}
              <div className="restaurant-meta-details">
                {/* Cuisine Type */}
                <span className="restaurant-cuisine">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 -960 960 960"
                    fill="#667eea"
                  >
                    <path d="m175-120-56-56 410-410q-18-42-5-95t57-95q53-53 118-62t106 32q41 41 32 106t-62 118q-42 44-95 57t-95-5l-50 50 304 304-56 56-304-302-304 302Zm118-342L173-582q-54-54-54-129t54-129l248 250-128 128Z" />
                  </svg>
                  {restaurant.cuisine_type || "Not specified"}
                </span>

                {/* Rating Display */}
                <div className="restaurant-rating-display">
                  <svg
                    className="star-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#FFD700"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="average-rating">
                    {Number(
                      reviewsData.average_rating ||
                        stats?.average_rating ||
                        restaurant?.average_rating ||
                        0,
                    ).toFixed(1)}
                  </span>
                  <span className="total-reviews">
                    ({reviewsData.total_reviews || stats?.total_reviews || 0})
                  </span>
                </div>

                {/* Crowd Status */}
                <span
                  className={`crowd-status-badge ${restaurant.crowd_status}`}
                >
                  {getCrowdStatusText(restaurant.crowd_status)}
                </span>
              </div>
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
          <span className="stat-label">Capacity</span>
        </div>
        <div className="stat-divider"></div>
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
        <div className="stat-divider"></div>
      </div>

      {/* Reservation Action Bar */}
      <div className="reservation-action-bar">
        <button
          className="reservation-btn"
          onClick={() => setShowReservationModal(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
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

      {/* Premium Recommendations
      <PremiumRecommendations currentRestaurantId={restaurantId} limit={1} /> */}
      {/* ADD THIS - Reservation Modal */}
      {showReservationModal && restaurant && (
        <ReservationModal
          restaurant={restaurant}
          onClose={() => setShowReservationModal(false)}
          onSuccess={(reservation) => {
            alert(
              `✅ Reservation confirmed! Your code: ${reservation.confirmation_code}`,
            );
            // Optional: Refresh or update UI
          }}
        />
      )}
    </div>
  );
}

export default RestaurantDetails;
