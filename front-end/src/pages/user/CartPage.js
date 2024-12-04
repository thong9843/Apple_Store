import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/CartPage.css";
import { getFullUrl } from "../../App";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    if (userId) {
      fetchCartData();
    }
  }, [userId]);

  const fetchCartData = async () => {
    try {
      const cartResponse = await axios.get(getFullUrl(`/api/cart/${userId}`));
      const cart = cartResponse.data;

      if (!cart || !cart.items || !Array.isArray(cart.items)) {
        setCartItems([]);
        setTotal(0);
        return;
      }

      // Fetch variant and image details for each cart item
      const itemsWithDetails = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const variantResponse = await axios.get(
              getFullUrl(`/api/product-variants/${item.productVariantId}`)
            );
            const imageResponse = await axios.get(
              getFullUrl(`/api/product-images/variant/${item.productVariantId}`)
            );

            return {
              ...item,
              cartId: cart.id, // Thêm cartId từ response
              variant: variantResponse.data,
              image: imageResponse.data[0]?.imageUrl || "",
            };
          } catch (error) {
            console.error("Error fetching item details:", error);
            return null;
          }
        })
      );

      const validItems = itemsWithDetails.filter((item) => item !== null);
      setCartItems(validItems);

      // Tính tổng tiền từ các item
      const calculatedTotal = validItems.reduce((sum, item) => {
        return sum + item.variant.price * item.quantity;
      }, 0);
      setTotal(calculatedTotal);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartItems([]);
      setTotal(0);
    }
  };

  const handleRemoveItem = async (variantId) => {
    try {
      await axios.delete(
        getFullUrl(
          `/api/cart/remove?userId=${userId}&productVariantId=${variantId}`
        )
      );
      fetchCartData();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(getFullUrl(`/api/cart/clear?userId=${userId}`));
      fetchCartData();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      for (const itemId of selectedItems) {
        const item = cartItems.find((i) => i.id === itemId);
        if (item) {
          await handleRemoveItem(item.variant.id);
        }
      }
      setSelectedItems([]);
    } catch (error) {
      console.error("Error removing selected items:", error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout-cart", {
        state: {
          userId,
          cartId: cartItems[0].cartId,
        },
      });
    }
  };

  const handleCheckoutSelected = () => {
    navigate("/checkout-from-cart-items", {
      state: {
        userId,
        cartItemIds: selectedItems,
      },
    });
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const updateQuantityAPI = async (variantId, quantity) => {
    try {
      const params = {
        userId,
        productVariantId: variantId,
        quantity,
      };

      await axios.put(getFullUrl("/api/cart/update"), null, { params });
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCartData(); // Reload data if API fails
    }
  };

  const debouncedUpdateQuantity = debounce(updateQuantityAPI, 500);

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variant.id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    setTotal((prevTotal) => {
      const item = cartItems.find((item) => item.variant.id === variantId);
      if (!item) return prevTotal;
      const oldTotal = prevTotal - item.variant.price * item.quantity;
      const newTotal = oldTotal + item.variant.price * newQuantity;
      return newTotal;
    });

    debouncedUpdateQuantity(variantId, newQuantity);
  };

  const handleIncreaseQuantity = (variantId, currentQuantity) => {
    handleQuantityChange(variantId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (variantId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(variantId, currentQuantity - 1);
    }
  };

  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  

  return (
    <div className="container my-4" style={{ minHeight: '100vh'}}>
      <h2 className="text-center">Your Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className="btn btn-primary transition-btn"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Done" : "Edit Cart"}
            </button>
            {isEditing && (
              <div>
                <button
                  className="btn btn-danger me-2 transition-btn"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
                {selectedItems.length > 0 && (
                  <button
                    className="btn btn-warning transition-btn"
                    onClick={handleRemoveSelected}
                  >
                    Remove Selected
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.id} className="col-12 mb-3 cart-item">
                <div className="cart-item-inner d-flex justify-content-between align-items-center p-3 border rounded">
                  <div className={`left-side d-flex align-items-center ${isEditing ? 'shifted' : ''}`}>
                    {isEditing && (
                      <input
                        type="checkbox"
                        className={`form-check-input me-3 fade-in-checkbox ${
                          selectedItems.includes(item.id) ? "checked" : ""
                        }`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    )}
                    <img
                      src={getFullUrl(item.image)}
                      alt={item.variant.variantName}
                      className="img-fluid me-3"
                      style={{ width: "100px" }}
                    />
                    <div className="item-details">
                      <h5>{item.variant.variantName}</h5>
                      <p>Price: ${item.variant.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="right-side text-end">
                    {isEditing ? (
                      <div className="d-flex align-items-center justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            handleDecreaseQuantity(item.variant.id, item.quantity)
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm mx-2"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.variant.id,
                              parseInt(e.target.value)
                            )
                          }
                          min="1"
                          style={{ width: "60px" }}
                        />
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            handleIncreaseQuantity(item.variant.id, item.quantity)
                          }
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-danger ms-3 transition-btn"
                          onClick={() => handleRemoveItem(item.variant.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p>Quantity: {item.quantity}</p>
                    )}
                    <p>
                      Total: ${(item.variant.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-end mt-4">
            <h4>Subtotal: ${total.toFixed(2)}</h4>
            <div className="checkout-buttons">
              {selectedItems.length > 0 && (
                <button
                  className={`btn btn-primary ms-2 transition-btn checkout-selected ${
                    selectedItems.length > 0 ? "visible" : ""
                  }`}
                  onClick={handleCheckoutSelected}
                >
                  Checkout Selected
                </button>
              )}
              <button
                className="btn btn-primary ms-2 transition-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-4 d-flex justify-content-center align-items-center vh-100">
        <div className="card text-center">
          <div className="card-body">
            <h2 className="card-title">Cart empty!</h2>
          </div>
        </div>
        <br></br>
      </div>
      )}
    </div>
  );
};


export default CartPage;
