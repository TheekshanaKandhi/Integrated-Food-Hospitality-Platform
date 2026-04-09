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
      <header className="official-header">
        <div className="official-header-inner">
          <div className="brand-block" onClick={() => navigate("/")}>
            <div className="brand-logo">FD</div>
            <div className="brand-text">
              <h1>Food Delivery Platform</h1>
              <p>Professional food ordering and management system</p>
            </div>
          </div>

          <div className="header-right">
            {token ? (
              <div className="profile-panel">
                <div className="profile-circle">{getInitial()}</div>
                <div className="profile-meta">
                  <span className="profile-email">{userEmail}</span>
                  <span className="profile-role">
                    {userRole === "admin" ? "Administrator" : "Customer"}
                  </span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="guest-panel">
                <button className="header-outline-btn" onClick={() => navigate("/login")}>
                  User Login
                </button>
                <button className="header-solid-btn" onClick={() => navigate("/admin-login")}>
                  Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="official-navbar">
        <div className="official-navbar-inner">
          {userRole === "admin" ? (
            <div className="nav-links">
              <Link to="/admin-dashboard">Dashboard</Link>
              <Link to="/restaurants">Restaurants</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/reviews">Reviews</Link>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/restaurants">Restaurants</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/cart">Cart ({cartCount})</Link>
            </div>
          )}

          {!token && (
            <div className="nav-auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="page-content official-page-width">
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
      </main>

      <footer className="official-footer">
        <div className="official-footer-inner">
          <div className="footer-col">
            <h3>Food Delivery Platform</h3>
            <p>
              A modern platform for restaurant discovery, food ordering,
              reviews, billing, and administrative management.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-link-list">
              <Link to="/">Home</Link>
              <Link to="/restaurants">Restaurants</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/orders">Orders</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Access</h4>
            <div className="footer-link-list">
              <Link to="/login">User Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/admin-login">Admin Login</Link>
            </div>
          </div>
        </div>

        <div className="official-footer-bottom">
          © 2026 Food Delivery Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;