import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchValue = searchParams.get("search") || "";
    setSearchTerm(searchValue);
  }, [searchParams]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/menu");
        setMenuItems(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [menuItems, searchTerm]);

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

  if (loading) {
    return <div className="loading-state">Loading menu...</div>;
  }

  return (
    <div>
      <h2>Menu Items</h2>
      <p>View all food items available across restaurants.</p>
      <p className="page-sub-note">Search dishes, explore categories, and quickly add items to cart.</p>
      <p className="section-helper-text">Search dishes by name, category, or restaurant.</p>

      <div className="restaurant-filter-bar">
        <input
          type="text"
          placeholder="Search by dish, category, or restaurant"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {message && <div className="toast">{message}</div>}

      {filteredMenuItems.length === 0 ? (
        <p className="empty-state">No menu items found.</p>
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
                  <span>{item.restaurant.name}</span>
                </div>
                <button onClick={() => handleAddToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;