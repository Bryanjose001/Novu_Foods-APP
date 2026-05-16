const Restaurant = require('../models/restaurantModel')

const getAll = async (req, res) => {
  try {
    const result = await Restaurant.getAll()
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching restaurants:', err)
    res.status(500).json({ error: 'Failed to fetch restaurants' })
  }
}

const getById = async (req, res) => {
  try {
    const result = await Restaurant.getById(req.params.id)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching restaurant:', err)
    res.status(500).json({ error: 'Failed to fetch restaurant' })
  }
}

const search = async (req, res) => {
  try {
    const result = await Restaurant.search(req.params.query)
    res.json(result.rows)
  } catch (err) {
    console.error('Error searching restaurants:', err)
    res.status(500).json({ error: 'Failed to search restaurants' })
  }
}

const create = async (req, res) => {
  const { name, ownerName, ownerEmail, address } = req.body
  if (!name || !ownerName || !ownerEmail || !address) {
    return res.status(400).json({
      error: 'Missing required fields: name, ownerName, ownerEmail, and address are required',
    })
  }
  try {
    const result = await Restaurant.create(req.body)
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating restaurant:', err)
    res.status(500).json({ error: 'Failed to sign up restaurant' })
  }
}

const update = async (req, res) => {
  try {
    const result = await Restaurant.update(req.params.id, req.body)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating store:', err)
    res.status(500).json({ error: 'Failed to update store' })
  }
}

const remove = async (req, res) => {
  try {
    const result = await Restaurant.remove(req.params.id)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' })
    }
    res.json({ message: 'Store deleted successfully', store: result.rows[0] })
  } catch (err) {
    console.error('Error deleting store:', err)
    res.status(500).json({ error: 'Failed to delete store' })
  }
}

module.exports = { getAll, getById, search, create, update, remove }
