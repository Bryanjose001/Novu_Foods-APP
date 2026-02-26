const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');

    try {
      await pool.query(`
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_name TEXT;
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_email TEXT;
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_phone TEXT;
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS address TEXT;
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description TEXT;
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'restaurant';
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10,2) DEFAULT 3.00;
        ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time TEXT DEFAULT '30-40 min';
      `);
      console.log('Database migrations completed');
    } catch (migrationErr) {
      console.error('Migration error:', migrationErr);
    }
  }
});

const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];

  if (token === 'admin123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }
};

app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ success: true, token: 'admin123' });
  } else {
    res.status(401).json({ error: 'Invalid admin password' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Food Delivery API is running' });
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM restaurants ORDER BY rating DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 AND available = true 
       ORDER BY category, name`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

app.get('/api/menu-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      items,
      totalAmount
    } = req.body;

    if (!customerName || !deliveryAddress || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, deliveryAddress, and items are required'
      });
    }

    const deliveryMinutes = Math.floor(Math.random() * 20) + 20;
    const estimatedDelivery = `${deliveryMinutes}-${deliveryMinutes + 10} min`;

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, delivery_address, total_amount, estimated_delivery, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [customerName, customerEmail, customerPhone, deliveryAddress, totalAmount, estimatedDelivery, 'preparing']
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, restaurant_id, item_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.menuItemId, item.restaurantId, item.name, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT oi.*, r.name as restaurant_name 
       FROM order_items oi
       LEFT JOIN restaurants r ON oi.restaurant_id = r.id
       WHERE oi.order_id = $1`,
      [id]
    );

    order.items = itemsResult.rows;

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['preparing', 'on_the_way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/restaurants/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const result = await pool.query(
      `SELECT * FROM restaurants 
       WHERE LOWER(name) LIKE LOWER($1) 
       OR LOWER(cuisine_type) LIKE LOWER($1)
       ORDER BY rating DESC`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
});

app.post('/api/restaurants/signup', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      cuisineType,
      ownerName,
      ownerEmail,
      ownerPhone,
      address,
      description,
      imageUrl,
      storeType,
      deliveryFee,
      deliveryTime
    } = req.body;

    if (!name || !ownerName || !ownerEmail || !address) {
      return res.status(400).json({
        error: 'Missing required fields: name, ownerName, ownerEmail, and address are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO restaurants (name, cuisine_type, rating, image_url, owner_name, owner_email, owner_phone, address, description, store_type, delivery_fee, delivery_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        name,
        cuisineType || 'General',
        0,
        imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        ownerName,
        ownerEmail,
        ownerPhone || null,
        address,
        description || null,
        storeType || 'restaurant',
        deliveryFee || 3.00,
        deliveryTime || '30-40 min'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error signing up restaurant:', error);
    res.status(500).json({ error: 'Failed to sign up restaurant' });
  }
});

app.put('/api/restaurants/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      cuisineType,
      ownerName,
      ownerEmail,
      ownerPhone,
      address,
      description,
      imageUrl,
      storeType,
      deliveryFee,
      deliveryTime,
      rating
    } = req.body;

    const result = await pool.query(
      `UPDATE restaurants SET
        name = COALESCE($1, name),
        cuisine_type = COALESCE($2, cuisine_type),
        owner_name = COALESCE($3, owner_name),
        owner_email = COALESCE($4, owner_email),
        owner_phone = COALESCE($5, owner_phone),
        address = COALESCE($6, address),
        description = COALESCE($7, description),
        image_url = COALESCE($8, image_url),
        store_type = COALESCE($9, store_type),
        delivery_fee = COALESCE($10, delivery_fee),
        delivery_time = COALESCE($11, delivery_time),
        rating = COALESCE($12, rating)
      WHERE id = $13
      RETURNING *`,
      [name, cuisineType, ownerName, ownerEmail, ownerPhone, address, description, imageUrl, storeType, deliveryFee, deliveryTime, rating, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

app.delete('/api/restaurants/:id', requireAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;

    await client.query('DELETE FROM menu_items WHERE restaurant_id = $1', [id]);

    const result = await client.query(
      'DELETE FROM restaurants WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Store not found' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Store deleted successfully', store: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'Failed to delete store' });
  } finally {
    client.release();
  }
});

app.post('/api/menu-items', requireAdmin, async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      description,
      price,
      category,
      imageUrl
    } = req.body;

    if (!restaurantId || !name || !price) {
      return res.status(400).json({
        error: 'Missing required fields: restaurantId, name, and price are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url, available)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [restaurantId, name, description || null, price, category || 'General', imageUrl || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

app.delete('/api/menu-items/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully', item: result.rows[0] });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;
