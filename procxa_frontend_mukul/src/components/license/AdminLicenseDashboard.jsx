import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import "./AdminLicenseDashboard.css";

const AdminLicenseDashboard = () => {
  const { get, post, put, loading } = useApi();
  const [licenses, setLicenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Check user role
  const userType = localStorage.getItem("userType");
  const isSuperAdmin = userType === "superadmin";

  useEffect(() => {
    fetchLicenses();
    fetchAnalytics();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await get(endpoints.getAllDepartments);
      if (response.status) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch analytics for summary cards
      const response = await get(endpoints.getLicenseAnalytics || '/license/analytics');
      if (response.status) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Error fetching license analytics:", error);
    }
  };

  const fetchLicenses = async () => {
    try {
      if (isSuperAdmin) {
        // SuperAdmin: Get all licenses
        const response = await get(endpoints.getAllLicenses);
        if (response?.status && response?.data) {
          setLicenses(Array.isArray(response.data) ? response.data : []);
        } else {
          setMessage({
            type: "error",
            text: "Failed to load licenses",
          });
          setLicenses([]);
        }
      } else {
        // Admin: Get only their own data
        const response = await get(endpoints.getMyAdminData);
        if (response?.status && response?.data) {
          // Convert single admin object to array format for consistent rendering
          const adminData = response.data;
          const licensesArray = adminData?.license ? [{
            id: adminData.license.id,
            license_key: adminData.license.license_key,
            assigned_email: adminData.email,
            status: adminData.license.status,
            is_active: adminData.license.is_active,
            expiry_date: adminData.license.expiry_date,
            created_at: adminData.license.created_at,
            updated_at: adminData.license.updated_at,
            days_remaining: adminData.license.days_remaining
          }] : [];
          setLicenses(licensesArray);
        } else {
          setMessage({
            type: "error",
            text: "Failed to load your license data",
          });
          setLicenses([]);
        }
      }
    } catch (error) {
      console.error("Fetch licenses error:", error);
      setMessage({
        type: "error",
        text: isSuperAdmin ? "Error loading licenses" : "Error loading your license data",
      });
      setLicenses([]);
    }
  };

  const handleCreateLicense = async () => {
    try {
      const params = expiryDate
        ? { expiryDate: expiryDate }
        : {};

      const response = await get(endpoints.generateLicense, { params });

      if (response?.status) {
        setMessage({
          type: "success",
          text: `License key generated: ${response.license_key}`,
        });
        setShowCreateModal(false);
        setExpiryDate("");
        fetchLicenses();
        fetchAnalytics();
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to generate license",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error generating license key",
      });
    }
  };

  const handleToggleStatus = async (licenseId, currentStatus) => {
    try {
      const response = await put(`${endpoints.toggleLicenseStatus}/${licenseId}`);

      if (response?.status) {
        setMessage({
          type: "success",
          text: response.message || "License status updated",
        });
        fetchLicenses();
        fetchAnalytics();
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to update license status",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error updating license status",
      });
    }
  };

  const handleUpdateExpiry = async () => {
    if (!selectedLicense) return;

    try {
      const response = await put(`${endpoints.updateExpiryDate}/${selectedLicense.id}`, {
        expiryDate: expiryDate || null,
      });

      if (response?.status) {
        setMessage({
          type: "success",
          text: "Expiry date updated successfully",
        });
        setShowExpiryModal(false);
        setSelectedLicense(null);
        setExpiryDate("");
        fetchLicenses();
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to update expiry date",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error updating expiry date",
      });
    }
  };

  const openExpiryModal = (license) => {
    setSelectedLicense(license);
    setExpiryDate(license.expiry_date ? license.expiry_date.split('T')[0] : "");
    setShowExpiryModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // Helper to get real department name
  const getDepartmentName = (analyticsDept) => {
    if (!analyticsDept) return "Unknown";
    // Try to find by ID first if available (from my backend update)
    if (analyticsDept.departmentId) {
      const match = departments.find(d => d.id === analyticsDept.departmentId);
      if (match) return match.name;
    }
    // Fallback to name matching if IDs not available
    const matchByName = departments.find(d => d.name === analyticsDept.departmentName);
    if (matchByName) return matchByName.name;

    return analyticsDept.departmentName || "Unknown";
  };

  return (
    <div className="admin-license-dashboard container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">{isSuperAdmin ? "License Management Dashboard" : "My License Dashboard"}</h2>
        {isSuperAdmin && (
          <button
            className="btn btn-primary shadow-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fa-solid fa-plus me-2"></i> Create New License
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
            } alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
        </div>
      )}

      {/* Summary Cards */}
      {isSuperAdmin && (
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card text-white h-100 shadow-sm border-0" style={{ backgroundColor: "#578e7e", borderRadius: "15px" }}>
              <div className="card-body d-flex align-items-center p-4">
                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                  <i className="fa-solid fa-server fa-2x"></i>
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">{analytics?.total || 0}</h2>
                  <p className="mb-0 text-white-50">Total Licenses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white h-100 shadow-sm border-0" style={{ backgroundColor: "#3276e8", borderRadius: "15px" }}>
              <div className="card-body d-flex align-items-center p-4">
                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                  <i className="fa-solid fa-check-circle fa-2x"></i>
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">{analytics?.used || 0}</h2>
                  <p className="mb-0 text-white-50">Used Licenses</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white h-100 shadow-sm border-0" style={{ backgroundColor: "#ff9318", borderRadius: "15px" }}>
              <div className="card-body d-flex align-items-center p-4">
                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                  <i className="fa-solid fa-layer-group fa-2x"></i>
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">{analytics?.unused || 0}</h2>
                  <p className="mb-0 text-white-50">Unused Licenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Breakdown */}
      {isSuperAdmin && analytics?.departmentWise && (
        <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: "15px" }}>
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="mb-0 fw-bold text-dark">Department-wise License Distribution</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light text-muted">
                  <tr>
                    <th>Department Name</th>
                    <th className="text-center">Total Licenses</th>
                    <th className="text-center">Used</th>
                    <th className="text-center">Unused</th>
                    <th className="text-center" style={{ width: "250px" }}>Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.departmentWise.map((dept, index) => {
                    const utilization = dept.total > 0 ? (dept.used / dept.total) * 100 : 0;
                    return (
                      <tr key={index}>
                        <td className="fw-semibold">{getDepartmentName(dept)}</td>
                        <td className="text-center">{dept.total}</td>
                        <td className="text-center text-success fw-bold">{dept.used}</td>
                        <td className="text-center text-secondary fw-bold">{dept.unused}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: "8px", borderRadius: "4px" }}>
                              <div
                                className={`progress-bar ${utilization > 80 ? 'bg-danger' : utilization > 50 ? 'bg-primary' : 'bg-success'}`}
                                role="progressbar"
                                style={{ width: `${utilization}%` }}
                              ></div>
                            </div>
                            <span className="small text-muted">{utilization.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* License List Table */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">All Licenses</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted">
                <tr>
                  <th>License Key</th>
                  <th>Assigned Email</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Expiry Date</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {licenses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="fa-solid fa-folder-open fa-2x mb-3 d-block text-secondary opacity-50"></i>
                      No licenses found
                    </td>
                  </tr>
                ) : (
                  licenses.map((license) => (
                    <tr key={license.id}>
                      <td>
                        <code className="bg-light px-2 py-1 rounded border">{license.license_key}</code>
                      </td>
                      <td>{license.assigned_email || <span className="text-muted fst-italic">Unassigned</span>}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${license.status === "active"
                            ? "bg-success"
                            : license.status === "revoked"
                              ? "bg-danger"
                              : "bg-secondary"
                            }`}
                        >
                          {license.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${license.is_active ? "bg-success" : "bg-danger"
                            }`}
                        >
                          <i className={`fa-solid ${license.is_active ? "fa-check" : "fa-times"} me-1`}></i>
                          {license.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            isExpired(license.expiry_date) ? "text-danger fw-bold" : ""
                          }
                        >
                          {formatDate(license.expiry_date)}
                          {isExpired(license.expiry_date) && (
                            <span className="badge bg-danger ms-2">Expired</span>
                          )}
                        </span>
                      </td>
                      <td>{formatDate(license.created_at)}</td>
                      <td>
                        {isSuperAdmin ? (
                          <div className="btn-group" role="group">
                            <button
                              className={`btn btn-sm ${license.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
                              onClick={() => handleToggleStatus(license.id, license.is_active)}
                              title={license.is_active ? "Deactivate" : "Activate"}
                            >
                              <i className={`fa-solid ${license.is_active ? "fa-ban" : "fa-power-off"}`}></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => openExpiryModal(license)}
                              title="Set Expiry"
                            >
                              <i className="fa-solid fa-calendar-alt"></i>
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">View Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create License Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content shadow-lg border-0" onClick={(e) => e.stopPropagation()} style={{ borderRadius: "12px" }}>
            <div className="modal-header bg-light border-bottom-0">
              <h5 className="modal-title fw-bold">Create New License</h5>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="form-control form-control-lg"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                <small className="form-text text-muted mt-2 d-block">
                  <i className="fa-solid fa-info-circle me-1"></i> Leave empty for a lifetime license
                </small>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button
                className="btn btn-light"
                onClick={() => {
                  setShowCreateModal(false);
                  setExpiryDate("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary px-4"
                onClick={handleCreateLicense}
                disabled={loading}
              >
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Generating...</> : "Generate License"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Expiry Modal */}
      {showExpiryModal && selectedLicense && (
        <div className="modal-overlay" onClick={() => setShowExpiryModal(false)}>
          <div className="modal-content shadow-lg border-0" onClick={(e) => e.stopPropagation()} style={{ borderRadius: "12px" }}>
            <div className="modal-header bg-light border-bottom-0">
              <h5 className="modal-title fw-bold">Update Expiry Date</h5>
              <button
                className="btn-close"
                onClick={() => {
                  setShowExpiryModal(false);
                  setSelectedLicense(null);
                  setExpiryDate("");
                }}
              ></button>
            </div>
            <div className="modal-body p-4">
              <p className="mb-3">
                <strong>License Key:</strong> <code className="bg-light px-2 py-1 rounded">{selectedLicense.license_key}</code>
              </p>
              <div className="mb-3">
                <label className="form-label fw-semibold">New Expiry Date</label>
                <input
                  type="date"
                  className="form-control form-control-lg"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
                <small className="form-text text-muted mt-2 d-block">
                  <i className="fa-solid fa-info-circle me-1"></i> Leave empty to remove expiry date limitations
                </small>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button
                className="btn btn-light"
                onClick={() => {
                  setShowExpiryModal(false);
                  setSelectedLicense(null);
                  setExpiryDate("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary px-4"
                onClick={handleUpdateExpiry}
                disabled={loading}
              >
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : "Update Date"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLicenseDashboard;
