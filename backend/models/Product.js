const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    image: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    seller: {
      type: String,
      default: 'Tu Avec'
    },
    featured: {
      type: Boolean,
      default: false
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null
    },
    vendorCommissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
