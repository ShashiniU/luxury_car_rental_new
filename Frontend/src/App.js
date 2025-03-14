import { useState, useEffect } from "react";
import { Routes, Route,  Navigate, useNavigate } from "react-router-dom"; // Import Routes and Route
import "./App.css";
import AuthModal from "./components/LoginValidation";
import { ChevronDown } from "lucide-react";
import Home from "./components/Home";
import OwnerDashboard from "./components/Admin/OwnerDashboard";
import RenterDashboard from "./components/User/RenterDashboard";
import CarListing from "./components/CarList"; 

// import Testimonials from "./components/Testimonials"
// import CarDashboard from "./components/CarDashboard"


function App() {
  
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
   const navigate = useNavigate();
   // PrivateRoute component to protect routes
   const PrivateRoute = ({ children, isLoggedIn }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };


  useEffect(() => {
  

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setModalOpen(false);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    setDropdownOpen(false);
   
    
  };

 

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
   

  return (
    <div className="app">
      
      <header className="header">
        <div className="logo-container">
        <button className="luxury-button" onClick={() => navigate("/")}>
      Luxury Car Rental
    </button>
         
         
        </div>
        <nav className="nav-container">
         
          {isLoggedIn ? (
            <div className="profile-container">
              <button onClick={toggleDropdown} className="profile-button">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt=""
                    className="profile-picture"
                  />
                ) : (
                  <div className="profile-initials">{getInitials(user.name)}</div>
                )}
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                  <div className="profile-dropdown">             

                 <button onClick={() =>{ 
                  navigate(user.role=== "owner" ? 
                  "/owner-dashboard" : "/renter-dashboard") ;
                   setDropdownOpen(false)}}>
                    View Profile
                  </button>
                  <button onClick={handleLogout}>Sign Out</button>
                  
                </div>
                
              )}
            </div>
          ) : (
            <button onClick={() => setModalOpen(true)} className="auth-button">
              Login
            </button>
          )}
        </nav>
      </header>

      <Routes>
       {/* Employee Dashboard (Protected) */}
       <Route
          path="/owner-dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/renter-dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <RenterDashboard />
            </PrivateRoute>
          }
        />
        
  {/* Home Route */}
  <Route path="/" element={
     
      <Home />
       }/>
       {/* Catch-All Route */}
       <Route path="*" element={<Navigate to="/" />} />
       <Route path="/cars" element={<CarListing />} />

     </Routes>
   
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onLogin={handleLogin} />
      
     {/* <CarDashboard /> */}
   
   
     
   
      
      <footer className="footer">
        <p>&copy; 2025 Luxury Car Retal Services. Connecting talents with opportunities.</p>
      </footer>
    </div>
  );
}

export default App;
