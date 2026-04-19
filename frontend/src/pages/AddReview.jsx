import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function AddReview() {
  const [orders, setOrders] = useState([]);
  const [existingReviews, setExistingReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const orderId = searchParams.get("order");
    if (orderId) {
      setFormData((prev) => ({
        ...prev,
        order: orderId
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes, usersRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get("http://127.0.0.1:5000/api/reviews", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          axios.get("http://127.0.0.1:5000/api/auth/users", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const loggedInUser = usersRes.data.find((user) => user.email === userEmail);
        setCurrentUser(loggedInUser || null);

        const deliveredOrders = ordersRes.data.filter(
          (order) => String(order.status || "").toLowerCase() === "delivered"
        );

        setOrders(deliveredOrders);
        setExistingReviews(reviewsRes.data);
      } catch (error) {
        console.log(error);
        setMessage("Failed to load data");
      }
    };

    if (userEmail && token) {
      fetchData();
    }
  }, [userEmail, token]);

  const selectedOrder = useMemo(() => {
    return orders.find((order) => order._id === formData.order);
  }, [orders, formData.order]);

  const selectedRestaurantId = useMemo(() => {
    if (!selectedOrder) return "";
    return typeof selectedOrder.restaurant === "object"
      ? selectedOrder.restaurant._id
      : selectedOrder.restaurant;
  }, [selectedOrder]);

  const selectedRestaurantName = useMemo(() => {
    if (!selectedOrder) return "";
    return typeof selectedOrder.restaurant === "object"
      ? selectedOrder.restaurant.name
      : "Restaurant";
  }, [selectedOrder]);

  const hasExistingReview = useMemo(() => {
    if (!selectedOrder) return false;

    return existingReviews.some((review) => {
      const reviewOrderId =
        typeof review.order === "object" ? review.order._id : review.order;
      return String(reviewOrderId) === String(selectedOrder._id);
    });
  }, [selectedOrder, existingReviews]);

  const handleOrderChange = (e) => {
    setFormData({
      ...formData,
      order: e.target.value,
      rating: 0
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
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

    if (userRole === "admin") {
      setMessage("Admin cannot add reviews.");
      return;
    }

    if (!currentUser) {
      setMessage("User not found. Please log in again.");
      return;
    }

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
      payload.append("user", currentUser._id);
      payload.append("order", selectedOrder._id);
      payload.append("restaurant", selectedRestaurantId);
      payload.append("rating", formData.rating);
      payload.append("comment", formData.comment ? formData.comment.trim() : "");

      if (image) {
        payload.append("image", image);
      }

      await axios.post("http://127.0.0.1:5000/api/reviews", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage("Review submitted successfully!");

      setTimeout(() => {
        navigate("/reviews");
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || "Failed to add review"
      );
    }
  };

  if (!userEmail) {
    return <p className="error-message">Please log in to add reviews.</p>;
  }

  if (userRole === "admin") {
    return <p className="error-message">Only customers can add reviews.</p>;
  }

  return (
    <div>
      <h2>Write a Review</h2>
      <p>Share your experience with this restaurant order.</p>
      <p className="page-sub-note">
        Help other customers by rating your recent delivered orders.
      </p>

      {message && (
        <p
          className={
            message.toLowerCase().includes("successfully")
              ? "success-message"
              : "error-message"
          }
        >
          {message}
        </p>
      )}

      <div className="info-card">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Order to Review:</label>
            <select
              name="order"
              value={formData.order}
              onChange={handleOrderChange}
              required
            >
              <option value="">Choose a delivered order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order #{order._id.slice(-8)} -{" "}
                  {typeof order.restaurant === "object"
                    ? order.restaurant?.name || "Restaurant"
                    : "Restaurant"}{" "}
                  - ₹{order.totalPrice}
                </option>
              ))}
            </select>
          </div>

          {selectedOrder && (
            <div className="order-summary-preview">
              <h4>Order Summary</h4>
              <p><strong>Restaurant:</strong> {selectedRestaurantName}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalPrice}</p>
              <p><strong>Items:</strong> {selectedOrder.items?.length || 0} item(s)</p>
              {hasExistingReview && (
                <p style={{ color: "#b91c1c", fontWeight: "600" }}>
                  You have already reviewed this order
                </p>
              )}
            </div>
          )}

          <div>
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoveredRating || formData.rating) ? "active" : ""}`}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </span>
              ))}
              <span className="rating-text">
                {formData.rating > 0 &&
                  `${formData.rating} star${formData.rating > 1 ? "s" : ""}`}
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
          </div>

          <button
            type="submit"
            disabled={!formData.rating || !formData.order || hasExistingReview}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReview;