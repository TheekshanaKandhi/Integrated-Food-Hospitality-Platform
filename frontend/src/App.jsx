import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
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
  return (
  <div className="app-container">
    <h1>Food Delivery and Dine-Out Platform</h1>

    <nav>
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
    </nav>

    <div className="page-content">
      <Routes>
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