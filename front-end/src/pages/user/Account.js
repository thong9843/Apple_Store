import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  // Password validation function
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 8 && password.length <= 16;

    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    if (!isLengthValid) return "Password must be between 8 and 16 characters";
    return "";
  };

  const fetchUserInfo = async () => {
    if (!userInfo?.id) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/admin/${userInfo.id}`);
      if (!response.ok) throw new Error(`${response.message}`);
      const data = await response.json();
      setUserInfo(data);
      sessionStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [userInfo?.id]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const updatedUserInfo = await response.json();
      setUserInfo(updatedUserInfo);
      sessionStorage.setItem("user", JSON.stringify(updatedUserInfo));
      alert("Information has been successfully updated!");
    } catch (error) {
      console.error("Error updating user info:", error);
      setError(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate new password
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/change-password?userId=${userInfo.id}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      alert("Password has been changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setPasswordError("");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUsername(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="container mt-4 justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h1>Account Information</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {passwordError && <div className="alert alert-warning">{passwordError}</div>}

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
            style={{ cursor: "pointer" }}
          >
            Personal Information
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
            style={{ cursor: "pointer" }}
          >
            Change Password
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "logout" ? "active" : ""}`}
            onClick={() => setActiveTab("logout")}
            style={{ cursor: "pointer" }}
          >
            Sign Out
          </a>
        </li>
      </ul>

      {activeTab === "info" && (
        <div className="mt-3">
          <h2>Personal Information</h2>
          <div className="d-flex align-items-center mb-3">
            <span className="me-2">Verification Status:</span>
            {userInfo?.verify ? (
              <span className="text-success">
                <i className="bi bi-check-circle-fill"></i> Verified
              </span>
            ) : (
              <>
                <span className="text-warning">
                  <i className="bi bi-exclamation-circle-fill"></i> Not Verified
                </span>
                <button
                  className="btn btn-link ms-2"
                  onClick={() => navigate("/verify-account")}
                >
                  Verify Now
                </button>
              </>
            )}
          </div>
          <form onSubmit={handleUpdateInfo}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={userInfo?.name || ""}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={userInfo?.email || ""}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={userInfo?.phone || ""}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={userInfo?.address || ""}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className="mt-3">
          <h2>Change Password</h2>
          <p className="text-muted">
            Password requirements:
            <ul>
              <li>8-16 characters long</li>
              <li>At least one uppercase letter</li>
              <li>At least one special character</li>
            </ul>
          </p>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </form>
        </div>
      )}

      {activeTab === "logout" && (
        <div className="mt-3">
          <h2>Sign Out</h2>
          <div className="container mt-5">
            <div className="card text-center">
              <div className="card-body">
                <h2 className="card-title">
                  Are you sure you want to sign out?
                </h2>
                <p className="card-text">
                  You will be redirected to the home page.
                </p>
                <button onClick={handleLogout} className="btn btn-danger">
                  <i className="bi bi-box-arrow-right"></i> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <br />
    </div>
  );
};

export default AccountPage;