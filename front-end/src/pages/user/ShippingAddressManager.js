import React, { useState, useEffect } from "react";
import axios from "axios";
import { getFullUrl } from "../../App";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ShippingAddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { code: "VN", name: "Vietnam" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "SG", name: "Singapore" },
    { code: "MY", name: "Malaysia" },
    { code: "TH", name: "Thailand" },
  ];

  // Postal code patterns theo quốc gia
  const postalCodePatterns = {
    VN: "^\\d{6}$",
    US: "^\\d{5}(-\\d{4})?$",
    GB: "^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$",
    JP: "^\\d{3}-\\d{4}$",
    KR: "^\\d{5}$",
    SG: "^\\d{6}$",
    MY: "^\\d{5}$",
    TH: "^\\d{5}$",
  };

  // Helper text cho postal code theo quốc gia
  const postalCodeHelpers = {
    VN: "Format: 6 digits (e.g., 700000)",
    US: "Format: 5 digits or 5+4 digits (e.g., 12345 or 12345-6789)",
    GB: "Format: AA9A 9AA, A9A 9AA, A9 9AA, A99 9AA, AA9 9AA, AA99 9AA",
    JP: "Format: 3 digits - 4 digits (e.g., 123-4567)",
    KR: "Format: 5 digits (e.g., 12345)",
    SG: "Format: 6 digits (e.g., 123456)",
    MY: "Format: 5 digits (e.g., 12345)",
    TH: "Format: 5 digits (e.g., 12345)",
  };

  const handleAddressSelect = (suggestion) => {
    setSelectedAddress(suggestion);
    setFormData((prev) => ({
      ...prev,
      address: suggestion.display_name,
      city: suggestion.address?.city || suggestion.address?.town || "",
      state: suggestion.address?.state || "",
      country: suggestion.address?.country || "",
    }));
    setAddressSuggestions([]);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Validate phone number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // Validate country
    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    // Validate postal code based on selected country
    if (formData.country && postalCodePatterns[formData.country]) {
      const pattern = new RegExp(postalCodePatterns[formData.country]);
      if (!pattern.test(formData.postalCode)) {
        newErrors.postalCode = `Invalid postal code format for ${
          countries.find((c) => c.code === formData.country)?.name
        }`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get user data from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch addresses on component mount
  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    }
  }, [user?.id]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        getFullUrl(`/api/shipping-addresses/user/${user.id}`)
      );
      setAddresses(response.data);
    } catch (err) {
      setError("Failed to fetch addresses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedAddress) {
        await axios.put(
          getFullUrl(
            `/api/shipping-addresses/user/${user.id}/address/${selectedAddress.id}`
          ),
          formData
        );
      } else {
        await axios.post(
          getFullUrl(`/api/shipping-addresses/${user.id}`),
          formData
        );
      }
      await fetchAddresses();
      setIsEditing(false);
      setSelectedAddress(null);
      resetForm();
    } catch (err) {
      setError("Failed to save address");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setFormData({
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
    });
    setIsEditing(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        setLoading(true);
        await axios.delete(
          getFullUrl(
            `/api/shipping-addresses/user/${user.id}/address/${addressId}`
          )
        );
        await fetchAddresses();
      } catch (err) {
        setError("Failed to delete address");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: '100vh'}}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Addresses</h2>

        {!isEditing && (
          <div className="mb-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsEditing(true);
                setSelectedAddress(null);
                resetForm();
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>Add New Address
            </button>
          </div>
        )}
      </div>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {isEditing ? (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-4">
              {selectedAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Address Search */}
              <div className="mb-3">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.address ? "is-invalid" : ""
                  }`}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Type your address"
                />
                {isLoading && (
                  <div className="text-muted mt-1">Searching...</div>
                )}
                {addressSuggestions.length > 0 && (
                  <div className="address-suggestions">
                    {addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>

              {/* City */}
              <div className="mb-3">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city}</div>
                )}
              </div>

              {/* State/Province */}
              <div className="mb-3">
                <label className="form-label">State/Province</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state or province"
                />
              </div>

              {/* Country */}
              <div className="mb-3">
                <label className="form-label">Country *</label>
                <select
                  className={`form-select ${
                    errors.country ? "is-invalid" : ""
                  }`}
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <div className="invalid-feedback">{errors.country}</div>
                )}
              </div>

              {/* Postal Code */}
              <div className="mb-3">
                <label className="form-label">Postal Code *</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.postalCode ? "is-invalid" : ""
                  }`}
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
                {formData.country && (
                  <small className="form-text text-muted">
                    {postalCodeHelpers[formData.country]}
                  </small>
                )}
                {errors.postalCode && (
                  <div className="invalid-feedback">{errors.postalCode}</div>
                )}
              </div>
              {/* Phone Number */}
              <div className="mb-3">
                <label className="form-label">Phone *</label>
                <PhoneInput
                  country={"vn"} // Mặc định chọn Vietnam
                  value={formData.phone}
                  onChange={(phone) =>
                    setFormData((prev) => ({ ...prev, phone }))
                  }
                  inputClass={`form-control ${
                    errors.phone ? "is-invalid" : ""
                  }`}
                  containerClass="phone-input"
                  placeholder="Enter phone number"
                  inputProps={{
                    required: true,
                    name: "phone",
                  }}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-save me-2"></i>
                  )}
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  <i className="bi bi-x-circle me-2"></i>Clear
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedAddress(null);
                    resetForm();
                  }}
                >
                  <i className="bi bi-arrow-left me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {addresses.map((address) => (
            <div key={address.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    Shipping Address {address.address}
                  </h5>
                  <p className="card-text">
                    {address.address}
                    <br />
                    {address.city}, {address.state}
                    <br />
                    {address.country} {address.postalCode}
                    <br />
                    <strong>Phone:</strong> {address.phone}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(address)}
                    >
                      <i className="bi bi-pencil me-2"></i>Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(address.id)}
                    >
                      <i className="bi bi-trash me-2"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

const styles = `
.address-suggestions {
  position: absolute;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  width: calc(100% - 2rem);
  margin-top: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.phone-input {
  width: 100% !important;
}

.invalid-feedback {
  display: block;
}

.form-text {
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-body {
  padding: 1.5rem;
}

.btn-group {
  gap: 0.5rem;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ShippingAddressManager;
