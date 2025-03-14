import { useState } from "react"
import ProfilePicture from "./ProfilePicture"
import UserDetails from "./UserDetails"
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

 return (
    <div className={styles.dashboard}>
      <ProfilePicture profilePicture={user.user?.profilePicture} updateProfilePicture={updateProfilePicture} />
      <UserDetails user={user.user} updateUserDetails={updateUserDetails} />
     
    </div>
  )
}

export default Dashboard

