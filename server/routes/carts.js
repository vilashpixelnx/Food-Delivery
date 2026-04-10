const express = require('express');
const {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/cartController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All cart routes are protected

router
  .route('/')
  .get(getCarts)
  .post(authorize('admin'), createCart);

router
  .route('/:id')
  .get(getCart)
  .put(authorize('admin'), updateCart)
  .delete(authorize('admin'), deleteCart);

module.exports = router;
