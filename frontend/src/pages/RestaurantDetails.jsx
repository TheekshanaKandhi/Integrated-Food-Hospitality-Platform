import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantsRes = await axios.get("http://127.0.0.1:5000/api/restaurants");
        const menuRes = await axios.get("http://127.0.0.1:5000/api/menu");

        const foundRestaurant = restaurantsRes.data.find((r) => r._id === id);
        setRestaurant(foundRestaurant || null);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => item.restaurant && item.restaurant._id === id);
  }, [menuItems, id]);

  const fallbackRestaurantBanner =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  const fallbackMenuImage =
    "https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80";

  const handleAddToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = existingCart.find((cartItem) => cartItem._id === item._id);

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...existingCart, { ...item, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setMessage(`${item.name} added to cart`);
    setTimeout(() => setMessage(""), 2500);
  };

  if (!restaurant) {
    return <p>Restaurant not found.</p>;
  }

  return (
    <div>
      <div className="restaurant-details-banner">
        <img
          src={restaurant.imageUrl || fallbackRestaurantBanner}
          alt={restaurant.name}
        />
      </div>

      <div className="restaurant-details-header">
        <div className="title-with-map details-title-row">
          <h2>{restaurant.name}</h2>
          {restaurant.mapUrl && (
            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="map-btn details-map-btn"
            >
              📍
            </a>
          )}
        </div>
        <p>{restaurant.cuisine} • {restaurant.address}</p>
        <span className="restaurant-tagline">Popular choice for quick bites and family meals</span>
        <p className="page-sub-note">Browse popular dishes, prices, and add your favourites to cart.</p>
        <div className="restaurant-details-meta">
          <span>⭐ {restaurant.rating || 4.2}</span>
          <span>30-40 min</span>
          <span>₹300 for two</span>
        </div>
      </div>

      {message && <div className="toast">{message}</div>}

      <section className="restaurant-menu-section">
        <p className="section-helper-text">Choose your favourite dishes and add them to cart.</p>
        <h3>Menu</h3>

        {filteredMenuItems.length === 0 ? (
          <p className="empty-state">No menu items found for this restaurant.</p>
        ) : (
          <div className="menu-grid">
            {filteredMenuItems.map((item) => (
              <div className="menu-card" key={item._id}>
                <img
                  src={item.imageUrl || fallbackMenuImage}
                  alt={item.name}
                />
                <div className="menu-card-body">
                  <h3>{item.name}</h3>
                  <span className="food-badge">Veg</span>
                  <p>{item.category}</p>
                  <span className="menu-note">Freshly prepared and delivered hot</span>
                  <div className="menu-meta">
                    <span>₹{item.price}</span>
                    <button onClick={() => handleAddToCart(item)}>Add</button>
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

export default RestaurantDetails;