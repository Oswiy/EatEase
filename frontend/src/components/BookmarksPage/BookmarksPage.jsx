import React, { useState, useEffect } from "react";
import "./BookmarksPage.css";
import API_CONFIG from "../../config";

function BookmarksPage({ user, onBack }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null); // Track which bookmark is being removed

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

  const handleRemoveBookmark = async (restaurantId) => {
    // Find the bookmark to remove (for potential rollback if needed, but we won't optimistically remove)
    const bookmarkToRemove = bookmarks.find(
      (b) => b.restaurant_id === restaurantId,
    );
    if (!bookmarkToRemove) return;

    // Set loading state for this specific bookmark - shows spinner
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

      // Only remove from UI if the server confirmed success
      if (data.success && !data.isBookmarked) {
        // Remove from UI after successful server response
        setBookmarks((prev) =>
          prev.filter((b) => b.restaurant_id !== restaurantId),
        );
      } else {
        // Show error but keep the bookmark
        alert(data.message || "Failed to remove bookmark. Please try again.");
      }
    } catch (error) {
      console.error("Remove bookmark error:", error);
      // Show error but keep the bookmark
      alert("Failed to remove bookmark. Please try again.");
    } finally {
      setRemovingId(null);
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

  return (
    <div className="bookmarks-page">
      <div className="page-header">
        <button className="bookmarks-back-button" onClick={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="black"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </button>
        <h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="orange"
          >
            <path d="M713-600 600-713l56-57 57 57 141-142 57 57-198 198ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Z" />
          </svg>
          My Bookmarks
        </h1>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
          <p>Loading bookmarks...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchBookmarks}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {bookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="black"
                >
                  <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                </svg>
              </div>
              <h3>No bookmarks yet</h3>
              <p>Bookmark restaurants you like to find quickly here</p>
            </div>
          ) : (
            <div className="bookmarks-container">
              <div className="bookmarks-list">
                {bookmarks.map((bookmark) => {
                  const isRemoving = removingId === bookmark.restaurant_id;

                  return (
                    <div key={bookmark.id} className="bookmark-item">
                      {bookmark.is_deleted ? (
                        <div className="deleted-restaurant">
                          <div className="bookmark-info">
                            <h3 className="deleted-title">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="gray"
                              >
                                <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                              </svg>
                              {bookmark.restaurant_name}
                            </h3>
                            <p className="deleted-message">
                              This restaurant is no longer available
                            </p>
                          </div>
                          <div className="bookmark-actions">
                            <button
                              className="bookmarks-remove-btn"
                              onClick={() =>
                                handleRemoveBookmark(bookmark.restaurant_id)
                              }
                              disabled={isRemoving}
                              title="Remove bookmark"
                            >
                              {isRemoving ? (
                                <span className="btn-spinner"></span>
                              ) : (
                                "Remove"
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="active-restaurant">
                          <div className="bookmark-info">
                            <h3>{bookmark.restaurant_name}</h3>
                            <p className="cuisine">
                              Cuisine: {bookmark.cuisine}
                            </p>
                            <p className="address">
                              Address: {bookmark.address}
                            </p>
                            {bookmark.phone && (
                              <p className="phone">{bookmark.phone}</p>
                            )}
                            <p className="bookmarked-date">
                              Bookmarked on: {formatDate(bookmark.created_at)}
                            </p>
                          </div>

                          <div className="bookmark-actions">
                            <button
                              className="bookmarks-remove-btn"
                              onClick={() =>
                                handleRemoveBookmark(bookmark.restaurant_id)
                              }
                              disabled={isRemoving}
                              title="Remove bookmark"
                            >
                              {isRemoving ? (
                                <span className="btn-spinner"></span>
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
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookmarksPage;
