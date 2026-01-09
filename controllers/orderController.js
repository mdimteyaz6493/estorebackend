const Order = require('../models/Order');
const Product = require('../models/Product');
const generateInvoicePDF = require('./invoiceGenerator');



// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const requiredFields = [
      'fullName', 'email', 'mobile', 'pincode',
      'city', 'state', 'addressLine', 'addressType',
    ];

    for (const field of requiredFields) {
      if (!shippingAddress?.[field]) {
        return res.status(400).json({ message: `Missing ${field} in shipping address` });
      }
    }

    // Check and update stock before placing the order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.countInStock}`,
        });
      }

      product.countInStock -= item.qty;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};


// Get orders for the logged-in user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err.message);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err.message);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};
// Update order status (with stock restore on cancellation only)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const previousStatus = order.orderStatus;

    // Restore stock if cancelled (and not already cancelled before)
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          await product.save();
        }
      }
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: 'Status updated successfully', order });
  } catch (err) {
    console.error('Failed to update status:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// Get order by ID (user or admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only admin or the user who placed the order can access
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err.message);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// Cancel order by user
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow only the order owner or admin to cancel
    if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Prevent cancelling shipped or delivered orders
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus.toLowerCase())) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('Cancel order error:', err.message);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
};

// Delete all orders (Admin only)
exports.deleteAllOrders = async (req, res) => {
  try {
    // Allow only admins to perform this action
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete all orders' });
    }

    // Optional: Restore stock for all orders before deletion
    const allOrders = await Order.find();

    for (const order of allOrders) {
      if (order.orderStatus !== 'cancelled') {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product) {
            product.countInStock += item.qty;
            await product.save();
          }
        }
      }
    }

    await Order.deleteMany({});
    res.json({ message: 'All orders deleted successfully' });
  } catch (err) {
    console.error('Error deleting all orders:', err.message);
    res.status(500).json({ message: 'Server error while deleting all orders' });
  }
};


// ---------------- GENERATE INVOICE ----------------
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only admin or order owner
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Call utility to generate PDF
    generateInvoicePDF(order, res);
  } catch (err) {
    console.error('Error generating invoice:', err.message);
    res.status(500).json({ message: 'Server error while generating invoice' });
  }
};
