import axios from "axios"

// URL for the ML price prediction service
const ML_SERVICE_URL = process.env.REACT_APP_ML_SERVICE_URL || "http://localhost:5001"

/**
 * Get market rental price analysis for a car
 *
 * @param {Object} car - Car object with brand, year, and rental price
 * @param {string} occasion - Type of occasion (Wedding, Corporate Event, etc.)
 * @param {number} durationDays - Number of rental days
 * @returns {Promise<Object>} - Price analysis results
 */
export const getMarketRentalAnalysis = async (car, occasion = "Wedding", durationDays = 1) => {
  try {
    // For development/testing, return mock data if ML service is not available
    // In production, you would remove this and rely on the actual ML service
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock rental price analysis data for development")
      return getMockRentalAnalysis(car, occasion, durationDays)
    }

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, {
      brand: car.brand,
      year: car.year,
      occasion: occasion,
      duration_days: durationDays,
      current_price: car.pricePerDay || car.price,
    })

    return response.data
  } catch (error) {
    console.error("Error fetching rental price analysis:", error)
    // Fallback to mock data if the service is unavailable
    return getMockRentalAnalysis(car, occasion, durationDays)
  }
}

/**
 * Generate mock rental price analysis data for development/testing
 * Adjusted for Sri Lankan market rates (25,000 - 200,000 LKR per day)
 *
 * @param {Object} car - Car object with rental price
 * @param {string} occasion - Type of occasion
 * @param {number} durationDays - Number of rental days
 * @returns {Object} - Mock rental price analysis data
 */
const getMockRentalAnalysis = (car, occasion, durationDays) => {
  const currentPrice = car.pricePerDay || car.price

  // Different occasions have different price multipliers for Sri Lankan market
  const occasionMultipliers = {
    Wedding: 1.3, // Weddings command premium prices
    "Corporate Event": 1.15, // Corporate events slightly higher
    Prom: 1.2, // Proms and formal events
    Photoshoot: 1.1, // Photography sessions
    "Music Video": 1.25, // Entertainment industry
    Anniversary: 1.1, // Personal celebrations
    Birthday: 1.05, // Personal celebrations
    Graduation: 1.15, // Academic celebrations
  }

  // Apply occasion multiplier with some randomness
  const multiplier = occasionMultipliers[occasion] || 1.0
  const randomFactor = 0.9 + Math.random() * 0.2 // Between 0.9 and 1.1 (less variance)
  const predictedPrice = currentPrice * multiplier * randomFactor

  // Calculate difference percentage
  const diffPercentage = ((predictedPrice - currentPrice) / currentPrice) * 100

  // Determine market status based on the difference
  let marketStatus, analysis

  if (diffPercentage > 8) {
    marketStatus = "underpriced"
    analysis = `This rental appears to be priced below the typical market rate for ${occasion} events in Sri Lanka.`
  } else if (diffPercentage < -8) {
    marketStatus = "overpriced"
    analysis = `This rental appears to be priced above the typical market rate for ${occasion} events in Sri Lanka.`
  } else {
    marketStatus = "fair"
    analysis = `This rental is priced fairly according to the current market for ${occasion} events in Sri Lanka.`
  }

  return {
    current_price: currentPrice,
    predicted_price: predictedPrice,
    diff_percentage: diffPercentage,
    market_status: marketStatus,
    analysis: analysis,
    occasion: occasion,
    duration_days: durationDays,
    currency: "LKR", // Specify Sri Lankan Rupees
  }
}

/**
 * Format the rental price difference display
 *
 * @param {Object} analysis - Price analysis object
 * @returns {Object} - Formatted display info
 */
export const formatRentalAnalysis = (analysis) => {
  if (!analysis || analysis.error) {
    return {
      displayText: "Market analysis unavailable",
      className: "price-analysis-neutral",
    }
  }

  const { market_status, diff_percentage, occasion } = analysis

  // Format the display based on market status
  switch (market_status) {
    case "underpriced":
      return {
        displayText: `${Math.abs(diff_percentage).toFixed(1)}% below market for ${occasion}`,
        className: "price-analysis-good-deal",
      }
    case "overpriced":
      return {
        displayText: `${Math.abs(diff_percentage).toFixed(1)}% above market for ${occasion}`,
        className: "price-analysis-high",
      }
    case "fair":
      return {
        displayText: `Fair market price for ${occasion}`,
        className: "price-analysis-fair",
      }
    default:
      return {
        displayText: "Market analysis available",
        className: "price-analysis-neutral",
      }
  }
}

// Keep the old function names as aliases for backward compatibility
export const getMarketPriceAnalysis = getMarketRentalAnalysis
export const formatPriceAnalysis = formatRentalAnalysis

