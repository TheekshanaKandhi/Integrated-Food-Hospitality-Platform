import { useEffect, useState } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/reviews", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (error) {
      console.log("Error loading reviews:", error);
      setMessage(error.response?.data?.message || "Failed to load reviews");
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://127.0.0.1:5000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(res.data.message || "Review deleted successfully");
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.log("Error deleting review:", error);
      setMessage(error.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return <div className="loading-state">Loading reviews...</div>;
  }

  return (
    <div className="structured-list-page">
      <div className="page-title-block">
        <h2>Reviews</h2>
        <p>
          {userRole === "admin"
            ? "Manage all customer reviews and feedback."
            : "Browse customer reviews and ratings."}
        </p>
      </div>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="empty-state">No reviews found.</p>
      ) : (
        <div className="reviews-grid review-uniform-grid">
          {reviews.map((review) => {
            const restaurantName =
              typeof review.restaurant === "object"
                ? review.restaurant?.name || "Restaurant"
                : "Restaurant";

            const userName =
              typeof review.user === "object"
                ? review.user?.name || "Customer"
                : "Customer";

            return (
              <div className="review-card review-uniform-card" key={review._id}>
                <div className="review-card-inner">
                  <div className="review-top review-uniform-top">
                    <h3 className="review-restaurant-clamp">{restaurantName}</h3>
                    <span className="review-rating-chip">{review.rating} ★</span>
                  </div>

                  <p className="review-customer-line">
                    <strong>Customer:</strong> {userName}
                  </p>

                  {review.comment ? (
                    <p className="review-comment-clamp">{review.comment}</p>
                  ) : (
                    <p className="page-sub-note review-comment-clamp">No comment added.</p>
                  )}

                  <div className="review-image-slot">
                    {review.imageUrl ? (
                      <img
                        src={review.imageUrl}
                        alt="Review"
                        className="review-image"
                      />
                    ) : (
                      <div className="review-image-placeholder">No Image</div>
                    )}
                  </div>

                  {userRole === "admin" && (
                    <div className="order-action-row review-actions-bottom">
                      <button
                        className="icon-btn delete-btn"
                        type="button"
                        title="Delete Review"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Reviews;