import React, { useState, useEffect } from 'react';
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

function VendorComparisons() {
  const [rankings, setRankings] = useState([]);
  const [message, setMessage] = useState("");
  const { get } = useApi();

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await get(endpoints.getRankings);
      if (response?.data) {
        setRankings(response.data);
      } else {
        setMessage("No ranking data available.");
      }
    } catch (error) {
      setMessage("Error fetching rankings: " + error.message);
    }
  };

  const getClassForScore = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "text-success fw-bold";
    if (pct >= 50) return "text-warning fw-bold";
    return "text-danger fw-bold";
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Vendor Comparisons & Rankings</h3>
        <button className="btn btn-outline-primary" onClick={fetchRankings}>
          <i className="fa-solid fa-sync me-2"></i> Refresh Rankings
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead className="table-light">
                <tr>
                  <th className="py-3">Rank</th>
                  <th className="py-3 text-start">Supplier Name</th>
                  <th className="py-3">Delivery</th>
                  <th className="py-3">Quality</th>
                  <th className="py-3">Cost</th>
                  <th className="py-3">Compliance</th>
                  <th className="py-3">Support</th>
                  <th className="py-3 table-secondary fw-bold">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {rankings.length > 0 ? (
                  rankings.map((vendor, index) => (
                    <tr key={vendor.id}>
                      <td>
                        <span className={`badge rounded-pill ${index === 0 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="text-start fw-semibold">{vendor.supplierName}</td>
                      <td>{vendor.breakdown.delivery}</td>
                      <td>{vendor.breakdown.quality}</td>
                      <td>{vendor.breakdown.cost}</td>
                      <td>{vendor.breakdown.compliance}</td>
                      <td>{vendor.breakdown.support}</td>
                      <td className="table-secondary fw-bold fs-5">
                        {vendor.totalScore} <span className="fs-6 text-muted fw-normal">/ 140</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <i className="fa-solid fa-chart-bar fa-2x mb-3 d-block"></i>
                      No vendor performance data found. Go to Performance Management to add ratings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorComparisons;