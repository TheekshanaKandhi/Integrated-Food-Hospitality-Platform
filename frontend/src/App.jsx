import "./App.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Protected from "./pages/Protected";
import Restaurants from "./pages/Restaurants";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import AddRestaurant from "./pages/AddRestaurant";
import AddMenu from "./pages/AddMenu";
import AddOrder from "./pages/AddOrder";
import AddReview from "./pages/AddReview";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const getInitial = () => {
    if (!userEmail) return "U";
    return userEmail.charAt(0).toUpperCase();
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="profile-section">
          {token ? (
            <>
              <div className="profile-circle">{getInitial()}</div>
              <div className="profile-info">
                <span className="profile-email">{userEmail}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="profile-info">
              <span className="profile-email">Guest User</span>
            </div>
          )}
        </div>
      </div>

      <div className="app-header">
        <div className="app-logo">🍽️</div>
        <div className="app-title-block">
          <h1>Food Delivery and Dine-Out Platform</h1>
          <p className="app-subtitle">
            Manage restaurants, menu, orders, and reviews in one dashboard
          </p>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-group">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/protected">Protected</Link>
        </div>

        <div className="nav-group">
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/reviews">Reviews</Link>
        </div>

        <div className="nav-group">
          <Link to="/add-restaurant">Add Restaurant</Link>
          <Link to="/add-menu">Add Menu</Link>
          <Link to="/add-order">Add Order</Link>
          <Link to="/add-review">Add Review</Link>
        </div>
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <Protected />
              </PrivateRoute>
            }
          />
          <Route
            path="/restaurants"
            element={
              <PrivateRoute>
                <Restaurants />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <PrivateRoute>
                <Reviews />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-restaurant"
            element={
              <PrivateRoute>
                <AddRestaurant />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-menu"
            element={
              <PrivateRoute>
                <AddMenu />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-order"
            element={
              <PrivateRoute>
                <AddOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-review"
            element={
              <PrivateRoute>
                <AddReview />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;