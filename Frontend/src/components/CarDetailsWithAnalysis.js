"use client"

import { useState } from "react"
import RentalAnalysis from "./RentalAnalysis"
import "../CarDetailsWithAnalysis.css"

/**
 * Enhanced car details component that includes rental price analysis
 * Adjusted for Sri Lankan market
 */
const CarDetailsWithAnalysis = ({ car, onClose, onOrderNow }) => {
  const [activeTab, setActiveTab] = useState("details")

  // Format price in LKR with thousands separator
  const formatLKR = (price) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (!car) return null

  return (
    <div className="car-detail-content">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      <h2 className="car-detail-title">
        {car.brand} {car.model}
      </h2>

      <div className="car-detail-container">
        <div className="car-detail-gallery">
          {car.images &&
            car.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${image}`}
                alt={`${car.brand} ${car.model}`}
                className="car-detail-image"
              />
            ))}
        </div>

        <div className="car-detail-info">
          <div className="car-detail-tabs">
            <button
              className={`tab-buttons ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`tab-buttons ${activeTab === "analysis" ? "active" : ""}`}
              onClick={() => setActiveTab("analysis")}
            >
              Rental Analysis
            </button>
          </div>

          {activeTab === "details" ? (
            <>
              <div className="info-row">
                <span className="info-label">Year:</span>
                <span className="info-value">{car.year}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Daily Rate:</span>
                <span className="info-value">{formatLKR(car.pricePerDay || car.price)}</span>
              </div>

              <div className="info-section">
                <h3 className="info-label">Description</h3>
                <p className="info-description">{car.description || "No description available."}</p>
              </div>

              <div className="info-section">
                <h3 className="info-label">Features</h3>
                <ul className="feature-list">
                  {car.features &&
                    car.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="analysis-tab-content">
              <h3 className="info-label">Rental Price Analysis</h3>
              <RentalAnalysis car={car} />

              <div className="analysis-details">
                <h4>How is this calculated?</h4>
                <p>
                  Our analysis model examines luxury vehicle rental rates across Sri Lanka, considering factors like
                  brand reputation, model year, occasion type, and current market conditions to provide an accurate
                  assessment of rental rates.
                </p>

                <h4>What does this mean for you?</h4>
                <p>
                  This analysis helps you make informed decisions when renting luxury vehicles for special occasions in
                  Sri Lanka. Whether you're planning a wedding, corporate event, or photoshoot, our insights give you
                  confidence that you're getting a fair price for your luxury car rental.
                </p>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="contact-button">Contact Us</button>
            <button className="order-button" onClick={onOrderNow}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailsWithAnalysis

