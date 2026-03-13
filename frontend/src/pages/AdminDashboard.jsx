import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantService, menuService, orderService, adminService } from '../services/api';

const storeTypes = [
    { key: 'all', label: 'All Stores' },
    { key: 'restaurant', label: 'Restaurants' },
    { key: 'grocery', label: 'Groceries' },
    { key: 'pharmacy', label: 'Pharmacy' },
];

const cuisineTypesByStore = {
    restaurant: ['Fast Foods', 'Burgers', 'Breakfast', 'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Greek', 'Middle Eastern', 'Caribbean'],
    grocery: ['Fresh Food', 'Cooking Oil & Ghee', 'Meat & Fish', 'Bakery & Snacks', 'Dairy & Eggs', 'Beverages'],
    pharmacy: ['Pharmacy', 'CBD', 'Technologies', 'Beauty'],
};

const defaultImages = {
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    pharmacy: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800',
};

const storeTypeStyles = {
    restaurant: { badge: 'bg-orange-100 text-orange-700', border: 'border-orange-400 bg-orange-50 text-orange-700', label: 'Restaurant' },
    grocery: { badge: 'bg-green-100 text-green-700', border: 'border-green-400 bg-green-50 text-green-700', label: 'Grocery' },
    pharmacy: { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-400 bg-blue-50 text-blue-700', label: 'Pharmacy' },
};

const IconBack = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const IconStore = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconOrders = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" /></svg>
);
const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
);
const IconEye = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IconStar = () => (
    <img src="/Icons/star-Filled.png" alt="rating" className="w-3.5 h-3.5" />
);
const IconDelivery = () => (
    <img src="/Icons/Icon.png" alt="delivery" className="w-3.5 h-3.5" />
);
const IconTimer = () => (
    <img src="/Icons/timer.png" alt="time" className="w-3.5 h-3.5" />
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [stores, setStores] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [activeSection, setActiveSection] = useState('stores');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showMenuForm, setShowMenuForm] = useState(null);
    const [editingStore, setEditingStore] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [storeForm, setStoreForm] = useState({
        name: '', cuisineType: [], ownerName: '', ownerEmail: '',
        ownerPhone: '', address: '', description: '', imageUrl: '',
        storeType: 'restaurant', deliveryFee: '3.00', deliveryTime: '30-40 min',
    });

    const toggleCuisine = (cuisine) => {
        setStoreForm(prev => {
            const current = Array.isArray(prev.cuisineType) ? prev.cuisineType : prev.cuisineType.split(',').map(s => s.trim()).filter(Boolean);
            const updated = current.includes(cuisine)
                ? current.filter(c => c !== cuisine)
                : [...current, cuisine];
            return { ...prev, cuisineType: updated };
        });
    };

    const [menuForm, setMenuForm] = useState({
        name: '', description: '', price: '', category: '', imageUrl: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchStores();
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handleAuthError = (err) => {
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
            setLoginError('Session expired. Please login again.');
        }
    };

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await restaurantService.getAll();
            setStores(response.data);
        } catch (err) {
            console.error('Error fetching stores:', err);
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAll();
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            handleAuthError(err);
        }
    };

    const filteredStores = activeTab === 'all'
        ? stores
        : stores.filter(s => (s.store_type || 'restaurant') === activeTab);

    const resetStoreForm = () => {
        setStoreForm({
            name: '', cuisineType: [], ownerName: '', ownerEmail: '',
            ownerPhone: '', address: '', description: '', imageUrl: '',
            storeType: 'restaurant', deliveryFee: '3.00', deliveryTime: '30-40 min',
        });
        setEditingStore(null);
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formToSend = {
            ...storeForm,
            cuisineType: Array.isArray(storeForm.cuisineType)
                ? storeForm.cuisineType.join(', ')
                : storeForm.cuisineType,
        };
        try {
            if (editingStore) {
                await restaurantService.update(editingStore.id, formToSend);
                setSuccess(`"${storeForm.name}" updated successfully!`);
            } else {
                await restaurantService.signup(formToSend);
                setSuccess(`"${storeForm.name}" created successfully!`);
            }
            resetStoreForm();
            setShowAddForm(false);
            fetchStores();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save store');
            handleAuthError(err);
        }
    };

    const handleEditStore = (store) => {
        setStoreForm({
            name: store.name || '',
            cuisineType: store.cuisine_type ? store.cuisine_type.split(',').map(s => s.trim()).filter(Boolean) : [],
            ownerName: store.owner_name || '',
            ownerEmail: store.owner_email || '',
            ownerPhone: store.owner_phone || '',
            address: store.address || '',
            description: store.description || '',
            imageUrl: store.image_url || '',
            storeType: store.store_type || 'restaurant',
            deliveryFee: store.delivery_fee || '3.00',
            deliveryTime: store.delivery_time || '30-40 min',
        });
        setEditingStore(store);
        setShowAddForm(true);
        setActiveSection('stores');
    };

    const handleDeleteStore = async (store) => {
        if (!window.confirm(`Delete "${store.name}"? This will also remove all menu items.`)) return;
        try {
            await restaurantService.delete(store.id);
            setSuccess(`"${store.name}" deleted.`);
            fetchStores();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete store');
            handleAuthError(err);
        }
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await menuService.create({ restaurantId: showMenuForm, ...menuForm });
            const store = stores.find(s => s.id === showMenuForm);
            setSuccess(`"${menuForm.name}" added to ${store?.name || 'store'}!`);
            setMenuForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
            setShowMenuForm(null);
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add menu item');
            handleAuthError(err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await adminService.verify(password);
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                setIsAuthenticated(true);
            }
        } catch (err) {
            setLoginError(err.response?.data?.error || 'Invalid password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-grey-full-light flex flex-col items-center justify-center p-4">
                <div className="card w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconStore />
                    </div>
                    <h1 className="text-2xl font-bold text-blackc mb-2">Admin Access</h1>
                    <p className="text-gray-500 mb-6 text-sm">Enter the admin password to continue.</p>
                    {loginError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">
                            {loginError}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password" required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field text-center tracking-widest"
                            placeholder="••••••••"
                        />
                        <button type="submit" className="w-full btn-primary py-3">
                            Login to Dashboard
                        </button>
                    </form>
                    <div className="mt-6">
                        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-grey-full-light pb-24">

            {/* Header */}
            <div className="gradient-primary text-white p-6 pb-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            <IconBack />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
                            <p className="text-sm opacity-75">Manage stores, menus & orders</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold">{stores.length} Stores</span>
                        <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold">{orders.length} Orders</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                        {[
                            { key: 'stores', label: 'Stores', icon: <IconStore /> },
                            { key: 'orders', label: 'Orders', icon: <IconOrders /> },
                        ].map(s => (
                            <button
                                key={s.key}
                                onClick={() => setActiveSection(s.key)}
                                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeSection === s.key
                                    ? 'bg-white text-primary shadow-md'
                                    : 'bg-white/15 text-white hover:bg-white/25'
                                    }`}
                            >
                                <span>{s.icon}</span>
                                <span>{s.label}</span>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-xs font-bold text-white/80 hover:text-white bg-black/20 hover:bg-black/40 px-3 py-2 rounded-xl transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-4 relative z-10">

                {/* Alerts */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium">{success}</span>
                        <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-700 ml-3">✕</button>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 ml-3">✕</button>
                    </div>
                )}

                {/* Stores Section */}
                {activeSection === 'stores' && (
                    <>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                                {storeTypes.map(t => (
                                    <button
                                        key={t.key}
                                        onClick={() => setActiveTab(t.key)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === t.key
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-grey-light-dark hover:bg-grey-light'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => { resetStoreForm(); setShowAddForm(!showAddForm); }}
                                className="btn-primary flex items-center justify-center space-x-2 text-sm py-2.5 px-5"
                            >
                                <IconPlus />
                                <span>{showAddForm ? 'Cancel' : 'Add Store'}</span>
                            </button>
                        </div>

                        {/* Add / Edit Store Form */}
                        {showAddForm && (
                            <div className="card p-5 mb-5">
                                <h2 className="text-lg font-bold text-blackc mb-4">
                                    {editingStore ? `Edit: ${editingStore.name}` : 'Add New Store'}
                                </h2>
                                <form onSubmit={handleStoreSubmit} className="space-y-4">

                                    {/* Store Type Picker */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Type *</label>
                                        <div className="flex space-x-3">
                                            {[
                                                { key: 'restaurant', label: 'Restaurant' },
                                                { key: 'grocery', label: 'Grocery' },
                                                { key: 'pharmacy', label: 'Pharmacy' },
                                            ].map(t => {
                                                const styles = storeTypeStyles[t.key];
                                                const isSelected = storeForm.storeType === t.key;
                                                return (
                                                    <button
                                                        key={t.key}
                                                        type="button"
                                                        onClick={() => setStoreForm({ ...storeForm, storeType: t.key, cuisineType: [] })}
                                                        className={`flex-1 py-3 px-3 rounded-xl text-sm font-bold border-2 transition-all ${isSelected
                                                            ? styles.border
                                                            : 'border-grey-light-dark bg-white text-gray-500 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name *</label>
                                            <input type="text" required value={storeForm.name}
                                                onChange={e => setStoreForm({ ...storeForm, name: e.target.value })}
                                                className="input-field" placeholder="e.g. Fresh Market" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Categories
                                                {Array.isArray(storeForm.cuisineType) && storeForm.cuisineType.length > 0 && (
                                                    <span className="ml-2 text-primary font-normal text-xs">({storeForm.cuisineType.length} selected)</span>
                                                )}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {(cuisineTypesByStore[storeForm.storeType] || []).map(c => {
                                                    const selected = Array.isArray(storeForm.cuisineType) && storeForm.cuisineType.includes(c);
                                                    return (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() => toggleCuisine(c)}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected
                                                                ? 'bg-primary text-white border-primary'
                                                                : 'bg-white text-gray-600 border-grey-light-dark hover:border-primary hover:text-primary'
                                                                }`}
                                                        >
                                                            {c}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Owner Name *</label>
                                            <input type="text" required value={storeForm.ownerName}
                                                onChange={e => setStoreForm({ ...storeForm, ownerName: e.target.value })}
                                                className="input-field" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Owner Email *</label>
                                            <input type="email" required value={storeForm.ownerEmail}
                                                onChange={e => setStoreForm({ ...storeForm, ownerEmail: e.target.value })}
                                                className="input-field" placeholder="owner@store.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                            <input type="tel" value={storeForm.ownerPhone}
                                                onChange={e => setStoreForm({ ...storeForm, ownerPhone: e.target.value })}
                                                className="input-field" placeholder="+1 555-123-4567" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
                                            <input type="text" required value={storeForm.address}
                                                onChange={e => setStoreForm({ ...storeForm, address: e.target.value })}
                                                className="input-field" placeholder="123 Main St, City" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
                                            <input type="url" value={storeForm.imageUrl}
                                                onChange={e => setStoreForm({ ...storeForm, imageUrl: e.target.value })}
                                                className="input-field" placeholder="https://..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Fee ($)</label>
                                            <input type="number" step="0.01" value={storeForm.deliveryFee}
                                                onChange={e => setStoreForm({ ...storeForm, deliveryFee: e.target.value })}
                                                className="input-field" placeholder="3.00" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Time</label>
                                            <input type="text" value={storeForm.deliveryTime}
                                                onChange={e => setStoreForm({ ...storeForm, deliveryTime: e.target.value })}
                                                className="input-field" placeholder="30-40 min" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                        <textarea value={storeForm.description} rows="2"
                                            onChange={e => setStoreForm({ ...storeForm, description: e.target.value })}
                                            className="input-field" placeholder="Tell customers about this store..." />
                                    </div>

                                    <div className="flex space-x-3">
                                        <button type="submit" className="btn-primary flex-1 py-3">
                                            {editingStore ? 'Save Changes' : 'Create Store'}
                                        </button>
                                        {editingStore && (
                                            <button type="button" onClick={() => { resetStoreForm(); setShowAddForm(false); }}
                                                className="btn-secondary px-6">Cancel</button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Add Menu Item Form */}
                        {showMenuForm && (
                            <div className="card p-5 mb-5 border-2 border-primary">
                                <h2 className="text-lg font-bold text-blackc mb-4">
                                    Add Menu Item — {stores.find(s => s.id === showMenuForm)?.name}
                                </h2>
                                <form onSubmit={handleMenuSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
                                            <input type="text" required value={menuForm.name}
                                                onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                                                className="input-field" placeholder="e.g. Cheeseburger" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($) *</label>
                                            <input type="number" step="0.01" required value={menuForm.price}
                                                onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                                                className="input-field" placeholder="9.99" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                            <input type="text" value={menuForm.category}
                                                onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}
                                                className="input-field" placeholder="e.g. Main Course, Drinks" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
                                            <input type="url" value={menuForm.imageUrl}
                                                onChange={e => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                                                className="input-field" placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                        <textarea value={menuForm.description} rows="2"
                                            onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}
                                            className="input-field" placeholder="Describe the item..." />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button type="submit" className="btn-primary flex-1 py-3">Add Item</button>
                                        <button type="button" onClick={() => setShowMenuForm(null)}
                                            className="btn-secondary px-6">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Store List */}
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="card p-4 animate-pulse">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 bg-grey-light-dark rounded-xl flex-shrink-0"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-grey-light-dark rounded w-1/3"></div>
                                                <div className="h-3 bg-grey-light-dark rounded w-1/2"></div>
                                                <div className="h-3 bg-grey-light-dark rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredStores.length === 0 ? (
                            <div className="card p-10 text-center">
                                <div className="w-16 h-16 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-3">
                                    <IconStore />
                                </div>
                                <h3 className="text-lg font-bold text-blackc mb-1">No stores yet</h3>
                                <p className="text-gray-500 text-sm">Click "Add Store" to create your first store.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredStores.map(store => {
                                    const typeStyle = storeTypeStyles[store.store_type] || storeTypeStyles.restaurant;
                                    return (
                                        <div key={store.id} className="card p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-grey-light border border-grey-light-dark">
                                                    <img
                                                        src={store.image_url}
                                                        alt={store.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = defaultImages[store.store_type] || defaultImages.restaurant;
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div>
                                                            <h3 className="font-bold text-blackc text-base line-clamp-1">{store.name}</h3>
                                                            <div className="flex items-center space-x-2 mt-0.5">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle.badge}`}>
                                                                    {(store.store_type || 'restaurant').toUpperCase()}
                                                                </span>
                                                                {store.cuisine_type && (
                                                                    <span className="text-[10px] text-gray-500">{store.cuisine_type}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-sm flex-shrink-0">
                                                            <IconStar />
                                                            <span className="font-bold text-blackc">{store.rating || '0.0'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                                        <span className="line-clamp-1">{store.address || 'No address'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                                        <span className="flex items-center space-x-1">
                                                            <IconDelivery />
                                                            <span>${store.delivery_fee || '3.00'}</span>
                                                        </span>
                                                        <span className="flex items-center space-x-1">
                                                            <IconTimer />
                                                            <span>{store.delivery_time || '30-40 min'}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2 mt-3">
                                                        <button
                                                            onClick={() => handleEditStore(store)}
                                                            className="flex items-center space-x-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            <IconEdit /><span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setShowMenuForm(store.id)}
                                                            className="flex items-center space-x-1 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            <IconPlus /><span>Add Item</span>
                                                        </button>
                                                        <Link
                                                            to={`/restaurant/${store.id}`}
                                                            className="flex items-center space-x-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            <IconEye /><span>View</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteStore(store)}
                                                            className="flex items-center space-x-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto"
                                                        >
                                                            <IconTrash /><span>Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* Orders Section */}
                {activeSection === 'orders' && (
                    <>
                        <h2 className="text-lg font-bold text-blackc mb-3 flex items-center space-x-2">
                            <IconOrders /><span>Recent Orders</span>
                        </h2>
                        {orders.length === 0 ? (
                            <div className="card p-10 text-center">
                                <div className="w-16 h-16 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-3">
                                    <IconOrders />
                                </div>
                                <h3 className="text-lg font-bold text-blackc mb-1">No orders yet</h3>
                                <p className="text-gray-500 text-sm">Orders will appear here once customers place them.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map(order => (
                                    <div key={order.id} className="card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-blackc text-sm">Order #{String(order.id).slice(0, 8)}</h3>
                                                <p className="text-xs text-gray-500">{order.customer_name}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'on_the_way' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{order.delivery_address}</span>
                                            <span className="font-bold text-blackc text-sm">${parseFloat(order.total_amount || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                                            <span>{order.customer_email || 'N/A'}</span>
                                            <span>•</span>
                                            <span>{order.estimated_delivery || 'N/A'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
