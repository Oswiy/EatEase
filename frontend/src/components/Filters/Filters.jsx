import React, { useState, useEffect } from "react";
import "./Filters.css";
import API_CONFIG from "../../config";

function Filters({
  filters = {},
  setFilters,
  showFilters,
  setShowFilters,
  onApplyFilters,
}) {
  const [availableCuisines, setAvailableCuisines] = useState([]);
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    cuisine: "all",
    crowd_status: [],
    min_rating: 0,
    tier: "all",
    featured: false,
  });

  useEffect(() => {
    fetchCuisines();
  }, []);

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const fetchCuisines = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/cuisines`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const cuisines = data.cuisines || [];
          const expanded = cuisines
            .flatMap((c) => c.split(",").map((s) => s.trim()))
            .filter(Boolean);
          const unique = [...new Set(expanded)];
          setAvailableCuisines(unique);
        }
      }
    } catch (error) {
      console.error("Error fetching cuisines:", error);
    }
  };

  const handleCuisineChange = (e) => {
    setLocalFilters({ ...localFilters, cuisine: e.target.value });
  };

  const handleCrowdStatusChange = (status) => {
    const currentStatuses = [...(localFilters.crowd_status || [])];
    if (currentStatuses.includes(status)) {
      setLocalFilters({
        ...localFilters,
        crowd_status: currentStatuses.filter((s) => s !== status),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        crowd_status: [...currentStatuses, status],
      });
    }
  };

  const handleRatingChange = (rating) => {
    setLocalFilters({ ...localFilters, min_rating: rating });
  };

  const handleTierChange = (tier) => {
    setLocalFilters({ ...localFilters, tier });
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(localFilters);
    if (setFilters) setFilters(localFilters);
    setShowFilters(false);
  };

  const handleClear = () => {
    const clearedFilters = {
      cuisine: "all",
      crowd_status: [],
      min_rating: 0,
      tier: "all",
      featured: false,
    };
    setLocalFilters(clearedFilters);
    if (onApplyFilters) onApplyFilters(clearedFilters);
    if (setFilters) setFilters(clearedFilters);
  };

  const getStatusLabel = (status) => {
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
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "green":
        return "#4caf50";
      case "yellow":
        return "#ffc107";
      case "orange":
        return "#ff9800";
      case "red":
        return "#ff6b6b";
      default:
        return "#666";
    }
  };

  const hasActiveFilters = () => {
    return (
      (filters?.cuisine && filters.cuisine !== "all") ||
      (filters?.crowd_status && filters.crowd_status.length > 0) ||
      (filters?.min_rating && filters.min_rating > 0) ||
      (filters?.tier && filters.tier !== "all") ||
      filters?.featured === true
    );
  };

  const getDisplayCuisines = () => {
    if (showAllCuisines || availableCuisines.length <= 3)
      return availableCuisines;
    return availableCuisines.slice(0, 3);
  };

  const shouldShowMoreButton = availableCuisines.length > 3;

  return (
    <div className="filters-container">
      <button
        className="filter-button"
        onClick={() => setShowFilters(!showFilters)}
      >
        <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
          <path d="M176,80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H184A8,8,0,0,1,176,80ZM40,88H144v16a8,8,0,0,0,16,0V56a8,8,0,0,0-16,0V72H40a8,8,0,0,0,0,16Zm176,80H120a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16ZM88,144a8,8,0,0,0-8,8v16H40a8,8,0,0,0,0,16H80v16a8,8,0,0,0,16,0V152A8,8,0,0,0,88,144Z"></path>
        </svg>
        Filter
        {hasActiveFilters() && (
          <span className="active-filter-indicator"></span>
        )}
      </button>

      {showFilters && (
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filter Restaurants</h3>
            <button
              className="close-filters-btn"
              onClick={() => setShowFilters(false)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="filters-content">
            {/* Cuisine Filter */}
            <div className="filter-section">
              <label className="filter-label">Cuisine Type</label>
              <div className="cuisine-options">
                <label className="cuisine-option">
                  <input
                    type="radio"
                    name="cuisine"
                    value="all"
                    checked={localFilters.cuisine === "all"}
                    onChange={handleCuisineChange}
                  />
                  <span>All</span>
                </label>
                {getDisplayCuisines().map((cuisine) => (
                  <label key={cuisine} className="cuisine-option">
                    <input
                      type="radio"
                      name="cuisine"
                      value={cuisine}
                      checked={localFilters.cuisine === cuisine}
                      onChange={handleCuisineChange}
                    />
                    <span>{cuisine}</span>
                  </label>
                ))}
                {shouldShowMoreButton && (
                  <button
                    className="cuisine-show-more-btn"
                    onClick={() => setShowAllCuisines(!showAllCuisines)}
                  >
                    <span>
                      {showAllCuisines
                        ? "Show Less"
                        : `+${availableCuisines.length - 3} More`}
                    </span>
                    <svg
                      className={`cuisine-show-more-icon ${showAllCuisines ? "rotated" : ""}`}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Crowd Status Filter */}
            <div className="filter-section">
              <label className="filter-label">Crowd Status</label>
              <div className="status-options">
                {["green", "yellow", "orange", "red"].map((status) => (
                  <button
                    key={status}
                    className={`status-option ${(localFilters.crowd_status || []).includes(status) ? "selected" : ""}`}
                    onClick={() => handleCrowdStatusChange(status)}
                    style={{ "--status-color": getStatusColor(status) }}
                  >
                    <span
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(status) }}
                    ></span>
                    {getStatusLabel(status)}
                    {(localFilters.crowd_status || []).includes(status) && (
                      <svg
                        className="check-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
              <label className="filter-label">Minimum Rating</label>
              <div className="rating-options">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <button
                    key={rating}
                    className={`rating-option ${localFilters.min_rating === rating ? "selected" : ""}`}
                    onClick={() => handleRatingChange(rating)}
                  >
                    <span className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star ${star <= rating ? "filled" : "empty"}`}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Filter */}
            <div className="filter-section">
              <label className="filter-label">Restaurant Type</label>
              <div className="tier-options">
                <label className="tier-option">
                  <input
                    type="radio"
                    name="tier"
                    value="all"
                    checked={localFilters.tier === "all"}
                    onChange={() => handleTierChange("all")}
                  />
                  <span>All Restaurants</span>
                </label>
                <label className="tier-option">
                  <input
                    type="radio"
                    name="tier"
                    value="premium"
                    checked={localFilters.tier === "premium"}
                    onChange={() => handleTierChange("premium")}
                  />
                  <span className="premium-badge">Premium</span>
                </label>
                <label className="tier-option">
                  <input
                    type="radio"
                    name="tier"
                    value="basic"
                    checked={localFilters.tier === "basic"}
                    onChange={() => handleTierChange("basic")}
                  />
                  <span>Basic</span>
                </label>
              </div>
            </div>
          </div>

          <div className="filters-footer">
            <button className="clear-filters-btn" onClick={handleClear}>
              Clear All
            </button>
            <button className="apply-filters-btn" onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters;
