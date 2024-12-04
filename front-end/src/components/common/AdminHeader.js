import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showMobileAccount, setShowMobileAccount] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUsername(userData.name);
    }
  }, []);

  return (
    <header className="bg-dark text-white">
      {/* PC Header */}
      <nav className="navbar navbar-expand-lg navbar-custom d-none d-lg-block">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src="http://localhost:8080/contents/image/others/logo.png"
              alt="Admin Logo"
              style={{ height: "auto", width: "70px" }}
            />
          </a>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/product-management">
                  Product Management
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/user-management">
                  User Management
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/order-management">
                  Order Management
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/reviews-management">
                  Reviews Management
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/discount-management">
                  Discount Management
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              <div className="dropdown me-3">
                <a
                  href="#"
                  className="icon dropdown-toggle nav-link text-white"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="ms-2">{username ? username : "Admin"}</span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/logout">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="d-flex d-lg-none justify-content-center align-items-center py-2 px-3 border-bottom">
        <div className="logo">
          <a href="/">
            <img
              src="http://localhost:8080/contents/image/others/logo.png"
              alt="Admin Logo"
              style={{ height: "auto", width: "120px" }}
            />
          </a>
        </div>
      </div>

      {/* Footer Menu Mobile */}
      <div className="footer-menu d-lg-none d-flex justify-content-around align-items-center border-top bg-light fixed-bottom py-2 px-3">
        <a href="/dashboard" className="text-decoration-none text-dark text-center">
          <i className="bi bi-house-door" style={{ fontSize: "1.5rem" }}></i>
          <div>Dashboard</div>
        </a>
        <a href="/product-management" className="text-decoration-none text-dark text-center">
          <i className="bi bi-box" style={{ fontSize: "1.5rem" }}></i>
          <div>Product management</div>
        </a>
        <a href="/user-management" className="text-decoration-none text-dark text-center">
          <i className="bi bi-person" style={{ fontSize: "1.5rem" }}></i>
          <div>User management</div>
        </a>
        <a href="/order-management" className="text-decoration-none text-dark text-center">
          <i className="bi bi-file-earmark-text" style={{ fontSize: "1.5rem" }}></i>
          <div>Order management
          </div>
        </a>
        <a href="/reviews-management" className="text-decoration-none text-dark text-center">
          <i className="bi bi-star" style={{ fontSize: "1.5rem" }}></i>
          <div>Review management</div>
        </a>
        <a href="/discount-management" className="text-decoration-none text-dark text-center">
          <i className="bi bi-star" style={{ fontSize: "1.5rem" }}></i>
          <div>Discount Management</div>
        </a>
        <a href="/logout" className="text-decoration-none text-dark text-center">
          <i className="bi bi-box-arrow-right" style={{ fontSize: "1.5rem" }}></i>
          <div>Logout</div>
        </a>
      </div>

      {/* Mobile Account Offcanvas */}
      {showMobileAccount && (
        <div
          className="offcanvas offcanvas-bottom show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Tài khoản</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowMobileAccount(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="list-group">
              <a href="/logout" className="list-group-item list-group-item-action">
                Logout
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;