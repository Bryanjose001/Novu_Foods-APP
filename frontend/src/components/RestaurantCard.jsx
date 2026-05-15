import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80';

const getFavIds = () => {
  try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
};

const RestaurantCard = ({ restaurant }) => {
  const [isFav, setIsFav] = useState(() => getFavIds().includes(restaurant.id));

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = getFavIds();
    const updated = ids.includes(restaurant.id)
      ? ids.filter((id) => id !== restaurant.id)
      : [...ids, restaurant.id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="flex flex-col group">
      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-2 shadow-sm border border-grey-light-dark">
        <img
          src={restaurant.image_url || FALLBACK}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = FALLBACK; }}
        />

        {/* Store type badge */}
        {restaurant.store_type && restaurant.store_type !== 'restaurant' && (
          <div className="absolute top-2 left-2 bg-white/90 text-blackc text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
            {restaurant.store_type}
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-white/90 text-blackc text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {parseFloat(restaurant.rating || 4.5).toFixed(1)}
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill={isFav ? '#ef4444' : 'none'}
            stroke={isFav ? '#ef4444' : '#9ca3af'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <div className="px-0.5">
        <h3 className="font-bold text-blackc text-sm leading-tight mb-0.5 line-clamp-1">{restaurant.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-1 mb-1">
          {restaurant.description || restaurant.cuisine_type || 'Delicious meals awaiting you'}
        </p>
        <div className="flex items-center gap-2.5 text-[11px] text-gray-500 flex-wrap">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span className="font-semibold text-blackc">${parseFloat(restaurant.delivery_fee || 3).toFixed(2)}</span>
          </span>
          <span className="text-grey-light-dark">·</span>
          <span>{restaurant.delivery_time || '30-40 min'}</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
