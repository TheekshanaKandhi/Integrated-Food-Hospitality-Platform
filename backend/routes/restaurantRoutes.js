const express = require("express");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurant
} = require("../controllers/restaurantController");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, adminOnly, upload.single("image"), createRestaurant);
router.delete("/:id", protect, adminOnly, deleteRestaurant);

module.exports = router;