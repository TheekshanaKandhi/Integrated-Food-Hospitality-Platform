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

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <h1>Food Delivery and Dine-Out Platform</h1>

      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/protected">Protected</Link> |{" "}
        <Link to="/restaurants">Restaurants</Link> |{" "}
        <Link to="/menu">Menu</Link> |{" "}
        <Link to="/orders">Orders</Link> |{" "}
        <Link to="/reviews">Reviews</Link> |{" "}
        <Link to="/add-restaurant">Add Restaurant</Link> |{" "}
        <Link to="/add-menu">Add Menu</Link> |{" "}
        <Link to="/add-order">Add Order</Link> |{" "}
        <Link to="/add-review">Add Review</Link>
        {token && (
          <>
            {" | "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/add-restaurant" element={<AddRestaurant />} />
          <Route path="/add-menu" element={<AddMenu />} />
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/add-review" element={<AddReview />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;