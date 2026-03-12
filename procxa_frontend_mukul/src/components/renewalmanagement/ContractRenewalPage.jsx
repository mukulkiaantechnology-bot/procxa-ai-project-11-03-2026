import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';

const ContractRenewalPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post } = useApi();

    // Get contract from navigation state (if coming from contract list)
    const preselectedContract = location.state?.contract;

    const [step, setStep] = useState(1); // 1: Select Contract, 2: Select Template, 3: Edit Fields, 4: Preview
    const [contracts, setContracts] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [selectedContract, setSelectedContract] = useState(preselectedContract || null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewContent, setPreviewContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dynamic form data
    const [formData, setFormData] = useState({
        SupplierName: '',
        CompanyName: 'Kian Developers',
        StartDate: '',
        EndDate: '',
        ContractDuration: '12 months',
        Budget: '',
        Currency: 'USD',
        ContractName: '',
        Department: '',
    });

    // Fetch contracts expiring soon
    useEffect(() => {
        fetchExpiringContracts();
        fetchTemplates();
        fetchSuppliers();
    }, []);

    // Pre-fill form if contract is preselected
    useEffect(() => {
        if (selectedContract) {
            setFormData({
                SupplierName: selectedContract.supplier?.name || selectedContract.supplierName || '',
                CompanyName: 'Kian Developers',
                StartDate: new Date().toISOString().split('T')[0],
                EndDate: '',
                ContractDuration: '12 months',
                Budget: selectedContract.budget || '',
                Currency: selectedContract.currency || 'USD',
                ContractName: selectedContract.contractName || '',
                Department: selectedContract.department?.name || selectedContract.department || '',
            });
            if (preselectedContract) {
                setStep(2); // Skip to template selection
            }
        }
    }, [selectedContract]);

    const fetchExpiringContracts = async () => {
        try {
            const response = await get(`${endpoints.getContractsExpiringSoon}?days=90`);
            if (response?.success) {
                setContracts(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await get(endpoints.getAllContractTemplates);
            if (response?.templates) {
                setTemplates(response.templates);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await get(endpoints.getSuppliers);
            if (response?.data) {
                setSuppliers(response.data);
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreview = async () => {
        if (!selectedTemplate) {
            setError('Please select a template');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await post(`${endpoints.previewRenewedContract}/${selectedTemplate.id}`, {
                formData
            });

            if (response?.success) {
                setPreviewContent(response.content);
                setStep(4);
            } else {
                setError(response?.message || 'Failed to generate preview');
            }
        } catch (error) {
            setError('Error generating preview');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRenewal = async () => {
        if (!selectedContract || !selectedTemplate) {
            setError('Please select both contract and template');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await post(
                `${endpoints.renewContractFromTemplate}/${selectedContract.id}/${selectedTemplate.id}`,
                {
                    supplierName: formData.SupplierName,
                    companyName: formData.CompanyName,
                    startDate: formData.StartDate,
                    endDate: formData.EndDate,
                    contractDuration: formData.ContractDuration,
                    budget: formData.Budget,
                    additionalFields: formData
                }
            );

            if (response?.success) {
                setSuccess('Contract renewed successfully!');
                setTimeout(() => {
                    navigate('/contractmanage');
                }, 2000);
            } else {
                setError(response?.message || 'Failed to renew contract');
            }
        } catch (error) {
            setError('Error renewing contract');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
                {['Select Contract', 'Choose Template', 'Edit Details', 'Preview & Submit'].map((label, index) => (
                    <div key={index} className="d-flex flex-column align-items-center flex-fill">
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${step > index + 1 ? 'bg-success' : step === index + 1 ? 'bg-primary' : 'bg-secondary'
                                }`}
                            style={{ width: '40px', height: '40px', color: 'white', fontWeight: 'bold' }}
                        >
                            {step > index + 1 ? '✓' : index + 1}
                        </div>
                        <small className="mt-2 text-center" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)' }}>
                            {label}
                        </small>
                    </div>
                ))}
            </div>
            <div className="progress mt-3" style={{ height: '4px' }}>
                <div
                    className="progress-bar bg-primary"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="card">
            <div className="card-header bg-light">
                <h5 className="mb-0">Select Contract for Renewal</h5>
            </div>
            <div className="card-body">
                {contracts.length === 0 ? (
                    <div className="alert alert-info">
                        <i className="fa-solid fa-info-circle me-2"></i>
                        No contracts expiring soon. You can still create a renewal manually.
                    </div>
                ) : (
                    <div className="row g-3">
                        {contracts.map((contract) => (
                            <div key={contract.id} className="col-12 col-md-6 col-lg-4">
                                <div
                                    className={`card h-100 ${selectedContract?.id === contract.id ? 'border-primary' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSelectedContract(contract)}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title mb-0">{contract.contractName}</h6>
                                            <span
                                                className={`badge ${contract.urgencyLevel === 'critical'
                                                        ? 'bg-danger'
                                                        : contract.urgencyLevel === 'high'
                                                            ? 'bg-warning'
                                                            : 'bg-info'
                                                    }`}
                                            >
                                                {contract.daysUntilExpiry} days
                                            </span>
                                        </div>
                                        <p className="text-muted mb-1">
                                            <small>
                                                <strong>Supplier:</strong> {contract.supplier?.name || 'N/A'}
                                            </small>
                                        </p>
                                        <p className="text-muted mb-1">
                                            <small>
                                                <strong>Department:</strong> {contract.department?.name || 'N/A'}
                                            </small>
                                        </p>
                                        <p className="text-muted mb-0">
                                            <small>
                                                <strong>Expires:</strong> {new Date(contract.endDate).toLocaleDateString()}
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(2)}
                        disabled={!selectedContract}
                    >
                        Next: Choose Template
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="card">
            <div className="card-header bg-light">
                <h5 className="mb-0">Choose Contract Template</h5>
            </div>
            <div className="card-body">
                {templates.length === 0 ? (
                    <div className="alert alert-warning">
                        <i className="fa-solid fa-exclamation-triangle me-2"></i>
                        No templates available. Please create a template first.
                    </div>
                ) : (
                    <div className="row g-3">
                        {templates.filter(t => t.aggrementName).map((template) => (
                            <div key={template.id} className="col-12 col-md-6 col-lg-4">
                                <div
                                    className={`card h-100 ${selectedTemplate?.id === template.id ? 'border-primary' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    <div className="card-body text-center">
                                        <i className="fa-solid fa-file-contract fs-1 mb-3 text-primary"></i>
                                        <h6 className="card-title">{template.aggrementName}</h6>
                                        <small className="text-muted">
                                            Created: {new Date(template.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="d-flex justify-content-between gap-2 mt-4">
                    <button className="btn btn-secondary" onClick={() => setStep(1)}>
                        Back
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(3)}
                        disabled={!selectedTemplate}
                    >
                        Next: Edit Details
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="card">
            <div className="card-header bg-light">
                <h5 className="mb-0">Edit Contract Details</h5>
                <small className="text-muted">Update the fields below to customize your renewed contract</small>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    {/* Supplier Name */}
                    <div className="col-md-6">
                        <label className="form-label">Supplier Name *</label>
                        <select
                            className="form-select"
                            name="SupplierName"
                            value={formData.SupplierName}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Company Name */}
                    <div className="col-md-6">
                        <label className="form-label">Company Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="CompanyName"
                            value={formData.CompanyName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div className="col-md-6">
                        <label className="form-label">Start Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="StartDate"
                            value={formData.StartDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div className="col-md-6">
                        <label className="form-label">End Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            name="EndDate"
                            value={formData.EndDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Contract Duration */}
                    <div className="col-md-6">
                        <label className="form-label">Contract Duration</label>
                        <input
                            type="text"
                            className="form-control"
                            name="ContractDuration"
                            value={formData.ContractDuration}
                            onChange={handleInputChange}
                            placeholder="e.g., 12 months, 1 year"
                        />
                    </div>

                    {/* Budget */}
                    <div className="col-md-6">
                        <label className="form-label">Budget</label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                name="Currency"
                                value={formData.Currency}
                                onChange={handleInputChange}
                                style={{ maxWidth: '100px' }}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                            </select>
                            <input
                                type="number"
                                className="form-control"
                                name="Budget"
                                value={formData.Budget}
                                onChange={handleInputChange}
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>

                    {/* Contract Name */}
                    <div className="col-md-6">
                        <label className="form-label">Contract Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="ContractName"
                            value={formData.ContractName}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Department */}
                    <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Department"
                            value={formData.Department}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-between gap-2 mt-4">
                    <button className="btn btn-secondary" onClick={() => setStep(2)}>
                        Back
                    </button>
                    <button className="btn btn-primary" onClick={handlePreview} disabled={loading}>
                        {loading ? 'Generating Preview...' : 'Preview Contract'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="card">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0">Preview Renewed Contract</h5>
                    <small className="text-muted">Review the contract before submitting</small>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setStep(3)}>
                    <i className="fa-solid fa-edit me-1"></i> Edit
                </button>
            </div>
            <div className="card-body">
                <div
                    className="border rounded p-4 mb-4"
                    style={{
                        maxHeight: '500px',
                        overflowY: 'auto',
                        backgroundColor: '#f8f9fa'
                    }}
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                />

                <div className="d-flex justify-content-between gap-2">
                    <button className="btn btn-secondary" onClick={() => setStep(3)}>
                        Back to Edit
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleSubmitRenewal}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-check me-2"></i>
                                Submit Renewal
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container my-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1 fw-bold">Contract Renewal Automation</h3>
                    <p className="text-muted mb-0">Renew contracts quickly using predefined templates</p>
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
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError('')}
                    ></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    <i className="fa-solid fa-check-circle me-2"></i>
                    {success}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess('')}
                    ></button>
                </div>
            )}

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step Content */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </div>
    );
};

export default ContractRenewalPage;
