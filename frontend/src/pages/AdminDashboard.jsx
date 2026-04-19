import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    restaurants: 0,
    menuItems: 0,
    orders: 0,
    reviews: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [restaurantsRes, menuRes, ordersRes, reviewsRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/api/restaurants", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://127.0.0.1:5000/api/menu", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://127.0.0.1:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://127.0.0.1:5000/api/reviews", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const restaurants = Array.isArray(restaurantsRes.data) ? restaurantsRes.data : [];
      const menuItems = Array.isArray(menuRes.data) ? menuRes.data : [];
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

      setStats({
        restaurants: restaurants.length,
        menuItems: menuItems.length,
        orders: orders.length,
        reviews: reviews.length
      });

      setRecentOrders(orders.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.log("Dashboard fetch error:", error);
      setMessage(error.response?.data?.message || "Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-pro">
      <section className="admin-dashboard-pro-hero">
        <div>
          <span className="admin-dashboard-pro-label">Administration</span>
          <h2>Dashboard</h2>
          <p>
            Monitor restaurants, menu items, orders, and customer reviews from a single control panel.
          </p>
        </div>
      </section>

      {message && <p className="error-message">{message}</p>}

      <section className="admin-dashboard-stats">
        <div className="admin-dashboard-stat-card">
          <span className="admin-dashboard-stat-title">Total Restaurants</span>
          <h3>{stats.restaurants}</h3>
        </div>

        <div className="admin-dashboard-stat-card">
          <span className="admin-dashboard-stat-title">Total Menu Items</span>
          <h3>{stats.menuItems}</h3>
        </div>

        <div className="admin-dashboard-stat-card">
          <span className="admin-dashboard-stat-title">Total Orders</span>
          <h3>{stats.orders}</h3>
        </div>

        <div className="admin-dashboard-stat-card">
          <span className="admin-dashboard-stat-title">Total Reviews</span>
          <h3>{stats.reviews}</h3>
        </div>
      </section>

      <section className="admin-dashboard-panel">
        <div className="section-heading-row">
          <div>
            <h3>Management</h3>
            <p>Access core administrative workflows.</p>
          </div>
        </div>

        <div className="admin-dashboard-actions">
          <Link to="/add-restaurant" className="admin-dashboard-action-card">
            <h4>Add Restaurant</h4>
            <p>Create and publish restaurant records.</p>
          </Link>

          <Link to="/add-menu" className="admin-dashboard-action-card">
            <h4>Add Menu Item</h4>
            <p>Manage dishes, pricing, and menu content.</p>
          </Link>

          <Link to="/add-order" className="admin-dashboard-action-card">
            <h4>Create Order</h4>
            <p>Create or manage operational order entries.</p>
          </Link>

          <Link to="/reviews" className="admin-dashboard-action-card">
            <h4>Review Management</h4>
            <p>Inspect customer ratings, comments, and images.</p>
          </Link>
        </div>
      </section>

      <section className="admin-dashboard-panel">
        <div className="section-heading-row">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest order activity across the platform.</p>
          </div>

          <Link to="/orders" className="section-link-btn">
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="empty-state">No orders available.</p>
        ) : (
          <div className="admin-dashboard-table-wrap">
            <div className="admin-dashboard-table">
              <div className="admin-dashboard-table-head">
                <div>Customer</div>
                <div>Restaurant</div>
                <div>Total</div>
                <div>Status</div>
              </div>

              {recentOrders.map((order) => (
                <div className="admin-dashboard-table-row" key={order._id}>
                  <div>{order.customerName || order.user?.name || "Customer"}</div>
                  <div>{order.restaurant?.name || "Restaurant"}</div>
                  <div>₹{order.totalPrice}</div>
                  <div>
                    <span className={`admin-dashboard-status ${String(order.status).toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;