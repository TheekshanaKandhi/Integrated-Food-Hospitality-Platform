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
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [restaurantsRes, menuRes, ordersRes, reviewsRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/restaurants"),
          axios.get("http://127.0.0.1:5000/api/menu"),
          axios.get("http://127.0.0.1:5000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
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
    <div className="admin-structured-page">
      <section className="admin-dashboard-header">
        <div>
          <span className="official-badge">Administration</span>
          <h2>Admin Dashboard</h2>
          <p>Monitor platform data and manage operations from a central control panel.</p>
        </div>
      </section>

      <section className="admin-summary-grid">
        <div className="admin-summary-card">
          <h3>{stats.restaurants}</h3>
          <p>Total Restaurants</p>
        </div>
        <div className="admin-summary-card">
          <h3>{stats.menu}</h3>
          <p>Total Menu Items</p>
        </div>
        <div className="admin-summary-card">
          <h3>{stats.orders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="admin-summary-card">
          <h3>{stats.reviews}</h3>
          <p>Total Reviews</p>
        </div>
      </section>

      <section className="official-section-block">
        <div className="section-heading-row">
          <div>
            <h3>Administrative Actions</h3>
            <p>Quick access to essential management workflows.</p>
          </div>
        </div>

        <div className="admin-action-grid-structured">
          <Link to="/add-restaurant" className="admin-panel-tile">
            <h4>Add Restaurant</h4>
            <p>Create and publish a restaurant entry with images and maps.</p>
          </Link>

          <Link to="/add-menu" className="admin-panel-tile">
            <h4>Add Menu Item</h4>
            <p>Add dishes, categories, prices, and menu item photos.</p>
          </Link>

          <Link to="/add-order" className="admin-panel-tile">
            <h4>Create Order</h4>
            <p>Manage operational order records from the admin side.</p>
          </Link>

          <Link to="/reviews" className="admin-panel-tile">
            <h4>View Reviews</h4>
            <p>Inspect customer ratings, review comments, and uploaded images.</p>
          </Link>
        </div>
      </section>

      <section className="official-section-block">
        <div className="section-heading-row">
          <div>
            <h3>Recent Orders</h3>
            <p>Most recent order activity on the platform.</p>
          </div>
          <Link to="/orders" className="section-link-btn">
            View All
          </Link>
        </div>

        <div className="official-table">
          <div className="official-table-head">
            <span>Customer</span>
            <span>Restaurant</span>
            <span>Total</span>
            <span>Status</span>
          </div>

          {recentOrders.map((order) => (
            <div className="official-table-row" key={order._id}>
              <span>{order.customerName || order.user?.name || "Customer"}</span>
              <span>{order.restaurant?.name || "Restaurant"}</span>
              <span>₹{order.totalPrice}</span>
              <span>{order.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;