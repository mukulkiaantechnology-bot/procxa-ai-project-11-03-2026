import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

function MultiYearContracting() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [contractStats, setContractStats] = useState({
    totalContractCount: 0,
    underReviewCount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { get } = useApi();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get(`${endpoints.getMultiYearContracts}?page=${currentPage}`);

        if (response.status) {
          setContracts(response.data || []);
          setPagination(response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
          });
          setContractStats(response.contractStats || {
            totalContractCount: 0,
            underReviewCount: 0,
          });
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching contracts:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">Multi-Year Contracting</h3>
          <Link to="/multiyearedit">
            <button
              className="btn text-white"
              style={{ backgroundColor: "#578e7e" }}
            >
              Add Multi Year
            </button>
          </Link>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        {!loading && !error && (
          <div className="row mt-4">
            <div className="col-md-3 mb-3">
              <div
                className="card text-white p-3"
                style={{ backgroundColor: "#ff6567", borderRadius: "10px" }}
              >
                <h2 className="fw-bold">{contractStats.totalContractCount || 0}</h2>
                <p>Total Multi-Year Contracts</p>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div
                className="card text-white p-3"
                style={{ backgroundColor: "#ff9318", borderRadius: "10px" }}
              >
                <h2 className="fw-bold">{contractStats.underReviewCount || 0}</h2>
                <p>Contracts Under Review</p>
              </div>
            </div>
          </div>
        )}

        <h5 className="fw-bold mt-4">
          <u>Total Contracts Eligible For Multi-Year Agreements</u>
        </h5>
      </div>

      {/* ================= LOADING STATE ================= */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading data...</p>
        </div>
      )}

      {/* ================= ERROR STATE ================= */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ================= TABLE ================= */}
      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>Supplier ID</th>
                  <th>Supplier Name</th>
                  <th>Current Duration</th>
                  <th>Multi-Year Proposal</th>
                  <th>Saving Estimate</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length > 0 ? (
                  contracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.supplierId || "N/A"}</td>
                      <td>{contract.supplier?.name || "N/A"}</td>
                      <td>{contract.currentContractDuration || "N/A"}</td>
                      <td>{contract.multiYearProposal || "N/A"}</td>
                      <td>{contract.savingsEstimate || "$0"}</td>
                      <td>{contract.status || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            navigate(`/multiyearedit?id=${contract.id}`)
                          }
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No contracts available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center my-3">
              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button
                      className="page-link text-secondary"
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                      style={{ border: "none" }}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link rounded text-white fw-semibold me-1 ms-1"
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          backgroundColor:
                            currentPage === index + 1
                              ? "#0096d4"
                              : "rgb(212, 212, 212)",
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      className="page-link text-secondary"
                      onClick={() =>
                        currentPage < pagination.totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      disabled={currentPage === pagination.totalPages}
                      style={{ border: "none" }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* ================= NAV BUTTONS ================= */}
      <div className="d-flex justify-content-between mt-4 mb-4">
        <button
          className="btn btn-light"
          onClick={() => navigate("/pricecomp")}
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            padding: "10px 20px",
            borderRadius: "6px",
            minWidth: "120px",
          }}
        >
          ⬅ Previous
        </button>

        <button
          className="btn text-white"
          style={{
            backgroundColor: "#578e7e",
            padding: "10px 30px",
            borderRadius: "6px",
            minWidth: "150px",
          }}
          onClick={() => navigate("/others")}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default MultiYearContracting;
