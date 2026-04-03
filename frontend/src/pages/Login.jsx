import { useState } from "react";
import axios from "axios";

function Login() {
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
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", formData);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", formData.email);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p>Access your account to continue ordering food.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Login</button>
        </form>

        {message && (
          <p className={message.toLowerCase().includes("successful") ? "success-message" : "error-message"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;