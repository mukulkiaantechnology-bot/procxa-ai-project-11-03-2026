import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DocumentPriview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get document details from navigation state or props
  const documentUrl = location.state?.documentUrl || location.state?.customAgreementFile || "";
  const documentName = location.state?.documentName || location.state?.aggrementName || "Document";
  const documentType = location.state?.documentType || "application/pdf";

  useEffect(() => {
    if (!documentUrl) {
      setError("No document to preview");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [documentUrl]);

  const handleDownload = () => {
    const downloadUrl = documentUrl.startsWith('http')
      ? documentUrl
      : `${import.meta.env.VITE_APP_API_BASE_URL || ''}/${documentUrl.replace(/\\/g, '/')}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = documentName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPreview = () => {
    if (error) {
      return (
        <div className="alert alert-warning">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      );
    }

    // Determine the correct source for iframe
    let iframeSrc = documentUrl;
    if (!documentUrl.startsWith('http') && !documentUrl.startsWith('data:')) {
      // If it's a relative path, prepend the base URL and normalize slashes
      iframeSrc = `${import.meta.env.VITE_APP_API_BASE_URL || ''}/${documentUrl.replace(/\\/g, '/')}`;
    }

    if (documentType === 'application/pdf' || documentName.endsWith('.pdf') || documentUrl.includes('.pdf')) {
      return (
        <iframe
          src={iframeSrc}
          title="Document Preview"
          width="100%"
          height="700px"
          style={{ border: "1px solid #ddd" }}
          onLoad={() => setLoading(false)}
          onError={(e) => {
            console.error("Failed to load document:", e);
            setError("Failed to load document preview. The file may not be accessible.");
            setLoading(false);
          }}
        />
      );
    }

    // For non-PDF documents, show download option
    return (
      <div className="text-center p-5">
        <i className="fa-solid fa-file fa-4x text-secondary mb-3"></i>
        <p>Preview not available for this file type.</p>
        <button className="btn btn-primary" onClick={handleDownload}>
          <i className="fa-solid fa-download me-2"></i>
          Download Document
        </button>
      </div>
    );
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Document Preview</h3>
          <p className="text-muted">{documentName}</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back
          </button>
          {documentUrl && (
            <button
              className="btn btn-primary"
              onClick={handleDownload}
            >
              <i className="fa-solid fa-download me-2"></i>
              Download
            </button>
          )}
        </div>
      </div>

      <div
        className="border p-3 shadow-sm"
        style={{ minHeight: "700px", position: "relative" }}
      >
        {loading && (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading document...</p>
          </div>
        )}
        {renderPreview()}
      </div>
    </div>
  );
}

export default DocumentPriview;
