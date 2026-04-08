const express = require("express");
const {
  getReviews,
  createReview
} = require("../controllers/reviewController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getReviews);
router.post("/", protect, upload.single("image"), createReview);

module.exports = router;