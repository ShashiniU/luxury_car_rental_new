const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Register
router.post("/register", async (req, res) => {
  
  try {
  
    const { name, email, password, role } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    
console.log("findOne:", user)
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }
    else{
     
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,  // or other roles ('owner', 'admin')
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
   
   // Save user and catch any validation errors
   try {
    var response = await user.save();
   
  } catch (err) {
    console.error("Validation error:", err);
    res.status(500).send("Server error");
  }
  
  

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      const {  ...userData } = user.toObject();
    

      res.json({ token , user: userData})
    })
    }

  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
      },
    }
    const userData = user.toObject();
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: userData });
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
})

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router

