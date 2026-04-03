import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function AddOrder() {
  const [formData, setFormData] = useState({
    user: "",
    restaurant: "",
    menuItem: "",
    quantity: ""
  });

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
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

    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/menu");
        setMenuItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    fetchRestaurants();
    fetchMenuItems();
  }, []);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(
      (item) => item.restaurant._id === formData.restaurant
    );
  }, [menuItems, formData.restaurant]);

  const selectedMenuItem = filteredMenuItems.find(
    (item) => item._id === formData.menuItem
  );

  const totalPrice =
    selectedMenuItem && formData.quantity
      ? selectedMenuItem.price * Number(formData.quantity)
      : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "restaurant") {
      setFormData({
        ...formData,
        restaurant: value,
        menuItem: "",
        quantity: ""
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
      const res = await axios.post("http://127.0.0.1:5000/api/orders", {
        user: formData.user,
        restaurant: formData.restaurant,
        items: [
          {
            menuItem: formData.menuItem,
            quantity: Number(formData.quantity)
          }
        ],
        totalPrice: totalPrice
      });

      setMessage(res.data.message);

      setFormData({
        user: "",
        restaurant: "",
        menuItem: "",
        quantity: ""
      });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to place order");
    }
  };

  return (
    <div>
      <h2>Add Order Page</h2>

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
          <label>Menu Item:</label>
          <select
            name="menuItem"
            value={formData.menuItem}
            onChange={handleChange}
          >
            <option value="">Select Menu Item</option>
            {filteredMenuItems.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - ₹{item.price}
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
          />
        </div>

        <div>
          <label>Total Price:</label>
          <input type="number" value={totalPrice} readOnly />
        </div>

        <button type="submit">Place Order</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddOrder;