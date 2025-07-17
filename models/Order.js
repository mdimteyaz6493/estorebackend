const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    addressLine: { type: String, required: true },
    landmark: { type: String },
    addressType: { type: String, enum: ['Home', 'Work'], default: 'Home' },
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'CreditCard', 'DebitCard'],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,

  // ✅ New field for order status
  orderStatus: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'accepted','delivered', 'cancelled'],
    default: 'placed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
