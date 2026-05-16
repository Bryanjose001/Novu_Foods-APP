import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const mainSections = [
    {
      id: 1, name: 'Restaurants', slug: 'restaurants',
      description: 'Order from your favorite places',
      emoji: '🍽️',
      image: '/images/Image (1).png',
      fallbackImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop&q=80',
      overlayColor: 'from-orange-900/70 via-orange-800/40 to-transparent',
    },
    {
      id: 2, name: 'Groceries', slug: 'groceries',
      description: 'Fresh produce & essentials',
      emoji: '🛒',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80',
      overlayColor: 'from-green-900/70 via-green-800/40 to-transparent',
    },
    {
      id: 3, name: 'Pharmacy', slug: 'pharmacy',
      description: 'Health, beauty & wellness',
      emoji: '💊',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop&q=80',
      overlayColor: 'from-blue-900/70 via-blue-800/40 to-transparent',
    },
  ];

  const promoCategories = [
    { id: 1, name: 'Brunch', places: '94 places', image: '/images/promo-brunch.png', fallback: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=200&h=200&fit=crop&q=80', bgColor: 'bg-amber-50' },
    { id: 2, name: 'Sea food', places: '43 places', image: '/images/promo-seafood.png', fallback: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&h=200&fit=crop&q=80', bgColor: 'bg-emerald-50' },
    { id: 3, name: 'Desserts', places: '38 places', image: '/images/promo-desserts.png', fallback: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop&q=80', bgColor: 'bg-pink-50' },
    { id: 4, name: 'Salads', places: '52 places', image: '/images/promo-salad.png', fallback: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&q=80', bgColor: 'bg-lime-50' },
  ];


useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantService.getAll();
      setRestaurants(response.data || []);
      setFetchError(false);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    searchQuery === '' ||
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8">

      {showBanner && (
        <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 mt-3 sm:mt-4 mb-2">
          <div className="relative rounded-2xl overflow-hidden min-h-[160px] sm:min-h-[180px] md:min-h-[200px]">
            {/* Background food photo */}
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=400&fit=crop&q=85"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Strong overlay so text is always readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4a5c44]/95 via-[#4a5c44]/80 to-[#4a5c44]/30"></div>

            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 w-7 h-7 bg-black/30 rounded-full flex items-center justify-center text-white/80 text-xs hover:bg-black/50 transition-colors z-20"
            >
              ✕
            </button>

            <div className="relative z-10 p-5 sm:p-6 md:p-8 flex flex-col justify-center h-full min-h-[160px] sm:min-h-[180px] max-w-xs sm:max-w-sm">
              <span className="inline-block text-[11px] font-bold bg-white/20 text-white px-3 py-1 rounded-full mb-2 w-fit tracking-wide uppercase">
                Limited offer
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-1">
                Get 30% off
              </h2>
              <p className="text-white/80 text-sm mb-4">on your first order today</p>
              <Link
                to="/category/restaurants"
                className="inline-flex items-center gap-2 bg-white text-blackc font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-grey-light transition-colors active:scale-95 w-fit shadow-md"
              >
                Order now
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile search — hidden on md+ (navbar has it) */}
      <div className="md:hidden mx-3 sm:mx-4 md:mx-6 mt-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            placeholder="Search restaurants, dishes..."
            className="w-full pl-10 pr-16 py-3 rounded-2xl text-sm outline-none text-gray-700 bg-white shadow-sm border border-grey-light-dark focus:ring-2 focus:ring-primary/30 placeholder:text-gray-400"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          {searchQuery.trim() && (
            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-xl"
            >
              Go
            </button>
          )}
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg font-bold text-blackc">Top Restaurants</h2>
          <Link to="/category/restaurants" className="text-sm font-semibold text-gray-800 px-3 sm:px-4 py-1.5 rounded-full transition-colors" style={{ backgroundColor: '#A1EEC7' }}>
            See all
          </Link>
        </div>

        {loading ? (
          <div className="flex space-x-3 sm:space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-36 sm:w-44 md:w-52 flex-shrink-0 animate-pulse">
                <div className="h-36 sm:h-40 bg-grey-light-dark rounded-2xl mb-2"></div>
                <div className="h-3 bg-grey-light-dark rounded w-3/4 mb-1.5"></div>
                <div className="h-2.5 bg-grey-light-dark rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400 mb-2">Couldn't load restaurants.</p>
            <button onClick={fetchRestaurants} className="text-xs font-bold text-primary hover:underline">Try again</button>
          </div>
        ) : (
          <>
            {/* Grid on laptop+, horizontal scroll on mobile/tablet */}
            <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredRestaurants.length > 0 ? filteredRestaurants.slice(0, 10).map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              )) : (
                <p className="text-sm text-gray-400 py-4 col-span-4">No restaurants match your search.</p>
              )}
            </div>
            <div className="lg:hidden flex space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
              {filteredRestaurants.length > 0 ? filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="w-36 sm:w-44 flex-shrink-0">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              )) : (
                <p className="text-sm text-gray-400 py-4">No restaurants match your search.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* What are you looking for */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-blackc mb-3">What are you looking for?</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {mainSections.map((section) => (
            <Link key={section.id} to={`/category/${section.slug}`} className="group">
              <div className="relative rounded-2xl overflow-hidden hover:shadow-lg transition-all active:scale-95" style={{ paddingBottom: '100%' }}>
                <img
                  src={section.image}
                  alt={section.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = section.fallbackImage; }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${section.overlayColor}`}></div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-2 sm:p-3 pb-3 sm:pb-4 text-white text-center">
                  <span className="text-xl sm:text-2xl md:text-3xl mb-0.5 sm:mb-1 drop-shadow-lg">{section.emoji}</span>
                  <span className="font-bold text-xs sm:text-sm leading-tight drop-shadow-lg">{section.name}</span>
                  <span className="text-[9px] sm:text-[10px] opacity-90 mt-0.5 hidden sm:block drop-shadow-md">{section.description}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg font-bold text-blackc">Promotions</h2>
          <Link to="/category/restaurants" className="text-sm font-semibold text-gray-800 px-3 sm:px-4 py-1.5 rounded-full transition-colors" style={{ backgroundColor: '#A1EEC7' }}>
            See all
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {promoCategories.map((promo) => (
            <Link
              key={promo.id}
              to="/category/restaurants"
              className="group"
            >
              <div className={`relative h-28 sm:h-32 md:h-36 rounded-2xl overflow-hidden mb-1.5 shadow-sm ${promo.bgColor}`}>
                <img
                  src={promo.image}
                  alt={promo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = promo.fallback; }}
                />
                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  40%
                </div>
              </div>
              <span className="text-xs font-semibold text-blackc line-clamp-1 block">{promo.name}</span>
              <span className="text-[10px] text-gray-400">{promo.places}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
