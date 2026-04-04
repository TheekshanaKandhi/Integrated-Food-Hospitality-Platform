import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
      const res = await axios.post("http://127.0.0.1:5000/api/auth/register", formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Sign up to explore restaurants, menus, and orders.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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

          <button type="submit">Register</button>
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
  );
}

export default Register;