const Bill = require('../models/Bill');
const Order = require('../models/Order');
const pdfService = require('../services/pdfService');

// @desc    Generate and Get PDF Bill
// @route   GET /api/bills/:orderId/pdf
// @access  Private
exports.getOrderPDF = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('cart', 'name')
      .populate('customer', 'name phone')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const pdfBuffer = await pdfService.generateOrderPDF(order);

    // Save or update bill record
    await Bill.findOneAndUpdate(
      { order: order._id },
      { 
        billNumber: order.billNumber,
        status: 'Generated'
      },
      { upsert: true }
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=bill-${order.billNumber}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private/Admin
exports.getBills = async (req, res, next) => {
  try {
    const bills = await Bill.find().populate({
      path: 'order',
      populate: { path: 'customer', select: 'name phone' }
    });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    next(error);
  }
};
