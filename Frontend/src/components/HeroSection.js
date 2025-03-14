import { Link } from "react-router-dom"
import "./HeroSection.css"
import "../App.css"


// import "./Navbar.css"

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Luxury Car Rentals with Smart Pricing</h1>
            <p className="hero-description">
              Rent premium vehicles at competitive rates powered by our AI pricing algorithm. Find the perfect car for
              any occasion with real-time availability.
            </p>
            <div className="hero-buttons">
              <Link to="/cars">
                <button className="btn btn-primary btn-lg">Browse Cars</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-outline btn-lg">List Your Car</button>
              </Link>
            </div>
          </div>
          {/* <div className="hero-image-container">
            <div className="hero-image">
              <img src={heroImage} alt="Luxury car dashboard" className="main-image" />
              <div className="image-overlay">
                <div className="how-it-works">
                  <h3 className="how-it-works-title">How It Works</h3>
                  <div className="how-it-works-steps">
                    <div className="step">
                      <i className="icon-search"></i>
                      <span>Find a Car</span>
                    </div>
                    <div className="step">
                      <i className="icon-calendar"></i>
                      <span>Book Instantly</span>
                    </div>
                    <div className="step">
                      <i className="icon-credit-card"></i>
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

