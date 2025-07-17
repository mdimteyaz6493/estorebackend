const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderById ,
  cancelOrder
} = require('../controllers/orderController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');


// 🛒 User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getOrdersByUser);

// 🛡️ Admin routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus); // ✅ Status update route
router.get('/:id', protect, getOrderById);

router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
