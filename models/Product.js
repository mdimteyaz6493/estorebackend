const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  description: String,
  price: Number,
  image: String,
  countInStock: Number,
  rating: Number,
  numReviews: Number,
});

module.exports = mongoose.model('Product', productSchema);
