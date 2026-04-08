const express = require("express");
const {
  placeOrder,
  getOrders,
  updateOrderStatus,
  downloadInvoice
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);
router.get("/:id/invoice", downloadInvoice);
router.put("/:id", updateOrderStatus);

module.exports = router;