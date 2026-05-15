import React from 'react';
import { useCart } from '../context/CartContext';

const FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop&q=80';

const MenuItemCard = ({ item, restaurantId }) => {
  const { addToCart, cart } = useCart();

  const qty = cart.find(
    (c) => c.id === item.id && c.restaurant_id === restaurantId
  )?.quantity || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...item, restaurant_id: restaurantId });
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-2 shadow-sm border border-grey-light-dark">
        <img
          src={item.image_url || FALLBACK}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = FALLBACK; }}
        />

        {qty > 0 && (
          <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
            <span className="text-white font-extrabold text-2xl">{qty}</span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary shadow-md active:scale-90 transition-transform hover:bg-grey-light"
          aria-label={`Add ${item.name} to cart`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <h3 className="font-bold text-blackc text-base leading-tight mb-1 line-clamp-1">{item.name}</h3>
      {item.description && (
        <p className="text-sm text-gray-500 mb-1 line-clamp-1">{item.description}</p>
      )}
      <span className="font-bold text-blackc">${parseFloat(item.price).toFixed(2)}</span>
    </div>
  );
};

export default MenuItemCard;
