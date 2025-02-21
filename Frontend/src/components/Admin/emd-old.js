import { useState, useEffect } from "react"
import axios from "axios"
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"
import "./EmployeeDashboard.css"
import JobApplicants from "./jobapplicants"

const EmployeeDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills_required: "",
    email: "",
    closing_date: "",
  })

  useEffect(() => {    
    fetchJobs();
    fetchApplicationCounts();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs")
      setJobs(response.data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    }
  }
  const fetchApplicationCounts = async () => {
    const response = await axios.get("http://localhost:5000/api/application/applications/count");
    const countMap = {};
    response.data.forEach(({ job_id, application_count }) => {
        countMap[job_id] = application_count;
    });
    setApplications(countMap);
};

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editJob) {
        await axios.put(`http://localhost:5000/api/jobs/${editJob.id}`, newJob)
        alert("Job updated successfully!")
      } else {
        await axios.post("http://localhost:5000/api/jobs", newJob)
        alert("Job added successfully!")
      }
      setShowForm(false)
      setNewJob({
        title: "",
        company: "",
        location: "",
        description: "",
        skills_required: "",
        email: "",
        closing_date: "",
      })
      window.location.reload()
    } catch (error) {
      console.error("Error saving job:", error)
    }
  }

  const handleEdit = (job) => {
    setNewJob(job)
    setEditJob(job)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${id}`)
        alert("Job deleted successfully!")
        setJobs(jobs.filter((job) => job.id !== id))
      } catch (error) {
        console.error("Error deleting job:", error)
      }
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Employee Dashboard</h2>
        <button
          className="create-job-button"
          onClick={() => {
            setShowForm(true)
            setEditJob(null)
          }}
        >
          Create New Job
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit} className="job-form">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={newJob.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={newJob.company}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newJob.location}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={newJob.description}
              onChange={handleChange}
              required
            />
            <textarea
              name="skills_required"
              placeholder="Skills Required"
              value={newJob.skills_required}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Contact Email"
              value={newJob.email}
              onChange={handleChange}
              required
            />
            <input type="date" name="closing_date" value={newJob.closing_date} onChange={handleChange} required />
            <button type="submit">{editJob ? "Update Job" : "Save Job"}</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <h3>My Job Listings</h3>
      <div className="job-listings">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Closing Date:</strong> {job.closing_date}
            </p>
            <p>
              <strong>Description:</strong> {job.description.slice(0, 100)}...
            </p>
            <div className="icons">
              <FaEdit onClick={() => handleEdit(job)} title="Edit" />
              <FaTrash onClick={() => handleDelete(job.id)} title="Delete" />
              <FaEye title="View" />
            </div>
          </div>
        ))}
      </div>

      <JobApplicants/>
    </div>
  )
}

export default EmployeeDashboard

