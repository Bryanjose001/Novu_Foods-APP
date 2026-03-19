import React from 'react';
import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item, restaurantId }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...item,
      restaurant_id: restaurantId,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-2 shadow-sm border border-grey-light-dark">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Food';
          }}
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary shadow-md active:scale-90 transition-transform hover:bg-grey-light"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      <h3 className="font-bold text-blackc text-base leading-tight mb-1">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-1 line-clamp-1">{item.description}</p>
      <div className="flex items-center space-x-2">
        <span className="font-bold text-blackc">${parseFloat(item.price).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MenuItemCard;
