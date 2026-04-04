import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/restaurants");
        setRestaurants(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const cuisines = useMemo(() => {
    const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisine))];
    return ["All", ...uniqueCuisines];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCuisine =
        selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;

      return matchesSearch && matchesCuisine;
    });
  }, [restaurants, searchTerm, selectedCuisine]);

  const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
  ];

  if (loading) {
    return <div className="loading-state">Loading restaurants...</div>;
  }

  return (
    <div>
      <h2>Restaurants</h2>
      <p>Browse all restaurant partners available in the platform.</p>

      <div className="restaurant-filter-bar">
        <input
          type="text"
          placeholder="Search by restaurant, cuisine, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
        >
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      {filteredRestaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              className="restaurant-card clickable-card"
              key={restaurant._id}
              onClick={() => navigate(`/restaurants/${restaurant._id}`)}
            >
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
                <div className="featured-extra">
                <span>30-40 min</span>
                <span>₹300 for two</span>
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