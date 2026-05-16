const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { requireAdmin } = require('../middleware/auth')

router.get('/',             requireAdmin, orderController.getAll)     // admin only
router.get('/:id',                        orderController.getById)    // public (customer tracks own order)
router.post('/',                          orderController.create)     // public (customer places order)
router.patch('/:id/status', requireAdmin, orderController.updateStatus)
router.delete('/:id',       requireAdmin, orderController.remove)     // admin only

module.exports = router
