import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../services/api';

const C = '#789070';
const GroceryIcons = {
    fruits: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M20 8c-1 0-2 .4-2.8 1C15.5 7.4 13 7 11 8.5c-3 2-3.5 6-1.5 9 1 1.5 2.5 3 4.5 4.5.5.4 1 .8 1.5 1.2V26h2v-2.8c.5-.4 1-.8 1.5-1.2 2-1.5 3.5-3 4.5-4.5 2-3 1.5-7-1.5-9C21.5 8 20.8 8 20 8z" fill={C}/>
            <path d="M20 5c0 0 1-2.5 3-3" stroke={C} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    oil: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <rect x="15" y="6" width="10" height="4" rx="2" fill={C}/>
            <path d="M14 10h12l2 4v14a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V14l2-4z" fill={C} opacity=".8"/>
            <rect x="17" y="16" width="6" height="8" rx="1" fill="white" opacity=".4"/>
            <circle cx="27" cy="11" r="2" fill={C}/>
            <path d="M27 9v-3" stroke={C} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    meat: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M28 12a6 6 0 0 0-8.5 0L10 21.5a6 6 0 1 0 8.5 8.5L28 20.5a6 6 0 0 0 0-8.5z" fill={C} opacity=".85"/>
            <circle cx="27" cy="13" r="3" fill={C}/>
            <path d="M14 18l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        </svg>
    ),
    bakery: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M8 22c0-6 3-10 12-10s12 4 12 10v2a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-2z" fill={C}/>
            <path d="M13 15c0-2 1.5-3.5 7-3.5S27 13 27 15" stroke={C} strokeWidth="2" fill="none" opacity=".5"/>
            <path d="M12 27h16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
            <path d="M15 22h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
        </svg>
    ),
    dairy: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M14 8h12l2 6v16a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V14l2-6z" fill={C} opacity=".85"/>
            <rect x="12" y="8" width="16" height="4" rx="2" fill={C}/>
            <path d="M16 18c0 0 2-2 4 0s4 0 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".6"/>
            <rect x="17" y="22" width="6" height="5" rx="1" fill="white" opacity=".35"/>
        </svg>
    ),
    beverages: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M13 11h14l-2 18a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2L13 11z" fill={C} opacity=".85"/>
            <rect x="12" y="8" width="16" height="4" rx="2" fill={C}/>
            <path d="M27 13h4l-1 8h-3" stroke={C} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            <path d="M17 18c2-1 4-1 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        </svg>
    ),
    pharmacy: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <rect x="10" y="10" width="20" height="20" rx="4" fill={C} opacity=".85"/>
            <path d="M20 15v10M15 20h10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    ),
    cbd: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M20 6l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill={C} opacity=".85"/>
        </svg>
    ),
    tech: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <rect x="8" y="10" width="24" height="16" rx="3" fill={C} opacity=".85"/>
            <rect x="15" y="26" width="10" height="3" fill={C} opacity=".6"/>
            <rect x="12" y="29" width="16" height="2" rx="1" fill={C} opacity=".5"/>
            <rect x="11" y="13" width="18" height="10" rx="1" fill="white" opacity=".25"/>
        </svg>
    ),
    beauty: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <path d="M20 7c-2 0-4 1.5-4 4 0 1.5.8 3 2 4l2 2 2-2c1.2-1 2-2.5 2-4 0-2.5-2-4-4-4z" fill={C}/>
            <rect x="16" y="18" width="8" height="14" rx="3" fill={C} opacity=".85"/>
            <path d="M17 22h6M17 26h6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity=".5"/>
        </svg>
    ),
};

