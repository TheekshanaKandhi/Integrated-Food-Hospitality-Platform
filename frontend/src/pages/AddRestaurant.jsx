import { useState } from "react";
import axios from "axios";

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    address: "",
    mapUrl: "",
    rating: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

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
      payload.append("cuisine", formData.cuisine);
      payload.append("address", formData.address);
      payload.append("mapUrl", formData.mapUrl);
      payload.append("rating", formData.rating);

      if (image) {
        payload.append("image", image);
      }

      const res = await axios.post("http://127.0.0.1:5000/api/restaurants", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(res.data.message || "Restaurant added successfully");
      setFormData({
        name: "",
        cuisine: "",
        address: "",
        mapUrl: "",
        rating: ""
      });
      setImage(null);
      document.getElementById("restaurant-image-input").value = "";
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add restaurant");
    }
  };

  return (
    <div>
      <h2>Add Restaurant</h2>
      <p>Create a new restaurant entry for the platform.</p>
      <p className="page-sub-note">Use this form to onboard a new restaurant partner.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Restaurant Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter restaurant name"
          />
        </div>

        <div>
          <label>Cuisine:</label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            placeholder="Enter cuisine type"
          />
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address"
          />
        </div>

        <div>
          <label>Google Maps Link:</label>
          <input
            type="text"
            name="mapUrl"
            value={formData.mapUrl}
            onChange={handleChange}
            placeholder="Paste Google Maps link"
          />
        </div>

        <div>
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Enter rating"
          />
        </div>

        <div>
          <label>Restaurant Image:</label>
          <input
            id="restaurant-image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Add Restaurant</button>
      </form>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddRestaurant;