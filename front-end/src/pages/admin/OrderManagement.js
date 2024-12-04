import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import {
  Search,
  Filter,
  RefreshCw,
  Check,
  X,
  Truck,
  DollarSign,
  Info,
} from "lucide-react";

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [filters, setFilters] = useState({
    userId: "",
    status: "",
    paymentStatus: "",
  });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}`
      );
      if (!response.ok) throw new Error("Failed to fetch order details");
      const data = await response.json();
      setOrderDetail(data);
      setSelectedOrder(orderId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status?status=${status}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update order status");
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePaymentStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/payment-status?status=${status}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update payment status");
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/cancel`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to cancel order");
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowClick = (orderId) => {
    fetchOrderDetail(orderId);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (!filters.userId || order.user.id.toString() === filters.userId) &&
      (!filters.status || order.orderStatus === filters.status) &&
      (!filters.paymentStatus || order.paymentConfirm === filters.paymentStatus)
    );
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning";
      case "SHIPPED":
        return "bg-info";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getPaymentBadgeColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-success";
      case "UNPAID":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Modal Component
  const OrderDetailModal = () => {
    if (!orderDetail) return null;

    return (
      <Modal show={!!selectedOrder} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Info size={18} className="me-2" />
            Order Details #{orderDetail.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-4">
            {/* Customer Information */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title mb-3">Customer Information</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <strong>Name:</strong> {orderDetail.user.name}
                    </li>
                    <li className="mb-2">
                      <strong>Email:</strong> {orderDetail.user.email}
                    </li>
                    <li className="mb-2">
                      <strong>Phone:</strong> {orderDetail.user.phone}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title mb-3">Shipping Address</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      {orderDetail.shippingAddress.address}
                    </li>
                    <li className="mb-2">
                      {orderDetail.shippingAddress.city},{" "}
                      {orderDetail.shippingAddress.state}{" "}
                      {orderDetail.shippingAddress.postalCode}
                    </li>
                    <li className="mb-2">
                      {orderDetail.shippingAddress.country}
                    </li>
                    <li className="mb-2">
                      <strong>Phone:</strong>{" "}
                      {orderDetail.shippingAddress.phone}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title mb-3">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Variant</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail.orderItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="fw-bold">
                                {item.productVariant.product.name}
                              </div>
                              <small className="text-muted">
                                Category:{" "}
                                {item.productVariant.product.category.name}
                              </small>
                            </td>
                            <td>{item.productVariant.variantName}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <td colSpan="4" className="text-end fw-bold">
                            Subtotal:
                          </td>
                          <td>${orderDetail.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="text-end fw-bold">
                            Discount:
                          </td>
                          <td className="text-success">
                            -${orderDetail.discountTotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="text-end fw-bold">
                            Final Total:
                          </td>
                          <td className="fw-bold">
                            $
                            {(
                              orderDetail.total - orderDetail.discountTotal
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title mb-3">Order Summary</h6>
                  <div className="row g-3">
                    <div className="col-sm-6 col-md-3">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small">Total Amount</div>
                        <div className="fw-bold">${orderDetail.total}</div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small">Discount</div>
                        <div className="fw-bold text-success">
                          -${orderDetail.discountTotal}
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small">Order Status</div>
                        <div>
                          <span
                            className={`badge ${getStatusBadgeColor(
                              orderDetail.orderStatus
                            )}`}
                          >
                            {orderDetail.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div className="border rounded p-3 text-center">
                        <div className="text-muted small">
                          Payment Status
                        </div>
                        <div>
                          <span
                            className={`badge ${getPaymentBadgeColor(
                              orderDetail.paymentConfirm
                            )}`}
                          >
                            {orderDetail.paymentConfirm}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="text-muted small">Created At</div>
                        <div>
                          {new Date(orderDetail.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-cart-check me-2"></i>
            Order Management
          </span>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-list-check me-2"></i>
                    Orders List
                  </h5>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={fetchOrders}
                    disabled={loading}
                  >
                    <RefreshCw size={16} className="me-2" />
                    Refresh
                  </button>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Filter size={16} />
                      </span>
                      <select
                        className="form-select"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <DollarSign size={16} />
                      </span>
                      <select
                        className="form-select"
                        name="paymentStatus"
                        value={filters.paymentStatus}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Payment Statuses</option>
                        <option value="PAID">Paid</option>
                        <option value="UNPAID">Unpaid</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search size={16} />
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Filter by User ID"
                        name="userId"
                        value={filters.userId}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>User Info</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="cursor-pointer"
                          onClick={() => handleRowClick(order.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="align-middle">{order.id}</td>
                          <td className="align-middle">
                            <div className="fw-bold">ID: {order.user.id}</div>
                            <div>{order.user.name}</div>
                            <small className="text-muted">
                              {order.user.email}
                            </small>
                          </td>
                          <td className="align-middle">
                            <div className="fw-bold">${order.total}</div>
                            {order.discountTotal > 0 && (
                              <small className="text-success">
                                -${order.discountTotal} discount
                              </small>
                            )}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`badge ${getStatusBadgeColor(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="align-middle">
                            <span
                              className={`badge ${getPaymentBadgeColor(
                                order.paymentConfirm
                              )}`}
                            >
                              {order.paymentConfirm}
                            </span>
                          </td>
                          <td className="align-middle">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td className="align-middle">
                            {order.orderStatus !== "CANCELLED" && (
                              <div
                                className="btn-group"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "SHIPPED")
                                  }
                                  disabled={order.orderStatus === "SHIPPED"}
                                >
                                  <Truck size={16} />
                                </button>
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    updatePaymentStatus(order.id, "PAID")
                                  }
                                  disabled={order.paymentConfirm === "PAID"}
                                >
                                  <i className="bi bi-cash-coin"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => cancelOrder(order.id)}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-4 text-muted"
                          >
                            <i className="bi bi-inbox me-2"></i>
                            No orders found matching the filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modal */}
      {selectedOrder && <OrderDetailModal />}
    </div>
  );
};

export default OrderManagement;
