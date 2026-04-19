import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});

  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userEmail) {
        setError("You are not logged in, or your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const ordersRes = await axios.get("http://127.0.0.1:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const allOrders = ordersRes.data;
        setOrders(allOrders);

        setStatusUpdates(
          allOrders.reduce((acc, order) => {
            acc[order._id] = order.status;
            return acc;
          }, {})
        );
      } catch (error) {
        console.log("Error fetching orders:", error);
        setError(
          error.response?.data?.message ||
            "Unable to fetch orders. Please refresh or log in again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail, token]);

  const getStep = (status) => {
    switch ((status || "").toLowerCase()) {
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
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  const statusOptions = ["Placed", "Confirmed", "Preparing", "Delivered"];

  const handleStatusChange = (orderId, value) => {
    setStatusUpdates((current) => ({
      ...current,
      [orderId]: value
    }));
  };

  const handleAdminStatusUpdate = async (orderId) => {
    const status = statusUpdates[orderId];

    if (!status) {
      setError("Please select a status before updating.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedOrder = response.data.order;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setStatusUpdates((current) => ({
        ...current,
        [orderId]: updatedOrder.status
      }));

      setError("");
    } catch (error) {
      console.log("Error updating order status:", error);
      setError(
        error.response?.data?.message ||
          "Unable to update order status. Please try again."
      );
    }
  };

  const handleAdminDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders((currentOrders) =>
        currentOrders.filter((order) => order._id !== orderId)
      );

      setError("");
    } catch (error) {
      console.log("Error deleting order:", error);
      setError(
        error.response?.data?.message ||
          "Unable to delete order. Please try again."
      );
    }
  };

  if (loading) {
    return <div className="loading-state">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h2>Orders</h2>
        <p>
          {userRole === "admin"
            ? "Track all customer orders and their current delivery status."
            : "Track your order history and delivery status."}
        </p>
        <p className="page-sub-note">
          {userRole === "admin"
            ? "Follow order progress, item details, and delivery status updates."
            : "Monitor your order progress and download invoices."}
        </p>
      </div>

      {error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <p className="empty-state">No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const currentStep = getStep(order.status);

            return (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <h3>{order.restaurant?.name || "Restaurant"}</h3>
                  <span className={`order-status ${String(order.status).toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-meta">
                  <p><strong>Customer:</strong> {order.customerName || order.user?.name || "Customer"}</p>
                  <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                  {userRole === "admin" && (
                    <p><strong>Order ID:</strong> {order._id}</p>
                  )}
                  <p><strong>Ordered on:</strong> {new Date(order.createdAt || Date.now()).toLocaleString()}</p>
                  <p><strong>Invoice No:</strong> {order.invoiceNumber}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
                </div>

                <div className="order-progress">
                  <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>Placed</div>
                  <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>Confirmed</div>
                  <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>Preparing</div>
                  <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>Delivered</div>
                </div>

                {userRole === "admin" && (
                  <div className="admin-status-control">
                    <label htmlFor={`status-${order._id}`}>Update Status</label>
                    <div className="admin-status-select-row">
                      <select
                        id={`status-${order._id}`}
                        value={statusUpdates[order._id] || order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        className="secondary-cta"
                        onClick={() => handleAdminStatusUpdate(order._id)}
                        disabled={statusUpdates[order._id] === order.status}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-items">
                  <h4>Items</h4>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <p key={item._id}>
                        {item.menuItem?.name || "Menu Item"} × {item.quantity}
                      </p>
                    ))
                  ) : (
                    <p>No items found</p>
                  )}
                </div>

                <div className="order-action-row">
  <button
    className="invoice-btn"
    onClick={() => handleDownloadInvoice(order._id, order.invoiceNumber)}
  >
    Download Invoice
  </button>

  {userRole === "admin" ? (
    <button
      className="icon-btn delete-btn"
      type="button"
      title="Delete Order"
      onClick={() => handleAdminDeleteOrder(order._id)}
    >
      🗑
    </button>
  ) : String(order.status).toLowerCase() === "delivered" ? (
    <button
      className="secondary-cta"
      onClick={() => navigate(`/add-review?order=${order._id}`)}
    >
      Write Review
    </button>
  ) : (
    <div></div>
  )}
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