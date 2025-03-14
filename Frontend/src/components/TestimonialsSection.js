import "./TestimonialsSection.css"
import test1 from "../assets/test1.jpg";
import test2 from "../assets/test2.jpg";
import test3 from "../assets/test3.jpg";
import test4 from "../assets/test4.jpg";




export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Car Owner",
      image: test1,
      content:
        "LuxRide has transformed how I rent out my Tesla. The AI pricing ensures I'm always competitive, and I've seen a 40% increase in bookings since joining.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Frequent Renter",
      image: test2,
      content:
        "I travel for business weekly and LuxRide has become my go-to. The real-time availability and instant booking save me hours of planning time.",
      rating: 5,
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Car Owner",
      image: test3,
      content:
        "The secure payment system and verified renter profiles give me peace of mind when renting out my luxury vehicles. Excellent platform!",
      rating: 4,
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Weekend Renter",
      image: test4  ,
      content:
        "Found a gorgeous Porsche for my anniversary weekend at a surprisingly reasonable price. The booking process was seamless and the car was immaculate.",
      rating: 5,
    },
  ]

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-description">Hear from car owners and renters who have experienced our platform</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <div>
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`icon-star ${i < testimonial.rating ? "filled" : ""}`}></i>
                ))}
              </div>
              <div className="testimonial-content">
                <i className="icon-quote"></i>
                <p className="testimonial-text">{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

