const express = require("express");
const { addRestaurant, getRestaurants } = require("../controllers/restaurantController");

const router = express.Router();

router.post("/", addRestaurant);
router.get("/", getRestaurants);

module.exports = router;