const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: [true, 'Cart is required for stock tracking'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required for stock tracking'],
    },
    currentQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: ['Add', 'Remove', 'Sale', 'Adjustment'],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        notes: String,
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure a cart can only have one stock entry per product
stockSchema.index({ cart: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
