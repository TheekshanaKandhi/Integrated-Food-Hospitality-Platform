const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);