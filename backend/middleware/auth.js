const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token']
  if (token === process.env.ADMIN_TOKEN) {
    return next()
  }
  res.status(401).json({ error: 'Unauthorized. Admin access required.' })
}

module.exports = { requireAdmin }
