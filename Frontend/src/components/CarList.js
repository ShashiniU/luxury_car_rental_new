import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../App.css';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [user] = useState(savedUser);

  // New states for order flow
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);


  // Memoize fetchCars using useCallback
  const fetchCars = useCallback(async () => {
    try {
      let url = "http://localhost:5000/api/cars";
      const params = new URLSearchParams();


      if (brand) params.append("brand", brand);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }, [brand, minPrice, maxPrice]); // Dependencies

  // Fetch cars only once on component mount or when filters change
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleCardClick = (car) => {
    setSelectedCar(car);
    setShowOrderForm(false);
    setShowPaymentForm(false);
    setOrderComplete(false);
  };

  const closeDetails = () => {
    setSelectedCar(null);
    setShowOrderForm(false);
    setShowPaymentForm(false);
    setOrderComplete(false);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  };
  
  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setShowPaymentForm(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const handleCompleteOrder =async (e) => {
    e.preventDefault();
    try {
      // Assuming the user is logged in and you have the user ID
      const userId = user._id; // Assuming user object contains an '_id' field
      const orderData = {
        userId,
        carId: selectedCar._id,
        contactInfo,
        scheduledDate,
        scheduledTime,
        paymentInfo,
      };
  
      const response = await axios.post('http://localhost:5000/api/orders/orders', orderData);
  
      if (response.data.message === 'Order created successfully') {
        setOrderComplete(true);
        console.log('Order placed:', response.data.order);
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
    setOrderComplete(true);
    // Add to cart logic would go here
    console.log("Order placed for:", selectedCar);
    console.log("Contact info:", contactInfo);
    console.log("Scheduled for:", scheduledDate, scheduledTime);
    console.log("Payment info:", paymentInfo);
  };

  return (
    <div className="car-listing-container">
      <div className="car-list-header">
   
      <h2>Browse Luxury Cars</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
           className="filter-input"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
           className="filter-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
           className="filter-input"
        />
        <button onClick={fetchCars}
        className="search-button">Search</button>
      </div></div>

      
      <div className="car-grid">
        {cars.map((car) => (
          <div 
            className="car-card" 
            key={car._id} 
            onClick={() => handleCardClick(car)}
          >
            <div className="car-card-image-container">
            <img
              src={`http://localhost:5000/${car.images[0]}`} 
              alt={`${car.brand} ${car.model}`}
              className="car-card-image"
            />
            </div>
            <div className="car-card-content">
              <h3 className="car-card-title">{car.brand} {car.model}</h3>
              <p className="car-card-year">{car.year}</p>
              <p className="car-card-price">{formatPrice(car.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCar && (
        <div className="car-detail-modal">
          <div className="car-detail-content">
            <button className="close-button" onClick={closeDetails}>×</button>
            
            {orderComplete ? (
              <div className="order-success">
                <h2>Order Completed!</h2>
                <p>Thank you for your purchase of the {selectedCar.brand} {selectedCar.model}.</p>
                <p>We have scheduled your appointment for {scheduledDate} at {scheduledTime}.</p>
                <p>A confirmation has been sent to {contactInfo.email}.</p>
                <button className="primary-button" onClick={closeDetails}>Close</button>
              </div>
            ) : showPaymentForm ? (
              <div className="payment-form-container">
                <h2>Payment Details</h2>
                <form onSubmit={handleCompleteOrder} className="payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      name="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      name="cardName" 
                      placeholder="John Doe" 
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiryDate" 
                        placeholder="MM/YY" 
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    <div className="form-group half">
                      <label>CVV</label>
                      <input 
                        type="text" 
                        name="cvv" 
                        placeholder="123" 
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <p>{selectedCar.brand} {selectedCar.model} - {formatPrice(selectedCar.price)}</p>
                    <p>Appointment: {scheduledDate} at {scheduledTime}</p>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="secondary-button" onClick={() => setShowPaymentForm(false)}>Back</button>
                    <button type="submit" className="primary-button">Complete Order</button>
                  </div>
                </form>
              </div>
            ) : showOrderForm ? (
              <div className="contact-form-container">
                <h2>Contact & Scheduling</h2>
                <form onSubmit={handleProceedToPayment} className="contact-form">
                <div className="form-container">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      value={contactInfo.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="your.email@example.com" 
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="(123) 456-7890" 
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Schedule Date</label>
                    <input 
                      type="date" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Schedule Time</label>
                    <input 
                      type="time" 
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                    />
                  </div>
                 
                  </div>
                  <div className="form-actions">
                    <button type="button" className="secondary-button" onClick={() => setShowOrderForm(false)}>Back</button>
                    <button type="submit" className="primary-button">Proceed to Payment</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h2 className="car-detail-title">{selectedCar.brand} {selectedCar.model}</h2>
                <div className="car-detail-container">
                <div className="car-detail-gallery">
                  {selectedCar.images.map((image, index) => (
                    <img 
                      key={index} 
                      src={`http://localhost:5000/${image}`}  
                      alt={`${selectedCar.brand} ${selectedCar.model}`} 
                      className="car-detail-image"
                    />
                  ))}
                </div>  

                <div className="car-detail-info">
                  <div className="info-row">
                    <span className="info-label">Year:</span>
                    <span className="info-value">{selectedCar.year}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Price:</span>
                    <span className="info-value">{formatPrice(selectedCar.price)}</span>
                  </div>
                  
                  <div className="info-section">
                    <h3 className="info-label">Description</h3>
                  
                    <p className="info-description">{selectedCar.description}</p>
                  </div>
                  
                  <div className="info-section">
                    <h3 className="info-label">Features</h3>
                    <ul className="feature-list">
                      {selectedCar.features.map((feature, index) => (
                        <li key={index} className="feature-item">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="action-buttons">
                    <button className="contact-button">Contact Seller</button>
                    <button 
    className="order-button" 
    onClick={() => {
      if (user) {
        handleOrderNow();
      } else {
        alert("You need to log in to place an order.");
      }
    }}
  >
    Order Now
  </button>
                  </div>
                </div></div>
              </>
            )}
          </div>
        </div>
      )}
    
    </div>
  );
};

export default CarList;
