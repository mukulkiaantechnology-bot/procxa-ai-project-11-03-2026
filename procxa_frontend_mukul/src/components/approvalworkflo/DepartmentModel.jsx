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
  const { del, patch, post } = useApi();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    if (department) {
      // Handle both nested and flat structures
      const deptName = department?.department?.name || department?.departmentName || "";
      const deptEmail = department?.department?.email_id || department?.email || "";
      const deptRole = department?.department?.role || department?.departmentType || department?.role || "";
      
      setEditedName(deptName);
      setEditedEmail(deptEmail);
      setEditedRole(deptRole);
      setCurrentStatus(department?.status || "pending");
    }
  }, [department]);

  if (!show || !department) return null;

  const handleSave = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      alert("Both name and email are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await patch(
        `${endpoints.updateDepartment}/${department?.department?.id}`,
        {
          name: editedName,
          email_id: editedEmail,
          role: editedRole,
        }
      );

      if (response.status) {
        alert("Department updated successfully");
        setIsEditing(false);
        onClose();
        fetchDepartments();
      } else {
        alert(response.message || "Failed to update department");
      }
    } catch (error) {
      alert("Error while updating department");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await del(`${endpoints.deleteDepartment}/${department?.department?.id}`);
      if (response.status) {
        alert("Department deleted successfully");
        onClose();
        fetchDepartments();
      } else {
        alert(response.message || "Failed to delete department");
      }
    } catch (error) {
      alert("Error while deleting department");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComment = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment before saving.");
      return;
    }

    try {
      const response = await post(`${endpoints.addComment}`, {
        comment,
        selectedRequestId: id,
        userType: localStorage.getItem("userType"),
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
  };

  const handleApprove = async () => {
    const confirmApprove = window.confirm("Are you sure you want to approve this department?");
    if (!confirmApprove) return;

    setLoading(true);
    try {
      const deptId = department?.department?.id || department?.userId; // Handle both
      const response = await patch(`${endpoints.update_workflow_status}`, {
        intakeRequestId: id,
        departmentId: deptId,
        status: "approved",
        comment: comment || "Approved",
      });

      if (response.status) {
        alert("Department approved successfully");
        setCurrentStatus("approved");
        setComment("");
        fetchWorkflowDatafunction();
        onClose();
      } else {
        alert(response.message || "Failed to approve department");
      }
    } catch (error) {
      console.error("Error approving department:", error);
      alert("Error while approving department");
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

            {/* Editable Name and Email */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              {isEditing ? (
                <div className="w-100">
                  <div className="mb-2 d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Department Name"
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-2 d-flex gap-2">
                    <input
                      type="email"
                      className="form-control"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      placeholder="Department Email"
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-2 d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      placeholder="Role (e.g., Quant)"
                      disabled={loading}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={handleSave} disabled={loading}>
                      <FaCheck />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setIsEditing(false)} disabled={loading}>
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-100">
                  <h5 className="mb-1">{department?.department?.name || department?.departmentName}</h5>
                  <p className="text-muted mb-1">{department?.department?.email_id || department?.email || "No email provided"}</p>
                  <p className="text-muted mb-1"><strong>Role:</strong> {department?.department?.role || department?.departmentType || department?.role || "Not Assigned"}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setEditedName(department?.department?.name || department?.departmentName || "");
                        setEditedEmail(department?.department?.email_id || department?.email || "");
                        setEditedRole(department?.department?.role || department?.departmentType || department?.role || "");
                        setIsEditing(true);
                      }}
                      title="Edit Department"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDelete}
                      title="Delete Department"
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PDF View Button - New Feature */}
            {department?.contractTemplate?.customAgreementFile && (
              <div className="mb-3">
                <button
                  className="btn btn-info btn-sm w-100 text-white"
                  onClick={() => {
                    const filePath = department.contractTemplate.customAgreementFile;
                    const url = filePath.startsWith('http') 
                      ? filePath 
                      : `${import.meta.env.VITE_APP_API_BASE_URL || ""}/${filePath.replace(/\\/g, "/")}`;
                    window.open(url, "_blank");
                  }}

                >
                  <i className="fa-solid fa-file-pdf me-2"></i>
                  View Contract Template PDF
                </button>
              </div>
            )}

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


            {/* Approve/Reject Actions — Only for Admin/SuperAdmin */}
            {isAdminOrSuperAdmin && (
              <div className="mt-4 pt-3 border-top">
                <h6 className="mb-3">Approval Actions</h6>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success flex-fill"
                    onClick={handleApprove}
                    disabled={loading || currentStatus === "approved"}
                  >
                    {currentStatus === "approved" ? "✓ Already Approved" : "✓ Approve"}
                  </button>
                  <button
                    className="btn btn-danger flex-fill"
                    onClick={handleReject}
                    disabled={loading || currentStatus === "rejected"}
                  >
                    {currentStatus === "rejected" ? "✗ Already Rejected" : "✗ Reject"}
                  </button>
                </div>
                {currentStatus === "pending" && (
                  <small className="text-muted d-block mt-2">
                    Note: Rejection requires a comment explaining the reason.
                  </small>
                )}
              </div>
            )}
            {!isAdminOrSuperAdmin && (
              <div className="mt-4 pt-3 border-top">
                <p className="text-muted fst-italic mb-0">
                  <i className="fa-solid fa-lock me-2"></i>
                  Only Admin / SuperAdmin can perform Approve or Reject actions.
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
