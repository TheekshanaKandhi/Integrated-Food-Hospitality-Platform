import { useEffect, useState } from "react";
import axios from "axios";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

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

  return (
    <div>
      <h2>Menu Page</h2>

      {menuItems.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              <strong>{item.name}</strong> - ₹{item.price} - {item.category} - {item.restaurant.name} - ID: {item._id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Menu;