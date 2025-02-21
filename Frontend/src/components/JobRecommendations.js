"use client"

import { useState } from "react"
import axios from "axios"

export default function JobRecommendations() {
  const [skills, setSkills] = useState("")
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => setSkills(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("skills", skills)

   

    try {
       const id = savedUser.user.id;
      // const response = await axios.post(`http://localhost:5000/api/jobsrec/recommend/${id}`, {skills})
      const url = "http://localhost:5000/api/jobsrec/recommend";
      const data = { skills,  id };

      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" }
      });
      setRecommendedJobs(response.data.recommendations)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setError("Failed to fetch recommendations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="job-recommendations">
      <h2 className="text-2xl font-bold mb-4">Find Matching Jobs</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your skills (comma separated)"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
            
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-2">
        

{Array.isArray(recommendedJobs) &&
    recommendedJobs
        .filter(job => job.matchScore > 30  )
.map(job => (
                <div key={job.id} className="job-card">
                    <h3>{job.title}</h3>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Closing Date:</strong> {job.closing_date}</p>                    
                    <p><strong>Skills:</strong> {job.skills_required}</p>
                    <p>{job.description}</p>
                    <p className="text-sm text-gray-600">Match Score: {job.matchScore}%</p>

                </div>
          ))}
      </ul>
    </div>
  )
}

