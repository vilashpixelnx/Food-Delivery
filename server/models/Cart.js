const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cart name is required'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);
