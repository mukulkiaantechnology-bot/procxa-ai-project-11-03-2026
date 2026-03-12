import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const AddNewContract = () => {
  const navigate = useNavigate();
  const { post, get } = useApi();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [contracts, setContracts] = useState([]);

  const [formData, setFormData] = useState({
    contractName: "",
    description: "",
    contractTypeId: "",
    departmentId: "",
    startDate: "",
    endDate: "",
    sourceLeadName: "",
    sourceDirectorName: "",
    businessStackHolder: "",
    supplierName: "",
    budget: "",
    currency: "",
    paymentTerms: "",
    milestones: [{ id: 1, name: "", dueDate: "", responsible: "" }],
    approvers: "",
    approvalLevels: "",
    thresholdRules: "",
    contractAttachmentFile: "",
    agreementId: "",
    contractValue: "",
    annualSpend: "",
    spendCategory: "",
    renewalReminder: false,
    sowFiles: [],
    amendmentFiles: []
  });

  // Handle general input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, contractAttachmentFile: file });
  };
  const triggerFileInput = () => {
    document.getElementById("contractAttachmentFile").click();
  };


  // Handle milestone changes
  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index][field] = value;
    setFormData({
      ...formData,
      milestones: updatedMilestones,
    });
  };

  // Add new milestone row
  const addMilestone = (e) => {
    e.preventDefault(); // Prevent page refresh
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        { id: formData.milestones.length + 1, name: "", dueDate: "", responsible: "" },
      ],
    });
  };

  // Remove milestone row
  const removeMilestone = (index, e) => {
    e.preventDefault(); // Prevent page refresh
    const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      milestones: updatedMilestones,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      // Append files separately if they are arrays
      if (key === 'sowFiles') {
        formData.sowFiles.forEach(file => payload.append('sowFiles', file));
      } else if (key === 'amendmentFiles') {
        formData.amendmentFiles.forEach(file => payload.append('amendmentFiles', file));
      } else if (formData[key]) {
        payload.append(key, formData[key]);
      }
    });

    for (let [key, value] of payload.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await post(endpoints.addContract, payload);
      setMessage({ type: "success", text: response.message });
      setFormData({
        contractName: "",
        description: "",
        contractTypeId: "",
        departmentId: "",
        startDate: "",
        endDate: "",
        sourceLeadName: "",
        sourceDirectorName: "",
        businessStackHolder: "",
        supplierName: "",
        budget: "",
        currency: "",
        paymentTerms: "",
        milestones: [{ id: 1, name: "", dueDate: "", responsible: "" }],
        approvers: "",
        approvalLevels: "",
        thresholdRules: "",
        contractAttachmentFile: "",
        agreementId: "",
        contractValue: "",
        annualSpend: "",
        spendCategory: "",
        renewalReminder: false,
        sowFiles: [],
        amendmentFiles: []
      });
    } catch (error) {
      console.error("Error submitting the request:", error);
      setMessage({ type: "error", text: error.message || "Failed to submit the request." });
    }
  };
  const fetchDepartments = async () => {
    try {
      const [departmentResponse, supplierResponse, contractResponse] = await Promise.all([
        get(endpoints.getAllDepartments),
        get(endpoints.getSuppliers),
        get(endpoints.getAllContractTemplates)
      ]);


      // Handle departments
      if (supplierResponse && supplierResponse.data) {
        setSuppliers(supplierResponse.data);
      } else {
        console.error("Error fetching departments");
      }
      if (departmentResponse && departmentResponse.data) {
        setDepartments(departmentResponse.data);

      } else {
        console.error("Error fetching Suppliers");
      }
      if (contractResponse && contractResponse.templates) {
        setContracts(contractResponse.templates);
      } else {
        console.error("Error fetching Contracts");
      }



    } catch (error) {
      console.error("Error fetching categories and departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);


  return (
    <div className="container mt-4">
      {message.text && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
            }`}
        >
          {message.text}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "20px",
        }}>

        <div>
          <h2 style={{ textAlign: "start" }}>Add New Contract</h2>
        </div>
        <div>
          <Link to="/contractmanage">
            <button
              style={{
                width: "120px",
                height: "49px",
                border: "none",
                backgroundColor: "#578E7E",
                color: "white",
                borderRadius: "5px",
              }}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Contract Information */}
        <div className="row mb-3 mt-5">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="contractName"
              placeholder="Contract Name*"
              className="form-control p-3"
              value={formData.contractName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="form-control p-3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="contractTypeId"
              className="form-control p-3"
              style={{
                fontSize: "16px",
                fontFamily: "inherit",
                color: "gray",
              }}
              placeholder="Enter Contract Type*"
              value={formData.contractTypeId}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <select
              name="departmentId"
              className="form-select p-3"
              style={{
                fontSize: "16px",
                fontFamily: "inherit",
                color: "gray",
              }}
              value={formData.departmentId}
              onChange={handleChange}
            >
              <option value="">Select Department*</option>
              {departments?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3 position-relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-control p-3"
            />
            {!formData.startDate && (
              <span
                className="position-absolute text-secondary"
                style={{
                  top: "50%",
                  left: "120px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "black"
                }}
              >
                Start Date
              </span>
            )}
          </div>
          <div className="col-md-4 mb-3 position-relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-control p-3"
            />
            {!formData.endDate && (
              <span
                className="position-absolute text-secondary"
                style={{
                  top: "50%",
                  left: "120px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                End Date
              </span>
            )}
          </div>
        </div>

        <div className="row mb-3 ">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="sourceLeadName"
              placeholder="Sourcing Lead Name"
              className="form-control p-3"
              value={formData.sourceLeadName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="sourceDirectorName"
              placeholder="Sourcing Director Name"
              className="form-control p-3"
              value={formData.sourceDirectorName}
              onChange={handleChange}
            />
          </div>
          {/* <div className="col-md-4 mb-3">
            <input
              type="text"
              name="businessStackHolder"
              placeholder="Business Stakeholder Name"
              className="form-control p-3"
              value={formData.businessStackHolder}
              onChange={handleChange}
            />
          </div> */}
        </div>
        <div className="row mb-3 ">
          <div className="col-md-4 mb-3">
            {suppliers && suppliers.length > 0 ? (
              <select
                name="supplierName"
                className="form-select p-3"
                style={{
                  fontSize: "16px",
                  fontFamily: "inherit",
                  color: "gray",
                }}
                value={formData.supplierName}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            ) : "Not Available"}
          </div>
        </div>




        {/* Financial Details & Spend Analytics */}
        <h5
          style={{
            borderBottom: "1px solid black",
            textAlign: "start",
            marginBottom: "15px",
          }}>
          Financial & Spend Details
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="number"
              name="contractValue"
              placeholder="Contract Value *"
              className="form-control p-3"
              value={formData.contractValue}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              name="annualSpend"
              placeholder="Annual Spend *"
              className="form-control p-3"
              value={formData.annualSpend}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <select
              name="spendCategory"
              className="form-select p-3"
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
        </div>

        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="budget"
              placeholder="Budget *"
              className="form-control p-3"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <select
              name="currency"
              className="form-select p-3"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD - United States Dollar</option>
              {/* ... other options same as before ... */}
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              name="paymentTerms"
              className="form-select p-3"
              value={formData.paymentTerms}
              onChange={handleChange}
            >
              <option value="">Payment Term *</option>
              <option value="net_30">Net 30</option>
              <option value="net_60">Net 60</option>
              <option value="due_on_receipt">Due on Receipt</option>
            </select>
          </div>
        </div>

        {/* Renewal Notification */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="renewalReminder"
            name="renewalReminder"
            checked={formData.renewalReminder}
            onChange={(e) => setFormData({ ...formData, renewalReminder: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="renewalReminder">Enable Renewal Notification</label>
        </div>

        {/* ... Milestones Section Remains Same ... */}

        {/* Attachments Hierarchy */}
        <h5
          style={{
            borderBottom: "1px solid black",
            textAlign: "start",
            marginBottom: "15px",
            marginTop: "30px"
          }}>
          Contract Documents Hierarchy
        </h5>

        {/* Main Contract */}
        <div className="mb-3">
          <label className="form-label fw-bold">1. Main Contract *</label>
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => document.getElementById("contractAttachmentFile").click()}
            >
              <i className="fa-solid fa-upload pe-2"></i> Upload Main Contract
            </button>
            {formData.contractAttachmentFile && (
              <span className="text-success">{formData.contractAttachmentFile.name}</span>
            )}
          </div>
          <input
            id="contractAttachmentFile"
            type="file"
            name="contractAttachmentFile"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* SOWs */}
        <div className="mb-3 ms-4">
          <label className="form-label fw-bold">2. Statement of Work (SOW)</label>
          <div className="d-flex align-items-center gap-3 mb-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => document.getElementById("sowFiles").click()}
            >
              <i className="fa-solid fa-plus pe-2"></i> Add SOW
            </button>
          </div>
          <input
            id="sowFiles"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setFormData(prev => ({ ...prev, sowFiles: [...prev.sowFiles, ...files] }));
            }}
          />
          {formData.sowFiles.map((file, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between border p-2 mb-1 bg-light" style={{ maxWidth: '400px' }}>
              <small>{file.name}</small>
              <button type="button" className="btn-close btn-sm" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  sowFiles: prev.sowFiles.filter((_, i) => i !== idx)
                }));
              }}></button>
            </div>
          ))}
        </div>

        {/* Amendments */}
        <div className="mb-3 ms-4">
          <label className="form-label fw-bold">3. Amendments</label>
          <div className="d-flex align-items-center gap-3 mb-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => document.getElementById("amendmentFiles").click()}
            >
              <i className="fa-solid fa-plus pe-2"></i> Add Amendment
            </button>
          </div>
          <input
            id="amendmentFiles"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setFormData(prev => ({ ...prev, amendmentFiles: [...prev.amendmentFiles, ...files] }));
            }}
          />
          {formData.amendmentFiles.map((file, idx) => (
            <div key={idx} className="d-flex align-items-center justify-content-between border p-2 mb-1 bg-light" style={{ maxWidth: '400px' }}>
              <small>{file.name}</small>
              <button type="button" className="btn-close btn-sm" onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  amendmentFiles: prev.amendmentFiles.filter((_, i) => i !== idx)
                }));
              }}></button>
            </div>
          ))}
        </div>

        <div className="col-md-4 mb-3">
          <select
            name="agreementId"
            className="form-select p-3"
            style={{
              fontSize: "16px",
              fontFamily: "inherit",
              color: "gray",
            }}
            onChange={handleChange}
            value={formData.agreementId}

          >
            <option value="">Select Contract Template</option>
            {contracts && contracts.length > 0 ? (
              contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.aggrementName || "Not Available"}
                </option>
              ))
            ) : (
              <option>No contracts available</option>
            )}
          </select>
        </div>

        {/* Approval Workflow */}
        <h5
          style={{
            borderBottom: "1px solid black",
            textAlign: "start",
            marginBottom: "15px",
          }}>
          Approval Workflow
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="approvers"
              className="form-control p-3"
              style={{
                fontSize: "16px",
                fontFamily: "inherit",
                color: "gray",
              }}
              value={formData.approvers}
              onChange={handleChange}
              placeholder="Contract Approver"
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="approvalLevels"
              className="form-control p-3"
              style={{
                fontSize: "16px",
                fontFamily: "inherit",
                color: "gray",
              }}
              value={formData.approvalLevels}
              onChange={handleChange}
              placeholder="Contract Approval Levels"
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="thresholdRules"
              placeholder="Threshold Rules"
              className="form-control p-3"
              value={formData.thresholdRules}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-center">
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
              backgroundColor: "#578E7E",
              color: "white",
              padding: "10px",
              width: "150px",
            }}>
            Save
          </button>
        </div>
      </form >
    </div >
  );
};

export default AddNewContract;
