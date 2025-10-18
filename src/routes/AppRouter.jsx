import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../styles/App.css';
import Home from '../pages/Home.jsx';
import Products from '../pages/Products.jsx';
import ProductDetail from '../pages/ProductDetails.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

import HandleScroll from '../components/HandleScroll';
// import Cart from '../pages/Cart.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <HandleScroll/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:category" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        {/* 
        <Route path="/cart" element={<Cart />} />
         */}
      </Routes>
    </BrowserRouter>
  );
}
