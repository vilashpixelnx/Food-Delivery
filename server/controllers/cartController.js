const Cart = require('../models/Cart');

// @desc    Get all carts
// @route   GET /api/carts
// @access  Private
exports.getCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: carts.length, data: carts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cart
// @route   GET /api/carts/:id
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new cart
// @route   POST /api/carts
// @access  Private/Admin
exports.createCart = async (req, res, next) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart
// @route   PUT /api/carts/:id
// @access  Private/Admin
exports.updateCart = async (req, res, next) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cart
// @route   DELETE /api/carts/:id
// @access  Private/Admin
exports.deleteCart = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    await cart.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
