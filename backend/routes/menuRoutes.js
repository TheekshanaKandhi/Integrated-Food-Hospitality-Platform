const express = require("express");
const { addMenuItem, getMenuItems } = require("../controllers/menuController");

const router = express.Router();

router.post("/", addMenuItem);
router.get("/", getMenuItems);

module.exports = router;