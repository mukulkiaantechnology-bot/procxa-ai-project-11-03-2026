import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';
import { useNavigate } from 'react-router-dom';

const IntelligentInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const { get } = useApi();
    const navigate = useNavigate();

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await get(endpoints.getLicenseInsights || '/license/insights');
            if (response.status) {
                setInsights(response.data);
            }
        } catch (error) {
            console.error("Error fetching intelligent insights:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    if (loading) return <div className="container mt-4"><h3>Generating Insights...</h3></div>;

    return (
        <div className="container mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Intelligent Insights</h3>
                <button
                    className="btn btn-primary btn-sm px-3 py-2 rounded-pill shadow-sm"
                    onClick={fetchInsights}
                >
                    <i className="fa-solid fa-robot me-2"></i> AI-Driven Analysis
                </button>
            </div>

            <div className="row g-4">
                {/* Column 1: Critical Alerts & Compliance */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4 h-100" style={{ borderRadius: "15px" }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold d-flex align-items-center text-danger">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                Critical Alerts
                            </h5>
                        </div>
                        <div className="card-body pt-0">
                            {/* Inventory Alerts */}
                            <h6 className="fw-bold mb-3 small text-muted text-uppercase">Inventory Stock Alerts</h6>
                            {insights?.inventoryAlerts?.length > 0 ? (
                                insights.inventoryAlerts.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-danger-subtle p-3 rounded mb-2 border border-danger-subtle cursor-pointer hover-shadow transition"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate('/inventory-management')}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold small">{item.sku}</span>
                                            <span className="badge bg-danger">{item.current_stock} left</span>
                                        </div>
                                        <p className="mb-0 x-small text-danger">Stock below threshold ({item.threshold_value})</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small italic">No stock alerts</p>
                            )}

                            {/* Renewal Reminders */}
                            <h6 className="fw-bold mb-3 mt-4 small text-muted text-uppercase">Upcoming Renewals</h6>
                            {insights?.renewalReminders?.length > 0 ? (
                                insights.renewalReminders.map((rem, i) => (
                                    <div
                                        key={i}
                                        className="bg-warning-subtle p-3 rounded mb-2 border border-warning-subtle cursor-pointer hover-shadow transition"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => navigate('/contract-renewal')}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold small">{rem.license_name}</span>
                                        </div>
                                        <p className="mb-0 x-small text-dark">Expires: {new Date(rem.expiry_date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small italic">No upcoming renewals (30d)</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Utilization Analysis */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4 h-100" style={{ borderRadius: "15px" }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold d-flex align-items-center text-primary">
                                <i className="fa-solid fa-chart-line me-2"></i>
                                Utilization Radar
                            </h5>
                        </div>
                        <div className="card-body pt-0">
                            <h6 className="fw-bold mb-3 small text-muted text-uppercase">License Efficiency (System)</h6>
                            {insights?.lowUtilizationDepartments?.length > 0 ? (
                                insights.lowUtilizationDepartments.map((dept, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="small fw-semibold">{dept.departmentName}</span>
                                            <span className="small text-danger fw-bold">{dept.utilization}</span>
                                        </div>
                                        <div className="progress" style={{ height: "6px" }}>
                                            <div className="progress-bar bg-danger" style={{ width: dept.utilization }}></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted small">Efficiency is optimal across departments.</p>
                            )}

                            <h6 className="fw-bold mb-3 mt-4 small text-muted text-uppercase">Third-Party Utilization</h6>
                            {insights?.clientLicenseInsights?.slice(0, 3).map((lic, i) => (
                                <div key={i} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small fw-semibold">{lic.name}</span>
                                        <span className={`small fw-bold ${lic.status === 'critical' ? 'text-danger' : 'text-primary'}`}>{lic.utilization}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div className={`progress-bar ${lic.status === 'critical' ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${lic.utilization}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 3: Optimization Suggestions */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#2d3436", borderRadius: "15px", color: "white" }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                <i className="fa-solid fa-lightbulb text-warning me-2"></i>
                                Smart Suggestions
                            </h5>

                            <div className="bg-white bg-opacity-10 p-3 rounded mb-4">
                                <h6 className="fw-bold small text-info mb-2 text-uppercase">Financial Impact</h6>
                                <p className="small mb-0">Potential Savings: <strong>$1,450 / month</strong></p>
                                <p className="x-small text-white-50 mt-1">Found 12 overlapping or unused seat assignments.</p>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold small text-info mb-2 text-uppercase">Recommended Actions</h6>
                                <ul className="list-unstyled small">
                                    <li className="mb-2 d-flex align-items-start cursor-pointer" onClick={() => navigate('/client-license-management')}>
                                        <i className="fa-solid fa-check-circle text-success me-2 mt-1"></i>
                                        Downgrade Zoom Pro plan in Marketing (Utilization &lt; 20%)
                                    </li>
                                    <li className="mb-2 d-flex align-items-start cursor-pointer" onClick={() => navigate('/inventory-management')}>
                                        <i className="fa-solid fa-check-circle text-success me-2 mt-1"></i>
                                        Restock {insights?.inventoryAlerts?.[0]?.sku || 'SKU-Items'} immediately.
                                    </li>
                                    <li className="mb-2 d-flex align-items-start cursor-pointer" onClick={() => navigate('/license-management')}>
                                        <i className="fa-solid fa-check-circle text-success me-2 mt-1"></i>
                                        Consolidate SQL Server licenses under Tech department.
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-5 pt-4 border-top border-secondary text-white-50 x-small">
                                <p><i className="fa-solid fa-info-circle me-1"></i> Insights are refreshed every 24 hours based on transactional data.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redundancy Table */}
            <div className="card shadow-sm border-0 mt-4" style={{ borderRadius: "15px" }}>
                <div className="card-header bg-white py-3">
                    <h6 className="mb-0 fw-bold">Unused System Licenses (Potential Redundancy)</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>License Key</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Optimization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insights?.underutilizedLicenses?.map((lic, i) => (
                                    <tr key={i}>
                                        <td><code>{lic.license_key}</code></td>
                                        <td>{lic.category || 'Standard'}</td>
                                        <td><span className="badge bg-secondary">Unused</span></td>
                                        <td className="text-primary small fw-bold">
                                            <span
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    const userType = localStorage.getItem("userType");
                                                    if (userType === 'superadmin') {
                                                        navigate('/superadmin/manage-admins');
                                                    } else {
                                                        navigate('/license-management');
                                                    }
                                                }}
                                            >
                                                Revoke & Reassign
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntelligentInsights;
