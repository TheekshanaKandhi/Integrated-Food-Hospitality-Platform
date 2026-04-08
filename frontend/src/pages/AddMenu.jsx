import { useEffect, useState } from "react";
import axios from "axios";

function AddMenu() {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    restaurant: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

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
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("restaurant", formData.restaurant);

      if (image) {
        payload.append("image", image);
      }

      const res = await axios.post("http://127.0.0.1:5000/api/menu", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(res.data.message || "Menu item added successfully");
      setFormData({
        name: "",
        category: "",
        price: "",
        restaurant: ""
      });
      setImage(null);
      document.getElementById("menu-image-input").value = "";
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add menu item");
    }
  };

  return (
    <div>
      <h2>Add Menu Item</h2>
      <p>Create a new food item and link it to a restaurant.</p>
      <p className="page-sub-note">Add dish details, price, and availability for a restaurant.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>

        <div>
          <label>Restaurant:</label>
          <select
            name="restaurant"
            value={formData.restaurant}
            onChange={handleChange}
          >
            <option value="">Select restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Food Item Image:</label>
          <input
            id="menu-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Add Menu Item</button>
      </form>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddMenu;