const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String,
  },
  scheduledDate: Date,
  scheduledTime: String,
  paymentInfo: {
    cardNumber: String,
    cardName: String,
    expiryDate: String,
    cvv: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
