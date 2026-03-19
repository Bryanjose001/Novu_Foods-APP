import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ name, icon, slug }) => {
    return (
        <Link to={`/category/${slug}`} className="flex flex-col items-center space-y-2 group flex-shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-grey-light border border-grey-light-dark rounded-full flex items-center justify-center text-2xl md:text-3xl group-hover:bg-primary-light/20 group-hover:border-primary-light transition-all group-active:scale-90 shadow-sm">
                {icon}
            </div>
            <span className="font-medium text-gray-700 text-xs text-center leading-tight max-w-[72px]">
                {name}
            </span>
        </Link>
    );
};

export default CategoryCard;
