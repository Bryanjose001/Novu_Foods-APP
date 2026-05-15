import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import RestaurantSignUp from './pages/RestaurantSignUp';
import AdminDashboard from './pages/AdminDashboard';
import CategoryPage from './pages/CategoryPage';
<<<<<<< HEAD
=======
import SearchResults from './pages/SearchResults';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

const AUTH_ROUTES = ['/login', '/signup'];

function AppRoutes() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-primary">
      <Navbar />
      <main className="flex-1 w-full rounded-t-2xl md:rounded-t-3xl bg-grey-full-light relative z-10 pb-20 md:pb-0">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/restaurant-signup" element={<RestaurantSignUp />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderId" element={<OrderTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
