const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getProfile);

module.exports = router;
