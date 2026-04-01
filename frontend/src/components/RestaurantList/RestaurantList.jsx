import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "../SearchBar/SearchBar";
import Filters from "../Filters/Filters";
import FeatureCarousel from "../FeatureCarousel/FeatureCarousel";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import RestaurantDetails from "../RestaurantDetails/RestaurantDetails";
import "./RestaurantList.css";
import API_CONFIG from "../../config";

function RestaurantList({
  user,
  onNavigateToBookmarks,
  onNavigateToNotifications,
  onNavigateToReservations,
}) {
  // ========== STATE VARIABLES ==========
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "all",
    crowd_status: [],
    min_rating: 0,
    tier: "all",
    featured: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const menuRef = useRef(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showOnlyPremium, setShowOnlyPremium] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);

  // Cache for restaurants data
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 60000; // 1 minute cache

  // ========== USE EFFECTS ==========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    window.refreshNotificationCount = fetchNotificationCount;
    return () => {
      window.refreshNotificationCount = null;
    };
  }, []);

  useEffect(() => {
    fetchRestaurants();
    fetchNotificationCount();
  }, []);

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  // ========== API FUNCTIONS ==========
  const fetchAllNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllNotifications(data.notifications || []);
          setNotificationCount(data.count || data.notifications?.length || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ✅ NEW: Function to refresh notifications (to be passed to RestaurantDetails)
  const refreshNotifications = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllNotifications(data.notifications || []);
          setNotificationCount(data.count || data.notifications?.length || 0);
        }
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    }
  }, []);

  const randomizeRestaurants = (restaurantsList) => {
    if (!restaurantsList || restaurantsList.length === 0) return [];

    const premiumRestaurants = restaurantsList.filter(
      (r) => r.subscription_tier === "premium" || r.isPremium === true,
    );
    const basicRestaurants = restaurantsList.filter(
      (r) =>
        r.subscription_tier === "basic" ||
        !r.subscription_tier ||
        (r.subscription_tier !== "premium" && r.isPremium !== true),
    );

    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const randomizedPremium = shuffleArray(premiumRestaurants);
    const randomizedBasic = shuffleArray(basicRestaurants);

    return [...randomizedPremium, ...randomizedBasic];
  };

  // Separate function for refreshing ONLY the restaurant list
  const refreshRestaurantsOnly = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      // Build query string from current filters
      const params = new URLSearchParams();

      if (filters.cuisine && filters.cuisine !== "all") {
        params.append("cuisine", filters.cuisine);
      }

      if (filters.crowd_status && filters.crowd_status.length > 0) {
        filters.crowd_status.forEach((status) => {
          params.append("crowd_status[]", status);
        });
      }

      if (filters.min_rating && filters.min_rating > 0) {
        params.append("min_rating", filters.min_rating);
      }

      if (filters.tier && filters.tier !== "all") {
        params.append("tier", filters.tier);
      }

      if (filters.featured) {
        params.append("featured", "true");
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_CONFIG.BASE_URL}/api/restaurants?${queryString}`
        : `${API_CONFIG.BASE_URL}/api/restaurants`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const randomizedRestaurants = randomizeRestaurants(
        data.restaurants || [],
      );

      // Only update restaurants, nothing else
      setRestaurants(randomizedRestaurants);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error("Failed to refresh restaurants:", err);
      setError("Failed to refresh restaurants. Please try again.");
      // Clear error after 3 seconds
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsRefreshing(false);
    }
  }, [filters, isRefreshing]);

  const fetchRestaurants = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      // Build query string from filters
      const params = new URLSearchParams();

      if (currentFilters.cuisine && currentFilters.cuisine !== "all") {
        params.append("cuisine", currentFilters.cuisine);
      }

      if (
        currentFilters.crowd_status &&
        currentFilters.crowd_status.length > 0
      ) {
        currentFilters.crowd_status.forEach((status) => {
          params.append("crowd_status[]", status);
        });
      }

      if (currentFilters.min_rating && currentFilters.min_rating > 0) {
        params.append("min_rating", currentFilters.min_rating);
      }

      if (currentFilters.tier && currentFilters.tier !== "all") {
        params.append("tier", currentFilters.tier);
      }

      if (currentFilters.featured) {
        params.append("featured", "true");
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_CONFIG.BASE_URL}/api/restaurants?${queryString}`
        : `${API_CONFIG.BASE_URL}/api/restaurants`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const randomizedRestaurants = randomizeRestaurants(
        data.restaurants || [],
      );

      setRestaurants(randomizedRestaurants);
      setLastFetchTime(Date.now());

      if (data.filters) {
        setFilters(currentFilters);
      }
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllNotifications(data.notifications || []);
          setNotificationCount(data.count || data.notifications?.length || 0);
        } else {
          setNotificationCount(0);
        }
      } else {
        setNotificationCount(0);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
      setNotificationCount(0);
    }
  };

  // ========== HANDLER FUNCTIONS ==========
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleBackToList = () => {
    setSelectedRestaurant(null);
  };

  const handleRefresh = useCallback(async () => {
    await refreshRestaurantsOnly();
  }, [refreshRestaurantsOnly]);

  const handleBookmarks = () => {
    setShowMenu(false);
    if (onNavigateToBookmarks) {
      onNavigateToBookmarks();
    }
  };

  const handleNotifications = () => {
    setShowMenu(false);
    fetchNotificationCount();
    if (onNavigateToNotifications) {
      onNavigateToNotifications();
    }
  };

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // ========== FILTERED RESTAURANTS ==========
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (showOnlyPremium && !restaurant.isPremium) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const featuredRestaurants = restaurants.filter(
    (restaurant) => restaurant.isFeatured,
  );

  // ========== RENDER LOADING STATE ==========
  if (loading) {
    return (
      <div className="restaurant-list">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p className="loading-text">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div
      className={`restaurant-list ${selectedRestaurant ? "detail-view" : ""}`}
    >
      {/* HEADER - Only shown in LIST view */}
      {!selectedRestaurant && (
        <div className="restaurant-list-header">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <Filters
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onApplyFilters={fetchRestaurants}
          />

          <div className="menu-container" ref={menuRef}>
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="27px"
                fill="#e3e3e3"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onNavigateToReservations();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="black"
                  >
                    <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                  </svg>
                  Reservations
                </button>
                <button onClick={handleBookmarks}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="black"
                  >
                    <path d="M160-80v-560q0-33 23.5-56.5T240-720h320q33 0 56.5 23.5T640-640v560L400-200 160-80Zm80-121 160-86 160 86v-439H240v439Zm480-39v-560H280v-80h440q33 0 56.5 23.5T800-800v560h-80ZM240-640h320-320Z" />
                  </svg>
                  Bookmarks
                </button>
                <button
                  onClick={handleNotifications}
                  className="notifications-btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M480-489Zm0 409q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM160-200v-80h80v-280q0-84 50.5-149T422-793q-10 22-15.5 46t-7.5 49q-35 21-57 57t-22 81v280h320v-122q20 3 40 3t40-3v122h80v80H160Zm480-280-12-60q-12-5-22.5-10.5T584-564l-58 18-40-68 46-40q-2-13-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-820l12-60h80l12 60q12 5 22.5 10.5T776-796l58-18 40 68-46 40q2 13 2 26t-2 26l46 40-40 68-58-18q-11 8-21.5 13.5T732-540l-12 60h-80Zm40-120q33 0 56.5-23.5T760-680q0-33-23.5-56.5T680-760q-33 0-56.5 23.5T600-680q0 33 23.5 56.5T680-600Z" />
                  </svg>
                  Notifications
                  {notificationCount > 0 && (
                    <span className="notification-badge">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="red"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => fetchRestaurants()}>Retry</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      {selectedRestaurant ? (
        <RestaurantDetails
          restaurantId={selectedRestaurant.id}
          onBack={handleBackToList}
          onNotificationChange={refreshNotifications} // ✅ Pass the callback
        />
      ) : (
        !error && (
          <>
            {/* FEATURED RESTAURANTS CAROUSEL */}
            <FeatureCarousel
              restaurants={featuredRestaurants}
              onRestaurantClick={handleRestaurantClick}
            />

            {/* AVAILABLE RESTAURANTS HEADER */}
            <div className="available-restaurants-header">
              <div className="header-left">
                <h2 className="available-title">Available Restaurants:</h2>
              </div>

              <button
                className={`refresh-button ${isRefreshing ? "refreshing" : ""}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Refresh restaurant list"
              >
                {isRefreshing ? (
                  <svg
                    className="refresh-spinner spinning"
                    width="20"
                    height="20"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                  </svg>
                ) : (
                  <svg
                    className="refresh-icon"
                    width="20"
                    height="20"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                  </svg>
                )}
              </button>
            </div>

            {/* MAIN RESTAURANT LIST - ONLY THIS REFRESHES */}
            <div className="restaurants-container">
              {filteredRestaurants.length === 0 ? (
                <div className="empty-state">
                  {showOnlyPremium ? (
                    <>
                      <p>No Premium restaurants available.</p>
                      <button
                        className="show-all-btn"
                        onClick={() => setShowOnlyPremium(false)}
                      >
                        Show All Restaurants
                      </button>
                    </>
                  ) : (
                    <p>No restaurants found.</p>
                  )}
                </div>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onRestaurantClick={handleRestaurantClick}
                    allNotifications={allNotifications}
                  />
                ))
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default RestaurantList;
