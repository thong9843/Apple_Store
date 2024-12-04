import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('Password must be 8-16 characters long, contain at least one uppercase letter and one special character');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword(formData.password)) {
      setPasswordError('Please enter a valid password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const userData = await response.json();

      if (response.ok) {
        // Store user data in session storage with the required format
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
        navigate('/verify-account');
      } else {
        setError(userData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="border rounded shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${passwordError ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {passwordError && (
              <div className="invalid-feedback">
                {passwordError}
              </div>
            )}
            <small className="form-text text-muted">
              Password must be 8-16 characters long, contain at least one uppercase letter and one special character
            </small>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <button 
              type="submit" 
              className="btn btn-primary flex-fill me-md-2"
              disabled={loading || !!passwordError}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
            <button 
              type="button"
              className="btn btn-secondary flex-fill"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;