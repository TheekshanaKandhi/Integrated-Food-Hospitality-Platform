import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AddReview() {
  const [formData, setFormData] = useState({
    user: "",
    restaurant: "",
    order: "",
    rating: "",
    comment: ""
  });

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/auth/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/orders");
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    fetchRestaurants();
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) => order.restaurant._id === formData.restaurant
    );
  }, [orders, formData.restaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "restaurant") {
      setFormData({
        ...formData,
        restaurant: value,
        order: ""
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/reviews", {
        ...formData,
        rating: Number(formData.rating)
      });

      setMessage(res.data.message);
      setFormData({
        user: "",
        restaurant: "",
        order: "",
        rating: "",
        comment: ""
      });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add review");
    }
  };

  return (
    <div>
      <h2>Add Review Page</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>User:</label>
          <select name="user" value={formData.user} onChange={handleChange}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Restaurant:</label>
          <select
            name="restaurant"
            value={formData.restaurant}
            onChange={handleChange}
          >
            <option value="">Select Restaurant</option>
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
            <option value="">Select Order</option>
            {filteredOrders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.restaurant.name} - ₹{order.totalPrice} - {order.status}
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
          />
        </div>

        <div>
          <label>Comment:</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Review</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddReview;