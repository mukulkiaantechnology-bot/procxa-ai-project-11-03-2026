import React, { useEffect, useState, useRef } from "react";
import { Chart, LineController, LineElement, BarController, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Modal, Button } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { Link, useNavigate } from "react-router-dom";

Chart.register(
  LineController,
  LineElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [intakeRequests, setIntakeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spendPeriod, setSpendPeriod] = useState("monthly"); // 'monthly' or 'yearly'

  const spendTrendsRef = useRef(null);
  const topSpendingVendorsRef = useRef(null);
  const spendTrendsChartRef = useRef(null);
  const topSpendingVendorsChartRef = useRef(null);
  const { get, post, del } = useApi();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleIconClick = (request) => {
    navigate(`/editIntakeRequest/${request.id}`);
  };

  const handleOpenModal = async (request) => {
    try {
      const response = await get(`${endpoints.getIntakeRequestById}/${request.id}`);
      if (response && response.data) {
        setSelectedRequest(response.data);
        setShowModal(true);
      } else {
        alert("Failed to fetch full request details");
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      alert("Error fetching request details");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this intake request?")) {
      try {
        const response = await del(`${endpoints.deleteIntakeRequest}/${requestId}`);
        if (response && response.status) {
          alert("Request deleted successfully");
          // Refresh the list
          setIntakeRequests(prev => prev.filter(r => r.id !== requestId));
        } else {
          alert(response?.message || "Failed to delete request");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        alert("An error occurred while deleting the request");
      }
    }
  };



  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await get(endpoints.getDashboardData);
        if (response && response.status) {
          setDashboardData({
            summary: response.summary || {},
            topSuppliers: response.topSuppliers || [],
            categoryDataMonthly: response.categoryDataMonthly || [],
            categoryDataYearly: response.categoryDataYearly || [],
            comingRenewals: response.comingRenewals || []
          });
        } else {
          setDashboardData({
            summary: {},
            topSuppliers: [],
            categoryDataMonthly: [],
            categoryDataYearly: [],
            comingRenewals: []
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchIntakeRequests = async () => {
      try {
        const response = await get(`${endpoints.intakeDashboard}?page=1&limit=10`);
        if (response && response.data) {
          setIntakeRequests(response.data.allRequests || []);
        } else if (response && Array.isArray(response)) {
          setIntakeRequests(response);
        } else {
          setIntakeRequests([]);
        }
      } catch (error) {
        console.error("Error fetching intake requests", error);
        setIntakeRequests([]);
      }
    };

    fetchDashboardData();
    fetchIntakeRequests();

    return () => {
      if (spendTrendsChartRef.current) spendTrendsChartRef.current.destroy();
      if (topSpendingVendorsChartRef.current) topSpendingVendorsChartRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (spendTrendsRef.current && dashboardData) {
      const ctx1 = spendTrendsRef.current.getContext("2d");
      if (spendTrendsChartRef.current) spendTrendsChartRef.current.destroy();

      const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
        return color;
      };

      let chartConfig = {};

      if (spendPeriod === "monthly") {
        const months = ["Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"];
        const categoryData = (dashboardData.categoryDataMonthly || []).reduce((acc, item) => {
          if (!acc[item.categoryName]) acc[item.categoryName] = months.map(() => 0);
          const monthIndex = months.indexOf(item.month);
          if (monthIndex !== -1) acc[item.categoryName][monthIndex] = item.totalAmount;
          return acc;
        }, {});

        chartConfig = {
          type: "line",
          data: {
            labels: months,
            datasets: Object.keys(categoryData).map(categoryName => ({
              label: categoryName,
              data: categoryData[categoryName],
              borderColor: generateRandomColor(),
              borderWidth: 2,
              pointStyle: "circle",
              pointRadius: 4,
              fill: false,
              tension: 0,
            }))
          }
        };
      } else {
        // Yearly view
        const yearlyData = dashboardData.categoryDataYearly || [];
        chartConfig = {
          type: "bar",
          data: {
            labels: yearlyData.map(item => item.categoryName),
            datasets: [{
              label: "Total Spend ($)",
              data: yearlyData.map(item => item.totalAmount),
              backgroundColor: "rgba(115, 169, 174, 0.7)",
              borderColor: "rgba(115, 169, 174, 1)",
              borderWidth: 1
            }]
          }
        };
      }

      spendTrendsChartRef.current = new Chart(ctx1, {
        ...chartConfig,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { boxWidth: 12, font: { size: 11 } }
            }
          },
          scales: {
            y: { beginAtZero: true, ticks: { font: { size: 11 } } },
            x: { ticks: { font: { size: 11 } } }
          }
        }
      });
    }

    if (topSpendingVendorsRef.current && dashboardData) {
      const ctx2 = topSpendingVendorsRef.current.getContext("2d");
      if (topSpendingVendorsChartRef.current) topSpendingVendorsChartRef.current.destroy();

      topSpendingVendorsChartRef.current = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: (dashboardData.topSuppliers || []).map(item => item.topSupplier),
          datasets: [{
            label: "Amount ($)",
            data: (dashboardData.topSuppliers || []).map(item => item.totalAmount),
            backgroundColor: "rgba(115, 169, 174, 1)",
            borderColor: "rgba(179, 179, 179, 1)",
            borderWidth: 1,
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { beginAtZero: true, ticks: { font: { size: 11 } } },
            y: { ticks: { font: { size: 11 } } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }, [dashboardData, spendPeriod]);

  // Group renewals by department
  const groupedRenewals = (dashboardData?.comingRenewals || []).reduce((acc, current) => {
    const dept = current.departmentName || "General";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(current);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 mb-5">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-1" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>Dashboard</h3>
          <p className="text-muted mb-0" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>Overview of your procurement activities</p>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 w-md-auto">
          <Link to="/intakenewreq" className="text-decoration-none">
            <button className="btn w-100" style={{ backgroundColor: "#578E7E", color: "white", border: "none" }}>
              <i className="fa-solid fa-plus me-2"></i>New Request
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-5 text-center mb-4 mt-4 g-3">
        {/* Total Requests */}
        <div className="col">
          <div className="card dashboardcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#ff6567" }}>
            <div className="content d-flex justify-content-start align-items-center p-3">
              <div className="icon">
                <i className="fa-solid fa-file-lines rounded-circle p-3" style={{ backgroundColor: "#fdabab", fontSize: "1.5rem" }} />
              </div>
              <div className="text ms-3 text-start">
                <h2 className="card-title mb-0 fw-bold">{intakeRequests.length}</h2>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>Total Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Active */}
        <div className="col">
          <div className="card dashboardcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#0d6efd" }}>
            <div className="content d-flex justify-content-start align-items-center p-3">
              <div className="icon">
                <i className="fa-solid fa-bolt rounded-circle p-3" style={{ backgroundColor: "#5f9bf6", fontSize: "1.5rem" }} />
              </div>
              <div className="text ms-3 text-start">
                <h2 className="card-title mb-0 fw-bold">{dashboardData?.summary?.projectsActive || 0}</h2>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>Projects Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Pending */}
        <div className="col">
          <div className="card dashboardcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#ff9318" }}>
            <div className="content d-flex justify-content-start align-items-center p-3">
              <div className="icon">
                <i className="fa-solid fa-clock rounded-circle p-3" style={{ backgroundColor: "#fcc586", fontSize: "1.5rem" }} />
              </div>
              <div className="text ms-3 text-start">
                <h2 className="card-title mb-0 fw-bold">{dashboardData?.summary?.projectsPending || 0}</h2>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>Projects Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Completed */}
        <div className="col">
          <div className="card dashboardcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#39bf1b" }}>
            <div className="content d-flex justify-content-start align-items-center p-3">
              <div className="icon">
                <i className="fa-solid fa-check-circle rounded-circle p-3" style={{ backgroundColor: "#74d25f", fontSize: "1.5rem" }} />
              </div>
              <div className="text ms-3 text-start">
                <h2 className="card-title mb-0 fw-bold">{dashboardData?.summary?.projectsCompleted || 0}</h2>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>Projects Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Contracts */}
        <div className="col">
          <div className="card dashboardcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#624de3" }}>
            <div className="content d-flex justify-content-start align-items-center p-3">
              <div className="icon">
                <i className="fa-solid fa-file-contract rounded-circle p-3" style={{ backgroundColor: "#a29bfe", fontSize: "1.5rem" }} />
              </div>
              <div className="text ms-3 text-start">
                <h2 className="card-title mb-0 fw-bold">{dashboardData?.summary?.totalExpiringContracts || 0}</h2>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.9rem" }}>Expiring Contracts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spend Dashboard Section */}
      <div className="row mt-5 g-3">
        <div className="col-12 col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0"><u className="fw-bold">Spend Analytics</u></h5>
            <select
              className="form-select form-select-sm w-auto"
              value={spendPeriod}
              onChange={(e) => setSpendPeriod(e.target.value)}
            >
              <option value="monthly">Month-wise</option>
              <option value="yearly">Year-wise</option>
            </select>
          </div>
          <div className="shadow-sm p-3 bg-white rounded" style={{ height: "350px" }}>
            <canvas ref={spendTrendsRef} />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <h5 className="mb-3"><u className="fw-bold">Top Vendors</u></h5>
          <div className="shadow-sm p-3 bg-white rounded" style={{ height: "350px" }}>
            <canvas ref={topSpendingVendorsRef} />
          </div>
        </div>
      </div>

      {/* Coming Renewals Section */}
      <div className="mt-5">
        <h5 className="mb-3"><u className="fw-bold">Coming Renewals in next 6 months</u></h5>
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          {Object.keys(groupedRenewals).length > 0 ? (
            Object.keys(groupedRenewals).map(dept => (
              <div key={dept} className="mb-4">
                <h6 className="bg-light p-2 fw-bold text-uppercase" style={{ fontSize: "0.85rem", color: "#578E7E" }}>{dept}</h6>
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Contract Name</th>
                      <th>Supplier</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedRenewals[dept].map(renewal => (
                      <tr key={renewal.id}>
                        <td>{renewal.contractName}</td>
                        <td>{renewal.supplierName || "N/A"}</td>
                        <td>{new Date(renewal.endDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p className="text-muted text-center py-3">No upcoming renewals found for the next 6 months.</p>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <h4 className="fw-semibold border-bottom pb-2 mb-3 mt-5" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Recent Activity</h4>

      {/* (Rest of the Desktop Table View remains unchanged) */}
      <div className="table-responsive d-none d-md-block mb-4 shadow-sm rounded">
        <table className="table table-striped table-bordered text-center mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Requester Name</th>
              <th>Department</th>
              <th>Supplier</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {intakeRequests.length > 0 ? (
              intakeRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>{request.projectName || request.requesterName || "N/A"}</td>
                  <td>{request["department.name"] || request.department?.name || "N/A"}</td>
                  <td>{request.supplierName || "Not Assigned"}</td>
                  <td>{request.requestType || "N/A"}</td>
                  <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <span className={`badge ${
                      request.status === 'approved' ? 'bg-success' : 
                      request.status === 'rejected' ? 'bg-danger' : 
                      request.status === 'pending' ? 'bg-warning' : 
                      request.status === 'active' ? 'bg-primary' : 'bg-secondary'
                    } text-capitalize`}>
                      {request.status || 'pending'}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <div className="d-flex justify-content-center gap-2">
                      <i
                        className="fa-regular fa-eye"
                        style={{ color: "#0d99ff", cursor: "pointer" }}
                        title="View"
                        onClick={() => handleOpenModal(request)}
                      />
                      <i
                        className="fa-regular fa-pen-to-square"
                        style={{ color: "#578E7E", cursor: "pointer" }}
                        title="Edit"
                        onClick={() => handleIconClick(request)}
                      />
                      <i
                        className="fa-regular fa-trash-can"
                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                        title="Delete"
                        onClick={() => handleDelete(request.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="py-4">No requests found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>More Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest ? (
            <div className="p-2">
              <div className="row mb-2">
                <div className="col-6"><strong>Request ID:</strong></div>
                <div className="col-6">{selectedRequest.id}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Request Type:</strong></div>
                <div className="col-6 text-capitalize">{selectedRequest.requestType || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Status:</strong></div>
                <div className="col-6 text-capitalize">{selectedRequest.status}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Item Description:</strong></div>
                <div className="col-6">{selectedRequest.itemDescription || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Requester Name:</strong></div>
                <div className="col-6">{selectedRequest.requesterName || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Requester Email:</strong></div>
                <div className="col-6">{selectedRequest.requesterEmail || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Supplier Name:</strong></div>
                <div className="col-6">{selectedRequest.supplierName || selectedRequest.supplier?.name || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Supplier Email:</strong></div>
                <div className="col-6">{selectedRequest.supplierEmail || "N/A"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6"><strong>Requested Amount:</strong></div>
                <div className="col-6">{selectedRequest.requestedAmount || "N/A"}</div>
              </div>
            </div>
          ) : (
            <p>No request selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .dashboardcard { border-radius: 12px; border: none; transition: transform 0.2s; }
        .dashboardcard:hover { transform: translateY(-3px); }
        .dashboardcard .icon i { width: 50px; height: 50px; display: flex; align-items: center; justifyContent: center; }
        .form-select { border-radius: 8px; font-size: 0.9rem; }
        .table { font-size: 0.9rem; }
        .table thead th { font-weight: 600; color: #666; }
      `}</style>
    </div>
  );
};

export default Dashboard;