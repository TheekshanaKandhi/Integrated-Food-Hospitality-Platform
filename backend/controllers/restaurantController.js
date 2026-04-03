const Restaurant = require("../models/Restaurant");

const addRestaurant = async (req, res) => {
  try {
    const { name, cuisine, rating, address } = req.body;

    const restaurant = await Restaurant.create({
      name,
      cuisine,
      rating,
      address
    });

    res.status(201).json({
      message: "Restaurant added successfully",
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addRestaurant, getRestaurants };