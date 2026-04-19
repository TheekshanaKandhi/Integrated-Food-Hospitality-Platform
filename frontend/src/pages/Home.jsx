import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const requests = [
        axios.get("http://127.0.0.1:5000/api/restaurants"),
        axios.get("http://127.0.0.1:5000/api/menu")
      ];

      if (token) {
        requests.push(
          axios.get("http://127.0.0.1:5000/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://127.0.0.1:5000/api/reviews", {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
      }

      const responses = await Promise.all(requests);

      const restaurantsData = Array.isArray(responses[0].data) ? responses[0].data : [];
      const menuData = Array.isArray(responses[1].data) ? responses[1].data : [];
      const ordersData = token && Array.isArray(responses[2]?.data) ? responses[2].data : [];
      const reviewsData = token && Array.isArray(responses[3]?.data) ? responses[3].data : [];

      setRestaurants(restaurantsData);
      setMenuItems(menuData);
      setOrders(ordersData);
      setReviews(reviewsData);
      setLoading(false);
    } catch (error) {
      console.log("Home fetch error:", error);
      setLoading(false);
    }
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const value = searchTerm.toLowerCase();
      return (
        restaurant.name?.toLowerCase().includes(value) ||
        restaurant.cuisine?.toLowerCase().includes(value) ||
        restaurant.address?.toLowerCase().includes(value)
      );
    });
  }, [restaurants, searchTerm]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const value = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(value) ||
        item.category?.toLowerCase().includes(value) ||
        item.restaurant?.name?.toLowerCase().includes(value)
      );
    });
  }, [menuItems, searchTerm]);

  const featuredRestaurants = searchTerm ? filteredRestaurants : restaurants.slice(0, 4);
  const featuredMenuItems = searchTerm ? filteredMenuItems : menuItems.slice(0, 4);

  const handleSearch = () => {
    const resultsSection = document.getElementById("home-search-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getRestaurantAverageRating = (restaurantId) => {
    const restaurantReviews = reviews.filter((review) => {
      const reviewRestaurantId =
        typeof review.restaurant === "object" ? review.restaurant._id : review.restaurant;
      return String(reviewRestaurantId) === String(restaurantId);
    });

    if (!restaurantReviews.length) return null;

    const total = restaurantReviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return (total / restaurantReviews.length).toFixed(1);
  };

  const fallbackRestaurantImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

  const fallbackMenuImage =
    "https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80";

  if (loading) {
    return <div className="loading-state">Loading home page...</div>;
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
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
            alt="Food Ordering"
          />
        </div>
      </section>

      <section className="official-stats-section">
        <div className="official-stat-box">
          <h3>{restaurants.length}</h3>
          <p>Restaurants</p>
        </div>
        <div className="official-stat-box">
          <h3>{menuItems.length}</h3>
          <p>Menu Items</p>
        </div>
        <div className="official-stat-box">
          <h3>{orders.length}</h3>
          <p>Orders</p>
        </div>
        <div className="official-stat-box">
          <h3>{reviews.length}</h3>
          <p>Reviews</p>
        </div>
      </section>

      <section className="official-section-block" id="home-search-results">
        <div className="section-heading-row">
          <div>
            <h3>{searchTerm ? "Matching Restaurants" : "Featured Restaurants"}</h3>
            <p>
              {searchTerm
                ? "Restaurants matching your search."
                : "Selected restaurants available on the platform."}
            </p>
          </div>
          <button className="section-link-btn" onClick={() => navigate("/restaurants")}>
            View All
          </button>
        </div>

        {featuredRestaurants.length === 0 ? (
          <p className="empty-state">No matching restaurants found.</p>
        ) : (
          <div className="official-card-grid restaurant-uniform-grid">
            {featuredRestaurants.map((restaurant) => {
              const avgRating = getRestaurantAverageRating(restaurant._id);

              return (
                <div
                  className="official-restaurant-card restaurant-uniform-card"
                  key={restaurant._id}
                >
                  <img
                    src={restaurant.imageUrl || fallbackRestaurantImage}
                    alt={restaurant.name}
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    style={{ cursor: "pointer" }}
                  />

                  <div className="official-card-body restaurant-uniform-body">
                    <div className="official-card-top restaurant-uniform-top">
                      <h4
                        className="restaurant-name-clamp"
                        onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {restaurant.name}
                      </h4>

                      <span className="restaurant-rating-fixed">
                        {avgRating ? `${avgRating} ★` : "New"}
                      </span>
                    </div>

                    <p className="restaurant-cuisine-clamp">{restaurant.cuisine}</p>
                    <p className="official-address-text restaurant-address-clamp">
                      {restaurant.address}
                    </p>

                    <div className="restaurant-card-actions restaurant-actions-bottom">
                      <button onClick={() => navigate(`/restaurants/${restaurant._id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="official-section-block">
        <div className="section-heading-row">
          <div>
            <h3>{searchTerm ? "Matching Menu Items" : "Featured Menu Items"}</h3>
            <p>
              {searchTerm
                ? "Menu items matching your search."
                : "Popular menu items available across restaurants."}
            </p>
          </div>
          <button className="section-link-btn" onClick={() => navigate("/menu")}>
            View All
          </button>
        </div>

        {featuredMenuItems.length === 0 ? (
          <p className="empty-state">No matching menu items found.</p>
        ) : (
          <div className="official-card-grid menu-uniform-grid">
            {featuredMenuItems.map((item) => (
              <div className="official-menu-card menu-uniform-card" key={item._id}>
                <img src={item.imageUrl || fallbackMenuImage} alt={item.name} />
                <div className="official-card-body menu-uniform-body">
                  <div className="official-card-top menu-uniform-top">
                    <h4 className="menu-name-clamp">{item.name}</h4>
                    <span className="menu-price-fixed">₹{item.price}</span>
                  </div>

                  <p className="menu-category-clamp">{item.category}</p>
                  <p className="official-address-text menu-restaurant-clamp">
                    {item.restaurant?.name || "Restaurant"}
                  </p>

                  <div className="restaurant-card-actions menu-actions-bottom">
                    <button onClick={() => navigate("/menu")}>View Menu</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;