import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useApi from "../../hooks/useApi"
import endpoints from "../../api/endPoints";
import CreatableSelect from "react-select/creatable";

const EditIntakeRequest = () => {
  const { get, patch } = useApi();
  const navigate = useNavigate();
  const { id } = useParams();

  const [message, setMessage] = useState({ type: "", text: "" });
  const [categories, setCategories] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [startDateFocus, setStartDateFocus] = useState(false);
  const [endDateFocus, setEndDateFocus] = useState(false);
  const [contractTemplates, setContractTemplates] = useState([]);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [categoryResponse, subCategoryResponse, departmentsResponse, supplierResponse, intakeResponse, templatesResponse] = await Promise.all([
        get(endpoints.getCategory).catch(() => null),

        get(endpoints.getAllDepartments).catch(() => null),
        get(endpoints.getSuppliers).catch(() => null),
        get(`${endpoints.getIntakeRequestById}/${id}`).catch(() => null),
        get(endpoints.getAllContractTemplates).catch(() => null),
      ]);

      if (categoryResponse?.categories) setCategories(categoryResponse.categories);

      if (departmentsResponse?.data) setDepartments(departmentsResponse.data);
      if (supplierResponse?.data) setSuppliers(supplierResponse.data);
      if (templatesResponse?.templates) setContractTemplates(templatesResponse.templates);
      if (intakeResponse?.data) {
        const data = intakeResponse.data;

        // Find the category object by name (if needed)
        const categoryMatch = categoryResponse?.categories?.find(
          (cat) => cat.name === data.category
        );

        setFormData({
          ...data,
          category: categoryMatch?.id || data.category, // Convert name to id if matched
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key] !== null && formData[key] !== undefined ? formData[key] : "";
      payload.append(key, value);
    });

    try {
      const response = await patch(`${endpoints.updateRequest}/${id}`, payload);
      setMessage({ type: "success", text: response.message });
      navigate("/intakemyrequ");
    } catch (error) {
      console.error("Error updating the request:", error);
      setMessage({ type: "error", text: error.message || "Failed to update the request." });
    }
  };
  const supplierOptions = suppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.contactEmail,
    supplier,
  }));
  const handleSupplierChange = (selectedOption) => {
    if (selectedOption?.supplier) {
      const { supplier } = selectedOption;
      setFormData({
        ...formData,
        supplierName: supplier.name,
        supplierEmail: supplier.contactEmail,
        supplierContact: supplier.contactPhone,
      });
    } else if (selectedOption) {
      setFormData({
        ...formData,
        supplierName: selectedOption.label,
        supplierEmail: "",
        supplierContact: "",
      });
    } else {
      setFormData({
        ...formData,
        supplierName: "",
        supplierEmail: "",
        supplierContact: "",
      });
    }
  };
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));


  return (
    <div className="container mt-5">
      {message.text && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
            }`}
        >
          {message.text}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h3 className="fw-bold" style={{ textAlign: 'start', margin: 0 }}>Edit Request</h3>

        </div>
        <div className="d-flex justify-content-end gap-2">
          <button
            style={{
              width: "120px",
              height: "49px", // Made height consistent with "My Request" button
              border: "none",
              backgroundColor: "#578E7E",
              color: "white",
              borderRadius: "5px",
              fontSize: '16px', // Consistent font size
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3 mt-5">
          <div className="col-md-3 mb-3">
            <select
              id="requestType"
              className="form-select p-3"
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Request Type</option>
              <option value="new_agreement">New Agreement</option>
              <option value="agreement">Agreement</option>
              <option value="amendment">Amendment</option>
              <option value="termination">Termination</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <select
              id="status"
              className="form-select p-3"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Request Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>




        {/* Category and Subcategory */}
        <h5 style={{ borderBottom: "1px solid black", textAlign: "start", marginBottom: "15px" }}>
          What is the category of your request?
        </h5>
        <div className="row mb-3">
          {/* Category */}
          <div className="col-md-4 mb-3">
            <CreatableSelect
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === formData.categoryId)}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  categoryId: selectedOption ? selectedOption.value : ""
                })
              }
              placeholder="Type or select category"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  padding: "6px 4px",
                  fontSize: "16px",
                  minHeight: '60px',
                  borderRadius: "0.375rem",
                  borderColor: "#ced4da",
                  cursor: "pointer",
                }),
              }}
            />
          </div>



          {/* Engagement Type */}
          <div className="col-md-4 mb-3">
            <select
              id="engagementType"
              name="engagementType"
              value={formData.engagementType}
              onChange={handleChange}
              className="form-select p-3"
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Engagement Type</option>
              <option value="new_supplier">New Supplier</option>
              <option value="old_supplier">Old/Onboarded Supplier</option>
            </select>
          </div>
        </div>

        {/* Request Details */}
        <h5 style={{ borderBottom: "1px solid black", textAlign: "start", marginBottom: "15px" }}>
          Request Details
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="itemDescription"
              name="itemDescription"
              placeholder="Item Description"
              value={formData.itemDescription}
              onChange={handleChange}
              className="form-control p-3"
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantity (for Goods)"
              value={formData.quantity}
              onChange={handleChange}
              className="form-control p-3"
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="Duration (for Services)"
              value={formData.duration}
              onChange={handleChange}
              className="form-control p-3"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <input
              type="text"
              id="executionTimeline"
              name="executionTimeline"
              placeholder="Execution Timeline"
              className="form-control p-3"
              value={formData.executionTimeline}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-4">
            <input
              type="text"
              id="reasonForEarlierExecution"
              name="reasonForEarlierExecution"
              placeholder="Reason for earlier execution (IF Services)"
              className="form-control p-3"
              value={formData.reasonForEarlierExecution}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <select
              id="amendmentType"
              name="amendmentType"
              className="form-select p-3"
              style={{ fontSize: '16px', fontFamily: 'inherit', color: 'gray' }}
              value={formData.amendmentType}
              onChange={handleChange}
            >
              <option value="">Select Amendment Type</option>
              <option value="amendment">Amendment</option>
              <option value="extension">Extension</option>
              <option value="renewal">Renewal</option>
              <option value="sow">SOW</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <input
              type={startDateFocus ? "date" : "text"}
              id="startDate"
              name="startDate"
              className="form-control p-3"
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Start Date"
              onFocus={() => setStartDateFocus(true)}
              onBlur={(e) => {
                if (!e.target.value) setStartDateFocus(false);
              }}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              type={endDateFocus ? "date" : "text"}
              id="endDate"
              name="endDate"
              className="form-control p-3"
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              value={formData.endDate}
              onChange={handleChange}
              placeholder="End Date"
              onFocus={() => setEndDateFocus(true)}
              onBlur={(e) => {
                if (!e.target.value) setEndDateFocus(false);
              }}
            />
          </div>
        </div>


        {/* Budget Information */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Budget Information
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="budgetCode"
              name="budgetCode"
              placeholder="Budget Code"
              className="form-control p-3"
              value={formData.budgetCode}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              id="requestedAmount"
              name="requestedAmount"
              placeholder="Requested Amount"
              className="form-control p-3"
              value={formData.requestedAmount}
              onChange={handleChange}
            />
          </div>
        </div>


        {/* Requester Information */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Requester Information
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="requesterName"
              name="requesterName"
              placeholder="Name"
              className="form-control p-3"
              value={formData.requesterName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <select
              id="requesterDepartmentId"
              className="form-select p-3"
              name="requesterDepartmentId"  // ✅ Correct name to match formData field
              value={formData.requesterDepartmentId}  // ✅ Correct value reference
              onChange={handleChange}
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Department</option>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Not Available</option>
              )}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="form-control p-3"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              placeholder="Contact Number"
              className="form-control p-3"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-8 mb-3">
            <input
              type="text"
              id="additionalDescription"
              name="additionalDescription"
              placeholder="Additional Description"
              className="form-control p-3"
              value={formData.additionalDescription}
              onChange={handleChange}
            />
          </div>
        </div>



        {/* Attachments */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Attachments
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label htmlFor="intakeAttachment" className="btn text-secondary w-100 p-3">
              <i className="fa-solid fa-file-import pe-2"></i>
              Click to Upload
              <input
                type="file"
                id="intakeAttachment"
                name="intakeAttachment"
                className="d-none"  // Hide the input
                onChange={(e) => handleFileChange(e)}  // Handle file change
              />
            </label>
          </div>
        </div>
        {/*Supplier Information */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Supplier Information
        </h5>
        <div className="row mb-3 align-items-end">
          <div className="col-md-4 mb-3">
            <label><strong>Supplier Name</strong></label>
            <CreatableSelect
              isClearable
              placeholder="Supplier name"
              options={supplierOptions}
              value={
                supplierOptions.find(option => option.value === formData.supplierEmail) ||
                (formData.supplierName ? { label: formData.supplierName, value: formData.supplierEmail || formData.supplierName } : null)
              }
              onChange={handleSupplierChange}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '60px',
                  borderColor: '#ced4da',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#86b7fe',
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 12px',
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: '56px',
                }),
              }}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label><strong>Supplier Email</strong></label>
            <input
              type="email"
              id="supplierEmail"
              name="supplierEmail"
              placeholder="Supplier Email"
              className="form-control p-3"
              value={formData.supplierEmail}
              onChange={(e) =>
                setFormData({ ...formData, supplierEmail: e.target.value })
              }
            />
          </div>

          <div className="col-md-4 mb-3">
            <label><strong>Supplier Contact</strong></label>
            <input
              type="text"
              id="supplierContact"
              name="supplierContact"
              placeholder="Supplier Contact"
              className="form-control p-3"
              value={formData.supplierContact}
              onChange={(e) =>
                setFormData({ ...formData, supplierContact: e.target.value })
              }
            />
          </div>
        </div>

        {/* Some More Information */}
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="involvesCloud"
            checked={formData.involvesCloud}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, involvesCloud: e.target.checked }))
            }
          />
          <label className="form-check-label" htmlFor="involvesCloud">
            Does it involve cloud?
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="shareInfo"
            checked={formData.shareCustomerOrEmployeeInfo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shareCustomerOrEmployeeInfo: e.target.checked,
              }))
            }
          />
          <label className="form-check-label" htmlFor="shareInfo">
            Does this contract need to share customer or employee information?
          </label>
        </div>




        {/* Buttons */}
        <div className="d-flex justify-content-center ">
          <button type="submit" className="btn " style={{ backgroundColor: '#578E7E', color: 'white', padding: '10px', width: '150px' }}>Save</button>
        </div>
      </form>
    </div>

  );
};

export default EditIntakeRequest;