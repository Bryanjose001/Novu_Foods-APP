<<<<<<< HEAD
const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

// Create order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get single order
router.get('/:id', getOrderById);

// Update status
router.patch('/:id/status', updateOrderStatus);

// Delete order
router.delete('/:id', deleteOrder);

module.exports = router;
=======
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
>>>>>>> recover-my-work
