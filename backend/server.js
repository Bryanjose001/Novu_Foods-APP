require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const { connect } = require('./config/db')

const restaurantRoutes = require('./routes/restaurantRoutes')
const menuRoutes       = require('./routes/menuRoutes')
const orderRoutes      = require('./routes/orderRoutes')
const adminRoutes      = require('./routes/adminRoutes')

const app = express()
const PORT = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'

// Security headers
app.use(helmet())

// CORS — whitelist frontend origin
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-token'],
  credentials: true,
}))

// Request logging
app.use(morgan(isProd ? 'combined' : 'dev'))

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Global rate limiter — 200 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use(globalLimiter)

// Strict rate limiter for admin login — 10 attempts / 15 min
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please wait 15 minutes.' },
})
app.use('/api/admin/verify', adminLoginLimiter)

// Health check (bypasses auth, used by load balancers)
app.get('/api/health', async (req, res) => {
  try {
    const { pool } = require('./config/db')
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected', uptime: Math.floor(process.uptime()) })
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu-items',  menuRoutes)
app.use('/api/orders',      orderRoutes)
app.use('/api/admin',       adminRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler — never leak stack traces in production
app.use((err, req, res, next) => {
  if (isProd) {
    console.error(`[ERROR] ${err.message}`)
    res.status(err.status || 500).json({ error: err.message || 'Something went wrong.' })
  } else {
    console.error(err.stack)
    res.status(err.status || 500).json({ error: err.message, stack: err.stack })
  }
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n[${signal}] Shutting down gracefully...`)
  server?.close(() => {
    console.log('HTTP server closed.')
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10000) // force exit after 10s
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT',  () => gracefulShutdown('SIGINT'))

let server
if (process.env.NODE_ENV !== 'test') {
  connect()
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`[server] Running on http://localhost:${PORT}`)
        console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`)
      })
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err)
      process.exit(1)
    })
}

module.exports = app