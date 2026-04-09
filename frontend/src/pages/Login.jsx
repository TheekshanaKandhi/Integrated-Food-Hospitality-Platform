import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        ...formData,
        loginType: "user"
      });

      saveUserSession(res.data.user, res.data.token);
      setMessage(res.data.message || "Login successful");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const res = await axios.post("http://127.0.0.1:5000/api/auth/google", {
        name: googleUser.displayName || "Google User",
        email: googleUser.email
      });

      saveUserSession(res.data.user, res.data.token);
      setMessage(res.data.message || "Google login successful");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Google login error code:", error.code);
      console.error("Google login error message:", error.message);
      setMessage(error.response?.data?.message || error.message || "Google login failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-split-card">
        <div className="auth-side auth-side-user">
          <div className="auth-side-badge">Customer Access</div>
          <h2>Welcome Back</h2>
          <p>
            Sign in to explore restaurants, add dishes to cart, place orders,
            track deliveries, and download your invoices.
          </p>

          <div className="auth-feature-list">
            <span>Explore restaurants</span>
            <span>Quick checkout</span>
            <span>Invoice downloads</span>
            <span>Reviews and ratings</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card polished-auth-card">
            <h2>User Login</h2>
            <p>Access your food ordering account.</p>

            <button
              type="button"
              className="google-btn polished-google-btn"
              onClick={handleGoogleLogin}
            >
              <span className="google-mark">G</span>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="auth-main-btn">
                Login
              </button>
            </form>

            {message && (
              <p className={message.toLowerCase().includes("successful") ? "success-message" : "error-message"}>
                {message}
              </p>
            )}

            <p className="auth-switch-text">
              Don&apos;t have an account? <a href="/register">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;