import { useEffect, useState } from "react";
import axios from "axios";

function AddMenu() {
  const [formData, setFormData] = useState({
    restaurant: "",
    name: "",
    price: "",
    category: "",
    isAvailable: true
  });

  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/menu", {
        ...formData,
        price: Number(formData.price)
      });
      setMessage(res.data.message);
      setFormData({
        restaurant: "",
        name: "",
        price: "",
        category: "",
        isAvailable: true
      });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add menu item");
    }
  };

  return (
    <div>
      <h2>Add Menu Page</h2>

      <form onSubmit={handleSubmit}>
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
          <label>Item Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Available:</label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Menu Item</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddMenu;