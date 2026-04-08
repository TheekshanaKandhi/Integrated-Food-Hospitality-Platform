import { useEffect, useState } from "react";
import axios from "axios";

function Protected() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:5000/api/auth/protected", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setMessage(res.data.message);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message || "Access denied");
      }
    };

    fetchProtected();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      <p>This page is accessible only after login.</p>
      <p className="page-sub-note">Use this page to verify that authentication is working correctly.</p>

      {message && (
        <p className={message.toLowerCase().includes("accessed") || message.toLowerCase().includes("welcome") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <div className="info-card">
        <h3>Why this page matters</h3>
        <p>It confirms that your JWT token is stored correctly and protected backend routes are working.</p>
      </div>
    </div>
  );
}

export default Protected;