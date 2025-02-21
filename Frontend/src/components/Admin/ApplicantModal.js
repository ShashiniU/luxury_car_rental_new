"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import io from "socket.io-client"
import ApplicantList from "./ApplicantList"
import ApplicantDetails from "./ApplicantDetails"
import InterviewScheduler from "./InterviewScheduler"
import VideoChat from "./VideoChat"
import "./ApplicantModal.css"

const socket = io("http://localhost:5000")

const ApplicantModal = ({ jobId, onClose }) => {
  const [applicants, setApplicants] = useState([])
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [showVideoChat, setShowVideoChat] = useState(false)


  const fetchApplicants = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/application/applications/${jobId}`)
      setApplicants(response.data)
    } catch (error) {
      console.error("Error fetching applicants:", error)
    }
  }, [jobId])

  useEffect(() => {
    fetchApplicants()

    socket.on("applicantStatusUpdated", (updatedApplicant) => {
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) => (applicant.id === updatedApplicant.id ? updatedApplicant : applicant)),
      )
    })

    return () => {
      socket.off("applicantStatusUpdated")
    }
  }, [fetchApplicants])

  const handleUpdateStatus = async (applicantId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/application/applicants/${applicantId}`, { status })
      
      fetchApplicants()
      alert(  status+ " successfully!" );


    } catch (error) {
      console.error("Error updating applicant status:", error)
    }
  }

  const handleStartVideoChat = () => {
    setShowVideoChat(true)
  }

  return (
    <div className="applicant-modal-overlay">
      <div className="applicant-modal">
        <h2>Applicants Review</h2>
        <div className="applicant-content">
          <ApplicantList
            applicants={applicants}
            onSelectApplicant={setSelectedApplicant}
            // onUpdateStatus={handleUpdateStatus}
          />
          {selectedApplicant &&  (
            <ApplicantDetails
              applicant={selectedApplicant}
              onUpdateStatus={handleUpdateStatus}
              onStartVideoChat={handleStartVideoChat}
            />
          )}
        </div>
       
        {selectedApplicant && selectedApplicant.status === "Interviewing" && (
          <InterviewScheduler applicant={selectedApplicant} onSchedule={handleUpdateStatus} />
        )}
        {showVideoChat && <VideoChat applicant={selectedApplicant} onClose={() => setShowVideoChat(false)} />}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default ApplicantModal

