const express = require("express")
const axios = require("axios")
const router = express.Router()

// URL for the ML price prediction service
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001"

// Route to get price analysis from ML service
router.post("/price-analysis", async (req, res) => {
  try {
    const { brand, year, mileage, price } = req.body

    // Validate required fields
    if (!brand || !year || !price) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Call the ML service
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      brand,
      year,
      mileage: mileage || 0, // Default to 0 if mileage not provided
      current_price: price,
    })

    // Return the analysis
    res.json(response.data)
  } catch (error) {
    console.error("Error fetching price analysis:", error)

    // Handle different types of errors
    if (error.response) {
      // The ML service responded with an error
      return res.status(error.response.status).json({
        error: "Error from ML service",
        details: error.response.data,
      })
    } else if (error.request) {
      // No response received from ML service
      return res.status(503).json({
        error: "ML service unavailable",
        message: "Could not connect to ML service",
      })
    } else {
      // Something else went wrong
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      })
    }
  }
})

// Route to check health of ML service
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`)
    res.json(response.data)
  } catch (error) {
    console.error("Error checking ML service health:", error)
    res.status(503).json({
      status: "unavailable",
      message: "ML service is not available",
    })
  }
})

module.exports = router

