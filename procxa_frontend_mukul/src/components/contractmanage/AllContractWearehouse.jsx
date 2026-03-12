import React, { useState } from "react";
import { Link } from "react-router-dom";
import endpoints from "../../api/endPoints";
import { useEffect } from "react";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const AllContractWearehouse = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { get } = useApi();
  const [contracts, setContracts] = useState({
    allContracts: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      limit: 7,
    },
  });

  const fetchContracts = async (page = 1, limit = 7, searchTerm = "") => {
    try {
      const response = await get(
        `${endpoints.getAllContracts}?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
      );
      setContracts({
        allContracts: response.data,
        pagination: {
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalRecords: response.pagination.totalRecords,
          limit: response.pagination.limit,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handlePageChange = (page) => {
    fetchContracts(page, contracts.pagination.limit, searchTerm);
  };

  const handleLimitChange = (newLimit) => {
    fetchContracts(1, newLimit, searchTerm);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchContracts(1, contracts.pagination.limit, value);
    }, 300);
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active":
        return "activebadge";
      case "Expired":
        return "expiredbadge";
      case "Under Renewal":
        return "renewalbadge";
      case "Terminated":
        return "terminatedbadge";
      case "Renewed":
        return "renewedbadge";
      default:
        return "bg-secondary";
    }
  };

  const handleDownloadPdf = (pdfUrl) => {
    if (!pdfUrl || pdfUrl === import.meta.env.VITE_APP_API_BASE_URL + "/undefined") {
      alert("PDF is not available");
      console.error("PDF URL is not available.");
      return;
    }

    console.log("Downloading PDF from:", pdfUrl);
    window.open(pdfUrl, "_blank");

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.setAttribute("download", `contract_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="container-fluid px-3 px-md-4 mt-3 mt-md-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>All Contract Warehouse</h2>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12 col-lg-8 mb-3 mb-lg-0">
            <div className="searchcontracts">
              <input
                className="form-control w-100"
                type="search"
                placeholder="Search by Department&Type"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="d-flex justify-content-lg-end">
              <button
                className="btn btn-success d-flex align-items-center justify-content-center contrabtn w-100 w-lg-auto"
                style={{
                  borderRadius: "5px",
                  height: "49px",
                  border: "none",
                  backgroundColor: "#578E7E",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
              >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body p-0">
            {/* Mobile Card View */}
            <div className="d-block d-md-none p-3">
              {contracts.allContracts && contracts.allContracts.length > 0 ? (
                contracts.allContracts.map((contract) => (
                  <div key={contract.id} className="card mb-3 shadow-sm">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
                          Contract ID: {contract.id || "Not Available"}
                        </h6>
                        <span
                          className={`badge rounded-pill flex-shrink-0 ms-2 ${getStatusBadgeClass(
                            contract.status
                          )}`}
                          style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}
                        >
                          {contract.status || "Not Available"}
                        </span>
                      </div>
                      <div className="row mb-2">
                        <div className="col-6">
                          <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
                          <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                            {contract.supplier?.name || "Not Available"}
                          </p>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
                          <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                            {contract.department?.name || "Not Available"}
                          </p>
                        </div>
                      </div>
                      {/* <div className="row mb-2">
                        <div className="col-12">
                          <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Business Stakeholder:</small>
                          <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                            {contract.buisnessStackHolder || "Not Available"}
                          </p>
                        </div>
                      </div> */}
                      <div className="row mb-2">
                        <div className="col-6">
                          <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Type:</small>
                          <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                            {contract.contractTypeId || "Not Available"}
                          </p>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Sourcing Lead:</small>
                          <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                            {contract.sourceLeadName || "Not Available"}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-12">
                          <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Sourcing Director:</small>
                          <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                            {contract.sourceDirectorName || "Not Available"}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center gap-3 pt-2 border-top">
                        <button
                          className="btn btn-link p-0"
                          title="View"
                          onClick={() => navigate('/contractdetail', { state: { contract: contract } })}
                          style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                        >
                          <i className="fa-regular fa-eye" style={{ color: "#0d99ff" }}></i>
                        </button>
                        <button
                          className="btn btn-link text-decoration-none p-0"
                          style={{
                            color: "green",
                            fontWeight: "bold",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownloadPdf(
                              `${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType?.customAgreementFile}`
                            );
                          }}
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No contracts available</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block contracttable" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="table table-striped table-bordered text-center mb-0">
                <thead>
                  <tr>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Contract ID</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Supplier Name</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Department</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Business Stakeholder</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Type</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Start Date</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>End Date</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Renewal Due</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Spend Value</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap", minWidth: "120px" }}>Status</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.allContracts && contracts.allContracts.length > 0 ? (
                    contracts.allContracts.map((contract) => (
                      <tr key={contract.id}>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.id || "Not Available"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.supplier?.name || "Not Available"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.department?.name || "Not Available"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.buisnessStackHolder || "Not Available"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.contractTypeId || "Not Available"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}</td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>
                          {contract.endDate ? Math.ceil((new Date(contract.endDate) - new Date()) / (1000 * 60 * 60 * 24)) + " Days" : "N/A"}
                        </td>
                        <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>
                          {contract.contractValue ? `$${Number(contract.contractValue).toLocaleString()}` : "N/A"}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <span
                            className={`badge rounded-pill px-3 py-1 ${getStatusBadgeClass(
                              contract.status
                            )}`}
                            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
                          >
                            {contract.status || "N/A"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <button
                              className="btn btn-link p-0"
                              title="View"
                              onClick={() => navigate('/contractdetail', { state: { contract: contract } })}
                              style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
                            >
                              <i
                                className="fa-regular fa-eye"
                                style={{ color: "#0d99ff" }}
                              />
                            </button>
                            <button
                              className="btn btn-link text-decoration-none p-0"
                              style={{
                                color: "green",
                                fontWeight: "bold",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDownloadPdf(
                                  `${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType?.customAgreementFile}`
                                );
                              }}
                            >
                              <i className="fa-solid fa-download"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No contracts available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center flex-wrap mb-0">
                  {/* Previous Button */}
                  <li className={`page-item ${contracts.pagination.currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link text-secondary px-3 py-2"
                      onClick={() =>
                        handlePageChange(contracts.pagination.currentPage - 1)
                      }
                      disabled={contracts.pagination.currentPage === 1}
                      style={{
                        minWidth: "80px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.25rem",
                        cursor: contracts.pagination.currentPage === 1 ? "not-allowed" : "pointer"
                      }}
                    >
                      Previous
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: contracts.pagination.totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item mx-1 ${contracts.pagination.currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className={`page-link rounded fw-semibold px-3 py-2 ${contracts.pagination.currentPage === page
                          ? "text-white"
                          : "text-dark"
                          }`}
                        style={{
                          backgroundColor:
                            contracts.pagination.currentPage === page
                              ? "#0096d4"
                              : "rgb(212, 212, 212)",
                          minWidth: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #dee2e6",
                          borderRadius: "0.25rem",
                          cursor: "pointer"
                        }}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Next Button */}
                  <li
                    className={`page-item ${contracts.pagination.currentPage ===
                      contracts.pagination.totalPages
                      ? "disabled"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link text-secondary px-3 py-2"
                      onClick={() =>
                        handlePageChange(contracts.pagination.currentPage + 1)
                      }
                      disabled={
                        contracts.pagination.currentPage ===
                        contracts.pagination.totalPages
                      }
                      style={{
                        minWidth: "80px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.25rem",
                        cursor: contracts.pagination.currentPage === contracts.pagination.totalPages ? "not-allowed" : "pointer"
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal for Details */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  More Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedContract ? (
                  <ul>
                    <li>
                      <strong>Contract ID:</strong> {selectedContract.id}
                    </li>
                    <li>
                      <strong>Supplier Name:</strong> {selectedContract.supplier?.name}
                    </li>
                    <li>
                      <strong>Type of Contract:</strong> {selectedContract.contractType?.type}
                    </li>
                    <li>
                      <strong>Department:</strong> {selectedContract.department?.name}
                    </li>
                    <li>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge rounded-pill px-3 py-1 ${getStatusBadgeClass(selectedContract.status)}`}
                      >
                        {selectedContract.status}
                      </span>
                    </li>
                    <li>
                      <strong>Description:</strong>{" "}
                      {selectedContract.description}
                    </li>
                  </ul>
                ) : (
                  <p>No contract selected.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Modal */}
        <div
          className="modal fade"
          id="exampleModalToggle2"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel2"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalToggleLabel2">
                  Enter Comments
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <label htmlFor="floatingTextarea">Comments</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  data-bs-target="#exampleModalToggle"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  style={{ backgroundColor: "#578e7e", color: "white" }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllContractWearehouse;