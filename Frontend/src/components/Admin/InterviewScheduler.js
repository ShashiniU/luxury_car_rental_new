"use client"

import { useState } from "react"

const InterviewScheduler = ({ applicant, onSchedule }) => {
  const [interviewDate, setInterviewDate] = useState("")

  const handleSchedule = () => {
    if (interviewDate) {
      onSchedule(applicant.id, "interviewed", { interviewDate })
    }
  }

  return (
    <div className="interview-scheduler">
      <h3>Schedule Interview</h3>
      <input type="datetime-local" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />
      <button onClick={handleSchedule}>Schedule Interview</button>
    </div>
  )
}

export default InterviewScheduler

