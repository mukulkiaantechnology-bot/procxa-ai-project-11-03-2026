import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import {
    FiRefreshCw,
    FiFileText,
    FiAlertCircle,
    FiTrendingUp,
    FiCalendar,
    FiArrowRight,
    FiPlus,
    FiZap,
    FiClock,
    FiPieChart
} from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend
} from "chart.js";

// Register ChartJS
ChartJS.register(ArcElement, ChartTooltip, Legend);

const RenewalAutomation = () => {
    const navigate = useNavigate();
    const { get } = useApi();
    const [expiringContracts, setExpiringContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        totalExpiring: 0,
        renewedThisMonth: 0,
        potentialSavings: 0,
        criticalActions: 0,
        completionRate: 0
    });

    useEffect(() => {
        fetchExpiringContracts();
    }, []);

    const fetchExpiringContracts = async () => {
        try {
            setLoading(true);
            const response = await get(`${endpoints.getContractsExpiringSoon}?days=60`);
            if (response?.success) {
                setExpiringContracts(response.data || []);
                if (response.analytics) {
                    setAnalytics(response.analytics);
                }
                if (response.distribution) {
                    setDistributionData(response.distribution);
                }
            }
        } catch (error) {
            console.error("Error fetching expiring contracts:", error);
        } finally {
            setLoading(false);
        }
    };

    const [distributionData, setDistributionData] = useState([]);

    // Chart Configuration matching project colors
    const chartData = {
        labels: distributionData.length > 0 ? distributionData.map(d => d.name) : ["No Data"],
        datasets: [
            {
                data: distributionData.length > 0 ? distributionData.map(d => d.percentage) : [100],
                backgroundColor: [
                    "#578E7E",
                    "#3a6358",
                    "#76aba1",
                    "#2e4d44",
                    "#A3C6C4"
                ],
                borderWidth: 0,
                hoverOffset: 4
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#333',
                bodyColor: '#666',
                borderColor: '#eee',
                borderWidth: 1,
                padding: 12,
                boxPadding: 8,
                usePointStyle: true,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => ` ${context.label}: ${context.parsed}%`
                }
            }
        },
        maintainAspectRatio: false,
        cutout: "75%",
    };

    const handleRenew = (contract) => {
        navigate("/contract-renewal", { state: { contract } });
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f2f2f2', minHeight: 'calc(100vh - 85px)' }}>
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-1" style={{ color: '#333' }}>
                        <FiZap className="me-2" style={{ color: '#578E7E' }} />
                        Contract Renewal Automation
                    </h3>
                    <p className="text-muted small mb-0">Monitor expiries and automate your renewal process with AI-driven templates.</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate("/spendanalyt")}
                        className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-pill px-4"
                    >
                        <FiPieChart /> Spend Analytics
                    </button>
                    <button
                        onClick={() => navigate("/editrenewalnoti")}
                        className="btn text-white d-flex align-items-center gap-2 rounded-pill px-4"
                        style={{ backgroundColor: '#578E7E' }}
                    >
                        <FiPlus /> New Renewal
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                {[
                    { label: "Expiring Soon", value: analytics.totalExpiring, icon: FiClock, color: "#578E7E", bg: "#EBF2F0" },
                    { label: "Renewed (MTD)", value: analytics.renewedThisMonth, icon: FiRefreshCw, color: "#10b981", bg: "#ECFDF5" },
                    { label: "Critical Actions", value: analytics.criticalActions, icon: FiAlertCircle, color: "#ef4444", bg: "#FEF2F2" },
                    { label: "Est. Savings", value: analytics.potentialSavings, icon: FiTrendingUp, color: "#3b82f6", bg: "#EFF6FF" },
                ].map((stat, i) => (
                    <div key={i} className="col-12 col-md-6 col-lg-3">
                        <div className="card border-0 shadow-sm h-100 rounded-4 transition-hover">
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '54px', height: '54px', backgroundColor: stat.bg }}
                                >
                                    <stat.icon style={{ color: stat.color, fontSize: '1.5rem' }} />
                                </div>
                                <div>
                                    <p className="text-muted small fw-medium mb-0">{stat.label}</p>
                                    <h4 className="fw-bold mb-0" style={{ color: '#333' }}>{stat.value}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Main List Column */}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div className="card-header bg-white py-3 px-4 border-bottom-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FiFileText style={{ color: '#578E7E' }} />
                                    Expiring Contracts (60 Days)
                                </h5>
                                <span className="badge rounded-pill" style={{ backgroundColor: '#EBF2F0', color: '#578E7E' }}>
                                    {expiringContracts.length} Total
                                </span>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light text-muted uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
                                    <tr>
                                        <th className="px-4 py-3">Contract Detail</th>
                                        <th className="px-4 py-3">Supplier</th>
                                        <th className="px-4 py-3">Expiry</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="border-top-0">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="py-5 text-center">
                                                <div className="spinner-border" style={{ color: '#578E7E' }} role="status"></div>
                                                <p className="text-muted mt-2 mb-0">Analyzing contract pipeline...</p>
                                            </td>
                                        </tr>
                                    ) : expiringContracts.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-5 text-center text-muted">
                                                <div className="mb-2"><FiZap size={32} color="#ddd" /></div>
                                                No contracts requiring immediate renewal.
                                            </td>
                                        </tr>
                                    ) : (
                                        expiringContracts.map((contract) => (
                                            <tr key={contract.id} className="transition-hover">
                                                <td className="px-4 py-3">
                                                    <p className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>{contract.contractName}</p>
                                                    <small className="text-muted">{contract.department?.name || "General"}</small>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="badge bg-light text-secondary border fw-medium">
                                                        {contract.supplier?.name || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <FiCalendar className={contract.daysUntilExpiry <= 15 ? "text-danger" : "text-muted"} />
                                                        <div>
                                                            <p className={`mb-0 fw-semibold ${contract.daysUntilExpiry <= 15 ? "text-danger" : "text-dark"}`} style={{ fontSize: '0.9rem' }}>
                                                                {new Date(contract.endDate).toLocaleDateString()}
                                                            </p>
                                                            <small className="text-muted">{contract.daysUntilExpiry} days left</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleRenew(contract)}
                                                        className="btn btn-light btn-sm rounded-circle d-inline-flex align-items-center justify-content-center transition-hover"
                                                        style={{ width: '40px', height: '40px' }}
                                                        title="Start AI Renewal"
                                                    >
                                                        <FiArrowRight style={{ color: '#578E7E' }} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Action Column */}
                <div className="col-12 col-lg-4">
                    <div className="d-flex flex-column gap-4 h-100">
                        {/* Promo Card */}
                        <div className="card border-0 shadow-sm rounded-4 text-white overflow-hidden"
                            style={{ backgroundColor: '#578E7E', backgroundImage: 'linear-gradient(135deg, #578E7E 0%, #3a6358 100%)' }}>
                            <div className="card-body p-4 position-relative" style={{ zIndex: 1 }}>
                                <div className="mb-4">
                                    <FiZap className="mb-2 text-warning" size={32} />
                                    <h4 className="fw-bold mb-2">One-Click Renewal</h4>
                                    <p className="small opacity-75">Our system has mapped templates for your active contracts. Speed up renewal by 80%.</p>
                                </div>
                                <button
                                    onClick={() => navigate("/contract-renewal")}
                                    className="btn btn-white w-100 py-2 fw-bold text-dark rounded-pill transition-hover shadow-sm"
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    Access Templates
                                </button>
                            </div>
                            {/* Decorative Circle */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                zIndex: 0
                            }}></div>
                        </div>

                        {/* Chart Card */}
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <FiPieChart style={{ color: '#578E7E' }} />
                                Renewal Distribution
                            </h5>
                            <div style={{ height: '220px' }} className="position-relative">
                                <Pie data={chartData} options={chartOptions} />
                                <div className="position-absolute top-50 start-50 translate-middle text-center pointer-events-none">
                                    <h3 className="fw-bold mb-0 text-dark">{analytics.completionRate}%</h3>
                                    <p className="text-muted x-small uppercase fw-bold mb-0" style={{ fontSize: '0.65rem' }}>Completion</p>
                                </div>
                            </div>
                            <div className="mt-4 row g-2">
                                {distributionData.length > 0 ? (
                                    distributionData.slice(0, 3).map((d, i) => (
                                        <div key={i} className="col-4 text-center">
                                            <div className="d-inline-block rounded-circle mb-1" style={{ width: '8px', height: '8px', backgroundColor: chartData.datasets[0].backgroundColor[i] }}></div>
                                            <p className="text-muted tiny text-truncate mb-0" style={{ fontSize: '0.7rem' }}>{d.name}</p>
                                            <p className="fw-bold small mb-0">{d.percentage}%</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center text-muted small">No distribution data</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .transition-hover {
          transition: all 0.2s ease;
        }
        .transition-hover:hover {
          transform: translateY(-2px);
          background-color: #fbfbfb !important;
        }
        .btn-white:hover {
          background-color: #e9e9e9 !important;
          transform: scale(1.02);
        }
        .btn-outline-secondary:hover {
          border-color: #578E7E;
          background-color: #EBF2F0;
          color: #578E7E;
        }
        .right-side-content {
          background-color: #f2f2f2;
        }
      `}</style>
        </div>
    );
};

export default RenewalAutomation;
