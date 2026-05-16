import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PROFILE_KEY = 'userProfile';
const AVATAR_KEY = 'userAvatar';

const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
};

const STATUS_STYLES = {
  preparing:  { label: 'Preparing',   cls: 'bg-yellow-100 text-yellow-700' },
  on_the_way: { label: 'On the Way',  cls: 'bg-blue-100 text-blue-700' },
  delivered:  { label: 'Delivered',   cls: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',   cls: 'bg-red-100 text-red-700' },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  // Bootstrap profile from auth user if localStorage profile is missing
  const initialProfile = getProfile() || (user ? { name: user.name, email: user.email, phone: user.phone || '' } : null);

  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(!initialProfile);
  const [form, setForm] = useState(initialProfile || { name: '', email: '', phone: '', address: '' });
  const [formError, setFormError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem(AVATAR_KEY) || null);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await orderService.getAll();
      const all = res.data || [];
      const mine = profile?.name
        ? all.filter((o) => o.customer_name?.toLowerCase() === profile.name.toLowerCase())
        : [];
      setOrders(mine);
      setOrdersError(false);
    } catch {
      setOrdersError(true);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Enter a valid email address');
      return;
    }
    const saved = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: (form.phone || '').trim(),
      address: (form.address || '').trim(),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(saved));
    // Keep auth session in sync so checkout pre-fill stays current
    updateUser({ name: saved.name, email: saved.email, phone: saved.phone, address: saved.address });
    setProfile(saved);
    setEditing(false);
    setFormError('');
    fetchOrders();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be under 2 MB.');
      return;
    }
    setAvatarError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      localStorage.setItem(AVATAR_KEY, dataUrl);
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    localStorage.removeItem(AVATAR_KEY);
    setAvatar(null);
  };

  const handleClear = () => {
    if (!window.confirm('Clear your profile?')) return;
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(AVATAR_KEY);
    setProfile(null);
    setAvatar(null);
    setForm({ name: '', email: '', phone: '' });
    setOrders([]);
    setEditing(true);
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-5 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-blackc">Profile</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {initials}
              </div>
            )}
            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-primary-dark transition-colors"
              title="Upload photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          {avatarError && (
            <p className="text-xs text-red-500 mb-1">{avatarError}</p>
          )}
          {avatar && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors mb-2"
            >
              Remove photo
            </button>
          )}
          {profile && !editing && (
            <div className="text-center">
              <p className="font-bold text-blackc text-lg">{profile.name}</p>
              {profile.email && <p className="text-sm text-gray-400">{profile.email}</p>}
            </div>
          )}
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-grey-light-dark p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blackc">Personal Info</h2>
            {profile && !editing && (
              <button
                onClick={() => { setForm(profile); setEditing(true); }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              {formError && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-field"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="input-field"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone || ''}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Default Delivery Address</label>
                <textarea
                  rows={2}
                  value={form.address || ''}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="input-field resize-none"
                  placeholder="123 Main St, Apt 4, New York, NY 10001"
                  autoComplete="street-address"
                />
                <p className="text-[11px] text-gray-400 mt-1">Pre-filled at checkout.</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" className="btn-primary flex-1 py-2.5">Save Profile</button>
                {profile && (
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-5">Cancel</button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="font-semibold text-blackc">{profile?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="font-semibold text-blackc">{profile?.email || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <span className="font-semibold text-blackc">{profile?.phone || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400 flex-shrink-0">Address</span>
                <span className="font-semibold text-blackc text-right">{profile?.address || '—'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-grey-light-dark shadow-sm mb-5 divide-y divide-grey-light-dark">
          {[
            { label: 'My Favorites', to: '/favorites', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> },
            { label: 'Browse Restaurants', to: '/category/restaurants', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
            { label: 'Cart', to: '/cart', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
          ].map(({ label, to, icon }) => (
            <Link key={to} to={to} className="flex items-center justify-between px-5 py-4 hover:bg-grey-light transition-colors">
              <div className="flex items-center gap-3 text-sm font-semibold text-blackc">
                <span className="text-gray-400">{icon}</span>
                {label}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))}
        </div>

        {/* Order history */}
        <div className="mb-6">
          <h2 className="font-bold text-blackc mb-3">Order History</h2>

          {!profile ? (
            <div className="bg-white rounded-2xl border border-grey-light-dark p-6 text-center text-sm text-gray-400">
              Save your profile to see orders placed with this name.
            </div>
          ) : ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-grey-light-dark p-4 animate-pulse">
                  <div className="h-4 bg-grey-light-dark rounded w-1/3 mb-2" />
                  <div className="h-3 bg-grey-light-dark rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : ordersError ? (
            <div className="bg-white rounded-2xl border border-grey-light-dark p-6 text-center text-sm text-gray-400">
              Could not load orders.{' '}
              <button onClick={fetchOrders} className="text-primary font-bold hover:underline">Retry</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-grey-light-dark p-6 text-center text-sm text-gray-400">
              No orders found for <span className="font-semibold text-blackc">{profile.name}</span>.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const s = STATUS_STYLES[order.status] || { label: order.status, cls: 'bg-gray-100 text-gray-600' };
                return (
                  <Link
                    key={order.id}
                    to={`/order/${order.id}`}
                    className="block bg-white rounded-2xl border border-grey-light-dark p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-bold text-blackc">Order #{String(order.id).slice(0, 8)}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{order.delivery_address}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                      </span>
                      <span className="text-sm font-bold text-primary">${parseFloat(order.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Danger zone */}
        {profile && (
          <button
            onClick={handleClear}
            className="w-full text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-xl py-3 transition-colors"
          >
            Clear Profile Data
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
