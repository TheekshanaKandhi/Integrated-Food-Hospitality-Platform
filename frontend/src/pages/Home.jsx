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
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [heroSearch, setHeroSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
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

        setCounts({
          restaurants: restaurantsRes.data.length,
          menu: menuRes.data.length,
          orders: ordersRes.data.length,
          reviews: reviewsRes.data.length
        });

        setAllRestaurants(restaurantsRes.data);
        setRestaurants(restaurantsRes.data.slice(0, 6));
        setMenuItems(menuRes.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fallbackRestaurantImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

  const handleHeroSearch = () => {
    if (!heroSearch.trim()) return;

    const search = heroSearch.trim().toLowerCase();

    // Check if search matches any restaurant names or cuisines
    const matchingRestaurants = allRestaurants.filter(r =>
      r.name.toLowerCase().includes(search) ||
      r.cuisine.toLowerCase().includes(search)
    );

    // Check if search matches any menu items
    const matchingMenuItems = menuItems.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.restaurant.name.toLowerCase().includes(search)
    );

    // If more restaurants match than menu items, or if restaurants match and no menu items, go to restaurants
    if (matchingRestaurants.length > matchingMenuItems.length || (matchingRestaurants.length > 0 && matchingMenuItems.length === 0)) {
      navigate(`/restaurants?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      // Otherwise, go to menu search
      navigate(`/menu?search=${encodeURIComponent(heroSearch.trim())}`);
    }
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
    <div className="home-structured-page">
      <section className="official-hero">
        <div className="official-hero-left">
          <span className="official-badge">Trusted food ordering experience</span>
          <h2>Discover restaurants and order food with a professional digital experience</h2>
          <p>
            Explore verified restaurants, browse curated menus, place orders,
            review your purchases, and download invoices from a structured platform.
          </p>

          <div className="official-hero-search">
            <input
              type="text"
              placeholder="Search restaurant, cuisine or dish"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              onKeyDown={handleHeroKeyDown}
            />
            <button onClick={handleHeroSearch}>Search</button>
          </div>

          <div className="official-hero-actions">
            <button onClick={() => navigate("/restaurants")}>Explore Restaurants</button>
            <button className="hero-outline-btn" onClick={() => navigate("/menu")}>
              Browse Menu
            </button>
          </div>
        </div>

        <div className="official-hero-right">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
            alt="Food ordering"
          />
        </div>
      </section>

      <section className="official-stats-section">
        <div className="official-stat-box">
          <h3>{counts.restaurants}</h3>
          <p>Restaurants</p>
        </div>
        <div className="official-stat-box">
          <h3>{counts.menu}</h3>
          <p>Menu Items</p>
        </div>
        <div className="official-stat-box">
          <h3>{counts.orders}</h3>
          <p>Orders</p>
        </div>
        <div className="official-stat-box">
          <h3>{counts.reviews}</h3>
          <p>Reviews</p>
        </div>
      </section>

      <section className="official-section-block">
        <div className="section-heading-row">
          <div>
            <h3>Featured Restaurants</h3>
            <p>Selected restaurants available on the platform.</p>
          </div>
          <Link to="/restaurants" className="section-link-btn">
            View All
          </Link>
        </div>

        <div className="official-card-grid">
          {restaurants.map((restaurant) => (
            <Link to={`/restaurants/${restaurant._id}`} className="official-restaurant-card" key={restaurant._id}>
              <img
                src={restaurant.imageUrl || fallbackRestaurantImage}
                alt={restaurant.name}
              />
              <div className="official-card-body">
                <div className="official-card-top">
                  <h4>{restaurant.name}</h4>
                  <span>⭐ {restaurant.rating || 4.2}</span>
                </div>
                <p>{restaurant.cuisine}</p>
                <p className="official-address-text">{restaurant.address}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;