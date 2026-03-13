import React, { useState, useEffect } from "react";
import "../RestaurantDetails/RestaurantDetails.css";
import API_CONFIG from "../../config";

const PhotosTab = ({ restaurantId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL (starts with http), use it directly
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Otherwise, assume it's a local storage path
    return `${API_CONFIG.BASE_URL}/storage/${imagePath}`;
  };

  useEffect(() => {
    fetchPhotos();
  }, [restaurantId]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/photos`,
      );
      const data = await response.json();

      // Use full_image_url if available, otherwise construct from image_url
      const processedPhotos = Array.isArray(data)
        ? data.map((photo) => ({
            ...photo,
            // Use full_image_url if available, otherwise construct from image_url
            display_url:
              photo.full_image_url ||
              (photo.image_url ? getImageUrl(photo.image_url) : null),
            caption: photo.caption || "",
            is_primary: photo.is_primary || false,
          }))
        : [];

      setPhotos(processedPhotos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setLoading(false);
    }
  };

  const openPhotoViewer = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction) => {
    if (!selectedPhoto) return;

    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % photos.length;
    } else {
      newIndex = (currentIndex - 1 + photos.length) % photos.length;
    }

    setSelectedPhoto(photos[newIndex]);
  };

  if (loading) {
    return (
      <div className="photos-tab loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="photos-tab empty">
        <div className="empty-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="50px"
            viewBox="0 -960 960 960"
            width="50px"
            fill="#000000"
          >
            <path d="m880-195-80-80v-405H638l-73-80H395l-38 42-57-57 60-65h240l74 80h126q33 0 56.5 23.5T880-680v485Zm-720 75q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h41l80 80H160v480h601l80 80H160Zm466-215q-25 34-62.5 54.5T480-260q-75 0-127.5-52.5T300-440q0-46 20.5-83.5T375-586l58 58q-24 13-38.5 36T380-440q0 42 29 71t71 29q29 0 52-14.5t36-38.5l58 58Zm-18-233q25 24 38.5 57t13.5 71v12q0 6-1 12L456-619q6-1 12-1h12q38 0 71 13.5t57 38.5ZM819-28 27-820l57-57L876-85l-57 57ZM407-440Zm171-57Z" />
          </svg>
        </div>
        <h3>No Photos Yet</h3>
      </div>
    );
  }

  return (
    <div className="photos-tab">
      {/* Photo Gallery Header */}
      <div className="photos-header">
        <h3 className="photos-title">Photo Gallery</h3>
      </div>

      {/* Primary Photo (if exists) */}
      {photos.find((p) => p.is_primary) && (
        <div className="primary-photo-section">
          <h4 className="section-subtitle">🌟 Featured Photo</h4>
          <div
            className="primary-photo"
            onClick={() => openPhotoViewer(photos.find((p) => p.is_primary))}
          >
            <img
              src={photos.find((p) => p.is_primary).display_url}
              alt={photos.find((p) => p.is_primary).caption || "Featured photo"}
              onError={(e) => {
                console.error("Primary photo failed to load:", e.target.src);
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Featured+Photo+Not+Found";
                e.target.onerror = null; // Prevent infinite loop
              }}
            />
            <div className="primary-badge">Featured</div>
            {photos.find((p) => p.is_primary).caption && (
              <p className="photo-caption">
                {photos.find((p) => p.is_primary).caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* All Photos Grid/List */}
      <div className={`photos-container ${viewMode}`}>
        {viewMode === "grid" ? (
          <div className="photos-grid">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="photo-item"
                onClick={() => openPhotoViewer(photo)}
              >
                <div className="photo-thumbnail">
                  <img
                    src={photo.display_url}
                    alt={photo.caption || `Restaurant photo ${photo.id}`}
                    loading="lazy"
                    onError={(e) => {
                      console.error("Grid photo failed to load:", e.target.src);
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Photo+Error";
                      e.target.onerror = null;
                    }}
                  />
                  {photo.is_primary && (
                    <span className="primary-indicator">⭐</span>
                  )}
                </div>
                {photo.caption && (
                  <p className="photo-caption-small">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="photos-list">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="photo-list-item"
                onClick={() => openPhotoViewer(photo)}
              >
                <div className="list-photo-thumb">
                  <img
                    src={photo.display_url}
                    alt={photo.caption || `Restaurant photo ${photo.id}`}
                    onError={(e) => {
                      console.error("List photo failed to load:", e.target.src);
                      e.target.src =
                        "https://via.placeholder.com/100x100?text=Error";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="list-photo-details">
                  <p className="list-photo-caption">
                    {photo.caption || "No caption"}
                  </p>
                  {photo.is_primary && (
                    <span className="list-primary-badge">Primary</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen photo viewer modal */}
      {selectedPhoto && (
        <div className="photo-viewer-modal" onClick={closePhotoViewer}>
          <div
            className="photo-viewer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-viewer-btn" onClick={closePhotoViewer}>
              ×
            </button>
            <button
              className="nav-btn prev"
              onClick={() => navigatePhoto("prev")}
            >
              ‹
            </button>
            <img
              src={selectedPhoto.display_url}
              alt={selectedPhoto.caption || "Restaurant photo"}
              className="viewer-image"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x600?text=Image+Not+Found";
              }}
            />
            <button
              className="nav-btn next"
              onClick={() => navigatePhoto("next")}
            >
              ›
            </button>
            {selectedPhoto.caption && (
              <p className="viewer-caption">{selectedPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;
