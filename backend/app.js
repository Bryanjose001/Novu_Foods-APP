const restaurantRoutes = require('./routes/restaurantRoutes');

app.use('/api/restaurants', restaurantRoutes);

const orderRoutes = require('./routes/orderRoutes');

app.use('/api/orders', orderRoutes);

const menuRoutes = require('./routes/menuRoutes');

app.use('/api/menu-items', menuRoutes);