const express = require('express');
const {
  getDashboardStats,
  getAnalytics,
  getCartPerformance,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Only Admins can see reports
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/cart-performance', getCartPerformance);

module.exports = router;
