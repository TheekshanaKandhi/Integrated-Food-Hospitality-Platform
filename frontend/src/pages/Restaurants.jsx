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

  const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
  ];

  return (
    <div>
      <h2>Restaurants</h2>
      <p>Browse all restaurant partners available in the platform.</p>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((restaurant, index) => (
            <div className="restaurant-card" key={restaurant._id}>
              <img
                src={restaurantImages[index % restaurantImages.length]}
                alt={restaurant.name}
              />
              <div className="restaurant-card-body">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                  <span>⭐ {restaurant.rating || 4.2}</span>
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Restaurants;