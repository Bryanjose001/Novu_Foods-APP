import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../services/api';

const CategoryPage = () => {
    const { slug } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryConfig = {
        restaurants: {
            title: 'Restaurants',
            bannerImage: '/images/category-restaurants.png',
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
                { name: 'Fresh Fruits & Vegetable' },
                { name: 'Cooking Oil & Ghee' },
                { name: 'Meat & Fish' },
                { name: 'Bakery & Snacks' },
                { name: 'Dairy & Eggs' },
                { name: 'Beverages' },
                { name: 'Meat & Fish' },
                { name: 'Fresh Fruits & Vegetable' },
            ]
        },
        pharmacy: {
            title: 'Pharmacy & Beauty',
            bannerImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=300&fit=crop&q=80',
            bannerFallback: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=300&fit=crop&q=80',
            subcategories: [
                { name: 'Pharmacy' },
                { name: 'CBD' },
                { name: 'Technologies' },
                { name: 'Beauty' },
            ]
        }
    };

    const config = categoryConfig[slug] || {
        title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Category',
        subcategories: []
    };

    useEffect(() => {
        fetchRestaurants();
    }, [slug]);

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
                                    {config.subcategories.map((sub, i) => (
                                        <button key={i} className="flex flex-col items-center group">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-grey-light border border-grey-light-dark rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-1.5 group-hover:bg-primary-light/20 transition-colors group-active:scale-90">
                                                {sub.emoji}
                                            </div>
                                            <span className="text-[10px] md:text-xs font-medium text-gray-600 text-center leading-tight line-clamp-2">
                                                {sub.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-5 overflow-x-auto no-scrollbar py-2">
                                {config.subcategories.map((sub, i) => (
                                    <button key={i} className="flex flex-col items-center space-y-2 flex-shrink-0 group">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center group-hover:opacity-90 transition-opacity group-active:scale-90" style={{ backgroundColor: '#D4F0E3' }}>
                                            {sub.image
                                                ? <img src={sub.image} alt={sub.name} className="w-8 h-8 md:w-9 md:h-9 object-contain" />
                                                : sub.emoji}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 text-center whitespace-nowrap">
                                            {sub.name}
                                        </span>
                                    </button>
                                ))}
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
                            {restaurants.slice(0, 4).map((restaurant) => (
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
                                                <img src="/Icons/Icon%20(1).png" alt="delivery" className="w-3.5 h-3.5" />
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
                            {restaurants.slice(0, 6).map((restaurant) => (
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
                                                <img src="/Icons/Icon%20(1).png" alt="delivery" className="w-3.5 h-3.5" />
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