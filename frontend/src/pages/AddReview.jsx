import { useState } from "react";
import axios from "axios";

function AddReview() {
  const [formData, setFormData] = useState({
    user: "",
    restaurant: "",
    order: "",
    rating: "",
    comment: ""
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
          <label>User ID:</label>
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Restaurant ID:</label>
          <input
            type="text"
            name="restaurant"
            value={formData.restaurant}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Order ID:</label>
          <input
            type="text"
            name="order"
            value={formData.order}
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