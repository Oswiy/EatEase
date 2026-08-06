import React, { useState, useEffect, useRef } from "react";
import VerificationRequest from "../VerificationRequest/VerificationRequest";
import "./RestaurantOwnerDashboard.css";
import ManualOccupancyLogger from "./ManualOccupancyLogger";
// Import tab components (we'll create owner versions)
import OwnerOverviewTab from "./OwnerOverviewTab";
import OwnerMenuTab from "./OwnerMenuTab";
import OwnerReviewsTab from "./OwnerReviewsTab";
import OwnerPhotosTab from "./OwnerPhotosTab";
import AnalyticsTab from "./AnalyticsTab";
import ImageUpload from "../ImageUpload/ImageUpload";
// Add this with your other imports:
import SpotHoldManagement from "../SpotHoldManagement/SpotHoldManagement"; // Or the correct path
import pollingService from "../../services/pollingService"; // Adjust path
import { BASE_URL } from "../../config";
import { useToast } from "../../context/ToastContext";

function RestaurantOwnerDashboard({ user }) {
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featuredDescription, setFeaturedDescription] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [menuText, setMenuText] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);
  const [tier, setTier] = useState("basic");
  const [showMenu, setShowMenu] = useState(false); // Toggle hamburger menu
  const menuRef = useRef(null); // Ref for detecting clicks outside hamburger menu
  const [canBeFeatured, setCanBeFeatured] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cuisine_type: "",
    address: "",
    phone: "",
    hours: "",
    max_capacity: 50,
    current_occupancy: 0,
    features: [],
  });
  const [editingImageType, setEditingImageType] = useState(null); // 'profile' or 'banner'
  const [promoText, setPromoText] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const { showToast } = useToast();
  // ===== HELPER FUNCTION TO GET CORRECT IMAGE URL =====
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL (starts with http), use it directly
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Otherwise, assume it's a local storage path
    return `${BASE_URL}/storage/${imagePath}`;
  };

  useEffect(() => {
    if (user && user.user_type === "restaurant_owner") {
      fetchTier();
      fetchRestaurant();
    }
  }, [user]);

  // Add polling useEffect inside the component
  useEffect(() => {
    if (!restaurant || !restaurant.id) return;

    const unsubscribe = pollingService.subscribe(
      restaurant.id,
      (updatedData) => {
        // Only update current_occupancy – let child components recalc crowd status and percentage
        setRestaurant((prev) => ({
          ...prev,
          current_occupancy: updatedData.current_occupancy,
        }));
      },
    );

    return () => unsubscribe();
  }, [restaurant?.id]); // Only re-run if restaurant ID changes

  // Effect for closing hamburger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRenewSubscription = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/renew-premium`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast("Premium subscription renewed for 30 days!", "success", 3000);
        setShowRenewModal(false);
        fetchRestaurant(); // Refresh restaurant data
      } else {
        showToast("Failed to renew: " + data.message, "error", 3000);
      }
    } catch (error) {
      console.error("Renew error:", error);
      showToast(
        "Failed to renew subscription. Please try again.",
        "error",
        3000,
      );
    }
  };

  const handleSavePromo = async () => {
    if (!restaurant?.is_featured) {
      showToast(
        "Only featured restaurants can add promo text",
        "warning",
        3000,
      );
      return;
    }

    if (promoText.length > 100) {
      showToast("Promo text must be 100 characters or less", "warning", 3000);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/promo`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          promo_text: promoText,
          show_promo: showPromo,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showToast("Promo text saved!", "success", 3000);
        fetchRestaurant(); // Refresh restaurant data
        if (showPromoModal) setShowPromoModal(false); // Close modal if open
      } else {
        showToast("Failed to save promo: " + data.message, "error", 3000);
      }
    } catch (error) {
      console.error("Error saving promo:", error);
      showToast("Error saving promo text", "error", 3000);
    }
  };

  const fetchTier = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(`${BASE_URL}/api/subscription/tier`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      // console.log("Tier API Response:", data);

      if (data.success) {
        setTier(data.tier);
        setCanBeFeatured(data.can_be_featured);

        // Handle case where user needs to create restaurant first
        if (data.needs_setup) {
          // console.log("User needs to create a restaurant first");
          setShowCreateRestaurant(true);
        }
      } else {
        console.error("Tier API error:", data.message);

        // If restaurant not found, default to basic tier
        if (
          data.message === "Restaurant not found" ||
          data.message === "No restaurant found"
        ) {
          setTier("basic");
          setCanBeFeatured(false);
          setShowCreateRestaurant(true);
        }
      }
    } catch (error) {
      console.error("Error fetching tier:", error);
      // Default to basic on error
      setTier("basic");
      setCanBeFeatured(false);
    }
  };

  const handleFeatureRequest = async () => {
    // Check if already featured
    if (restaurant.is_featured) {
      // Ask if they want to unfeature
      await unfeatureRestaurant();
      return;
    }

    // Not featured yet - check requirements
    if (!restaurant.banner_image) {
      // No banner - ask to upload one
      showToast(
        "To be featured, please upload a banner image first.",
        "warning",
        4000,
      );
      setEditingImageType("banner");
      return;
    }

    // Has banner - confirm featuring
    await featureRestaurant();
  };

  const featureRestaurant = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/feature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast("Your restaurant is now featured!", "success", 3000);
        fetchRestaurant(); // Refresh restaurant data
      } else {
        showToast(
          "Failed to feature: " + (data.message || "Unknown error"),
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Feature error:", error);
      showToast(
        "Failed to feature restaurant. Please try again.",
        "error",
        3000,
      );
    }
  };

  const unfeatureRestaurant = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/restaurant/unfeature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast("Your restaurant is no longer featured.", "info", 3000);
        fetchRestaurant(); // Refresh restaurant data
      } else {
        showToast(
          "Failed to unfeature: " + (data.message || "Unknown error"),
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Unfeature error:", error);
      showToast(
        "Failed to unfeature restaurant. Please try again.",
        "error",
        3000,
      );
    }
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${BASE_URL}/api/subscription/upgrade`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast("Successfully upgraded to Premium tier!", "success", 3000);
        setTier("premium");
        setCanBeFeatured(true);
      } else {
        showToast("Upgrade failed: " + data.message, "error", 3000);
      }
    } catch (error) {
      console.error("Error upgrading tier:", error);
      showToast("Error upgrading tier", "error", 3000);
    }
  };

  useEffect(() => {
    if (restaurant) {
      setPromoText(restaurant.promo_text || "");
      setShowPromo(restaurant.show_promo || false);
    }
  }, [restaurant]);

  const saveMenuText = async () => {
    await fetch(`${BASE_URL}/api/restaurants/${restaurantId}/menu-text`, {
      method: "POST",
      body: JSON.stringify({ menu_text: menuText }),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleRequestFeature = async () => {
    const token = localStorage.getItem("auth_token");

    if (!featuredDescription.trim()) {
      showToast(
        "Please enter a description for your featured listing!",
        "warning",
        3000,
      );
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/restaurant/request-feature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            featured_description: featuredDescription,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        showToast(
          "Feature request submitted! Our team will review it shortly.",
          "success",
          3000,
        );
        setShowFeatureModal(false);
        setFeaturedDescription("");
        fetchRestaurant();
      } else {
        showToast(
          "Failed to submit request: " + (data.message || "Unknown error"),
          "error",
          3000,
        );
      }
    } catch (error) {
      console.error("Feature request error:", error);
      showToast("Failed to submit request. Please try again.", "error", 3000);
    }
  };

  const fetchRestaurant = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(`${BASE_URL}/api/restaurant/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      // console.log("Restaurant API Response:", data);

      if (response.status === 404) {
        setRestaurant(null);
        // Check if it's the "needs_setup" 404
        if (data.needs_setup) {
          setShowCreateRestaurant(true);
        }
      } else if (response.ok && data.success) {
        setRestaurant(data.restaurant);
        setShowCreateRestaurant(false);

        // Update tier based on restaurant data
        if (data.restaurant) {
          setTier(data.restaurant.subscription_tier || "basic");
          setCanBeFeatured(data.restaurant.can_be_featured || false);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      setRestaurant(null);
      setShowCreateRestaurant(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageUrl, imagePath) => {
    setRestaurant((prev) => ({
      ...prev,
      profile_image: imageUrl,
      // Update based on type
    }));
    // Optional: Refresh restaurant data
    fetchRestaurant();
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    setSaving(true);
    const phoneDigits = formData.phone
      ? formData.phone.replace(/^\+63/, "")
      : "";
    if (phoneDigits.length !== 10) {
      showToast(
        "Please enter a valid 10-digit phone number after +63",
        "warning",
        3000,
      );
      setSaving(false);
      return;
    }
    if (!formData.openHour || !formData.closeHour) {
      showToast(
        "Please enter valid opening and closing hours",
        "warning",
        3000,
      );
      setSaving(false);
      return;
    }
    const open = parseInt(formData.openHour);
    const close = parseInt(formData.closeHour);
    if (open < 1 || open > 12 || close < 1 || close > 12) {
      showToast("Hours must be between 1 and 12", "warning", 3000);
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("auth_token");

    const dataToSend = {
      name: formData.name,
      cuisine_type: Array.isArray(formData.cuisine_type)
        ? formData.cuisine_type.join(", ")
        : formData.cuisine_type,
      address: formData.address,
      phone: formData.phone,
      hours: `${formData.openHour || "8"}${formData.openAmPm || "AM"}-${formData.closeHour || "10"}${formData.closeAmPm || "PM"}`,
      max_capacity: Number(formData.max_capacity) || 50,
      current_occupancy: Number(formData.current_occupancy) || 0,
      features: Array.isArray(formData.features) ? formData.features : [],
      is_featured: false,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/restaurant/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setRestaurant(data.restaurant);
        setIsEditing(false);
        setFormData({
          name: "",
          cuisine_type: "",
          address: "",
          phone: "",
          hours: "",
          max_capacity: 50,
          current_occupancy: 0,
          features: [],
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-owner-dashboard">
        <div className="loading-container">
          <div className="restaurant-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-owner-dashboard">
      {!restaurant ? (
        // No restaurant setup yet
        <div className="setup-prompt">
          <div className="restaurant-empty-state">
            <h3>No Restaurant Setup Yet</h3>
            <p>Set up your restaurant profile to start receiving diners</p>

            {/* Tier info for new users */}
            <div className="tier-info-prompt">
              <h4>
                {" "}
                <span className={`tier-badge ${tier}`}>
                  {tier === "premium" ? "Premium" : "Free Tier"}
                </span>
              </h4>
            </div>

            <button className="setup-btn" onClick={() => setIsEditing(true)}>
              Set Up My Restaurant
            </button>
          </div>
        </div>
      ) : (
        // Restaurant exists - show enhanced dashboard
        <div className="restaurant-owner-view">
          {/* Header with Title and Logout */}
          {/* BANNER IMAGE SECTION - Right after title row */}
          <div className="restaurant-banner-section">
            {restaurant.banner_image ? (
              <div className="restaurant-banner-container">
                <img
                  src={getImageUrl(restaurant.banner_image)}
                  alt={`${restaurant.name} banner`}
                  className="restaurant-banner-img"
                />
                <button
                  className="edit-image-btn banner-btn"
                  onClick={() => setEditingImageType("banner")}
                  title="Edit banner image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="13px"
                    viewBox="0 -960 960 960"
                    width="13px"
                    fill="white"
                  >
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  </svg>
                </button>
                <div className="banner-background"></div>
              </div>
            ) : (
              <div className="restaurant-banner-placeholder">
                <div className="banner-placeholder-content">
                  <button
                    className="add-banner-btn"
                    onClick={() => setEditingImageType("banner")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="13px"
                      viewBox="0 -960 960 960"
                      width="13px"
                      fill="currentColor"
                    >
                      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                    Add Banner
                  </button>
                </div>
                <div className="banner-background"></div>
              </div>
            )}
          </div>
          <div className="owner-title-row">
            <div className="restaurant-title-section">
              {/* PROFILE IMAGE + NAME */}
              <div className="restaurant-header-profile">
                {/* Profile Image with Edit Button */}
                <div className="profile-image-container">
                  {restaurant.profile_image ? (
                    <img
                      src={getImageUrl(restaurant.profile_image)}
                      alt={restaurant.name}
                      className="restaurant-profile-img"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      {restaurant.name.charAt(0)}
                    </div>
                  )}
                  <button
                    className="edit-image-btn small-btn"
                    onClick={() => setEditingImageType("profile")}
                    title="Edit profile image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="13px"
                      viewBox="0 -960 960 960"
                      width="13px"
                      fill="white"
                    >
                      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                  </button>
                </div>

                {/* Restaurant Name */}
                <div className="restaurant-header-info">
                  <h2 className="restaurant-owner-name">{restaurant.name}</h2>
                </div>
                {/* Hamburger Menu with Dropdown - Only Edit & Logout */}
                <div className="menu-container" ref={menuRef}>
                  <button
                    className="menu-button"
                    onClick={() => setShowMenu(!showMenu)}
                    aria-label="Toggle menu"
                  >
                    {/* Hamburger Icon SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="currentColor"
                      className={`hamburger-icon ${showMenu ? "active" : ""}`}
                    >
                      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                  </button>

                  {/* Dropdown Menu - Only Edit Profile and Logout */}
                  {showMenu && (
                    <div className="dropdown-menu">
                      <button
                        className="dropdown-item edit-item"
                        onClick={() => {
                          const hoursVal = restaurant.hours || "";
                          let openHour = "8",
                            openAmPm = "AM",
                            closeHour = "10",
                            closeAmPm = "PM";
                          if (hoursVal !== "24/7") {
                            const match = hoursVal.match(
                              /^(\d+)(AM|PM)-(\d+)(AM|PM)$/i,
                            );
                            if (match) {
                              openHour = match[1];
                              openAmPm = match[2].toUpperCase();
                              closeHour = match[3];
                              closeAmPm = match[4].toUpperCase();
                            }
                          }
                          setFormData({
                            name: restaurant.name,
                            cuisine_type: Array.isArray(restaurant.cuisine_type)
                              ? restaurant.cuisine_type
                              : restaurant.cuisine_type
                                ? restaurant.cuisine_type
                                    .split(", ")
                                    .filter(Boolean)
                                : [],
                            address: restaurant.address,
                            phone: restaurant.phone,
                            hours: "",
                            openHour,
                            openAmPm,
                            closeHour,
                            closeAmPm,
                            max_capacity: restaurant.max_capacity,
                            current_occupancy: restaurant.current_occupancy,
                            features: restaurant.features || [],
                          });
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="13px"
                          viewBox="0 -960 960 960"
                          width="13px"
                          fill="currentColor"
                        >
                          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                        </svg>
                        <span>Edit Profile</span>
                      </button>

                      {/* Be Featured Button - Only for Premium */}
                      {tier === "premium" && (
                        <button
                          className="dropdown-item feature-item"
                          onClick={() => {
                            setShowMenu(false);
                            handleFeatureRequest();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="13px"
                            viewBox="0 -960 960 960"
                            width="13px"
                            fill={restaurant.is_featured ? "green" : "gold"}
                          >
                            {restaurant.is_featured ? (
                              // Checkmark icon for already featured
                              <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170Zm56 192q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                            ) : (
                              // Star icon for not featured
                              <path d="M480-80 360-320l-280-40 200-192-56-280 216 160 216-160-56 280 200 192-280 40-120 240Z" />
                            )}
                          </svg>
                          <span>
                            {restaurant.is_featured
                              ? "Featured ✓"
                              : "Be Featured"}
                          </span>
                        </button>
                      )}

                      {restaurant.is_featured && (
                        <div className="dropdown-promo-section">
                          <div className="promo-header-small">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="#ffd43b"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>Promo Text</span>
                          </div>

                          <div className="promo-input-group-small">
                            <input
                              type="text"
                              value={promoText}
                              onChange={(e) =>
                                setPromoText(e.target.value.slice(0, 30))
                              }
                              placeholder="e.g., '20% Off Today'"
                              maxLength={50}
                              className="dropdown-promo-input"
                            />
                            <div className="char-count-small">
                              {promoText.length}/30
                            </div>
                          </div>

                          <div className="promo-toggle-row">
                            <label className="toggle-label-small">
                              <input
                                type="checkbox"
                                checked={showPromo}
                                onChange={(e) => setShowPromo(e.target.checked)}
                              />
                              <span id="toggle-text-small">
                                Show in carousel
                              </span>
                            </label>
                            <button
                              onClick={handleSavePromo}
                              id="save-promo-btn-small"
                              disabled={!promoText.trim()}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleLogout();
                        }}
                        className="dropdown-item logout-btn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="13px"
                          viewBox="0 -960 960 960"
                          width="13px"
                          fill="red"
                        >
                          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                        </svg>
                        <span>Log Out</span>
                      </button>

                      <div className="dropdown-restaurant-id">
                        Restaurant ID: {restaurant.id}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="content-wrapper">
            <div className="owner-header">
              {/* Restaurant Name and Verification Status */}

              {/* Quick Stats */}
              <div className="owner-quick-stats">
                <div className="owner-stat-card">
                  <span className="owner-stat-value">
                    {restaurant.current_occupancy}/{restaurant.max_capacity}
                  </span>
                  <span className="owner-stat-label">Current Capacity</span>
                </div>
                <div className="owner-stat-card">
                  <span className="owner-stat-value">
                    {Math.round(
                      (restaurant.current_occupancy / restaurant.max_capacity) *
                        100,
                    )}
                    %
                  </span>
                  <span className="owner-stat-label">Occupancy</span>
                </div>
                <div className="owner-stat-card">
                  <span
                    className={`owner-stat-value status-${(() => {
                      const percent =
                        (restaurant.current_occupancy /
                          restaurant.max_capacity) *
                        100;
                      if (percent >= 90) return "red";
                      if (percent >= 70) return "orange";
                      if (percent >= 40) return "yellow";
                      return "green";
                    })()}`}
                  >
                    {(() => {
                      const percent =
                        (restaurant.current_occupancy /
                          restaurant.max_capacity) *
                        100;
                      if (percent >= 90) return "Very High";
                      if (percent >= 70) return "Busy";
                      if (percent >= 40) return "Moderate";
                      return "Low";
                    })()}
                  </span>
                  <span className="owner-stat-label">Crowd Status</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="owner-tab-navigation">
              <button
                className={`owner-tab-btn ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`owner-tab-btn ${
                  activeTab === "menu" ? "active" : ""
                }`}
                onClick={() => setActiveTab("menu")}
              >
                Menu
              </button>
              <button
                className={`owner-tab-btn ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
              <button
                className={`owner-tab-btn ${
                  activeTab === "photos" ? "active" : ""
                }`}
                onClick={() => setActiveTab("photos")}
              >
                Photos
              </button>

              {/*RESERVATIONS TAB */}
              <button
                className={`owner-tab-btn ${
                  activeTab === "reservations" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reservations")}
              >
                Reservations
              </button>
              <button
                className={`owner-tab-btn ${
                  activeTab === "analytics" ? "active" : ""
                } ${tier === "premium" ? "premium-unlocked" : "premium-locked"}`}
                onClick={() => setActiveTab("analytics")}
                title={
                  tier === "basic"
                    ? "Upgrade to Premium to access analytics"
                    : "View analytics"
                }
              >
                {tier === "premium" ? "Analytics" : "Analytics"}
              </button>
            </div>

            {/* Tab Content */}
            {/* Tab Content — all tabs stay mounted, hidden when inactive */}
            <div className="owner-tab-content">
              <div
                style={{ display: activeTab === "overview" ? "block" : "none" }}
              >
                <OwnerOverviewTab
                  restaurant={restaurant}
                  tier={tier}
                  handleUpgrade={handleUpgrade}
                  onEdit={() => {
                    const hoursVal = restaurant.hours || "";
                    let openHour = "8",
                      openAmPm = "AM",
                      closeHour = "10",
                      closeAmPm = "PM";
                    if (hoursVal !== "24/7") {
                      const match = hoursVal.match(
                        /^(\d+)(AM|PM)-(\d+)(AM|PM)$/i,
                      );
                      if (match) {
                        openHour = match[1];
                        openAmPm = match[2].toUpperCase();
                        closeHour = match[3];
                        closeAmPm = match[4].toUpperCase();
                      }
                    }
                    setFormData({
                      name: restaurant.name,
                      cuisine_type: Array.isArray(restaurant.cuisine_type)
                        ? restaurant.cuisine_type
                        : restaurant.cuisine_type
                          ? restaurant.cuisine_type.split(", ").filter(Boolean)
                          : [],
                      address: restaurant.address,
                      phone: restaurant.phone,
                      hours: "",
                      openHour,
                      openAmPm,
                      closeHour,
                      closeAmPm,
                      max_capacity: restaurant.max_capacity,
                      current_occupancy: restaurant.current_occupancy,
                      features: restaurant.features || [],
                    });
                    setIsEditing(true);
                  }}
                  onUpdateOccupancy={(newOccupancy) => {
                    setRestaurant((prev) => ({
                      ...prev,
                      current_occupancy: newOccupancy,
                    }));
                  }}
                  onRenewSuccess={fetchRestaurant}
                />
              </div>
              <div style={{ display: activeTab === "menu" ? "block" : "none" }}>
                <OwnerMenuTab restaurantId={restaurant.id} />
              </div>
              <div
                style={{ display: activeTab === "reviews" ? "block" : "none" }}
              >
                <OwnerReviewsTab restaurantId={restaurant.id} />
              </div>
              <div
                style={{ display: activeTab === "photos" ? "block" : "none" }}
              >
                <OwnerPhotosTab restaurant={restaurant} />
              </div>
              <div
                style={{
                  display: activeTab === "reservations" ? "block" : "none",
                }}
              >
                <SpotHoldManagement restaurant={restaurant} />
              </div>
              <div
                style={{
                  display: activeTab === "analytics" ? "block" : "none",
                }}
              >
                <AnalyticsTab
                  restaurantId={restaurant.id}
                  isPremium={tier === "premium"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Setup Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{restaurant ? "Edit Restaurant" : "Setup Restaurant"}</h3>

            <form onSubmit={handleSaveRestaurant}>
              {/* Restaurant Name */}
              <div className="form-group">
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value.slice(0, 50),
                    })
                  }
                  placeholder="Enter restaurant name"
                  maxLength={50}
                  required
                />
                <small className="setting-char-count">
                  {(formData.name || "").length}/50
                </small>
              </div>

              {/* Cuisine Type - Tag Style */}
              <div className="form-group">
                <label>Cuisine Type * (max 5)</label>
                <div className="cuisine-tags">
                  {(Array.isArray(formData.cuisine_type)
                    ? formData.cuisine_type
                    : formData.cuisine_type
                      ? [formData.cuisine_type]
                      : []
                  ).map((tag, index) => (
                    <span key={index} className="cuisine-tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const tags = Array.isArray(formData.cuisine_type)
                            ? formData.cuisine_type
                            : [formData.cuisine_type];
                          setFormData({
                            ...formData,
                            cuisine_type: tags.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {(Array.isArray(formData.cuisine_type)
                  ? formData.cuisine_type
                  : formData.cuisine_type
                    ? [formData.cuisine_type]
                    : []
                ).length < 5 && (
                  <div className="cuisine-input-row">
                    <input
                      type="text"
                      id="cuisine-input"
                      placeholder="e.g., Filipino, Cafe, Asian"
                      maxLength={50}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (!val) return;
                          const current = Array.isArray(formData.cuisine_type)
                            ? formData.cuisine_type
                            : formData.cuisine_type
                              ? [formData.cuisine_type]
                              : [];
                          if (current.length >= 5) return;
                          setFormData({
                            ...formData,
                            cuisine_type: [...current, val],
                          });
                          e.target.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("cuisine-input");
                        const val = input.value.trim();
                        if (!val) return;
                        const current = Array.isArray(formData.cuisine_type)
                          ? formData.cuisine_type
                          : formData.cuisine_type
                            ? [formData.cuisine_type]
                            : [];
                        if (current.length >= 5) return;
                        setFormData({
                          ...formData,
                          cuisine_type: [...current, val],
                        });
                        input.value = "";
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value.slice(0, 150),
                    })
                  }
                  placeholder="Full address"
                  maxLength={150}
                  required
                />
                <small className="setting-char-count">
                  {(formData.address || "").length}/150
                </small>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="phone-input-row">
                  <span className="phone-prefix">+63</span>
                  <input
                    type="tel"
                    value={
                      formData.phone ? formData.phone.replace(/^\+63/, "") : ""
                    }
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setFormData({ ...formData, phone: "+63" + digits });
                    }}
                    placeholder="9XX XXX XXXX"
                    maxLength={10}
                    required
                  />
                </div>
                <small className="setting-char-count">
                  {
                    (formData.phone ? formData.phone.replace(/^\+63/, "") : "")
                      .length
                  }
                  /10 digits
                </small>
              </div>

              {/* Operating Hours */}
              <div className="form-group">
                <label>Operating Hours *</label>
                <div className="hours-input-row">
                  <div className="hours-field">
                    <span>Opens</span>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.openHour || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openHour: e.target.value,
                          hours: "",
                        })
                      }
                      placeholder="8"
                      style={{ width: "60px" }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <select
                      value={formData.openAmPm || "AM"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openAmPm: e.target.value,
                          hours: "",
                        })
                      }
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                  <span>—</span>
                  <div className="hours-field">
                    <span>Closes</span>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.closeHour || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closeHour: e.target.value,
                          hours: "",
                        })
                      }
                      placeholder="10"
                      style={{ width: "60px" }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <select
                      value={formData.closeAmPm || "PM"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closeAmPm: e.target.value,
                          hours: "",
                        })
                      }
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Max Capacity */}
              <div className="form-group">
                <label>Max Capacity *</label>
                <input
                  type="number"
                  value={formData.max_capacity || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      max_capacity:
                        val === "" ? 0 : Math.max(0, parseInt(val) || 0),
                    });
                  }}
                  placeholder="Maximum number of customers"
                  min="0"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  required
                />
              </div>

              {/* Current Occupancy */}
              <div className="form-group">
                <label>Current Occupancy</label>
                <input
                  type="number"
                  value={formData.current_occupancy || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      current_occupancy:
                        val === "" ? 0 : Math.max(0, Number(val) || 0),
                    });
                  }}
                  placeholder="Current number of customers"
                  min="0"
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              {/* Features */}
              <div className="form-group">
                <label>Features (optional)</label>
                <div className="features-checkboxes">
                  {[
                    "WiFi",
                    "Parking",
                    "Air Conditioned",
                    "Outdoor Seating",
                    "Takeout",
                    "Delivery",
                  ].map((feature, index) => (
                    <label
                      key={`feature-${index}`}
                      className="feature-checkbox"
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...formData.features, feature]
                            : formData.features.filter((f) => f !== feature);
                          setFormData({ ...formData, features: newFeatures });
                        }}
                      />
                      <span className="checkbox-label">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? (
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
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Request Modal */}
      {showVerificationForm && (
        <div className="modal-overlay">
          <div className="modal-content verification-modal">
            <VerificationRequest
              restaurant={restaurant}
              onRequestSubmitted={() => {
                fetchRestaurant();
              }}
              onClose={() => setShowVerificationForm(false)}
            />
          </div>
        </div>
      )}

      {/* Be Featured Now Modal */}
      {showFeatureModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowFeatureModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Be Featured Now</h3>
            <p className="modal-subtitle">
              Get premium visibility on the homepage! Featured restaurants get
              3x more views.
            </p>

            <div className="benefits-list">
              <h4>Featured Benefits:</h4>
              <ul>
                <li>Top placement on homepage</li>
                <li>3x more visibility</li>
                <li>Special featured badge</li>
                <li>Custom description display</li>
                <li>Priority in search results</li>
              </ul>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowFeatureModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestFeature}
                disabled={!featuredDescription.trim()}
                className="primary-btn"
              >
                Submit Feature Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {editingImageType && (
        <div
          className="modal-overlay image-upload-modal"
          onClick={() => setEditingImageType(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingImageType === "profile"
                  ? "Edit Profile Image"
                  : "Edit Banner Image"}
              </h3>
              <button
                className="close-modal-btn"
                onClick={() => setEditingImageType(null)}
              >
                ✕
              </button>
            </div>

            <ImageUpload
              type={editingImageType}
              currentImage={
                editingImageType === "profile"
                  ? restaurant.profile_image || null //   Pass raw URL, don't use getImageUrl
                  : restaurant.banner_image || null //   Pass raw URL, don't use getImageUrl
              }
              onUploadSuccess={(url, path) => {
                if (editingImageType === "profile") {
                  setRestaurant((prev) => ({
                    ...prev,
                    profile_image: url,
                  }));
                } else {
                  setRestaurant((prev) => ({
                    ...prev,
                    banner_image: url,
                  }));
                }
                setEditingImageType(null);
                // Show success toast
                showToast(
                  `${editingImageType === "profile" ? "Profile" : "Banner"} image updated successfully!`,
                  "success",
                  3000,
                );
              }}
              restaurantId={restaurant.id}
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setEditingImageType(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantOwnerDashboard;
