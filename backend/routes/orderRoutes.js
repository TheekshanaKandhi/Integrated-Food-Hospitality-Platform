const express = require("express");
const {
  placeOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  downloadInvoice
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);
router.get("/:id/invoice", protect, downloadInvoice);
router.put("/:id", protect, adminOnly, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);

module.exports = router;