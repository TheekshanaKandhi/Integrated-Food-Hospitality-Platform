import { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        ...formData,
        loginType: "admin"
      });

      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.user.email);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);

      window.location.href = "/admin-dashboard";
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Admin login failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split-card">
        <div className="auth-side auth-side-admin">
          <div className="auth-side-badge admin-badge">Admin Access</div>
          <h2>Control Center</h2>
          <p>
            Login as admin to manage restaurants, menu items, orders, reviews,
            photos, invoices, and platform activity from the dashboard.
          </p>

          <div className="auth-feature-list">
            <span>🏬 Manage restaurants</span>
            <span>🍽️ Manage menu items</span>
            <span>🧾 View orders and invoices</span>
            <span>⚙️ Admin dashboard controls</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card polished-auth-card admin-auth-card">
            <h2>Admin Login</h2>
            <p>Login with your admin account credentials.</p>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                />
              </div>

              <button type="submit" className="auth-main-btn admin-main-btn">
                Admin Login
              </button>
            </form>

            {message && (
              <p className={message.toLowerCase().includes("successful") ? "success-message" : "error-message"}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;