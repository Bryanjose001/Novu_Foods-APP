import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const total = getCartTotal();
      const deliveryFee = 3.99;
      const tax = total * 0.1;
      const grandTotal = total + deliveryFee + tax;

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        totalAmount: grandTotal,
        items: cart.map((item) => ({
          menuItemId: item.id,
          restaurantId: item.restaurant_id,
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      };

      const response = await orderService.create(orderData);
      const order = response.data;

      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();
  const deliveryFee = 3.99;
  const tax = total * 0.1;
  const grandTotal = total + deliveryFee + tax;

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 className="text-xl font-bold text-blackc">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark">
              <h2 className="font-bold text-blackc mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">Address</label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="input-field resize-none"
                    placeholder="123 Main St, Apt 4"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark">
              <h2 className="font-bold text-blackc mb-4">Payment</h2>
              <div className="flex items-center p-3 bg-grey-light rounded-xl text-primary text-sm border border-grey-light-dark">
                <span>💳</span>
                <span className="ml-2 font-medium">Cash on Delivery </span>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark sticky top-24">
              <h2 className="font-bold text-blackc mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items Total</span>
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
                  <span>Total Amount</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg shadow-lg shadow-primary/30 disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
