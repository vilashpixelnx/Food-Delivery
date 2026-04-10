const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updatePaymentStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All order routes are protected

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder);

router.patch('/:id/payment', updatePaymentStatus);

module.exports = router;
