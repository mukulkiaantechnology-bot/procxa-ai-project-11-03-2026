import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi"
function PriceComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {get} = useApi();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPriceComparisons = async () => {
      try {
        const response = await get(endpoints.getPriceComparisons);
        if (response.status) {
          setComparisons(response.data || []);
        } else {
          setError(response.message || "Failed to fetch price comparisons");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchPriceComparisons();
  }, []);

  return (
    <div className="container">
      {/* Header Section */}
      <div className="mb-4 text-start">
        <div className="d-flex justify-content-between">
          <h1
            style={{
              fontFamily: "Urbanist",
              fontWeight: "700",
              fontSize: "35px",
              lineHeight: "42px",
            }}
          >
            Price Comparisons
          </h1>
          <Link to="/pricecomparisonsprice">
            <button
              className="p-2 rounded"
              style={{
                backgroundColor: "#578e7e",
                color: "white",
                border: "none",
                width: "120px",
              }}
            >
              Price Compari
            </button>
          </Link>
        </div>
        <h5
          className="mt-5"
          style={{
            fontFamily: "Urbanist",
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "24px",
          }}
        >
          <u>Multiple Supplier Quotations</u>
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
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Supplier1 Name</th>
                <th>Supplier2 Name</th>

                <th>Product/Service</th>
                <th>Price Quoted</th>
                <th>Delivery Term</th>
                <th>Additional Benefits/Features</th>
                <th>Recommended Supplier</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.length > 0 ? (
                comparisons.map((item, index) => (
                  <tr key={index}>
                    <td>{item.recommendedSupplierName || "N/A"}</td>
                    <td>{item.notRecommendedSupplierName || "N/A"}</td>

                    <td>{item.subcategoryId || "N/A"}</td>
                    <td>{item.supplier?.perUnitPrice || "N/A"}</td>
                    <td>{item.supplier?.deliveryTerms || "N/A"}</td>
                    <td>{item.supplier?.additionalBenefits || "N/A"}</td>
                    <td>{item.recommendedSupplierName || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Cost Saving Navigation Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <button
          className="btn"
          onClick={() => navigate('/additionalcomp')}
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
          onClick={() => navigate('/multiyear')}
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
  );
}

export default PriceComparisons;
