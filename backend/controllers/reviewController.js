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
    console.log('Received req.body:', req.body);
    console.log('Received req.file:', req.file ? 'File present' : 'No file');

    const { restaurant, order, rating, comment } = req.body;
    // Normalize comment input so the schema default can apply safely
    const commentValue = (comment !== undefined && comment !== null && String(comment).trim().length > 0)
      ? String(comment).trim()
      : "";

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "foodapp/reviews");
      imageUrl = uploadedImage.secure_url;
    }

    const reviewData = {
      user: req.user.id,
      restaurant,
      order,
      rating: Number(rating),
      comment: commentValue,
      imageUrl
    };

    console.log('Creating review with data:', reviewData);

    const review = await Review.create(reviewData);

    res.status(201).json({
      message: "Review submitted successfully!",
      review
    });
  } catch (error) {
    console.error("Review creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview
};