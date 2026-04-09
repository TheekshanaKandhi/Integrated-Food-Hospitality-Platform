import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AddMenu() {
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    restaurant: ""
  });
  const [image, setImage] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/restaurants");
      setRestaurants(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/menu");
      setMenuItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (location.state?.editItem) {
      const item = location.state.editItem;
      setEditingMenuId(item._id);
      setFormData({
        name: item.name || "",
        category: item.category || "",
        price: item.price || "",
        restaurant:
          typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant
      });
      setImage(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (location.state?.selectedRestaurant) {
      // Pre-select restaurant when coming from restaurant details page
      setFormData(prev => ({
        ...prev,
        restaurant: location.state.selectedRestaurant
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      restaurant: ""
    });
    setImage(null);
    setEditingMenuId(null);
    const fileInput = document.getElementById("menu-image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleEditClick = (item) => {
    setEditingMenuId(item._id);
    setFormData({
      name: item.name || "",
      category: item.category || "",
      price: item.price || "",
      restaurant:
        typeof item.restaurant === "object" ? item.restaurant._id : item.restaurant
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      if (editingMenuId === menuId) {
        resetForm();
      }

      fetchMenuItems();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to delete menu item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.restaurant) {
      setMessage("Please fill all required fields including selecting a restaurant.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("restaurant", formData.restaurant);

      if (image) {
        payload.append("image", image);
      }

      let res;

      if (editingMenuId) {
        res = await axios.put(
          `http://127.0.0.1:5000/api/menu/${editingMenuId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      } else {
        res = await axios.post(
          "http://127.0.0.1:5000/api/menu",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      setMessage(res.data.message || "Menu item saved successfully");
      resetForm();
      fetchMenuItems();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to save menu item");
    }
  };

  if (userRole !== "admin") {
    return <p className="error-message">Only admin can manage menu items.</p>;
  }

  return (
    <div>
      <h2>{editingMenuId ? "Edit Menu Item" : "Add Menu Item"}</h2>
      <p>{editingMenuId ? "Update menu item details." : "Create a new menu item for a restaurant."}</p>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <div className="info-card">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Item Name: <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label>Category: <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
            />
          </div>

          <div>
            <label>Price: <span style={{color: 'red'}}>*</span></label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label>Restaurant: <span style={{color: 'red'}}>*</span></label>
            <select
              name="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Food Image:</label>
            <input
              id="menu-image-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button type="submit">
              {editingMenuId ? "Save Changes" : "Add Menu Item"}
            </button>

            {editingMenuId && (
              <button
                type="button"
                className="delete-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>Existing Menu Items</h3>

        {menuItems.length === 0 ? (
          <p className="empty-state">No menu items found.</p>
        ) : (
          <div className="official-card-grid">
            {menuItems.map((item) => (
              <div className="official-menu-card" key={item._id}>
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={item.name}
                />
                <div className="official-card-body">
                  <div className="official-card-top">
                    <h4>{item.name}</h4>
                    <span>₹{item.price}</span>
                  </div>
                  <p>{item.category}</p>
                  <p className="official-address-text">
                    {item.restaurant?.name || "Restaurant"}
                  </p>

                  <div className="restaurant-card-actions">
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => handleEditClick(item)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddMenu;