import { useEffect, useState } from "react";
import axios from "axios";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h2>Restaurants Page</h2>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant._id}>
              <strong>{restaurant.name}</strong> - {restaurant.cuisine} - {restaurant.address} - ID: {restaurant._id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Restaurants;