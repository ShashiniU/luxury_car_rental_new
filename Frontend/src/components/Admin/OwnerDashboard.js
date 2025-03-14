"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import "./EmployeeDashboard.css";

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(savedUser);

  const [car, setCar] = useState({
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
  const [cars, setCars] = useState([]);

  // Fix 1: Define fetchUserCars with useCallback before using it in useEffect
  const fetchUserCars = useCallback(async () => {
    if (!user?._id) return; // Add a guard clause to prevent API call without user ID
    
    try {
      const response = await axios.get(`http://localhost:5000/api/cars/user/${user._id}`);
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }, [user?._id]); // Only re-create this function if user._id changes

  useEffect(() => {
    fetchUserCars();
  }, [fetchUserCars]); // Now fetchUserCars is properly memoized

  const updateUserDetails = async () => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${user?._id}`, user);
      alert("User details updated!");
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Error updating profile");
    }
  };

  const addCar = async () => {
    const formData = new FormData();
    // Append non-image data
    Object.keys(car).forEach((key) => {
      if (key !== "images" && key !== "features") {
        formData.append(key, car[key]);
      }
    });
  // Make sure to include the owner ID
  formData.append("ownerId", user._id);
    // Handle features (ensure it's an array)
    if (Array.isArray(car.features)) {
      formData.append("features", JSON.stringify(car.features));
    } else if (car.features) {
      formData.append("features", JSON.stringify(car.features.split(",")));
    }
  
    // Append images
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  
    try {
      await axios.post("http://localhost:5000/api/cars/caruploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Car added successfully!");
      // Reset form
      setCar({
        brand: "",
        model: "",
        year: "",
        price: "",
        description: "",
        features: "",
        images: [],
        location: "",
        ownerId: user._id, // Keep the owner ID
      });
      setImageFiles([]);
      fetchUserCars(); // Refresh the cars list
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error);
      alert("Error adding car");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setCar({ ...car, images: imageUrls });
  };
  const handleDeleteCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`http://localhost:5000/api/cars/${carId}`);
        alert("Car deleted successfully!");
        fetchUserCars(); // Refresh the list
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Error deleting car");
      }
    }
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
            className={`tab-button ${activeTab === 'addCar' ? 'active' : ''}`}
            onClick={() => setActiveTab('addCar')}
          >
            Add Car
          </button>
          <button 
            className={`tab-button ${activeTab === 'myCars' ? 'active' : ''}`}
            onClick={() => setActiveTab('myCars')}
          >
            My Cars
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

      {activeTab === 'addCar' && (
        <div className="add-car-section">
          <h3>Add New Car</h3>
          <div className="car-form">
            <div className="form-row">
              <div className="form-group">
                <label>Brand</label>
                <input 
                  type="text" 
                  value={car.brand}
                  onChange={(e) => setCar({ ...car, brand: e.target.value })} 
                  placeholder="e.g. Toyota"
                />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input 
                  type="text" 
                  value={car.model}
                  onChange={(e) => setCar({ ...car, model: e.target.value })} 
                  placeholder="e.g. Camry"
                />
              </div>
              <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={car.location}
                onChange={(e) => setCar({ ...car, location: e.target.value })} 
                placeholder="e.g. New York, NY"
              />
            </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input 
                  type="number" 
                  value={car.year}
                  onChange={(e) => setCar({ ...car, year: e.target.value })} 
                  placeholder="e.g. 2023"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  value={car.price}
                  onChange={(e) => setCar({ ...car, price: e.target.value })} 
                  placeholder="e.g. 25000"
                />
              </div>
              <div className="form-group">
              <label>Description</label>
              <textarea 
                value={car.description}
                onChange={(e) => setCar({ ...car, description: e.target.value })} 
                placeholder="Describe your car's condition, history, etc."
              />
            </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Features (comma separated)</label>
                <input 
                  type="text" 
                  value={car.features}
                  onChange={(e) => setCar({ ...car, features: e.target.value })} 
                  placeholder="e.g. Leather seats, Sunroof, Navigation"
                />
              </div>
              <div className="form-group">
                <label>Images</label>
                <div className="image-upload">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    id="car-images"
                    className="file-input"
                  />
                  
                </div>
              </div>
              <div className="form-group">
              {car.images.length > 0 && (
                <div className="image-previews">
                  {car.images.map((url, index) => (
                    <img 
                      key={index} 
                      src={`http://localhost:5000/${url}`}  
                      alt={`Preview ${index}`} 
                      className="image-preview"
                    />
                  ))}
                </div>
              )}
               </div>
             
            </div>
            <div className="file-button-section">
            <label htmlFor="car-images" className="file-label">
                  <span>Choose Files</span>
                </label>
                <span className="file-info">
                  {imageFiles.length > 0 ? `${imageFiles.length} files selected` : "No files chosen"}
                </span>
                </div>
                
            <button className="add-car-button" onClick={addCar}>
              Add Car
            </button>
          </div>
        </div>
      )}

      {activeTab === 'myCars' && (
        <div className="my-cars-section">
          <h3>My Listed Cars</h3>
          {cars.length === 0 ? (
            <div className="no-cars">
              <p>You haven't listed any cars yet.</p>
              <button 
                className="add-car-cta" 
                onClick={() => setActiveTab('addCar')}
              >
                Add Your First Car
              </button>
            </div>
          ) : (
            <div className="car-list">
              {cars.map((car) => (
                <div key={car._id} className="car-item">
                  <div className="car-image">
                    {car.images && car.images[0] && (
                      <img 
                      src={`http://localhost:5000/${car.images[0]}`}  
                      alt={`${car.brand} ${car.model}`} />
                    )}
                  </div>
                  <div className="car-details">
                    <h4>{car.brand} {car.model} ({car.year})</h4>
                    <p className="car-price">${Number(car.price).toLocaleString()}</p>
                    <p className="car-location">{car.location}</p>
                    <div className="car-actions">
                      <button className="edit-button">Edit</button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeleteCar(car._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    
  );
};

export default OwnerDashboard;