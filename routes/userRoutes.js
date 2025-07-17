const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateMobile,
  updateEmail,
  updateAddress,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Profile
router.get('/profile', protect, getUserProfile);

// Update mobile number
router.put('/update-mobile', protect, updateMobile);

// Update email
router.put('/update-email', protect, updateEmail);

// Update address
router.put('/update-address', protect, updateAddress);

module.exports = router;
