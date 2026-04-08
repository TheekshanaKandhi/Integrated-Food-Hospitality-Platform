import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;