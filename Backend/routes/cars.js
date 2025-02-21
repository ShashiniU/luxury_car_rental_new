const express = require("express")
const router = express.Router()
const Car = require("../models/Car")

// Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find()
    res.json(cars)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    if (!car) {
      return res.status(404).json({ msg: "Car not found" })
    }
    res.json(car)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Car not found" })
    }
    res.status(500).send("Server error")
  }
})

// Add new car
router.post("/", async (req, res) => {
  try {
    const newCar = new Car(req.body)
    const car = await newCar.save()
    res.json(car)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router

