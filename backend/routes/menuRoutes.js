const express = require("express");
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuController");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMenuItems);
router.post("/", protect, adminOnly, upload.single("image"), createMenuItem);
router.put("/:id", protect, adminOnly, upload.single("image"), updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

module.exports = router;