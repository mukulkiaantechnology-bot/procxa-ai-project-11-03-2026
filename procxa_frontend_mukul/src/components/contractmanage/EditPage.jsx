import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import endpoints from '../../api/endPoints';
import useApi from '../../hooks/useApi';

function EditPage() {
  const { patch } = useApi();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initializing form state
  const [formData, setFormData] = useState({
    contractId: '',
    contractName: '',
    departmentId: '',
    buisnessStackHolder: '',
    contractTypeId: '',
    sourceLeadName: '',
    sourceDirectorName: '',
    startDate: '',
    endDate: '',
    contractValue: '',
    annualSpend: '',
    spendCategory: '',
    renewalReminder: false,
  });

  const location = useLocation();

  useEffect(() => {
    const { contract } = location.state || {};
    console.log(contract);

    if (contract) {
      setFormData({
        contractId: contract.id || '',
        contractName: contract.contractName || '',
        departmentId: contract.departmentId || '',
        buisnessStackHolder: contract.buisnessStackHolder || '',
        contractTypeId: contract.contractTypeId || '',
        sourceLeadName: contract.sourceLeadName || '',
        sourceDirectorName: contract.sourceDirectorName || '',
        startDate: contract.startDate ? contract.startDate.split('T')[0] : '',
        endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
        contractValue: contract.contractValue || '',
        annualSpend: contract.annualSpend || '',
        spendCategory: contract.spendCategory || '',
        renewalReminder: contract.renewalReminder || false,
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await patch(`${endpoints.updateContract}/${formData.contractId}`, formData);

      if (response.status) { // Ensure the status is 200 for success
        setMessage({ type: "success", text: response.message });
      } else {
        alert('Failed to update contract');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      setMessage({ type: "error", text: error.message || 'An error occurred while updating the contract.' });

    }
  };

  return (
    <div>
      <div className="multiyear-edit-section my-5">
        <div className="container">
          {message.text && (
            <div
              className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
                }`}
            >
              {message.text}
            </div>
          )}
          <h3>Edit Contract</h3>
          <form className="row g-3 mt-4" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Contract Name</label>
              <input
                type="text"
                className="form-control"
                name="contractName"
                value={formData.contractName}
                onChange={handleChange}
                placeholder="Enter Contract Name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                placeholder="Enter Department"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Business Stakeholder</label>
              <input
                type="text"
                className="form-control"
                name="buisnessStackHolder"
                value={formData.buisnessStackHolder}
                onChange={handleChange}
                placeholder="Enter Business Stakeholder"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Contract Type</label>
              <input
                type="text"
                className="form-control"
                name="contractTypeId"
                value={formData.contractTypeId}
                onChange={handleChange}
                placeholder="Enter Contract Type"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sourcing Lead</label>
              <input
                type="text"
                className="form-control"
                name="sourceLeadName"
                value={formData.sourceLeadName}
                onChange={handleChange}
                placeholder="Enter Sourcing Lead"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Sourcing Director</label>
              <input
                type="text"
                className="form-control"
                name="sourceDirectorName"
                value={formData.sourceDirectorName}
                onChange={handleChange}
                placeholder="Enter Sourcing Director"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Contract Value</label>
              <input
                type="number"
                className="form-control"
                name="contractValue"
                value={formData.contractValue}
                onChange={handleChange}
                placeholder="Enter Contract Value"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Annual Spend</label>
              <input
                type="number"
                className="form-control"
                name="annualSpend"
                value={formData.annualSpend}
                onChange={handleChange}
                placeholder="Enter Annual Spend"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Spend Category</label>
              <select
                className="form-select"
                name="spendCategory"
                value={formData.spendCategory}
                onChange={handleChange}
              >
                <option value="">Select Spend Category</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Legal">Legal</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="renewalReminder"
                  id="renewalReminder"
                  checked={formData.renewalReminder}
                  onChange={(e) =>
                    setFormData({ ...formData, renewalReminder: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="renewalReminder">
                  Enable Renewal Notification
                </label>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-center">
              <button
                type="button"
                className="btn me-3"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #578e7e",
                  color: "#578e7e",
                  padding: "10px",
                  width: "150px",
                }}
                onClick={() => navigate("/contractmanage")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: '#578e7e',
                  color: 'white',
                  padding: "10px",
                  width: "150px"
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
