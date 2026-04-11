

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import { Modal } from "react-bootstrap";

const NotificationPreferences = () => {
  const { get, post, del } = useApi();
  const navigate = useNavigate();

  // State
  const [contracts, setContracts] = useState([]);
  const [contractId, setContractId] = useState("");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [reminderSchedule, setReminderSchedule] = useState({
    30: false,
    60: false,
    90: false
  });
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState("");
  const [message, setMessage] = useState("");
  const [allPreferences, setAllPreferences] = useState([]);

  // Modals state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    intakeRequestId: "",
    emailRecipients: "",
    supplierName: "",
    reminderSchedule: { 30: false, 60: false, 90: false },
    isOtherChecked: false,
    customDaysInput: ""
  });

  const fetchAllPreferences = async () => {
    try {
      const res = await get(endpoints.getAllContractPreferences);
      if (res?.status) {
        setAllPreferences(res.data);
      }
    } catch (error) {
      console.error("Error fetching all preferences:", error);
    }
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await get(endpoints.getContractsForNotification);
        if (res?.status) {
          setContracts(res.data);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
    fetchContracts();
    fetchAllPreferences();
  }, []);

  // Fetch existing preference when contract changes
  useEffect(() => {
    if (contractId) {
      const fetchPreference = async () => {
        try {
          const res = await get(`${endpoints.getContractPreference}/${contractId}`);
          if (res?.status && res.data) {
            setEmailRecipients(res.data.emailRecipients || "");
            const schedule = { 30: false, 60: false, 90: false };
            if (Array.isArray(res.data.reminderDays)) {
              res.data.reminderDays.forEach(days => {
                schedule[days] = true;
              });
            }
            setReminderSchedule(schedule);
             // handle custom days
            const standardDays = [30, 60, 90];
            const customDays = res.data.reminderDays.filter(d => !standardDays.includes(d));
            if (customDays.length > 0) {
              setIsOtherChecked(true);
              setCustomDaysInput(customDays.join(", "));
            } else {
              setIsOtherChecked(false);
              setCustomDaysInput("");
            }
          } else {
            // Reset if no preference found
            setEmailRecipients("");
            setReminderSchedule({ 30: false, 60: false, 90: false });
            setIsOtherChecked(false);
            setCustomDaysInput("");
          }
        } catch (error) {
          console.error("Error fetching preference:", error);
        }
      };
      fetchPreference();
    }
  }, [contractId]);

  // Handle Checkbox Change
  const handleCheckboxChange = (day) => {
    setReminderSchedule(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Save preferences and send to API
  const handleSave = async () => {
    if (!contractId) {
      setMessage("Please select a Contract!");
      return;
    }

    // Get selected days
    const selectedDays = Object.keys(reminderSchedule)
      .filter(day => reminderSchedule[day])
      .map(Number);

    // Add custom days if "Other" is checked
    if (isOtherChecked && customDaysInput) {
      const customs = customDaysInput
        .split(",")
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n) && n > 0);
      
      customs.forEach(c => {
        if (!selectedDays.includes(c)) {
          selectedDays.push(c);
        }
      });
    }

    if (selectedDays.length === 0) {
      setMessage("Please select at least one reminder day!");
      return;
    }

    const payload = {
      intakeRequestId: contractId,
      emailRecipients,
      reminderDays: selectedDays
    };

    try {
      const res = await post(endpoints.saveContractPreference, payload);
      if (res.status) {
        setMessage("Preferences Saved Successfully!");
        fetchAllPreferences(); // Refresh the list
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.message || "Error saving preferences.");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Error saving preferences, please try again.");
    }
  };

  const handleDeletePreference = async (id) => {
    if (window.confirm("Are you sure you want to delete this preference?")) {
      try {
        const res = await del(`${endpoints.deleteContractPreference}/${id}`);
        if (res.status) {
          setMessage("Preference deleted successfully.");
          fetchAllPreferences();
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (err) {
        console.error("Error deleting preference:", err);
      }
    }
  };

  const handleViewPreference = (pref) => {
    setViewData(pref);
    setShowViewModal(true);
  };

  const handleEditPreference = (pref) => {
    const schedule = { 30: false, 60: false, 90: false };
    
    // Safely parse reminderDays
    const daysArray = Array.isArray(pref.reminderDays) 
      ? pref.reminderDays 
      : typeof pref.reminderDays === 'string' ? JSON.parse(pref.reminderDays) : [];
      
    daysArray.forEach(days => {
      schedule[days] = true;
    });
    
    const standardDays = [30, 60, 90];
    const customDays = daysArray.filter(d => !standardDays.includes(d));

    setEditData({
      id: pref.id,
      intakeRequestId: pref.intakeRequestId,
      emailRecipients: pref.emailRecipients || "",
      supplierName: pref.intakeDetails?.supplierName || "N/A",
      reminderSchedule: schedule,
      isOtherChecked: customDays.length > 0,
      customDaysInput: customDays.join(", ")
    });
    
    setShowEditModal(true);
  };

  const handleUpdateModal = async () => {
    const selectedDays = Object.keys(editData.reminderSchedule)
      .filter(day => editData.reminderSchedule[day])
      .map(Number);

    // Add custom days if "Other" is checked in modal
    if (editData.isOtherChecked && editData.customDaysInput) {
      const customs = editData.customDaysInput
        .split(",")
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n) && n > 0);
      
      customs.forEach(c => {
        if (!selectedDays.includes(c)) {
          selectedDays.push(c);
        }
      });
    }

    if (selectedDays.length === 0) {
      setMessage("Please select at least one reminder day!");
      return;
    }

    const payload = {
      intakeRequestId: editData.intakeRequestId,
      emailRecipients: editData.emailRecipients,
      reminderDays: selectedDays
    };

    try {
      const res = await post(endpoints.saveContractPreference, payload);
      if (res.status) {
        setMessage("Preference Updated Successfully!");
        fetchAllPreferences(); // Refresh the list
        setShowEditModal(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.message || "Error updating preference.");
      }
    } catch (error) {
      console.error("Error updating preference:", error);
      setMessage("Error updating preference.");
    }
  };

  const selectedContract = contracts.find(c => c.id.toString() === contractId.toString());

  return (
    <>
      <style jsx>{`
        .notification-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .subtitle {
          color: #666;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
        }

        .form-card {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .summary-card {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #e9ecef;
          height: fit-content;
        }

        .form-group {
          margin-bottom: 25px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .checkbox-group {
          display: flex;
          gap: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .save-button {
          background-color: #578e7e;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          font-weight: 500;
          transition: background 0.2s;
        }

        .save-button:hover {
          background-color: #467568;
        }

        .summary-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
          border-bottom: 2px solid #578e7e;
          padding-bottom: 10px;
          display: inline-block;
        }

        .summary-item {
          margin-bottom: 15px;
        }

        .summary-label {
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .summary-value {
          font-weight: 500;
          color: #333;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="notification-container">
        <div className="header">
          <div>
            <h1 className="title">Preferences</h1>
            <p className="subtitle">Configure renewal alerts for your contracts</p>
          </div>
          <Link to="/editrenewalnoti" className="btn btn-outline-secondary">
            Edit Email Template
          </Link>
        </div>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"} mb-4`}>
            {message}
          </div>
        )}

        <div className="content-grid">
          {/* Main Configuration Form */}
          <div className="form-card">
            <h3 className="mb-4">Configuration</h3>

            <div className="form-group">
              <label className="form-label">Link to Contract <span className="text-danger">*</span></label>
              <select
                className="form-control"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
              >
                <option value="">Select a Contract</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {`#${c.id} | ${c.requesterName} | ${c.department?.name || "N/A"} | ${c.supplierName || "N/A"}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Recipients</label>
              <input
                type="text"
                className="form-control"
                placeholder="email1@example.com, email2@example.com"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
              />
              <small className="text-muted">Separate multiple emails with commas</small>
            </div>

            <div className="form-group">
              <label className="form-label">Reminder Schedule <span className="text-danger">*</span></label>
              <div className="checkbox-group">
                {[30, 60, 90].map(days => (
                  <label key={days} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reminderSchedule[days]}
                      onChange={() => handleCheckboxChange(days)}
                    />
                    {days} Days
                  </label>
                ))}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isOtherChecked}
                    onChange={(e) => setIsOtherChecked(e.target.checked)}
                  />
                  Other
                </label>
              </div>
              {isOtherChecked && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter days (e.g. 120, 150)"
                    value={customDaysInput}
                    onChange={(e) => setCustomDaysInput(e.target.value)}
                  />
                  <small className="text-muted">Separate multiple values with commas</small>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="save-button" onClick={handleSave}>
                Save Preferences
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="summary-card">
            <h3 className="summary-title">Renewal Summary</h3>

            <div className="summary-item">
              <div className="summary-label">Linked Contract</div>
              <div className="summary-value">
                {selectedContract ? (
                  <div className="d-flex flex-column">
                    <span className="fw-bold">#{selectedContract.id}</span>
                    <span className="small">{selectedContract.supplierName}</span>
                  </div>
                ) : (
                  <span className="text-muted fst-italic">No Contract Selected</span>
                )}
              </div>
            </div>

            {selectedContract && (
              <>
                <div className="summary-item">
                  <div className="summary-label">Requester</div>
                  <div className="summary-value small">{selectedContract.requesterName}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Department</div>
                  <div className="summary-value small">{selectedContract.department?.name || "N/A"}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Expiry Date</div>
                  <div className="summary-value text-danger">
                    {selectedContract.endDate ? new Date(selectedContract.endDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </>
            )}

            <div className="summary-item">
              <div className="summary-label">Recipients</div>
              <div className="summary-value">
                {emailRecipients ? emailRecipients.split(',').length : 0} Recipients
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-label">Schedule</div>
              <div className="summary-value">
                {(() => {
                  const days = Object.keys(reminderSchedule)
                    .filter(d => reminderSchedule[d])
                    .map(d => `${d} Days`);
                  
                  if (isOtherChecked && customDaysInput) {
                    const customs = customDaysInput
                      .split(",")
                      .map(s => s.trim())
                      .filter(s => s !== "" && !isNaN(parseInt(s)));
                    
                    customs.forEach(c => days.push(`${c} Days`));
                  }

                  return days.length > 0 ? days.join(', ') : <span className="text-muted">None selected</span>;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Management Table */}
        <div className="mt-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-0">
              <h4 className="mb-0 fw-bold" style={{ color: "#333" }}>Notification Preferences Management</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Contract ID</th>
                      <th className="py-3">Supplier</th>
                      <th className="py-3">Recipients</th>
                      <th className="py-3">Schedule</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPreferences.length > 0 ? (
                      allPreferences.map((pref) => (
                        <tr key={pref.id} className="align-middle">
                          <td className="px-4 fw-bold">#{pref.intakeRequestId}</td>
                          <td>{pref.intakeDetails?.supplierName || "N/A"}</td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary border">
                              {pref.emailRecipients?.split(',').length || 0} Recipients
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {(Array.isArray(pref.reminderDays) ? pref.reminderDays : 
                                typeof pref.reminderDays === 'string' ? JSON.parse(pref.reminderDays) : [])?.map(day => (
                                <span key={day} className="badge bg-success-subtle text-success border">
                                  {day} Days
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button 
                                className="btn btn-sm btn-outline-info border-0"
                                onClick={() => handleViewPreference(pref)}
                                title="View Details"
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-primary border-0"
                                onClick={() => handleEditPreference(pref)}
                                title="Edit"
                              >
                                <i className="fa-solid fa-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger border-0"
                                onClick={() => handleDeletePreference(pref.id)}
                                title="Delete"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No notification preferences saved yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title style={{ color: '#578e7e', fontWeight: 600 }}>View Preference</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-2">
            {viewData && (
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded border">
                  <h6 className="text-muted text-uppercase mb-1" style={{ fontSize: '12px' }}>Contract & Supplier</h6>
                  <div className="fw-bold fs-5">#{viewData.intakeRequestId}</div>
                  <div className="text-secondary">{viewData.intakeDetails?.supplierName || "N/A"}</div>
                </div>
                
                <div className="p-3 bg-light rounded border">
                  <h6 className="text-muted text-uppercase mb-1" style={{ fontSize: '12px' }}>Email Recipients</h6>
                  <div className="text-break">{viewData.emailRecipients || "None"}</div>
                </div>

                <div className="p-3 bg-light rounded border">
                  <h6 className="text-muted text-uppercase mb-1" style={{ fontSize: '12px' }}>Reminder Schedule</h6>
                  <div className="d-flex gap-2 mt-2">
                    {(Array.isArray(viewData.reminderDays) ? viewData.reminderDays : 
                      typeof viewData.reminderDays === 'string' ? JSON.parse(viewData.reminderDays) : [])?.map(day => (
                      <span key={day} className="badge bg-success px-3 py-2 rounded-pill">
                        {day} Days Before
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title style={{ color: '#578e7e', fontWeight: 600 }}>Edit Preference</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <label className="form-label text-muted">Contract</label>
              <input type="text" className="form-control bg-light text-muted" value={`#${editData.intakeRequestId} | ${editData.supplierName}`} readOnly disabled />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Email Recipients</label>
              <input 
                type="text" 
                className="form-control" 
                value={editData.emailRecipients} 
                onChange={e => setEditData(prev => ({...prev, emailRecipients: e.target.value}))} 
              />
              <small className="text-muted">Separate multiple emails with commas</small>
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Reminder Schedule <span className="text-danger">*</span></label>
              <div className="checkbox-group">
                {[30, 60, 90].map(days => (
                  <label key={days} className="checkbox-label me-3">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={editData.reminderSchedule[days]}
                      onChange={() => setEditData(prev => ({
                        ...prev, 
                        reminderSchedule: {...prev.reminderSchedule, [days]: !prev.reminderSchedule[days]}
                      }))}
                    />
                    {days} Days
                  </label>
                ))}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={editData.isOtherChecked}
                    onChange={(e) => setEditData(prev => ({ ...prev, isOtherChecked: e.target.checked }))}
                  />
                  Other
                </label>
              </div>
              {editData.isOtherChecked && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter days (e.g. 120, 150)"
                    value={editData.customDaysInput}
                    onChange={(e) => setEditData(prev => ({ ...prev, customDaysInput: e.target.value }))}
                  />
                  <small className="text-muted">Separate multiple values with commas</small>
                </div>
              )}
            </div>
            <button className="save-button w-100" onClick={handleUpdateModal}>
              Update Preference
            </button>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default NotificationPreferences;