const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: { type: String }, // ✅ Add mobile

  address: { // ✅ Add address structure
    fullName: String,
    email: String,
    mobile: String,
    pincode: String,
    city: String,
    state: String,
    addressLine: String,
    landmark: String,
    addressType: { type: String, enum: ['Home', 'Work'], default: 'Home' }
  },

  isAdmin: { type: Boolean, default: false }
});

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Match password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
