const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, isAdmin) =>
  jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });


exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // By default, this will register as admin (only for your admin dashboard)
  const user = await User.create({ name, email, password, isAdmin: true });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

