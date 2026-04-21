//const express = require('express')

//const router = express.Router()

//router.get('/api/restaurants', )

const express = require('express');
const router = express.Router();

const {
  getRestaurants,
  getRestaurantById,
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);

router.get('/:id', getRestaurantById);

module.exports = router;