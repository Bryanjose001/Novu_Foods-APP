const { pool } = require('../config/db')

const getAll = () =>
  pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50')

const getById = async (id) => {
  const orderResult = await pool.query(
    'SELECT * FROM orders WHERE id = $1', [id]
  )
  if (orderResult.rows.length === 0) return null

  const order = orderResult.rows[0]
  const itemsResult = await pool.query(
    `SELECT oi.*, r.name AS restaurant_name
     FROM order_items oi
     LEFT JOIN restaurants r ON oi.restaurant_id = r.id
     WHERE oi.order_id = $1`,
    [id]
  )
  order.items = itemsResult.rows
  return order
}

const create = async ({ customerName, customerEmail, customerPhone, deliveryAddress, items, totalAmount }) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const deliveryMinutes = Math.floor(Math.random() * 20) + 20
    const estimatedDelivery = `${deliveryMinutes}-${deliveryMinutes + 10} min`

    const orderResult = await client.query(
      `INSERT INTO orders
         (customer_name, customer_email, customer_phone, delivery_address,
          total_amount, estimated_delivery, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [customerName, customerEmail, customerPhone, deliveryAddress,
       totalAmount, estimatedDelivery, 'preparing']
    )
    const order = orderResult.rows[0]

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
           (order_id, menu_item_id, restaurant_id, item_name, quantity, price)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, item.menuItemId, item.restaurantId, item.name, item.quantity, item.price]
      )
    }

    await client.query('COMMIT')
    return order
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

const updateStatus = (id, status) =>
  pool.query(
    `UPDATE orders
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  )

const remove = async (id) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM order_items WHERE order_id = $1', [id])
    const result = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id])
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

module.exports = { getAll, getById, create, updateStatus, remove }
