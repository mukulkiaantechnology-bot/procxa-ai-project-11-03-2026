import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import "./ManageAdmins.css";

const ManageAdmins = () => {
  const { get, post, put, loading } = useApi();
  const [admins, setAdmins] = useState([]);
  const [expiringLicenses, setExpiringLicenses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  // Check user role
  const userType = localStorage.getItem("userType");
  const isSuperAdmin = userType === "superadmin";

  // Form states
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    startDate: "",
    expiryDate: "",
    licensePeriodDays: ""
  });
  const [renewForm, setRenewForm] = useState({
    expiryDate: "",
    extendDays: ""
  });
  const [expiryForm, setExpiryForm] = useState({
    expiryDate: ""
  });
  const [createdLicenseKey, setCreatedLicenseKey] = useState(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [adminStats, setAdminStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    expiring: 0
  });

  useEffect(() => {
    // Only SuperAdmin can access this page
    if (!isSuperAdmin) {
      setMessage({
        type: "error",
        text: "Access denied. SuperAdmin access required."
      });
      return;
    }

    fetchAdmins();
    fetchExpiringLicenses();
  }, [isSuperAdmin]);

  const fetchAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const response = await get(endpoints.getAllAdmins);
      console.log("Fetch admins response:", response);

      // Ensure response.data is an array
      const adminsData = Array.isArray(response?.data) ? response.data : [];

      if (response?.status === true) {
        setAdmins(adminsData);
        setMessage({ type: "", text: "" }); // Clear any previous errors

        // Calculate stats with full null safety
        const stats = {
          total: adminsData.length,
          active: adminsData.filter(a =>
            a?.user_active &&
            a?.license?.is_active === true
          ).length,
          inactive: adminsData.filter(a =>
            !a?.user_active ||
            !a?.license?.is_active
          ).length,
          expiring: adminsData.filter(a => {
            const daysRemaining = a?.license?.days_remaining;
            return daysRemaining !== null &&
              daysRemaining !== undefined &&
              daysRemaining <= 7 &&
              daysRemaining > 0;
          }).length
        };
        setAdminStats(stats);
      } else {
        const errorMsg = response?.message || response?.error?.message || "Failed to load admins";
        setMessage({
          type: "error",
          text: errorMsg
        });
        setAdmins([]); // Set empty array on error
        setAdminStats({ total: 0, active: 0, inactive: 0, expiring: 0 });
      }
    } catch (error) {
      console.error("Fetch admins error:", error);
      const errorMsg = error?.response?.data?.message
        || error?.response?.data?.error?.message
        || error?.message
        || "Failed to load admins. Please check server connection and ensure you are logged in as SuperAdmin.";
      setMessage({
        type: "error",
        text: errorMsg
      });
      setAdmins([]); // Set empty array on error
      setAdminStats({ total: 0, active: 0, inactive: 0, expiring: 0 });
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const fetchExpiringLicenses = async () => {
    try {
      const response = await get(endpoints.getExpiringLicenses, {
        params: { days: 7 }
      });
      if (response?.status && response?.data) {
        setExpiringLicenses(response.data);
      }
    } catch (error) {
      console.error("Failed to load expiring licenses:", error);
      // Don't show error for this, it's not critical
      setExpiringLicenses([]);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await post(endpoints.createAdmin, createForm);
      if (response?.status) {
        const licenseKey = response.data?.license?.license_key;
        setCreatedLicenseKey(licenseKey);
        setShowLicenseModal(true);
        setShowCreateModal(false);
        setCreateForm({
          email: "",
          password: "",
          startDate: "",
          expiryDate: "",
          licensePeriodDays: ""
        });
        fetchAdmins();
        setMessage({ type: "", text: "" }); // Clear any errors
      } else {
        setMessage({ type: "error", text: response?.message || "Failed to create admin" });
      }
    } catch (error) {
      console.error("Create admin error:", error);
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error?.message || "Error creating admin"
      });
    }
  };

  const handleRenewLicense = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const response = await put(`${endpoints.renewLicense}/${selectedAdmin.id}`, renewForm);
      if (response?.status) {
        setMessage({ type: "success", text: "License renewed successfully" });
        setShowRenewModal(false);
        setSelectedAdmin(null);
        setRenewForm({ expiryDate: "", extendDays: "" });
        fetchAdmins();
        fetchExpiringLicenses();
      } else {
        setMessage({ type: "error", text: response?.message || "Failed to renew license" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error renewing license" });
    }
  };

  const handleUpdateExpiry = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const response = await put(`${endpoints.updateExpiry}/${selectedAdmin.id}`, expiryForm);
      if (response?.status) {
        setMessage({ type: "success", text: "Expiry date updated successfully" });
        setShowExpiryModal(false);
        setSelectedAdmin(null);
        setExpiryForm({ expiryDate: "" });
        fetchAdmins();
        fetchExpiringLicenses();
      } else {
        setMessage({ type: "error", text: response?.message || "Failed to update expiry" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating expiry date" });
    }
  };

  const handleToggleAdmin = async (adminId, currentStatus) => {
    try {
      const response = await put(`${endpoints.toggleAdmin}/${adminId}`);
      if (response?.status) {
        setMessage({
          type: "success",
          text: response.message || "Admin status updated",
        });
        fetchAdmins();
      } else {
        setMessage({ type: "error", text: response?.message || "Failed to update status" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating admin status" });
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Never";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const isExpired = (expiryDate) => {
    try {
      if (!expiryDate) return false;
      const date = new Date(expiryDate);
      if (isNaN(date.getTime())) return false;
      return date < new Date();
    } catch (error) {
      console.error("Date comparison error:", error);
      return false;
    }
  };

  const getLicenseStatus = (license) => {
    try {
      if (!license || typeof license !== 'object') {
        return { text: "No License", class: "bg-secondary" };
      }
      if (license.is_active === false || license.is_active === 0) {
        return { text: "Inactive", class: "bg-danger" };
      }
      if (license.expiry_date && isExpired(license.expiry_date)) {
        return { text: "Expired", class: "bg-danger" };
      }
      return { text: "Active", class: "bg-success" };
    } catch (error) {
      console.error("License status error:", error);
      return { text: "Unknown", class: "bg-secondary" };
    }
  };

  // Show access denied if not SuperAdmin
  if (!isSuperAdmin) {
    return (
      <div className="manage-admins-container">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You do not have permission to access this page. SuperAdmin access required.</p>
        </div>
      </div>
    );
  }

  // Ensure admins is always an array to prevent crashes
  const safeAdmins = Array.isArray(admins) ? admins : [];

  return (
    <div className="manage-admins-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Admin User Subscriptions</h3>
        <button className="btn btn-primary shadow-sm" onClick={() => setShowCreateModal(true)}>
          <i className="fa-solid fa-plus me-2"></i> Add Admin User
        </button>
      </div>

      {/* Expiring Licenses Alert */}
      {expiringLicenses.length > 0 && (
        <div className="alert alert-warning">
          <strong>Warning:</strong> {expiringLicenses.length} license(s) expiring within 7 days
        </div>
      )}

      {/* Admin Stats Cards */}
      <div className="admin-stats-cards">
        <div className="stat-card">
          <div className="stat-value">{adminStats.total}</div>
          <div className="stat-label">Total Admins</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{adminStats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-value">{adminStats.inactive}</div>
          <div className="stat-label">Inactive</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-value">{adminStats.expiring}</div>
          <div className="stat-label">Expiring Soon</div>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
          {message.text}
        </div>
      )}

      {isLoadingAdmins ? (
        <div className="text-center py-4">
          <p>Loading admins...</p>
        </div>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Admin Email</th>
                <th>License Key</th>
                <th>License Status</th>
                <th>Expiry Date</th>
                <th>Days Remaining</th>
                <th>User Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeAdmins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-muted py-4">
                    No admins found
                  </td>
                </tr>
              ) : (
                safeAdmins.map((admin) => {
                  // Full null safety for admin object
                  if (!admin || !admin.id) {
                    return null; // Skip invalid admin entries
                  }

                  const licenseStatus = getLicenseStatus(admin?.license);
                  const daysRemaining = admin?.license?.days_remaining;
                  const expiryDate = admin?.license?.expiry_date;

                  return (
                    <tr key={admin.id}>
                      <td>{admin?.email || "N/A"}</td>
                      <td>
                        {admin?.license?.license_key ? (
                          <code>{admin.license.license_key}</code>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${licenseStatus?.class || "bg-secondary"}`}>
                          {licenseStatus?.text || "Unknown"}
                        </span>
                      </td>
                      <td>
                        <span className={isExpired(expiryDate) ? "text-danger" : ""}>
                          {formatDate(expiryDate)}
                        </span>
                      </td>
                      <td>
                        {daysRemaining !== null && daysRemaining !== undefined ? (
                          <span className={daysRemaining < 7 ? "text-warning fw-bold" : ""}>
                            {daysRemaining} days
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${admin?.user_active ? "bg-success" : "bg-danger"}`}>
                          {admin?.user_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setRenewForm({
                                expiryDate: "",
                                extendDays: "30"
                              });
                              setShowRenewModal(true);
                            }}
                            disabled={!admin?.license}
                          >
                            Renew
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setExpiryForm({
                                expiryDate: expiryDate
                                  ? expiryDate.split('T')[0]
                                  : ""
                              });
                              setShowExpiryModal(true);
                            }}
                            disabled={!admin?.license}
                          >
                            Set Expiry
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleToggleAdmin(admin.id, admin?.user_active)}
                          >
                            {admin?.user_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }).filter(Boolean) // Remove any null entries
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Add Admin User</h5>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}></button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                  />
                  <small className="form-text text-muted">Leave empty for today</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={createForm.expiryDate}
                    onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">OR License Period (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={createForm.licensePeriodDays}
                    onChange={(e) => setCreateForm({ ...createForm, licensePeriodDays: e.target.value })}
                    placeholder="e.g., 30, 90, 365"
                  />
                  <small className="form-text text-muted">Use this OR expiry date above</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Creating..." : "Save Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renew License Modal */}
      {showRenewModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowRenewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Renew License</h5>
              <button className="btn-close" onClick={() => setShowRenewModal(false)}></button>
            </div>
            <form onSubmit={handleRenewLicense}>
              <div className="modal-body">
                <p><strong>Admin:</strong> {selectedAdmin?.email || "N/A"}</p>
                <p><strong>Current Expiry:</strong> {formatDate(selectedAdmin?.license?.expiry_date)}</p>
                <div className="mb-3">
                  <label className="form-label">New Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={renewForm.expiryDate}
                    onChange={(e) => setRenewForm({ ...renewForm, expiryDate: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">OR Extend By (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={renewForm.extendDays}
                    onChange={(e) => setRenewForm({ ...renewForm, extendDays: e.target.value })}
                    placeholder="e.g., 30, 90"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRenewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Renewing..." : "Renew License"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Expiry Modal */}
      {showExpiryModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowExpiryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Update Expiry Date</h5>
              <button className="btn-close" onClick={() => setShowExpiryModal(false)}></button>
            </div>
            <form onSubmit={handleUpdateExpiry}>
              <div className="modal-body">
                <p><strong>Admin:</strong> {selectedAdmin?.email || "N/A"}</p>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={expiryForm.expiryDate}
                    onChange={(e) => setExpiryForm({ expiryDate: e.target.value })}
                  />
                  <small className="form-text text-muted">Leave empty to remove expiry</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpiryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* License Key Display Modal */}
      {showLicenseModal && createdLicenseKey && (
        <div className="modal-overlay" onClick={() => {
          setShowLicenseModal(false);
          setCreatedLicenseKey(null);
        }}>
          <div className="modal-content license-key-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>✅ Admin Created Successfully!</h5>
              <button className="btn-close" onClick={() => {
                setShowLicenseModal(false);
                setCreatedLicenseKey(null);
              }}></button>
            </div>
            <div className="modal-body">
              <div className="license-key-display">
                <p className="mb-3"><strong>License Key Generated:</strong></p>
                <div className="license-key-box">
                  <code className="license-key-text">{createdLicenseKey}</code>
                  <button
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(createdLicenseKey);
                      alert("License key copied to clipboard!");
                    }}
                  >
                    Copy License Key
                  </button>
                </div>
                <p className="mt-3 text-muted small">
                  ⚠️ Save this license key. The admin can use it to activate their account.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowLicenseModal(false);
                  setCreatedLicenseKey(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;

