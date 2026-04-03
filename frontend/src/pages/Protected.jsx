import { useState } from "react";
import axios from "axios";

function Protected() {
  const [message, setMessage] = useState("");

  const accessProtected = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://127.0.0.1:5000/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Access failed");
    }
  };

  return (
    <div>
      <h2>Protected Page</h2>
      <button onClick={accessProtected}>Access Protected Route</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Protected;