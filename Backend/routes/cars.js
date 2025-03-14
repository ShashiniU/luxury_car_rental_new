const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const Car = require("../models/Car")


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all cars
router.get("/", async (req, res) => {
  try {
    const { brand, minPrice, maxPrice } = req.query;
    let query = {};

    if (brand) {
      query.brand = { $regex: new RegExp(brand, "i") }; // Case-insensitive search
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})



// Add New Car
router.post("/caruploads", upload.array("images", 5), async (req, res) => {
 
  try {
    const features = Array.isArray(req.body.features) ? req.body.features : JSON.parse(req.body.features);
    if (!req.body.ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    const newCar = new Car({
      ...req.body, // Spread form data from the request body
      features, 
      images: req.files.map(file => file.path.replace(/\\/, '/')),
     
    });

   
    await newCar.save();
    res.status(200).json(newCar);
  } catch (error) {
   
    res.status(500).json({ error: "Error adding new car", message: error.message });
  }
});

// Get all cars for a user
router.get('/user/:userId', async (req, res) => {
  try {
  
    const cars = await Car.find({ ownerId: req.params.userId });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Update car
router.put('/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(updatedCar);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete car
router.delete('/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




module.exports = router

