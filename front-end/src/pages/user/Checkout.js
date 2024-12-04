import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Checkout = () => {
  // Existing state variables
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productVariantId = searchParams.get("productVariantId");
  const userId = searchParams.get("userId");

  const [productVariant, setProductVariant] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productDiscount, setProductDiscount] = useState("");
  const [orderDiscount, setOrderDiscount] = useState("");
  const [productDiscountInfo, setProductDiscountInfo] = useState(null);
  const [orderDiscountInfo, setOrderDiscountInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state variables for address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Countries data
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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [variantRes, imagesRes, addressesRes] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/product-variants/${productVariantId}`
          ),
          axios.get(
            `http://localhost:8080/api/product-images/variant/${productVariantId}`
          ),
          axios.get(
            `http://localhost:8080/api/shipping-addresses/user/${userId}`
          ),
        ]);

        setProductVariant(variantRes.data);
        setProductImages(imagesRes.data);
        setShippingAddresses(addressesRes.data);
        if (addressesRes.data.length > 0) {
          setSelectedAddress(addressesRes.data[0].id.toString());
        }
        setLoading(false);
      } catch (err) {
        setError("Error loading checkout information");
        setLoading(false);
      }
    };

    fetchData();
  }, [productVariantId, userId]);
  // Check product discount
  const checkProductDiscount = async () => {
    if (!productDiscount.trim()) {
      alert("Please enter product discount code");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/discounts/check/${productDiscount}/product/${productVariant.product.id}`
      );
      setProductDiscountInfo(response.data.discount);
      alert("Successfully applied product discount code!");
    } catch (err) {
      alert("Invalid product discount code");
      setProductDiscountInfo(null);
      setProductDiscount("");
    }
  };

  // Check order discount
  const checkOrderDiscount = async () => {
    if (!orderDiscount.trim()) {
      alert("Please enter order discount code");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/discounts/check/${orderDiscount}`
      );
      if (response.data.discount.discountScope === "ORDER") {
        setOrderDiscountInfo(response.data.discount);
        alert("Order discount code applied successfully!");
      } else {
        alert("This coupon code does not apply to orders.");
        setOrderDiscountInfo(null);
        setOrderDiscount("");
      }
    } catch (err) {
      alert("Invalid order discount code");
      setOrderDiscountInfo(null);
      setOrderDiscount("");
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!productVariant) return 0;
    let total = productVariant.price * quantity;

    if (productDiscountInfo) {
      if (productDiscountInfo.discountType === "FIXED") {
        total -= productDiscountInfo.discountValue;
      } else {
        total -= (total * productDiscountInfo.discountValue) / 100;
      }
    }

    if (orderDiscountInfo) {
      if (total >= (orderDiscountInfo.minOrderValue || 0)) {
        if (orderDiscountInfo.discountType === "FIXED") {
          total -= orderDiscountInfo.discountValue;
        } else {
          total -= (total * orderDiscountInfo.discountValue) / 100;
        }
      }
    }

    return Math.max(total, 0);
  };

  const handleSubmit = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/orders/from-product`, null, {
        params: {
          userId: userId,
          productVariantId: productVariantId,
          quantity: quantity,
          shippingAddressId: selectedAddress,
          paymentMethod: paymentMethod,
          productDiscountCode: productDiscountInfo ? productDiscount.toUpperCase() : null,
          orderDiscountCode: orderDiscountInfo ? orderDiscount.toUpperCase() : null
        }
      });

      console.log('API Response:', response.data);

      if (paymentMethod === 'CASH') {
        navigate('/order-success');
      } else if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        requestParams: {
          userId,
          productVariantId,
          quantity,
          shippingAddressId: selectedAddress,
          paymentMethod,
          productDiscountCode: productDiscountInfo ? productDiscount.toUpperCase() : null,
          orderDiscountCode: orderDiscountInfo ? orderDiscount.toUpperCase() : null
        }
      });

      alert('An error occurred while creating the order: ' + 
        (err.response?.data?.message || err.message));
    }
  };

  const handleAddressInputChange = (e) => {
    setAddressFormData({
      ...addressFormData,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddressForm = () => {
    const errors = {};
    if (!addressFormData.address) errors.address = "Address is required";
    if (!addressFormData.city) errors.city = "City is required";
    if (!addressFormData.country) errors.country = "Country is required";
    if (!addressFormData.postalCode) errors.postalCode = "Postal code is required";
    if (!addressFormData.phone) errors.phone = "Phone number is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAddressForm()) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/shipping-addresses/${userId}`,
        addressFormData
      );

      // Refresh shipping addresses
      const response = await axios.get(
        `http://localhost:8080/api/shipping-addresses/user/${userId}`
      );
      setShippingAddresses(response.data);

      // Reset form and close modal
      setAddressFormData({
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phone: "",
      });
      setShowAddressModal(false);
      setFormErrors({});
    } catch (err) {
      setError("Failed to add shipping address");
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="container mt-5">{error}</div>;
  if (!productVariant)
    return <div className="container mt-5">Product not found</div>;

  return (
    <div className="container mt-5" style={{ minHeight: '100vh' }}>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Product Information</h3>
            </div>
            <div className="card-body">
              {productImages.length > 0 && (
                <img
                  src={`http://localhost:8080${productImages[0].imageUrl}`}
                  alt={productVariant.product.name}
                  className="img-fluid mb-3"
                />
              )}
              <h4>
                {productVariant.product.name} - {productVariant.variantName}
              </h4>
              <p className="h5">Price: ${productVariant.price.toFixed(2)}</p>

              <div className="form-group mt-3">
                <label>Quantity:</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  min="1"
                  max={productVariant.stockQuantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="form-group mt-3">
                <label>Product Discount Code:</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={productDiscount}
                    onChange={(e) => setProductDiscount(e.target.value)}
                    placeholder="Enter product discount code"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={checkProductDiscount}
                  >
                    Apply
                  </button>
                </div>
                {productDiscountInfo && (
                  <div className="alert alert-success mt-2">
                    Discount applied: {productDiscountInfo.discountValue}
                    {productDiscountInfo.discountType === "FIXED" ? "$" : "%"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Shipping Information</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Select Shipping Address:</label>
                <div className="d-flex gap-2">
                  <select
                    className="form-control"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    <option value="">Select an address</option>
                    {shippingAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.address}, {address.city}, {address.state},{" "}
                        {address.country}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowAddressModal(true)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="card mb-4">
            <div className="card-header">
              <h3>Order Details</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Order Discount Code:</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={orderDiscount}
                    onChange={(e) => setOrderDiscount(e.target.value)}
                    placeholder="Enter order discount code"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={checkOrderDiscount}
                  >
                    Apply
                  </button>
                </div>
                {orderDiscountInfo && (
                  <div className="alert alert-success mt-2">
                    Order discount applied: {orderDiscountInfo.discountValue}
                    {orderDiscountInfo.discountType === "FIXED" ? "$" : "%"}
                  </div>
                )}
              </div>

              <div className="form-group mt-3">
                <label>Payment Method:</label>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="VNPAY">VNPAY</option>
                </select>
              </div>

              <div className="mt-4">
                <h4>Total: ${calculateTotal().toFixed(2)}</h4>
                <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Shipping Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddressSubmit}>
            <div className="mb-3">
              <label className="form-label">Address *</label>
              <input
                type="text"
                className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                name="address"
                value={addressFormData.address}
                onChange={handleAddressInputChange}
              />
              {formErrors.address && (
                <div className="invalid-feedback">{formErrors.address}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">City *</label>
              <input
                type="text"
                className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                name="city"
                value={addressFormData.city}
                onChange={handleAddressInputChange}
              />
              {formErrors.city && (
                <div className="invalid-feedback">{formErrors.city}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">State/Province</label>
              <input
                type="text"
                className="form-control"
                name="state"
                value={addressFormData.state}
                onChange={handleAddressInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Country *</label>
              <select
                className={`form-select ${formErrors.country ? 'is-invalid' : ''}`}
                name="country"
                value={addressFormData.country}
                onChange={handleAddressInputChange}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {formErrors.country && (
                <div className="invalid-feedback">{formErrors.country}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Postal Code *</label>
              <input
                type="text"
                className={`form-control ${formErrors.postalCode ? 'is-invalid' : ''}`}
                name="postalCode"
                value={addressFormData.postalCode}
                onChange={handleAddressInputChange}
              />
              {formErrors.postalCode && (
                <div className="invalid-feedback">{formErrors.postalCode}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone *</label>
              <PhoneInput
                country="vn"
                value={addressFormData.phone}
                onChange={(phone) => setAddressFormData(prev => ({ ...prev, phone }))}
                inputClass={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                containerClass="phone-input"
              />
              {formErrors.phone && (
                <div className="invalid-feedback">{formErrors.phone}</div>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Address
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Checkout;