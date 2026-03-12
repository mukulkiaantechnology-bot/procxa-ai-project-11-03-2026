import React, { useState, useEffect } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function SowEditPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate(); // To navigate back

  const [formData, setFormData] = useState({
    requestedTeamDepartmentId: "",
    requestedServiceTool: "",
    existingSupplierServiceId: "",
    consolidationSavings: "",
    status: "Pending", // Default status
  });

  const { get, post, patch } = useApi(); // Added 'put' for updating
  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    type: "", // "success" or "error"
  });

  // Fetch departments, services, and suppliers when the component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await get(endpoints.getAllDepartments);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await get(endpoints.getSuppliers);
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    if (id) {
      const fetchData = async () => {
        try {
          const response = await get(`${endpoints.getSowConsolidationsById}/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching Sow details:", error);
        }
      };
      fetchData();
    }

    fetchDepartments();
    fetchSuppliers();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission (add or update based on id)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (id) {
        // Update API call if id exists
        response = await patch(`${endpoints.updateSowConsolidations}/${id}`, formData);
      } else {
        // Create new if id doesn't exist
        response = await post(endpoints.addServiceSowConsolidation, formData);
      }

      if (response.status) {
        setMessage({
          text: id ?response.message|| "Data updated successfully!" : "Data submitted successfully!",
          type: "success",
        });

        // Navigate back after success
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        text: error.message|| "An error occurred while submitting the data.",
        type: "error",
      });
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div>
      <div className="sowedit-section my-5">
        <div className="container">
          <div className="d-flex justify-content-between">
            <h3>{id ? "Edit Service And SOW" : "Add Service And SOW"}</h3>
            <button
              className="btn"
              onClick={handleBack}
              style={{ position: "absolute", top: "120px", right: "60px", backgroundColor: "#578E7E", border: "none", color: "white" }}
            >
              <FaArrowLeft className="me-2" /> Back
            </button>
          </div>

          {/* Display message */}
          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
              {message.text}
            </div>
          )}

          <form className="row g-3 mt-4" onSubmit={handleSubmit}>
            {/* Department Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select name="requestedTeamDepartmentId" value={formData.requestedTeamDepartmentId} onChange={handleChange} className="form-control">
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Requested Service/Tool as Input */}
            <div className="col-md-6">
              <label className="form-label">Requested Service/Tool</label>
              <input type="text" name="requestedServiceTool" value={formData.requestedServiceTool} onChange={handleChange} className="form-control" placeholder="Enter Service/Tool" />
            </div>

            {/* Existing Supplier Service Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Existing Suppliers Offering Similar Service</label>
              <select name="existingSupplierServiceId" value={formData.existingSupplierServiceId} onChange={handleChange} className="form-control">
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Consolidation Savings Input */}
            <div className="col-md-6">
              <label className="form-label">Savings from Consolidating Under an Existing Supplier</label>
              <input type="text" name="consolidationSavings" value={formData.consolidationSavings} onChange={handleChange} className="form-control" placeholder="Enter Consolidation Savings" />
            </div>

            {/* Status Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-control">
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
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
    </div>
  );
}

export default SowEditPage;
