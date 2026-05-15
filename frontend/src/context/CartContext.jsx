import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      localStorage.removeItem('cart');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, restaurantId) => {
    const enriched = restaurantId
      ? { ...item, restaurant_id: restaurantId }
      : item;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === enriched.id && cartItem.restaurant_id === enriched.restaurant_id
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === enriched.id && cartItem.restaurant_id === enriched.restaurant_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...enriched, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId, restaurantId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === itemId && item.restaurant_id === restaurantId)
      )
    );
  };

  const updateQuantity = (itemId, restaurantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, restaurantId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.restaurant_id === restaurantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getRestaurantItems = () => {
    const restaurantMap = {};
    cart.forEach((item) => {
      const restId = item.restaurant_id;
      if (!restaurantMap[restId]) {
        restaurantMap[restId] = [];
      }
      restaurantMap[restId].push(item);
    });
    return restaurantMap;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getRestaurantItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
