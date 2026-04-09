import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const searchValue = searchParams.get("search") || "";
    setSearchTerm(searchValue);
  }, [searchParams]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

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
      fetchMenuItems();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to delete menu item");
    }
  };

  const handleEditMenu = (item) => {
    navigate("/add-menu", { state: { editItem: item } });
  };

  if (loading) {
    return <div className="loading-state">Loading menu...</div>;
  }

  return (
    <div className="structured-list-page">
      <section className="page-title-block">
        <h2>Menu</h2>
        <p>Browse dishes across restaurants and add items to your cart.</p>
      </section>

      <section className="filter-panel">
        <input
          type="text"
          placeholder="Search by dish, category, or restaurant"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      {filteredMenuItems.length === 0 ? (
        <p className="empty-state">No menu items found.</p>
      ) : (
        <div className="official-card-grid">
          {filteredMenuItems.map((item) => (
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
                <p className="official-address-text">{item.restaurant.name}</p>

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
    </div>
  );
}

export default Menu;