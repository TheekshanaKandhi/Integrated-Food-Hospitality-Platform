import { useState } from "react";
import axios from "axios";

function AddOrder() {
  const [formData, setFormData] = useState({
    user: "",
    restaurant: "",
    menuItem: "",
    quantity: "",
    totalPrice: ""
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
      const res = await axios.post("http://127.0.0.1:5000/api/orders", {
        user: formData.user,
        restaurant: formData.restaurant,
        items: [
          {
            menuItem: formData.menuItem,
            quantity: Number(formData.quantity)
          }
        ],
        totalPrice: Number(formData.totalPrice)
      });

      setMessage(res.data.message);

      setFormData({
        user: "",
        restaurant: "",
        menuItem: "",
        quantity: "",
        totalPrice: ""
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
          <label>Menu Item ID:</label>
          <input
            type="text"
            name="menuItem"
            value={formData.menuItem}
            onChange={handleChange}
          />
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
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Place Order</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddOrder;