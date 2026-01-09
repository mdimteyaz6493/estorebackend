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
  generateInvoice
} = require('../controllers/orderController');


const { protect, isAdmin } = require('../middlewares/authMiddleware');

// 🛒 User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getOrdersByUser);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// 🛡️ Admin routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

// 🧹 Delete all orders (Admin only)
router.delete('/deleteall', protect, isAdmin, deleteAllOrders); // <-- New route here

module.exports = router;
