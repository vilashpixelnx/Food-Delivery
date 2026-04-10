const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: [true, 'Cart reference is required'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String, // Snapshot of product name at time of order
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Razorpay'],
      default: 'Cash',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to ensure bill number or other logic? 
// Actually, let's keep it simple. Bill number will be generated in controller for now.

module.exports = mongoose.model('Order', orderSchema);
