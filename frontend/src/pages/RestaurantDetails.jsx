import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        axios.get(`http://127.0.0.1:5000/api/restaurants/${id}`),
        axios.get("http://127.0.0.1:5000/api/menu")
      ]);

      setRestaurant(restaurantRes.data);

      const filteredMenu = menuRes.data.filter((item) => {
        const restaurantId =
          typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant;
        return restaurantId === id;
      });

      setMenuItems(filteredMenu);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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

  const handleEditMenu = (item) => {
    navigate("/add-menu", { state: { editItem: item } });
  };

  const handleDeleteMenu = async (menuId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://127.0.0.1:5000/api/menu/${menuId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(res.data.message || "Menu item deleted successfully");
      fetchRestaurantDetails();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to delete menu item");
    }
  };

  const fallbackRestaurantImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

  const fallbackMenuImage =
    "https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80";

  if (loading) {
    return <div className="loading-state">Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div className="error-message">Restaurant not found</div>;
  }

  return (
    <div className="structured-list-page">
      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <div className="restaurant-details-banner">
        <img
          src={restaurant.imageUrl || fallbackRestaurantImage}
          alt={restaurant.name}
        />
      </div>

      <div className="restaurant-details-header">
        <div className="title-with-map">
          <div>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.cuisine}</p>
            <p className="official-address-text">{restaurant.address}</p>
          </div>

          {restaurant.mapUrl && (
            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="map-btn"
              title="Open Map"
            >
              📍
            </a>
          )}
        </div>
      </div>

      <section className="official-section-block">
        <div className="section-heading-row">
          <div>
            <h3>Menu Items</h3>
            <p>Available dishes from this restaurant.</p>
          </div>

          {userRole === "admin" && (
            <button
              className="section-link-btn"
              onClick={() => navigate("/add-menu", { state: { selectedRestaurant: restaurant._id } })}
            >
              Add Menu Item
            </button>
          )}
        </div>

        {menuItems.length === 0 ? (
          <p className="empty-state">No menu items found for this restaurant.</p>
        ) : (
          <div className="official-card-grid">
            {menuItems.map((item) => (
              <div className="official-menu-card" key={item._id}>
                <img
                  src={item.imageUrl || fallbackMenuImage}
                  alt={item.name}
                />
                <div className="official-card-body">
                  <div className="official-card-top">
                    <h4>{item.name}</h4>
                    <span>₹{item.price}</span>
                  </div>

                  <p>{item.category}</p>

                  <div className="restaurant-card-actions">
                    <button onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </button>

                    {userRole === "admin" && (
                      <>
                        <button
                          className="icon-btn edit-btn"
                          onClick={() => handleEditMenu(item)}
                          title="Edit Menu"
                        >
                          ✎
                        </button>

                        <button
                          className="icon-btn delete-btn"
                          onClick={() => handleDeleteMenu(item._id)}
                          title="Delete Menu"
                        >
                          🗑
                        </button>
                      </>
                    )}
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