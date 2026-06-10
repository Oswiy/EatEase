import React, { useState, useEffect } from "react";
import "./MenuTab.css";
import API_CONFIG from "../../config";

const MenuTab = ({ restaurantId, restaurantName = "" }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  const parseMenuText = (text) => {
    const items = [];
    const lines = text.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.includes(" - ")) {
        const parts = trimmed.split(" - ");
        if (parts.length === 2) {
          const price = parts[1].trim().replace(/^[₱$\s]+/, "");
          items.push({
            name: parts[0].trim(),
            price: `₱${price}`,
            id: Date.now() + Math.random(),
          });
        }
      }
    });

    return items;
  };

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/menu-text`,
      );
      const data = await response.json();

      if (data.success) {
        const menuText = data.menu_description || "";
        if (menuText) {
          const parsedItems = parseMenuText(menuText);
          setMenuItems(parsedItems);
        } else {
          setMenuItems([]);
        }
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reviews-tab loading">
        <div className="tab__loading-state">
          <div className="tab__loading-spinner"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-tab">
      <div className="menu-header-section">
        <h2>{restaurantName ? `${restaurantName} Menu` : "Menu"}</h2>
        {menuItems.length > 0 && (
          <div className="menu-stats">
            <span className="stat-count">{menuItems.length} items</span>
          </div>
        )}
      </div>

      {menuItems.length > 0 ? (
        <div className="menu-content structured">
          <div className="menu-table">
            <div className="menu-table-header">
              <div className="header-column name-header">Menu Item</div>
              <div className="header-column price-header">Price</div>
            </div>
            {menuItems.map((item, index) => (
              <div key={item.id || index} className="menu-table-row">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-price">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="menu-content empty">
          <div className="empty-menu-message">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 3h18v18H3zM8 7v10m4-10v10m4-10v10"
              />
            </svg>
            <h3>No Menu Available</h3>
            <p>This restaurant hasn't added their menu yet.</p>
          </div>
        </div>
      )}

      {menuItems.length > 0 && (
        <div className="menu-footer">
          <p>
            <strong>Note:</strong> Prices are in PHP. Menu items and prices are
            subject to change.
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuTab;
