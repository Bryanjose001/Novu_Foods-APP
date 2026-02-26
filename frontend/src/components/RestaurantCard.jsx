import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="flex flex-col group">
      <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-2 shadow-sm border border-grey-light-dark">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Restaurant';
          }}
        />
        
        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
          €3.00 off delivery
        </div>
        
        <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded-md flex items-center space-x-1 shadow-sm">
          <span className="text-[10px]">⭐</span>
          <span className="font-bold text-[10px] text-blackc">{restaurant.rating}</span>
        </div>
      </div>

      <div className="px-0.5">
        <h3 className="font-bold text-blackc text-sm leading-tight mb-0.5 line-clamp-1">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1 mb-1">
          {restaurant.description || 'Delicious meals, appetizing snacks, fr...'}
        </p>
        <div className="flex items-center space-x-2 text-[11px] text-gray-500">
          <span className="flex items-center space-x-0.5">
            <span>🏷️</span>
            <span className="font-semibold text-blackc">€{restaurant.delivery_fee || '3.00'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-0.5">
            <span>🕐</span>
            <span>{restaurant.delivery_time || '40-50min'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-0.5">
            <span>⭐</span>
            <span>{restaurant.rating || '9.5'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
