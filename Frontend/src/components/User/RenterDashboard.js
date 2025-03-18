 
"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import "../Admin/EmployeeDashboard.css";

const RenterDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(savedUser);

  const [orders, setOrders] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
    features: "",
    images: [],
    location: "",
  });
  const [imageFiles, setImageFiles] = useState([]);

  // Fix 1: Define fetchUserCars with useCallback before using it in useEffect
  const fetchMyOrders = useCallback(async () => {
    if (!user?._id) return; // Add a guard clause to prevent API call without user ID
    
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/orders/${user._id}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }, [user?._id]); // Only re-create this function if user._id changes

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]); // Now fetchUserCars is properly memoized

  const updateUserDetails = async () => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${user?._id}`, user);
      alert("User details updated!");
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Error updating profile");
    }
  };

  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setOrders({ ...orders, images: imageUrls });
  };
  
  return (
    <div >
        
       <div className="dashboard-container"></div>
       <h2>Owner Dashboard</h2>
      
      <div className="dashboard-header">
      
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'myorders' ? 'active' : ''}`}
            onClick={() => setActiveTab('myorders')}
          >
            My Orders
          </button>
         
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={user?.name || ""} 
              onChange={(e) => setUser({ ...user, name: e.target.value })} 
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={user?.email || ""} 
              onChange={(e) => setUser({ ...user, email: e.target.value })} 
              placeholder="Enter your email"
            />
          </div>
          <button className="update-profile-button" onClick={updateUserDetails}>
            Update Profile
          </button>
        </div>
      )}

      {activeTab === 'myorders' && (
        <div className="add-car-section">
        <h2>My Orders</h2>
        <div className="orders-container">
        
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <h3>{order.carId.brand} {order.carId.model} ({order.carId.year})</h3>
                <p><strong>Price:</strong> ${order.carId.price}</p>
                <p><strong>Contact:</strong> {order.contactInfo.name} ({order.contactInfo.email})</p>
                <p><strong>Phone:</strong> {order.contactInfo.phone}</p>
                <p><strong>Payment Card:</strong> {order.paymentInfo.cardNumber} (Exp: {order.paymentInfo.expiryDate})</p>
                <p><strong>Scheduled Date:</strong> {new Date(order.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Scheduled Time:</strong> {order.scheduledTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      )}

     
    </div>
    
  );
};

export default RenterDashboard;