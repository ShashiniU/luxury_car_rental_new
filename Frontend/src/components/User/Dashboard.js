import { useState } from "react"
import ProfilePicture from "./ProfilePicture"
import UserDetails from "./UserDetails"
import ResumeAndCoverLetter from "./ResumeAndCoverLetter"
import styles from "./Dashboard.module.css"

const Dashboard = () => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(savedUser);

  // const [resume, setResume] = useState(null)
  // const [coverLetter, setCoverLetter] = useState(null)

  const updateUserDetails = (newDetails) => {
    setUser({ ...user.user, ...newDetails })
  }

  const updateProfilePicture = (newPicture) => {
    setUser({ ...user.user, profilePicture: newPicture })
  }

  const updateResume = (newResume) => {
    setUser({ ...user.user, resume: newResume })
  }
  const updatecoverLetter = (newCover) => {
    setUser({ ...user.user, coverLetter: newCover })
  }
  return (
    <div className={styles.dashboard}>
      <ProfilePicture profilePicture={user.user?.profilePicture} updateProfilePicture={updateProfilePicture} />
      <UserDetails user={user.user} updateUserDetails={updateUserDetails} />
      <ResumeAndCoverLetter
        resume={user.user?.resume}
        coverLetter={user.user?.coverletter}
        updateresume={updateResume}
        updatecoverLetter={updatecoverLetter}
      />
    </div>
  )
}

export default Dashboard

