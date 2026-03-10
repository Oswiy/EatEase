import React, { useState, useEffect } from "react";
import "./OwnerMenuTab.css";

const OwnerMenuTab = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  // Load existing menu
  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://localhost/EatEase/backend/public/api/restaurants/${restaurantId}/menu-text`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        const menuText = data.menu_description || data.menu_text || "";
        if (menuText) {
          // Parse existing menu text into items array
          const parsedItems = parseMenuText(menuText);
          setMenuItems(parsedItems);
        } else {
          setMenuItems([]);
        }
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const parseMenuText = (text) => {
    const items = [];
    const lines = text.split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Try to parse format: Item Name - $Price
      if (trimmed.includes(" - $")) {
        const parts = trimmed.split(" - $");
        if (parts.length === 2) {
          items.push({
            name: parts[0].trim(),
            price: parts[1].trim(),
            id: Date.now() + Math.random(), // Temporary ID
          });
        }
      }
    });

    return items;
  };

  const formatMenuText = (items) => {
    if (items.length === 0) return "";

    return items
      .map((item) => {
        return `${item.name} - $${item.price}`;
      })
      .join("\n");
  };

  const saveMenu = async () => {
    if (!validateMenuItems()) return;

    setIsSaving(true);
    setMessage("");

    const token = localStorage.getItem("auth_token");
    try {
      const menuText = formatMenuText(menuItems);
      const response = await fetch(
        `http://localhost/EatEase/backend/public/api/restaurants/${restaurantId}/menu-text`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ menu_description: menuText }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setMessage("Menu saved successfully!");
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save menu: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving menu:", error);
      setMessage("Error saving menu");
    } finally {
      setIsSaving(false);
    }
  };

  const validateMenuItems = () => {
    for (const item of menuItems) {
      if (!item.name.trim()) {
        setMessage("Please enter a name for all menu items");
        return false;
      }
      if (
        !item.price ||
        isNaN(parseFloat(item.price)) ||
        parseFloat(item.price) <= 0
      ) {
        setMessage(
          "Please enter a valid price (positive number) for all items",
        );
        return false;
      }
    }
    return true;
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      setMessage("Please enter an item name");
      return;
    }

    if (
      !newItem.price ||
      isNaN(parseFloat(newItem.price)) ||
      parseFloat(newItem.price) <= 0
    ) {
      setMessage("Please enter a valid price (positive number)");
      return;
    }

    setMenuItems([
      ...menuItems,
      {
        ...newItem,
        id: Date.now() + Math.random(),
        price: parseFloat(newItem.price).toFixed(2),
      },
    ]);
    setNewItem({ name: "", price: "" });
    setMessage("");
  };

  const handleUpdateItem = (id, field, value) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    );
  };

  const handleRemoveItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handlePriceChange = (value, setter) => {
    // Allow only numbers and one decimal point
    const sanitized = value.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      setter(parts[0] + "." + parts.slice(1).join(""));
    } else {
      setter(sanitized);
    }
  };

  return (
    <div className="owner-menu-tab">
      <div className="menu-header">
        <h3>Restaurant Menu</h3>
        <div className="owner-menu-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="12px"
                viewBox="0 -960 960 960"
                width="12px"
                fill="White"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
              Edit Menu
            </button>
          ) : (
            <>
              <button
                onClick={saveMenu}
                disabled={isSaving}
                className="save-btn"
              >
                {isSaving ? "Saving..." : "Save Menu"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchMenu(); // Reload original menu
                }}
                className="menu-cancel-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="18"
                  fill="white"
                  viewBox="0 0 256 256"
                >
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`message ${message.includes("successfully") ? "success" : "error"}`}
        >
          {message}
        </div>
      )}

      <div className="menu-content">
        {isEditing ? (
          <div className="menu-edit-container">
            {/* Add New Item Form */}
            <div className="add-item-form">
              <h4>Add New Menu Item</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    placeholder="Name"
                    className="item-name-input"
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    value={newItem.price}
                    onChange={(e) =>
                      handlePriceChange(e.target.value, (val) =>
                        setNewItem({ ...newItem, price: val }),
                      )
                    }
                    placeholder="Price"
                    className="item-price-input"
                  />
                </div>
                <button onClick={handleAddItem} className="add-item-btn">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="menu-items-list">
              <h4>Menu Items</h4>
              {menuItems.length === 0 ? (
                <p className="no-items">No menu items yet. Add some above!</p>
              ) : (
                <div className="items-table">
                  <div className="table-header">
                    <div className="header-name">Item Name</div>
                    <div className="header-price">Price</div>
                    <div className="header-actions">Actions</div>
                  </div>
                  {menuItems.map((item) => (
                    <div key={item.id} className="item-row">
                      <div className="item-cell item-name-cell">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "name", e.target.value)
                          }
                          className="item-input"
                          placeholder="Item name"
                        />
                      </div>
                      <div className="item-cell item-price-cell">
                        <div className="price-input-wrapper">
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) =>
                              handlePriceChange(e.target.value, (val) =>
                                handleUpdateItem(item.id, "price", val),
                              )
                            }
                            className="price-input"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="item-cell item-actions-cell">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="remove-item-btn"
                          title="Remove item"
                        >
                          <svg
                            width="12"
                            height="16"
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="menu-display">
            {menuItems.length > 0 ? (
              <div className="menu-preview">
                <h4>Menu Preview</h4>
                <div className="preview-table">
                  <div className="preview-header">
                    <div className="preview-header-name">Menu Item</div>
                    <div className="preview-header-price">Price</div>
                  </div>
                  {menuItems.map((item, index) => (
                    <div key={index} className="preview-row">
                      <div className="preview-name">{item.name}</div>
                      <div className="preview-price">₱{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-menu">
                <p>No menu items added yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerMenuTab;
