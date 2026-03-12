import React, { useRef, useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

function PathSelection() {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [supplierOptions, setSupplierOptions] = useState([]);

  const [formData, setFormData] = useState({
    newSupplier: "",
    existingSupplier: null,
    extendExistingContract: "",
    letterOfExtension: "",
    selectedPath: "", // Track selected path
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await get(endpoints.getSuppliers).catch((err) => {
        console.error("Failed to fetch suppliers:", err);
        return null;
      });

      if (response?.data) {
        const options = response.data.map((supplier) => ({
          label: supplier.name,
          value: supplier.name,
        }));
        setSupplierOptions(options);
      }
    };

    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSupplierChange = (selectedOption, { action }) => {
    if (action === "create-option") {
      setFormData((prev) => ({
        ...prev,
        existingSupplier: selectedOption,
        newSupplier: selectedOption.label,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        existingSupplier: selectedOption,
        newSupplier: "",
      }));
    }
  };

  const handleSubmit = async () => {
    const {
      newSupplier,
      existingSupplier,
      extendExistingContract,
      letterOfExtension,
      selectedPath,
    } = formData;

    // Validate at least one field is filled
    if (!newSupplier && !existingSupplier && !extendExistingContract && !letterOfExtension) {
      alert("Please fill at least one field to continue.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("newSupplier", newSupplier);
    submissionData.append("existingSupplier", existingSupplier ? existingSupplier.value : "");
    submissionData.append("extendExistingContract", extendExistingContract);
    submissionData.append("letterOfExtension", letterOfExtension);
    submissionData.append("contractPath", selectedPath || "new_engagement"); // Include path

    try {
      const response = await post(endpoints.addContractTemplate, submissionData);
      setMessage({ type: "success", text: response.message });

      setFormData({
        newSupplier: "",
        existingSupplier: "",
        extendExistingContract: "",
        letterOfExtension: "",
        customAgreementFile: null,
        aggrementName: "",
        selectedPath: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {message.text && (
        <div className={`alert alert-${message.type === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show`}>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-fill">
          <h1 className="fw-bold mb-1" style={{ fontSize: "clamp(1.5rem, 4vw, 2.1875rem)", wordWrap: "break-word" }}>Path Selection</h1>
          <p style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)", color: "#6c757d", wordWrap: "break-word" }}>
            Define the type of engagement for your contract.
          </p>
        </div>
        <button
          className="btn"
          style={{
            backgroundColor: "#578E7E",
            color: "white",
            border: "none",
            fontSize: "clamp(0.875rem, 2vw, 1rem)",
            minWidth: "120px",
            width: "100%",
            maxWidth: "200px",
            whiteSpace: "normal"
          }}
          onClick={() => navigate(-1)}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Back
        </button>
      </div>

      {/* Path Selection Buttons */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Select Engagement Path</h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${formData.selectedPath === 'new_engagement' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFormData({ ...formData, selectedPath: 'new_engagement' })}
            >
              <i className="fa-solid fa-plus me-2"></i>
              New Engagement
            </button>
            <button
              type="button"
              className={`btn ${formData.selectedPath === 'renewal' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFormData({ ...formData, selectedPath: 'renewal' })}
            >
              <i className="fa-solid fa-rotate me-2"></i>
              Renewal
            </button>
            <button
              type="button"
              className={`btn ${formData.selectedPath === 'sow_amendment' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFormData({ ...formData, selectedPath: 'sow_amendment' })}
            >
              <i className="fa-solid fa-file-pen me-2"></i>
              SOW Amendment
            </button>
            <button
              type="button"
              className={`btn ${formData.selectedPath === 'letter_of_extension' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFormData({ ...formData, selectedPath: 'letter_of_extension' })}
            >
              <i className="fa-solid fa-file-contract me-2"></i>
              Letter of Extension
            </button>
          </div>
          {formData.selectedPath && (
            <div className="alert alert-info mt-3 mb-0">
              <i className="fa-solid fa-info-circle me-2"></i>
              Selected Path: <strong>{formData.selectedPath.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
            </div>
          )}
        </div>
      </div>

      {/* New Engagement */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="fw-bold mb-0" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>New Engagement</h4>
        </div>
        <div className="card-body">
          <p className="mb-3" style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)", color: "#6c757d", wordWrap: "break-word" }}>
            Create a new contract with a new or existing supplier.
          </p>
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-md-4 mb-3">
              <label className="form-label fw-semibold">New Supplier</label>
              <input
                name="newSupplier"
                value={formData.newSupplier}
                onChange={handleInputChange}
                className="form-control"
                placeholder="New Supplier"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-4 mb-3">
              <label className="form-label fw-semibold">Existing Supplier</label>
              <CreatableSelect
                options={supplierOptions}
                onChange={handleSupplierChange}
                value={formData.existingSupplier}
                placeholder="Select or Create Supplier"
                isClearable
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '38px',
                    fontSize: "clamp(0.875rem, 2vw, 1rem)",
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Renewal */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="fw-bold mb-0" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Renewal</h4>
        </div>
        <div className="card-body">
          <p className="mb-3" style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)", color: "#6c757d", wordWrap: "break-word" }}>
            Renew or amend an existing contract with a current supplier.
          </p>
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-md-4 mb-3">
              <label className="form-label fw-semibold">SOW / Amend Existing Contract</label>
              <input
                name="extendExistingContract"
                value={formData.extendExistingContract}
                onChange={handleInputChange}
                className="form-control"
                placeholder="SOW / Amend Existing Contract"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-4 mb-3">
              <label className="form-label fw-semibold">Letter of Extension</label>
              <input
                name="letterOfExtension"
                value={formData.letterOfExtension}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Letter of Extension"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
        <button
          className="btn btn-outline-secondary px-4 py-2"
          style={{ borderRadius: "5px", width: "100%", maxWidth: "200px", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="btn px-4 py-2"
          style={{ borderRadius: "5px", backgroundColor: "#578E7E", color: "white", border: "none", width: "100%", maxWidth: "200px", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
          onClick={handleSubmit}
        >
          <i className="fa-solid fa-upload me-2"></i>Upload
        </button>
      </div>
    </div>
  );
}

export default PathSelection;
