import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9a-zA-Z]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Password validation
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8-16 characters long, contain at least one uppercase letter and one special character"
      );
      return;
    }

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
      navigate("/");

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
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter your password"
              required
            />
            {passwordError && (
              <div className="text-danger small mt-1">{passwordError}</div>
            )}
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
            <button
              type="submit"
              className="btn btn-primary me-md-2 mb-2 mb-md-0"
              style={{ width: "100%" }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%" }}
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
          <div className="text-center mt-3">
            <a href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </a>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default Login;