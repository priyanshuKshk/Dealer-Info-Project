const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  dealershipName: String,
  dealerCode: String,
  address: String,
  contactPerson: String,
  contactNumber: String,
  city: String,
  district: String,
  state: String,
  country: String,
  services: String,
  email: String,
  website: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);
