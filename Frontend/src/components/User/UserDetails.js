import { useState } from "react"
import styles from "./UserDetails.module.css"

const UserDetails = ({ user, updateUserDetails }) => {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(user)
   const savedUser = JSON.parse(localStorage.getItem("user"));
   user=savedUser.user;
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateUserDetails(formData)
    setEditMode(false)
  }

  return (
    <div className="user-actions-row">
    <div className={`card ${styles.userDetails}`}>
      <h2>User Details</h2>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label className="label">
            Name:
            <input className="input" type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <label className="label">
            Email:
            <input className="input" type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </label>
          {/* <label className="label">
            Phone:
            <input className="input" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} /> */}
          {/* </label> */}
          <button type="submit" className="button">
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* <p>
            <strong>Phone:</strong> {user.phone}
          </p> */}
          <button onClick={() => setEditMode(true)} className="button">
            Edit Details
          </button>
        </div>
      )}
    </div>
    </div>)
}

export default UserDetails

