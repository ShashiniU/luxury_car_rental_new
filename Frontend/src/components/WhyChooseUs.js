// import "../styles/WhyChooseUs.css"

function WhyChooseUs() {
  const reasons = [
    {
      id: 1,
      icon: "icon-car",
      title: "Premium Fleet",
      description: "Our collection features the latest models from the world's most prestigious automotive brands.",
    },
    {
      id: 2,
      icon: "icon-service",
      title: "Exceptional Service",
      description: "Our dedicated team ensures a seamless rental experience from booking to return.",
    },
    {
      id: 3,
      icon: "icon-price",
      title: "Transparent Pricing",
      description: "No hidden fees or surprises. Our pricing is clear and competitive for the luxury segment.",
    },
    {
      id: 4,
      icon: "icon-delivery",
      title: "Convenient Delivery",
      description: "We offer delivery and pickup services to your location, hotel, or airport.",
    },
  ]

  return (
    <section className="why-choose-us">
      <div className="container">
        <h2 className="section-title">Why Choose LUXEDRIVE</h2>
        <p className="section-subtitle">We offer more than just luxury cars - we provide exceptional experiences</p>

        <div className="reasons-grid">
          {reasons.map((reason) => (
            <div className="reason-card" key={reason.id}>
              <div className="reason-icon">
                <i className={reason.icon}></i>
              </div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs

