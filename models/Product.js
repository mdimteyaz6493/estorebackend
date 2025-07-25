const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  description: String,
  price: Number,
  images: [String], // Changed from `image: String` to `images: [String]`
  countInStock: Number,
  rating: Number,
  numReviews: Number,
});

module.exports = mongoose.model('Product', productSchema);
