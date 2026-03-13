import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function AddTransaction() {
  const { get, post, patch, del } = useApi();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    dateOfTransaction: "",
    supplierId: "",
    departmentId: "",
    categoryId: "",
    amount: "",
    year: "",
    quarter: "",
    unit: ""
  });

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 7
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [viewTransaction, setViewTransaction] = useState(null);

  const fetchData = async () => {
    try {
      const [catRes, deptRes, suppRes] = await Promise.all([
        get(endpoints.getCategory),
        get(endpoints.getAllDepartments),
        get(endpoints.getSuppliers),
      ]);

      if (catRes?.categories) setCategories(catRes.categories);
      if (deptRes?.data) setDepartments(deptRes.data);
      if (suppRes?.data) setSuppliers(suppRes.data);
    } catch (error) {
      console.error("Error fetching dependencies:", error);
    }
  };

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await get(`${endpoints.getAllTransactions}?page=${page}&limit=7`);
      if (response.status) {
        setTransactions(response.data);
        setPagination(response.pagination);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      let response;
      if (editId) {
        response = await patch(`${endpoints.updateTransaction}/${editId}`, formData);
      } else {
        response = await post(endpoints.addTransaction, formData);
      }

      if (response.status) {
        setMessage({ text: response.message || "Success!", type: "success" });
        setFormData({
          dateOfTransaction: "",
          supplierId: "",
          departmentId: "",
          categoryId: "",
          amount: "",
          year: "",
          quarter: "",
          unit: ""
        });
        setEditId(null);
        fetchTransactions(pagination.currentPage);
      } else {
        setMessage({ text: response.message || "Failed.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: error.message || "Error occurred.", type: "error" });
    }
  };

  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    const dateStr = transaction.dateOfTransaction ? transaction.dateOfTransaction.split('T')[0] : "";
    setFormData({
      dateOfTransaction: dateStr,
      supplierId: transaction.supplierId,
      departmentId: transaction.departmentId,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      year: transaction.year,
      quarter: transaction.quarter,
      unit: transaction.unit || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const res = await del(`${endpoints.deleteTransaction}/${id}`);
        if (res.status) {
          setMessage({ text: "Deleted successfully", type: "success" });
          fetchTransactions(pagination.currentPage);
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <div className="container mt-4 px-2 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="mb-0 fw-bold" style={{ color: "#578E7E" }}>
          {editId ? "Update" : "Add"} Transaction
        </h2>
        <button 
          onClick={() => navigate(-1)} 
          className="btn text-white d-flex align-items-center gap-2"
          style={{ backgroundColor: "#578E7E", padding: "8px 20px", borderRadius: "5px" }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })}></button>
        </div>
      )}

      <div className="card border-0 shadow-sm p-4 mb-5" style={{ borderRadius: "15px" }}>
        <form className="row g-4" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Date of Transaction</label>
            <input type="date" className="form-control p-2" name="dateOfTransaction" value={formData.dateOfTransaction} onChange={handleChange} required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Supplier</label>
            <select className="form-select p-2" name="supplierId" value={formData.supplierId} onChange={handleChange} required>
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Department</label>
            <select className="form-select p-2" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Category</label>
            <select className="form-select p-2" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Year (YYYY-YY)</label>
            <input type="text" className="form-control p-2" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 2024-25" required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Quarter</label>
            <select className="form-select p-2" name="quarter" value={formData.quarter} onChange={handleChange} required>
              <option value="">Select Quarter</option>
              <option value="one">Q1</option>
              <option value="two">Q2</option>
              <option value="three">Q3</option>
              <option value="four">Q4</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Amount</label>
            <input type="number" className="form-control p-2" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" required />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Unit</label>
            <input type="number" className="form-control p-2" name="unit" value={formData.unit} onChange={handleChange} placeholder="0" required />
          </div>

          <div className="col-12 d-flex justify-content-center pt-3">
            <button type="submit" className="btn px-5 py-2 text-white fw-bold rounded-pill shadow" style={{ backgroundColor: "#578E7E", fontSize: "1rem" }}>
              {editId ? "Update Transaction" : "Save Transaction"}
            </button>
            {editId && (
              <button 
                type="button" 
                className="btn btn-outline-secondary px-5 py-2 fw-bold rounded-pill ms-3 shadow-sm"
                onClick={() => {
                  setEditId(null);
                  setFormData({ dateOfTransaction: "", supplierId: "", departmentId: "", categoryId: "", amount: "", year: "", quarter: "", unit: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card border-0 shadow-sm p-4 overflow-hidden" style={{ borderRadius: "15px" }}>
        <h4 className="fw-bold mb-4" style={{ color: "#333" }}>Transaction Activity</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr style={{ color: "#578E7E" }}>
                <th>Date</th>
                <th>Supplier</th>
                <th>Dept</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
              ) : transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.dateOfTransaction).toLocaleDateString()}</td>
                    <td>{suppliers.find(s => s.id == t.supplierId)?.name || "N/A"}</td>
                    <td>{departments.find(d => d.id == t.departmentId)?.name || "N/A"}</td>
                    <td>{categories.find(c => c.id == t.categoryId)?.name || "N/A"}</td>
                    <td className="fw-bold">${parseFloat(t.amount).toLocaleString()}</td>
                    <td>{t.year}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-success" onClick={() => setViewTransaction(t)} title="View">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(t)} title="Edit">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)} title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination mb-0">
              <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => fetchTransactions(pagination.currentPage - 1)}>Previous</button>
              </li>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" style={pagination.currentPage === i + 1 ? {backgroundColor: "#578E7E", borderColor: "#578E7E"} : {}} onClick={() => fetchTransactions(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => fetchTransactions(pagination.currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* View Transaction Modal */}
      {viewTransaction && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: '#578E7E' }}>Transaction Details</h5>
                <button type="button" className="btn-close" onClick={() => setViewTransaction(null)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row g-3">
                  <div className="col-6"><small className="text-muted d-block">Date</small><strong>{new Date(viewTransaction.dateOfTransaction).toLocaleDateString()}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Amount</small><strong className="text-success">${parseFloat(viewTransaction.amount).toLocaleString()}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Supplier</small><strong>{suppliers.find(s => s.id == viewTransaction.supplierId)?.name || "N/A"}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Department</small><strong>{departments.find(d => d.id == viewTransaction.departmentId)?.name || "N/A"}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Category</small><strong>{categories.find(c => c.id == viewTransaction.categoryId)?.name || "N/A"}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Year</small><strong>{viewTransaction.year}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Quarter</small><strong>{viewTransaction.quarter.toUpperCase()}</strong></div>
                  <div className="col-6"><small className="text-muted d-block">Unit</small><strong>{viewTransaction.unit || "0"}</strong></div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={() => setViewTransaction(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTransaction;
