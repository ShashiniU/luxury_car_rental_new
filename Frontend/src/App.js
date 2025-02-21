import { useState, useEffect } from "react";
import { Routes, Route,  Navigate } from "react-router-dom"; // Import Routes and Route
import "./App.css";
import AuthModal from "./components/LoginValidation";
// import JobList from "./components/JobList";
// import JobRecommendations from "./components/JobRecommendations";
import logoImage from "./assets/logo.svg";
import { Moon, Sun, ChevronDown } from "lucide-react";
import SkillDevelopment from "./components/SkillDevelopment/SkillDevelopment";
import EmployeeDashboard from "./components/Admin/EmployeeDashboard";
import CarListing from "./components/CarList";
import UserDashboard from "./components/User/UserDashboard";
import AppliedJobs from "./components/User/AppliedJobs";
import Home from "./components/Home";


function App() {
  
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const navigate = useNavigate();
   // PrivateRoute component to protect routes
   const PrivateRoute = ({ children, isLoggedIn }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };


  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
  }, [isDarkMode]);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
          <img src={logoImage || "/placeholder.svg"} alt="Job Matching Platform Logo" className="logo" />
          <h1>JobMatcherz</h1>
         
          {isLoggedIn && (
  <div className="user-actions-row">
    <h2 className="welcome-message-row">Welcome, {user.name}!</h2>
  
  </div>
)}
        </div>
        <nav className="nav-container">
          <button onClick={toggleDarkMode} className="mode-toggle">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
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

                 {/* <button onClick={() =>{ 
                  navigate(user.user["role"]=== "job_seeker" ? 
                  "/user-dashboard" : "/employee-dashboard") ;
                   setDropdownOpen(false)}}>
                    View Profile
                  </button> */}
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
        {/* Define the route for EmployeeDashboard */}
       
        {/* <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Routes> */}
       {/* Employee Dashboard (Protected) */}
       <Route path="/employee-dashboard" element={
         <PrivateRoute isLoggedIn={isLoggedIn}>
           <EmployeeDashboard />
         </PrivateRoute>
       }/>
     
       {/* User Dashboard (Protected) */}
       <Route path="/user-dashboard" element={
         <PrivateRoute isLoggedIn={isLoggedIn}>
           <UserDashboard />
         </PrivateRoute>
       }/>
         <Route path="/applied-jobs" element={<AppliedJobs />}  />
  {/* Home Route */}
  <Route path="/" element={
     
      <Home />
       }/>

      
     
       {/* Catch-All Route */}
       <Route path="*" element={<Navigate to="/" />} />
     </Routes>
     <main className="main-content">
          <section className="job-section">
            <h2>Featured Opportunities</h2>
            {/* <JobList /> */}
          </section>
          <aside className="recommendations-section">
            <h2>Tailored for You</h2>
            {/* <JobRecommendations /> */}
          </aside>
        </main>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onLogin={handleLogin} />
      <CarListing />
      <SkillDevelopment />
      
      
      <footer className="footer">
        <p>&copy; 2025 JobNexus. Connecting talents with opportunities.</p>
      </footer>
    </div>
  );
}

export default App;