const CategoryPage = () => {
    const { slug } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubcategory, setSelectedSubcategory] = useState('All');

    const categoryConfig = {
        restaurants: {
            title: 'Restaurants',
            bannerImage: '/images/Image (1).png',
            bannerFallback: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=300&fit=crop&q=80',
            subcategories: [
                { name: 'All', image: '/cuisings/Frame%20(2).png' },
                { name: 'Fast Foods', image: '/cuisings/Frame.png' },
                { name: 'Burgers', image: '/cuisings/Frame%20(3).png' },
                { name: 'Breakfast', image: '/cuisings/Frame%20(1).png' },
                { name: 'American', image: '/cuisings/Frame.png' },
            ]
        },
        groceries: {
            title: 'Groceries',
            bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=300&fit=crop&q=80',
            bannerFallback: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=300&fit=crop&q=80',
            subcategories: [
                { name: 'Fresh Fruits & Vegetable', icon: GroceryIcons.fruits },
                { name: 'Cooking Oil & Ghee', icon: GroceryIcons.oil },
                { name: 'Meat & Fish', icon: GroceryIcons.meat },
                { name: 'Bakery & Snacks', icon: GroceryIcons.bakery },
                { name: 'Dairy & Eggs', icon: GroceryIcons.dairy },
                { name: 'Beverages', icon: GroceryIcons.beverages },
            ]
        },
        pharmacy: {
            title: 'Pharmacy & Beauty',
            bannerImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=300&fit=crop&q=80',
            bannerFallback: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=300&fit=crop&q=80',
            subcategories: [
                { name: 'All', icon: GroceryIcons.pharmacy },
                { name: 'Pharmacy', icon: GroceryIcons.pharmacy },
                { name: 'CBD', icon: GroceryIcons.cbd },
                { name: 'Technologies', icon: GroceryIcons.tech },
                { name: 'Beauty', icon: GroceryIcons.beauty },
            ]
        }
    };

    const config = categoryConfig[slug] || {
        title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category',
        subcategories: []
    };

    useEffect(() => {
        fetchRestaurants();
        setSelectedSubcategory('All');
    }, [slug]);

    const filteredBySubcategory = selectedSubcategory === 'All'
        ? restaurants
        : restaurants.filter(r => {
            if (!r.cuisine_type) return false;
            return r.cuisine_type.split(',').map(s => s.trim().toLowerCase()).includes(selectedSubcategory.toLowerCase());
        });

    const slugToStoreType = {
        restaurants: 'restaurant',
        groceries: 'grocery',
        pharmacy: 'pharmacy',
    };

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await restaurantService.getAll();
            const storeType = slugToStoreType[slug];
            const filtered = storeType
                ? response.data.filter(r => (r.store_type || 'restaurant') === storeType)
                : response.data;
            setRestaurants(filtered);
        } catch (err) {
            console.error('Error fetching category items:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-grey-full-light pb-24">
            {config.bannerImage && (
                <div className="relative h-40 md:h-56 w-full overflow-hidden">
                    <img
                        src={config.bannerImage}
                        alt={config.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            if (config.bannerFallback) e.target.src = config.bannerFallback;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-grey-full-light via-transparent to-black/20"></div>
                </div>
            )}

            <div className={`p-4 ${config.bannerImage ? '-mt-8 relative z-10' : ''}`}>
                <div className="flex items-center space-x-3 mb-5">
                    <Link to="/" className="w-9 h-9 bg-white border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light-dark transition-colors shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </Link>

                    <h1 className="text-xl font-bold text-blackc">{config.title}</h1>

                    <div className="flex-1"></div>

                    <div className="flex space-x-2">
                        <button className="w-9 h-9 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-blackc">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </button>
                    </div>
                </div>

                {config.subcategories.length > 0 && (
                    <div className="mb-6">
                        {slug === 'groceries' ? (
                            <>
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-bold text-blackc">Shop by category</h2>
                                    <button className="text-sm font-semibold text-gray-800 px-4 py-1.5 rounded-full transition-colors" style={{ backgroundColor: '#A1EEC7' }}>See all</button>
                                </div>

                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {config.subcategories.map((sub, i) => {
                                        const isActive = selectedSubcategory === sub.name;
                                        return (
                                            <button key={i} onClick={() => setSelectedSubcategory(sub.name)} className="flex flex-col items-center group">
                                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-1.5 transition-all overflow-hidden group-active:scale-90 border ${isActive ? 'border-primary bg-primary/10' : 'bg-grey-light border-grey-light-dark group-hover:bg-primary-light/20'}`}>
                                                    {sub.icon ?? (sub.image
                                                        ? <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                                        : sub.emoji)}
                                                </div>
                                                <span className={`text-[10px] md:text-xs font-medium text-center leading-tight line-clamp-2 ${isActive ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                                    {sub.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-5 overflow-x-auto no-scrollbar py-2">
                                {config.subcategories.map((sub, i) => {
                                    const isActive = selectedSubcategory === sub.name;
                                    return (
                                        <button key={i} onClick={() => setSelectedSubcategory(sub.name)} className="flex flex-col items-center space-y-2 flex-shrink-0 group">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all group-active:scale-90"
                                                style={{ backgroundColor: isActive ? '#789070' : '#D4F0E3' }}>
                                                {sub.icon ?? (sub.image
                                                    ? <img src={sub.image} alt={sub.name} className={`w-8 h-8 md:w-9 md:h-9 object-contain ${isActive ? 'brightness-0 invert' : ''}`} />
                                                    : sub.emoji)}
                                            </div>
                                            <span className={`text-xs font-medium text-center whitespace-nowrap ${isActive ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                                {sub.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-blackc">Top</h2>
                    <button className="text-sm font-semibold text-gray-800 px-4 py-1.5 rounded-full transition-colors" style={{ backgroundColor: '#A1EEC7' }}>See all</button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 bg-grey-light-dark rounded-2xl mb-2"></div>
                                <div className="h-3 bg-grey-light-dark rounded w-3/4 mb-1"></div>
                                <div className="h-2 bg-grey-light-dark rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 mb-4">
                            {filteredBySubcategory.slice(0, 4).map((restaurant) => (
                                <Link
                                    key={restaurant.id}
                                    to={`/restaurant/${restaurant.id}`}
                                    className="w-44 md:w-52 flex-shrink-0 group bg-white rounded-2xl shadow-sm border border-grey-light-dark overflow-hidden hover:shadow-md transition-all"
                                >
                                    <div className="relative h-28 md:h-32 w-full overflow-hidden">
                                        <img
                                            src={restaurant.image_url}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Store';
                                            }}
                                        />
                                        <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
                                            <img src="/Icons/Icon.png" alt="" className="w-3 h-3" />
                                            <span>$3.00 off delivery</span>
                                        </div>
                                    </div>
                                    <div className="p-2.5">
                                        <h3 className="font-bold text-blackc text-sm leading-tight mb-0.5 line-clamp-1">{restaurant.name}</h3>
                                        <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">{restaurant.description || 'Fresh and tasty f...'}</p>
                                        <div className="flex items-center space-x-2 text-[11px] text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <img src="/Icons/Icon.png" alt="delivery" className="w-3.5 h-3.5" />
                                                <span className="font-semibold text-blackc">${restaurant.delivery_fee || '3.00'}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <img src="/Icons/timer.png" alt="time" className="w-3.5 h-3.5" />
                                                <span>{restaurant.delivery_time || '40-50min'}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <img src="/Icons/star-Filled.png" alt="rating" className="w-3 h-3" />
                                                <span>{restaurant.rating || '9.5'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-blackc flex items-center">
                                <span className="mr-2"></span> Promotions
                            </h2>
                            <button className="text-sm font-semibold text-gray-800 px-4 py-1.5 rounded-full transition-colors" style={{ backgroundColor: '#A1EEC7' }}>See all</button>
                        </div>

                        <div className="space-y-4">
                            {filteredBySubcategory.slice(0, 6).map((restaurant) => (
                                <Link
                                    key={`list-${restaurant.id}`}
                                    to={`/restaurant/${restaurant.id}`}
                                    className="flex items-center group bg-white p-3 rounded-2xl shadow-sm border border-grey-light-dark hover:shadow-md transition-all"
                                >
                                    <div className="w-24 h-20 md:w-28 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-grey-light relative">
                                        <img
                                            src={restaurant.image_url}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/200x150?text=Store';
                                            }}
                                        />
                                        <div className="absolute bottom-1 right-1 flex items-center space-x-0.5 bg-primary text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                                            <img src="/Icons/Icon.png" alt="" className="w-2.5 h-2.5" />
                                            <span>$3.00 off</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 pl-3">
                                        <h3 className="font-bold text-blackc text-base mb-0.5 line-clamp-1">{restaurant.name}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                                            {restaurant.description || 'Delicious meals, appetizing snacks, fr...'}
                                        </p>
                                        <div className="flex items-center space-x-2 text-[11px] text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <img src="/Icons/Icon.png" alt="delivery" className="w-3.5 h-3.5" />
                                                <span className="font-semibold text-blackc">${restaurant.delivery_fee || '3.00'}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <img src="/Icons/timer.png" alt="time" className="w-3.5 h-3.5" />
                                                <span>{restaurant.delivery_time || '40-50min'}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <img src="/Icons/star-Filled.png" alt="rating" className="w-3 h-3" />
                                                <span>{restaurant.rating || '9.5'}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-gray-300 ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )
                }
            </div >
        </div >
    );
};

export default CategoryPage;