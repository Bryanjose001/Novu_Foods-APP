const Restaurant = require('../models/restaurantModel');

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();

    res.json(restaurants);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch restaurants',
    });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(
      req.params.id
    );

    if (!restaurant) {
      return res.status(404).json({
        error: 'Restaurant not found',
      });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch restaurant',
    });
  }
};

const getRestaurantsMenu = async (req, res) => {
  try {
    const menu = await Restaurant.findMenuByRestaurantId(
      req.params.id
    );

    res.json(menu);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch menu items',
    });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantsMenu,
};