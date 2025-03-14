import { useState } from "react"
import ProfilePicture from "./ProfilePicture"
import UserDetails from "./UserDetails"
import styles from "./Dashboard.module.css"
import Modal from "react-modal";
import axios from "axios";


const PopDashboard = ({ isOpen, onClose, jobid }) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(savedUser);

  // const [resume, setResume] = useState(null)
  // const [coverLetter, setCoverLetter] = useState(null)

  const updateUserDetails = (newDetails) => {
    setUser({ ...user.user, ...newDetails })
  }

  const updateProfilePicture = (newPicture) => {
    setUser({ ...user.user, profilePicture: newPicture })
  }

  const closeModal = () => {       
    onClose();
};

const handleSubmit = async () => {
  try {
    const url = "http://localhost:5000/api/user/applying";
    const data = { jobid, userId: savedUser.user?.id };

    await axios.post(url, data, {
      headers: { "Content-Type": "application/json" }
    });

    alert("Application sent successfully!");
    closeModal()
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    alert("Something went wrong!");
  }
};

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
    <div className={styles.dashboard}>
      <ProfilePicture profilePicture={user.user?.profilePicture} updateProfilePicture={updateProfilePicture} />
      <UserDetails user={user.user} updateUserDetails={updateUserDetails} />
    
    </div>
      <div>
      <button onClick={handleSubmit}>Apply Now</button>
      </div>                    

       </Modal>

    
  )
}

export default PopDashboard

