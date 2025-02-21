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
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
}, { timestamps: true });

CarSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Car', CarSchema);