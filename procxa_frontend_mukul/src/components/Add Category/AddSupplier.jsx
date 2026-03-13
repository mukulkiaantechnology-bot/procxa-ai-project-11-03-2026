import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const AddSupplier = () => {
  const { post, get, patch, del } = useApi();
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
          // Handle both response.categories and response.data
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
        
        // Reset form
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
        fetchSuppliers(); // Refresh list
      } else {
        setMessage({ type: "error", message: response?.message || "Failed to add supplier. Please try again." });
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      setMessage({ type: "error", message: error.message || "Failed to add supplier. Please try again." });
    }

    // Clear message after 3 seconds
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
        const response = await del(`${endpoints.deleteSupplier || '/procxa/delete_supplier'}/${id}`);
        
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
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-9">
          <div className="card shadow">
            <div className="card-header bg-light">
              <h4 className="text-center mb-0 py-2">Add Supplier</h4>
            </div>
            <div className="card-body p-4">
              {message.message && (
                <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`} role="alert">
                  {message.message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage({})}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Supplier Name */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Supplier Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Contact Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Contact Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Category */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>



                  {/* Department */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Department</label>
                    <select
                      className="form-select"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="mb-3 col-md-12">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  {/* Per Unit Price */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Per Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="perUnitPrice"
                      value={formData.perUnitPrice}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Max Unit Purchase */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Max Unit Purchase for Discount</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxUnitPurchase"
                      value={formData.maxUnitPurchase}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Discount Percent */}
                  {formData.maxUnitPurchase && (
                    <div className="mb-3 col-md-6">
                      <label className="form-label fw-semibold">Discount Percent (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {/* Delivery Terms */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Delivery Terms</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deliveryTerms"
                      value={formData.deliveryTerms}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Additional Benefits */}
                  <div className="mb-3 col-md-12">
                    <label className="form-label fw-semibold">Additional Benefits</label>
                    <textarea
                      className="form-control"
                      name="additionalBenefits"
                      value={formData.additionalBenefits}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    style={{ backgroundColor: "#578e7e", border: "none" }}
                  >
                    <i className={isEditing ? "fa-solid fa-pen me-2" : "fa-solid fa-save me-2"}></i>
                    {isEditing ? "Update" : "Submit"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-secondary px-5 ms-3"
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
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier List Table */}
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-lg-10 col-xl-11">
          <div className="card shadow">
            <div className="card-header bg-light">
              <h4 className="text-center mb-0 py-2">Supplier Overview</h4>
            </div>
            <div className="card-body p-4 table-responsive">
              <table className="table table-hover table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
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
                      <td>{supplier.name}</td>
                      <td>{supplier.contactEmail}</td>
                      <td>{supplier.category?.name || "-"}</td>
                      <td>{supplier.department?.name || "-"}</td>
                      <td>
                        <span className={`badge ${supplier.status === "active" ? "bg-success" : "bg-danger"}`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => handleView(supplier)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(supplier)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-muted py-4">No suppliers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* View Supplier Modal */}
      {showViewModal && selectedSupplier && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Supplier Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Name:</strong> <span className="text-muted">{selectedSupplier.name}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Email:</strong> <span className="text-muted">{selectedSupplier.contactEmail}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Phone:</strong> <span className="text-muted">{selectedSupplier.contactPhone || '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Category:</strong> <span className="text-muted">{selectedSupplier.category?.name || '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Department:</strong> <span className="text-muted">{selectedSupplier.department?.name || '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Status:</strong> <span className={`badge ${selectedSupplier.status === 'active' ? 'bg-success' : 'bg-danger'}`}>{selectedSupplier.status}</span>
                  </div>
                  <div className="col-md-12 mb-3">
                    <strong>Address:</strong> <span className="text-muted">{selectedSupplier.address || '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Per Unit Price:</strong> <span className="text-muted">{selectedSupplier.perUnitPrice || '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Max Unit Purchase:</strong> <span className="text-muted">{selectedSupplier.maxUnitPurchase || '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Discount Percent:</strong> <span className="text-muted">{selectedSupplier.discountPercent ? `${selectedSupplier.discountPercent}%` : '-'}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Delivery Terms:</strong> <span className="text-muted">{selectedSupplier.deliveryTerms || '-'}</span>
                  </div>
                  <div className="col-md-12 mb-3">
                    <strong>Additional Benefits:</strong> <span className="text-muted">{selectedSupplier.additionalBenefits || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddSupplier;
