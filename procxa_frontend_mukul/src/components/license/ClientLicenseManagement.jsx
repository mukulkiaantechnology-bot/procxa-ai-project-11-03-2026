import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';

const ClientLicenseManagement = () => {
    const [licenses, setLicenses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [formData, setFormData] = useState({
        license_name: '',
        department_id: '',
        total_licenses: 0,
        expiry_date: ''
    });
    const [assignData, setAssignData] = useState({
        user_name: '',
        user_id: ''
    });

    const { get, post } = useApi();

    useEffect(() => {
        fetchLicenses();
        fetchDepartments();
    }, []);

    const fetchLicenses = async () => {
        try {
            const response = await get(endpoints.getAllClientLicenses);
            if (response.status) setLicenses(response.data);
        } catch (error) {
            console.error("Error fetching client licenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await get(endpoints.getAllDepartments);
            if (response.status) setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const handleAddLicense = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                total_licenses: parseInt(formData.total_licenses) || 0,
                department_id: formData.department_id ? parseInt(formData.department_id) : null
            };
            const response = await post(endpoints.createClientLicense, payload);
            if (response.status) {
                setShowAddModal(false);
                fetchLicenses();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleAssignLicense = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                client_license_id: selectedLicense.id,
                user_name: assignData.user_name,
                user_id: assignData.user_id || null
            };
            const response = await post(endpoints.assignLicense, payload);
            if (response.status) {
                setShowAssignModal(false);
                fetchLicenses();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // Helper to get real department name
    const getDepartmentName = (license) => {
        if (!license) return "Unassigned";
        // 1. Try to find by ID in our fresh departments list
        if (license.department_id || license.departmentId) {
            const idToFind = license.department_id || license.departmentId;
            const match = departments.find(d => d.id === idToFind);
            if (match) return match.name;
        }
        // 2. Fallback to the included department name
        if (license.department?.name) return license.department.name;

        return "Unassigned";
    };

    if (loading) return <div className="container mt-4"><h3>Loading Licenses...</h3></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Third-Party App Licenses</h3>
                <button className="btn btn-primary shadow-sm" onClick={() => setShowAddModal(true)}>
                    <i className="fa-solid fa-plus me-2"></i> New Register
                </button>
            </div>

            <div className="row g-4">
                {licenses.map((license) => (
                    <div className="col-md-6 col-lg-4" key={license.id}>
                        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px" }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="rounded-circle p-3" style={{ backgroundColor: "#f0f4f8", color: "#3276e8" }}>
                                        <i className="fa-solid fa-id-card fa-xl"></i>
                                    </div>
                                    <span className={`badge ${license.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                        {license.status}
                                    </span>
                                </div>
                                <h5 className="fw-bold mb-1">{license.license_name}</h5>
                                <p className="text-muted small mb-3">Department: {getDepartmentName(license)}</p>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Utilization:</span>
                                    <span className="fw-bold">{license.used_licenses} / {license.total_licenses}</span>
                                </div>
                                <div className="progress mb-3" style={{ height: "8px", borderRadius: "4px" }}>
                                    <div
                                        className="progress-bar bg-primary"
                                        style={{ width: `${(license.used_licenses / license.total_licenses) * 100}%` }}
                                    ></div>
                                </div>

                                <div className="mt-4">
                                    <h6 className="fw-bold small mb-2 text-uppercase text-muted">Assigned Users</h6>
                                    <div className="list-group list-group-flush">
                                        {license.assignments?.map(asgn => (
                                            <div key={asgn.id} className="list-group-item px-0 py-2 border-0 d-flex align-items-center">
                                                <i className="fa-solid fa-user-circle me-2 text-muted"></i>
                                                <span className="small">{asgn.user_name || asgn.user?.first_name || 'User'}</span>
                                            </div>
                                        ))}
                                        {(!license.assignments || license.assignments.length === 0) && (
                                            <span className="small text-muted italic">No users assigned</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-outline-primary btn-sm w-100 mt-3"
                                    onClick={() => {
                                        setSelectedLicense(license);
                                        setAssignData({ user_name: '', user_id: '' });
                                        setShowAssignModal(true);
                                    }}
                                    disabled={license.used_licenses >= license.total_licenses}
                                >
                                    Assign User
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add License Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4">
                        <h4>Register Third-Party Tool</h4>
                        <form onSubmit={handleAddLicense}>
                            <div className="mb-3">
                                <label className="form-label">License Name</label>
                                <input type="text" className="form-control" required onChange={e => setFormData({ ...formData, license_name: e.target.value })} placeholder="e.g. Zoom" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Department</label>
                                <select className="form-select" required onChange={e => setFormData({ ...formData, department_id: e.target.value })}>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Total Licenses</label>
                                <input type="number" className="form-control" required onChange={e => setFormData({ ...formData, total_licenses: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Expiry Date</label>
                                <input type="date" className="form-control" onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4">
                        <h4>Assign License: {selectedLicense?.license_name}</h4>
                        <form onSubmit={handleAssignLicense}>
                            <div className="mb-3">
                                <label className="form-label">User Name</label>
                                <input type="text" className="form-control" required onChange={e => setAssignData({ ...assignData, user_name: e.target.value })} />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">Assign</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Report Section */}
            <div className="card shadow-sm border-0 mt-5" style={{ borderRadius: "15px" }}>
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark">License Utilization Report</h5>
                    <button className="btn btn-sm btn-outline-secondary" onClick={fetchLicenses}>
                        <i className="fa-solid fa-sync"></i> Refresh
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light text-muted">
                                <tr>
                                    <th>License Name</th>
                                    <th>Department</th>
                                    <th className="text-center">Total</th>
                                    <th className="text-center">Used</th>
                                    <th className="text-center">Unused</th>
                                    <th className="text-center" style={{ width: "200px" }}>Utilization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {licenses.map((license, index) => {
                                    const utilization = license.total_licenses > 0 ? (license.used_licenses / license.total_licenses) * 100 : 0;
                                    return (
                                        <tr key={index}>
                                            <td className="fw-semibold">{license.license_name}</td>
                                            <td>{getDepartmentName(license)}</td>
                                            <td className="text-center">{license.total_licenses}</td>
                                            <td className="text-center text-success fw-bold">{license.used_licenses}</td>
                                            <td className="text-center text-secondary fw-bold">{license.total_licenses - license.used_licenses}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="progress flex-grow-1" style={{ height: "8px", borderRadius: "4px" }}>
                                                        <div
                                                            className={`progress-bar ${utilization > 80 ? 'bg-danger' : utilization > 50 ? 'bg-primary' : 'bg-success'}`}
                                                            role="progressbar"
                                                            style={{ width: `${utilization}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ms-2 small text-muted">{utilization.toFixed(0)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {licenses.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">No license data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientLicenseManagement;
