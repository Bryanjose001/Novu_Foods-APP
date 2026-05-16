const { pool } = require('../config/db')

const getAll = () =>
  pool.query('SELECT * FROM restaurants ORDER BY rating DESC')

const getById = (id) =>
  pool.query('SELECT * FROM restaurants WHERE id = $1', [id])

const search = (query) =>
  pool.query(
    `SELECT * FROM restaurants
     WHERE LOWER(name) LIKE LOWER($1) OR LOWER(cuisine_type) LIKE LOWER($1)
     ORDER BY rating DESC`,
    [`%${query}%`]
  )

const create = ({
  name, cuisineType, ownerName, ownerEmail, ownerPhone,
  address, description, imageUrl, storeType, deliveryFee, deliveryTime,
}) =>
  pool.query(
    `INSERT INTO restaurants
       (name, cuisine_type, rating, image_url, owner_name, owner_email,
        owner_phone, address, description, store_type, delivery_fee, delivery_time)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      name,
      cuisineType || 'General',
      0,
      imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      ownerName,
      ownerEmail,
      ownerPhone || null,
      address,
      description || null,
      storeType || 'restaurant',
      deliveryFee || 3.00,
      deliveryTime || '30-40 min',
    ]
  )

const update = (id, {
  name, cuisineType, ownerName, ownerEmail, ownerPhone,
  address, description, imageUrl, storeType, deliveryFee, deliveryTime, rating,
}) =>
  pool.query(
    `UPDATE restaurants SET
       name           = COALESCE($1,  name),
       cuisine_type   = COALESCE($2,  cuisine_type),
       owner_name     = COALESCE($3,  owner_name),
       owner_email    = COALESCE($4,  owner_email),
       owner_phone    = COALESCE($5,  owner_phone),
       address        = COALESCE($6,  address),
       description    = COALESCE($7,  description),
       image_url      = COALESCE($8,  image_url),
       store_type     = COALESCE($9,  store_type),
       delivery_fee   = COALESCE($10, delivery_fee),
       delivery_time  = COALESCE($11, delivery_time),
       rating         = COALESCE($12, rating)
     WHERE id = $13
     RETURNING *`,
    [name, cuisineType, ownerName, ownerEmail, ownerPhone,
     address, description, imageUrl, storeType, deliveryFee, deliveryTime, rating, id]
  )

const remove = async (id) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM menu_items WHERE restaurant_id = $1', [id])
    const result = await client.query(
      'DELETE FROM restaurants WHERE id = $1 RETURNING *', [id]
    )
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

module.exports = { getAll, getById, search, create, update, remove }
