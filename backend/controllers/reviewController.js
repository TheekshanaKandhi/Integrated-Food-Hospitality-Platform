const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { user, restaurant, order, rating, comment } = req.body;

    const review = await Review.create({
      user,
      restaurant,
      order,
      rating,
      comment
    });

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("restaurant", "name cuisine address")
      .populate("order", "totalPrice status");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviews };