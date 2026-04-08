import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (id, type) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item._id === id) {
          const newQuantity =
            type === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <div>
      <h2>Cart</h2>
      <p>Review your selected food items before placing the order.</p>
      <p className="page-sub-note">Update quantities or remove items before checkout.</p>

      {cartItems.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item) => (
            <div className="cart-card" key={item._id}>
              <div className="cart-info">
                <h3>{item.name}</h3>
                <span className="food-badge">Veg</span>
                <p>{item.category}</p>
                <p>₹{item.price} each</p>
                <p>
                  <strong>Total:</strong> ₹{item.price * item.quantity}
                </p>
              </div>

              <div className="cart-actions">
                <div className="quantity-box">
                  <button onClick={() => updateQuantity(item._id, "decrease")}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, "increase")}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <p>
              <strong>Total Amount:</strong> ₹{totalAmount}
            </p>
            <p className="cart-subtext">
              Delivery charges and taxes will be calculated at checkout.
            </p>
            <button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;