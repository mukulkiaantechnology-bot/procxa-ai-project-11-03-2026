import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const VendorPerformanceManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [performanceList, setPerformanceList] = useState([]);

  // Workflow State
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [isScoringMode, setIsScoringMode] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState(null);

  // Scoring State
  const [scores, setScores] = useState({
    delivery: 0,
    quality: 0,
    cost: 0,
    compliance: 0,
    support: 0
  });
  const [totalScore, setTotalScore] = useState(0);

  const [message, setMessage] = useState("");
  const { post, get, del, put } = useApi();

  // 1. Fetch Init Data
  useEffect(() => {
    fetchSuppliers();
    fetchPerformanceList();
  }, []);

  // 2. Auto-Calculate Total Score
  useEffect(() => {
    const total =
      Number(scores.delivery) +
      Number(scores.quality) +
      Number(scores.cost) +
      Number(scores.compliance) +
      Number(scores.support);
    setTotalScore(total);
  }, [scores]);

  const fetchSuppliers = async () => {
    try {
      const response = await get(endpoints.getSuppliers);
      if (response?.data) setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchPerformanceList = async () => {
    try {
      const response = await get(endpoints.getRatings);
      if (response?.data) {
        setPerformanceList(response.data);
      }
    } catch (error) {
      console.error("Error fetching performance list:", error);
    }
  };

  const handleAddSupplier = () => {
    if (!selectedSupplierId) {
      setMessage("Please select a supplier first.");
      return;
    }
    setIsScoringMode(true);
    setEditingId(null); // Ensure we are adding new
    setMessage("");
    // Reset scores
    setScores({ delivery: 0, quality: 0, cost: 0, compliance: 0, support: 0 });
  };

  const handleEditRating = (item) => {
    setIsScoringMode(true);
    setEditingId(item.id);
    setSelectedSupplierId(item.supplierId);
    setScores({
      delivery: item.deliveryScore,
      quality: item.qualityScore,
      cost: item.costScore,
      compliance: item.complianceScore,
      support: item.supportScore
    });
    setMessage("");
    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleScoreChange = (category, value) => {
    setScores(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSavePerformance = async () => {
    try {
      const payload = {
        supplierId: selectedSupplierId,
        deliveryScore: scores.delivery,
        qualityScore: scores.quality,
        costScore: scores.cost,
        complianceScore: scores.compliance,
        supportScore: scores.support,
        totalScore: totalScore
      };

      let response;
      if (editingId) {
        // Update existing rating
        response = await put(`${endpoints.updateRating}/${editingId}`, payload);
      } else {
        // Create new rating
        response = await post(endpoints.addRating, payload);
      }

      if (response?.status) {
        setMessage(editingId ? "Performance updated successfully!" : "Performance saved successfully!");
        setIsScoringMode(false);
        setSelectedSupplierId("");
        setEditingId(null);
        fetchPerformanceList(); // Refresh list immediately
      } else {
        setMessage(response?.message || "Failed to save performance.");
      }
    } catch (error) {
      setMessage("Error saving performance: " + error.message);
    }
  };

  const handleDeleteRating = async (id) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      try {
        const response = await del(`${endpoints.deleteRating}/${id}`);
        if (response?.status) {
          setMessage("Rating deleted successfully!");
          fetchPerformanceList();
        } else {
          setMessage("Failed to delete rating: " + response.message);
        }
      } catch (error) {
        setMessage("Error deleting rating: " + error.message);
      }
    }
  };

  const getSupplierName = (id) => {
    const s = suppliers.find(item => item.id == id);
    return s ? s.name : "Unknown";
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Vendor Performance Management</h3>

      {/* --- 1. Selection & Add Section --- */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-bold">Select Supplier</label>
              <select
                className="form-select"
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                disabled={isScoringMode} // Disable selection during scoring/editing to prevent mismatch
              >
                <option value="">-- Choose Supplier --</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              {!isScoringMode ? (
                <button className="btn btn-primary w-100" style={{ backgroundColor: "#578e7e", border: "none" }} onClick={handleAddSupplier}>
                  <i className="fa-solid fa-plus me-2"></i> Add Supplier Rating
                </button>
              ) : (
                <button className="btn btn-outline-secondary w-100" onClick={() => { setIsScoringMode(false); setEditingId(null); setSelectedSupplierId(""); }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
          {message && <div className={`alert mt-3 mb-0 ${message.toLowerCase().includes('failed') || message.toLowerCase().includes('error') ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
        </div>
      </div>

      {isScoringMode && (
        <div className="row g-3 mb-4 fade-in">
          {/* Delivery */}
          <div className="col-md-4">
            <div className="card h-100 border-start border-4 border-primary shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">Delivery Performance</h5>
                <p className="text-muted small">Timeliness and reliability of delivery.</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Score"
                  value={scores.delivery}
                  onChange={(e) => handleScoreChange('delivery', e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Quality */}
          <div className="col-md-4">
            <div className="card h-100 border-start border-4 border-success shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-success">Quality Performance</h5>
                <p className="text-muted small">Adherence to quality standards/specs.</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Score"
                  value={scores.quality}
                  onChange={(e) => handleScoreChange('quality', e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Cost */}
          <div className="col-md-4">
            <div className="card h-100 border-start border-4 border-warning shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-warning">Cost Competitiveness</h5>
                <p className="text-muted small">Pricing relative to market value.</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Score"
                  value={scores.cost}
                  onChange={(e) => handleScoreChange('cost', e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Compliance */}
          <div className="col-md-4">
            <div className="card h-100 border-start border-4 border-info shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-info">Compliance & Risk</h5>
                <p className="text-muted small">Adherence to regulations and terms.</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Score"
                  value={scores.compliance}
                  onChange={(e) => handleScoreChange('compliance', e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Service */}
          <div className="col-md-4">
            <div className="card h-100 border-start border-4 border-secondary shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold text-secondary">Service / Support</h5>
                <p className="text-muted small">Responsiveness and support quality.</p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Score"
                  value={scores.support}
                  onChange={(e) => handleScoreChange('support', e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Total Score Display */}
          <div className="col-md-4">
            <div className="card h-100 bg-light border-0 shadow-sm">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h4 className="fw-bold mb-0">Total Score</h4>
                <h2 className="display-4 fw-bold text-dark mb-0">{totalScore} <span className="fs-6 text-muted">/ 140</span></h2>
              </div>
            </div>
          </div>

          <div className="col-12 text-end">
            <button className="btn btn-success btn-lg" onClick={handleSavePerformance}>
              <i className={`fa-solid ${editingId ? 'fa-check' : 'fa-save'} me-2`}></i>
              {editingId ? "Update Performance" : "Save Performance"}
            </button>
          </div>
        </div>
      )}

      {/* --- 3. Saved Performance List --- */}
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Supplier Performance List</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Supplier Name</th>
                <th className="text-center">Delivery</th>
                <th className="text-center">Quality</th>
                <th className="text-center">Cost</th>
                <th className="text-center">Compliance</th>
                <th className="text-center">Support</th>
                <th className="text-center fw-bold">Total Score</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {performanceList.length > 0 ? (
                performanceList.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.supplierName || getSupplierName(item.supplierId)}</td>
                    <td className="text-center">{item.deliveryScore}</td>
                    <td className="text-center">{item.qualityScore}</td>
                    <td className="text-center">{item.costScore}</td>
                    <td className="text-center">{item.complianceScore}</td>
                    <td className="text-center">{item.supportScore}</td>
                    <td className="text-center fw-bold text-primary">{item.totalScore}/140</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditRating(item)}
                          title="Edit Rating"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteRating(item.id)}
                          title="Delete Rating"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No performance data available. Add a supplier rating above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorPerformanceManagement;
