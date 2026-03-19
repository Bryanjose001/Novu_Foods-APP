import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';

const cuisineTypes = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Japanese',
    'Indian', 'Thai', 'Mediterranean', 'French', 'Korean',
    'Vietnamese', 'Greek', 'Middle Eastern', 'Caribbean', 'Other'
];

const RestaurantSignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await restaurantService.signup(formData);
            setCreatedRestaurant(response.data);
            setSuccess(true);
        } catch (err) {
            console.error('Error signing up restaurant:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to sign up restaurant. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="card p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-blackc mb-3">
                        Welcome Aboard!
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        <span className="font-semibold text-primary">{createdRestaurant?.name}</span> has been successfully registered.
                    </p>
                    <p className="text-gray-500 mb-8">
                        Your restaurant is now live on Novu Foods. Customers can start discovering and ordering from you right away!
                    </p>

                    <div className="bg-grey-light border border-grey-light-dark rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            <strong>Restaurant ID:</strong>{' '}
                            <span className="font-mono text-xs">{createdRestaurant?.id}</span>
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate(`/restaurant/${createdRestaurant?.id}`)}
                            className="btn-primary text-lg py-3 px-6"
                        >
                            View Your Restaurant
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-secondary text-lg py-3 px-6"
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

            <div className="card p-6">
                <h2 className="text-2xl font-bold mb-6 text-blackc">Restaurant Registration</h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <h3 className="text-lg font-semibold text-blackc mb-3 pb-2 border-b border-grey-light-dark">
                            🏪 Restaurant Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Restaurant Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="e.g. Mario's Italian Kitchen"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Cuisine Type *
                                    </label>
                                    <select
                                        name="cuisineType"
                                        value={formData.cuisineType}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    >
                                        <option value="">Select cuisine type...</option>
                                        {cuisineTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Restaurant Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="123 Main St, City, State 12345"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="input-field"
                                    placeholder="Tell customers what makes your restaurant special..."
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-blackc mb-3 pb-2 border-b border-grey-light-dark">
                            👤 Owner Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Owner Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="ownerPhone"
                                        value={formData.ownerPhone}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="ownerEmail"
                                    value={formData.ownerEmail}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="owner@restaurant.com"
                                />
                            </div>
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
                        className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : '🚀 Register My Restaurant'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantSignUp;
