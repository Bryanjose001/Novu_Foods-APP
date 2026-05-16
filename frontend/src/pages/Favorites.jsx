import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';

const FALLBACK = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80';

const getFavoriteIds = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
};

const Favorites = () => {
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState(getFavoriteIds);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await restaurantService.getAll();
      setRestaurants(res.data || []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id) => {
    const updated = favoriteIds.filter((fid) => fid !== id);
    setFavoriteIds(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const favorites = restaurants.filter((r) => favoriteIds.includes(r.id));

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-5">

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-blackc">Favorites</h1>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-grey-light-dark animate-pulse">
                <div className="w-20 h-20 bg-grey-light-dark rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-grey-light-dark rounded w-1/2" />
                  <div className="h-3 bg-grey-light-dark rounded w-1/3" />
                  <div className="h-3 bg-grey-light-dark rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-3">Could not load favorites.</p>
            <button onClick={fetchRestaurants} className="text-sm font-bold text-primary hover:underline">Try again</button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-20 h-20 bg-grey-light rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#789070" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-blackc mb-1">No favorites yet</h2>
              <p className="text-gray-400 text-sm max-w-xs">
                Browse restaurants and tap the heart icon to save your favorites here.
              </p>
            </div>
            <Link to="/" className="btn-primary mt-2">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm text-gray-400 mb-4">{favorites.length} saved place{favorites.length !== 1 ? 's' : ''}</p>
            {favorites.map((r) => (
              <div key={r.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-grey-light-dark hover:shadow-md transition-shadow">
                <Link to={`/restaurant/${r.id}`} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-grey-light">
                  <img
                    src={r.image_url || FALLBACK}
                    alt={r.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = FALLBACK; }}
                  />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link to={`/restaurant/${r.id}`} className="font-bold text-blackc text-sm hover:text-primary transition-colors line-clamp-1">
                      {r.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.cuisine_type || r.description || 'Restaurant'}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {parseFloat(r.rating || 4.5).toFixed(1)}
                    </span>
                    <span>{r.delivery_time || '30-40 min'}</span>
                    <span>${parseFloat(r.delivery_fee || 3).toFixed(2)} delivery</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFavorite(r.id)}
                  className="flex-shrink-0 self-center w-8 h-8 flex items-center justify-center rounded-full text-red-400 hover:bg-red-50 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { getFavoriteIds };
export default Favorites;
