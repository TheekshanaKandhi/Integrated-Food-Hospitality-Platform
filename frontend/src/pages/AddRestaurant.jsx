import { useState } from "react";
import axios from "axios";

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    rating: "",
    address: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/restaurants", {
        ...formData,
        rating: Number(formData.rating)
      });
      setMessage(res.data.message);
      setFormData({
        name: "",
        cuisine: "",
        rating: "",
        address: ""
      });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add restaurant");
    }
  };

  return (
    <div>
      <h2>Add Restaurant Page</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Cuisine:</label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
          />
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
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Restaurant</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddRestaurant;