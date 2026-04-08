import { useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const saveUserSession = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userRole", userData.role || "user");
    localStorage.setItem("userName", userData.name || "");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/register", formData);
      setMessage(res.data.message);
      saveUserSession(res.data.user, res.data.token);

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Registration failed");
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const res = await axios.post("http://127.0.0.1:5000/api/auth/google", {
        name: googleUser.displayName || "Google User",
        email: googleUser.email
      });

      saveUserSession(res.data.user, res.data.token);
      setMessage("Google signup successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Google signup error code:", error.code);
      console.error("Google signup error message:", error.message);
      setMessage(`${error.code || ""} ${error.message || "Google signup failed"}`.trim());
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split-card">
        <div className="auth-side auth-side-register">
          <div className="auth-side-badge">Create Account</div>
          <h2>Join the Platform</h2>
          <p>
            Create your account to browse menus, save your details, place food
            orders faster, upload reviews, and track your order history.
          </p>

          <div className="auth-feature-list">
            <span>🍜 Discover menus</span>
            <span>📍 Find restaurants</span>
            <span>📷 Upload review photos</span>
            <span>🧾 Get invoices anytime</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card polished-auth-card">
            <h2>Create User Account</h2>
            <p>Sign up and start ordering in minutes.</p>

            <button
              type="button"
              className="google-btn polished-google-btn"
              onClick={handleGoogleRegister}
            >
              <span className="google-mark">G</span>
              Sign up with Google
            </button>

            <div className="auth-divider">
              <span>or register with email</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create your password"
                />
              </div>

              <button type="submit" className="auth-main-btn">Register</button>
            </form>

            {message && (
              <p className={message.toLowerCase().includes("successful") ? "success-message" : "error-message"}>
                {message}
              </p>
            )}

            <p className="auth-switch-text">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;