const express = require('express');
const { getOrderPDF, getBills } = require('../controllers/billController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admin can browse all generated bills
router.get('/', authorize('admin'), getBills);

// Anyone logged in can generate a PDF for an order (e.g., manager at cart)
router.get('/:orderId/pdf', getOrderPDF);

module.exports = router;
