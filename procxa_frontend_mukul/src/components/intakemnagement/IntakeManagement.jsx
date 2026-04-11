import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { Link, useNavigate } from "react-router-dom";

const IntakeManagement = () => {
  const { get, post, del, patch } = useApi();

  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    pendingApprovals: 0,
    approvedRequests: 0,
    activeRequests: 0,
    allRequests: [],
    pagination: { currentPage: 1, totalPages: 0, totalRecords: 0, limit: 7 },
  });
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState("All Approvals");
  const [searchTerm, setSearchTerm] = useState("");

  const handleIconClick = (request) => {
    navigate(`/editIntakeRequest/${request.id}`);
  };

  const handleOpenModal = async (request) => {
    try {
      const response = await get(`${endpoints.getIntakeRequestById}/${request.id}`);
      if (response && response.data) {
        setSelectedRequest(response.data);
        setShowModal(true);
      } else {
        alert("Failed to fetch full request details");
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      alert("Error fetching request details");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this intake request?")) {
      try {
        const response = await del(`${endpoints.deleteIntakeRequest}/${requestId}`);
        if (response && response.status) {
          alert("Request deleted successfully");
          // Refresh the list
          setDashboardData(prev => ({
            ...prev,
            allRequests: prev.allRequests.filter(r => r.id !== requestId),
            totalRequests: prev.totalRequests - 1
          }));
        } else {
          alert(response?.message || "Failed to delete request");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        alert("An error occurred while deleting the request");
      }
    }
  };

  useEffect(() => {
    fetchDashboardData(1, dashboardData.pagination.limit, filterStatus);
  }, [filterStatus]);

  const fetchDashboardData = async (page = 1, limit = 7, status = filterStatus, search = searchTerm) => {
    try {
      let queryUrl = `${endpoints.intakeDashboard}?page=${page}&limit=${limit}`;
      if (status && status !== 'All Approvals') queryUrl += `&status=${encodeURIComponent(status)}`;
      if (search) queryUrl += `&searchTerm=${encodeURIComponent(search)}`;

      const response = await get(queryUrl);
      setDashboardData({
        pendingApprovals: response.data.pendingApprovals,
        allRequests: response.data.allRequests,
        totalRequests: response.data.totalRequests,
        approvedRequests: response.data.approvedRequests,
        activeRequests: response.data.activeRequests,
        pagination: response.data.pagination,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const debounceRef = useRef(null);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchDashboardData(1, dashboardData.pagination.limit, filterStatus, value);
    }, 300);
  };





  const handleToggle = async (requestId, isChecked) => {
    try {
      const response = await patch(`${endpoints.updatestatus}/${requestId}`, {});
      const updatedRequest = response.data;

      setDashboardData((prevData) => ({
        ...prevData,
        allRequests: prevData.allRequests.map((req) =>
          req.id === requestId ? { ...req, status: updatedRequest.status } : req
        ),
      }));

      console.log(`Status updated to ${updatedRequest.status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  const handlePageChange = (page) => {
    fetchDashboardData(page, dashboardData.pagination.limit);
  };

  const isPrevDisabled = dashboardData.pagination.currentPage === 1;
  const isNextDisabled = dashboardData.pagination.currentPage === dashboardData.pagination.totalPages;

  return (
    <div className="container-fluid px-2 px-md-3 py-2">
      <div className="top d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <div className="heading flex-fill mb-2 mb-md-0">
          <h3 className="mb-1 mb-md-2 fw-bold" style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)" }}>
            Welcome to Intake Management Portal
          </h3>
          <p className="text-dark mb-0" style={{ fontSize: "clamp(0.8rem, 2.3vw, 0.95rem)" }}>
            Centralize your procurement requests and track approvals seamlessly
          </p>
        </div>
        <div className="mt-0 mt-md-0">
          <Link
            className="btn fw-semibold px-3 text-white d-flex align-items-center"
            to="/intakenewreq"
            style={{ backgroundColor: "#578e7e", fontSize: "clamp(0.8rem, 2.3vw, 0.95rem)" }}
          >
            <i className="fa-solid fa-plus me-2" />
            New Request
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row text-center mb-3 g-2">
        <div className="col-12 col-sm-6 col-lg-3 mb-2">
          <div
            className="card portalcard text-white fw-semibold h-100"
            style={{ backgroundColor: "#ff6567" }}
          >
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i
                  className="fa-regular fa-user rounded-circle p-3"
                  style={{
                    backgroundColor: "#fdabab",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{dashboardData?.totalRequests || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Total Requests</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2">
              <div className="icon-wrapper flex-shrink-0">
                <i
                  className="fa-regular fa-user rounded-circle p-2 p-md-3"
                  style={{
                    backgroundColor: "#fdabab",
                    fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>{dashboardData?.totalRequests || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Total Requests</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-2">
          <div
            className="card portalcard status-active text-white fw-semibold h-100"
            style={{ backgroundColor: "#0d6efd" }}
          >
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i
                  className="fa-regular fa-user rounded-circle p-3"
                  style={{
                    backgroundColor: "#5f9bf6",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{dashboardData?.activeRequests || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Active</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2">
              <div className="icon-wrapper flex-shrink-0">
                <i
                  className="fa-regular fa-user rounded-circle p-2 p-md-3"
                  style={{
                    backgroundColor: "#5f9bf6",
                    fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>{dashboardData?.activeRequests || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Active</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-2">
          <div
            className="card portalcard status-pending text-white fw-semibold h-100"
            style={{ backgroundColor: "#ff9318" }}
          >
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i
                  className="fa-regular fa-user rounded-circle p-3"
                  style={{
                    backgroundColor: "#fcc586",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{dashboardData?.pendingApprovals || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Pending Approvals</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2">
              <div className="icon-wrapper flex-shrink-0">
                <i
                  className="fa-regular fa-user rounded-circle p-2 p-md-3"
                  style={{
                    backgroundColor: "#fcc586",
                    fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>{dashboardData?.pendingApprovals || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Pending Approvals</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-2">
          <div
            className="card portalcard status-approved text-white fw-semibold h-100"
            style={{ backgroundColor: "#39bf1b" }}
          >
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i
                  className="fa-regular fa-user rounded-circle p-3"
                  style={{
                    backgroundColor: "#74d25f",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{dashboardData?.approvedRequests || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Approved</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2">
              <div className="icon-wrapper flex-shrink-0">
                <i
                  className="fa-regular fa-user rounded-circle p-2 p-md-3"
                  style={{
                    backgroundColor: "#74d25f",
                    fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>{dashboardData?.approvedRequests || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table and Filters */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-2 mb-3">
        <h4 className="fw-semibold mb-2 mb-md-0" style={{ fontSize: "clamp(0.9rem, 2.7vw, 1.1rem)" }}>Recent Activity</h4>
        
        <div className="d-flex flex-column flex-sm-row gap-2">
          <input
            className="form-control form-control-sm"
            style={{ minWidth: "200px" }}
            type="search"
            placeholder="Search by ID, supplier, requester, dept, type..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchInput}
          />
          
          <select 
            className="form-select form-select-sm w-auto" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All Approvals">All Approvals</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="d-block d-md-none">
        {dashboardData.allRequests?.length > 0 ? (
          dashboardData.allRequests.map((request) => (
            <div key={request.id} className="card mb-3 mobile-request-card">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title mb-0 fw-bold text-truncate" style={{ fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)" }}>
                    Request ID: {request.id} <br/>
                    <small className="text-primary fw-normal">({request.requestType})</small>
                  </h6>
                  <span className={`badge ${
                    request.status === 'approved' ? 'bg-success' : 
                    request.status === 'rejected' ? 'bg-danger' : 
                    request.status === 'pending' ? 'bg-warning' : 
                    request.status === 'active' ? 'bg-primary' : 'bg-secondary'
                  } flex-shrink-0 ms-2 text-capitalize`} style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>
                    {request.status || 'pending'}
                  </span>
                </div>

                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Requester:</small>
                    <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>{request.requesterName}</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
                    <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                      {request["department.name"] || request.department?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
                    <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                      {request.supplierName || "Not Assigned"}
                    </p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Date:</small>
                    <p className="mb-1" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <small className="text-muted d-block mb-2" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Actions:</small>
                  <div className="d-flex gap-3">
                    <i
                      className="fa-regular fa-eye"
                      style={{ color: "#0d99ff", cursor: "pointer", fontSize: "1.2rem" }}
                      title="View"
                      onClick={() => handleOpenModal(request)}
                    />
                    <i
                      className="fa-regular fa-pen-to-square"
                      style={{ color: "#578E7E", cursor: "pointer", fontSize: "1.2rem" }}
                      title="Edit"
                      onClick={() => handleIconClick(request)}
                    />
                    <i
                      className="fa-regular fa-trash-can"
                      style={{ color: "#ff4d4f", cursor: "pointer", fontSize: "1.2rem" }}
                      title="Delete"
                      onClick={() => handleDelete(request.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center p-4">
            <div className="card-body">
              <div className="mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto text-muted">
                  <path d="M9 2L3 9V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V9L15 2H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)" }}>No requests available</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table className="table table-striped table-bordered text-center">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Supplier Name</th>
              <th>Request Name</th>
              <th>Department</th>
              <th>Request Type</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.allRequests?.length > 0 ? (
              dashboardData.allRequests.map((request) => {
                return (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.supplierName || "Not Assigned"}</td>
                    <td>{request.requesterName}</td>
                    <td>{request["department.name"] || request.department?.name || "N/A"}</td>
                    <td>{request.requestType}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        request.status === 'approved' ? 'bg-success' : 
                        request.status === 'rejected' ? 'bg-danger' : 
                        request.status === 'pending' ? 'bg-warning' : 
                        request.status === 'active' ? 'bg-primary' : 'bg-secondary'
                      } text-capitalize`}>
                        {request.status || 'pending'}
                      </span>
                    </td>
                    <td className="text-center align-middle">
                      <div className="d-flex justify-content-center gap-2">
                        <i
                          className="fa-regular fa-eye"
                          style={{ color: "#0d99ff", cursor: "pointer" }}
                          title="View"
                          onClick={() => handleOpenModal(request)}
                        />
                        <i
                          className="fa-regular fa-pen-to-square"
                          style={{ color: "#578E7E", cursor: "pointer" }}
                          title="Edit"
                          onClick={() => handleIconClick(request)}
                        />
                        <i
                          className="fa-regular fa-trash-can"
                          style={{ color: "#ff4d4f", cursor: "pointer" }}
                          title="Delete"
                          onClick={() => handleDelete(request.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">No requests available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>More Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest ? (
            <div className="p-2">
              <div className="row mb-2">
                <div className="col-6"><strong>Request ID:</strong></div>
                <div className="col-6">{selectedRequest.id}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Request Type:</strong></div>
                <div className="col-6 text-capitalize">{selectedRequest.requestType || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Status:</strong></div>
                <div className="col-6 text-capitalize">{selectedRequest.status}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Item Description:</strong></div>
                <div className="col-6">{selectedRequest.itemDescription || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Requester Name:</strong></div>
                <div className="col-6">{selectedRequest.requesterName || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Requester Email:</strong></div>
                <div className="col-6">{selectedRequest.requesterEmail || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Supplier Name:</strong></div>
                <div className="col-6">{selectedRequest.supplierName || selectedRequest.supplier?.name || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Supplier Email:</strong></div>
                <div className="col-6">{selectedRequest.supplierEmail || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Requested Amount:</strong></div>
                <div className="col-6">{selectedRequest.requestedAmount || "N/A"}</div>
              </div>
            </div>
          ) : (
            <p>No request selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Mobile-friendly Pagination */}
      <nav aria-label="Page navigation" className="mt-3">
        <ul className="pagination justify-content-center flex-wrap">
          {/* Previous Button */}
          <li className={`page-item ${isPrevDisabled ? "disabled" : ""}`}>
            <button
              className="page-link text-secondary"
              style={{ border: "none", minWidth: "70px", fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}
              onClick={() => !isPrevDisabled && handlePageChange(dashboardData.pagination.currentPage - 1)}
              disabled={isPrevDisabled}
              tabIndex={isPrevDisabled ? -1 : undefined}
              aria-disabled={isPrevDisabled}
            >
              Previous
            </button>
          </li>

          {/* Page Numbers - Show limited on mobile */}
          {(() => {
            const currentPage = dashboardData.pagination.currentPage;
            const totalPages = dashboardData.pagination.totalPages;
            let pages = [];

            // Always show first page
            if (currentPage > 3) {
              pages.push(1);
              if (currentPage > 4) {
                pages.push('...');
              }
            }

            // Show pages around current page
            for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
              pages.push(i);
            }

            // Always show last page
            if (currentPage < totalPages - 2) {
              if (currentPage < totalPages - 3) {
                pages.push('...');
              }
              pages.push(totalPages);
            }

            return pages.map((page, index) => {
              if (page === '...') {
                return (
                  <li key={`ellipsis-${index}`} className="page-item disabled">
                    <span className="page-link" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>...</span>
                  </li>
                );
              }

              return (
                <li
                  key={page}
                  className={`page-item mx-1 ${currentPage === page ? "active" : ""}`}
                >
                  <button
                    className={`page-link rounded fw-semibold ${currentPage === page
                      ? "text-white"
                      : "text-dark"
                      }`}
                    style={{
                      backgroundColor:
                        currentPage === page
                          ? "#0096d4"
                          : "rgb(212, 212, 212)",
                      fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)",
                      minWidth: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            });
          })()}

          {/* Next Button */}
          <li className={`page-item ${isNextDisabled ? "disabled" : ""}`}>
            <button
              className="page-link text-secondary"
              style={{ border: "none", minWidth: "70px", fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}
              onClick={() => !isNextDisabled && handlePageChange(dashboardData.pagination.currentPage + 1)}
              disabled={isNextDisabled}
              tabIndex={isNextDisabled ? -1 : undefined}
              aria-disabled={isNextDisabled}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Custom CSS for mobile responsiveness */}
      <style>{`
        .mobile-request-card {
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .mobile-request-card:active {
          transform: scale(0.98);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .form-select {
          border-radius: 0.375rem;
          border: 1px solid #ced4da;
          background-color: #fff;
        }
        
        .form-select:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        /* Ensure proper touch targets */
        .form-select, .btn {
          min-height: 44px;
        }
        
        @media (max-width: 576px) {
          .portalcard {
            min-height: 140px;
          }
          
          .portalcard .content {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .portalcard .icon-wrapper {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            overflow: hidden;
          }
          
          .portalcard .icon-wrapper i {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          
          .portalcard .text {
            overflow: hidden;
            word-wrap: break-word;
          }
          
          .portalcard .card-title {
            line-height: 1.2;
            word-break: break-word;
          }
          
          .portalcard p {
            line-height: 1.2;
          }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          .portalcard {
            min-height: 100px;
          }
          
          .portalcard .icon-wrapper {
            width: 50px;
            height: 50px;
          }
        }
        
        @media (min-width: 769px) {
          .portalcard {
            min-height: 90px;
          }
          
          .portalcard .icon-wrapper {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default IntakeManagement;