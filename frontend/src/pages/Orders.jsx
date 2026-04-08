import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/orders");
        const reversedOrders = [...res.data].reverse();
        setOrders(reversedOrders);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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

  const handleDownloadInvoice = async (orderId, invoiceNumber) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/orders/${orderId}/invoice`,
        {
          responseType: "blob"
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("Invoice download failed", error);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading orders...</div>;
  }

  return (
    <div>
      <h2>Orders</h2>
      <p>Track all customer orders and their current delivery status.</p>
      <p className="page-sub-note">
        Follow order progress, item details, and delivery status updates.
      </p>

      {orders.length === 0 ? (
        <p className="empty-state">No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const currentStep = getStep(order.status);

            return (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <h3>{order.restaurant.name}</h3>
                  <span
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Invoice No:</strong> {order.invoiceNumber}</p>
                <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>

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

                <button
                  className="invoice-btn"
                  onClick={() =>
                    handleDownloadInvoice(order._id, order.invoiceNumber)
                  }
                >
                  Download Invoice
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;