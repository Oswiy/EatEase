import React, { useState, useEffect } from "react";
import "./BookmarksPage.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

function BookmarksPage({ user, onBack, onRestaurantClick }) {
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Please login to view bookmarks");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setBookmarks(data.bookmarks || []);
      } else {
        setError(data.message || "Failed to load bookmarks");
      }
    } catch (err) {
      console.error("Bookmarks fetch error:", err);
      setError("Failed to load bookmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (restaurantId, restaurantName, event) => {
    event.stopPropagation(); // Prevent card click when clicking remove button

    setRemovingId(restaurantId);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/bookmarks/${restaurantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.success && !data.isBookmarked) {
        setBookmarks((prev) =>
          prev.filter((b) => b.restaurant_id !== restaurantId),
        );
        showToast(`Removed ${restaurantName} from bookmarks`, "success", 3000);
      } else {
        showToast(data.message || "Failed to remove bookmark", "error", 3000);
      }
    } catch (error) {
      console.error("Remove bookmark error:", error);
      showToast("Failed to remove bookmark. Please try again.", "error", 3000);
    } finally {
      setRemovingId(null);
    }
  };

  const handleRestaurantClick = (bookmark) => {
    if (bookmark.is_deleted) {
      showToast("This restaurant is no longer available", "warning", 3000);
      return;
    }

    if (onRestaurantClick) {
      // Pass the restaurant data to the parent
      onRestaurantClick({
        id: bookmark.restaurant_id,
        name: bookmark.restaurant_name,
        cuisine: bookmark.cuisine,
        address: bookmark.address,
        phone: bookmark.phone,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-page__loading-state">
          <div className="bookmarks-page__loading-spinner"></div>
          <p>Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-page__header">
          <button className="bookmarks-page__back-btn" onClick={onBack}>
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </button>
          <h1 className="bookmarks-page__title">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M713-600 600-713l56-57 57 57 141-142 57 57-198 198ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Z" />
            </svg>
            My Bookmarks
          </h1>
        </div>
        <div className="bookmarks-page__error-state">
          <p>{error}</p>
          <button
            onClick={fetchBookmarks}
            className="bookmarks-page__retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      {/* Header */}
      <div className="bookmarks-page__header">
        <button className="bookmarks-page__back-btn" onClick={onBack}>
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>
        <h1 className="bookmarks-page__title">
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M713-600 600-713l56-57 57 57 141-142 57 57-198 198ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Z" />
          </svg>
          My Bookmarks
        </h1>
      </div>

      {/* Content */}
      {bookmarks.length === 0 ? (
        <div className="bookmarks-page__empty">
          <div className="bookmarks-page__empty-icon">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
            </svg>
          </div>
          <h3>No Bookmarks Yet</h3>
          <p>Bookmark restaurants you like to find them quickly here</p>
        </div>
      ) : (
        <div className="bookmarks-page__list">
          {bookmarks.map((bookmark) => {
            const isRemoving = removingId === bookmark.restaurant_id;

            return (
              <div
                key={bookmark.id}
                className={`bookmarks-page__card ${!bookmark.is_deleted ? "bookmarks-page__card--clickable" : ""}`}
                onClick={() => handleRestaurantClick(bookmark)}
              >
                {bookmark.is_deleted ? (
                  // Deleted Restaurant Card
                  <div className="bookmarks-page__card-content bookmarks-page__card-content--deleted">
                    <div className="bookmarks-page__card-info">
                      <div className="bookmarks-page__card-icon bookmarks-page__card-icon--deleted">
                        <svg viewBox="0 -960 960 960" fill="currentColor">
                          <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                        </svg>
                      </div>
                      <div className="bookmarks-page__card-details">
                        <h3 className="bookmarks-page__card-title bookmarks-page__card-title--deleted">
                          {bookmark.restaurant_name}
                        </h3>
                        <p className="bookmarks-page__deleted-message">
                          This restaurant is no longer available
                        </p>
                      </div>
                    </div>
                    <div className="bookmarks-page__card-actions">
                      <button
                        className="bookmarks-page__remove-btn"
                        onClick={(e) =>
                          handleRemoveBookmark(
                            bookmark.restaurant_id,
                            bookmark.restaurant_name,
                            e,
                          )
                        }
                        disabled={isRemoving}
                      >
                        {isRemoving ? (
                          <span className="bookmarks-page__btn-spinner"></span>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Active Restaurant Card
                  <div className="bookmarks-page__card-content">
                    <div className="bookmarks-page__card-info">
                      <div className="bookmarks-page__card-icon">
                        <svg viewBox="0 -960 960 960" fill="currentColor">
                          <path d="M713-600 600-713l56-57 57 57 141-142 57 57-198 198ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Z" />
                        </svg>
                      </div>
                      <div className="bookmarks-page__card-details">
                        <h3 className="bookmarks-page__card-title">
                          {bookmark.restaurant_name}
                        </h3>
                        <div className="bookmarks-page__card-meta">
                          <span className="bookmarks-page__meta-item">
                            <svg viewBox="0 -960 960 960" fill="currentColor">
                              <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" />
                            </svg>
                            {bookmark.address}
                          </span>
                          <span className="bookmarks-page__meta-item">
                            <svg viewBox="0 -960 960 960" fill="currentColor">
                              <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Z" />
                            </svg>
                            {bookmark.cuisine}
                          </span>
                          {bookmark.phone && (
                            <span className="bookmarks-page__meta-item">
                              <svg viewBox="0 -960 960 960" fill="currentColor">
                                <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 14-1 27t-12 23l-97 98q20 37 47.5 71.5T352-352q31 31 65 57.5t72 48.5l98-98q9-9 23-13t27-1l139 26q13 2 22.5 13t9.5 25v162q0 18-12 30t-30 12Z" />
                              </svg>
                              {bookmark.phone}
                            </span>
                          )}
                        </div>
                        <p className="bookmarks-page__bookmarked-date">
                          <svg viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                          </svg>
                          Bookmarked on {formatDate(bookmark.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="bookmarks-page__card-actions">
                      <button
                        className="bookmarks-page__remove-btn"
                        onClick={(e) =>
                          handleRemoveBookmark(
                            bookmark.restaurant_id,
                            bookmark.restaurant_name,
                            e,
                          )
                        }
                        disabled={isRemoving}
                      >
                        {isRemoving ? (
                          <span className="bookmarks-page__btn-spinner"></span>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookmarksPage;
