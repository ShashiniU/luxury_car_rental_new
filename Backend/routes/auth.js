const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Register
router.post("/register", async (req, res) => {
  
  try {
    console.log(req)
    const { name, email, password } = req.body

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
      role: 'renter',  // or other roles ('owner', 'admin')
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
   
   // Save user and catch any validation errors
   try {
    var response = await user.save();
    console.log("response:", response);
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
      console.log(user.toObject())

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

module.exports = router

