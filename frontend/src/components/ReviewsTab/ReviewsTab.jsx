import React, { useState, useEffect } from "react";
import "./ReviewsTab.css";
import API_CONFIG from "../../config";
import { useToast } from "../../context/ToastContext";

const ReviewsTab = ({ restaurantId, restaurantName }) => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    fetchReviews();
  }, [restaurantId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/reviews`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success !== false) {
        setReviews(data.reviews || []);
        setAverageRating(data.average_rating || 0);
        setTotalReviews(data.total_reviews || 0);

        const existingUserReview = data.user_review || null;
        setUserReview(existingUserReview);

        if (existingUserReview) {
          setEditRating(existingUserReview.rating);
          setEditComment(existingUserReview.comment || "");
        }
      } else {
        setError(data.error || "Failed to load reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user || user.user_type !== "diner") {
      showToast("Only diners can submit reviews", "warning", 3000);
      return;
    }

    if (!editComment.trim()) {
      showToast("Please add a comment to your review", "warning", 3000);
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("auth_token");

    try {
      let response;

      if (userReview) {
        // UPDATE existing review
        response = await fetch(
          `${API_CONFIG.BASE_URL}/api/reviews/${userReview.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ rating: editRating, comment: editComment }),
          },
        );
      } else {
        // CREATE new review
        response = await fetch(
          `${API_CONFIG.BASE_URL}/api/restaurants/${restaurantId}/reviews`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ rating: editRating, comment: editComment }),
          },
        );
      }

      const data = await response.json();

      if (data.success) {
        await fetchReviews();
        setEditMode(false);
        showToast(
          userReview
            ? "Review updated successfully!"
            : "Review submitted successfully!",
          "success",
          3000,
        );
      } else {
        showToast(data.error || "Failed to submit review", "error", 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error submitting review", "error", 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!userReview) return;

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/reviews/${userReview.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        await fetchReviews();
        setEditMode(false);
        setEditRating(5);
        setEditComment("");
        showToast("Review deleted successfully", "success", 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error deleting review", "error", 3000);
    }
  };

  const handleRatingClick = (rating) => {
    setEditRating(rating);
  };

  const renderStars = (rating, interactive = false, size = "medium") => {
    const starSize = size === "large" ? "20px" : "16px";

    return (
      <div className="reviews-tab__stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`reviews-tab__star ${star <= rating ? "reviews-tab__star--filled" : ""} ${interactive ? "reviews-tab__star--interactive" : ""}`}
            onClick={() => interactive && handleRatingClick(star)}
            style={{
              cursor: interactive ? "pointer" : "default",
              fontSize: starSize,
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reviews-tab loading">
        <div className="tab__loading-state">
          <div className="tab__loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-tab">
        <div className="reviews-tab__error-state">
          <p>{error}</p>
          <button onClick={fetchReviews} className="reviews-tab__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-tab">
      {/* Rating Summary */}
      <div className="reviews-tab__rating-summary">
        <div className="reviews-tab__rating-score">
          <span className="reviews-tab__rating-number">
            {averageRating.toFixed(1)}
          </span>
          <span className="reviews-tab__rating-out-of">/5</span>
        </div>
        {renderStars(Math.round(averageRating), false, "large")}
        <p className="reviews-tab__rating-count">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* User's Review Section */}
      {user && user.user_type === "diner" && (
        <div className="reviews-tab__user-review-section">
          <h3 className="reviews-tab__section-title">
            {userReview ? "Your Review" : "Write a Review"}
          </h3>

          {!editMode && userReview ? (
            // Display mode - Show existing review
            <div className="reviews-tab__user-review-display">
              <div className="reviews-tab__review-header">
                <div className="reviews-tab__reviewer-info">
                  <div className="reviews-tab__reviewer-avatar">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="reviews-tab__reviewer-details">
                    <span className="reviews-tab__reviewer-name">
                      {user.name}
                    </span>
                    <span className="reviews-tab__review-date">
                      {new Date(userReview.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
                <div className="reviews-tab__review-rating">
                  {renderStars(userReview.rating, false, "small")}
                </div>
              </div>

              {userReview.comment && (
                <div className="reviews-tab__review-content">
                  <p>{userReview.comment}</p>
                </div>
              )}

              <div className="reviews-tab__review-actions">
                <button
                  onClick={() => setEditMode(true)}
                  className="reviews-tab__edit-btn"
                >
                  Edit Review
                </button>
                <button
                  onClick={deleteReview}
                  className="reviews-tab__delete-review-btn"
                >
                  Delete Review
                </button>
              </div>
            </div>
          ) : (
            // Edit/Create mode
            <div className="reviews-tab__review-form">
              <div className="reviews-tab__form-group">
                <label>Your Rating</label>
                {renderStars(editRating, true, "large")}
                <span className="reviews-tab__rating-value">
                  {editRating} out of 5
                </span>
              </div>

              <div className="reviews-tab__form-group">
                <label>Your Review</label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder={`What did you think of ${restaurantName}?`}
                  rows="4"
                  maxLength="500"
                />
                <span className="reviews-tab__char-count">
                  {editComment.length}/500
                </span>
              </div>

              <div className="reviews-tab__form-actions">
                <button
                  onClick={submitReview}
                  disabled={submitting || !editComment.trim()}
                  className="reviews-tab__submit-btn"
                >
                  {submitting ? (
                    <>
                      <span className="reviews-tab__btn-spinner"></span>
                      {userReview ? "Updating..." : "Submitting..."}
                    </>
                  ) : userReview ? (
                    "Update Review"
                  ) : (
                    "Submit Review"
                  )}
                </button>

                {userReview && (
                  <button
                    onClick={() => setEditMode(false)}
                    className="reviews-tab__cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other Customer Reviews */}
      <div className="reviews-tab__other-reviews">
        <h3 className="reviews-tab__section-title">Customer Reviews</h3>

        {reviews.filter((r) => !userReview || r.id !== userReview.id).length ===
        0 ? (
          <div className="reviews-tab__no-reviews">
            <p>No other reviews yet.</p>
          </div>
        ) : (
          reviews
            .filter((r) => !userReview || r.id !== userReview.id)
            .map((review) => (
              <div key={review.id} className="reviews-tab__review-item">
                <div className="reviews-tab__review-header">
                  <div className="reviews-tab__reviewer-info">
                    <div className="reviews-tab__reviewer-avatar">
                      {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="reviews-tab__reviewer-details">
                      <span className="reviews-tab__reviewer-name">
                        {review.user?.name || "Anonymous"}
                      </span>
                      <span className="reviews-tab__review-date">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="reviews-tab__review-rating">
                    {renderStars(review.rating, false, "small")}
                  </div>
                </div>

                {review.comment && (
                  <div className="reviews-tab__review-content">
                    <p>{review.comment}</p>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
