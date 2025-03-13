// import heroImage from "../assets/hero-image.jpeg";
import "../App.css";
import { HeroSection } from "../components/HeroSection"
import { FeaturesSection } from "../components/FeaturesSection"
import { TestimonialsSection } from "../components/TestimonialsSection"
import CarListing from "../components/CarList";

const Home = () => {
  return (
    <div className="home">
       <div className="main-wrapper">
        
        <HeroSection />
        <FeaturesSection />
        <CarListing />
        <TestimonialsSection />
          {/* <img src={heroImage || "/placeholder.svg"} alt="Job search" className="hero-image" />
          <div className="hero-text">
          <h1 className="home__title">Welcome to Luxury Car Rental</h1>
      <p className="home__subtitle">Experience the thrill of driving premium vehicles</p>

            <button className="cta-button">        Start Your Search</button>
          </div> */}
        </div>
        
      </div>
     
    
  )
}

export default Home

