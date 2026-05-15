const { pool } = require('../config/db')

const getByRestaurant = (restaurantId) =>
  pool.query(
    `SELECT * FROM menu_items
     WHERE restaurant_id = $1 AND available = true
     ORDER BY category, name`,
    [restaurantId]
  )

const getById = (id) =>
  pool.query('SELECT * FROM menu_items WHERE id = $1', [id])

const create = ({ restaurantId, name, description, price, category, imageUrl }) =>
  pool.query(
    `INSERT INTO menu_items
       (restaurant_id, name, description, price, category, image_url, available)
     VALUES ($1,$2,$3,$4,$5,$6,true)
     RETURNING *`,
    [restaurantId, name, description || null, price, category || 'General', imageUrl || null]
  )

const update = (id, { name, description, price, category, imageUrl, available }) =>
  pool.query(
    `UPDATE menu_items SET
       name        = COALESCE($1, name),
       description = COALESCE($2, description),
       price       = COALESCE($3, price),
       category    = COALESCE($4, category),
       image_url   = COALESCE($5, image_url),
       available   = COALESCE($6, available)
     WHERE id = $7
     RETURNING *`,
    [name, description, price, category, imageUrl, available, id]
  )

const remove = (id) =>
  pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id])

module.exports = { getByRestaurant, getById, create, update, remove }
