import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    // Nếu người dùng đã đăng nhập và là admin, chuyển hướng đến dashboard admin
    if (user && user.role === "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        null,
        {
          params: {
            email: email,
            password: password,
          },
        }
      );

      const userData = response.data;

      // Kiểm tra role của user, nếu là admin thì lưu thông tin vào session và chuyển hướng
      if (userData.role === "admin") {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            role: userData.role,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            verify: userData.verify,
          })
        );
        window.location.reload();
        navigate("/dashboard");
      } else {
        setError("Access denied. Admins only.");
      }

    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="border rounded shadow p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>
          <div className="text-center mt-3">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot password?
            </a>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;
