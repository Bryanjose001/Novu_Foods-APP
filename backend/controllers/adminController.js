const crypto = require('crypto')

// Timing-safe string comparison to prevent timing attacks on the token
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) {
    // Still run the comparison to avoid length-based timing leaks
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

const verify = (req, res) => {
  const { password } = req.body
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' })
  }

  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    console.error('[admin] ADMIN_TOKEN is not set in environment')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  if (safeCompare(password, adminToken)) {
    // Return the token so the frontend can store it for subsequent admin requests.
    // In a future upgrade this should be replaced with a signed JWT.
    return res.json({ success: true, token: adminToken })
  }

  res.status(401).json({ error: 'Invalid admin password' })
}

module.exports = { verify }
