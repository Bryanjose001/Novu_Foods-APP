const Menu = require('../models/menuModel')

const getByRestaurant = async (req, res) => {
  try {
    const result = await Menu.getByRestaurant(req.params.id)
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching menu:', err)
    res.status(500).json({ error: 'Failed to fetch menu items' })
  }
}

const getById = async (req, res) => {
  try {
    const result = await Menu.getById(req.params.id)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching menu item:', err)
    res.status(500).json({ error: 'Failed to fetch menu item' })
  }
}

const create = async (req, res) => {
  const { restaurantId, name, price } = req.body
  if (!restaurantId || !name || !price) {
    return res.status(400).json({
      error: 'Missing required fields: restaurantId, name, and price are required',
    })
  }
  try {
    const result = await Menu.create(req.body)
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating menu item:', err)
    res.status(500).json({ error: 'Failed to create menu item' })
  }
}

const update = async (req, res) => {
  try {
    const result = await Menu.update(req.params.id, req.body)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating menu item:', err)
    res.status(500).json({ error: 'Failed to update menu item' })
  }
}

const remove = async (req, res) => {
  try {
    const result = await Menu.remove(req.params.id)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' })
    }
    res.json({ message: 'Menu item deleted successfully', item: result.rows[0] })
  } catch (err) {
    console.error('Error deleting menu item:', err)
    res.status(500).json({ error: 'Failed to delete menu item' })
  }
}

module.exports = { getByRestaurant, getById, create, update, remove }
