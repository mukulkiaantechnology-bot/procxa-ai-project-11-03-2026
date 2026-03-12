import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import RequestFlowModal from "./RequestFlowModal";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";

const ApprovalWork = () => {
  const { get, patch } = useApi();
  const [approvalData, setApprovalData] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedContracts, setSelectedContracts] = useState({});
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const isAdminOrSuperAdmin = userType === "admin" || userType === "superadmin";
  const [selectedRequestForFlow, setSelectedRequestForFlow] = useState(null);
  const [showFlowModal, setShowFlowModal] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 7,
  });

  const fetchApprovalRequests = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      const response = await get(endpoints.getAllNotPendingIntakeRequests, { params });

      const data = Array.isArray(response?.data) ? response.data : [];
      setApprovalData(data);

      if (data.length > 0) {
        // Prefill selected contracts
        const prefillSelected = {};
        const prefillEdit = {};
        data.forEach((item) => {
          if (item?.id) {
            if (item.assigncontractTemplateId) {
              prefillSelected[item.id] = item.assigncontractTemplateId;
              prefillEdit[item.id] = false;
            } else {
              prefillEdit[item.id] = true; // allow assigning if not yet assigned
            }
          }
        });
        setSelectedContracts(prefillSelected);
        setEditMode(prefillEdit);

        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages: response.pagination?.totalPages || 1,
          totalRecords: response.totalRecords || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching approval requests:", error);
      setApprovalData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractsTemplate = async () => {
    try {
      const response = await get(endpoints.getAllContractTemplates);
      setContracts(Array.isArray(response?.templates) ? response.templates : []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setContracts([]);
    }
  };

  const handleContractChange = (requestId, contractId) => {
    setSelectedContracts((prev) => ({
      ...prev,
      [requestId]: contractId,
    }));
  };

  const handleAssignContract = async (requestId) => {
    const contractId = selectedContracts[requestId];
    if (!contractId) {
      alert("Please select a contract to assign.");
      return;
    }

    try {
      await patch(`${endpoints.updateIntakeRequest}/${requestId}`, {
        assigncontractTemplateId: contractId,
      });
      alert("Contract assigned successfully!");
      fetchApprovalRequests(pagination.currentPage);
    } catch (error) {
      console.error("Error assigning contract:", error);
      alert("Failed to assign contract.");
    }
  };

  const handleEditMode = (requestId) => {
    setEditMode((prev) => ({
      ...prev,
      [requestId]: true,
    }));
  };

  useEffect(() => {
    fetchApprovalRequests();
    fetchContractsTemplate();
  }, []);
  const handleViewClick = (item) => {
    if (item && item.id) {
       navigate(`/contractapproval/${item.id}`);
    }
  };

  const openFlowModal = (item) => {
    setSelectedRequestForFlow(item);
    setShowFlowModal(true);
  };

  return (
    <div className="container-fluid px-2 px-md-3 py-2 py-md-4">
      <h3 className="mb-3 mb-md-4 fw-bold" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>Approval Requests</h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !approvalData || approvalData.length === 0 ? (
        <div className="card text-center p-4">
          <p className="text-muted mb-0">No approval requests found.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="d-block d-md-none">
            {approvalData.map((item) => {
              const isAssigned = !!item.assigncontractTemplateId;
              const isEditable = editMode[item.id];

              return (
                <div key={item.id} className="card mb-3">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
                        Request ID: {item.id}
                      </h6>
                      <span
                        role="button"
                        onClick={() => handleViewClick(item)}
                        style={{ color: "#0d99ff", cursor: "pointer", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                        title="View"
                      >
                        <i className="fa-regular fa-eye" />
                      </span>
                    </div>

                    <div className="row mb-2">
                      <div className="col-6">
                        <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
                        <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                          {item.department?.name || "N/A"}
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
                        <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                          {item.supplierName || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-6">
                        <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Request Type:</small>
                        <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                          {item.requestType || "N/A"}
                        </p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Date:</small>
                        <p className="mb-1" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isAdminOrSuperAdmin && (
                      <div className="mt-3 pt-2 border-top">
                        <small className="text-muted d-block mb-2" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Select Contract Template:</small>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex gap-2 align-items-center">
                            <select
                              className="form-select w-100"
                              value={selectedContracts[item.id] || ""}
                              disabled={!isEditable || !isAdminOrSuperAdmin}
                              onChange={(e) =>
                                handleContractChange(item.id, e.target.value)
                              }
                              style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                            >
                              <option value="">Select Contract</option>
                              {Array.isArray(contracts) && contracts.map((contract) =>
                                contract.aggrementName ? (
                                  <option key={contract.id} value={contract.id}>
                                    {contract.aggrementName}
                                  </option>
                                ) : null
                              )}
                            </select>

                            {item.contractTemplate && (
                               <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => {
                                    if (item.contractTemplate?.customAgreementFile) {
                                      const filePath = item.contractTemplate.customAgreementFile;
                                      const url = filePath.startsWith('http') 
                                        ? filePath 
                                        : `${import.meta.env.VITE_APP_API_BASE_URL || ""}/${filePath.replace(/\\/g, "/")}`;
                                      window.open(url, "_blank");
                                    }
                                  }}
                                  title="View PDF"
                               >
                                 <i className="fa-solid fa-eye"></i>
                               </button>
                            )}

                          </div>

                          {isAdminOrSuperAdmin && (
                            <div className="mt-2 text-center">
                              {isEditable ? (
                                <button
                                  className="btn btn-sm btn-primary w-100"
                                  onClick={() => handleAssignContract(item.id)}
                                  style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                                >
                                  Save Assignment
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-secondary w-100"
                                  onClick={() => handleEditMode(item.id)}
                                  style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                                >
                                  Modify Assignment
                                </button>
                              )}
                            </div>
                          )}


                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="table-responsive d-none d-md-block" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="table table-bordered text-center align-middle table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Request ID</th>
                  <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Requester Department</th>
                  <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Supplier Name</th>
                  <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Request Date</th>
                  <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Request Type</th>
                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Action</th>
                  <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Assigned Contract Template</th>
                </tr>
              </thead>
              <tbody>
                {approvalData.map((item) => {
                  const isAssigned = !!item.assigncontractTemplateId;
                  const isEditable = editMode[item.id];

                  return (
                    <tr key={item.id}>
                      <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{item.id}</td>
                      <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{item.department?.name || "N/A"}</td>
                      <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{item.supplierName}</td>
                      <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{item.requestType}</td>
                      <td>
                        <span
                          role="button"
                          onClick={() => handleViewClick(item)}
                          style={{ color: "#0d99ff", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)", marginRight: "10px" }}
                          title="View"
                        >
                          <i className="fa-regular fa-eye" />
                        </span>
                        {isAdminOrSuperAdmin && (
                          <span
                            role="button"
                            onClick={() => openFlowModal(item)}
                            style={{ color: "#28a745", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
                            title="Set Workflow"
                          >
                            <i className="fa-solid fa-route" />
                          </span>
                        )}
                      </td>
                      <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center flex-wrap">
                            <select
                              className="form-select flex-fill"
                              style={{ minWidth: "150px", fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
                              value={selectedContracts[item.id] || ""}
                              disabled={!isEditable || !isAdminOrSuperAdmin}
                              onChange={(e) =>
                                handleContractChange(item.id, e.target.value)
                              }
                            >
                              <option value="">Select Contract</option>
                              {Array.isArray(contracts) && contracts.map((contract) =>
                                contract.aggrementName ? (
                                  <option key={contract.id} value={contract.id}>
                                    {contract.aggrementName}
                                  </option>
                                ) : null
                              )}
                            </select>

                            {item.contractTemplate ? (
                              <button
                                className="btn btn-sm btn-outline-info flex-shrink-0"
                                onClick={() => {
                                  if (item.contractTemplate?.customAgreementFile) {
                                    const filePath = item.contractTemplate.customAgreementFile;
                                    const url = filePath.startsWith('http') 
                                      ? filePath 
                                      : `${import.meta.env.VITE_APP_API_BASE_URL || ""}/${filePath.replace(/\\/g, "/")}`;
                                    window.open(url, "_blank");
                                  } else {
                                    alert("No PDF file associated with this template.");
                                  }
                                }}
                                title={`View ${item.contractTemplate.aggrementName || 'Contract'} PDF`}
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                            ) : (
                               <span className="text-muted small">No Template</span>
                            )}

                            
                            {isAdminOrSuperAdmin && (
                              isEditable ? (
                                <button
                                  className="btn btn-sm btn-success flex-shrink-0"
                                  onClick={() => handleAssignContract(item.id)}
                                  title="Save Assignment"
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-warning flex-shrink-0"
                                  onClick={() => handleEditMode(item.id)}
                                  title="Change Assignment"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                              )
                            )}



                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>


          {/* Pagination */}
          <nav aria-label="Page navigation" className="mt-3 mt-md-4">
            <ul className="pagination justify-content-center flex-wrap">
              <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.currentPage > 1 && fetchApprovalRequests(pagination.currentPage - 1);
                  }}
                  disabled={pagination.currentPage === 1}
                  style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)", minWidth: "80px" }}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: pagination.totalPages }, (_, index) => (
                <li key={index} className={`page-item mx-1 ${pagination.currentPage === index + 1 ? "active" : ""}`}>
                  <button
                    className={`page-link ${pagination.currentPage === index + 1 ? "active text-white" : ""}`}
                    style={{
                      backgroundColor: pagination.currentPage === index + 1 ? "#0096d4" : "",
                      fontSize: "clamp(0.875rem, 2vw, 1rem)",
                      minWidth: "40px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      fetchApprovalRequests(index + 1);
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    pagination.currentPage < pagination.totalPages && fetchApprovalRequests(pagination.currentPage + 1);
                  }}
                  disabled={pagination.currentPage === pagination.totalPages}
                  style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)", minWidth: "80px" }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
      {/* Modal for setting custom flow */}
      {selectedRequestForFlow && (
        <RequestFlowModal
          show={showFlowModal}
          onHide={() => setShowFlowModal(false)}
          requestId={selectedRequestForFlow.id}
          onSaveSuccess={fetchApprovalRequests}
        />
      )}
    </div>
  );
};

export default ApprovalWork;
