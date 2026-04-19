const express = require("express");
const {
  getReviews,
  createReview,
  deleteReview
} = require("../controllers/reviewController");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getReviews);
router.post("/", protect, upload.single("image"), createReview);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;