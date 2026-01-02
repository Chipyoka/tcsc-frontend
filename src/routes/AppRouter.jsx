import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import '../styles/App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from '../pages/Home.jsx';
import Products from '../pages/Products.jsx';
import ProductDetail from '../pages/ProductDetails.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Profile from '../pages/Profile.jsx';
// import DiscountClub from '../pages/DiscountClub.jsx';

// payments & checkout
import PaymentSuccess from '../pages/PaymentSuccess.jsx';
import PaymentFailed from '../pages/PaymentFailed.jsx';

import HandleScroll from '../components/HandleScroll';

// utility pages
import CheckEmail from '../pages/CheckEmail.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import CookieBanner from '../components/CookieBanner.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRouter() {
  return (
    <> 
      <BrowserRouter>
        <HandleScroll/>
        <Routes>
          <Route path="/404" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:category/:subcategory/:slug" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/payment/success" element={<PaymentSuccess />} />
          <Route path="/checkout/payment/failed" element={<PaymentFailed />} />
          {/* <Route path="/discount-club" element={<DiscountClub />} /> */}

          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<><Profile /></>} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
