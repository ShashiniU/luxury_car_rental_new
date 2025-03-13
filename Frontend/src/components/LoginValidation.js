import React, { useState,useEffect  } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Required for accessibility

const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [roles, setRoles] = useState([]);  // To store the roles fetched from the backend
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
       
    });

    



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
     // Clear the message whenever the modal is closed
     useEffect(() => {
        if (!isOpen) {
            setMessage(""); // Reset message when modal is closed
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
                        
            const response = await 
            fetch(isLogin ? 
                "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              })
              
        
              const data =await response.json()
              if (!response.ok) {
                throw new Error(data.msg || isLogin ? "Login Failed!" :"Registration failed");
              }
              setMessage(isLogin ? "Login successful!" : "Registration successful!");
              localStorage.setItem("user", JSON.stringify(data.user)); // Save token
              onLogin(data.user); 
              handleLogin();
        } catch (error) {
            setMessage(error.message || "Something went wrong!");
        }
    };
    

    function handleLogin() {
        JSON.parse(localStorage.getItem("user")); 
        
    }

    const closeModal = () => {       
        onClose();
    };

    useEffect(() => {
        // Set hardcoded roles
        setRoles(["owner", "renter"]);
    
        // Clear message when modal is closed
        if (!isOpen) {
            setMessage("");
        }
    }, [isOpen]);
    

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                )}
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                {!isLogin && (
                       <select name="role" onChange={handleChange} required>
                       <option value="" disabled selected>
                           You are a...
                       </option>
                       {roles.length > 0 ? (
                           roles.map((role) => (
                               <option key={role} value={role}>
                                   {role.charAt(0).toUpperCase() + role.slice(1)}  {/* Capitalize for display */}
                               </option>
                           ))
                       ) : (
                           <option>Loading roles...</option>
                       )}
                   </select>
                )}
             
   
                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </p>
        </Modal>
    );
};

export default AuthModal;
