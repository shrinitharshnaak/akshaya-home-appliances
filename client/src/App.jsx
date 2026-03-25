import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import GalleryScreen from './screens/GalleryScreen';
import AboutScreen from './screens/AboutScreen';
import AddressesScreen from './screens/AddressesScreen';
import WishlistScreen from './screens/WishlistScreen';
import MyReviewsScreen from './screens/MyReviewsScreen';
import SearchScreen from './screens/SearchScreen';
import UserListScreen from './screens/admin/UserListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductAddScreen from './screens/admin/ProductAddScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/gallery" element={<GalleryScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/search" element={<SearchScreen />} />

            {/* Protected Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orders" element={<MyOrdersScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/edit" element={<ProfileEditScreen />} />
              <Route path="/addresses" element={<AddressesScreen />} />
              <Route path="/wishlist" element={<WishlistScreen />} />
              <Route path="/reviews" element={<MyReviewsScreen />} />
            </Route>

            {/* Admin Routes */}
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardScreen />} />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/productlist" element={<ProductListScreen />} />
              <Route path="/admin/product/add" element={<ProductAddScreen />} />
              <Route path="/admin/product/create" element={<ProductAddScreen />} />
              <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;