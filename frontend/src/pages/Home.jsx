import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  const mainSections = [
    {
      id: 1, name: 'Restaurants', icon: '🍔', slug: 'restaurants',
      description: 'Order from your favorite places',
      image: '/images/category-restaurants.png',
      fallbackImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop&q=80',
      overlayColor: 'from-orange-900/70 via-orange-800/40 to-transparent',
      accentColor: 'bg-orange-500',
    },
    {
      id: 2, name: 'Groceries', icon: '🛒', slug: 'groceries',
      description: 'Fresh produce & essentials',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
      overlayColor: 'from-green-900/70 via-green-800/40 to-transparent',
      accentColor: 'bg-green-500',
    },
    {
      id: 3, name: 'Pharmacy', icon: '💊', slug: 'pharmacy',
      description: 'Health, beauty & wellness',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop&q=80',
      overlayColor: 'from-blue-900/70 via-blue-800/40 to-transparent',
      accentColor: 'bg-blue-500',
    },
  ];

  const promoCategories = [
    { id: 1, name: 'Brunch', places: '94 places', image: '/images/promo-brunch.png', fallback: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=200&h=200&fit=crop&q=80', bgColor: 'bg-amber-50' },
    { id: 2, name: 'Sea food', places: '43 places', image: '/images/promo-seafood.png', fallback: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&h=200&fit=crop&q=80', bgColor: 'bg-emerald-50' },
    { id: 3, name: 'Desserts', places: '38 places', image: '/images/promo-desserts.png', fallback: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop&q=80', bgColor: 'bg-pink-50' },
    { id: 4, name: 'Salads', places: '52 places', image: '/images/promo-salad.png', fallback: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=80', bgColor: 'bg-lime-50' },
  ];

  const cuisineCategories = [
    { id: 1, name: 'American', emoji: '🍟' },
    { id: 2, name: 'Burgers', emoji: '🍔' },
    { id: 3, name: 'Breakfast', emoji: '🥞' },
    { id: 4, name: 'Pizza', emoji: '🍕' },
    { id: 5, name: 'Sushi', emoji: '🍣' },
    { id: 6, name: 'Mexican', emoji: '🌮' },
    { id: 7, name: 'Chinese', emoji: '🥡' },
    { id: 8, name: 'Indian', emoji: '🍛' },
  ];

  const superCategories = [
    { id: 1, name: 'Fresh Fruits & Vegetable', emoji: '🥬' },
    { id: 2, name: 'Cooking Oil & Ghee', emoji: '🫒' },
    { id: 3, name: 'Meat & Fish', emoji: '🥩' },
    { id: 4, name: 'Bakery & Snacks', emoji: '🍞' },
    { id: 5, name: 'Dairy & Eggs', emoji: '🥛' },
    { id: 6, name: 'Beverages', emoji: '🥤' },
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantService.getAll();
      setRestaurants(response.data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grey-full-light min-h-screen pb-20 md:pb-8">
      
      {showBanner && (
        <div className="mx-4 mt-4 mb-2 relative">
          <div className="gradient-primary rounded-2xl p-6 md:p-8 text-white relative overflow-hidden min-h-[160px]">
            
            <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5">
              <img
                src="/images/banner-food.png"
                alt="Delicious food"
                className="w-full h-full object-cover object-center opacity-90"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/60 to-transparent"></div>
            </div>

            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white/80 text-xs hover:bg-white/30 transition-colors z-20"
            >
              ✕
            </button>

            <h2 className="text-xl md:text-2xl font-extrabold mb-1 relative z-10">
              Get your 30% daily
            </h2>
            <h2 className="text-xl md:text-2xl font-extrabold mb-4 relative z-10">
              discount now!
            </h2>
            <Link
              to="/category/restaurants"
              className="inline-block bg-blackc text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors active:scale-95 relative z-10"
            >
              Order now
            </Link>
          </div>
        </div>
      )}

      <div className="md:hidden mx-4 mt-3 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for dishes, restaurants..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none text-gray-700 bg-white shadow-sm border border-grey-light-dark focus:ring-2 focus:ring-primary/30 placeholder:text-gray-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex space-x-5 overflow-x-auto no-scrollbar py-2">
          {cuisineCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/restaurants`}
              className="flex flex-col items-center space-y-2 flex-shrink-0 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-grey-light rounded-full flex items-center justify-center text-2xl md:text-3xl group-hover:bg-primary-light/30 transition-colors group-active:scale-90">
                {cat.emoji}
              </div>
              <span className="text-xs font-medium text-gray-600 text-center whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blackc">Top Restaurant</h2>
          <Link to="/category/restaurants" className="text-sm font-semibold text-primary hover:text-hover transition-colors">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-44 flex-shrink-0 animate-pulse">
                <div className="h-28 bg-grey-light-dark rounded-2xl mb-2"></div>
                <div className="h-3 bg-grey-light-dark rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-grey-light-dark rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="w-44 md:w-52 flex-shrink-0">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-blackc mb-3">What are you looking for?</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {mainSections.map((section) => (
            <Link
              key={section.id}
              to={`/category/${section.slug}`}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square hover:shadow-lg transition-all active:scale-95">
                
                <img
                  src={section.image}
                  alt={section.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = section.fallbackImage;
                  }}
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t ${section.overlayColor}`}></div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-end p-3 pb-4 text-white text-center">
                  <span className="text-2xl md:text-3xl mb-1 drop-shadow-lg group-hover:scale-110 transition-transform">{section.icon}</span>
                  <span className="font-bold text-sm md:text-base leading-tight drop-shadow-lg">{section.name}</span>
                  <span className="text-[9px] md:text-xs opacity-90 mt-0.5 hidden md:block drop-shadow-md">{section.description}</span>
                </div>
                
                <div className={`absolute top-2 right-2 w-2.5 h-2.5 ${section.accentColor} rounded-full shadow-sm`}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blackc flex items-center">
            <span className="mr-2">🛒</span> Super
          </h2>
          <Link to="/category/groceries" className="text-sm font-semibold text-primary hover:text-hover transition-colors">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {superCategories.map((cat) => (
            <Link
              key={cat.id}
              to="/category/groceries"
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-grey-light rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-1.5 group-hover:bg-primary-light/20 transition-colors border border-grey-light-dark group-active:scale-90">
                {cat.emoji}
              </div>
              <span className="text-[10px] md:text-xs font-medium text-gray-600 text-center leading-tight line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blackc flex items-center">
            <span className="mr-2">🎉</span> Promotions
          </h2>
          <Link to="/category/restaurants" className="text-sm font-semibold text-primary hover:text-hover transition-colors">
            See all
          </Link>
        </div>

        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
          {promoCategories.map((promo) => (
            <Link
              key={promo.id}
              to="/category/restaurants"
              className="w-28 md:w-36 flex-shrink-0 group"
            >
              <div className={`relative h-28 md:h-36 rounded-2xl overflow-hidden mb-1.5 shadow-sm ${promo.bgColor}`}>
                <img
                  src={promo.image}
                  alt={promo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = promo.fallback;
                  }}
                />
                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  40%
                </div>
              </div>
              <span className="text-xs font-semibold text-blackc line-clamp-1">{promo.name}</span>
              <span className="text-[10px] text-gray-400">{promo.places}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
