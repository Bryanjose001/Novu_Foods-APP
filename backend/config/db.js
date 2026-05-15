const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
})

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message)
})

const runMigrations = async () => {
  const migrations = [
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_name TEXT`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_email TEXT`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_phone TEXT`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description TEXT`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'restaurant'`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10,2) DEFAULT 3.00`,
    `ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time TEXT DEFAULT '30-40 min'`,
    `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS restaurant_id INTEGER`,
    `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS item_name TEXT`,
  ]
  try {
    for (const sql of migrations) {
      await pool.query(sql)
    }
    console.log('Database migrations completed')
  } catch (err) {
    console.error('Migration error:', err)
  }
}

const connect = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT NOW()', async (err) => {
      if (err) {
        console.error('Database connection error:', err)
        return reject(err)
      }
      console.log('Database connected successfully')
      await runMigrations()
      resolve()
    })
  })
}

module.exports = { pool, connect }
