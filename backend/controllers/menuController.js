const pool = require('../config/database');

// GET menu by restaurant
const getMenuByRestaurant = async (req, res) => {
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
};

// GET single menu item
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM menu_items WHERE id = $1',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
};

// CREATE menu item (admin)
const createMenuItem = async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      description,
      price,
      category,
      imageUrl,
    } = req.body;

    if (!restaurantId || !name || !price) {
      return res.status(400).json({
        error: 'restaurantId, name, and price are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO menu_items 
      (restaurant_id, name, description, price, category, image_url, available)
      VALUES ($1,$2,$3,$4,$5,$6,true)
      RETURNING *`,
      [
        restaurantId,
        name,
        description || null,
        price,
        category || 'General',
        imageUrl || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

// DELETE menu item (admin)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING *',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({
      message: 'Menu item deleted successfully',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

module.exports = {
  getMenuByRestaurant,
  getMenuItemById,
  createMenuItem,
  deleteMenuItem,
};