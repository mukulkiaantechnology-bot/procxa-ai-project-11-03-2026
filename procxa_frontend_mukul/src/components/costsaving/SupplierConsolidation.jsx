import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SupplierConsolidation() {
  const navigate = useNavigate();
  const { get } = useApi();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 7,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get(endpoints.getSupplierConsolidations, {
          params: {
            page: pagination.currentPage,
            limit: pagination.limit,
          },
        });

        if (response.status) {
          setData(response.data || []);
          if (response.pagination) {
            setPagination((prevState) => ({
              ...prevState,
              totalRecords: response.pagination.totalRecords || 0,
              totalPages: response.pagination.totalPages || 1,
            }));
          }
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching supplier consolidation data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
      setPagination((prevState) => ({
        ...prevState,
        currentPage: pageNumber,
      }));
    }
  };

  return (
    <div className="container">
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h3 className="fw-bold">Supplier Consolidation</h3>
        <h5 className="mt-4 fw-bold">
          <u>Total Suppliers Identified For Consolidation</u>
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
            <table className="table table-bordered table-striped text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Category Name</th>
                  <th>Current Suppliers</th>
                  <th>Spend with Each Supplier</th>
                  <th>Recommended Supplier</th>
                  <th>Potential Savings</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((category, index) => (
                    <tr key={index}>
                      <td>{category.categoryName || "N/A"}</td>
                      <td>
                        {(category.currentSuppliers || [])
                          .map((s) => s?.supplierName || "N/A")
                          .join(", ")}
                      </td>
                      <td>
                        {(category.currentSuppliers || [])
                          .map((s) => `$${(s?.spend || 0).toLocaleString()}`)
                          .join(", ")}
                      </td>
                      <td>
                        {category.recommendedSupplier?.supplierName || "N/A"}
                      </td>
                      <td className="fw-bold text-success">
                        ${(category.potentialSavings || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center my-3">
              <nav aria-label="Page navigation">
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
                      className={`page-item ${
                        pagination.currentPage === index + 1 ? "active" : ""
                      }`}
                      key={index}
                    >
                      <button
                        className="page-link rounded text-dark fw-semibold"
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          backgroundColor:
                            pagination.currentPage === index + 1
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
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      style={{ border: "none" }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          {/* ================= BAR CHART ================= */}
          {data.length > 0 && (
            <div className="mt-5">
              <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                  <Bar
                    data={{
                      labels: data.map((cat) => cat.categoryName || "Unknown"),
                      datasets: [
                        {
                          label: "Total Spend per Category",
                          data: data.map((cat) =>
                            (cat.currentSuppliers || []).reduce(
                              (sum, s) => sum + (parseFloat(s?.spend) || 0),
                              0
                            )
                          ),
                          backgroundColor: "#518bbb",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "Supplier Spend Comparison",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => `$${value / 1000}k`,
                          },
                        },
                      },
                    }}
                    height={300}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= NAVIGATION BUTTONS ================= */}
      <div
        className="d-flex justify-content-between align-items-center mt-4 mb-4"
        style={{ flexWrap: "wrap", gap: "10px" }}
      >
        <button
          className="btn"
          onClick={() => navigate("/volumedisc")}
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
          onClick={() => navigate("/serviceswo")}
          style={{
            backgroundColor: "#578e7e",
            padding: "10px 30px",
            borderRadius: "6px",
            minWidth: "150px",
          }}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default SupplierConsolidation;
