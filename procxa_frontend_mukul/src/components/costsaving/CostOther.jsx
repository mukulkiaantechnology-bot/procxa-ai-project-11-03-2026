import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

function CostOther() {
  const navigate = useNavigate();
  const { get } = useApi();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Try to fetch from supplier consolidations endpoint filtered by "Others" type
        // If a specific endpoint exists, it should be added to endpoints.js
        const response = await get(endpoints.getSupplierConsolidations, {
          params: {
            page: pagination.currentPage,
            limit: 10,
            type: "Others",
          },
        });

        if (response.status) {
          // Filter or use data as needed
          setData(response.data || []);
          if (response.pagination) {
            setPagination({
              currentPage: response.pagination.currentPage || 1,
              totalPages: response.pagination.totalPages || 1,
            });
          }
        } else {
          // If no specific endpoint, show empty state with message
          setData([]);
          setError(null); // Don't show error, just show empty state
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        // Don't show error, just show empty state
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: pageNumber,
      }));
    }
  };

  return (
    <div>
      <div className="costother-section my-5">
        <div className="container">
          <h3>Other For Saving Opportunity</h3>

          {/* ================= LOADING STATE ================= */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading data...</p>
            </div>
          )}

          {/* ================= TABLE SECTION ================= */}
          {!loading && (
            <div className="table-responsive mt-4">
              <table className="table table-striped table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Category Name</th>
                    <th>Current Suppliers</th>
                    <th>Spend with Each Supplier</th>
                    <th>Recommended Supplier</th>
                    <th>Potential Savings</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((row, index) => (
                      <tr key={index}>
                        <td>{row.categoryName || "Other"}</td>
                        <td>
                          {(row.currentSuppliers || [])
                            .map((s) => s?.supplierName || "N/A")
                            .join(", ") || "Other Supplier"}
                        </td>
                        <td>
                          {(row.currentSuppliers || [])
                            .map((s) => `$${(s?.spend || 0).toLocaleString()}`)
                            .join(", ") || "$0"}
                        </td>
                        <td>
                          {row.recommendedSupplier?.supplierName || "N/A"}
                        </td>
                        <td>
                          ${(row.potentialSavings || 0).toLocaleString()}
                        </td>
                        <td>{row.status || "New Opportunity"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {error
                          ? "Error loading data. Please try again later."
                          : "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= PAGINATION ================= */}
          {!loading && pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center my-3">
              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button
                      className="page-link text-secondary"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      style={{ border: "none" }}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        pagination.currentPage === index + 1 ? "active" : ""
                      } ${index > 0 && index < pagination.totalPages - 1 ? "mx-3" : ""}`}
                    >
                      <button
                        className="page-link rounded fw-semibold"
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          backgroundColor:
                            pagination.currentPage === index + 1
                              ? "#0096d4"
                              : "rgb(212, 212, 212)",
                          color:
                            pagination.currentPage === index + 1
                              ? "white"
                              : "black",
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
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      style={{ border: "none" }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          {/* ================= COST SAVING NAVIGATION BUTTONS ================= */}
          <div
            className="d-flex justify-content-between align-items-center mt-4 mb-4"
            style={{ flexWrap: "wrap", gap: "10px" }}
          >
            <button
              className="btn"
              onClick={() => navigate("/multiyear")}
              style={{
                backgroundColor: "#f8f9fa",
                color: "#333",
                border: "1px solid #dee2e6",
                padding: "10px 20px",
                borderRadius: "6px",
                minWidth: "120px",
              }}
            >
              <i className="fa-solid fa-arrow-left me-2"></i>Previous
            </button>
            <button
              className="btn text-white"
              onClick={() => navigate("/costsaving")}
              style={{
                backgroundColor: "#578e7e",
                border: "none",
                padding: "10px 30px",
                borderRadius: "6px",
                minWidth: "150px",
                fontWeight: "500",
              }}
            >
              Next<i className="fa-solid fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostOther;
