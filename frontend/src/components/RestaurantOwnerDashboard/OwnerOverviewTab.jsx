import React, { useState, useEffect } from "react"; // Add useEffect
import "./OwnerOverviewTab.css";
import { BASE_URL } from "../../config";

const OwnerOverviewTab = ({
  restaurant,
  onEdit,
  onUpdateOccupancy,
  tier,
  handleUpgrade,
}) => {
  const [isEditingOccupancy, setIsEditingOccupancy] = useState(false);
  const [newOccupancy, setNewOccupancy] = useState(
    restaurant.current_occupancy,
  );
  const [loading, setLoading] = useState(false);

  // ✅ ADD THESE STATE VARIABLES
  const [expiryStatus, setExpiryStatus] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [remainingDays, setRemainingDays] = useState(null);

  // ✅ ADD THIS USEEFFECT FOR EXPIRY CALCULATION
  useEffect(() => {
    if (
      restaurant &&
      restaurant.subscription_tier === "premium" &&
      restaurant.subscription_ends_at
    ) {
      // Format expiry date
      const expiry = new Date(restaurant.subscription_ends_at);
      const formattedDate = expiry.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setExpiryDate(formattedDate);

      // Calculate days left
      const now = new Date();
      const timeDiff = expiry - now;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setRemainingDays(daysLeft);

      // Set status for styling
      if (daysLeft <= 0) {
        setExpiryStatus("expired");
      } else if (daysLeft <= 7) {
        setExpiryStatus("warning");
      } else {
        setExpiryStatus("active");
      }
    } else {
      // Reset if not premium or no expiry date
      setExpiryStatus(null);
      setExpiryDate(null);
      setRemainingDays(null);
    }
  }, [restaurant]);

  const handleRenewSubscription = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/renew-premium`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Premium renewed! New expiry: ${data.expires_at}`);
        // Trigger a refresh of restaurant data
        if (window.location.reload) {
          window.location.reload(); // Simple refresh
        }
      } else {
        alert("Renewal failed: " + data.message);
      }
    } catch (error) {
      console.error("Renewal error:", error);
      alert("Error renewing subscription");
    }
  };

  const handleUpdateOccupancy = async () => {
    if (newOccupancy < 0 || newOccupancy > restaurant.max_capacity) {
      alert(`Occupancy must be between 0 and ${restaurant.max_capacity}`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      // ✅ FIX: Use correct URL (localhost:8000, not EatEase-Backend)
      const response = await fetch(`${BASE_URL}/api/restaurant/occupancy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          current_occupancy: Number(newOccupancy),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Occupancy updated successfully!");
        setIsEditingOccupancy(false);

        // ✅ DON'T refresh page - polling will update automatically
        // Instead, update local state
        if (onUpdateOccupancy) {
          onUpdateOccupancy(newOccupancy);
        }
      } else {
        alert(
          "Failed to update occupancy: " + (data.message || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error updating occupancy:", error);
      alert("Error updating occupancy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCrowdStatusText = (status) => {
    switch (status) {
      case "green":
        return "Low";
      case "yellow":
        return "Moderate";
      case "orange":
        return "Busy";
      case "red":
        return "Very High";
      default:
        return "Unknown";
    }
  };

  const getCrowdStatusColor = (percentage) => {
    if (percentage <= 50) return "green";
    if (percentage <= 79) return "yellow";
    if (percentage <= 89) return "orange";
    return "red";
  };

  // Calculate occupancy percentage
  const occupancyPercentage =
    restaurant.max_capacity > 0
      ? Math.round(
          (restaurant.current_occupancy / restaurant.max_capacity) * 100,
        )
      : 0;

  // Calculate crowd status based on percentage
  const calculatedCrowdStatus = getCrowdStatusColor(occupancyPercentage);

  return (
    <div className="owner-overview-tab">
      <div className="tab-section">
        <div className="section-header">
          <h3>Tier Level</h3>
        </div>
        <div className="tier-display">
          {tier === "basic" ? (
            <div className="basic-tier-display">
              <div className="tier-info-row">
                <span className="tier-badge basic">Free Tier</span>
                <p className="tier-description">
                  • Manual updates only
                  <br />
                  • Cannot apply for featured status
                  <br />• No customer analytics
                  <br />• Not eligible to be advertised
                </p>
              </div>
              <button className="tier-upgrade-btn" onClick={handleUpgrade}>
                Upgrade to Premium
              </button>
            </div>
          ) : (
            <div className="premium-tier-display">
              <div className="premium-tier-info">
                <span className="tier-badge premium">Premium</span>

                {/* ✅ ADD EXPIRY DISPLAY HERE */}
                {expiryDate && (
                  <div className={`premium-expiry-display ${expiryStatus}`}>
                    <div className="expiry-row">
                      <span className="expiry-label">
                        Subscription ends on:
                      </span>
                      <span className="expiry-date">{expiryDate}</span>
                    </div>

                    {remainingDays !== null && (
                      <div className="expiry-details">
                        {remainingDays > 0 ? (
                          <>
                            <span className={`days-left ${expiryStatus}`}>
                              {remainingDays}{" "}
                              {remainingDays === 1 ? "day" : "days"} left
                            </span>

                            {/* ✅ Show Renew button only when ≤ 7 days AND > 0 days */}
                            {remainingDays <= 7 && remainingDays > 0 && (
                              <button
                                className="renew-now-btn"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Renew your premium subscription for 30 days?\n\nYou'll keep all premium features for another month.",
                                    )
                                  ) {
                                    handleRenewSubscription();
                                  }
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 -960 960 960"
                                  fill="currentColor"
                                >
                                  <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                                </svg>
                                Renew Now
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="days-left expired">Expired</span>

                            {/* Show Renew button even when expired */}
                            <button
                              className="renew-now-btn"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Your premium subscription has expired. Renew for 30 days to restore premium features?",
                                  )
                                ) {
                                  handleRenewSubscription();
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 -960 960 960"
                                fill="currentColor"
                              >
                                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
                              </svg>
                              Renew Subscription
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="section-header">
          <h3>Location & Contact</h3>
          <button className="section-edit-btn" onClick={onEdit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="17px"
              viewBox="0 -960 960 960"
              width="17px"
              fill="black"
            >
              <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
            </svg>
          </button>
        </div>
        <div className="info-grid">
          <div className="info-section">
            <div className="section-title">
              <h3 className="section-title" id="section-title-location">
                <svg
                  className="location-icon"
                  width="20"
                  height="20"
                  viewBox="0 -960 960 960"
                  fill="black"
                  aria-hidden="true"
                >
                  <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg>
                Location:
              </h3>
            </div>
            <p className="section-content">{restaurant.address}</p>
          </div>

          <div className="info-section">
            <h3 className="section-title">
              <svg
                width="20"
                height="20"
                viewBox="0 -960 960 960"
                fill="black"
                aria-hidden="true"
              >
                <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
              </svg>
              Contact:
            </h3>
            <p className="section-content">
              {restaurant.phone || "Not provided"}
            </p>
          </div>

          <div className="info-section">
            <h3 className="section-title">
              <svg
                width="20"
                height="20"
                viewBox="0 -960 960 960"
                fill="black"
                aria-hidden="true"
              >
                <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
              </svg>
              Operating Hours:
            </h3>
            <p className="section-content">
              {restaurant.hours || "Not specified"}
            </p>
          </div>
          <div className="info-section">
            <h3 className="section-title">
              <svg
                width="20"
                height="20"
                viewBox="0 -960 960 960"
                fill="black"
                aria-hidden="true"
              >
                <path d="m175-120-56-56 410-410q-18-42-5-95t57-95q53-53 118-62t106 32q41 41 32 106t-62 118q-42 44-95 57t-95-5l-50 50 304 304-56 56-304-302-304 302Zm118-342L173-582q-54-54-54-129t54-129l248 250-128 128Z" />
              </svg>
              Cuisine:
            </h3>
            <p className="section-content">
              {restaurant.cuisine_type || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      <div className="tab-section">
        <div className="section-header">
          <h3>Features & Amenities</h3>
          <button className="section-edit-btn" onClick={onEdit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="17px"
              viewBox="0 -960 960 960"
              width="17px"
              fill="black"
            >
              <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
            </svg>
          </button>
        </div>

        {restaurant.features && restaurant.features.length > 0 ? (
          <div className="overview-features-list">
            {restaurant.features.map((feature, index) => (
              <span key={index} className="feature-tag">
                {feature}
              </span>
            ))}
          </div>
        ) : (
          <p className="no-features">No features added yet.</p>
        )}
      </div>

      <div className="tab-section">
        <div className="section-header">
          <h3>Current Status</h3>
          <div className="status-header-actions">
            {!isEditingOccupancy ? (
              <button
                className="update-occupancy-btn"
                onClick={() => setIsEditingOccupancy(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="11px"
                  viewBox="0 -960 960 960"
                  width="11px"
                  fill="white"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
                Update
              </button>
            ) : (
              <div className="occupancy-edit-controls">
                <input
                  type="number"
                  value={newOccupancy}
                  onChange={(e) => setNewOccupancy(e.target.value)}
                  min="0"
                  max={restaurant.max_capacity}
                  className="occupancy-input"
                  placeholder="Enter current occupancy"
                />
                <button
                  className="status-save-btn"
                  onClick={handleUpdateOccupancy}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="status-cancel-btn"
                  onClick={() => {
                    setIsEditingOccupancy(false);
                    setNewOccupancy(restaurant.current_occupancy);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="status-info">
          <div className="status-item">
            <span className="status-label">Current Crowd:</span>
            <span className={`status-value status-${calculatedCrowdStatus}`}>
              {getCrowdStatusText(calculatedCrowdStatus)}
              {calculatedCrowdStatus !== restaurant.crowd_status && (
                <span className="status-note">
                  {" "}
                  (Calculated: {getCrowdStatusText(restaurant.crowd_status)} in
                  DB)
                </span>
              )}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Capacity:</span>
            <span className="status-value">
              {restaurant.current_occupancy}/{restaurant.max_capacity} people
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Occupancy:</span>
            <span className="status-value">{occupancyPercentage}%</span>
          </div>
          <div className="status-visual">
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{
                  width: `${Math.min(occupancyPercentage, 100)}%`,
                  backgroundColor: getCrowdStatusColor(occupancyPercentage),
                }}
              ></div>
            </div>
            <div className="capacity-labels">
              <span>0</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOverviewTab;
