const pool = require('../config/db');

// CREATE ORDER (with transaction)
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      items,
      totalAmount,
    } = req.body;

    if (!customerName || !deliveryAddress || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const deliveryMinutes = Math.floor(Math.random() * 20) + 20;
    const estimatedDelivery = `${deliveryMinutes}-${deliveryMinutes + 10} min`;

    const orderResult = await client.query(
      `INSERT INTO orders 
      (customer_name, customer_email, customer_phone, delivery_address, total_amount, estimated_delivery, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        totalAmount,
        estimatedDelivery,
        'preparing',
      ]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items 
        (order_id, menu_item_id, restaurant_id, item_name, quantity, price)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          order.id,
          item.menuItemId,
          item.restaurantId,
          item.name,
          item.quantity,
          item.price,
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
};

// GET ONE ORDER
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (!orderResult.rows.length) {
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
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50'
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// UPDATE STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'preparing',
      'on_the_way',
      'delivered',
      'cancelled',
    ];

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

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};