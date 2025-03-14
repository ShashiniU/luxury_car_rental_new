"use client"

import { useEffect, useRef } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:5000")

const VideoChat = ({ applicant, onClose }) => {
  const localVideoRef = useRef()
  const remoteVideoRef = useRef()

  useEffect(() => {
    const initializeVideoChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localVideoRef.current.srcObject = stream

        socket.emit("join-room", applicant.id)

        socket.on("user-connected", (userId) => {
          // Handle peer connection here
        })

        socket.on("user-disconnected", (userId) => {
          // Handle peer disconnection here
        })
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initializeVideoChat()

    return () => {
      socket.off("user-connected")
      socket.off("user-disconnected")
    }
  }, [applicant.id])

  return (
    <div className="video-chat">
      <h3>Video Chat with {applicant.name}</h3>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
        <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
      </div>
      <button onClick={onClose}>End Call</button>
    </div>
  )
}

export default VideoChat

