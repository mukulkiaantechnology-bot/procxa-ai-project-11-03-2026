import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const DepartmentModal = ({
  show,
  department,
  onClose,
  fetchDepartments,
  id,
  requestComment,
  fetchWorkflowDatafunction,
  isAdminOrSuperAdmin,
}) => {
  const { del, patch, post, get } = useApi();
  const userType = localStorage.getItem("userType");
  const isAuthorized = isAdminOrSuperAdmin || userType === "department";

  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState("pending");

  useEffect(() => {
    if (department) {
      setCurrentStatus(department?.status || "pending");
    }
  }, [department]);

  if (!show || !department) return null;

  const handleApprove = async (overrideContractId = null) => {
    const isOverriding = overrideContractId !== null;
    if (!isOverriding) {
      const confirmApprove = window.confirm("Are you sure you want to approve this department?");
      if (!confirmApprove) return;
    }

    setLoading(true);
    try {
      const deptId = department?.department?.id || department?.userId;
      const payload = {
        intakeRequestId: id,
        departmentId: deptId,
        status: "approved",
        comment: comment || (isOverriding ? "Contract Updated & Approved" : "Approved"),
      };

      if (overrideContractId) {
        payload.assigncontractTemplateId = overrideContractId;
      }

      const response = await patch(`${endpoints.update_workflow_status}`, payload);

      if (response.status) {
        alert(isOverriding ? "Contract updated and approved successfully" : "Department approved successfully");
        setCurrentStatus("approved");
        setComment("");
        fetchWorkflowDatafunction();
        onClose();
      } else {
        alert(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error in handleApprove:", error);
      alert("Error while updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert("Please provide a reason for rejection in the comment field.");
      return;
    }

    const confirmReject = window.confirm("Are you sure you want to reject this department?");
    if (!confirmReject) return;

    setLoading(true);
    try {
      const deptId = department?.department?.id || department?.userId; // Handle both
      const response = await patch(`${endpoints.update_workflow_status}`, {
        intakeRequestId: id,
        departmentId: deptId,
        status: "rejected",
        comment: comment,
      });

      if (response.status) {
        alert("Department rejected successfully");
        setCurrentStatus("rejected");
        setComment("");
        fetchWorkflowDatafunction();
        onClose();
      } else {
        alert(response.message || "Failed to reject department");
      }
    } catch (error) {
      console.error("Error rejecting department:", error);
      alert("Error while rejecting department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ display: "block" }} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header text-white" style={{ backgroundColor: "#578E7E" }}>
            <h5 className="modal-title">Department Details</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Current Status Display */}
            <div className="alert alert-info mb-3">
              <strong>Current Status:</strong>{" "}
              <span className={`badge ${currentStatus === "approved" ? "bg-success" :
                currentStatus === "rejected" ? "bg-danger" :
                  "bg-warning"
                }`}>
                {currentStatus === "approved" ? "✓ Approved" :
                  currentStatus === "rejected" ? "✗ Rejected" :
                    "⏳ Pending"}
              </span>
            </div>

            {/* Department Details Display */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="w-100">
                <h5 className="mb-1">{department?.department?.name || department?.departmentName}</h5>
                <p className="text-muted mb-1">{department?.department?.email_id || department?.email || "No email provided"}</p>
                <p className="text-muted mb-1"><strong>Role:</strong> {department?.department?.role || department?.departmentType || department?.role || "Not Assigned"}</p>
              </div>
            </div>


            {/* Comments List - Filtered by Department */}
            <p><strong>Comments:</strong></p>
            {(() => {
              const deptId = department?.department?.id || department?.userId;
              const filteredComments = Array.isArray(requestComment)
                ? requestComment.filter(cmt => cmt.departmentId == deptId || !cmt.departmentId)
                : [];

              return filteredComments.length > 0 ? (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <ul className="list-group">
                    {filteredComments.map((cmt, index) => (
                      <li key={index} className="list-group-item">
                        <div className="text-dark">{cmt.commentMessage}</div>
                        <div className="text-muted small">
                          {new Date(cmt.createdAt).toLocaleString()}
                          {cmt.userType && <span className="badge bg-light text-dark ms-2">{cmt.userType}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted">No comments available for this department.</p>
              );
            })()}

            {/* Add New Comment - Send Department ID */}
            <div className="mb-3 mt-3">
              <label htmlFor="commentInput" className="form-label">Add Comment</label>
              <textarea
                id="commentInput"
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Enter your comment..."
              />
              <button
                className="btn btn-primary mt-2"
                onClick={async () => {
                  if (!comment.trim()) {
                    alert("Please enter a comment before saving.");
                    return;
                  }
                  try {
                    const deptId = department?.department?.id || department?.userId;
                    const response = await post(`${endpoints.addComment}`, {
                      comment,
                      selectedRequestId: id,
                      userType: localStorage.getItem("userType"),
                      departmentId: deptId
                    });

                    if (response.status) {
                      alert("Comment added successfully");
                      setComment("");
                      fetchDepartments();
                      fetchWorkflowDatafunction();
                    } else {
                      alert("Failed to add comment");
                    }
                  } catch (error) {
                    alert("Error while adding comment");
                  }
                }}
                disabled={loading}
              >
                Add Comment
              </button>
            </div>


            {/* Approve/Reject Actions — For Admin/SuperAdmin/Department */}
            {isAuthorized && (
              <div className="mt-4 pt-3 border-top">
                <h6 className="mb-3">Approval Actions</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-success flex-fill"
                    onClick={handleApprove}
                    disabled={loading || currentStatus === "approved"}
                  >
                    {currentStatus === "approved" ? "✓ Approved" : "✓ Approve"}
                  </button>
                  <button
                    className="btn btn-danger flex-fill"
                    onClick={handleReject}
                    disabled={loading || currentStatus === "rejected"}
                  >
                    {currentStatus === "rejected" ? "✗ Rejected" : "✗ Reject"}
                  </button>
                  <button
                    className="btn btn-warning flex-fill text-dark"
                    onClick={async () => {
                      const confirmPending = window.confirm("Are you sure you want to set this status back to Pending?");
                      if (!confirmPending) return;
                      setLoading(true);
                      try {
                        const deptId = department?.department?.id || department?.userId;
                        const response = await patch(`${endpoints.update_workflow_status}`, {
                          intakeRequestId: id,
                          departmentId: deptId,
                          status: "pending",
                          comment: comment || "Status reset to Pending",
                        });
                        if (response.status) {
                          alert("Status set to Pending successfully");
                          setCurrentStatus("pending");
                          setComment("");
                          fetchWorkflowDatafunction();
                          onClose();
                        } else {
                          alert(response.message || "Failed to update status");
                        }
                      } catch (error) {
                        alert("Error while updating status");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || currentStatus === "pending"}
                  >
                    <i className="fa-solid fa-clock me-1"></i>
                    Pending
                  </button>
                </div>
                {currentStatus === "pending" && (
                  <small className="text-muted d-block mt-2">
                    Note: Rejection requires a comment explaining the reason.
                  </small>
                )}
              </div>
            )}
            {!isAuthorized && (
              <div className="mt-4 pt-3 border-top">
                <p className="text-muted fst-italic mb-0">
                  <i className="fa-solid fa-lock me-2"></i>
                  Only Authorized Users can perform Approve or Reject actions.
                </p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;
