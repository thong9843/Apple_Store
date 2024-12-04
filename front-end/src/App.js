import React from "react";
import { useRoutes } from "react-router-dom";
import ClientHeader from "./components/common/ClientHeader";
import AdminHeader from "./components/common/AdminHeader";
import ClientFooter from "./components/common/ClientFooter";
import AdminFooter from "./components/common/AdminFooter";

import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Account from "./pages/user/Account";
import VerifyAccount from "./pages/user/VerifyAccount";
import ForgotPassword from "./pages/user/ForgotPassword";
import ProductList from "./pages/user/ProductList";
import ProductDetail from "./pages/user/ProductDetail";
import CartPage from "./pages/user/CartPage";
import Checkout from "./pages/user/Checkout";
import CheckoutCart from "./pages/user/CheckoutCart";
import CheckoutFromCartItems from "./pages/user/CheckoutFromCartItems";
import ShippingAddressManager from "./pages/user/ShippingAddressManager";
import CallbackPage from "./pages/user/CallbackPage";
import OrderSuccessPage from "./pages/user/OrderSuccessPage";
import OrderHistory from "./pages/user/OrderHistory";
import ProductReview from "./pages/user/ProductReview";
import Home from "./pages/user/Home";
import Logout from "./pages/user/Logout";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ReviewsManagement from "./pages/admin/ReviewsManagement";
import DiscountManagement from "./pages/admin/DiscountManagement";

import { BASE_URL } from "./config";

export const getFullUrl = (path) => {
  if (path?.startsWith("http")) {
    return path;
  }
  return `${BASE_URL}${path}`;
};

const isAdminDomain = window.location.hostname.startsWith("admin");

const App = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userRole = user?.role || "customer";

  // Định nghĩa route cho khách hàng
  const clientRoutes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/logout", element: <Logout /> },
    { path: "/account", element: <Account /> },
    { path: "/verify-account", element: <VerifyAccount /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/list", element: <ProductList /> },
    { path: "/list/:categoryId", element: <ProductList /> },
    { path: "/cart/", element: <CartPage /> },
    { path: "/callback", element: <CallbackPage /> },
    { path: "/shipping-address", element: <ShippingAddressManager /> },
    { path: "/order-success", element: <OrderSuccessPage /> },
    { path: "/order-history", element: <OrderHistory /> },
    { path: "/reviews", element: <ProductReview /> },
    { path: "/product/:id", element: <ProductDetail /> },
    { path: "/checkout", element: <Checkout /> },
    { path: "/checkout-cart", element: <CheckoutCart /> },
    { path: "/checkout-from-cart-items", element: <CheckoutFromCartItems /> },
    { path: "/", element: <Home /> },
  ];

  const adminRoutes = [
    { path: "/", element: <AdminLogin /> },
    { path: "/dashboard", element: <AdminDashboard /> },
    { path: "/product-management", element: <ProductManagement /> },
    { path: "/user-management", element: <UserManagement /> },
    { path: "/order-management", element: <OrderManagement /> },
    { path: "/reviews-management", element: <ReviewsManagement /> },
    { path: "/discount-management", element: <DiscountManagement /> },
    { path: "/logout", element: <Logout /> },
  ];

  const routes = useRoutes(isAdminDomain ? adminRoutes : clientRoutes);

  return (
    <div>
      {isAdminDomain ? <AdminHeader /> : <ClientHeader />}
      {routes}
      {isAdminDomain ? <AdminFooter /> : <ClientFooter />}
    </div>
  );
};

export default App;
