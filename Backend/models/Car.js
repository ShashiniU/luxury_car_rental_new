// backend/models/Car.js
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  price: Number,
  ownerId: mongoose.Schema.Types.ObjectId,
  description: String,
  features: [String],
  images: [String],
  status: { type: String, default: 'available' },
  
}, { timestamps: true });


module.exports = mongoose.model('Car', CarSchema);