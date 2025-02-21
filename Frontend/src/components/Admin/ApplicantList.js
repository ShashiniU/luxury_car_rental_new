const ApplicantList = ({ applicants, onSelectApplicant }) => {
    return (
      <div className="applicant-list">
        <h3>Applicants</h3>
        {applicants.map((applicant) => (
          <div key={applicant.id} className="applicant-item">
            <img src={applicant.image_path || "/default-avatar.png"} alt={applicant.name} className="applicant-avatar" />
            <span>{applicant.name}</span>
            <span className="applicant-status">{applicant.status}</span>
            <button onClick={() => onSelectApplicant(applicant)}>View</button>
            
          </div>
        ))}
      </div>
    )
  }
  
  export default ApplicantList
  
  