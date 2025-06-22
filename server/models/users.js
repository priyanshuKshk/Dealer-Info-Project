const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
    }, { timestamps: true }); // Save date/time automatically
module.exports = mongoose.model('User', UsersSchema);
