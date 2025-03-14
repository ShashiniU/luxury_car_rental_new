import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs").then((res) => setJobs(res.data));
    axios.get("http://localhost:5000/api/candidates").then((res) => setCandidates(res.data));
  }, []);

  const jobData = {
    labels: jobs.map((j) => j.title),
    datasets: [{ label: "Open Positions", data: jobs.map((j) => j.vacancies) }],
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Job Listings</h2>
      <Bar data={jobData} />
    </div>
  );
};

export default AdminDashboard;
