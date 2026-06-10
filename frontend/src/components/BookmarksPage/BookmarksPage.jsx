import React, { useState, useEffect, useRef } from "react";
import "./BookmarksPage.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

// ── Inline confirmation row ────────────────────────────────────────────────────
// Replaces window.confirm() with a smooth in-card prompt.
const ConfirmRow = ({ message, onConfirm, onCancel }) => (
  <div className="bp-confirm-row">
    <span className="bp-confirm-msg">{message}</span>
    <div className="bp-confirm-actions">
      <button className="bp-confirm-cancel" onClick={onCancel}>
        Keep
      </button>
      <button className="bp-confirm-ok" onClick={onConfirm}>
        Remove
      </button>
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
function BookmarksPage({ user, onBack, onRestaurantClick }) {
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Which card is showing the inline confirm row
  const [confirmingId, setConfirmingId] = useState(null);
  // Which card is mid-request (spinner on the button)
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("Please log in to view bookmarks");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setBookmarks(data.bookmarks || []);
      } else {
        setError(data.message || "Failed to load bookmarks");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load bookmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: show the inline confirm row
  const requestRemove = (e, restaurantId) => {
    e.stopPropagation();
    setConfirmingId(restaurantId);
  };

  // Step 2: user confirmed — optimistic remove then API call
  const confirmRemove = async (restaurantId, restaurantName) => {
    setConfirmingId(null);
    setRemovingId(restaurantId);

    // Optimistic update: remove card immediately
    setBookmarks((prev) => prev.filter((b) => b.restaurant_id !== restaurantId));

    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/bookmarks/${restaurantId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success && !data.isBookmarked) {
        showToast(`Removed ${restaurantName}`, "success", 3000);
      } else {
        // Rollback: re-fetch if the API says it didn't actually unbookmark
        showToast(data.message || "Couldn't remove bookmark", "error", 3000);
        fetchBookmarks();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to remove bookmark", "error", 3000);
      fetchBookmarks(); // rollback
    } finally {
      setRemovingId(null);
    }
  };

  const cancelRemove = (e) => {
    if (e) e.stopPropagation();
    setConfirmingId(null);
  };

  const handleCardClick = (bookmark) => {
    // Don't navigate if the confirm row is open
    if (confirmingId === bookmark.restaurant_id) return;

    if (bookmark.is_deleted) {
      showToast("This restaurant is no longer available", "warning", 3000);
      return;
    }
    if (onRestaurantClick) {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-page__loading-state">
          <div className="bookmarks-page__loading-spinner" />
          <p>Loading bookmarks…</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bookmarks-page">
        <PageHeader onBack={onBack} />
        <div className="bookmarks-page__error-state">
          <p>{error}</p>
          <button onClick={fetchBookmarks} className="bookmarks-page__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="bookmarks-page">
      <PageHeader onBack={onBack} />

      {bookmarks.length === 0 ? (
        <div className="bookmarks-page__empty">
          <div className="bookmarks-page__empty-icon">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 100q-68 0-123.5 38.5T276-280h66q22-37 58.5-58.5T480-360q43 0 79.5 21.5T618-280h66q-25-63-80.5-101.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
            </svg>
          </div>
          <h3>No bookmarks yet</h3>
          <p>Bookmark restaurants you like to find them here quickly</p>
        </div>
      ) : (
        <div className="bookmarks-page__list">
          {bookmarks.map((bookmark) => {
            const isConfirming = confirmingId === bookmark.restaurant_id;
            const isRemoving = removingId === bookmark.restaurant_id;

            return (
              <div
                key={bookmark.id}
                className={[
                  "bookmarks-page__card",
                  !bookmark.is_deleted ? "bookmarks-page__card--clickable" : "",
                  isConfirming ? "bookmarks-page__card--confirming" : "",
                ].join(" ")}
                onClick={() => handleCardClick(bookmark)}
              >
                {bookmark.is_deleted ? (
                  // ── Deleted restaurant ─────────────────────────────────────
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

                    {isConfirming ? (
                      <ConfirmRow
                        message="Remove this bookmark?"
                        onConfirm={() => confirmRemove(bookmark.restaurant_id, bookmark.restaurant_name)}
                        onCancel={cancelRemove}
                      />
                    ) : (
                      <div className="bookmarks-page__card-actions">
                        <button
                          className="bookmarks-page__remove-btn"
                          onClick={(e) => requestRemove(e, bookmark.restaurant_id)}
                          disabled={isRemoving}
                          aria-label="Remove bookmark"
                        >
                          {isRemoving ? (
                            <span className="bookmarks-page__btn-spinner" />
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // ── Active restaurant ──────────────────────────────────────
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
                          Saved {formatDate(bookmark.created_at)}
                        </p>
                      </div>
                    </div>

                    {isConfirming ? (
                      <ConfirmRow
                        message="Remove this bookmark?"
                        onConfirm={() => confirmRemove(bookmark.restaurant_id, bookmark.restaurant_name)}
                        onCancel={cancelRemove}
                      />
                    ) : (
                      <div className="bookmarks-page__card-actions">
                        <button
                          className="bookmarks-page__remove-btn"
                          onClick={(e) => requestRemove(e, bookmark.restaurant_id)}
                          disabled={isRemoving}
                          aria-label="Remove bookmark"
                        >
                          {isRemoving ? (
                            <span className="bookmarks-page__btn-spinner" />
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </div>
                    )}
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

// ── Small reusable header ──────────────────────────────────────────────────────
const PageHeader = ({ onBack }) => (
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
);

export default BookmarksPage;