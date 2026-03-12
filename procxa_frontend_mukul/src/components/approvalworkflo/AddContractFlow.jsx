import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const CreateApprovalFlow = () => {
  const { post } = useApi();

  const initialDept = {
    type: "working",
    name: "",
    description: "",
    email: "",
    password: "",
    role: "",
  };

  const [formData, setFormData] = useState({
    departments: [],
  });

  const [loading, setLoading] = useState(false);

  const addDepartment = () => {
    setFormData((prev) => ({
      ...prev,
      departments: [...prev.departments, { ...initialDept }],
    }));
  };

  const removeDepartment = (index) => {
    const updated = [...formData.departments];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      departments: updated,
    }));
  };

  const handleDeptChange = (index, field, value) => {
    const updated = [...formData.departments];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      departments: updated,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const workingCount = formData.departments.filter((d) => d.type === "working").length;
    const procurementCount = formData.departments.filter((d) => d.type === "procurement").length;
    const supplierCount = formData.departments.filter((d) => d.type === "supplier").length;

    // Validation: Ensure at least 1 of each type is present
    if (workingCount < 1 || procurementCount < 1 || supplierCount < 1) {
      let message = "Please ensure the following minimum department requirements:\n";
      if (workingCount < 1) message += `- At least 1 working department (currently: ${workingCount})\n`;
      if (procurementCount < 1) message += `- At least 1 procurement department (currently: ${procurementCount})\n`;
      if (supplierCount < 1) message += `- At least 1 supplier department (currently: ${supplierCount})\n`;
      alert(message);
      return;
    }

    try {
      setLoading(true);
      const response = await post(endpoints.add_department_flow, formData);
      console.log("API Success:", response);

      if (response?.status) {
        alert("Approval workflow created successfully!");
        setFormData({ departments: [] });
        // Navigate to approval workflow page
        window.location.href = "/approvalwork";
      } else {
        alert(response?.message || "Failed to create workflow");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="row g-4 p-4 border rounded shadow-sm bg-white" onSubmit={onSubmit}>
      <h4 className="fw-bold text-center text-uppercase mb-4">Create Approval Workflow</h4>

      <div className="col-12">
        <h5 className="fw-bold text-primary mb-3">Departments</h5>

        {formData.departments.length === 0 && (
          <p className="text-muted">No departments added yet.</p>
        )}

        {formData.departments.map((dept, index) => (
          <div key={index} className="border rounded p-3 mb-4 bg-light">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Type</label>
                <select
                  className="form-select"
                  value={dept.type}
                  onChange={(e) => handleDeptChange(index, "type", e.target.value)}
                >
                  <option value="working">Working</option>
                  <option value="procurement">Procurement</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Department Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={dept.name}
                  onChange={(e) => handleDeptChange(index, "name", e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={dept.description}
                  onChange={(e) => handleDeptChange(index, "description", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={dept.email}
                  onChange={(e) => handleDeptChange(index, "email", e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={dept.password}
                  onChange={(e) => handleDeptChange(index, "password", e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={dept.role}
                  onChange={(e) => handleDeptChange(index, "role", e.target.value)}
                />
              </div>

              <div className="col-12 text-end">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeDepartment(index)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Department Button at the Bottom */}
        <div className="text-end mt-2">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={addDepartment}
          >
            ➕ Add Department
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-12 text-end">
        <button
          type="submit"
          className="btn btn-primary px-4"
          disabled={loading}
        >
          {loading ? "Submitting..." : "✅ Submit Workflow"}
        </button>
      </div>
    </form>
  );
};

export default CreateApprovalFlow;
