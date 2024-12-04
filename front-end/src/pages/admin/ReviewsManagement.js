import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, Edit, Star, Trash } from 'lucide-react';

const ReviewsManagement = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    productId: "",
    rating: "",
  });
  const [editReview, setEditReview] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      navigate("/");
    } else {
      fetchReviews();
    }
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData)
        }
      );
      if (!response.ok) throw new Error('Failed to update review');
      fetchReviews();
      setEditReview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error('Failed to delete review');
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredReviews = reviews.filter(review => {
    return (
      (!filters.userId || review.userId.toString() === filters.userId) &&
      (!filters.productId || review.productId.toString() === filters.productId) &&
      (!filters.rating || review.rating.toString() === filters.rating)
    );
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-warning fill-warning" : "text-muted"}
      />
    ));
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
            <i className="bi bi-star me-2"></i>
            Reviews Management
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
                    <i className="bi bi-list-stars me-2"></i>
                    Reviews List
                  </h5>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={fetchReviews}
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
                        name="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(rating => (
                          <option key={rating} value={rating}>{rating} Stars</option>
                        ))}
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
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search size={16} />
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Filter by Product ID"
                        name="productId"
                        value={filters.productId}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Review ID</th>
                        <th>User ID</th>
                        <th>Product ID</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReviews.map((review) => (
                        <tr key={review.id}>
                          <td className="align-middle">{review.id}</td>
                          <td className="align-middle">{review.userId}</td>
                          <td className="align-middle">{review.productId}</td>
                          <td className="align-middle">
                            <div className="d-flex gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </td>
                          <td className="align-middle">
                            {editReview?.id === review.id ? (
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editReview.review}
                                  onChange={(e) => setEditReview({
                                    ...editReview,
                                    review: e.target.value
                                  })}
                                />
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => updateReview(review.id, editReview)}
                                >
                                  Save
                                </button>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setEditReview(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              review.review
                            )}
                          </td>
                          <td className="align-middle">
                            {new Date(review.createdAt).toLocaleString()}
                          </td>
                          <td className="align-middle">
                            <div className="btn-group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setEditReview(review)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteReview(review.id)}
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredReviews.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            <i className="bi bi-inbox me-2"></i>
                            No reviews found matching the filters
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
    </div>
  );
};

export default ReviewsManagement;