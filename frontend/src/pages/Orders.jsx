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
      <h2>Orders Page</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <strong>{order.user.name}</strong> ordered from{" "}
              <strong>{order.restaurant.name}</strong> - ₹{order.totalPrice} - {order.status} - ID: {order._id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;