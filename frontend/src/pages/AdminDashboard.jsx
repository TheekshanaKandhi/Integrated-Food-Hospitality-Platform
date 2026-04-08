import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    restaurants: 0,
    menu: 0,
    orders: 0,
    reviews: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [restaurantsRes, menuRes, ordersRes, reviewsRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/restaurants"),
          axios.get("http://127.0.0.1:5000/api/menu"),
          axios.get("http://127.0.0.1:5000/api/orders"),
          axios.get("http://127.0.0.1:5000/api/reviews")
        ]);

        setStats({
          restaurants: restaurantsRes.data.length,
          menu: menuRes.data.length,
          orders: ordersRes.data.length,
          reviews: reviewsRes.data.length
        });

        setRecentOrders([...ordersRes.data].reverse().slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-hero">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="page-sub-note">
            Manage restaurants, menu items, orders, reviews, and platform activity from one place.
          </p>
        </div>

        <div className="admin-hero-badge">
          <span>Admin Control Panel</span>
        </div>
      </div>

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🏬</div>
          <h3>Total Restaurants</h3>
          <p>{stats.restaurants}</p>
          <span>Active restaurant partners</span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🍽️</div>
          <h3>Total Menu Items</h3>
          <p>{stats.menu}</p>
          <span>Food items listed</span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🧾</div>
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
          <span>Orders processed so far</span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">⭐</div>
          <h3>Total Reviews</h3>
          <p>{stats.reviews}</p>
          <span>Customer feedback received</span>
        </div>
      </section>

      <section className="admin-actions-section">
        <h3>Quick Actions</h3>
        <div className="admin-actions-grid">
          <Link to="/add-restaurant" className="admin-action-card">
            <div className="admin-action-icon">🏬</div>
            <h4>Add Restaurant</h4>
            <p>Create and publish a new restaurant listing.</p>
          </Link>

          <Link to="/add-menu" className="admin-action-card">
            <div className="admin-action-icon">🍜</div>
            <h4>Add Menu Item</h4>
            <p>Add food items, pricing, and images.</p>
          </Link>

          <Link to="/add-order" className="admin-action-card">
            <div className="admin-action-icon">🧾</div>
            <h4>Add Order</h4>
            <p>Create and manage order entries.</p>
          </Link>

          <Link to="/add-review" className="admin-action-card">
            <div className="admin-action-icon">📷</div>
            <h4>Add Review</h4>
            <p>Attach ratings, comments, and review photos.</p>
          </Link>
        </div>
      </section>

      <section className="admin-recent-orders">
        <div className="admin-section-header">
          <h3>Recent Orders</h3>
          <Link to="/orders" className="admin-link-btn">
            View All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="empty-state">No recent orders found.</p>
        ) : (
          <div className="admin-orders-table">
            <div className="admin-orders-head">
              <span>Customer</span>
              <span>Restaurant</span>
              <span>Total</span>
              <span>Status</span>
            </div>

            {recentOrders.map((order) => (
              <div className="admin-orders-row" key={order._id}>
                <span>{order.customerName || order.user?.name || "Customer"}</span>
                <span>{order.restaurant?.name || "Restaurant"}</span>
                <span>₹{order.totalPrice}</span>
                <span>{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;