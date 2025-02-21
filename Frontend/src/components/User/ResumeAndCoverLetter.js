import styles from "./ResumeAndCoverLetter.module.css";
import axios from "axios";
import { useState } from "react";


const ResumeAndCoverLetter = ({ resume, coverLetter, setResume, setCoverLetter }) => {
      // const [selectedFile, setSelectedFile] = useState(null);
      const [resumeFile, setResumeFile] = useState(null); // Changed state to properly handle resume files
      const [coverFile, setCoverFile] = useState(null);  // Changed state to properly handle cover letter files
    
   
  
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const handleResumeFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file); // Update the state with the selected file
    }
  };

  const handleCoverFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file); // Update the state with the selected file
    }
  };

  const handleSaveFiles = async () => {
    const formData = new FormData();

    if (resumeFile) {
      formData.append("resume", resumeFile);
     
    }
    if (coverFile) {
      formData.append("coverLetter", coverFile);
    }
    formData.append("userId", savedUser.user.id); // Replace with actual user ID


    try {
      console.log("Sending files:", formData.get("resume"), formData.get("coverLetter"));

      const res = await axios.post("http://localhost:5000/api/user/upload-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Files uploaded successfully!" );
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload()  
     
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    }
  };

  const handleOpenInNewTab = (fileOrUrl) => {
    if (fileOrUrl) {
    

      window.open(fileOrUrl, "_blank", "noopener,noreferrer");
      if (typeof fileOrUrl !== 'string') {
        URL.revokeObjectURL(fileOrUrl); // Clean up the object URL
      }
    } else {
      alert("No file uploaded yet.");
    }
  };
  

  return (
    <div className="user-actions-row">
    <div className={`card ${styles.resumeAndCoverLetter}`}>
      <h2>Resume and Cover Letter</h2>

      <div className={styles.fileSection}>
      <h3>Resume</h3>
        <p>Upload Resume (PDF):</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeFileChange}
          id="resume-upload"
        />
        {resume || resumeFile || savedUser.user.resume ? (
          <div>
          <button onClick={() => handleOpenInNewTab( resume||resumeFile ||savedUser.user.resume)}>View</button></div>
         
        ) : (
          <p>
            No resume uploaded{" "}
            
          </p>
        )}
      </div>

      <div className={styles.fileSection}>
        <h3>Cover Letter</h3>
        <p>Upload Cover Letter (PDF):</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleCoverFileChange}
          id="cover-letter-upload"
        />
        {coverLetter || coverFile || savedUser.user.coverLetter ? (
          <div>
          <button onClick={() => handleOpenInNewTab( coverLetter || coverFile ||savedUser.user.coverLetter)}>View</button></div>
          
        ) : (
          <p>
            No cover letter uploaded{" "}            
          </p>
        )}
      </div>
      <button onClick={handleSaveFiles} className="save-button">
        Save Files
      </button>
    </div>
    </div>
  );
};

export default ResumeAndCoverLetter;
