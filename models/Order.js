const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // 👤 User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🛒 Order Items
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

    // 🚚 Shipping Address
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      pincode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      addressLine: { type: String, required: true },
      landmark: { type: String },
      addressType: {
        type: String,
        enum: ['Home', 'Work'],
        default: 'Home',
      },
    },

    // 💳 Payment
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

    // 📦 Order Status
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'accepted',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'placed',
    },

    // ⭐ Customer Review (after delivery)
    customerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      reviewedAt: Date,
    },

    // ⚠ Customer Complaint
    complaint: {
      hasComplaint: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        enum: [
          'Delay',
          'Damaged',
          'Wrong Item',
          'Payment Issue',
          'Other',
        ],
      },
      message: {
        type: String,
        trim: true,
      },
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'rejected'],
        default: 'open',
      },
      adminResponse: {
        type: String,
        trim: true,
      },
      createdAt: Date,
      resolvedAt: Date,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model('Order', orderSchema);
