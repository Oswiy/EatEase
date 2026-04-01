import React, { useState, useEffect } from "react";
import "./FeatureCarousel.css";
import pollingService from "../../services/pollingService";
import API_CONFIG from "../../config";

function FeatureCarousel({ restaurants, onRestaurantClick }) {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [updatedRestaurants, setUpdatedRestaurants] = useState({});

  // Set featured restaurants WITHOUT randomizing
  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return;
    
    // Filter featured restaurants only - keep original order
    const featured = restaurants.filter(
      (restaurant) =>
        restaurant.is_featured === true || restaurant.isFeatured === true,
    );
    
    // Keep the original order from the API
    setFeaturedRestaurants(featured);
    
    // Initialize updated restaurants with initial data
    const initialUpdates = {};
    featured.forEach(restaurant => {
      initialUpdates[restaurant.id] = {
        crowd_status: restaurant.crowd_status || restaurant.status,
        occupancy_percentage: restaurant.occupancy_percentage || 0
      };
    });
    setUpdatedRestaurants(initialUpdates);
  }, [restaurants]);

  // Set up polling for all featured restaurants
  useEffect(() => {
    if (featuredRestaurants.length === 0) return;

    const unsubscribeCallbacks = [];

    // Subscribe each restaurant to polling
    featuredRestaurants.forEach(restaurant => {
      const unsubscribe = pollingService.subscribe(
        restaurant.id,
        (updatedData) => {          
          // Update the specific restaurant's data
          setUpdatedRestaurants(prev => ({
            ...prev,
            [restaurant.id]: {
              crowd_status: updatedData.crowd_status,
              occupancy_percentage: updatedData.occupancy_percentage,
              updated_at: updatedData.updated_at
            }
          }));
        }
      );
      
      unsubscribeCallbacks.push(unsubscribe);
    });

    // Cleanup: unsubscribe from all when component unmounts
    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, [featuredRestaurants]);

  const handleRestaurantClick = (restaurant) => {
    if (onRestaurantClick) {
      onRestaurantClick(restaurant);
    }
  };

  const handleArrowClick = (e, restaurant) => {
    e.stopPropagation();
    handleRestaurantClick(restaurant);
  };

  const getStatusClass = (status) => {
    if (!status) return "green";
    switch (status.toLowerCase()) {
      case "green":
        return "green";
      case "yellow":
        return "yellow";
      case "orange":
        return "orange";
      case "red":
        return "red";
      default:
        return "green";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Low Crowd";
    switch (status.toLowerCase()) {
      case "green":
        return "Low Crowd";
      case "yellow":
        return "Moderate";
      case "orange":
        return "Busy";
      case "red":
        return "Full";
      default:
        return "Low Crowd";
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return `${API_CONFIG.BASE_URL}${imagePath}`;
  };

  const handleImageLoad = (restaurantId) => {
    setLoadedImages((prev) => ({ ...prev, [restaurantId]: true }));
  };

  const handleImageError = (restaurantId, url) => {
    console.error(`Image failed to load for restaurant ${restaurantId}:`, url);
    setLoadedImages((prev) => ({ ...prev, [restaurantId]: false }));
  };

  const getCurrentRestaurantData = (restaurant) => {
    const updatedData = updatedRestaurants[restaurant.id];
    return {
      ...restaurant,
      crowd_status: updatedData?.crowd_status || restaurant.crowd_status || restaurant.status,
      occupancy_percentage: updatedData?.occupancy_percentage || restaurant.occupancy_percentage
    };
  };

  // Empty state - no featured restaurants
  if (featuredRestaurants.length === 0) {
    return (
      <div className="feature-carousel">
        <div className="carousel-header">
          <h3>Featured Restaurants</h3>
        </div>
        <div className="empty-carousel">
          <h4>No Featured Restaurants Yet</h4>
          <p>Premium restaurants can feature themselves to appear here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-carousel">
      <div className="carousel-header">
        <h3>Check Out:</h3>
      </div>

      <div className="carousel-container">
        {featuredRestaurants.map((restaurant) => {
          const currentData = getCurrentRestaurantData(restaurant);
          const imageUrl = getImageUrl(restaurant.banner_image);
          const hasLoaded = loadedImages[restaurant.id];

          return (
            <div
              key={restaurant.id}
              className="carousel-item"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              {/* Crowd Status Indicator with polling updates */}
              <div className="crowd-status-indicator">
                <div
                  className={`status-dot ${getStatusClass(currentData.crowd_status)}`}
                ></div>
                <span>
                  {getStatusLabel(currentData.crowd_status)}
                </span>
              </div>

              {/* Banner Image Container */}
              <div className="feature-banner-container">
                {/* Show image if URL exists and hasn't failed */}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={`${restaurant.name} banner`}
                    className="feature-banner-image"
                    style={{
                      display: hasLoaded === false ? "none" : "block",
                      opacity: hasLoaded ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                    onLoad={() => handleImageLoad(restaurant.id)}
                    onError={() => handleImageError(restaurant.id, imageUrl)}
                  />
                )}

                {/* Show placeholder if no image URL or image failed to load */}
                {(hasLoaded === false || !imageUrl) && (
                  <div className="feature-banner-placeholder">
                    {restaurant.name}
                  </div>
                )}

                {/* PROMO TEXT - POSITIONED ABOVE THE RESTAURANT NAME */}
                {restaurant.promo_text && restaurant.show_promo && (
                  <div className="carousel-promo-overlay">
                    <span className="promo-text">{restaurant.promo_text}</span>
                  </div>
                )}

                {/* Restaurant Name Overlay (Bottom Left) */}
                <div className="restaurant-name-overlay">
                  <h4>{restaurant.name}</h4>
                  {(restaurant.cuisine_type || restaurant.cuisine) && (
                    <div className="cuisine-badge">
                      {restaurant.cuisine_type || restaurant.cuisine}
                    </div>
                  )}
                </div>

                {/* Arrow Button (Bottom Right) */}
                <button
                  className="arrow-button"
                  onClick={(e) => handleArrowClick(e, restaurant)}
                  aria-label={`View ${restaurant.name} details`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeatureCarousel;