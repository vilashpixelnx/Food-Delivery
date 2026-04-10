const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Server health check
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Smart Pani Puri Cart API is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
