const express = require('express');
const {
  createRazorpayOrder,
  verifyPayment,
  getPayments,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create-order', createRazorpayOrder);

router.post('/verify', verifyPayment);

router.get('/', authorize('admin'), getPayments);

module.exports = router;
