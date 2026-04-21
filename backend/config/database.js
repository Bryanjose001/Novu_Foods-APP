const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

const runMigrations = async () => {
  try {
    console.log('Running migrations...');

    await pool.query(`
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_name TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_email TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS owner_phone TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'restaurant';
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10,2) DEFAULT 3.00;
      ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS delivery_time TEXT DEFAULT '30-40 min';
    `);

    console.log('Migrations completed');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  runMigrations,
};
