import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CheckoutFromCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, cartId } = location.state || {};

  const [cartItems, setCartItems] = useState([]);
  const [productDiscount, setProductDiscount] = useState("");
  const [orderDiscount, setOrderDiscount] = useState("");
  const [productDiscountInfo, setProductDiscountInfo] = useState(null);
  const [orderDiscountInfo, setOrderDiscountInfo] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountedProducts, setDiscountedProducts] = useState(new Map()); // Track discounted products

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

  // Fetch cart items and variant details
  useEffect(() => {
    const fetchCartAndAddresses = async () => {
      try {
        const [cartRes, addressesRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/cart/${userId}`),
          axios.get(
            `http://localhost:8080/api/shipping-addresses/user/${userId}`
          ),
        ]);

        const cartItemsData = cartRes.data.items;
        const detailedCartItems = await Promise.all(
          cartItemsData.map(async (item) => {
            const variantRes = await axios.get(
              `http://localhost:8080/api/product-variants/${item.productVariantId}`
            );
            const imageRes = await axios.get(
              `http://localhost:8080/api/product-images/variant/${item.productVariantId}`
            );

            return {
              ...item,
              variantName: variantRes.data.variantName,
              price: variantRes.data.price,
              imageUrl: imageRes.data[0]?.imageUrl || "",
            };
          })
        );

        setCartItems(detailedCartItems);
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

    fetchCartAndAddresses();
  }, [userId]);

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
        alert("Apply discount code successfully!");
      } else {
        alert("This coupon code is not a discount code for orders.");
        setOrderDiscountInfo(null);
        setOrderDiscount("");
      }
    } catch (err) {
      alert("Invalid order discount code");
      setOrderDiscountInfo(null);
      setOrderDiscount("");
    }
  };

  // Modify the checkProductDiscount function
  const checkProductDiscount = async () => {
    if (!productDiscount.trim()) {
      alert("Please enter product discount code");
      return;
    }

    try {
      let hasValidDiscount = false;
      const newDiscountedProducts = new Map();

      for (const item of cartItems) {
        try {
          const variantResponse = await axios.get(
            `http://localhost:8080/api/product-variants/${item.productVariantId}`
          );

          const productId = variantResponse.data.product.id;

          const discountResponse = await axios.get(
            `http://localhost:8080/api/discounts/check/${productDiscount}/product/${productId}`
          );

          if (discountResponse.data.discount.discountScope === "PRODUCT") {
            newDiscountedProducts.set(
              item.productVariantId,
              discountResponse.data.discount
            );
            hasValidDiscount = true;
          }
        } catch (error) {
          console.log(
            `Product variant ${item.productVariantId} coupon code not applicable`
          );
        }
      }

      if (hasValidDiscount) {
        setDiscountedProducts(newDiscountedProducts);
        setProductDiscountInfo({
          discountCode: productDiscount,
          ...Array.from(newDiscountedProducts.values())[0],
        });
        alert(
          `Discount code applied successfully for ${newDiscountedProducts.size} products!`
        );
      } else {
        alert("There are no products that can be used with this coupon code.");
        setProductDiscountInfo(null);
        setProductDiscount("");
        setDiscountedProducts(new Map());
      }
    } catch (err) {
      alert("An error occurred while checking the coupon code.");
      setProductDiscountInfo(null);
      setProductDiscount("");
      setDiscountedProducts(new Map());
    }
  };

  // Modify the calculateTotal function
  const calculateTotal = () => {
    let total = 0;

    // Calculate total with product-specific discounts
    cartItems.forEach((item) => {
      let itemTotal = item.price * item.quantity;
      const productDiscount = discountedProducts.get(item.productVariantId);

      if (productDiscount) {
        if (productDiscount.discountType === "FIXED") {
          itemTotal -= productDiscount.discountValue * item.quantity;
        } else {
          itemTotal -= (itemTotal * productDiscount.discountValue) / 100;
        }
      }
      total += Math.max(itemTotal, 0);
    });

    // Apply order discount if applicable
    if (orderDiscountInfo && total >= (orderDiscountInfo.minOrderValue || 0)) {
      if (orderDiscountInfo.discountType === "FIXED") {
        total -= Math.min(
          orderDiscountInfo.discountValue,
          orderDiscountInfo.maxDiscountAmount || orderDiscountInfo.discountValue
        );
      } else {
        const discountAmount = (total * orderDiscountInfo.discountValue) / 100;
        total -= Math.min(
          discountAmount,
          orderDiscountInfo.maxDiscountAmount || discountAmount
        );
      }
    }

    return Math.max(total, 0);
  };

  const handleSubmit = async () => {
    if (!selectedAddress) {
      alert("Please select shipping address");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/from-cart",
        null,
        {
          params: {
            userId,
            cartId,
            shippingAddressId: selectedAddress,
            paymentMethod,
            productDiscountCode: productDiscountInfo
              ? productDiscount.toUpperCase()
              : null,
            orderDiscountCode: orderDiscountInfo
              ? orderDiscount.toUpperCase()
              : null,
          },
        }
      );

      if (paymentMethod === "CASH") {
        navigate("/order-success");
      } else if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (err) {
      alert("An error occurred while creating the order.");
      console.error("Error creating order:", err);
    }
  };

  // Helper function to calculate individual item price with discount
  const calculateItemPrice = (item) => {
    let price = item.price * item.quantity;
    const productDiscount = discountedProducts.get(item.productVariantId);

    if (productDiscount) {
      if (productDiscount.discountType === "FIXED") {
        price -= productDiscount.discountValue * item.quantity;
      } else {
        price -= (price * productDiscount.discountValue) / 100;
      }
    }

    return Math.max(price, 0);
  };

  // New functions for address modal
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
    if (!addressFormData.postalCode)
      errors.postalCode = "Postal code is required";
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

  return (
    <div className="container mt-5" style={{ minHeight: "100vh" }}>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Cart Items</h3>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-3">
                  <img
                    src={`http://localhost:8080${item.imageUrl}`}
                    alt={item.variantName || "Image not available"}
                    className="img-thumbnail"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="ms-3">
                    <h5>{item.variantName || "No Name"}</h5>
                    <p>
                      {discountedProducts.has(item.productVariantId) ? (
                        <>
                          <span className="text-decoration-line-through">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-success ms-2">
                            ${calculateItemPrice(item).toFixed(2)}
                          </span>
                          <span className="text-danger ms-2">
                            (Reduce $
                            {(
                              item.price * item.quantity -
                              calculateItemPrice(item)
                            ).toFixed(2)}
                            )
                          </span>
                        </>
                      ) : (
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      )}
                    </p>
                    <p>Quantity: {item.quantity || 0}</p>
                    {discountedProducts.has(item.productVariantId) && (
                      <p className="text-success">
                        Coupon code applied: {productDiscount}(
                        {
                          discountedProducts.get(item.productVariantId)
                            .discountAmount
                        }
                        {discountedProducts.get(item.productVariantId)
                          .discountType === "PERCENTAGE"
                          ? "%"
                          : "$"}
                        )
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Discount and Shipping</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Product Discount Code:</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={productDiscount}
                    onChange={(e) => setProductDiscount(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={checkProductDiscount}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Order Discount Code:</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={orderDiscount}
                    onChange={(e) => setOrderDiscount(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={checkOrderDiscount}
                  >
                    Apply
                  </button>
                </div>
              </div>

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
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Order Summary</h5>

                    {/* Subtotal (original price) */}
                    <div className="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>
                        $
                        {cartItems
                          .reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>

                    {/* Products Discount */}
                    {discountedProducts.size > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-danger">
                        <span>Products Discount:</span>
                        <span>
                          -$
                          {Array.from(discountedProducts.entries())
                            .reduce((sum, [variantId]) => {
                              const item = cartItems.find(
                                (item) => item.productVariantId === variantId
                              );
                              const originalPrice = item.price * item.quantity;
                              const discountedPriceProduct =
                                calculateItemPrice(item);
                              return (
                                sum + (originalPrice - discountedPriceProduct)
                              );
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Order Discount */}
                    {orderDiscountInfo && (
                      <div className="d-flex justify-content-between text-danger">
                        <span>Order Discount:</span>
                        <span>
                          -$
                          {Math.min(
                            orderDiscountInfo.discountType === "FIXED"
                              ? orderDiscountInfo.discountValue
                              : (cartItems.reduce(
                                  (acc, item) =>
                                    acc + item.price * item.quantity,
                                  0
                                ) *
                                  orderDiscountInfo.discountValue) /
                                  100,
                            orderDiscountInfo.maxDiscountAmount ||
                              orderDiscountInfo.discountValue
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Total after applying discounts */}
                    <div className="d-flex justify-content-between mt-2">
                      <strong>Total:</strong>
                      <strong>${calculateTotal().toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleSubmit}
              >
                Place Order
              </button>
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
                className={`form-control ${
                  formErrors.address ? "is-invalid" : ""
                }`}
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
                className={`form-control ${
                  formErrors.city ? "is-invalid" : ""
                }`}
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
                className={`form-select ${
                  formErrors.country ? "is-invalid" : ""
                }`}
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
                className={`form-control ${
                  formErrors.postalCode ? "is-invalid" : ""
                }`}
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
                onChange={(phone) =>
                  setAddressFormData((prev) => ({ ...prev, phone }))
                }
                inputClass={`form-control ${
                  formErrors.phone ? "is-invalid" : ""
                }`}
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

export default CheckoutFromCart;
