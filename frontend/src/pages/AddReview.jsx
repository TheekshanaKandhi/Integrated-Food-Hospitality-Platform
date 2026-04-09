import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function AddReview() {
  const [orders, setOrders] = useState([]);
  const [existingReviews, setExistingReviews] = useState([]);
  const [formData, setFormData] = useState({
    order: "",
    rating: 0,
    comment: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const orderId = searchParams.get("order");
    if (orderId) {
      setFormData(prev => ({
        ...prev,
        order: orderId
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get("http://127.0.0.1:5000/api/reviews")
        ]);

        const deliveredOrders = ordersRes.data.filter((order) => {
          return order.status?.toLowerCase() === "delivered";
        });

        setOrders(deliveredOrders);
        setExistingReviews(reviewsRes.data);
      } catch (error) {
        console.log(error);
        setMessage("Failed to load data");
      }
    };

    if (userEmail) {
      fetchData();
    }
  }, [userEmail]);

  const selectedOrder = useMemo(() => {
    return orders.find((order) => order._id === formData.order);
  }, [orders, formData.order]);

  const hasExistingReview = useMemo(() => {
    if (!selectedOrder) return false;
    return existingReviews.some((review) => review.order === selectedOrder._id);
  }, [selectedOrder, existingReviews]);

  const handleOrderChange = (e) => {
    setFormData({
      ...formData,
      order: e.target.value,
      rating: 0 // Reset rating when order changes
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  const handleCommentChange = (e) => {
    setFormData({
      ...formData,
      comment: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.order) {
      setMessage("Please select an order to review.");
      return;
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setMessage("Please provide a rating between 1 and 5 stars.");
      return;
    }

    if (hasExistingReview) {
      setMessage("You have already submitted a review for this order.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("order", formData.order);
      payload.append("restaurant", selectedOrder.restaurant._id || selectedOrder.restaurant);
      payload.append("rating", formData.rating);
      payload.append("comment", formData.comment ? formData.comment.trim() : "");

      if (image) {
        payload.append("image", image);
      }

      const res = await axios.post("http://127.0.0.1:5000/api/reviews", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage("Review submitted successfully!");
      setTimeout(() => {
        navigate("/reviews");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add review");
    }
  };

  if (!userEmail) {
    return <p className="error-message">Please log in to add reviews.</p>;
  }

  return (
    <div>
      <h2>Write a Review</h2>
      <p>Share your experience with this restaurant order.</p>
      <p className="page-sub-note">Help other customers by rating your recent delivered orders.</p>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <div className="info-card">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Order to Review: <span style={{color: 'red'}}>*</span></label>
            <select
              name="order"
              value={formData.order}
              onChange={handleOrderChange}
              required
            >
              <option value="">Choose a delivered order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order #{order._id.slice(-8)} - {order.restaurant?.name || "Restaurant"} - ₹{order.totalPrice}
                </option>
              ))}
            </select>
          </div>

          {selectedOrder && (
            <div className="order-summary-preview">
              <h4>Order Summary</h4>
              <p><strong>Restaurant:</strong> {selectedOrder.restaurant.name}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalPrice}</p>
              <p><strong>Items:</strong> {selectedOrder.items.length} item(s)</p>
              {hasExistingReview && (
                <p style={{color: '#b91c1c', fontWeight: '600'}}>
                  ⚠️ You have already reviewed this order
                </p>
              )}
            </div>
          )}

          {hasExistingReview && (
            <div style={{background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', margin: '16px 0'}}>
              <p style={{color: '#b91c1c', margin: 0, fontWeight: '600'}}>
                Review Already Submitted
              </p>
              <p style={{color: '#b91c1c', margin: '4px 0 0 0', fontSize: '14px'}}>
                You can only submit one review per order. Thank you for your feedback!
              </p>
            </div>
          )}

          <div>
            <label>Rating: <span style={{color: 'red'}}>*</span></label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoveredRating || formData.rating) ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </span>
              ))}
              <span className="rating-text">
                {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          <div>
            <label>Comments: (Optional)</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleCommentChange}
              placeholder="Share your experience, feedback, or suggestions..."
              rows="4"
            />
          </div>

          <div>
            <label>Photo: (Optional)</label>
            <input
              id="review-image-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <small style={{color: 'var(--muted)', fontSize: '14px'}}>
              Add a photo of your order or restaurant experience
            </small>
          </div>

          <button type="submit" disabled={!formData.rating || !formData.order || hasExistingReview}>
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReview;