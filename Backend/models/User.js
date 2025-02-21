const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['renter', 'owner', 'admin'],
    default: 'renter',  // Default value
  },
  phoneNumber: {
    type: String,
  },
  driverLicense: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Default value
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Default value
  },
});

module.exports = mongoose.model("User", UserSchema);
