import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const AditionalComplementry = () => {
  const navigate = useNavigate();
  const { get, del } = useApi();

  const [complementaryServices, setComplementaryServices] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    numberOfBundlesCreated: 0,
    topServiceCount: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get(`${endpoints.getComplementaryServices}?page=${page}&limit=${limit}`);

        if (response.status) {
          setComplementaryServices(response.data || []);
          setPagination(response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
          });
          setAdditionalInfo(response.additionalInfo || {
            numberOfBundlesCreated: 0,
            topServiceCount: 0,
          });
        } else {
          setError(response.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching complementary services:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await del(`${endpoints.deleteComplementaryService}/${id}`);
        if (response.status) {
          setComplementaryServices(
            complementaryServices.filter((service) => service.id !== id)
          );
        } else {
          alert(response.message || "Failed to delete service");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service. Please try again.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/additionaledit?id=${id}`);
  };

  return (
    <div className="container">
      {/* ================= HEADER ================= */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Additional / Complementary Services</h3>

        <Link to="/additionaledit">
          <button
            className="btn text-white fw-semibold"
            style={{ backgroundColor: "#578e7e" }}
          >
            <i className="fa-solid fa-book me-2" /> Add Service
          </button>
        </Link>
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

      {/* ================= SUMMARY CARDS ================= */}
      {!loading && !error && (
        <>
          <div className="row mt-4 mb-4 text-center">
            <div className="col-12 col-sm-6 col-lg-3 mb-3">
              <div
                className="card text-white h-100"
                style={{ backgroundColor: "#ff6567" }}
              >
                <div className="d-flex align-items-center p-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#fdabab",
                      width: 50,
                      height: 50,
                    }}
                  >
                    <i className="fa-regular fa-user"></i>
                  </div>
                  <div className="ms-3 text-start">
                    <h2 className="fw-bold mb-0">
                      {additionalInfo.numberOfBundlesCreated || 0}
                    </h2>
                    <p className="mb-0">Bundles Created</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 mb-3">
              <div
                className="card text-white h-100"
                style={{ backgroundColor: "#ff9318" }}
              >
                <div className="d-flex align-items-center p-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#fcc586",
                      width: 50,
                      height: 50,
                    }}
                  >
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className="ms-3 text-start">
                    <h2 className="fw-bold mb-0">
                      {additionalInfo.topServiceCount || 0}
                    </h2>
                    <p className="mb-0">Top Services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <h5 className="fw-bold">
            <u>Opportunities</u>
          </h5>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>Supplier Name</th>
                  <th>Current Service/Product</th>
                  <th>Recommended Service</th>
                  <th>Cost</th>
                  <th>Savings</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complementaryServices.length > 0 ? (
                  complementaryServices.map((service) => (
                    <tr key={service.id}>
                      <td>{service.supplier?.name || "N/A"}</td>
                      <td>{service.productPurchased || "N/A"}</td>
                      <td>{service.complementaryService || "N/A"}</td>
                      <td>${(service.cost || 0).toLocaleString()}</td>
                      <td className="text-success fw-semibold">
                        ${(service.saving || 0).toLocaleString()}
                      </td>
                      <td className="text-capitalize">
                        {service.status || "N/A"}
                      </td>
                      <td>
                        <i
                          className="fa-solid fa-pen-to-square text-primary me-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEdit(service.id)}
                        />
                        <i
                          className="fa-solid fa-trash text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(service.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
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
              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      pagination.currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link text-secondary"
                      onClick={() => setPage(page - 1)}
                      disabled={pagination.currentPage === 1}
                      style={{
                        border: "none",
                        cursor:
                          pagination.currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: pagination.totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item mx-1 ${
                        pagination.currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className={`page-link fw-semibold ${
                          pagination.currentPage === index + 1
                            ? "text-white"
                            : "text-dark"
                        }`}
                        onClick={() => setPage(index + 1)}
                        style={{
                          backgroundColor:
                            pagination.currentPage === index + 1
                              ? "#0096d4"
                              : "rgb(212, 212, 212)",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      pagination.currentPage === pagination.totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link text-secondary"
                      onClick={() => setPage(page + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      style={{
                        border: "none",
                        cursor:
                          pagination.currentPage === pagination.totalPages
                            ? "not-allowed"
                            : "pointer",
                      }}
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

      {/* ================= NAVIGATION ================= */}
      <div
        className="d-flex justify-content-between align-items-center mt-4 mb-4"
        style={{ flexWrap: "wrap", gap: "10px" }}
      >
        <button
          className="btn"
          onClick={() => navigate("/honoring")}
          style={{
            backgroundColor: "#f8f9fa",
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
          onClick={() => navigate("/pricecomp")}
          style={{
            backgroundColor: "#578e7e",
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
  );
};

export default AditionalComplementry;
