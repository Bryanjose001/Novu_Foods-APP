import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const DELIVERY_FEE = 3.99;
const TAX_RATE = 0.1;

const validate = ({ customerName, customerEmail, deliveryAddress }) => {
  const errors = {};
  if (!customerName.trim()) errors.customerName = 'Full name is required';
  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
    errors.customerEmail = 'Enter a valid email address';
  if (!deliveryAddress.trim()) errors.deliveryAddress = 'Delivery address is required';
  return errors;
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    deliveryAddress: user?.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subtotal = getCartTotal();
      const tax = subtotal * TAX_RATE;
      const grandTotal = subtotal + DELIVERY_FEE + tax;

      const orderData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        customerPhone: formData.customerPhone.trim() || undefined,
        deliveryAddress: formData.deliveryAddress.trim(),
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
      clearCart();
      navigate(`/order/${response.data.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + DELIVERY_FEE + tax;

  const inputCls = (field) =>
    `input-field ${fieldErrors[field] ? 'ring-2 ring-red-300 focus:ring-red-400' : ''}`;

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">
      <div className="p-4 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-blackc">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-3 lg:gap-8">

          {/* Left: form */}
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark">
              <h2 className="font-bold text-blackc mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                Delivery Details
              </h2>
              <div className="space-y-4">
                <Field label="Full Name *" error={fieldErrors.customerName}>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={inputCls('customerName')}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email" error={fieldErrors.customerEmail}>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={inputCls('customerEmail')}
                      placeholder="john@example.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                      autoComplete="tel"
                    />
                  </Field>
                </div>

                <Field label="Delivery Address *" error={fieldErrors.deliveryAddress}>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows="2"
                    className={`${inputCls('deliveryAddress')} resize-none`}
                    placeholder="123 Main St, Apt 4, City, State, ZIP"
                    autoComplete="street-address"
                  />
                </Field>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark">
              <h2 className="font-bold text-blackc mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                Payment Method
              </h2>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">💵</div>
                <div>
                  <p className="font-bold text-blackc text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Pay when your order arrives</p>
                </div>
                <div className="ml-auto w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>

            {/* Mobile submit */}
            <button
              type="submit"
              disabled={loading}
              className="lg:hidden w-full btn-primary py-4 text-lg shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Placing order…
                </span>
              ) : `Place Order · $${grandTotal.toFixed(2)}`}
            </button>
          </div>

          {/* Right: order summary */}
          <div className="mt-6 lg:mt-0 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-grey-light-dark sticky top-24">
              <h2 className="font-bold text-blackc mb-4">Order Summary</h2>

              {/* Cart items */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.restaurant_id}`} className="flex justify-between text-sm">
                    <span className="text-gray-500 line-clamp-1 flex-1 mr-2">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-semibold text-blackc flex-shrink-0">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-grey-light-dark pt-3 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="text-blackc font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-blackc font-medium">${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span className="text-blackc font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-grey-light-dark pt-2 flex justify-between font-bold text-blackc text-base">
                  <span>Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="hidden lg:flex w-full btn-primary py-4 text-base shadow-lg shadow-primary/30 mt-4 items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    Placing order…
                  </>
                ) : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
