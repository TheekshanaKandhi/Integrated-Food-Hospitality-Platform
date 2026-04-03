import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [counts, setCounts] = useState({
    restaurants: 0,
    menu: 0,
    orders: 0,
    reviews: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [restaurantsRes, menuRes, ordersRes, reviewsRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/restaurants"),
          axios.get("http://127.0.0.1:5000/api/menu"),
          axios.get("http://127.0.0.1:5000/api/orders"),
          axios.get("http://127.0.0.1:5000/api/reviews")
        ]);

        setCounts({
          restaurants: restaurantsRes.data.length,
          menu: menuRes.data.length,
          orders: ordersRes.data.length,
          reviews: reviewsRes.data.length
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <h2>Welcome to Food Delivery and Dine-Out Platform</h2>
      <p>Manage restaurants, menu items, orders, and reviews from one place.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-icon">🏬</div>
          <h3>Total Restaurants</h3>
          <p>{counts.restaurants}</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🍜</div>
          <h3>Total Menu Items</h3>
          <p>{counts.menu}</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🧾</div>
          <h3>Total Orders</h3>
          <p>{counts.orders}</p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">⭐</div>
          <h3>Total Reviews</h3>
          <p>{counts.reviews}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;