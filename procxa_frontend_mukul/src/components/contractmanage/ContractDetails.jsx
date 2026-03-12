import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ContractDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (location.state && location.state.contract) {
      setContract(location.state.contract);
    } else {
      // Redirect or show error if no contract state
      // For now, just stay here with null
    }
  }, [location]);

  if (!contract) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          No contract details found. Please select a contract from the dashboard.
          <br />
          <Link to="/contractmanage" className="btn btn-primary mt-3">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="contract-details-container container mt-4">
        <div className="contact mb-4">
          <header className="header d-flex justify-content-between align-items-center">
            <div>
              <h1 className="title mb-0">Contract Details</h1>
              <strong className="text-secondary">#{contract.contractId || contract.id || 'N/A'}</strong>
            </div>
            <button
              className="btn btn-success text-white d-flex align-items-center"
              onClick={() => navigate(-1)}
              style={{
                height: '49px',
                border: 'none',
                backgroundColor: '#578E7E',
                borderRadius: '10px',
                padding: '0 20px'
              }}
            >
              <i className="fa-solid fa-arrow-left me-2"></i>  Back
            </button>
          </header>
        </div>

        <div className="row">
          <div className="col-md-8">
            <section className="contract-info1 card shadow-sm p-4 mb-4">
              <h4 className="section-title border-bottom pb-2 mb-3">Contract Information</h4>

              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <strong>Supplier Name:</strong> <br /> {contract.supplier?.name || contract.supplierName || 'N/A'}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Department:</strong> <br /> {contract.department?.name || contract.department || 'N/A'}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Type:</strong> <br /> {contract.contractTypeId || contract.type || 'N/A'}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Status:</strong> <br />
                  <span className={`badge ${contract.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                    {contract.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="info-item mb-3">
                <strong>Description:</strong>
                <p className="text-muted mt-1">
                  {contract.description || 'No description available.'}
                </p>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <strong>Start Date:</strong> <br /> {formatDate(contract.startDate)}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>End Date:</strong> <br /> {formatDate(contract.endDate)}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <strong>Contract Value:</strong> <br /> {contract.contractValue ? `$${Number(contract.contractValue).toLocaleString()}` : 'N/A'}
                </div>
                <div className="col-md-4 mb-2">
                  <strong>Annual Spend:</strong> <br /> {contract.annualSpend ? `$${Number(contract.annualSpend).toLocaleString()}` : 'N/A'}
                </div>
                <div className="col-md-4 mb-2">
                  <strong>Spend Category:</strong> <br /> {contract.spendCategory || 'N/A'}
                </div>
              </div>
              <div className="mb-3">
                <strong>Renewal Notification:</strong> {contract.renewalReminder ? <span className="text-success"><i className="fa-solid fa-check-circle"></i> Enabled</span> : <span className="text-muted">Disabled</span>}
              </div>

            </section>
          </div>

          <div className="col-md-4">
            <section className="hierarchy-view card shadow-sm p-4 mb-4">
              <h4 className="section-title border-bottom pb-2 mb-3">Document Hierarchy</h4>

              <div className="hierarchy-tree">
                {/* Main Contract */}
                <div className="node-item mb-3">
                  <div className="d-flex align-items-center fw-bold text-primary">
                    <i className="fa-solid fa-file-contract me-2"></i>
                    Main Contract
                  </div>
                  <div className="ms-4 mt-1">
                    <small>{contract.contractType?.customAgreementFile ? (
                      <a href={`${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType.customAgreementFile}`} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    ) : 'No Main Document'}</small>
                  </div>
                </div>

                {/* SOWs */}
                <div className="node-item mb-3">
                  <div className="d-flex align-items-center fw-semibold text-dark">
                    <i className="fa-solid fa-folder-tree me-2"></i>
                    Statements of Work (SOW)
                  </div>
                  <div className="ms-4 mt-1">
                    {contract.sowFiles && contract.sowFiles.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {contract.sowFiles.map((file, idx) => (
                          <li key={idx} className="mb-1">
                            <small>
                              <i className="fa-regular fa-file-pdf me-1 text-danger"></i>
                              {file.name || `SOW Document ${idx + 1}`}
                              {/* If file is URL, add link here */}
                            </small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <small className="text-muted">No SOWs attached</small>
                    )}
                  </div>
                </div>

                {/* Amendments */}
                <div className="node-item">
                  <div className="d-flex align-items-center fw-semibold text-dark">
                    <i className="fa-solid fa-pen-nib me-2"></i>
                    Amendments
                  </div>
                  <div className="ms-4 mt-1">
                    {contract.amendmentFiles && contract.amendmentFiles.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {contract.amendmentFiles.map((file, idx) => (
                          <li key={idx} className="mb-1">
                            <small>
                              <i className="fa-regular fa-file-lines me-1 text-info"></i>
                              {file.name || `Amendment ${idx + 1}`}
                            </small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <small className="text-muted">No Amendments attached</small>
                    )}
                  </div>
                </div>

              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractDetails;