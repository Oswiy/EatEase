import React, { useState, useEffect } from "react";
import "./PhotosTab.css";
import API_CONFIG from "../../config";

const PhotosTab = ({ restaurantId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.includes("cloudinary.com")) return imagePath;
    return `${API_CONFIG.BASE_URL}/storage/${imagePath}`;
  };

  useEffect(() => {
    fetchPhotos();
  }, [restaurantId]);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/photos`,
      );
      const data = await response.json();

      const processedPhotos = Array.isArray(data)
        ? data.map((photo, index) => ({
            ...photo,
            display_url: photo.full_image_url || getImageUrl(photo.image_url),
            caption: photo.caption || "",
            is_primary: photo.is_primary || false,
            order: photo.order || index,
          }))
        : [];

      // Sort photos: primary first, then by order
      const sortedPhotos = processedPhotos.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.order || 0) - (b.order || 0);
      });

      setPhotos(sortedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openPhotoViewer = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = "hidden";
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "auto";
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;

      if (e.key === "ArrowLeft") {
        navigatePhoto("prev");
      } else if (e.key === "ArrowRight") {
        navigatePhoto("next");
      } else if (e.key === "Escape") {
        closePhotoViewer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, photos]);

  if (loading) {
    return (
      <div className="reviews-tab loading">
        <div className="tab__loading-state">
          <div className="tab__loading-spinner"></div>
          <p>Loading photos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="photos-tab">
        <div className="photos-tab__error-state">
          <p>{error}</p>
          <button onClick={fetchPhotos} className="photos-tab__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="photos-tab">
        <div className="photos-tab__empty-state">
          <svg
            className="photos-tab__empty-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
          <h3>No Photos Yet</h3>
          <p>This restaurant hasn't added any photos yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photos-tab">
      {/* Header with Stats */}
      <div className="photos-tab__header">
        <div className="photos-tab__header-left">
          <h3 className="photos-tab__title">Photo Gallery</h3>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="photos-tab__grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photos-tab__grid-item"
            onClick={() => openPhotoViewer(photo)}
          >
            <div className="photos-tab__image-container">
              <img
                src={photo.display_url}
                alt={photo.caption || `Restaurant photo ${index + 1}`}
                className="photos-tab__image"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                  e.target.style.objectFit = "contain";
                  e.target.style.padding = "20px";
                }}
              />
              {photo.is_primary && (
                <div className="photos-tab__primary-badge">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </svg>
                  <span>Primary</span>
                </div>
              )}
              {photo.caption && (
                <div className="photos-tab__caption-overlay">
                  <p>{photo.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="photos-tab__modal" onClick={closePhotoViewer}>
          <div
            className="photos-tab__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="photos-tab__modal-close"
              onClick={closePhotoViewer}
              aria-label="Close viewer"
            >
              ×
            </button>

            <button
              className="photos-tab__modal-nav photos-tab__modal-nav--prev"
              onClick={() => navigatePhoto("prev")}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <div className="photos-tab__modal-image-container">
              <img
                src={selectedPhoto.display_url}
                alt={selectedPhoto.caption || "Restaurant photo"}
                className="photos-tab__modal-image"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";
                  e.target.style.objectFit = "contain";
                  e.target.style.padding = "40px";
                }}
              />
            </div>

            <button
              className="photos-tab__modal-nav photos-tab__modal-nav--next"
              onClick={() => navigatePhoto("next")}
              aria-label="Next photo"
            >
              ›
            </button>

            {selectedPhoto.caption && (
              <div className="photos-tab__modal-caption">
                <p>{selectedPhoto.caption}</p>
              </div>
            )}

            <div className="photos-tab__modal-counter">
              {photos.findIndex((p) => p.id === selectedPhoto.id) + 1} /{" "}
              {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;
