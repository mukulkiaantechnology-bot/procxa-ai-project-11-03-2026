import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function AditionalEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id"); 

  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    supplierId: "",
    categoryId: "",
    productPurchased: "",
    complementaryService: "",
    cost: "",
    saving: "",
    status: "proposed",
  });
  const [message, setMessage] = useState({ message: "", type: "" });

  const { get, post, patch } = useApi(); 

  // Fetch suppliers and categories
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await get(endpoints.getSuppliers);
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await get(endpoints.getCategory);
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSuppliers();
    fetchCategories();
  }, []);

  // **If Editing, Fetch Existing Data**
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await get(`${endpoints.getComplementaryServiceById}/${id}`);
          if (response.status) {
            setFormData(response.data); 
          }
        } catch (error) {
          console.error("Error fetching service details:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submission (Both Add & Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (id) {
        // **If ID exists, Update Existing Record**
        response = await patch(`${endpoints.updateComplementaryService}/${id}`, formData);
      } else {
        // **If No ID, Add New Record**
        response = await post(endpoints.addComplementaryService, formData);
      }

      setMessage({
        message: response.message || (id ? "Updated successfully!" : "Added successfully!"),
        type: "success",
      });

      // Redirect after success
      setTimeout(() => {
        navigate("/additionalcomp"); 
      }, 1000);
    } catch (error) {
      console.error("Error saving complementary service:", error);
      setMessage({
        message: error.message || "Error saving service. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="priceeditcompr-section my-5">
      <div className="container">
        <h3>{id ? "Edit Additional Complementary Service" : "Add Additional Complementary Service"}</h3>

        {message.message && (
          <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
            {message.message}
          </div>
        )}

        <form className="row g-3 mt-5" onSubmit={handleSubmit}>
          {/* Supplier Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Supplier</label>
            <select className="form-control" name="supplierId" value={formData.supplierId} onChange={handleChange}>
              <option value="">Select Supplier</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select className="form-control" name="categoryId" value={formData.categoryId} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Other Fields */}
          <div className="col-md-6">
            <label className="form-label">Product Purchased</label>
            <input
              type="text"
              className="form-control"
              name="productPurchased"
              value={formData.productPurchased}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Complementary Service</label>
            <input
              type="text"
              className="form-control"
              name="complementaryService"
              value={formData.complementaryService}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Cost</label>
            <input type="text" className="form-control" name="cost" value={formData.cost} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Saving / Value-Added</label>
            <input type="text" className="form-control" name="saving" value={formData.saving} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
              <option value="proposed">Proposed</option>
              <option value="approved">Approved</option>
              <option value="implemented">Implemented</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn" style={{ backgroundColor: "#578e7e", color: "white" }}>
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AditionalEditPage;
