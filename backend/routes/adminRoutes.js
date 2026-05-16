const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.post('/verify', adminController.verify)

module.exports = router
