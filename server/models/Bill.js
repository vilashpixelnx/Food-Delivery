const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pdfUrl: String, // Path to stored PDF if needed
    status: {
      type: String,
      enum: ['Generated', 'Sent', 'Printed'],
      default: 'Generated',
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    printableContent: String, // Stringified content for thermal printer
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bill', billSchema);
