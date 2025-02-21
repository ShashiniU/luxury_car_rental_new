const ApplicantDetails = ({ applicant, onUpdateStatus, onStartVideoChat }) => {
    return (
      <div className="applicant-details">
        <h3>Applicant Name: {applicant.name}</h3>
        <p>Email: {applicant.email}</p>
        <p>Status: {applicant.status}</p>
        <div className="applicant-actions">
          <a href={"http://localhost:5000/"+applicant.cv_path} download={`${applicant.name}_CV.pdf`} className="download-button">
            Download CV
          </a>
          <a href={"http://localhost:5000/"+applicant.cover_letter_path} download={`${applicant.name}_CoveLetter.pdf`} className="download-button">
            Download Cover Letter
          </a>
        </div>
        {applicant.status === "Pending" && (
          <button onClick={() => onUpdateStatus(applicant.id, "Reviewing")}>Start Review</button>
        )}
        {applicant.status === "Reviewing" && (
            <>
             <button onClick={() => onUpdateStatus(applicant.id, "Interviewing")}>Schedule an Interview</button>
            <button onClick={() => onUpdateStatus(applicant.id, "Rejected")}>Reject</button>
          </>
         
        )}
                {applicant.status === "Rejected" && <button className="close-button" >Rejected</button>}

        {applicant.status === "Interviewing" && <button onClick={onStartVideoChat}>Start Video Chat</button>}
        {applicant.status === "Interviewed" && (
          <>
            <button onClick={() => onUpdateStatus(applicant.id, "Selected")}>Select</button>
            <button onClick={() => onUpdateStatus(applicant.id, "Rejected")}>Reject</button>
          </>
        )}
      </div>
    )
  }
  
  export default ApplicantDetails
  
  