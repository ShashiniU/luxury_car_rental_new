import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-modal";

const JobApplicants = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchApplicationCounts();
    }, []);

    const fetchJobs = async () => {
        const response = await axios.get("/api/jobs");
        setJobs(response.data);
    };

    const fetchApplicationCounts = async () => {
        const response = await axios.get("/api/application/applications/count");
        const countMap = {};
        response.data.forEach(({ job_id, application_count }) => {
            countMap[job_id] = application_count;
        });
        setApplications(countMap);
    };

    const fetchApplicants = async (jobId) => {
        // setSelectedJobId(jobId);
        const response = await axios.get(`/api/application/applications/${jobId}`);
        setApplicants(response.data);
        setShowModal(true);
    };

    return (
        <div>
            <h2>My Job Listings</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Applications</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job.id}>
                            <td>{job.title}</td>
                            <td>{job.company}</td>
                            <td>
                                <Button variant="info" onClick={() => fetchApplicants(job.id)}>
                                    {applications[job.id] || 0}
                                </Button>
                            </td>
                            <td>
                                <Button variant="warning">Edit</Button>
                                <Button variant="danger" className="ms-2">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for applicants */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Applicants</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Resume</th>
                                <th>Cover Letter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map(applicant => (
                                <tr key={applicant.id}>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.resume ? <a href={`/uploads/${applicant.resume}`} download>Download</a> : "N/A"}</td>
                                    <td>{applicant.cover_letter ? <a href={`/uploads/${applicant.cover_letter}`} download>Download</a> : "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default JobApplicants;