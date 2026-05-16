const Order = require('../models/orderModel')

const VALID_STATUSES = ['preparing', 'on_the_way', 'delivered', 'cancelled']

const getAll = async (req, res) => {
  try {
    const result = await Order.getAll()
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching orders:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

const getById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json(order)
  } catch (err) {
    console.error('Error fetching order:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

const create = async (req, res) => {
  const { customerName, deliveryAddress, items } = req.body

  if (!customerName || !deliveryAddress || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: 'Missing required fields: customerName, deliveryAddress, and items are required',
    })
  }

  for (const item of items) {
    if (!item.name || item.quantity == null || item.price == null || !item.restaurantId) {
      return res.status(400).json({
        error: 'Each item must have name, quantity, price, and restaurantId',
      })
    }
    if (item.quantity < 1 || !Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
      return res.status(400).json({
        error: 'Item quantity must be ≥ 1 and price must be a non-negative number',
      })
    }
  }

  try {
    const order = await Order.create(req.body)
    res.status(201).json(order)
  } catch (err) {
    console.error('Error creating order:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

const updateStatus = async (req, res) => {
  const { status } = req.body
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  try {
    const result = await Order.updateStatus(req.params.id, status)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating order status:', err)
    res.status(500).json({ error: 'Failed to update order status' })
  }
}

const remove = async (req, res) => {
  try {
    const result = await Order.remove(req.params.id)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json({ message: 'Order deleted successfully', order: result.rows[0] })
  } catch (err) {
    console.error('Error deleting order:', err)
    res.status(500).json({ error: 'Failed to delete order' })
  }
}

module.exports = { getAll, getById, create, updateStatus, remove }
