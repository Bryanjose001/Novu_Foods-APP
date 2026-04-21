const pool = require('../config/db');

const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM restaurants ORDER BY rating DESC'
    );
    res.json(result.rows);
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

module.exports = {
  getRestaurants,
  getRestaurantById,
};