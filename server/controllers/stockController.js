const Stock = require('../models/Stock');

// @desc    Get all stock entries for a specific cart
// @route   GET /api/stock/cart/:cartId
// @access  Private
exports.getCartStock = async (req, res, next) => {
  try {
    const stock = await Stock.find({ cart: req.params.cartId })
      .populate('product', 'name category unit price')
      .sort({ 'product.name': 1 });

    res.status(200).json({ success: true, count: stock.length, data: stock });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stock entries (Master list)
// @route   GET /api/stock
// @access  Private/Admin
exports.getAllStock = async (req, res, next) => {
  try {
    const stock = await Stock.find()
      .populate('cart', 'name')
      .populate('product', 'name category')
      .sort({ cart: 1 });

    res.status(200).json({ success: true, count: stock.length, data: stock });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or Update stock for a product in a cart
// @route   POST /api/stock/update
// @access  Private (Admin or Manager)
exports.updateStock = async (req, res, next) => {
  try {
    const { cart, product, quantity, type, notes, lowStockThreshold } = req.body;

    // Use findOneAndUpdate with upsert to handle new or existing stock entries
    const stock = await Stock.findOneAndUpdate(
      { cart, product },
      {
        $inc: { currentQuantity: type === 'Add' ? quantity : -quantity },
        $set: { lowStockThreshold: lowStockThreshold || 10 },
        $push: {
          history: {
            type,
            quantity: type === 'Add' ? quantity : -quantity,
            notes,
            performedBy: req.user.id,
            date: Date.now(),
          },
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock items for a cart
// @route   GET /api/stock/low-stock/:cartId
// @access  Private
exports.getLowStock = async (req, res, next) => {
  try {
    const stock = await Stock.find({ cart: req.params.cartId })
      .populate('product', 'name')
      .where('currentQuantity')
      .lte('lowStockThreshold');

    res.status(200).json({ success: true, count: stock.length, data: stock });
  } catch (error) {
    next(error);
  }
};
