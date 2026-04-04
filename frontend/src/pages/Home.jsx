import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [counts, setCounts] = useState({
    restaurants: 0,
    menu: 0,
    orders: 0,
    reviews: 0
  });
  const [restaurants, setRestaurants] = useState([]);
  const [heroSearch, setHeroSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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

        setRestaurants(restaurantsRes.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
  ];

  const goToCategory = (category) => {
    navigate(`/menu?search=${encodeURIComponent(category)}`);
  };

  const handleHeroSearch = () => {
    if (!heroSearch.trim()) return;
    navigate(`/menu?search=${encodeURIComponent(heroSearch.trim())}`);
  };

  const handleHeroKeyDown = (e) => {
    if (e.key === "Enter") {
      handleHeroSearch();
    }
  };

  if (loading) {
    return <div className="loading-state">Loading home...</div>;
  }

  return (
    <div>
      <section className="hero-section">
        <div className="hero-text">
          <h2>Discover the best food and dining near you</h2>
          <p>
            Order from top restaurants, explore menus, track orders, and enjoy
            a modern food delivery experience.
          </p>

          <div className="hero-search">
            <input
              type="text"
              placeholder="Search for restaurant, cuisine or dish"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={handleHeroKeyDown}
            />
            <button onClick={handleHeroSearch}>Search</button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
            alt="Food Banner"
          />
        </div>
      </section>

      <section className="categories-section">
        <h3>Popular Categories</h3>
        <div className="categories-grid">
          <div className="category-card" onClick={() => goToCategory("Biryani")}>🍚 Biryani</div>
          <div className="category-card" onClick={() => goToCategory("Pizza")}>🍕 Pizza</div>
          <div className="category-card" onClick={() => goToCategory("Burger")}>🍔 Burgers</div>
          <div className="category-card" onClick={() => goToCategory("South Indian")}>🥘 South Indian</div>
          <div className="category-card" onClick={() => goToCategory("Dessert")}>🍰 Desserts</div>
          <div className="category-card" onClick={() => goToCategory("Beverage")}>🥤 Beverages</div>
        </div>
      </section>

      <section className="featured-section">
        <h3>Featured Restaurants</h3>
        <div className="featured-grid">
          {restaurants.map((restaurant, index) => (
            <Link
              to={`/restaurants/${restaurant._id}`}
              className="featured-card-link"
              key={restaurant._id}
            >
              <div className="featured-card">
                <img
                  src={restaurantImages[index % restaurantImages.length]}
                  alt={restaurant.name}
                />
                <div className="featured-card-body">
                  <h4>{restaurant.name}</h4>
                  <p>{restaurant.cuisine}</p>
                  <div className="featured-meta">
                    <span>⭐ {restaurant.rating || 4.2}</span>
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Platform Overview</h3>
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
      </section>
    </div>
  );
}

export default Home;