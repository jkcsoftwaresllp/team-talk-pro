const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getUser);

module.exports = router;
