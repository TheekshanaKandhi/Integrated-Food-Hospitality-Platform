import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    paymentMethod: "Cash on Delivery"
  });
  const [message, setMessage] = useState("");

  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);

      try {
        const res = await axios.get("http://127.0.0.1:5000/api/auth/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    if (!formData.customerName || !formData.address) {
      setMessage("Please fill all checkout details");
      return;
    }

    const loggedInUser = users.find((user) => user.email === userEmail);

    if (!loggedInUser) {
      setMessage("Logged in user not found");
      return;
    }

    const restaurantId =
      typeof cartItems[0].restaurant === "object"
        ? cartItems[0].restaurant._id
        : cartItems[0].restaurant;

    const items = cartItems.map((item) => ({
      menuItem: item._id,
      quantity: item.quantity
    }));

    try {
      const token = localStorage.getItem("token");
      console.log("Placing order...");
      console.log("Token exists:", !!token);
      console.log("User ID:", loggedInUser._id);
      console.log("Cart items:", cartItems.length);

      const response = await axios.post("http://127.0.0.1:5000/api/orders", {
        user: loggedInUser._id,
        restaurant: restaurantId,
        items,
        totalPrice: totalAmount,
        customerName: formData.customerName,
        deliveryAddress: formData.address,
        paymentMethod: formData.paymentMethod,
        paymentStatus:
          formData.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Order placed successfully:", response.data);

      localStorage.removeItem("cart");
      setCartItems([]);
      setMessage("Order placed successfully");

      setFormData({
        customerName: "",
        address: "",
        paymentMethod: "Cash on Delivery"
      });

      setTimeout(() => {
        navigate("/orders");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order"
      );
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Confirm your delivery details and place the order.</p>
      <p className="page-sub-note">
        Review your address, payment method, and final order summary.
      </p>

      {message && (
        <p
          className={
            message.includes("successfully")
              ? "success-message"
              : "error-message"
          }
        >
          {message}
        </p>
      )}

      {cartItems.length === 0 ? (
        <p className="empty-state">No items in cart.</p>
      ) : (
        <div className="checkout-grid">
          <div className="checkout-form-box">
            <form onSubmit={handlePlaceOrder}>
              <div>
                <label>Customer Name:</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Delivery Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Payment Method:</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option>Cash on Delivery</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>
              </div>

              <button type="submit">Place Final Order</button>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>

            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <p>
                  <strong>{item.name}</strong> × {item.quantity}
                </p>
                <p>₹{item.price * item.quantity}</p>
              </div>
            ))}

            <hr />
            <p>
              <strong>Total Amount: ₹{totalAmount}</strong>
            </p>
            <p className="cart-subtext">
              Invoice will be generated after order placement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;