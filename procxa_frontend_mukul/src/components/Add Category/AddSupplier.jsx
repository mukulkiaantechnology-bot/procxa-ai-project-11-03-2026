import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const AddSupplier = () => {
  const { post, get } = useApi();
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
  const [subcategories, setSubcategories] = useState([]);
  const [departments, setDepartments] = useState([]);

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

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, categoryId: selectedCategory, subcategoryId: "" });

    if (selectedCategory) {
      try {
        const response = await get(`${endpoints.getSubCategory}?categoryId=${selectedCategory}`);
        if (response) {
          // Handle both response.subcategories and response.data
          const subcats = response.subcategories || response.data || [];
          setSubcategories(subcats);
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    } else {
      setSubcategories([]);
    }
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
      const response = await post(endpoints.addSupplier, formData);
      if (response && response.status) {
        setMessage({ type: "success", message: "Supplier added successfully!" });
        
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
          subcategoryId: "",
          departmentId: "",
          deliveryTerms: "",
          additionalBenefits: "",
        });
        setSubcategories([]);
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

                  {/* Subcategory */}
                  <div className="mb-3 col-md-6">
                    <label className="form-label fw-semibold">Subcategory</label>
                    <select
                      className="form-select"
                      name="subcategoryId"
                      value={formData.subcategoryId}
                      onChange={handleChange}
                      disabled={!formData.categoryId}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
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
                    <i className="fa-solid fa-save me-2"></i>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;
