import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  const handleLogout = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("user");
    setUsername(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-center vh-100">
      <div className="card text-center">
        <div className="card-body">
          <h2 className="card-title">Are you sure you want to log out?</h2>
          <p className="card-text">You will be redirected to the homepage.</p>
          <button onClick={handleLogout} className="btn btn-danger">
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default Logout;
