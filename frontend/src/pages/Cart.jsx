import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] p-6 gap-4">
        <div className="w-24 h-24 bg-grey-light rounded-full flex items-center justify-center text-5xl">🛒</div>
        <h2 className="text-2xl font-bold text-blackc">Your cart is empty</h2>
        <p className="text-gray-400 text-center text-sm max-w-xs">Looks like you haven't added anything yet. Browse our restaurants and find something you love!</p>
        <Link to="/" className="btn-primary mt-2">Browse Restaurants</Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = 3.99;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <div className="bg-grey-full-light min-h-screen pb-48 md:pb-8">
      <div className="p-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-blackc">Your Cart</h1>
          <button
            onClick={() => { if (window.confirm('Clear all items?')) clearCart(); }}
            className="text-red-500 text-sm font-semibold hover:text-red-700 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8">

          {/* Items */}
          <div className="flex-1 space-y-3">
            {cart.map((item) => {
              const itemTotal = parseFloat(item.price) * item.quantity;
              return (
                <div
                  key={`${item.id}-${item.restaurant_id}`}
                  className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-grey-light-dark hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-grey-light rounded-xl overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl">🍽️</div>'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h3 className="font-bold text-blackc text-sm leading-tight line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">${parseFloat(item.price).toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.restaurant_id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-primary text-base">${itemTotal.toFixed(2)}</span>
                      <div className="flex items-center space-x-2 bg-grey-light rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.restaurant_id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-600 active:scale-90 transition-transform hover:bg-grey-light-dark text-lg leading-none"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold min-w-[1.25rem] text-center text-blackc">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.restaurant_id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-primary text-white shadow-sm flex items-center justify-center font-bold active:scale-90 transition-transform hover:bg-hover text-lg leading-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop order summary */}
          <div className="hidden lg:block w-96 h-fit bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark sticky top-24">
            <h2 className="text-lg font-bold mb-5 text-blackc">Order Summary</h2>
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cart.reduce((n, i) => n + i.quantity, 0)} items)</span>
                <span className="font-semibold text-blackc">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className="font-semibold text-blackc">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (10%)</span>
                <span className="font-semibold text-blackc">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-grey-light-dark pt-3 flex justify-between font-bold text-blackc text-base">
                <span>Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-3.5 text-base shadow-lg shadow-primary/30"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-white border-t border-grey-light-dark px-4 py-4 shadow-[0_-8px_16px_rgba(0,0,0,0.06)] z-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-gray-400">{cart.reduce((n, i) => n + i.quantity, 0)} items · subtotal</p>
            <span className="text-xl font-extrabold text-blackc">${grandTotal.toFixed(2)}</span>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>+ ${deliveryFee.toFixed(2)} delivery</p>
            <p>+ ${tax.toFixed(2)} tax</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full btn-primary py-4 text-base shadow-lg shadow-primary/30"
        >
          Checkout · ${grandTotal.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default Cart;
