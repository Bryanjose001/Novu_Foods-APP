const express = require('express');
const router = express.Router();

const {
  getMenuByRestaurant,
  getMenuItemById,
  createMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const { requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/restaurant/:id', getMenuByRestaurant);
router.get('/:id', getMenuItemById);

// Admin routes
router.post('/', requireAdmin, createMenuItem);
router.delete('/:id', requireAdmin, deleteMenuItem);

module.exports = router;