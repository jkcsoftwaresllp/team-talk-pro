const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Placeholder GET route for now
router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Message route working!' });
});

module.exports = router;
