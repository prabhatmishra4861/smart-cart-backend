const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], 
    default: 'active'
  }
}, { timestamps: true });

module.exports.ProductModel = mongoose.model('products', productSchema);
