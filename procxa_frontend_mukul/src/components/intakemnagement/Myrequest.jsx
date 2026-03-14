import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const Myrequest = () => {
  const { get, patch, post, del } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState({});
  const [selectedSuppliers, setSelectedSuppliers] = useState({});

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 7,
  });
  const [requestType, setRequestType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    id: "",
    supplier: "",
    requestType: "",
    itemDescription: "",
    requesterDepartment: "",
    date: "",
    status: "",
  });

  const handleIconClick = (request) => {
    navigate(`/editIntakeRequest/${request.id}`)
    // setIsModalOpen(true);
    setFormValues({
      id: request.id || "",
      supplier: request.supplier?.name || "",
      requestType: request.requestType || "",
      date: request.createdAt || "",
      status: request.status || "",
      itemDescription: request.itemDescription || "",
      requesterDepartment: request.department?.name || ""
    });
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await patch(`${endpoints.updateIntakeRequest}/${formValues.id}`, formValues);

      if (response.status) {
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === formValues.id ? { ...request, ...formValues } : request
          ))

        console.log(response.message || "Request updated successfully");
      } else {
        console.error("Failed to update request");
      }
    } catch (error) {
      console.error("Error while saving request:", error.message);
    }

    // Close the modal
    setIsModalOpen(false);
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

  const fetchMyRequests = async (page = 1) => {
    try {
      const params = {
        page,
        limit: pagination.limit,
        requestType, // Add the requestType filter
        status, // Add the status filter
      };

      const response = await get(endpoints.getIntakeRequest, { params });
      setRequests(response.data || []);
      if (response.data && response.data.length > 0) {
        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages: response.pagination.totalPages,
          totalRecords: response.totalRecords,
        }));
      } else {
        setPagination((prev) => ({ ...prev, totalPages: 0, totalRecords: 0 }));
        console.error(response.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Trigger fetchMyRequests when the page or filter changes
  useEffect(() => {
    fetchSuppliers()
    fetchMyRequests(pagination.currentPage);
  }, [pagination.currentPage, requestType, status]); // Add requestType and status to dependencies

  const handleRequestTypeChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // const handleSearch = () => {
  //   setRequestType(searchTerm);
  //   setPagination((prev) => ({ ...prev, currentPage: 1 }));
  // };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const handleOpenCommentModal = (requestId) => {
    setSelectedRequestId(requestId);
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleSaveComment = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment before saving.");
      return;
    }
    local
    try {
      const response = await post(`${endpoints.addComment}`, { comment, selectedRequestId });

      if (response.status) {
        alert("Comment added successfully");
        setComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error while adding comment:", error.message);
    }
  };
  const fetchSuppliers = async () => {
    try {
      const response = await get(endpoints.getSuppliers);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };


  const handleToggle = (requestId, isChecked) => {
    const selectedSupplier = selectedSuppliers[requestId];
    if (isChecked) {
      if (!selectedSupplier) {
        alert("Please select a supplier before assigning.");
        return;
      }
      handleSupplierAssign(requestId, selectedSupplier);
    } else {
      handleSupplierUnassign(requestId);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const response = await del(`${endpoints.deleteIntakeRequest}/${requestId}`);
        if (response.status) {
          alert("Request deleted successfully");
          fetchMyRequests(pagination.currentPage);
        } else {
          alert(response.message || "Failed to delete request");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        alert("An error occurred while deleting the request");
      }
    }
  };



  return (
    <>
      <div className="container mt-5">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h3 className="fw-bold">My Requests</h3>
            <p className="text-dark mb-0">Track the status of your submitted requests</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/intakenewreq">
              <button
                className="btn btn-create px-2 py-2 text-white fw-semibold"
                style={{ backgroundColor: "#578e7e" }}
              >
                <i className="fa-solid fa-book me-1" />
                Create New Request
              </button>
            </Link>

            <button
              style={{
                width: "120px",
                height: "39px",
                border: "none",
                backgroundColor: "#578E7E",
                color: "white",
                borderRadius: "5px",
              }}
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>

          </div>
        </div>

        {/* Filters Section */}
        <div className="row mb-4 mt-5 gx-3">
          <h5>Filters</h5>
          {/* <div className="col-12 col-md-6 col-lg-4 mb-3">
          
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control p-3 text-secondary fw-semibold"
                placeholder="Enter Request Type"
                onChange={handleRequestTypeChange}
                value={searchTerm}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="btn text-white px-4 fw-semibold"
                style={{ backgroundColor: "#578e7e" }}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div> */}
          <div className="col-12 col-md-6 col-lg-4">
            <select
              className="form-select p-3 text-secondary fw-semibold"
              onChange={handleStatusChange}
              value={status}
            >
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Request ID</th>
                <th>Requester Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Supplier Assigned</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td style={{ fontSize: '18px', fontWeight: 'bold' }}>{request.id}</td>
                    <td>{request.requesterName || "N/A"}</td>
                    <td>{request.department ? request.department.name : "N/A"}</td>
                    <td>
                      {request.status
                        ? request.status.charAt(0).toUpperCase() + request.status.slice(1)
                        : "N/A"}
                    </td>
                    <td>{request.supplierName || "N/A"}</td>
                    <td>
                      {request.createdAt ? request.createdAt.split('T')[0] : "N/A"}
                    </td>
                    <td className="action-icons">

                      <i
                        className="fa-regular fa-eye"
                        style={{ color: "#0d99ff", cursor: "pointer" }}
                        title="View"
                        onClick={() => handleOpenModal(request)}
                      />


                      <i
                        className="fa-regular fa-pen-to-square me-2 ms-2 myrequestedit"
                        style={{ fontSize: "15px", cursor: "pointer" }}
                        onClick={() => handleIconClick(request)}
                        data-bs-placement="top"
                        title="Edit"
                      />
                      <i
                        className="fa-regular fa-trash-can ms-2"
                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                        title="Delete"
                        onClick={() => handleDelete(request.id)}
                      />
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No requests available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Section */}
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

        {/* Pagination Section */}
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center flex-wrap">
            <li className="page-item">
              <a
                className="page-link text-secondary"
                href="#"
                style={{ border: "none" }}
                onClick={() => pagination.currentPage > 1 && fetchMyRequests(pagination.currentPage - 1)}
              >
                Previous
              </a>
            </li>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li key={index} className="page-item mx-1">
                <a
                  className={`page-link rounded fw-semibold ${pagination.currentPage === index + 1 ? "text-white" : "text-dark"}`}
                  href="#"
                  style={{
                    backgroundColor: pagination.currentPage === index + 1 ? "#0096d4" : "rgb(212, 212, 212)",
                  }}
                  onClick={() => fetchMyRequests(index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a
                className="page-link text-secondary"
                href="#"
                style={{
                  border: "none",
                  whiteSpace: "nowrap",   // ✅ text break nahi hoga
                  display: "inline-flex", // ✅ proper alignment
                  alignItems: "center",
                }}
                onClick={() =>
                  pagination.currentPage < pagination.totalPages &&
                  fetchMyRequests(pagination.currentPage + 1)
                }
              >
                Next
              </a>
            </li>

          </ul>
        </nav>

        {/* Modal */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 1000,
            }}
          >
            <h3>Edit Request</h3>
            {/* Inputs */}
            <input
              type="text"
              name="id"
              value={formValues.id}
              onChange={handleInputChange}
              placeholder="001"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {/* <input
              type="text"
              name="supplier"
              value={formValues.supplier}
              onChange={handleInputChange}
              placeholder="001"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            /> */}
            {/* <input
              type="text"
              name="requestType"
              value={formValues.requestType}
              onChange={handleInputChange}
              placeholder="Goods"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            /> */}
            <input
              type="text"
              name="date"
              value={formValues.date}
              onChange={handleInputChange}
              placeholder="2024-12-18"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              name="itemDescription"
              value={formValues.itemDescription}
              onChange={handleInputChange}
              placeholder="itemDescription"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />

            <input
              type="text"
              name="requesterDepartment"
              value={formValues.requesterDepartment}
              onChange={handleInputChange}
              placeholder="requesterDepartment"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              name="date"
              value={formValues.date}
              onChange={handleInputChange}
              placeholder="Submission Date"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <select
              name="status"
              value={formValues.status}
              onChange={handleInputChange}
              placeholder="Status"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Buttons */}
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleCancelModal}
                style={{
                  padding: "8px 12px",
                  marginRight: "10px",
                  backgroundColor: "#f5f5f5",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Overlay */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancelModal}
          />
        )}
        {/* Overlay */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancelModal}
          />
        )}

        <div
          class="modal fade"
          id="exampleModalToggle2"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel2"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalToggleLabel2">
                  Enter Comments
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="form-floating">
                  <textarea
                    class="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                    value={comment}
                    onChange={handleCommentChange}

                  ></textarea>
                  <label for="floatingTextarea">Comments</label>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  class="btn"
                  data-bs-target="#exampleModalToggle"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  style={{ backgroundColor: "#578e7e", color: "white" }}
                  onClick={handleSaveComment}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Myrequest;
