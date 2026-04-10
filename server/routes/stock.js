const express = require('express');
const {
  getCartStock,
  getAllStock,
  updateStock,
  getLowStock,
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admin can see all stock across all carts
router.get('/', authorize('admin'), getAllStock);

// Get stock for specific cart
router.get('/cart/:cartId', getCartStock);

// Get low stock alerts for specific cart
router.get('/low-stock/:cartId', getLowStock);

// Update stock (Admin or Manager)
router.post('/update', authorize('admin', 'manager'), updateStock);

module.exports = router;
