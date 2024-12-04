import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileAccount, setShowMobileAccount] = useState(false);
  const [username, setUsername] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUsername(userData.name);
    }
  }, []);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const searchProducts = async (query) => {
    if (query.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/search?query=${query}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const debouncedSearch = debounce(searchProducts, 300);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <header className="bg-dark text-white">
      {/* PC Header */}
      <nav className="navbar navbar-expand-lg navbar-custom d-none d-lg-block">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand d-none d-lg-block" href="/">
            <img
              src="http://localhost:8080/contents/image/others/logo.png"
              alt="Apple Shop"
              style={{ height: "auto", width: "70px" }}
            />
          </a>
          {/* Product Categories - Horizontal */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/list/1">
                  iPhone
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/list/2">
                  iPad
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/list/3">
                  Mac
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/list/4">
                  Watch
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white px-3" href="/list/5">
                  Others
                </a>
              </li>
            </ul>

            {/* Search, Cart, Account on the right */}
            <div className="d-flex align-items-center">
              <a
                href="#"
                className="icon nav-link text-white me-3"
                onClick={() => setShowSearch(true)}
              >
                <i className="bi bi-search"></i>
              </a>
              <a href="/cart" className="icon nav-link text-white me-3">
                <i className="bi bi-cart"></i>
              </a>
              <div className="dropdown me-3">
                <a
                  href="#"
                  className="icon dropdown-toggle nav-link text-white me-3"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="ms-2">{username ? username : "Account"}</span>
                </a>
                <ul className="dropdown-menu">
                  {!username ? (
                    <>
                      <li>
                        <a className="dropdown-item" href="/login">
                          Login
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/register">
                          Sign up
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <a className="dropdown-item" href="/account">
                          Account Management
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/shipping-address">
                          Ship Address Management
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/order-history">
                          Order Management
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/logout">
                          Logout
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Offcanvas with Results */}
      {showSearch && (
        <div
          className="offcanvas offcanvas-top show"
          style={{
            display: "block",
            transition: "transform 0.3s ease-in-out",
            transform: "translateY(0)",
            height: "100vh",
            backgroundColor: "#f8f9fa"
          }}
          tabIndex="-1"
        >
          <div 
            className="offcanvas-header border-bottom bg-white" 
            style={{ 
              position: "sticky", 
              top: 0, 
              zIndex: 1050 
            }}
          >
            <div className="d-flex align-items-center w-100">
              <button
                type="button"
                className="btn-close me-2"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              ></button>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  autoFocus
                />
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div 
            className="offcanvas-body p-0" 
            style={{ 
              overflowY: "auto",
              height: "calc(100vh - 66px)" // 66px là chiều cao của header
            }}
          >
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="search-result-item p-3 border-bottom bg-white"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setShowSearch(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{product.name}</h6>
                        <p className="mb-0 text-muted">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <i className="bi bi-chevron-right text-muted"></i>
                    </div>
                  </div>
                ))
              ) : searchQuery.length > 0 ? (
                <div className="p-4 text-center text-muted bg-white">
                  <i className="bi bi-search mb-2" style={{ fontSize: "2rem" }}></i>
                  <p className="mb-0">Product not found</p>
                </div>
              ) : (
                <div className="p-4 text-center text-muted bg-white">
                  <i className="bi bi-search mb-2" style={{ fontSize: "2rem" }}></i>
                  <p className="mb-0">Search...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="d-flex d-lg-none justify-content-center align-items-center py-2 px-3 border-bottom">
        <div className="logo">
          <a href="/">
            <img
              src="http://localhost:8080/contents/image/others/logo.png"
              alt="Apple Shop"
              style={{ height: "auto", width: "120px" }}
            />
          </a>
        </div>
      </div>

      {/* Footer Menu Mobile */}
      <div className="footer-menu d-lg-none d-flex justify-content-around align-items-center border-top bg-light fixed-bottom py-2 px-3">
        <a href="/" className="text-decoration-none text-dark text-center">
          <i className="bi bi-house-door" style={{ fontSize: "1.5rem" }}></i>
          <div>Home</div>
        </a>
        <a
          href="#"
          className="text-decoration-none text-dark text-center"
          onClick={() => setShowMenu(true)}
        >
          <i className="bi bi-grid" style={{ fontSize: "1.5rem" }}></i>
          <div>Categories</div>
        </a>
        <a
          href="#"
          className="text-decoration-none text-dark text-center"
          onClick={() => setShowSearch(true)}
        >
          <i className="bi bi-search" style={{ fontSize: "1.5rem" }}></i>
          <div>Search</div>
        </a>
        <a href="/cart" className="text-decoration-none text-dark text-center">
          <i className="bi bi-cart3" style={{ fontSize: "1.5rem" }}></i>
          <div>Cart</div>
        </a>
        <a
          href="#"
          className="text-decoration-none text-dark text-center"
          onClick={() => setShowMobileAccount(true)}
        >
          <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i>
          <div>{username ? username : "Account"}</div>
        </a>
      </div>

      {/* Mobile Account Offcanvas */}
      {showMobileAccount && (
        <div
          className="offcanvas offcanvas-bottom show"
          style={{
            display: "block",
            transition: "transform 0.3s ease-in-out",
            transform: "translateY(0)",
            height: "auto",
          }}
          tabIndex="-1"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Account</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowMobileAccount(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            {!username ? (
              <div className="list-group">
                <a href="/login" className="list-group-item list-group-item-action">
                  Login
                </a>
                <a href="/register" className="list-group-item list-group-item-action">
                  Sign up
                </a>
              </div>
            ) : (
              <div className="list-group">
                <a href="/account" className="list-group-item list-group-item-action">
                  Account Management
                </a>
                <a href="/shipping-address" className="list-group-item list-group-item-action">
                  Ship Management
                </a>
                <a href="/order-history" className="list-group-item list-group-item-action">
                  Order Management
                </a>
                <a href="/logout" className="list-group-item list-group-item-action">
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Menu Offcanvas */}
      {showMenu && (
        <div
          className="offcanvas offcanvas-start show"
          style={{
            display: "block",
            transition: "transform 0.3s ease-in-out",
            transform: "translateX(0)",
          }}
          tabIndex="-1"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Categories</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowMenu(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="list-group">
              <a href="/list/1" className="list-group-item list-group-item-action">
                iPhone
              </a>
              <a href="/list/2" className="list-group-item list-group-item-action">
                iPad
              </a>
              <a href="/list/3" className="list-group-item list-group-item-action">
                Mac
              </a>
              <a href="/list/4" className="list-group-item list-group-item-action">
                Watch
              </a>
              <a href="/list/5" className="list-group-item list-group-item-action">
                Others
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;