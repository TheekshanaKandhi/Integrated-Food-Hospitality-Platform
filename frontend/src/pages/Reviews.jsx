import { useEffect, useState } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/reviews");
        setReviews(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const fallbackReviewImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";

  if (loading) {
    return <div className="loading-state">Loading reviews...</div>;
  }

  return (
    <div>
      <h2>Reviews</h2>
      <p>Read customer feedback and restaurant ratings from completed orders.</p>
      <p className="page-sub-note">Explore verified ratings and comments from customer orders.</p>

      {reviews.length === 0 ? (
        <p className="empty-state">No reviews found.</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-top">
                <h3>{review.restaurant.name}</h3>
                <span className="review-rating">⭐ {review.rating}/5</span>
              </div>

              {review.imageUrl && (
                <img
                  src={review.imageUrl || fallbackReviewImage}
                  alt="Review"
                  className="review-image"
                />
              )}

              <p><strong>Customer:</strong> {review.user.name}</p>
              <p className="review-comment">“{review.comment}”</p>
              <span className="review-note">Verified order review</span>
              <p><strong>Order:</strong> ₹{review.order.totalPrice} - {review.order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;