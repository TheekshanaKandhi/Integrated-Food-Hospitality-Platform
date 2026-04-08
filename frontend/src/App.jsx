import "./App.css";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Protected from "./pages/Protected";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import AddRestaurant from "./pages/AddRestaurant";
import AddMenu from "./pages/AddMenu";
import AddOrder from "./pages/AddOrder";
import AddReview from "./pages/AddReview";
import PrivateRoute from "./pages/PrivateRoute";
import AdminRoute from "./pages/AdminRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
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
                <span className="profile-email">
                  {userEmail} {userRole === "admin" ? "(Admin)" : "(User)"}
                </span>
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
            Order food, explore restaurants, manage reviews, invoices, and platform operations.
          </p>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-section-title">Customer</div>
        <div className="nav-group">
          <Link to="/">Home</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/reviews">Reviews</Link>
        </div>

        <div className="nav-section-title">Account</div>
        <div className="nav-group">
          {!token && <Link to="/login">User Login</Link>}
          {!token && <Link to="/register">Register</Link>}
          {!token && <Link to="/admin-login">Admin Login</Link>}
          {token && <Link to="/protected">Protected</Link>}
        </div>

        {userRole === "admin" && (
          <>
            <div className="nav-section-title admin-title">Admin</div>
            <div className="nav-group admin-links">
              <Link to="/admin-dashboard">Dashboard</Link>
              <Link to="/add-restaurant">Add Restaurant</Link>
              <Link to="/add-menu">Add Menu</Link>
              <Link to="/add-order">Add Order</Link>
              <Link to="/add-review">Add Review</Link>
            </div>
          </>
        )}
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />

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
            path="/restaurants/:id"
            element={
              <PrivateRoute>
                <RestaurantDetails />
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
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
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
            path="/add-review"
            element={
              <PrivateRoute>
                <AddReview />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/add-restaurant"
            element={
              <AdminRoute>
                <AddRestaurant />
              </AdminRoute>
            }
          />
          <Route
            path="/add-menu"
            element={
              <AdminRoute>
                <AddMenu />
              </AdminRoute>
            }
          />
          <Route
            path="/add-order"
            element={
              <AdminRoute>
                <AddOrder />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      <footer className="app-footer">
        <div className="footer-brand">
          <h3>Food Delivery and Dine-Out Platform</h3>
          <p>Discover restaurants, explore menus, enjoy quick ordering, and manage everything professionally.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/reviews">Reviews</Link>
        </div>

        <p className="footer-copy">© 2026 Food Delivery and Dine-Out Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;