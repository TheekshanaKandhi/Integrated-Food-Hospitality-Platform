const express = require("express");
const {
  getMenuItems,
  createMenuItem
} = require("../controllers/menuController");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMenuItems);
router.post("/", protect, adminOnly, upload.single("image"), createMenuItem);

module.exports = router;