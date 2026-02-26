import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import RestaurantSignUp from './pages/RestaurantSignUp';
import AdminDashboard from './pages/AdminDashboard';
import BottomNav from './components/BottomNav';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-grey-full-light flex flex-col pb-20 md:pb-0">
          <div className="flex-1 w-full max-w-7xl mx-auto bg-grey-full-light min-h-screen relative shadow-sm overflow-hidden flex flex-col">
            
            <Navbar />

            <main className="flex-1 overflow-y-auto no-scrollbar w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/restaurant-signup" element={<RestaurantSignUp />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:orderId" element={<OrderTracking />} />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
