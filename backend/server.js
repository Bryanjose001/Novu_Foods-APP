require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connect } = require('./config/database')

const restaurantRoutes = require('./routes/restaurantRoutes')
const menuRoutes       = require('./routes/menuRoutes')
const orderRoutes      = require('./routes/orderRoutes')
const adminRoutes      = require('./routes/adminRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'Food Delivery API is running' })
)

app.use('/api/restaurants', restaurantRoutes)
//app.use('/api/menu-items',  menuRoutes)
//app.use('/api/orders',      orderRoutes)
//app.use('/api/admin',       adminRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

if (process.env.NODE_ENV !== 'test') {
  connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
        console.log(`API available at http://localhost:${PORT}/api`)
      })
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err)
      process.exit(1)
    })
}

module.exports = app