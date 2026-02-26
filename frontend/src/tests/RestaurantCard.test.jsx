import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { describe, it, expect } from 'vitest';

const mockRestaurant = {
    id: 1,
    name: 'Test Pizza Place',
    image_url: 'http://example.com/pizza.jpg',
    rating: 4.5,
    cuisine_type: 'Italian',
    delivery_time: '20-30 min'
};

describe('RestaurantCard Component', () => {
    it('renders restaurant information correctly', () => {
        render(
            <BrowserRouter>
                <RestaurantCard restaurant={mockRestaurant} />
            </BrowserRouter>
        );

        // Check name
        expect(screen.getByText('Test Pizza Place')).toBeInTheDocument();

        // Check rating (appears multiple times)
        expect(screen.getAllByText('4.5').length).toBeGreaterThan(0);


        // Check delivery time
        expect(screen.getByText('20-30 min')).toBeInTheDocument();
    });

    it('renders a fallback image if no image_url is provided', () => {
        const noImageRestaurant = { ...mockRestaurant, image_url: null };
        render(
            <BrowserRouter>
                <RestaurantCard restaurant={noImageRestaurant} />
            </BrowserRouter>
        );

        const img = screen.getByRole('img');
        fireEvent.error(img);
        expect(img).toHaveAttribute('src', 'https://via.placeholder.com/400x300?text=Restaurant');
    });
});
