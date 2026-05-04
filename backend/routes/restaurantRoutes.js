//const express = require('express')

//const router = express.Router()

const express = require('express');
const router = express.Router();

const {
  getRestaurants,
  getRestaurantById,
  getRestaurantsMenu
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);

router.get('/:id', getRestaurantById);

router.get('/:id/menu', getRestaurantsMenu);






module.exports = router;