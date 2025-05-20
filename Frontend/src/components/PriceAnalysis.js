"use client"

import { useState, useEffect } from "react"
import { getMarketPriceAnalysis, formatPriceAnalysis } from "../utils/priceAnalysis"
import "../PriceAnalysis.css"

/**
 * Component to display market price analysis for a car
 */
const PriceAnalysis = ({ car }) => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      const result = await getMarketPriceAnalysis(car)
      setAnalysis(result)
      setLoading(false)
    }

    fetchAnalysis()
  }, [car])

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  if (loading) {
    return (
      <div className="price-analysis-container">
        <div className="price-analysis-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing market price...</p>
        </div>
      </div>
    )
  }

  if (!analysis || analysis.error) {
    return (
      <div className="price-analysis-container">
        <div className="price-analysis-error">
          <p>Market price analysis currently unavailable</p>
        </div>
      </div>
    )
  }

  const { displayText, className } = formatPriceAnalysis(analysis)

  return (
    <div className="price-analysis-container">
      <div className={`price-analysis-summary ${className}`} onClick={toggleExpanded}>
        <span className="analysis-icon"></span>
        <span className="analysis-text">{displayText}</span>
        <span className={`expand-icon ${expanded ? "expanded" : ""}`}>▼</span>
      </div>

      {expanded && (
        <div className="price-analysis-details">
          <div className="price-comparison">
            <div className="price-column">
              <span className="price-label">Listed Price</span>
              <span className="price-value">${analysis.current_price.toLocaleString()}</span>
            </div>
            <div className="price-column">
              <span className="price-label">Estimated Market Value</span>
              <span className="price-value">${analysis.predicted_price.toLocaleString()}</span>
            </div>
          </div>
          <p className="analysis-description">{analysis.analysis}</p>
          <div className="methodology-note">
            <p>Based on machine learning analysis of recent market data and comparable vehicles.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceAnalysis

