const { pool } = require('../config/database');

const findAll = async () => {
  const result = await pool.query(
    'SELECT * FROM restaurants ORDER BY rating DESC'
  );

  return result.rows;
};

const getRestaurantById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM restaurants WHERE id = $1',
    [id]
  );

  return result.rows[0];
};

const getRestaurantsMenu = async (id) => {
  const result = await pool.query(
    `SELECT * FROM menu_items
     WHERE restaurant_id = $1
     AND available = true
     ORDER BY category, name`,
    [id]
  );

  return result.rows;
};

module.exports = {
  findAll,
  getRestaurantById,
  getRestaurantsMenu
};