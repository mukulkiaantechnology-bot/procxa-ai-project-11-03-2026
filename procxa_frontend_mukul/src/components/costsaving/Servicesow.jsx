import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { FaEdit } from "react-icons/fa";

const Servicesow = () => {
  const [serviceSowData, setServiceSowData] = useState([]);
  const [totalServiceCount, setTotalServiceCount] = useState(0);
  const [uniqueServiceCount, setUniqueServiceCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { get } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSowConsolidations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get(`${endpoints.getSowConsolidations}?page=${currentPage}`);
        if (response.status) {
          setServiceSowData(response.data || []);
          setTotalServiceCount(response.totalServiceCount || 0);
          setUniqueServiceCount(response.uniqueServiceCount || 0);
          setTotalPages(response.pagination?.totalPages || 1);
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching service SOW data:", error);
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchSowConsolidations();
  }, [currentPage]); // Re-fetch data when page changes

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/sowedit?id=${id}`);
  };

  return (
    <div className="service-sow-edit-section">
      <div className="container">
        <div className="top d-flex flex-wrap justify-content-between align-items-center">
          <div className="heading">
            <h3 className="mb-3 fw-bold">Service/SOW Consolidation</h3>
          </div>
          <div className="mt-3 mt-md-0">
            <Link to="/sowedit">
              <button
                type="button"
                className="btn ms-3 px-4 py-1 rounded-3 fw-semibold text-white"
                style={{ backgroundColor: "#578e7e" }}
              >
                <span>
                  <i className="fa-solid fa-book me-2" />
                </span>{" "}
                Create New SOW
              </button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row text-center mb-4 mt-4">
          <div className="col-12 col-sm-6 col-lg-3 mb-3">
            <div
              className="card sowcard text-white fw-semibold h-100 d-flex justify-content-center"
              style={{ backgroundColor: "#ff6567" }}
            >
              <div className="content d-flex justify-content-start align-items-center p-2">
                <div className="icon">
                  <i
                    className="fa-regular fa-user rounded-circle p-3"
                    style={{ backgroundColor: "#fdabab" }}
                  />
                </div>
                <div className="text ms-4 text-start fw-semibold">
                  <h2 className="card-title mb-0 fw-bold">{uniqueServiceCount}</h2>
                  <p>Number of New Service Requests</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 mb-3">
            <div
              className="card sowcard text-white fw-semibold h-100 d-flex justify-content-center"
              style={{ backgroundColor: "#ff9318" }}
            >
              <div className="content d-flex justify-content-start align-items-center p-2">
                <div className="icon">
                  <i
                    className="fa-regular fa-user rounded-circle p-3"
                    style={{ backgroundColor: "#fcc586" }}
                  />
                </div>
                <div className="text ms-4 text-start">
                  <h2 className="card-title mb-0 fw-bold">{totalServiceCount}</h2>
                  <p>Potential Consolidation Identified</p>
                </div>
              </div>
            </div>
          </div>
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

        <div className="selection">
          <h5>
            <u className="fw-bold">Consolidation Opportunities</u>
          </h5>
        </div>

        {/* ================= TABLE ================= */}
        {!loading && !error && (
          <div className="table-responsive mt-3">
          <table className="table table-striped table-bordered text-center">
            <thead>
              <tr>
                <th>Requesting Team/ Department</th>
                <th>Requested Service/Tool</th>
                <th>Existing Suppliers Offering Similar Service</th>
                <th>Savings from Consolidating Under an Existing Supplier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceSowData.length > 0 ? (
                serviceSowData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.department?.name || "N/A"}</td>
                    <td>{item.requestedServiceTool || "N/A"}</td>
                    <td>{item.supplierDetails?.name || "N/A"}</td>
                    <td>{item.consolidationSavings || "N/A"}</td>
                    <td>{item.status || "N/A"}</td>
                    <td>
                      <FaEdit
                        className="text-primary mx-2 cursor-pointer"
                        onClick={() => handleEdit(item.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Data not available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`me-1 ms-1 page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link rounded text-dark fw-semibold"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link text-secondary"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
        )}

        {/* Cost Saving Navigation Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <button
            className="btn"
            onClick={() => navigate('/suppliercons')}
            style={{
              backgroundColor: '#f8f9fa',
              color: '#333',
              border: '1px solid #dee2e6',
              padding: '10px 20px',
              borderRadius: '6px',
              minWidth: '120px'
            }}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>Previous
          </button>
          <button
            className="btn text-white"
            onClick={() => navigate('/honoring')}
            style={{
              backgroundColor: '#578e7e',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '6px',
              minWidth: '150px',
              fontWeight: '500'
            }}
          >
            Next<i className="fa-solid fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Servicesow;
