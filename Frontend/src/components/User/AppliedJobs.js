
import './AppliedJobs.css';
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import VideoChat from '../Admin/VideoChat';

const AppliedJobs = () => {
const [appliedJobs, setAppliedJobs] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [showVideoChat, setShowVideoChat] = useState(false);

  // Define the fetchAppliedJobs function
  const fetchAppliedJobs = useCallback(async () => {
    try {
        const id= savedUser.user.id;
      const response = await axios.get(`http://localhost:5000/api/user/jobs/${id}`);
      setAppliedJobs(response.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  }, [savedUser.user.id]);

  // Use the fetchAppliedJobs function inside useEffect and include it in the dependency array
  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]); // <-- This is the fix: include fetchAppliedJobs in the dependency array

  const handleStartVideoChat = (e) => {
    setShowVideoChat(true);
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status-btn selected";
      case "Rejected":
        return "status-btn rejected";
      case "Interviewing":
        return "status-btn interviewing";
      case "Reviewing":
        return "status-btn reviewing";
      case "Pending":
        return "status-btn pending";
      default:
        return "status-btn applied";
    }
  };


  return (
    <div className="applied-jobs-container">
      <h2>Applied Jobs</h2>
      
      <div className="applied-jobs-list">
        {
          appliedJobs.map((e) => (
            <div key={e.id} className="applied-job-card">
                <div className="job-details">
                <h3>{e.title}</h3>
              <p><strong>Company:</strong> {e.company}</p>
              <p><strong>Location:</strong> {e.description}</p>
              <p><strong>Closing Date:</strong> {e.applied_at}</p>
                </div>
                {e.status === "Interviewing" && (
              <button className="video-chat-btn" onClick={() => handleStartVideoChat(e)}>
                Start Video Chat
              </button>
            )}
                 {showVideoChat &&  (
        <VideoChat applicant={e} onClose={() => setShowVideoChat(false)} />
      )}
            <button className={getStatusClass(e.status)}>{e.status}</button>
                </div>
          ))
        }
      </div>
    </div>
  );
};

export default AppliedJobs;
