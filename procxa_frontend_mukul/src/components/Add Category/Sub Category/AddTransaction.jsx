import React, { useState, useEffect } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function AddTransaction() {
  const { get, post } = useApi();
  const [formData, setFormData] = useState({
    dateOfTransaction: "",
    supplierId: "",
    departmentId: "",
    categoryId: "",
    subcategoryId: "", // Added subcategory field
    amount: "",
    year: "",
    quarter: "",
    unit: ""  // Added "unit" field
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch Categories, Departments, Suppliers, and Subcategories
  const fetchData = async () => {
  try {
    const [
      categoryResponse,
      departmentResponse,
      supplierResponse
    ] = await Promise.all([
      get(endpoints.getCategory),
      get(endpoints.getAllDepartments),
      get(endpoints.getSuppliers),
    ]);

    if (categoryResponse?.categories) {
      setCategories(categoryResponse.categories);
    }

    if (departmentResponse?.data) {
      setDepartments(departmentResponse.data);
    }

    if (supplierResponse?.data) {
      setSuppliers(supplierResponse.data);
    }

    // ⚠️ subcategories yahan nahi aayengi
    setSubcategories([]);
  } catch (error) {
    console.error("Error fetching data:", error);
    setMessage(error.message || "Error fetching data.");
    setMessageType("error");
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleChange = async (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
    ...(name === "categoryId" ? { subcategoryId: "" } : {}),
  }));

  // 🔥 category change par subcategory fetch karo
  if (name === "categoryId" && value) {
    try {
      const res = await get(
        `${endpoints.getSubCategory}?categoryId=${value}`
      );
      setSubcategories(res?.subcategories || []);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setSubcategories([]);
    }
  }

  // agar category clear ho to subcategory bhi clear
  if (name === "categoryId" && !value) {
    setSubcategories([]);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await post(endpoints.addTransaction, formData);
      if (response.status) {
        setMessage(response.message || "Transaction added successfully!");
        setMessageType("success");
        setFormData({
          dateOfTransaction: "",
          supplierId: "",
          departmentId: "",
          categoryId: "",
          subcategoryId: "", // Reset subcategory
          amount: "",
          year: "",
          quarter: "",
          unit: ""  // Reset "unit" field
        });
      } else {
        setMessage(response.message || "Failed to add transaction. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setMessage(error.message || "Error submitting transaction.");
      setMessageType("error");
    }
  };

  return (
    <div>
      <div className="addtrans-section my-5">
        <div className="container">
          <h3>Add Transaction</h3>
          {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}>
              {message}
            </div>
          )}
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="dateOfTransaction" className="form-label">Date of Transaction</label>
              <input type="date" className="form-control" id="dateOfTransaction" name="dateOfTransaction" value={formData.dateOfTransaction} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label htmlFor="supplierId" className="form-label">Supplier</label>
              <select className="form-control" id="supplierId" name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="departmentId" className="form-label">Department</label>
              <select className="form-control" id="departmentId" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* <div className="col-md-6">
              <label htmlFor="categoryId" className="form-label">Category</label>
              <select className="form-control" id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="subcategoryId" className="form-label">Subcategory</label>
              <select className="form-control" id="subcategoryId" name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} required>
                <option value="">Select Subcategory</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                ))}
              </select>
            </div> */}

            <div className="col-md-6">
  <label htmlFor="categoryId" className="form-label">Category</label>
  <select
    className="form-control"
    id="categoryId"
    name="categoryId"
    value={formData.categoryId}
    onChange={handleChange}
    required
  >
    <option value="">Select Category</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

<div className="col-md-6">
  <label htmlFor="subcategoryId" className="form-label">Subcategory</label>
  <select
    className="form-control"
    id="subcategoryId"
    name="subcategoryId"
    value={formData.subcategoryId}
    onChange={handleChange}
    required
    disabled={!formData.categoryId}   // 🔥 important
  >
    <option value="">Select Subcategory</option>
    {subcategories.map((subcat) => (
      <option key={subcat.id} value={subcat.id}>
        {subcat.name}
      </option>
    ))}
  </select>
</div>

            <div className="col-md-6">
              <label htmlFor="year" className="form-label">Year (YYYY-YY)</label>
              <input 
                type="text" 
                className="form-control" 
                id="year" 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                placeholder="e.g., 2024-25"
                required 
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="quarter" className="form-label">Quarter</label>
              <input 
                type="text" 
                className="form-control" 
                id="quarter" 
                name="quarter" 
                value={formData.quarter} 
                onChange={handleChange} 
                placeholder="e.g., one, two, three, four" 
                required 
              />
            </div>

            <div className="col-6">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input type="number" className="form-control" id="amount" name="amount" value={formData.amount} onChange={handleChange} required />
            </div>

            <div className="col-6">
              <label htmlFor="unit" className="form-label">Unit</label>
              <input type="text" className="form-control" id="unit" name="unit" value={formData.unit} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <button type="submit" className="btn" style={{ backgroundColor: "#578e7e", color: "white" }}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
