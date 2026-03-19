import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CartContext', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        window.localStorage.clear();
    });

    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

    it('initializes with an empty cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.cart).toEqual([]);
        expect(result.current.getCartTotal()).toBe(0);
        expect(result.current.getCartCount()).toBe(0);
    });

    it('adds an item to the cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const item = { id: 1, name: 'Burger', price: 10, restaurant_id: 1 };

        act(() => {
            result.current.addToCart(item);
        });

        expect(result.current.cart.length).toBe(1);
        expect(result.current.cart[0].name).toBe('Burger');
        expect(result.current.cart[0].quantity).toBe(1);
        expect(result.current.getCartTotal()).toBe(10);
        expect(result.current.getCartCount()).toBe(1);
    });

    it('increases quantity when adding the same item again', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const item = { id: 1, name: 'Burger', price: 10, restaurant_id: 1 };

        act(() => {
            result.current.addToCart(item);
            result.current.addToCart(item);
        });

        expect(result.current.cart.length).toBe(1);
        expect(result.current.cart[0].quantity).toBe(2);
        expect(result.current.getCartTotal()).toBe(20);
        expect(result.current.getCartCount()).toBe(2);
    });

    it('removes an item from the cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const item = { id: 1, name: 'Burger', price: 10, restaurant_id: 1 };

        act(() => {
            result.current.addToCart(item);
        });

        act(() => {
            result.current.removeFromCart(item.id, item.restaurant_id);
        });

        expect(result.current.cart.length).toBe(0);
    });

    it('updates item quantity', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const item = { id: 1, name: 'Burger', price: 10, restaurant_id: 1 };

        act(() => {
            result.current.addToCart(item);
        });

        act(() => {
            result.current.updateQuantity(item.id, item.restaurant_id, 5);
        });

        expect(result.current.cart[0].quantity).toBe(5);
        expect(result.current.getCartTotal()).toBe(50);
    });

    it('clears the cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const item1 = { id: 1, name: 'Burger', price: 10, restaurant_id: 1 };
        const item2 = { id: 2, name: 'Fries', price: 5, restaurant_id: 1 };

        act(() => {
            result.current.addToCart(item1);
            result.current.addToCart(item2);
        });

        expect(result.current.cart.length).toBe(2);

        act(() => {
            result.current.clearCart();
        });

        expect(result.current.cart.length).toBe(0);
        expect(result.current.getCartTotal()).toBe(0);
    });
});
