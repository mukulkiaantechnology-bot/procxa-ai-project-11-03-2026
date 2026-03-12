import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';

const LicenseManagement = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { get } = useApi();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, departmentsRes] = await Promise.all([
                    get(endpoints.getLicenseAnalytics || '/license/analytics'),
                    get(endpoints.getAllDepartments)
                ]);

                if (analyticsRes.status) {
                    setAnalytics(analyticsRes.data);
                }
                if (departmentsRes.status) {
                    setDepartments(departmentsRes.data);
                }
            } catch (error) {
                console.error("Error fetching license data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to get real department name
    const getDepartmentName = (analyticsDept) => {
        if (!analyticsDept) return "Unknown";
        // Try to find by ID first (if available from backend update)
        if (analyticsDept.departmentId) {
            const match = departments.find(d => d.id === analyticsDept.departmentId);
            if (match) return match.name;
        }
        // Fallback to name matching
        const matchByName = departments.find(d => d.name === analyticsDept.departmentName);
        if (matchByName) return matchByName.name;

        return analyticsDept.departmentName || "Unknown";
    };

    if (loading) return <div className="container mt-4"><h3>Loading Analytics...</h3></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Procurement License Analytics</h3>
            </div>

            {/* Summary Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card text-white h-100 shadow-sm border-0" style={{ backgroundColor: "#578e7e", borderRadius: "15px" }}>
                        <div className="card-body d-flex align-items-center p-4">
                            <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                <i className="fa-solid fa-id-card fa-2x"></i>
                            </div>
                            <div>
                                <h2 className="mb-0 fw-bold">{analytics?.total || 0}</h2>
                                <p className="mb-0 text-white-50">Total Licenses</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white h-100 shadow-sm border-0" style={{ backgroundColor: "#3276e8", borderRadius: "15px" }}>
                        <div className="card-body d-flex align-items-center p-4">
                            <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                <i className="fa-solid fa-check-double fa-2x"></i>
                            </div>
                            <div>
                                <h2 className="mb-0 fw-bold">{analytics?.used || 0}</h2>
                                <p className="mb-0 text-white-50">Used Licenses</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white h-100 shadow-sm border-0" style={{ backgroundColor: "#ff9318", borderRadius: "15px" }}>
                        <div className="card-body d-flex align-items-center p-4">
                            <div className="rounded-circle p-3 me-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                                <i className="fa-solid fa-key fa-2x"></i>
                            </div>
                            <div>
                                <h2 className="mb-0 fw-bold">{analytics?.unused || 0}</h2>
                                <p className="mb-0 text-white-50">Unused Licenses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department-wise Visibility */}
            <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
                <div className="card-header bg-white py-3 border-bottom">
                    <h5 className="mb-0 fw-bold text-dark">System Usage by Department</h5>
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
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics?.departmentWise?.map((dept, index) => {
                                    const utilization = dept.total > 0 ? (dept.used / dept.total) * 100 : 0;
                                    return (
                                        <tr key={index}>
                                            <td className="fw-semibold">Procurement License</td>
                                            <td className="fw-semibold">{getDepartmentName(dept)}</td>
                                            <td className="text-center">{dept.total}</td>
                                            <td className="text-center text-success fw-bold">{dept.used}</td>
                                            <td className="text-center text-secondary fw-bold">{dept.unused}</td>
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
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => navigate('/client-license-management')}
                                                    title="Manage Licenses"
                                                >
                                                    <i className="fa-solid fa-cog"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(!analytics?.departmentWise || analytics.departmentWise.length === 0) && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">No department data available</td>
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

export default LicenseManagement;
