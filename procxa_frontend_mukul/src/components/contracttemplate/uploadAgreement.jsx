import React, { useRef, useState } from "react";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

function UploadAgreement() {
  const { post } = useApi();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    aggrementName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (ALLOWED_FILE_TYPES.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert("Invalid file type. Only PDF and DOC files are allowed.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.aggrementName) {
      alert("Please provide an agreement name.");
      return;
    }

    if (!selectedFile) {
      alert("Please upload an agreement file.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("aggrementName", formData.aggrementName);
    submissionData.append("customAgreementFile", selectedFile);

    try {
      const response = await post(endpoints.addContractTemplate, submissionData);
      setMessage({ type: "success", text: response.message || "Agreement uploaded successfully!" });

      setFormData({
        aggrementName: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Navigate back after successful upload after a short delay
      setTimeout(() => {
        navigate("/contracttemplate");
      }, 1500);

    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", text: error.message || "Failed to upload agreement." });
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {message.text && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`}>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
        </div>
      )}

      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="fw-bold mb-1" style={{ fontSize: "clamp(1.5rem, 4vw, 2.1875rem)" }}>
            Add Custom Agreement
          </h1>
          <p style={{ fontSize: "clamp(0.875rem, 2vw, 0.9375rem)", color: "#6c757d" }}>
            Upload your agreement file to create a new template.
          </p>
        </div>
        <button
          className="btn"
          style={{
            backgroundColor: "#578E7E",
            color: "white",
            border: "none",
            minWidth: "120px",
          }}
          onClick={() => navigate(-1)}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Back
        </button>
      </div>

      {/* Simple Form Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Agreement Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="aggrementName"
                value={formData.aggrementName}
                onChange={handleInputChange}
                className="form-control form-control-lg"
                placeholder="Enter agreement name (e.g., Marketing Service Agreement)"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Upload Agreement File <span className="text-danger">*</span></label>
              <div
                className="border rounded p-4 text-center bg-light"
                style={{ borderStyle: "dashed !important", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fa-solid fa-cloud-upload-alt fa-3x mb-3 text-secondary"></i>
                <p className="mb-1">Click to browse or drag and drop your file</p>
                <p className="text-muted small">Supports PDF, DOC, DOCX</p>
                {selectedFile && (
                  <div className="mt-3 p-2 bg-white border rounded d-inline-flex align-items-center">
                    <i className="fa-solid fa-file-pdf me-2 text-danger"></i>
                    <span className="fw-bold">{selectedFile.name}</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="d-none"
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-5 py-2"
                onClick={() => navigate(-1)}
                style={{ minWidth: "150px" }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn px-5 py-2 text-white"
                style={{ backgroundColor: "#578E7E", minWidth: "150px" }}
              >
                <i className="fa-solid fa-upload me-2"></i> Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadAgreement;
