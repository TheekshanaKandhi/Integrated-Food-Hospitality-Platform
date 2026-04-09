import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const searchValue = searchParams.get("search") || "";
    setSearchTerm(searchValue);
  }, [searchParams]);

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

  const fallbackRestaurantImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

  const handleDeleteRestaurant = async (restaurantId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://127.0.0.1:5000/api/restaurants/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message || "Restaurant deleted successfully");
      fetchRestaurants();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to delete restaurant");
    }
  };

  if (loading) {
    return <div className="loading-state">Loading restaurants...</div>;
  }

  return (
    <div className="structured-list-page">
      <section className="page-title-block">
        <h2>Restaurants</h2>
        <p>Browse verified restaurant partners available on the platform.</p>
      </section>

      {message && (
        <p className={message.toLowerCase().includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <section className="filter-panel">
        <input
          type="text"
          placeholder="Search by restaurant, cuisine, or address"
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
      </section>

      {filteredRestaurants.length === 0 ? (
        <p className="empty-state">No restaurants found.</p>
      ) : (
        <div className="official-card-grid">
          {filteredRestaurants.map((restaurant) => (
            <div className="official-restaurant-card" key={restaurant._id}>
              <img
                src={restaurant.imageUrl || fallbackRestaurantImage}
                alt={restaurant.name}
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                style={{ cursor: "pointer" }}
              />
              <div className="official-card-body">
                <div className="official-card-top">
                  <h4
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {restaurant.name}
                  </h4>
                  <span>⭐ {restaurant.rating || 4.2}</span>
                </div>

                <p>{restaurant.cuisine}</p>
                <p className="official-address-text">{restaurant.address}</p>

                <div className="restaurant-card-actions">
                  <button onClick={() => navigate(`/restaurants/${restaurant._id}`)}>
                    View Details
                  </button>

                  {userRole === "admin" && (
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                      title="Delete Restaurant"
                    >
                      🗑
                    </button>
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

export default Restaurants;