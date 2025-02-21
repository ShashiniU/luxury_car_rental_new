import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthModal from "./LoginValidation";
import PopDashboard from "./User/PopDashboard";

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const [jobid, setJobsid]= useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    


    useEffect(() => {
        axios.get("http://localhost:5000/api/jobs")
            .then(response => setJobs(response.data))
            .catch(error => console.error("Error fetching jobs:", error));
    }, []);

    const handleApply = (e) => {
        if (savedUser?.user.role === "job_seeker") {
            setDashboardOpen(true);
            setJobsid(e);
        } else {
            
            setModalOpen(true);
        }
    };
    const handleLogin = (userData) => {
        setIsLoggedIn(true);  
        setModalOpen(false);
        console.log(isLoggedIn);   
        window.location.reload()   
        localStorage.setItem("user", JSON.stringify(userData));
      };

    return (
        <div>
            <h2>Job Listings</h2>
            {jobs.map(job => (
                <div key={job.id} className="job-card">
                    <h3>{job.title}</h3>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Closing Date:</strong> {job.closing_date}</p>                    
                    <p><strong>Skills:</strong> {job.skills_required}</p>
                    <p>{job.description}</p>
                    <button onClick={() => handleApply(job.id)}>Apply</button>
                </div>
            ))}
            <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onLogin={handleLogin}  />
            {savedUser && (
                <PopDashboard isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} jobid={jobid} />
            )}
           
        </div>
    );
}

export default JobList;
