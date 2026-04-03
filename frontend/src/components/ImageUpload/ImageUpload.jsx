import React, { useState, useRef, useEffect } from "react";
import "./ImageUpload.css";
import { BASE_URL } from "../../config";
import { useToast } from "../../context/ToastContext";

function ImageUpload({ type, currentImage, onUploadSuccess, restaurantId }) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentImageDisplay, setCurrentImageDisplay] = useState(
    currentImage || null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef(null);

  // Set current image URL when currentImage prop changes
  useEffect(() => {
    if (currentImage) {
      let url = currentImage;

      if (url && !url.startsWith("http")) {
        url = `${BASE_URL}/storage/${url}`;
      }

      setCurrentImageDisplay(url);
    } else {
      setCurrentImageDisplay(null);
    }
  }, [currentImage]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("Please select a valid image (JPEG, PNG, GIF, WebP)", "error", 3000);
      setError("Please select a valid image (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size should be less than 5MB", "error", 3000);
      setError("File size should be less than 5MB");
      return;
    }

    setError("");
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      setShowConfirmModal(true);
    }
  };

  const handleCancelUpload = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");
    setShowConfirmModal(false);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${BASE_URL}/api/restaurant/upload/${type}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        if (data.url) {
          setCurrentImageDisplay(data.url);
        }

        if (onUploadSuccess) {
          onUploadSuccess(data.url, data.path);
        }

        setPreview(null);
        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        showToast(
          `${type === "profile" ? "Profile" : "Banner"} image uploaded successfully!`,
          "success",
          3000
        );
      } else {
        setError(data.message || "Upload failed");
        showToast(data.message || "Upload failed", "error", 3000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      showToast("Network error. Please try again.", "error", 3000);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`image-upload ${type}`}>
      <div className="image-upload__header">
        <h3 className="image-upload__title">
          {type === "profile" ? "Profile Image" : "Banner Image"}
        </h3>
      </div>

      {/* Current Image Display */}
      {currentImageDisplay && !preview && (
        <div className="image-upload__current">
          <div className="image-upload__current-label">Current Image</div>
          <div className="image-upload__current-image-container">
            <img
              src={currentImageDisplay}
              alt="Current"
              className="image-upload__current-image"
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="image-upload__area">
        {preview ? (
          <div className="image-upload__preview-container">
            <img
              src={preview}
              alt="Preview"
              className="image-upload__preview-image"
            />
            <div className="image-upload__preview-overlay">
              <div className="image-upload__preview-actions">
                <label className="image-upload__change-btn">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    hidden
                  />
                </label>
                <button
                  className="image-upload__confirm-btn"
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                >
                  Confirm Upload
                </button>
                <button
                  className="image-upload__cancel-btn"
                  onClick={handleCancelUpload}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label className="image-upload__placeholder">
            <div className="image-upload__placeholder-icon">
              <svg viewBox="0 -960 960 960" fill="currentColor">
                <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" />
              </svg>
            </div>
            <div className="image-upload__placeholder-text">
              {uploading ? "Uploading..." : `Upload ${type === "profile" ? "Profile" : "Banner"} Image`}
            </div>
            <div className="image-upload__placeholder-hint">
              Click to select image
            </div>
            <div className="image-upload__placeholder-requirements">
              Max 5MB (JPEG, PNG, GIF, WebP)
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              hidden
            />
          </label>
        )}
      </div>

      {error && <div className="image-upload__error">{error}</div>}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="image-upload__modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="image-upload__modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-upload__modal-header">
              <h4>Confirm Upload</h4>
              <button
                className="image-upload__modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                ×
              </button>
            </div>
            <div className="image-upload__modal-body">
              <p>Are you sure you want to upload this image?</p>
              <div className="image-upload__modal-preview">
                {preview && <img src={preview} alt="Confirm preview" />}
              </div>
              <p className="image-upload__modal-warning">
                This will replace your current {type === "profile" ? "profile" : "banner"} image.
              </p>
            </div>
            <div className="image-upload__modal-actions">
              <button
                className="image-upload__modal-cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="image-upload__modal-confirm"
                onClick={uploadImage}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="image-upload__spinner"></span>
                    Uploading...
                  </>
                ) : (
                  "Confirm Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;