const Review = require("../models/Review");
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
      .populate("restaurant", "name cuisine address imageUrl")
      .populate("order", "totalPrice status")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { restaurant, order, rating, comment } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "foodapp/reviews");
      imageUrl = uploadedImage.secure_url;
    }

    const review = await Review.create({
      user: req.user.id,
      restaurant,
      order,
      rating: Number(rating),
      comment,
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

module.exports = {
  getReviews,
  createReview
};