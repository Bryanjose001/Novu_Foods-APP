import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-4">
        <div className="text-6xl mb-4 bg-grey-light p-6 rounded-full"></div>
        <h2 className="text-2xl font-bold mb-2 text-blackc">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-center">Add some delicious food to get started!</p>
        <Link to="/" className="btn-primary">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const total = getCartTotal();
  const deliveryFee = 3.99;
  const tax = total * 0.1;
  const grandTotal = total + deliveryFee + tax;

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 className="text-xl font-bold text-blackc">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 text-sm font-semibold hover:text-red-700 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          
          <div className="flex-1 space-y-4 mb-24 lg:mb-0">
            {cart.map((item) => (
              <div key={`${item.id}-${item.restaurant_id}`} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-grey-light-dark hover:shadow-md transition-shadow">
                <div className="w-20 h-20 flex-shrink-0 bg-grey-light rounded-xl overflow-hidden">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Food';
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-blackc leading-tight pr-2">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id, item.restaurant_id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    <span className="font-bold text-primary text-lg">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>

                    <div className="flex items-center space-x-3 bg-grey-light rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.restaurant_id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded bg-white shadow-sm flex items-center justify-center font-bold text-gray-600 active:scale-90 transition-transform hover:bg-grey-light-dark"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold min-w-[1rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.restaurant_id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded bg-primary text-white shadow-sm flex items-center justify-center font-bold active:scale-90 transition-transform hover:bg-hover"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block w-96 h-fit bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-blackc">Order Summary</h2>
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-grey-light-dark pt-2 mt-2 flex justify-between font-bold text-blackc text-base">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 text-base shadow-lg shadow-primary/30"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-[88px] left-0 right-0 p-4 bg-white border-t border-grey-light-dark rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">Total</span>
            <span className="text-2xl font-bold text-blackc">${grandTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full btn-primary py-4 text-lg shadow-lg shadow-primary/30"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
