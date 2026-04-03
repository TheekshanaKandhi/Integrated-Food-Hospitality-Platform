const express = require("express");
const { placeOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getOrders);
router.put("/:id", updateOrderStatus);

module.exports = router;