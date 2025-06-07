const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  status: String,
  stock: { type: Number, required: true },
  category: String,
  thumbnails: String,
  code: String
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;