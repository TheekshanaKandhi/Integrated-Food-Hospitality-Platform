import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/orders");
        const reversedOrders = [...res.data].reverse();
        setOrders(reversedOrders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const getStep = (status) => {
    switch (status.toLowerCase()) {
      case "placed":
        return 1;
      case "confirmed":
        return 2;
      case "preparing":
        return 3;
      case "delivered":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      <p>Track all customer orders and their current delivery status.</p>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const currentStep = getStep(order.status);

            return (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <h3>{order.restaurant.name}</h3>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <p><strong>Customer:</strong> {order.user.name}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Order ID:</strong> {order._id}</p>

                <div className="order-progress">
                  <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>Placed</div>
                  <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>Confirmed</div>
                  <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>Preparing</div>
                  <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>Delivered</div>
                </div>

                <div className="order-items">
                  <h4>Items</h4>
                  {order.items.map((item) => (
                    <p key={item._id}>
                      {item.menuItem?.name || "Menu Item"} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;