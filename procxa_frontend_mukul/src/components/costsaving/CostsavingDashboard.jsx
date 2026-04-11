import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { Modal, Button } from "react-bootstrap";

const CostsavingDashboard = () => {
  const navigate = useNavigate();
  const { get, del } = useApi();

  const [costSavings, setCostSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    category: "",
    departmentId: "",
    supplierName: "",
    signerId: "",
    startDate: "",
    endDate: "",
    reportingYear: "",
    reportingMonth: "",
    minAmount: "",
    maxAmount: ""
  });

  const [options, setOptions] = useState({
    categories: [],
    departments: [],
    suppliers: [],
    approvers: []
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchCostSavings();
  }, [filters]);

  const fetchOptions = async () => {
    try {
      const [cats, depts, sups] = await Promise.all([
        get(endpoints.getCategory),
        get(endpoints.getAllDepartments),
        get(endpoints.getSuppliers)
      ]);

      // Extract arrays based on known response structures
      const categoryList = cats?.categories || cats?.data || (Array.isArray(cats) ? cats : []);
      const departmentList = depts?.data || depts?.departments || (Array.isArray(depts) ? depts : []);
      const supplierList = sups?.data || sups?.suppliers || (Array.isArray(sups) ? sups : []);

      setOptions({
        categories: Array.isArray(categoryList) ? categoryList : [],
        departments: Array.isArray(departmentList) ? departmentList : [],
        suppliers: Array.isArray(supplierList) ? supplierList : [],
        approvers: [] // Endpoint for all users/approvers needed if signerId is to be populated
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchCostSavings = async () => {
    try {
      setLoading(true);
      // Construct query string from filters
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const res = await get(`${endpoints.getAllCostSavings}?${queryParams.toString()}`);
      if (res && res.length > 0) {
        setCostSavings(res);
      } else if (res && res.data) {
        setCostSavings(res.data);
      } else {
        setCostSavings(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Error fetching cost savings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      departmentId: "",
      supplierName: "",
      signerId: "",
      startDate: "",
      endDate: "",
      reportingYear: "",
      reportingMonth: "",
      minAmount: "",
      maxAmount: ""
    });
  };

  const handleView = (saving) => {
    setSelectedSaving(saving);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Cost Saving record?")) {
      try {
        const resp = await del(`${endpoints.deleteCostSaving}/${id}`);
        if (resp.status == 200 || resp.success || resp.message) {
          fetchCostSavings();
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  const handleEdit = (saving) => {
    // For now we will navigate to the form and pass the saving ID
    navigate(`/costsavingform?editId=${saving.id}`);
  };

  // Calculate Metrics
  const totalRecords = costSavings.length;
  const totalSavingsAmount = costSavings.reduce((acc, curr) => {
    const current = parseFloat(curr.currentPrice);
    const proposed = parseFloat(curr.proposedPrice);
    if (!isNaN(current) && !isNaN(proposed)) {
      const saveAmt = current - proposed;
      return acc + saveAmt;
    }
    return acc;
  }, 0);

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      <h2 className="mb-4 text-center text-md-start">Cost Saving Dashboard</h2>

      {/* Summary Cards */}
      <div className="row text-center mb-4 g-2">
        <div className="col-12 col-sm-6 col-lg-4 mb-2">
          <div className="card portalcard text-white fw-semibold h-100" style={{ backgroundColor: "#ff6567" }}>
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i className="fa-regular fa-folder-open rounded-circle p-3" style={{ backgroundColor: "#fdabab", fontSize: "clamp(1.5rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{totalRecords || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Total Records</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2 p-md-3">
              <div className="icon-wrapper flex-shrink-0">
                <i className="fa-regular fa-folder-open rounded-circle p-2 p-md-3" style={{ backgroundColor: "#fdabab", fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>{totalRecords || 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Total Records</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 mb-2">
          <div className="card portalcard text-white fw-semibold h-100" style={{ backgroundColor: "#ff9318" }}>
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i className="fa-solid fa-dollar-sign rounded-circle p-3" style={{ backgroundColor: "#fcc586", fontSize: "clamp(1.5rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>${totalSavingsAmount.toFixed(2)}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Est. Total Savings</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2 p-md-3">
              <div className="icon-wrapper flex-shrink-0">
                <i className="fa-solid fa-dollar-sign rounded-circle p-2 p-md-3" style={{ backgroundColor: "#fcc586", fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>${totalSavingsAmount.toFixed(2)}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Est. Total Savings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 mb-2">
          <div className="card portalcard text-white fw-semibold h-100" style={{ backgroundColor: "#39bf1b" }}>
            {/* Mobile Layout - Vertical */}
            <div className="content d-flex d-md-none flex-column justify-content-center align-items-center p-3">
              <div className="icon-wrapper mb-2">
                <i className="fa-solid fa-chart-line rounded-circle p-3" style={{ backgroundColor: "#74d25f", fontSize: "clamp(1.5rem, 4vw, 2rem)", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              <div className="text text-center">
                <h2 className="card-title mb-1 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{totalRecords > 0 ? [...new Set(costSavings.map(s => s.typeOfCostSaving))].length : 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Active Programs</p>
              </div>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="content d-none d-md-flex justify-content-start align-items-center p-2 p-md-3">
              <div className="icon-wrapper flex-shrink-0">
                <i className="fa-solid fa-chart-line rounded-circle p-2 p-md-3" style={{ backgroundColor: "#74d25f", fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)", display: "flex", alignItems: "center", justifyContent: "center" }} />
              </div>
              <div className="text ms-2 ms-md-3 flex-grow-1 text-start">
                <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)" }}>{totalRecords > 0 ? [...new Set(costSavings.map(s => s.typeOfCostSaving))].length : 0}</h2>
                <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>Active Programs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Premium Collapsible Filter Section */}
      <div className="mb-4" style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(87, 142, 126, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
      }}>
        <div
          className="p-3 d-flex justify-content-between align-items-center cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            backgroundColor: "rgba(87, 142, 126, 0.05)",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-filter" style={{ color: "#578E7E" }}></i>
            <span className="fw-semibold" style={{ color: "#578E7E" }}>Search & Filters</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-link text-decoration-none p-0"
              style={{ color: "#578E7E", fontSize: "0.85rem" }}
              onClick={(e) => { e.stopPropagation(); clearFilters(); }}
            >
              Clear All
            </button>
            <i className={`fa-solid fa-chevron-${showFilters ? 'up' : 'down'}`} style={{ color: "#578E7E", fontSize: "0.8rem" }}></i>
          </div>
        </div>

        <div style={{
          maxHeight: showFilters ? "1000px" : "0",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden"
        }}>
          <div className="p-3 bg-white border-top">
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted">Category</label>
                <select className="form-select shadow-none" name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  {options.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted">Department</label>
                <select className="form-select shadow-none" name="departmentId" value={filters.departmentId} onChange={handleFilterChange}>
                  <option value="">All Departments</option>
                  {options.departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted">Supplier</label>
                <select
                  className="form-select shadow-none"
                  name="supplierName"
                  value={filters.supplierName}
                  onChange={handleFilterChange}
                >
                  <option value="">All Suppliers</option>
                  {options.suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted">Reporting Year</label>
                <select className="form-select shadow-none" name="reportingYear" value={filters.reportingYear} onChange={handleFilterChange}>
                  <option value="">All Years</option>
                  {[2023, 2024, 2025, 2026, 2027].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted">Min Amount</label>
                <input type="number" className="form-control shadow-none" name="minAmount" placeholder="0" value={filters.minAmount} onChange={handleFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Recent Cost Savings</h4>
        <button className="btn text-white fw-bold shadow-sm" style={{ backgroundColor: "#578E7E" }} onClick={() => navigate("/costsavingform")}>
          <i className="fa-solid fa-plus me-2"></i> Add Costsaving
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Supplier Name</th>
                  <th>Intake</th>
                  <th>Requester</th>
                  <th>Department</th>
                  <th>Current Price</th>
                  <th>Proposed Price</th>
                  <th>Est. Savings</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">Loading...</td>
                  </tr>
                ) : costSavings.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">No cost savings data available.</td>
                  </tr>
                ) : (
                  costSavings.map((saving) => {
                    const estSave = parseFloat(saving.currentPrice || 0) - parseFloat(saving.proposedPrice || 0);
                    return (
                      <tr key={saving.id}>
                        <td className="fw-semibold text-secondary">{saving.id}</td>
                        <td className="small">{saving.supplierDetails?.name || saving.supplierName || "-"}</td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-bold">{saving.intakeRequestDetails?.id || saving.intakeRequest}</span>
                            <span className="small text-muted">{saving.intakeRequestDetails?.requestType}</span>
                          </div>
                        </td>
                        <td>{saving.intakeRequestDetails?.requesterName || "-"}</td>
                        <td>{saving.departmentDetails?.name || "-"}</td>
                        <td>{saving.currentPrice ? `$${parseFloat(saving.currentPrice).toFixed(2)}` : "-"}</td>
                        <td>{saving.proposedPrice ? `$${parseFloat(saving.proposedPrice).toFixed(2)}` : "-"}</td>
                        <td className={`fw-bold ${(() => {
                          const cur = parseFloat(saving.currentPrice);
                          const prop = parseFloat(saving.proposedPrice);
                          if (isNaN(cur) || isNaN(prop)) return "text-secondary";
                          return (cur - prop) >= 0 ? "text-success" : "text-danger";
                        })()}`}>
                          {(() => {
                            const cur = parseFloat(saving.currentPrice);
                            const prop = parseFloat(saving.proposedPrice);
                            if (isNaN(cur) || isNaN(prop)) return "-";
                            const est = cur - prop;
                            return `$${est.toFixed(2)}`;
                          })()}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-info me-2 rounded-circle"
                            onClick={() => handleView(saving)}
                            title="View Details"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2 rounded-circle"
                            onClick={() => handleEdit(saving)}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-circle"
                            onClick={() => handleDelete(saving.id)}
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {/* View Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Cost Saving Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSaving && (
            <div className="row g-3">
              <div className="col-md-6 border-bottom pb-2"><strong>ID:</strong> {selectedSaving.id}</div>
              <div className="col-md-6 border-bottom pb-2"><strong>Type:</strong> {selectedSaving.typeOfCostSaving || "-"}</div>
              <div className="col-md-6 border-bottom pb-2">
                <strong>Supplier Name:</strong> {(() => {
                  const sup = options.suppliers.find(s => s.id.toString() === selectedSaving.supplierName?.toString());
                  return sup ? sup.name : (selectedSaving.supplierDetails?.name || selectedSaving.supplierName || "-");
                })()}
              </div>
              <div className="col-md-6 border-bottom pb-2">
                <strong>Category:</strong> {(() => {
                  const cat = options.categories.find(c => c.id?.toString() === selectedSaving.category?.toString() || c.name === selectedSaving.category);
                  return cat ? cat.name : (selectedSaving.category || "-");
                })()}
              </div>
              <div className="col-md-6 border-bottom pb-2"><strong>Reporting Year:</strong> {selectedSaving.reportingYear || "-"}</div>
              <div className="col-md-6 border-bottom pb-2"><strong>Currency:</strong> {selectedSaving.currency || "-"}</div>
              <div className="col-md-6 border-bottom pb-2"><strong>Benefit Start Month:</strong> {selectedSaving.benefitStartMonth || "-"}</div>
              <div className="col-md-6 border-bottom pb-2"><strong>Benefit End Month:</strong> {selectedSaving.benefitEndMonth || "-"}</div>
              <div className="col-md-6 border-bottom pb-2"><strong>Current Price:</strong> {selectedSaving.currentPrice ? `$${selectedSaving.currentPrice}` : "-"}</div>
              <div className="col-md-6 border-bottom pb-2"><strong>Proposed Price:</strong> {selectedSaving.proposedPrice ? `$${selectedSaving.proposedPrice}` : "-"}</div>
              <div className="col-md-12 border-bottom pb-2"><strong>Notes:</strong> {selectedSaving.notesDescription || "-"}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @media (max-width: 576px) {
          .portalcard {
            min-height: 140px;
          }
          .portalcard .content {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .portalcard .icon-wrapper {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            overflow: hidden;
          }
          .portalcard .icon-wrapper i {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          .portalcard .text {
            overflow: hidden;
            word-wrap: break-word;
          }
        }
        @media (min-width: 577px) and (max-width: 768px) {
          .portalcard { min-height: 120px; }
          .portalcard .icon-wrapper { width: 60px; height: 60px; }
        }
        @media (min-width: 769px) {
          .portalcard { min-height: 140px; }
          .portalcard .icon-wrapper { width: 70px; height: 70px; }
        }
      `}</style>
    </div>
  );
};

export default CostsavingDashboard;
