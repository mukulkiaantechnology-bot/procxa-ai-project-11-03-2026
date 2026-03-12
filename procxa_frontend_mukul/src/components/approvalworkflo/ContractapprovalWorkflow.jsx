import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import DepartmentModal from "./DepartmentModel";

const ContractapprovalWorkflow = () => {
  const { id: intakeRequestId } = useParams();
  const [loading, setLoading] = useState(true);
  const { get } = useApi();
  const [departmentstatus, setDepartmentstatus] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userType = localStorage.getItem("userType");
  const isAdminOrSuperAdmin = userType === "admin" || userType === "superadmin";

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      // Use approver_flow/:id to get ONLY the departments assigned to this request
      const response = await get(`${endpoints.approverFlow}/${intakeRequestId}`);
      if (response && Array.isArray(response.requests)) {
        setDepartmentstatus(response.requests);
      } else {
        setDepartmentstatus([]);
      }
      // Also fetch comments for this request
      const detailsResponse = await get(`${endpoints.get_intake_request_details}?intakeRequestId=${intakeRequestId}`);
      if (detailsResponse && Array.isArray(detailsResponse.data?.comments)) {
        setComments(detailsResponse.data.comments);
      }
    } catch (error) {
      console.error("Error fetching workflow data:", error);
      setDepartmentstatus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!intakeRequestId) {
      setLoading(false);
      return;
    }
    fetchWorkflowData();
  }, [intakeRequestId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="badge bg-success rounded-pill"><i className="fa-solid fa-check me-1"></i>Approved</span>;
      case "rejected":
        return <span className="badge bg-danger rounded-pill"><i className="fa-solid fa-xmark me-1"></i>Rejected</span>;
      case "pending":
      default:
        return <span className="badge bg-warning text-dark rounded-pill"><i className="fa-solid fa-clock me-1"></i>Pending</span>;
    }
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
    fetchWorkflowData();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-semibold mb-0">Request Approval Workflow</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left me-1"></i>Back
            </button>
          </div>
        </div>

        <div className="mt-3">
          {!Array.isArray(departmentstatus) || departmentstatus.length === 0 ? (
            <div className="text-center p-5 border rounded bg-light w-100">
              <i className="fa-solid fa-route mb-3 text-muted" style={{ fontSize: "3rem" }}></i>
              <h5>No Workflow Defined</h5>
              <p className="text-muted">
                Is request ke liye koi workflow nahi banaya gaya hai.<br />
                Kripya "Approval Requests" table se workflow set karein.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
              {departmentstatus.map((dept, index) => (
                <React.Fragment key={index}>
                  <div
                    onClick={() => handleDepartmentClick(dept)}
                    style={{
                      cursor: "pointer",
                      minWidth: "160px",
                      maxWidth: "200px",
                      borderTop: `4px solid ${
                        dept?.status === "approved" ? "#28a745" :
                        dept?.status === "rejected" ? "#dc3545" : "#ffc107"
                      }`,
                      transition: "box-shadow 0.2s",
                    }}
                    className="card text-center p-3 shadow-sm"
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
                  >
                    <div className="mb-2">
                      {getStatusBadge(dept?.status || "pending")}
                    </div>
                    <div className="mb-2">
                      <i className="fa-solid fa-building text-secondary" style={{ fontSize: "1.5rem" }}></i>
                    </div>
                    <h6 className="fw-bold mb-1 text-truncate" title={dept?.departmentName}>
                      {dept?.departmentName || "Unknown"}
                    </h6>
                    <small className="text-muted d-block mb-2">
                      {dept?.departmentType || "Approver"}
                    </small>
                    <div className="d-flex justify-content-center gap-2">
                      <i className="fa-regular fa-comments text-primary" title="Click to view details"></i>
                    </div>
                  </div>

                  {index < departmentstatus.length - 1 && (
                    <div className="d-flex align-items-center">
                      <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: "1.5rem" }}></i>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <DepartmentModal
          fetchWorkflowDatafunction={fetchWorkflowData}
          requestComment={comments}
          show={showModal}
          department={selectedDepartment}
          onClose={handleCloseModal}
          fetchDepartments={fetchWorkflowData}
          id={intakeRequestId}
          isAdminOrSuperAdmin={isAdminOrSuperAdmin}
        />
      </div>
    </>
  );
};

export default ContractapprovalWorkflow;
