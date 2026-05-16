<<<<<<< HEAD
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
=======
const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurantController')
const menuController = require('../controllers/menuController')
const { requireAdmin } = require('../middleware/auth')

router.get('/',                        restaurantController.getAll)
router.get('/search/:query',           restaurantController.search)
router.get('/:id',                     restaurantController.getById)
router.get('/:id/menu',                menuController.getByRestaurant)
router.post('/signup',  requireAdmin,  restaurantController.create)
router.put('/:id',      requireAdmin,  restaurantController.update)
router.delete('/:id',   requireAdmin,  restaurantController.remove)

module.exports = router
>>>>>>> recover-my-work
