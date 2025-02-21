import { useState, useEffect } from "react"
import axios from "axios"
import "./SkillDevelopment.css"

const SkillDevelopment = () => {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("Udemy")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      await loadCourses()
    } catch (err) {
      setError("Error fetching courses.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses")
      setCourses(response.data)
    } catch (err) {
      setError("Error loading courses.")
      console.error(err)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [selectedCourse]) // Added selectedCourse to dependencies

  return (
    <section className="skill-development">
      <h2>Skill Development Resources</h2>

      <div className="course-controls">
        <div className="select-container">
          <label htmlFor="course-select">Select a Course:</label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-select"
          >
            <option value="Udemy">Udemy</option>
            <option value="Coursera">Coursera</option>
          </select>
        </div>

        <button onClick={fetchCourses} disabled={loading} className="fetch-button">
          {loading ? "Fetching Courses..." : "Fetch Courses"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="courses-container">
        <h3>Available Courses</h3>
        <div className="course-list">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="course-item">
                <a href={course.url} target="_blank" rel="noopener noreferrer">
                  {course.title}
                </a>
              </div>
            ))
          ) : (
            <div className="course-item">
              <span>{selectedCourse}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SkillDevelopment

