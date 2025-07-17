const User = require('../models/User');

// Get logged-in user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update mobile number
exports.updateMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

    const user = await User.findById(req.user._id);
    user.mobile = mobile;
    await user.save();
    res.json({ message: 'Mobile number updated successfully' });
  } catch (err) {
    console.error('Update mobile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update email
exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findById(req.user._id);
    user.email = email;
    await user.save();
    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Update email error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const address = req.body;

    const requiredFields = [
      'fullName',
      'email',
      'mobile',
      'pincode',
      'city',
      'state',
      'addressLine',
      'addressType',
    ];

    for (const field of requiredFields) {
      if (!address?.[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    const user = await User.findById(req.user._id);
    user.address = address;
    await user.save();

    res.json({ message: 'Address updated successfully' });
  } catch (err) {
    console.error('Update address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
