import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { useCart } from '../context/CartContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantService.getById(id),
        restaurantService.getMenu(id)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-grey-full-light">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🍽️</div>
          <p className="text-gray-500 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-grey-full-light">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">{error || 'Restaurant not found'}</p>
          <Link to="/" className="text-primary font-bold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-grey-full-light min-h-screen pb-24 relative">
      
      <div className="relative h-64 md:h-80 lg:h-[400px] w-full">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400?text=Restaurant';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blackc/80 via-transparent to-transparent"></div>

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
          <Link to="/" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-white">{restaurant.name}</h1>
            <div className="flex items-center space-x-3 text-sm font-medium opacity-90">
              <span className="flex items-center"><span className="text-yellow-400 mr-1">⭐</span> {restaurant.rating || '4.8'}</span>
              <span>•</span>
              <span>{restaurant.delivery_time || '30-40 min'}</span>
              <span>•</span>
              <span>Delivery: ${restaurant.delivery_fee}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
            <span>🏆</span> <span>Top Restaurant</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 bg-white rounded-t-3xl -mt-6 relative z-10 min-h-[50vh]">
        
        <div className="md:hidden flex items-center space-x-2 mb-6">
          <span className="text-primary text-xl">🎖️</span>
          <span className="text-gray-600 font-medium text-sm">Top Restaurants</span>
        </div>

        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-grey-light border border-grey-light-dark rounded-2xl py-3.5 pl-12 pr-4 text-sm text-blackc outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-xl text-blackc mb-4">Menu</h3>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No items found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="flex items-center group cursor-pointer hover:bg-grey-light p-2 rounded-xl transition-colors -mx-2" onClick={() => addToCart(item, restaurant.id)}>
                
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-grey-light shadow-sm relative border border-grey-light-dark">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
                  )}
                  <button className="absolute bottom-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-primary shadow-sm md:hidden">
                    <span className="text-lg leading-none">+</span>
                  </button>
                </div>

                <div className="flex-1 px-4 flex flex-col justify-center">
                  <h4 className="font-bold text-blackc text-base mb-0.5">{item.name}</h4>
                  <p className="text-gray-400 text-xs line-clamp-1">{item.description || 'Delicious meal item'}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-bold text-blackc text-lg">${parseFloat(item.price).toFixed(2)}</span>
                  <span className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
