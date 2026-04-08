const express = require("express");
const {
  registerUser,
  loginUser,
  googleAuthUser,
  getUsers,
  getMe
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuthUser);
router.get("/users", getUsers);
router.get("/me", protect, getMe);

module.exports = router;