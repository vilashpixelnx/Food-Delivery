const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Stock = require('../models/Stock');
const { sendWhatsAppBill } = require('../services/whatsappService');

// Helper to generate bill number: PP-YYYYMMDD-XXXX
const generateBillNumber = async () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await Order.countDocuments({
    orderDate: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });
  const sequence = (count + 1).toString().padStart(4, '0');
  return `PP-${date}-${sequence}`;
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('cart', 'name')
      .populate('customer', 'name phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cart', 'name')
      .populate('customer', 'name phone email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { cart, customer, items, discount, paymentMethod, paymentStatus, notes } = req.body;

    // 1. Calculate totals
    let totalAmount = 0;
    const formattedItems = items.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      return {
        ...item,
        total: itemTotal,
      };
    });

    const finalAmount = totalAmount - (discount || 0);

    // 2. Generate unique bill number
    const billNumber = await generateBillNumber();

    // 3. Create Order
    const order = await Order.create({
      billNumber,
      cart,
      customer,
      items: formattedItems,
      totalAmount: finalAmount,
      discount: discount || 0,
      paymentMethod,
      paymentStatus: paymentStatus || 'Completed', // Default to Completed for cash/UPI success
      notes,
    });

    // 4. Update Customer Stats
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalOrders: 1, totalSpent: finalAmount },
      $set: { lastOrderDate: Date.now() },
    });

    // 5. Update Stock (Decrement quantities for each item at this cart)
    for (const item of items) {
      await Stock.findOneAndUpdate(
        { cart, product: item.product },
        {
          $inc: { currentQuantity: -item.quantity },
          $push: {
            history: {
              type: 'Sale',
              quantity: -item.quantity,
              notes: `Order ${billNumber}`,
              performedBy: req.user.id,
            },
          },
        },
        { upsert: true } // If stock entry doesn't exist, it creates one (though ideally should exist)
      );
    }

    // 6. Send WhatsApp Notification (Async)
    const orderWithCustomer = await order.populate('customer', 'name phone');
    const itemsSummary = items.map(i => `${i.name} x${i.quantity}`).join(', ');
    
    sendWhatsAppBill(orderWithCustomer.customer.phone, {
      customerName: orderWithCustomer.customer.name,
      billNumber: order.billNumber,
      amount: order.totalAmount,
      itemsSummary: itemsSummary,
      billLink: `${req.protocol}://${req.get('host')}/api/bills/${order._id}/pdf`
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status
// @route   PATCH /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
