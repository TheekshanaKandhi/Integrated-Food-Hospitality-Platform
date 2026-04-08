import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AddOrder() {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    restaurant: "",
    menuItem: "",
    quantity: 1
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, restaurantsRes, menuRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/auth/users"),
          axios.get("http://127.0.0.1:5000/api/restaurants"),
          axios.get("http://127.0.0.1:5000/api/menu")
        ]);

        setUsers(usersRes.data);
        setRestaurants(restaurantsRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const filteredMenuItems = useMemo(() => {
    if (!formData.restaurant) return [];
    return menuItems.filter(
      (item) =>
        (typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant) === formData.restaurant
    );
  }, [menuItems, formData.restaurant]);

  const selectedMenuItem = filteredMenuItems.find((item) => item._id === formData.menuItem);
  const totalPrice = selectedMenuItem ? selectedMenuItem.price * Number(formData.quantity || 0) : 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        user: formData.user,
        restaurant: formData.restaurant,
        items: [
          {
            menuItem: formData.menuItem,
            quantity: Number(formData.quantity)
          }
        ],
        totalPrice
      };

      const res = await axios.post("http://127.0.0.1:5000/api/orders", payload);
      setMessage(res.data.message || "Order added successfully");

      setFormData({
        user: "",
        restaurant: "",
        menuItem: "",
        quantity: 1
      });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add order");
    }
  };

  return (
    <div>
      <h2>Add Order</h2>
      <p>Create a new customer order by selecting a user, restaurant, and menu item.</p>
      <p className="page-sub-note">Place test or manual orders directly from the admin side.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>User:</label>
          <select name="user" value={formData.user} onChange={handleChange}>
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

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
          <label>Menu Item:</label>
          <select name="menuItem" value={formData.menuItem} onChange={handleChange}>
            <option value="">Select menu item</option>
            {filteredMenuItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div>
          <label>Total Price:</label>
          <input type="number" value={totalPrice} readOnly />
        </div>

        <button type="submit">Add Order</button>
      </form>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddOrder;