import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/menu");
        setMenuItems(res.data);
      } catch (error) {
        console.log(error);
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

  const menuImages = [
    "https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1604908176997-431da2f1b0f9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
  ];

  return (
    <div>
      <h2>Menu Items</h2>
      <p>View all food items available across restaurants.</p>

      <div className="restaurant-filter-bar">
        <input
          type="text"
          placeholder="Search by dish, category, or restaurant"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMenuItems.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <div className="menu-grid">
          {filteredMenuItems.map((item, index) => (
            <div className="menu-card" key={item._id}>
              <img
                src={menuImages[index % menuImages.length]}
                alt={item.name}
              />
              <div className="menu-card-body">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <div className="menu-meta">
                  <span>₹{item.price}</span>
                  <span>{item.restaurant.name}</span>
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