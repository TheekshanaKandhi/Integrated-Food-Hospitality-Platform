const Review = require("../models/Review");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("restaurant", "name cuisine address")
      .populate("order", "_id")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { user, order, restaurant, rating, comment } = req.body;

    const deliveredOrder = await Order.findOne({
      _id: order,
      user,
      restaurant,
      status: "Delivered"
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "Only customers with delivered orders can add a review"
      });
    }

    const alreadyReviewed = await Review.findOne({ order });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already submitted a review for this order"
      });
    }

    let imageUrl = "";
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "foodapp/reviews");
      imageUrl = uploadedImage.secure_url;
    }

    const review = await Review.create({
      user,
      order,
      restaurant,
      rating: Number(rating),
      comment: comment || "",
      imageUrl
    });

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  deleteReview
};