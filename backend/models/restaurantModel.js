const {pool} = require('../config/database');

const findAll = async () => {
    const res = await pool.query(
      'SELECT * FROM restaurants ORDER BY rating DESC'
    );
    return res.rows
}

const getRestaurantById = async (req, res) => {
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [req.params.id]
    );
   return result.rows[0]
}
const getRestaurantsMenu = async (req, res) => {
    const { id } = req.params
    const result = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 AND available = true 
       ORDER BY category, name`,
      [id]
    )
   return result.rows
}

const getRestaurantsMenu = async (req, res) => {
    const { id } = req.params
    const result = await pool.query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 AND available = true 
       ORDER BY category, name`,
      [id]
    )
    res.json(result.rows)
}

module.exports = {
    findAll,
    getRestaurantById,
    getRestaurantsMenu
}
