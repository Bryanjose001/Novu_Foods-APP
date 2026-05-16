import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';

const cuisineTypes = [
  'American', 'Italian', 'Mexican', 'Chinese', 'Japanese',
  'Indian', 'Thai', 'Mediterranean', 'French', 'Korean',
  'Vietnamese', 'Greek', 'Middle Eastern', 'Caribbean', 'Other',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, cuisineType, ownerName, ownerEmail, address }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Restaurant name is required';
  if (!cuisineType) errors.cuisineType = 'Please select a cuisine type';
  if (!ownerName.trim()) errors.ownerName = 'Owner name is required';
  if (!ownerEmail.trim()) errors.ownerEmail = 'Email is required';
  else if (!EMAIL_RE.test(ownerEmail)) errors.ownerEmail = 'Enter a valid email address';
  if (!address.trim()) errors.address = 'Address is required';
  return errors;
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const RestaurantSignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [createdRestaurant, setCreatedRestaurant] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    cuisineType: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    address: '',
    description: '',
    imageUrl: '',
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
    setError(null);

    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await restaurantService.create(formData);
      setCreatedRestaurant(response.data);
      setSuccess(true);
    } catch (err) {
      console.error('Error signing up restaurant:', err);
      setError(err.response?.data?.error || 'Failed to sign up restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `input-field${fieldErrors[field] ? ' ring-2 ring-red-300 focus:ring-red-400' : ''}`;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-blackc mb-3">Welcome Aboard!</h1>
          <p className="text-lg text-gray-600 mb-2">
            <span className="font-semibold text-primary">{createdRestaurant?.name}</span> has been successfully registered.
          </p>
          <p className="text-gray-500 mb-8">
            Your restaurant is now live on Novu Foods. Customers can start discovering and ordering from you right away!
          </p>

          <div className="bg-grey-light border border-grey-light-dark rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              <strong>Restaurant ID:</strong>{' '}
              <span className="font-mono text-xs break-all">{createdRestaurant?.id}</span>
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate(`/restaurant/${createdRestaurant?.id}`)}
              className="btn-primary text-base py-3 px-6"
            >
              View Your Restaurant
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary text-base py-3 px-6"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">

      {/* Hero banner */}
      <div className="gradient-primary text-white rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <span className="text-4xl">🤝</span>
          <h1 className="text-3xl font-bold">Partner With Novu Foods</h1>
        </div>
        <p className="text-lg opacity-90 relative z-10">
          Join our growing network of restaurants and reach thousands of hungry customers in your area.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 text-center">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="font-bold text-blackc mb-1">Grow Your Business</h3>
          <p className="text-sm text-gray-600">Reach new customers and increase your revenue with online orders.</p>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold text-blackc mb-1">Easy Setup</h3>
          <p className="text-sm text-gray-600">Get started in minutes. We handle delivery so you can focus on cooking.</p>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-bold text-blackc mb-1">Zero Upfront Cost</h3>
          <p className="text-sm text-gray-600">No registration fees. Start receiving orders as soon as you sign up.</p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 text-blackc">Restaurant Registration</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Restaurant info */}
          <div>
            <h3 className="text-lg font-semibold text-blackc mb-3 pb-2 border-b border-grey-light-dark">
              🏪 Restaurant Information
            </h3>
            <div className="space-y-4">
              <Field label="Restaurant Name *" error={fieldErrors.name}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputCls('name')}
                  placeholder="e.g. Mario's Italian Kitchen"
                  autoComplete="organization"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Cuisine Type *" error={fieldErrors.cuisineType}>
                  <select
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    className={inputCls('cuisineType')}
                  >
                    <option value="">Select cuisine type…</option>
                    {cuisineTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Image URL">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://example.com/photo.jpg"
                  />
                </Field>
              </div>

              <Field label="Restaurant Address *" error={fieldErrors.address}>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputCls('address')}
                  placeholder="123 Main St, City, State 12345"
                  autoComplete="street-address"
                />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Tell customers what makes your restaurant special…"
                />
              </Field>
            </div>
          </div>

          {/* Owner info */}
          <div>
            <h3 className="text-lg font-semibold text-blackc mb-3 pb-2 border-b border-grey-light-dark">
              👤 Owner Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Owner Name *" error={fieldErrors.ownerName}>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className={inputCls('ownerName')}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <Field label="Email Address *" error={fieldErrors.ownerEmail}>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  className={inputCls('ownerEmail')}
                  placeholder="owner@restaurant.com"
                  autoComplete="email"
                />
              </Field>
            </div>
          </div>

          <div className="bg-grey-light border border-grey-light-dark rounded-xl p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This is a demo application. Your restaurant will appear on the platform immediately after registration.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-lg py-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Registering…
              </>
            ) : '🚀 Register My Restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSignUp;
