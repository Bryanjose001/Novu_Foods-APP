# Food Delivery Application

A food delivery application built with React, Node.js, Express, and PostgreSQL.

## Project Overview

This food delivery application allows users to:
- Browse restaurants and their menus
- Add items to cart
- Place orders
- Track order status in real-time
- View order history

## Features

### Core Features
- Browse restaurants
- View restaurant menus
- Add items to cart
- Place orders
- Track order status (Preparing -> On the Way -> Delivered)
- Estimated delivery time
- Order notifications

### Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js
- Express
- PostgreSQL
- Docker

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose
- Git

## Installation & Setup

### 2. Start PostgreSQL Database
```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432.

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup database and seed data
npm run db:setup

# Start the backend server
npm run dev
```

The backend API will be running on `http://localhost:5000`

### 4. Setup Frontend

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be running on `http://localhost:3000`

## Project Structure

```
food-delivery-app/
├── backend/
│   ├── scripts/
│   │   └── setupDatabase.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   └── MenuItemCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── RestaurantDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderTracking.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── docker-compose.yml
```

## API Endpoints

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `GET /api/restaurants/search/:query` - Search restaurants

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id/status` - Update order status

### Menu Items
- `GET /api/menu-items/:id` - Get menu item by ID

## Usage Guide

### 1. Browse Restaurants
- Open the application at `http://localhost:3000`
- Browse available restaurants on the home page
- Use the search bar to find specific restaurants or cuisines

### 2. Order Food
- Click on a restaurant to view its menu
- Add items to your cart
- Click the cart icon to review your order
- Adjust quantities or remove items as needed
- Click "Proceed to Checkout"

### 3. Checkout
- Fill in your delivery information
- Review your order summary
- Click "Place Order"

### 4. Track Your Order
- After placing an order, you'll be redirected to the order tracking page
- Watch as your order progresses through:
  - Preparing
  - On the Way
  - Delivered

## Database Schema

### Restaurants Table
- id, name, description, image_url, cuisine_type, rating, delivery_time

### Menu Items Table
- id, restaurant_id, name, description, price, category, image_url, available

### Orders Table
- id, customer_name, customer_email, customer_phone, delivery_address, total_amount, status, estimated_delivery, created_at, updated_at

### Order Items Table
- id, order_id, menu_item_id, restaurant_id, item_name, quantity, price

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart PostgreSQL
docker-compose restart

# View logs
docker-compose logs postgres
```

### Port Already in Use
If port 3000 or 5000 is already in use:
- Frontend: Edit `vite.config.js` and change the port
- Backend: Edit `.env` file and change PORT value

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

This project is licensed under the MIT License.
