import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
    const location = useLocation();
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        {
            path: '/',
            label: 'Home',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        {
            path: '/favorites',
            label: 'Favorites',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
            )
        },
        {
            path: '/cart',
            label: 'Cart',
            icon: (active) => (
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </div>
            )
        },
        {
            path: '/profile',
            label: 'Profile',
            icon: (active) => (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        }
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <div className="bg-blackc rounded-2xl py-3 px-4 flex justify-around items-center shadow-xl max-w-md mx-auto">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path === '/favorites' || item.path === '/profile' ? '/' : item.path}
                            className={`flex flex-col items-center justify-center space-y-0.5 transition-colors ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {item.icon(active)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
