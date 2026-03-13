import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const AddSupplier = () => {
  const { post, get, patch, del } = useApi();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    taxId: "",
    bankDetails: "",
    paymentTerms: "",
    perUnitPrice: "",
    maxUnitPurchase: "",
    discountPercent: "",
    status: "active",
    categoryId: "",
    subcategoryId: "",
    departmentId: "",
    deliveryTerms: "",
    additionalBenefits: "",
  });

  const [message, setMessage] = useState({});
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get(endpoints.getCategory);
        if (response) {
          const cats = response.categories || response.data || [];
          setCategories(cats);
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await get(endpoints.getAllDepartments);
        if (response) {
          const depts = response.data || [];
          setDepartments(depts);
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    };

    fetchCategories();
    fetchDepartments();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await get(endpoints.getSuppliers);
      if (response && response.data) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, categoryId: selectedCategory });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (isEditing) {
        response = await patch(`${endpoints.updateSupplier}/${editId}`, formData);
      } else {
        response = await post(endpoints.addSupplier, formData);
      }
      
      if (response && response.status) {
        setMessage({ type: "success", message: isEditing ? "Supplier updated successfully!" : "Supplier added successfully!" });
        
        setFormData({
          name: "",
          contactEmail: "",
          contactPhone: "",
          address: "",
          taxId: "",
          bankDetails: "",
          paymentTerms: "",
          perUnitPrice: "",
          maxUnitPurchase: "",
          discountPercent: "",
          status: "active",
          categoryId: "",
          departmentId: "",
          deliveryTerms: "",
          additionalBenefits: "",
        });
        setIsEditing(false);
        setEditId(null);
        fetchSuppliers();
      } else {
        setMessage({ type: "error", message: response?.message || "Failed to add supplier. Please try again." });
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      setMessage({ type: "error", message: error.message || "Failed to add supplier. Please try again." });
    }

    setTimeout(() => {
      setMessage({});
    }, 3000);
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || "",
      contactEmail: supplier.contactEmail || "",
      contactPhone: supplier.contactPhone || "",
      address: supplier.address || "",
      taxId: supplier.taxId || "",
      bankDetails: supplier.bankDetails || "",
      paymentTerms: supplier.paymentTerms || "",
      perUnitPrice: supplier.perUnitPrice || "",
      maxUnitPurchase: supplier.maxUnitPurchase || "",
      discountPercent: supplier.discountPercent || "",
      status: supplier.status || "active",
      categoryId: supplier.categoryId || "",
      departmentId: supplier.departmentId || "",
      deliveryTerms: supplier.deliveryTerms || "",
      additionalBenefits: supplier.additionalBenefits || "",
    });
    setEditId(supplier.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        const response = await del(`${endpoints.deleteSupplier}/${id}`);
        if (response && response.status) {
           setMessage({ type: "success", message: "Supplier deleted successfully!" });
           fetchSuppliers();
        } else {
           setMessage({ type: "error", message: response?.message || "Failed to delete supplier." });
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
        setMessage({ type: "error", message: "Error deleting supplier." });
      }
      setTimeout(() => setMessage({}), 3000);
    }
  };

  return (
    <div className="container mt-4 mb-5 px-2 px-md-4">
      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="mb-0 fw-bold" style={{ color: "#578E7E" }}>
          {isEditing ? "Update" : "Add"} Supplier
        </h2>
        <button 
          onClick={() => navigate(-1)} 
          className="btn text-white d-flex align-items-center gap-2"
          style={{ backgroundColor: "#578E7E", padding: "8px 20px", borderRadius: "8px", fontWeight: "600" }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      {message.message && (
        <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show mb-4 shadow-sm`} role="alert" style={{ borderRadius: "10px" }}>
          {message.message}
          <button type="button" className="btn-close" onClick={() => setMessage({})}></button>
        </div>
      )}

      {/* Form Card */}
      <div className="card border-0 shadow p-4 mb-5" style={{ borderRadius: "15px" }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Supplier Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control p-2" name="name" value={formData.name} onChange={handleChange} placeholder="Enter supplier name" required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Contact Email <span className="text-danger">*</span></label>
              <input type="email" className="form-control p-2" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Enter email address" required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Contact Phone</label>
              <input type="text" className="form-control p-2" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Enter phone number" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-select p-2" name="categoryId" value={formData.categoryId} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Department</label>
              <select className="form-select p-2" name="departmentId" value={formData.departmentId} onChange={handleChange}>
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select p-2" name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Address</label>
              <textarea className="form-control p-2" name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Full address details" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Per Unit Price</label>
              <input type="number" step="0.01" className="form-control p-2" name="perUnitPrice" value={formData.perUnitPrice} onChange={handleChange} placeholder="0.00" />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Max Unit Purchase for Discount</label>
              <input type="number" className="form-control p-2" name="maxUnitPurchase" value={formData.maxUnitPurchase} onChange={handleChange} placeholder="0" />
            </div>

            {formData.maxUnitPurchase && (
              <div className="col-md-6">
                <label className="form-label fw-semibold">Discount Percent (%)</label>
                <input type="number" step="0.01" className="form-control p-2" name="discountPercent" value={formData.discountPercent} onChange={handleChange} placeholder="0%" />
              </div>
            )}

            <div className="col-md-6">
              <label className="form-label fw-semibold">Delivery Terms</label>
              <input type="text" className="form-control p-2" name="deliveryTerms" value={formData.deliveryTerms} onChange={handleChange} placeholder="Terms for delivery" />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Additional Benefits</label>
              <textarea className="form-control p-2" name="additionalBenefits" value={formData.additionalBenefits} onChange={handleChange} rows="2" placeholder="Extra benefits provided" />
            </div>

            <div className="col-12 d-flex justify-content-center pt-3 gap-3">
              <button 
                type="submit" 
                className="btn px-5 py-2 text-white fw-bold rounded-pill shadow" 
                style={{ backgroundColor: "#578E7E", fontSize: "1rem" }}
              >
                <i className={isEditing ? "fa-solid fa-pen-to-square me-2" : "fa-solid fa-save me-2"}></i>
                {isEditing ? "Update Supplier" : "Save Supplier"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-outline-secondary px-5 py-2 fw-bold rounded-pill shadow-sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditId(null);
                    setFormData({
                      name: "", contactEmail: "", contactPhone: "", address: "", taxId: "",
                      bankDetails: "", paymentTerms: "", perUnitPrice: "", maxUnitPurchase: "",
                      discountPercent: "", status: "active", categoryId: "", departmentId: "",
                      deliveryTerms: "", additionalBenefits: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Supplier List Table */}
      <div className="card border-0 shadow p-4 overflow-hidden" style={{ borderRadius: "15px" }}>
        <h4 className="fw-bold mb-4" style={{ color: "#333" }}>Supplier Overview</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr style={{ color: "#578E7E" }}>
                <th>S.No</th>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{supplier.name}</td>
                  <td>{supplier.contactEmail}</td>
                  <td>{supplier.category?.name || "-"}</td>
                  <td>{supplier.department?.name || "-"}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 ${supplier.status === "active" ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.85rem" }}>
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleView(supplier)} title="View">
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(supplier)} title="Edit">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(supplier.id)} title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-muted py-5">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Supplier Modal */}
      {showViewModal && selectedSupplier && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: '#578E7E' }}>Supplier Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row g-4 px-3">
                  <div className="col-md-6"><small className="text-muted d-block">Name</small><strong className="fs-5">{selectedSupplier.name}</strong></div>
                  <div className="col-md-6"><small className="text-muted d-block">Email</small><strong>{selectedSupplier.contactEmail}</strong></div>
                  <div className="col-md-6"><small className="text-muted d-block">Phone</small><strong>{selectedSupplier.contactPhone || '-'}</strong></div>
                  <div className="col-md-6"><small className="text-muted d-block">Category</small><strong>{selectedSupplier.category?.name || '-'}</strong></div>
                  <div className="col-md-6"><small className="text-muted d-block">Department</small><strong>{selectedSupplier.department?.name || '-'}</strong></div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Status</small>
                    <span className={`badge rounded-pill px-3 mt-1 ${selectedSupplier.status === 'active' ? 'bg-success' : 'bg-danger'}`}>{selectedSupplier.status}</span>
                  </div>
                  <div className="col-12"><small className="text-muted d-block">Address</small><strong>{selectedSupplier.address || '-'}</strong></div>
                  <div className="col-md-4"><small className="text-muted d-block">Per Unit Price</small><strong>${selectedSupplier.perUnitPrice || '0'}</strong></div>
                  <div className="col-md-4"><small className="text-muted d-block">Max Unit Discount</small><strong>{selectedSupplier.maxUnitPurchase || '-'}</strong></div>
                  <div className="col-md-4"><small className="text-muted d-block">Discount %</small><strong>{selectedSupplier.discountPercent ? `${selectedSupplier.discountPercent}%` : '-'}</strong></div>
                  <div className="col-md-12"><small className="text-muted d-block">Delivery Terms</small><strong>{selectedSupplier.deliveryTerms || '-'}</strong></div>
                  <div className="col-12"><small className="text-muted d-block">Additional Benefits</small><strong>{selectedSupplier.additionalBenefits || '-'}</strong></div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSupplier;
