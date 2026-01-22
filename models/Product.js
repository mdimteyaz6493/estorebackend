const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: String, // user name optional
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  description: String,
  price: Number,
  images: [String],
  countInStock: Number,

  rating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  reviews: [reviewSchema], // ✅ Add array of reviews

  bestseller: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
