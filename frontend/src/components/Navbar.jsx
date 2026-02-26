import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import novuLogo from '../assets/novu-logo.svg';

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="gradient-primary sticky top-0 z-50 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">

        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={novuLogo} alt="Novu Foods" className="w-24 h-24 rounded-lg" />
          </Link>
        </div>

        <div className="md:hidden flex-1 mx-2">
          <button className="flex items-center space-x-1 text-white/90 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span className="truncate max-w-[160px]">Home, Your Address</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>

        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants, groceries, pharmacy..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none text-gray-700 bg-white/95 shadow-sm focus:ring-2 focus:ring-white/50 placeholder:text-gray-400"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-5">
          <Link to="/" className="text-white font-medium hover:text-white/80 transition-colors text-sm">Home</Link>
          <Link to="/category/restaurants" className="text-white/80 font-medium hover:text-white transition-colors text-sm">Restaurants</Link>
          <Link to="/category/groceries" className="text-white/80 font-medium hover:text-white transition-colors text-sm">Groceries</Link>
          <Link to="/category/pharmacy" className="text-white/80 font-medium hover:text-white transition-colors text-sm">Pharmacy</Link>
          <Link to="/admin" className="text-white/80 font-medium hover:text-white transition-colors text-sm flex items-center gap-1">
            <span>⚙️</span> Admin
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          
          <Link to="/admin" className="md:hidden w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </Link>

          <Link to="/cart" className="relative w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-primary">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
