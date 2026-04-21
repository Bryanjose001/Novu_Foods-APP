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