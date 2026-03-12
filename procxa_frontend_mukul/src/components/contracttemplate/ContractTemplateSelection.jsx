import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

function ContractTemplateSelection() {
  const { get, del } = useApi();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const fetchContractsTemplate = async () => {
    try {
      const response = await get(`${endpoints.getAllContractTemplates}`);
      setContracts(response.templates);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    fetchContractsTemplate();
  }, []);
  const handleNext = () => {
    navigate("/costumeagent");
  };

  const handleViewContract = (e, contract) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedContract(contract);
    setShowModal(true);
  };

  const handleDownloadPdf = (pdfUrl) => {
    if (!pdfUrl) {
      console.error("PDF URL is not available.");
      alert("File URL is not available.");
      return;
    }

    // Construct proper download URL
    let downloadUrl = pdfUrl;
    if (!pdfUrl.startsWith('http') && !pdfUrl.startsWith('data:')) {
      const normalizedPath = pdfUrl.replace(/\\/g, '/');
      const baseUrl = import.meta.env.VITE_APP_API_BASE_URL || "";
      downloadUrl = `${baseUrl}/${normalizedPath}`;
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = pdfUrl.split(/[\\/]/).pop() || "document";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contract template?")) return;
    try {
      const res = await del(`${endpoints.contractTemplateDelete}/${id}`);
      if (res.status || res.success) {
        alert(res.message || "Contract template deleted successfully");
        fetchContractsTemplate();
      } else {
        alert(res.message || "Failed to delete contract template");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Something went wrong while deleting");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="flex-fill">
          <h3 className="fw-bold mb-1" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)", wordWrap: "break-word" }}>Contract Template Selection</h3>
          <p style={{ color: "#6c757d", fontSize: "clamp(0.875rem, 2vw, 1rem)", wordWrap: "break-word" }}>Choose a template for your agreement.</p>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <Link to="/uploadAgreement" className="text-decoration-none w-100 w-md-auto">
            <button
              className="btn btn-success w-100"
              style={{ backgroundColor: "#578E7E", color: "white", border: "none", fontSize: "clamp(0.875rem, 2vw, 1rem)", whiteSpace: "normal" }}
            >
              <i className="fa-solid fa-file-upload me-2"></i> Upload Custom Agreement
            </button>
          </Link>
          <Link to="/costumeagent" className="text-decoration-none w-100 w-md-auto">
            <button
              className="btn btn-primary w-100"
              style={{ backgroundColor: "#578E7E", color: "white", border: "none", fontSize: "clamp(0.875rem, 2vw, 1rem)", whiteSpace: "normal" }}
            >
              <i className="fa-solid fa-folder-open me-2"></i>  Path Selection
            </button>
          </Link>
        </div>
      </div>

      {/* Cards Section */}
      <div className="row g-3 g-md-4 justify-content-center">
        {contracts && contracts.length > 0 ? (
          contracts
            .filter(contract => contract.aggrementName)
            .map((contract) => (
              <div key={contract.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                <div
                  className="border p-2 p-md-3 text-center shadow-sm"
                  style={{
                    width: "100%",
                    minHeight: "200px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    wordWrap: "break-word",
                    overflow: "hidden"
                  }}
                >
                  <i className="fa-solid fa-file fs-1 mb-3 text-secondary" style={{ fontSize: "clamp(2rem, 8vw, 3.75rem)" }}></i>
                  <h5 className="mb-3" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)", wordWrap: "break-word", overflowWrap: "break-word" }}>{contract.aggrementName}</h5>

                  <div className="d-flex justify-content-center gap-2 mt-auto">
                    <button
                      className="btn btn-sm flex-fill d-flex align-items-center justify-content-center py-2"
                      style={{ backgroundColor: "#0D99FF", color: "white", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                      onClick={(e) => handleViewContract(e, contract)}
                      title="View"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>

                    <button
                      className="btn btn-sm flex-fill d-flex align-items-center justify-content-center py-2"
                      style={{ backgroundColor: "#FF5733", color: "white", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownloadPdf(contract.customAgreementFile);
                      }}
                      title="Download"
                    >
                      <i className="fa-solid fa-download"></i>
                    </button>

                    <button
                      className="btn btn-sm flex-fill d-flex align-items-center justify-content-center py-2"
                      style={{ backgroundColor: "#dc3545", color: "white", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(contract.id);
                      }}
                      title="Delete"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No contract templates available. Upload a custom agreement to get started.</p>
          </div>
        )}
      </div>
      {/* Footer Section */}
      <div className="d-flex justify-content-center mt-4">
        <button className="btn px-4 px-md-5 py-2" style={{ backgroundColor: "#578E7E", color: "white", border: "none", fontSize: "clamp(0.875rem, 2vw, 1rem)", width: "100%", maxWidth: "200px" }} onClick={handleNext}>
          Next
        </button>
      </div>

      {showModal && selectedContract && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050, position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-lg-down" style={{ height: "90vh", margin: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content h-100" style={{ borderRadius: "12px", overflow: "hidden", border: "none" }}>
              <div className="modal-header bg-light border-bottom-0 py-3">
                <h5 className="modal-title fw-bold text-dark text-truncate" style={{ maxWidth: "80%" }}>
                  {selectedContract.aggrementName || "Document Preview"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0 d-flex flex-column">
                {selectedContract.customAgreementFile ? (
                  <div className="flex-grow-1 w-100 h-100" style={{ position: "relative" }}>
                    <iframe
                      src={selectedContract.customAgreementFile.startsWith('http') || selectedContract.customAgreementFile.startsWith('data:')
                        ? selectedContract.customAgreementFile
                        : `${import.meta.env.VITE_APP_API_BASE_URL || ""}/${selectedContract.customAgreementFile.replace(/\\/g, '/')}`}
                      title="Contract Preview"
                      style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      onError={(e) => {
                        console.error("Preview error:", e);
                      }}
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-5 text-center flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="alert alert-info">
                      <i className="fa-solid fa-info-circle me-2"></i>
                      No document preview available for this template.
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer border-top py-2 d-flex flex-wrap justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary px-4 flex-grow-1 flex-md-grow-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                >
                  Close
                </button>
                {selectedContract.customAgreementFile && (
                  <button
                    type="button"
                    className="btn btn-primary px-4 flex-grow-1 flex-md-grow-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPdf(selectedContract.customAgreementFile);
                    }}
                  >
                    <i className="fa-solid fa-download me-2"></i>Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractTemplateSelection;

