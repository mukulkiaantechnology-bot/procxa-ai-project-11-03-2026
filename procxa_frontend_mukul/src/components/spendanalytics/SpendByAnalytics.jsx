import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SpendByAnalytics = () => {
    const navigate = useNavigate();
    const { get } = useApi();

    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        supplierName: '',
        categoryName: '',
        departmentName: '',
        approverId: '',
        startDate: '',
        endDate: '',
        reportingYear: '',
        reportingMonth: '',
        minAmount: '',
        maxAmount: ''
    });

    const [approvers, setApprovers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [selectedView, setSelectedView] = useState('category'); // category, department, supplier

    useEffect(() => {
        fetchData();
        fetchDropdownData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch ALL data for client-side aggregation
            const response = await get(endpoints.getSpendsDetails, {
                params: { limit: 10000, page: 1 }
            });

            if (response.status || response.success) {
                const data = response.data || [];
                setAllData(data);
                setFilteredData(data);
            } else {
                setAllData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.error('Error fetching spend analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const categoryResponse = await get(endpoints.getCategory);
            setCategories(categoryResponse.categories || []);

            const departmentResponse = await get(endpoints.getAllDepartments);
            setDepartments(departmentResponse.data || []);

            const supplierResponse = await get(endpoints.getSuppliers);
            setSuppliers(supplierResponse.data || []);

            const approverResponse = await get(endpoints.getAllAdmins || '/superadmin/admins');
            setApprovers(approverResponse.data || []);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    // Filter Logic
    useEffect(() => {
        let result = [...allData];

        if (filters.supplierName) {
            result = result.filter(item => item.supplier?.name === filters.supplierName);
        }
        if (filters.categoryName) {
            result = result.filter(item => item.category?.name === filters.categoryName);
        }
        if (filters.departmentName) {
            result = result.filter(item => item.department?.name === filters.departmentName);
        }
        if (filters.approverId) {
            result = result.filter(item => item.approverId === filters.approverId || item.userId === filters.approverId);
        }

        if (filters.startDate) {
            result = result.filter(item => new Date(item.dateOfTransaction) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(item => new Date(item.dateOfTransaction) <= end);
        }

        if (filters.reportingYear) {
            result = result.filter(item => (item.year?.toString() === filters.reportingYear) || (new Date(item.dateOfTransaction).getFullYear().toString() === filters.reportingYear));
        }
        if (filters.reportingMonth) {
            result = result.filter(item => {
                const d = new Date(item.dateOfTransaction);
                return (d.getMonth() + 1).toString() === filters.reportingMonth;
            });
        }

        if (filters.minAmount) {
            result = result.filter(item => Number(item.amount) >= Number(filters.minAmount));
        }
        if (filters.maxAmount) {
            result = result.filter(item => Number(item.amount) <= Number(filters.maxAmount));
        }

        setFilteredData(result);
    }, [filters, allData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // --- Aggregation Logic ---

    // Summary Metrics
    const summaryMetrics = useMemo(() => {
        const totalSpend = filteredData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const uniqueSuppliers = new Set(filteredData.map(item => item.supplier?.id || item.supplierName)).size;
        return {
            totalTransactions: filteredData.length,
            totalSpend: totalSpend,
            totalSuppliers: uniqueSuppliers
        };
    }, [filteredData]);

    // Grouped Data for Charts/Tables
    const groupedData = useMemo(() => {
        const groupBy = (keyExtractor, nameExtractor) => {
            const groups = {};
            filteredData.forEach(item => {
                const key = keyExtractor(item) || 'Unknown';
                if (!groups[key]) {
                    groups[key] = { name: nameExtractor(item) || 'Unknown', totalSpend: 0, count: 0 };
                }
                groups[key].totalSpend += Number(item.amount || 0);
                groups[key].count += 1;
            });
            return Object.values(groups).sort((a, b) => b.totalSpend - a.totalSpend);
        };

        return {
            byCategory: groupBy(i => i.category?.id || i.categoryName, i => i.category?.name || i.categoryName),
            byDepartment: groupBy(i => i.department?.id || i.departmentName, i => i.department?.name || i.departmentName),
            bySupplier: groupBy(i => i.supplier?.id || i.supplierName, i => i.supplier?.name || i.supplierName),
        };
    }, [filteredData]);


    const getCategoryChartData = () => ({
        labels: groupedData.byCategory.map(c => c.name),
        datasets: [{
            label: 'Spend by Category',
            data: groupedData.byCategory.map(c => c.totalSpend),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#76A346'],
            borderWidth: 1
        }]
    });

    const getDepartmentChartData = () => ({
        labels: groupedData.byDepartment.map(d => d.name),
        datasets: [{
            label: 'Spend by Department',
            data: groupedData.byDepartment.map(d => d.totalSpend),
            backgroundColor: '#578E7E',
            borderColor: '#456F61',
            borderWidth: 1
        }]
    });

    const getSupplierChartData = () => ({
        labels: groupedData.bySupplier.map(s => s.name),
        datasets: [{
            label: 'Spend by Supplier',
            data: groupedData.bySupplier.map(s => s.totalSpend),
            backgroundColor: '#0D99FF',
            borderColor: '#0A7ACC',
            borderWidth: 1
        }]
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return (context.label || '') + ': $' + context.parsed.toLocaleString() + (context.dataset.label ? ` (${context.dataset.label})` : '');
                    }
                }
            }
        }
    };

    // Generate Year Options
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    return (
        <div className="container my-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1 fw-bold">Spend Management & Analytics</h3>
                    <p className="text-muted mb-0">Track spending across categories, departments, and suppliers</p>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-arrow-left me-2"></i> Back
                </button>
            </div>

            {/* Summary Cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#ff6567', color: 'white' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-white p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-receipt fs-4" style={{ color: '#ff6567' }}></i>
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold">{summaryMetrics.totalTransactions}</h3>
                                <p className="mb-0 opacity-75">Total Transactions</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#ff9318', color: 'white' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-white p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-dollar-sign fs-4" style={{ color: '#ff9318' }}></i>
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold">${summaryMetrics.totalSpend.toLocaleString()}</h3>
                                <p className="mb-0 opacity-75">Total Spend Amount</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#39bf1b', color: 'white' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-white p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-truck-fast fs-4" style={{ color: '#39bf1b' }}></i>
                            </div>
                            <div>
                                <h3 className="mb-0 fw-bold">{summaryMetrics.totalSuppliers}</h3>
                                <p className="mb-0 opacity-75">Transactions with Supplier</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-3 shadow-sm mb-4">
                <h5 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>Filters</h5>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Category</label>
                        <select className="form-select form-select-sm" name="categoryName" value={filters.categoryName} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            {categories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Department</label>
                        <select className="form-select form-select-sm" name="departmentName" value={filters.departmentName} onChange={handleFilterChange}>
                            <option value="">All Departments</option>
                            {departments.map((d) => (<option key={d.id} value={d.name}>{d.name}</option>))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Supplier</label>
                        <select className="form-select form-select-sm" name="supplierName" value={filters.supplierName} onChange={handleFilterChange}>
                            <option value="">All Suppliers</option>
                            {suppliers.map((s) => (<option key={s.id} value={s.name}>{s.name}</option>))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Signing Authority</label>
                        <select className="form-select form-select-sm" name="approverId" value={filters.approverId} onChange={handleFilterChange}>
                            <option value="">All Approvers</option>
                            {approvers.map((a) => (<option key={a.id} value={a.id}>{a.first_name} {a.last_name}</option>))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small text-muted">Start Date</label>
                        <input type="date" className="form-control form-control-sm" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">End Date</label>
                        <input type="date" className="form-control form-control-sm" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small text-muted">Reporting Year</label>
                        <select className="form-select form-select-sm" name="reportingYear" value={filters.reportingYear} onChange={handleFilterChange}>
                            <option value="">All Years</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Reporting Month</label>
                        <select className="form-select form-select-sm" name="reportingMonth" value={filters.reportingMonth} onChange={handleFilterChange}>
                            <option value="">All Months</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label small text-muted">Min Amount</label>
                        <input type="number" className="form-control form-control-sm" placeholder="0" name="minAmount" value={filters.minAmount} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Max Amount</label>
                        <input type="number" className="form-control form-control-sm" placeholder="Max" name="maxAmount" value={filters.maxAmount} onChange={handleFilterChange} />
                    </div>
                </div>
            </div>

            {/* View Selector */}
            <div className="card mb-4">
                <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Detailed Analytics</h5>
                        <div className="btn-group" role="group">
                            <button className={`btn btn-sm ${selectedView === 'category' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedView('category')}>
                                <i className="fa-solid fa-layer-group me-1"></i> By Category
                            </button>
                            <button className={`btn btn-sm ${selectedView === 'department' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedView('department')}>
                                <i className="fa-solid fa-building me-1"></i> By Department
                            </button>
                            <button className={`btn btn-sm ${selectedView === 'supplier' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedView('supplier')}>
                                <i className="fa-solid fa-truck me-1"></i> By Supplier
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        {/* Chart */}
                        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                            <div style={{ height: '400px' }}>
                                {selectedView === 'category' && <Pie data={getCategoryChartData()} options={chartOptions} />}
                                {selectedView === 'department' && <Bar data={getDepartmentChartData()} options={chartOptions} />}
                                {selectedView === 'supplier' && <Bar data={getSupplierChartData()} options={chartOptions} />}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="col-12 col-lg-6">
                            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="table table-hover">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th>{selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}</th>
                                            <th className="text-end">Amount</th>
                                            <th className="text-end">%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedData[`by${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}`].map((item, index) => {
                                            const total = summaryMetrics.totalSpend;
                                            const percentage = total > 0 ? (item.totalSpend / total * 100).toFixed(1) : 0;
                                            return (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td className="text-end fw-bold">${item.totalSpend.toLocaleString()}</td>
                                                    <td className="text-end">{percentage}%</td>
                                                </tr>
                                            );
                                        })}
                                        {groupedData[`by${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}`].length === 0 && (
                                            <tr><td colSpan="3" className="text-center text-muted">No data available for filters</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpendByAnalytics;
