import styles from "./ProfilePicture.module.css"
import { useState } from "react";
import axios from "axios";
// import { Edit } from "lucide-react";


const ProfilePicture = ({ profilePicture, updateProfilePicture }) => {
  const savedUser = JSON.parse(localStorage.getItem("user"));

    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
      // [profilePicture, updateProfilePicture] = useState();


  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfilePicture(reader.result);

      }
      reader.readAsDataURL(file);

      setFileName(file.name);
      setSelectedFile(file);
    }
  }



  const handleSaveProfilePicture = async () => {

    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);
      formData.append("userId", savedUser.user.id); // Replace with actual user ID

      const res= await axios.post("http://localhost:5000/api/user/update-profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload Successful! ");
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload()  
        } catch (error) {
      console.error("Error saving profile picture:", error);
      alert("Failed to save profile picture.");
    }
  };


  return (
    <div className="user-actions-row">
    <div className={`card ${styles.profilePicture}`}>
      <h2>Profile Picture</h2>
      {/* <img src={profilePicture || "/placeholder.svg?height=150&width=150"}  className={styles.picture} />
      <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} id="file-upload" /> */}
      <div ><div >


<div className="profile-picture-container">
{selectedFile || profilePicture ?<img
            src={selectedFile ? URL.createObjectURL(selectedFile) : profilePicture }
alt=""
            className="profile-picture"
          />: <div></div>}
     {/* <label htmlFor="file-upload" className="edit-button">
  <Edit size={16} />
</label> */}
{selectedFile || profilePicture ?<div></div>: 

<input
  id="file-upload"
  type="file"
  className="d-none"
  accept="image/*"
  onChange={handleFileChange}
/>}
    </div>

        </div>
         </div>
      {fileName && <p className="file-name">{fileName}</p>}
      <button onClick={handleSaveProfilePicture} className="save-button">
      Save Profile Picture</button>


    </div>
    
   
    
    </div>
  )
}

export default ProfilePicture

