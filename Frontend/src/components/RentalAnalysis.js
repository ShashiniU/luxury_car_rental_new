"use client"

import { useState, useEffect } from "react"
import { getMarketRentalAnalysis, formatRentalAnalysis } from "../utils/priceAnalysis"
import "../PriceAnalysis.css"

/**
 * Component to display market rental price analysis for a car
 * Adjusted for Sri Lankan market (25,000 - 200,000 LKR per day)
 */
const RentalAnalysis = ({ car }) => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [occasion, setOccasion] = useState("Wedding")
  const [durationDays, setDurationDays] = useState(1)

  const occasions = [
    "Wedding",
    "Corporate Event",
    "Prom",
    "Photoshoot",
    "Music Video",
    "Anniversary",
    "Birthday",
    "Graduation",
  ]

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      const result = await getMarketRentalAnalysis(car, occasion, durationDays)
      setAnalysis(result)
      setLoading(false)
    }

    fetchAnalysis()
  }, [car, occasion, durationDays])

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleOccasionChange = (e) => {
    setOccasion(e.target.value)
  }

  const handleDurationChange = (e) => {
    setDurationDays(Number.parseInt(e.target.value) || 1)
  }

  // Format price in LKR with thousands separator
  const formatLKR = (price) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="price-analysis-container">
        <div className="price-analysis-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing market rental rates...</p>
        </div>
      </div>
    )
  }

  if (!analysis || analysis.error) {
    return (
      <div className="price-analysis-container">
        <div className="price-analysis-error">
          <p>Market rental analysis currently unavailable</p>
        </div>
      </div>
    )
  }

  const { displayText, className } = formatRentalAnalysis(analysis)

  return (
    <div className="price-analysis-container">
      <div className={`price-analysis-summary ${className}`} onClick={toggleExpanded}>
        <span className="analysis-icon"></span>
        <span className="analysis-text">{displayText}</span>
        <span className={`expand-icon ${expanded ? "expanded" : ""}`}>▼</span>
      </div>

      {expanded && (
        <div className="price-analysis-details">
          <div className="analysis-controls">
            <div className="control-group">
              <label htmlFor="occasion-select">Occasion:</label>
              <select id="occasion-select" value={occasion} onChange={handleOccasionChange} className="analysis-select">
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="duration-select">Duration:</label>
              <select
                id="duration-select"
                value={durationDays}
                onChange={handleDurationChange}
                className="analysis-select"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <option key={days} value={days}>
                    {days} day{days > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="price-comparison">
            <div className="price-column">
              <span className="price-label">Listed Daily Rate</span>
              <span className="price-value">{formatLKR(analysis.current_price)}</span>
            </div>
            <div className="price-column">
              <span className="price-label">Estimated Market Rate</span>
              <span className="price-value">{formatLKR(analysis.predicted_price)}</span>
            </div>
          </div>

          <div className="total-price">
            <span className="price-label">
              Total for {durationDays} day{durationDays > 1 ? "s" : ""}:
            </span>
            <span className="price-value">{formatLKR(analysis.current_price * durationDays)}</span>
          </div>

          <p className="analysis-description">{analysis.analysis}</p>
          <div className="methodology-note">
            <p>Based on analysis of recent rental data for {occasion.toLowerCase()} events in Sri Lanka.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RentalAnalysis

