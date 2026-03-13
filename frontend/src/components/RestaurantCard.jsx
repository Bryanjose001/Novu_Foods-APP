import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="flex flex-col group">
      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-2 shadow-sm border border-grey-light-dark">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Restaurant';
          }}
        />

        {restaurant.delivery_fee && (
          <div className="absolute bottom-2 right-2 bg-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
            ${restaurant.delivery_fee} off delivery
            <img src="/Icons/Icon%20(1).png" alt="discount" className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="px-0.5">
        <h3 className="font-bold text-blackc text-sm leading-tight mb-0.5 line-clamp-1">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-1 mb-1">
          {restaurant.description || 'Delicious meals, appetizing snacks, fr...'}
        </p>
        <div className="flex items-center space-x-3 text-[11px] text-gray-500">
          <span className="flex items-center space-x-1">
            <img src="/Icons/Icon.png" alt="delivery" className="w-3.5 h-3.5" />
            <span className="font-semibold text-blackc">${restaurant.delivery_fee || '3.00'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <img src="/Icons/timer.png" alt="time" className="w-3.5 h-3.5" />
            <span>{restaurant.delivery_time || '40-50min'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <img src="/Icons/star-Filled.png" alt="rating" className="w-3.5 h-3.5" />
            <span>{restaurant.rating || '9.5'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
