import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import axios from "axios";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    isVerify: false,
  });

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      navigate("/");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/users/admin/all"
      );
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role,
      isVerify: user.verify,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/users/admin/${selectedUser.id}`,
        editForm
      );
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/api/users/admin/change-password`,
        null,
        {
          params: {
            userId: selectedUser.id,
            newPassword: newPassword,
          }
        }
      );
      setShowPasswordModal(false);
      setNewPassword("");
    } catch (err) {
      setError("Failed to change password");
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger shadow-sm mx-4 mt-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-people-fill me-2"></i>
            User Management
          </span>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* User Statistics Cards */}
          <div className="col-md-4">
            <div className="card border-0 bg-primary bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Total Users
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">{users.length}</h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-people fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 bg-success bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Verified Users
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">
                      {users.filter((user) => user.verify).length}
                    </h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-patch-check fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 bg-info bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Admin Users
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">
                      {users.filter((user) => user.role === "admin").length}
                    </h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-shield-lock fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table Card */}
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  <i className="bi bi-table me-2"></i>
                  Users List
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-circle me-2 text-muted"></i>
                              {user.name}
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.phone || "N/A"}</td>
                          <td>
                            <span
                              className={`badge ${
                                user.role === "admin"
                                  ? "bg-danger"
                                  : "bg-primary"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.verify ? "bg-success" : "bg-warning"
                              }`}
                            >
                              {user.verify ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(user)}
                            >
                              <i className="bi bi-pencil-square me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordModal(true);
                              }}
                            >
                              <i className="bi bi-key me-1"></i>
                              Password
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(user.id)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Edit User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="text"
                className="form-control"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-geo-alt"></i>
              </span>
              <input
                type="text"
                className="form-control"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={editForm.isVerify}
                onChange={(e) =>
                  setEditForm({ ...editForm, isVerify: e.target.checked })
                }
              />
              <label className="form-check-label">Verified User</label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle me-2"></i>
              Save Changes
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>

    {/* Change Password Modal */}
    <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-key me-2"></i>
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle me-2"></i>
              Change Password
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  </div>
);
};

export default UserManagement;
