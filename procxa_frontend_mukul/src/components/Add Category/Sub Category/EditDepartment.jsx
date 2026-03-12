import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, patch } = useApi();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    password: "",
    userType: "department",
    role: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const permissionsList = [
    { id: 1, name: "Dashboard", path: "/dashboard" },
    { id: 2, name: "Intake Management", path: "/intakemanagement" },
    { id: 3, name: "Contract Template", path: "/contracttemplate" },
    { id: 4, name: "Cost Saving Opportunities", path: "/volumedisc" },
    { id: 5, name: "Approval Workflow", path: "/approvalworkflow" },
    { id: 6, name: "Renewal Notifications", path: "/renewalnotifi" },
    { id: 7, name: "Renewal Management", path: "/renewalmanage" },
    { id: 8, name: "Contract Management", path: "/contractmanage" },
    { id: 9, name: "Department Management", path: "/viewdepartment" },
    { id: 10, name: "Supplier Performance", path: "/vendorper" },
    { id: 11, name: "Spend Analytics", path: "/spendanalyt" },
    { id: 12, name: "License Management", path: "/license-management" },
    { id: 13, name: "Inventory", path: "/inventory-management" },
    { id: 14, name: "Intelligent Insights", path: "/intelligent-insights" },
    { id: 15, name: "Add", path: "/addcategory" },
  ];

  useEffect(() => {
    fetchDepartmentDetails();
  }, []);

  const fetchDepartmentDetails = async () => {
    try {
      const response = await get(`${endpoints.getDepartmentById}/${id}`);
      if (response.status) {
        // Handle permissions which could be string array, comma-string, or object array
        let rawPermissions = response.data.permissions || [];
        if (typeof rawPermissions === "string") {
          rawPermissions = rawPermissions.split(",").map(p => p.trim());
        }

        const permissionIds = rawPermissions
          .map((perm) => {
            const permName = typeof perm === "object" ? perm.name : perm;
            const matchingPerm = permissionsList.find((p) => p.name === permName);
            return matchingPerm ? matchingPerm.id : null;
          })
          .filter(Boolean);

        setFormData({
          name: response.data.name || "",
          description: response.data.description || "",
          email: response.data.email_id || "",
          password: response.data.notEncryptPassword || "",
          userType: "department",
          role: response.data.role || "",
          permissions: permissionIds,
        });
      } else {
        setMessage({ type: "error", text: "Failed to load department details" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error fetching department details" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (permissionId) => {
    setFormData((prevData) => {
      const updatedPermissions = prevData.permissions.includes(permissionId)
        ? prevData.permissions.filter((id) => id !== permissionId)
        : [...prevData.permissions, permissionId];
      return { ...prevData, permissions: updatedPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const permissionsWithNames = formData.permissions.map(
        (id) => permissionsList.find((perm) => perm.id === id)?.name
      );

      const response = await patch(`${endpoints.updateDepartment}/${id}`, {
        ...formData,
        permissions: permissionsWithNames,
      });

      if (response.status) {
        setMessage({ type: "success", text: "Department updated successfully" });
        setTimeout(() => navigate("/viewdepartment"), 2000);
      } else {
        setMessage({ type: "error", text: response.message || "Failed to update department" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating department" });
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 rounded-3 border-0">
        <h3 className="card-title text-start mb-4" style={{ fontSize: "1.8rem" }}>
          Edit Department
        </h3>

        {message && (
          <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>
                Department Name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>
                Description
              </label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 position-relative">
              <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ fontSize: "1.2rem" }}>
                Role
              </label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <h5 className="fw-bold" style={{ fontSize: "1.4rem" }}>Permissions</h5>
              <div className="d-flex flex-wrap gap-3">
                {permissionsList.map((perm) => (
                  <div key={perm.id} className="card p-3 shadow-sm border-0" style={{ width: "18rem", fontSize: "1.2rem" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">{perm.name}</span>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`perm-${perm.id}`}
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => handlePermissionChange(perm.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-success px-4">Update</button>
              <button type="button" className="btn btn-secondary px-4" onClick={() => navigate(-1)}>Back</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditDepartment;
