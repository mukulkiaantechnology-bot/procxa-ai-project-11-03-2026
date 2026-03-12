import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SpendAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [calculatedSummary, setCalculatedSummary] = useState({
    totalSpend: 0,
    totalSuppliers: 0
  });
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Parallel Fetch: Dashboard Analytics (for charts) AND Spend Details (for accurate totals)
      const [analyticsResponse, detailsResponse] = await Promise.all([
        get(endpoints.getDashboardSpendsAnalytics),
        get(endpoints.getSpendsDetails, { params: { limit: 10000, page: 1 } }) // Fetch all for calc
      ]);

      // Process Analytics Data (Charts)
      if (analyticsResponse?.status || analyticsResponse?.success) {
        setDashboardData(analyticsResponse.data || analyticsResponse);
      }

      // Process Details Data (Accurate Totals)
      if (detailsResponse?.status || detailsResponse?.success) {
        const transactions = detailsResponse.data || [];
        const totalSpend = transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const uniqueSuppliers = new Set(transactions.map(item => item.supplier?.id || item.supplierName)).size;

        setCalculatedSummary({
          totalSpend,
          totalSuppliers: uniqueSuppliers
        });
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Chart Data Preparation (using dashboardData from API) ---
  const spendTrendData = {
    labels: dashboardData?.spendTrend?.map(item => item.month || item.date) || [],
    datasets: [
      {
        label: "Spend Trend",
        data: dashboardData?.spendTrend?.map(item => item.amount) || [],
        borderColor: "#3276E8",
        backgroundColor: "rgba(50, 118, 232, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topVendorsData = {
    labels: dashboardData?.topVendors?.map(item => item.name) || [],
    datasets: [
      {
        label: "Top Vendors",
        data: dashboardData?.topVendors?.map(item => item.amount) || [],
        backgroundColor: "#FF9318",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            return (context.label || '') + ': $' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="fw-bold text-dark">Spend Overview</h3>
          <p className="text-secondary">
            High-level graphical view of spending trends and metrics.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row text-center mb-4 mt-4 g-3">
        {/* Total Spend */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card text-white h-100"
            style={{ backgroundColor: "#ff6567", borderRadius: "14px" }}
          >
            <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-2 gap-md-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#fdabab",
                  width: "56px",
                  height: "56px",
                  fontSize: "1.5rem",
                  margin: "0 auto",
                }}
              >
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div className="text-center text-md-start">
                <h2 className="mb-0 fw-bold">
                  ${calculatedSummary.totalSpend.toLocaleString()}
                </h2>
                <small>Total Spend</small>
              </div>
            </div>
          </div>
        </div>
        {/* Total Suppliers */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card text-white h-100"
            style={{ backgroundColor: "#ff9318", borderRadius: "14px" }}
          >
            <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-2 gap-md-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#fcc586",
                  width: "56px",
                  height: "56px",
                  fontSize: "1.5rem",
                  margin: "0 auto",
                }}
              >
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div className="text-center text-md-start">
                <h2 className="mb-0 fw-bold">
                  {calculatedSummary.totalSuppliers}
                </h2>
                <small>Total Suppliers</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Spend Trend</h5>
              <div style={{ height: "300px" }}>
                <Line options={options} data={spendTrendData} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Top Spending Vendors</h5>
              <div style={{ height: "300px" }}>
                <Bar options={options} data={topVendorsData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendAnalytics;