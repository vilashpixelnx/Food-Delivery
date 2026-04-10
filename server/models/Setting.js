const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  categories: {
    type: [String],
    default: ['Pani Puri', 'Chaat', 'Drinks', 'Other']
  },
  units: {
    type: [String],
    default: ['Plate', 'Glass', 'Piece', 'Kg', 'Bottle']
  },
  defaultTaxPercent: {
    type: Number,
    default: 0
  },
  storeName: {
    type: String,
    default: 'Smart Pani Puri'
  },
  storeAddress: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
