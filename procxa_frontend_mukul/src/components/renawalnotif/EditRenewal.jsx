import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';

const EditRenewalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Renewal request ID
  const { get, post, patch } = useApi();

  // Get renewal data from navigation state or fetch by ID
  const preloadedRenewal = location.state?.renewal;

  const [contracts, setContracts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    contractId: '',
    description: '',
    amendments: '',
    previousExpirationDate: '',
    newExpirationDate: '',
    additionalNotes: '',
    selectDepartment: '',
    vendorName: '',
    contractPrice: '',
    addService: '',
    reminderSchedule: [],
  });

  useEffect(() => {
    fetchContracts();
    fetchDepartments();
    fetchSuppliers();

    if (preloadedRenewal) {
      populateForm(preloadedRenewal);
    } else if (id) {
      fetchRenewalById(id);
    }
  }, [id]);

  const fetchContracts = async () => {
    try {
      const response = await get(endpoints.getAllContracts);
      if (Array.isArray(response?.data)) {
        setContracts(response.data);
      } else if (Array.isArray(response)) {
        setContracts(response);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await get(endpoints.getAllDepartments);
      if (Array.isArray(response?.data)) {
        setDepartments(response.data);
      } else if (Array.isArray(response)) {
        setDepartments(response);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await get(endpoints.getSuppliers);
      if (Array.isArray(response?.data)) {
        setSuppliers(response.data);
      } else if (Array.isArray(response)) {
        setSuppliers(response);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchRenewalById = async (renewalId) => {
    try {
      setLoading(true);
      const response = await get(`${endpoints.getAllRenewalRequests}?id=${renewalId}`);
      if (response?.data && response.data.length > 0) {
        populateForm(response.data[0]);
      }
    } catch (error) {
      setError('Failed to fetch renewal details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (renewal) => {
    // Parse reminderSchedule if it comes as a string or different format
    let schedule = [];
    if (Array.isArray(renewal.reminderSchedule)) {
      schedule = renewal.reminderSchedule;
    } else if (renewal.reminderSchedule && typeof renewal.reminderSchedule === 'string') {
      try {
        schedule = JSON.parse(renewal.reminderSchedule);
      } catch (e) {
        console.error("Error parsing reminderSchedule", e);
      }
    }

    setFormData({
      contractId: renewal.contractId || '',
      description: renewal.description || '',
      amendments: renewal.amendments || '',
      previousExpirationDate: renewal.previousExpirationDate
        ? new Date(renewal.previousExpirationDate).toISOString().split('T')[0]
        : '',
      newExpirationDate: renewal.newExpirationDate
        ? new Date(renewal.newExpirationDate).toISOString().split('T')[0]
        : '',
      additionalNotes: renewal.additionalNotes || '',
      selectDepartment: renewal.selectDepartment || '',
      vendorName: renewal.vendorName || '',
      contractPrice: renewal.contractPrice || '',
      addService: renewal.addService || '',
      reminderSchedule: schedule,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContractSelect = async (contractId) => {
    setFormData(prev => ({ ...prev, contractId }));

    // Auto-fill data from selected contract
    try {
      const response = await get(`${endpoints.getContractForRenewal}/${contractId}`);
      if (response?.success && response.data) {
        const contract = response.data.contract;
        setFormData(prev => ({
          ...prev,
          contractId,
          previousExpirationDate: contract.endDate
            ? new Date(contract.endDate).toISOString().split('T')[0]
            : '',
          selectDepartment: contract.departmentId || '',
          vendorName: contract.supplier?.name || '',
          contractPrice: contract.budget || '',
          description: `Renewal of ${contract.contractName}`,
        }));
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = new FormData();

    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        if (key === 'reminderSchedule') {
          payload.append(key, JSON.stringify(formData[key]));
        } else {
          payload.append(key, formData[key]);
        }
      }
    });

    // Append file if selected
    if (attachment) {
      payload.append('renewalAttachmentFile', attachment);
    }

    try {
      let response;
      if (id) {
        // Update existing renewal
        response = await patch(`${endpoints.updateRenewalRequest}/${id}`, payload);
      } else {
        // Create new renewal
        response = await post(endpoints.addRenewalRequest, payload);
      }

      if (response && (response.status === true || response.success)) {
        setSuccess(id ? 'Renewal updated successfully!' : 'Renewal request created successfully!');
        setTimeout(() => {
          navigate('/renewalmanage');
        }, 1500);
      } else {
        setError(response?.message || 'Failed to submit renewal request');
      }
    } catch (error) {
      setError('Error submitting the form');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.contractId) {
    return (
      <div className="container my-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1 fw-bold">{id ? 'Edit' : 'Create'} Renewal Request</h3>
          <p className="text-muted mb-0">
            {id ? 'Update the renewal details below' : 'Fill in the details to create a renewal request'}
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left me-2"></i>
          Back
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="fa-solid fa-exclamation-circle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show">
          <i className="fa-solid fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleFormSubmit}>
            <div className="row g-3">
              {/* Contract Selection */}
              <div className="col-md-6">
                <label className="form-label">
                  Contract <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="contractId"
                  value={formData.contractId}
                  onChange={(e) => handleContractSelect(e.target.value)}
                  required
                >
                  <option value="">Select Contract</option>
                  {contracts.map((contract) => (
                    <option key={contract.id} value={contract.id}>
                      {contract.contractName || contract.contract_name || `Contract #${contract.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="col-md-6">
                <label className="form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="selectDepartment"
                  value={formData.selectDepartment}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Name */}
              <div className="col-md-6">
                <label className="form-label">Vendor/Supplier Name</label>
                <select
                  className="form-select"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contract Price */}
              <div className="col-md-6">
                <label className="form-label">Contract Price/Budget</label>
                <input
                  type="text"
                  className="form-control"
                  name="contractPrice"
                  value={formData.contractPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., $50,000"
                />
              </div>

              {/* Description */}
              <div className="col-md-12">
                <label className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  placeholder="Describe the renewal purpose and key details"
                />
              </div>

              {/* Amendments */}
              <div className="col-md-12">
                <label className="form-label">Amendments/Changes</label>
                <textarea
                  className="form-control"
                  name="amendments"
                  value={formData.amendments}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="List any changes or amendments to the original contract"
                />
              </div>

              {/* Previous Expiration Date */}
              <div className="col-md-6">
                <label className="form-label">
                  Previous Expiration Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="previousExpirationDate"
                  value={formData.previousExpirationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* New Expiration Date */}
              <div className="col-md-6">
                <label className="form-label">
                  New Expiration Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="newExpirationDate"
                  value={formData.newExpirationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Additional Services */}
              <div className="col-md-12">
                <label className="form-label">Additional Services/Scope</label>
                <textarea
                  className="form-control"
                  name="addService"
                  value={formData.addService}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any additional services or scope changes"
                />
              </div>

              {/* Additional Notes */}
              <div className="col-md-12">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-control"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any other relevant information"
                />
              </div>

              {/* File Upload */}
              <div className="col-md-12">
                <label className="form-label">
                  Attachment
                  {attachment && (
                    <span className="text-success ms-2">
                      <i className="fa-solid fa-check-circle"></i> File selected
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  name="renewalAttachmentFile"
                  className="form-control"
                  onChange={(e) => setAttachment(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <small className="text-muted">Accepted formats: PDF, DOC, DOCX, PNG, JPG</small>
              </div>
            </div>

            {/* Reminder Schedule */}
            <div className="col-md-12">
              <label className="form-label">Reminder Schedule</label>
              <div className="d-flex gap-3">
                {[30, 60, 90].map(days => (
                  <div key={days} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`check-${days}`}
                      checked={formData.reminderSchedule?.includes(days)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData(prev => {
                          const currentSchedule = prev.reminderSchedule || [];
                          if (checked) {
                            return { ...prev, reminderSchedule: [...currentSchedule, days] };
                          } else {
                            return { ...prev, reminderSchedule: currentSchedule.filter(d => d !== days) };
                          }
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor={`check-${days}`}>
                      {days} Days Before
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: '#578e7e' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {id ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save me-2"></i>
                    {id ? 'Update Renewal' : 'Save Renewal'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRenewalPage;
