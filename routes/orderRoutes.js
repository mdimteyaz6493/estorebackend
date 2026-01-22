const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  deleteAllOrders,
  generateInvoice,
  addOrderReview,
  addOrderComplaint,
} = require('../controllers/orderController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

// ================= USER ROUTES =================

// 🛒 Create order
router.post('/', protect, createOrder);

// 📦 Get logged-in user's orders
router.get('/myorders', protect, getOrdersByUser);

// 📄 Get single order
router.get('/:id', protect, getOrderById);

// ❌ Cancel order
router.put('/:id/cancel', protect, cancelOrder);

// ⭐ Add / Update review (Delivered orders only)
router.put('/:id/review', protect, addOrderReview);

// ⚠ Raise complaint
router.put('/:id/complaint', protect, addOrderComplaint);


// ================= ADMIN ROUTES =================

// 📊 Get all orders
router.get('/', protect, isAdmin, getAllOrders);

// 🔄 Update order status
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

// 🧾 Generate invoice (Admin or Owner handled in controller)
router.get('/:id/invoice', protect, generateInvoice);

// 🧹 Delete all orders
router.delete('/deleteall', protect, isAdmin, deleteAllOrders);

module.exports = router;
