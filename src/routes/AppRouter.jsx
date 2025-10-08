import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import '../styles/App.css';
// import Products from '../pages/Products.jsx';
// import ProductDetail from '../pages/ProductDetail.jsx';
// import Login from '../pages/Login.jsx';
// import Register from '../pages/Register.jsx';
// import Cart from '../pages/Cart.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
