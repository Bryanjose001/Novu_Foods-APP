import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState(null);
  const { addToCart, cart } = useCart();
  const { show: showToast } = useToast();

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantService.getById(id),
        restaurantService.getMenu(id),
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load restaurant details');
      console.error('Error fetching restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item, restaurant.id);
    setAddedId(item.id);
    showToast(`${item.name} added to cart`);
    setTimeout(() => setAddedId(null), 1200);
  };

  const getCartQty = (itemId) =>
    cart.find((c) => c.id === itemId && c.restaurant_id === restaurant?.id)?.quantity || 0;

  if (loading) {
    return (
      <div className="bg-grey-full-light min-h-screen pb-24">
        <div className="h-64 md:h-80 bg-grey-light-dark animate-pulse rounded-b-3xl -mt-6"></div>
        <div className="px-4 py-6 space-y-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-20 h-14 bg-grey-light-dark rounded-xl flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-grey-light-dark rounded w-2/3"></div>
                <div className="h-2 bg-grey-light-dark rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-grey-full-light gap-4 p-6">
        <div className="text-5xl">😕</div>
        <p className="text-red-500 font-bold text-center">{error || 'Restaurant not found'}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category || 'Menu';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-grey-full-light min-h-screen pb-24 relative">

      {/* Hero image */}
      <div className="relative h-64 md:h-80 lg:h-[400px] w-full rounded-b-3xl -mt-6 overflow-hidden">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blackc/80 via-blackc/20 to-transparent"></div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {/* Restaurant info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 leading-tight">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
              <img src="/Icons/star-Filled.png" alt="rating" className="w-3.5 h-3.5" onError={(e) => e.target.style.display='none'} />
              {restaurant.rating || '4.8'}
            </span>
            <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {restaurant.delivery_time || '30-40 min'}
            </span>
            <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
              🚚 ${parseFloat(restaurant.delivery_fee || 3).toFixed(2)} delivery
            </span>
          </div>
          {restaurant.description && (
            <p className="text-white/75 text-xs mt-2 line-clamp-2">{restaurant.description}</p>
          )}
        </div>
      </div>

      {/* Menu panel */}
      <div className="px-4 py-6 bg-white rounded-t-3xl -mt-6 relative z-10 min-h-[50vh]">

        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-grey-light border border-grey-light-dark rounded-2xl py-3.5 pl-12 pr-4 text-sm text-blackc outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Menu items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No items match "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="text-primary text-sm font-bold mt-2 hover:underline">Clear search</button>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="font-bold text-base text-blackc mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full inline-block"></span>
                {category}
                <span className="text-xs text-gray-400 font-normal">({items.length})</span>
              </h3>

              <div className="space-y-1">
                {items.map((item) => {
                  const qty = getCartQty(item.id);
                  const justAdded = addedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center group cursor-pointer hover:bg-grey-light p-2.5 rounded-xl transition-all -mx-2 ${justAdded ? 'bg-primary/5' : ''}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {/* Image */}
                      <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-grey-light shadow-sm relative border border-grey-light-dark">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🍽️</div>'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🍽️</div>
                        )}
                        {qty > 0 && (
                          <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
                            <span className="text-white font-extrabold text-lg">{qty}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-3 flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-blackc text-sm mb-0.5 line-clamp-1">{item.name}</h4>
                        <p className="text-gray-400 text-xs line-clamp-2">{item.description || 'Tap to add to cart'}</p>
                      </div>

                      {/* Price + add button */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="font-extrabold text-blackc text-sm">${parseFloat(item.price).toFixed(2)}</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm transition-all text-sm font-bold ${justAdded ? 'bg-green-500 scale-110' : 'bg-primary group-hover:bg-hover'}`}>
                          {justAdded ? '✓' : '+'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating cart button if items in cart */}
      {cart.filter((c) => c.restaurant_id === restaurant?.id).length > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-4 right-4 max-w-sm mx-auto z-30">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-primary hover:bg-hover text-white font-bold px-5 py-3.5 rounded-2xl shadow-xl shadow-primary/40 transition-all active:scale-95"
          >
            <span className="bg-white/20 rounded-lg px-2 py-0.5 text-sm font-extrabold">
              {cart.filter((c) => c.restaurant_id === restaurant?.id).reduce((s, c) => s + c.quantity, 0)}
            </span>
            <span>View Cart</span>
            <span className="font-extrabold">
              ${cart.filter((c) => c.restaurant_id === restaurant?.id).reduce((s, c) => s + parseFloat(c.price) * c.quantity, 0).toFixed(2)}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
