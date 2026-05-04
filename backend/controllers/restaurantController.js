const {pool} = require('../config/database');
const Restaurant = require('../models/restaurantModel')

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll()
    res.json(restaurants)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

const getRestaurantsMenu = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 AND available = true 
       ORDER BY category, name`,
      [id]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching menu:', error)
    res.status(500).json({ error: 'Failed to fetch menu items' })
  }
}


module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantsMenu,


};