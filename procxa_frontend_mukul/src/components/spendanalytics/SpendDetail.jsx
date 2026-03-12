import React, { useState, useEffect, useMemo } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const SpendDetail = () => {
  const [allData, setAllData] = useState([]); // Store ALL fetched data
  const [filteredData, setFilteredData] = useState([]); // Store filtered data
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

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
  });

  const navigate = useNavigate();
  const { get } = useApi();

  // Fetch ALL data initially
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetching with a large limit to get all records for client-side filtering
      // Since we cannot touch the backend to implement complex range filters
      const response = await get(endpoints.getSpendsDetails, {
        params: { limit: 10000, page: 1 }
      });

      if (response.status || response.success) {
        const data = response.data || [];
        setAllData(data);
        setFilteredData(data); // Initial view shows all
      } else {
        console.error('No data found');
        setAllData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, []);

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
      // Assuming 'createdBy' or similar field tracks the user/approver, OR if the data includes an approver field.
      // Adjusting based on standard data availability. If approver info isn't in 'item', this might need adjustment.
      // For now, checking if there's a direct match or skip if not present in data.
      result = result.filter(item => item.approverId === filters.approverId || item.userId === filters.approverId);
    }

    if (filters.startDate) {
      result = result.filter(item => new Date(item.dateOfTransaction) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      // Set end date to end of day
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(item => new Date(item.dateOfTransaction) <= end);
    }

    if (filters.reportingYear) {
      // Assuming 'year' field exists as per original code, or deriving from date
      result = result.filter(item => (item.year?.toString() === filters.reportingYear) || (new Date(item.dateOfTransaction).getFullYear().toString() === filters.reportingYear));
    }
    if (filters.reportingMonth) {
      result = result.filter(item => {
        const d = new Date(item.dateOfTransaction);
        // Month is 0-indexed in JS date, but value usually 1-12
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
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter
  }, [filters, allData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Pagination Slice
  const paginatedData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.limit;
    return filteredData.slice(start, start + pagination.limit);
  }, [filteredData, pagination]);

  const totalPages = Math.ceil(filteredData.length / pagination.limit);

  // Summary Metrics Calculation
  const summaryMetrics = useMemo(() => {
    const totalSpend = filteredData.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const uniqueSuppliers = new Set(filteredData.map(item => item.supplier?.id || item.supplierName)).size;
    return {
      totalTransactionCount: filteredData.length,
      totalSpendAmount: totalSpend,
      totalVendorCount: uniqueSuppliers
    };
  }, [filteredData]);

  const exportToExcel = () => {
    const dataToExport = filteredData.map(transaction => ({
      "Date of Transaction": new Date(transaction.dateOfTransaction).toLocaleDateString(),
      "Supplier Name": transaction.supplier?.name || "N/A",
      "Department": transaction.department?.name || "N/A",
      "Category": transaction.category?.name || "N/A",
      "Reporting Year": transaction.year || new Date(transaction.dateOfTransaction).getFullYear(),
      "Amount": transaction.amount
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Spend Details");
    XLSX.writeFile(wb, "spend_details.xlsx");
  };

  // Generate Year Options (e.g., last 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="container">
      <div className="top d-flex flex-wrap justify-content-between align-items-center">
        <div className="heading">
          <h3 className="mb-3 fw-semibold">Spend Details</h3>
        </div>
        <div className="mt-3 mt-md-0">
          <button
            type="button"
            className="btn ms-3 px-4 py-1 rounded-3 fw-semibold text-white"
            style={{ backgroundColor: "#3276e8" }}
            onClick={exportToExcel}
          >
            Export <i className="fa-solid fa-arrow-down ms-2" />
          </button>
          <button
            type="button"
            className="btn ms-3 px-4 py-1 rounded-3 fw-semibold text-white"
            style={{ backgroundColor: "#3276e8", color: "#333" }}
            onClick={() => navigate(-1)}
          >
            Back <i className="fa-solid fa-arrow-left ms-2" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row text-center mb-4 mt-4">
        <div className="col-12 col-sm-6 col-lg-3 mb-3">
          <div className="card spendcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#ff6567" }}>
            <div className="content d-flex justify-content-start align-items-center p-2">
              <div className="icon">
                <i className="fa-regular fa-file-lines rounded-circle p-3" style={{ backgroundColor: "#fdabab" }} />
              </div>
              <div className="text ms-4 text-start fw-semibold">
                <h2 className="card-title mb-0 fw-bold">{summaryMetrics.totalTransactionCount}</h2>
                <p>Total Transactions</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-3">
          <div className="card spendcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#ff9318" }}>
            <div className="content d-flex justify-content-start align-items-center p-2">
              <div className="icon">
                <i className="fa-solid fa-dollar-sign rounded-circle p-3" style={{ backgroundColor: "#fcc586" }} />
              </div>
              <div className="text ms-4 text-start">
                <h2 className="card-title mb-0 fw-bold">${summaryMetrics.totalSpendAmount.toLocaleString()}</h2>
                <p>Total Spend Amount</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 mb-3">
          <div className="card spendcard text-white fw-semibold h-100 d-flex justify-content-center" style={{ backgroundColor: "#39bf1b" }}>
            <div className="content d-flex justify-content-start align-items-center p-2">
              <div className="icon">
                <i className="fa-regular fa-handshake rounded-circle p-3" style={{ backgroundColor: "#74d25f" }} />
              </div>
              <div className="text ms-4 text-start">
                <h2 className="card-title mb-0 fw-bold">{summaryMetrics.totalVendorCount}</h2>
                <p>Transactions with Supplier</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="selection card p-3 shadow-sm mb-4">
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

          {/* Date Range */}
          <div className="col-md-3">
            <label className="form-label small text-muted">Start Date</label>
            <input type="date" className="form-control form-control-sm" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted">End Date</label>
            <input type="date" className="form-control form-control-sm" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </div>

          {/* Reporting Period */}
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

          {/* Amount Range */}
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

      {/* Table */}
      <div className="table-responsive mt-3 shadow-sm rounded">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : (
          <table className="table table-striped table-hover text-center align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3">Date of Transaction</th>
                <th className="py-3">Supplier Name</th>
                <th className="py-3">Department</th>
                <th className="py-3">Category</th>
                <th className="py-3">Reporting Year</th>
                <th className="py-3">Spend Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((transaction, index) => (
                  <tr key={transaction.id || index}>
                    <td>{new Date(transaction.dateOfTransaction).toLocaleDateString()}</td>
                    <td>{transaction.supplier?.name || "N/A"}</td>
                    <td>{transaction.department?.name || "N/A"}</td>
                    <td>{transaction.category?.name || "N/A"}</td>
                    <td>{transaction.year || new Date(transaction.dateOfTransaction).getFullYear()}</td>
                    <td className="fw-bold">${Number(transaction.amount).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="py-4 text-muted">No records found matching filters</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && paginatedData.length > 0 && (
        <nav aria-label="Page navigation" className="mt-4 pb-4">
          <ul className="pagination justify-content-center flex-wrap">
            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(pagination.currentPage - 1)}>Previous</button>
            </li>
            <li className="page-item disabled"><span className="page-link">Page {pagination.currentPage} of {totalPages}</span></li>
            <li className={`page-item ${pagination.currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(pagination.currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default SpendDetail;
