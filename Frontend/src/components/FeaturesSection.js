import "./FeaturesSection.css"
import secureCommunication from "../assets/secure-communication.jpg";
import aiPricing from "../assets/ai-pricing.jpg";
import advancedSearch from "../assets/advanced-search.jpg";
import realTime from "../assets/real-time.jpg";
import SecurePayments from "../assets/Secure-Payments.jpg";
import RealTimeAnalytics from "../assets/Real-Time-analytics.jpg";
import ContinuousTesting from "../assets/Continuous-Testing.jpg";
import EnterpriseSecurity from "../assets/Enterprise-security.jpg";

export function FeaturesSection() {
  const features = [
    {
      image:secureCommunication,
      title: "Secure Communication",
      description:
        "Connect with car owners through our encrypted messaging system for safe and efficient communication.",
    },
    {
      image: aiPricing,
      title: "AI-Powered Pricing",
      description:
        "Our machine learning algorithms adjust rental prices based on location, demand, and vehicle type.",
    },
    {
      image: advancedSearch,
      title: "Advanced Search",
      description:
        "Find the perfect vehicle with our comprehensive search and filter options.",
    },
    {
      image: realTime,
      title: "Real-Time Availability",
      description:
        "See up-to-date availability and receive instant booking confirmations.",
    },
    {
      image: SecurePayments,
      title: "Secure Payments",
      description: "Enjoy peace of mind with our secure payment gateways and transaction protection.",
    },
    {
      image: RealTimeAnalytics,
      title: "Real-Time Analytics",
      description: "Monitor market trends and adjust pricing strategies to stay competitive.",
    },
    {
      image: ContinuousTesting,
      title: "Continuous Testing",
      description: "Our platform undergoes rigorous testing to ensure accuracy, usability, and resilience.",
    },
    {
      image: EnterpriseSecurity,
      title: "Enterprise Security",
      description: "Built with scalability and security in mind to protect your data and privacy.",
    },
  ]

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">Why Choose Us</h2>
          <p className="features-description">
            Our platform offers unique features designed to make car rentals seamless, secure, and smart.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-image-wrapper">
                <img src={feature.image} alt={feature.title} className="feature-image" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

