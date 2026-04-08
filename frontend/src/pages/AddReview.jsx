import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AddReview() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    restaurant: "",
    order: "",
    rating: "",
    comment: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsRes, ordersRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/restaurants"),
          axios.get("http://127.0.0.1:5000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        setRestaurants(restaurantsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  const filteredOrders = useMemo(() => {
    if (!formData.restaurant) return [];
    return orders.filter((order) => {
      const restaurantId =
        typeof order.restaurant === "object" ? order.restaurant._id : order.restaurant;
      return restaurantId === formData.restaurant;
    });
  }, [orders, formData.restaurant]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("restaurant", formData.restaurant);
      payload.append("order", formData.order);
      payload.append("rating", formData.rating);
      payload.append("comment", formData.comment);

      if (image) {
        payload.append("image", image);
      }

      const res = await axios.post("http://127.0.0.1:5000/api/reviews", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(res.data.message || "Review added successfully");
      setFormData({
        restaurant: "",
        order: "",
        rating: "",
        comment: ""
      });
      setImage(null);
      document.getElementById("review-image-input").value = "";
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add review");
    }
  };

  return (
    <div>
      <h2>Add Review</h2>
      <p>Submit customer feedback and rating for a completed restaurant order.</p>
      <p className="page-sub-note">Attach feedback to an order and restaurant for better tracking.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Restaurant:</label>
          <select name="restaurant" value={formData.restaurant} onChange={handleChange}>
            <option value="">Select restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Order:</label>
          <select name="order" value={formData.order} onChange={handleChange}>
            <option value="">Select order</option>
            {filteredOrders.map((order) => (
              <option key={order._id} value={order._id}>
                {order._id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
          />
        </div>

        <div>
          <label>Comment:</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Enter review comment"
          />
        </div>

        <div>
          <label>Review Photo:</label>
          <input
            id="review-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Add Review</button>
      </form>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddReview;