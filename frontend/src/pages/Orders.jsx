import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/orders");
        setOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <p>Track all customer orders and their current delivery status.</p>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;