import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";
import { FaArrowLeft } from "react-icons/fa";

const MultiYearEdit = () => {
  const [formData, setFormData] = useState({
    supplierId: null,
    currentContractDuration: "",
    multiYearProposal: "",
    savingsEstimate: "",
    status: "Proposed",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" }); // Message state
  const navigate = useNavigate();
  const location = useLocation();
  const { get, post, patch } = useApi();

  // Extract 'id' from query params
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    fetchSuppliers();
    if (id) {
      fetchMultiYearData(id);
    }
  }, [id]);

  // Fetch suppliers for dropdown
  const fetchSuppliers = async () => {
    try {
      const response = await get(endpoints.getSuppliers);
      if (response.status) {
        setSuppliers(response.data);
      }
    } catch (error) {
      setMessage({ text: "Error fetching suppliers.", type: "error" });
      console.error("Error fetching suppliers:", error);
    }
  };

  // Fetch existing data if editing
  const fetchMultiYearData = async (id) => {
    try {
      const response = await get(`${endpoints.getMultiYearContractById}/${id}`);
      if (response.status) {
        setFormData({
          supplierId: response.data.supplierId || "",
          currentContractDuration: response.data.currentContractDuration || "",
          multiYearProposal: response.data.multiYearProposal || "",
          savingsEstimate: response.data.savingsEstimate || "",
          status: response.data.status || "Proposed",
        });
      }
    } catch (error) {
      setMessage({ text: error.message||"Error fetching multi-year data.", type: "error" });
      console.error("Error fetching multi-year data:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (id) {
        response = await patch(`${endpoints.updateMultiYearContract}/${id}`, formData);
      } else {
        response = await post(endpoints.addMultiYearContract, formData);
      }

      if (response.status) {
        setMessage({
          text: `${id ? response.message||"updated successfully!" : response.message||"added successfully!"} `,
          type: "success",
        });
      }
    } catch (error) {
      setMessage({ text: error.message||"Error saving data.", type: "error" });
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="multiyear-edit-section my-5">
      <div className="container">
        {/* Back Button */}
        <div className="d-flex justify-content-between align-items-center">
          <h3>{id ? "Edit" : "Add"} Multi-Year Proposal</h3>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            style={{ position: "absolute", top: "120px", right: "60px", backgroundColor: "#578E7E", border: "none", color: "white" }}

          >
           <FaArrowLeft className="me-2" />  Back
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            } mt-3`}
          >
            {message.text}
          </div>
        )}

        <form className="row g-3 mt-4" onSubmit={handleSubmit}>
          {/* Supplier Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Supplier</label>
            <select
              className="form-control"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Duration */}
          <div className="col-md-6">
            <label className="form-label">Current Contract Duration</label>
            <input
              type="text"
              className="form-control"
              name="currentContractDuration"
              value={formData.currentContractDuration}
              onChange={handleChange}
              placeholder="Enter duration"
              required
            />
          </div>

          {/* Multi-Year Proposal */}
          <div className="col-6">
            <label className="form-label">Multi-Year Proposal</label>
            <input
              type="text"
              className="form-control"
              name="multiYearProposal"
              value={formData.multiYearProposal}
              onChange={handleChange}
              placeholder="Enter the proposal"
              required
            />
          </div>

          {/* Savings Estimate */}
          <div className="col-md-6">
            <label className="form-label">Savings Estimate</label>
            <input
              type="text"
              className="form-control"
              name="savingsEstimate"
              value={formData.savingsEstimate}
              onChange={handleChange}
              placeholder="Enter estimated savings"
              required
            />
          </div>

          {/* Status Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Proposed">Proposed</option>
              <option value="Approved">Approved</option>
              <option value="Implemented">Implemented</option>
              <option value="Under Review">Under Review</option>

            </select>
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "#578e7e", color: "white" }}
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiYearEdit;
