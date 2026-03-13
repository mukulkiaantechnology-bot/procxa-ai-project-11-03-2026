import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get, del } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await get(endpoints.getAllDepartments);
      console.log("API Response:", response);
  
      if (response.status) {
        setDepartments(response.data);
      } else {
        setError(response.message || "Failed to fetch departments");
      }
    } catch (err) {
      setError("Error fetching departments");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await del(`${endpoints.deleteDepartment}/${id}`);
        if (response.status) {
          setDepartments(departments.filter((dept) => dept.id !== id));
          alert("Department deleted successfully");
        } else {
          alert(response.message || "Failed to delete department");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setError("Failed to delete department");
        alert("An error occurred while deleting the department");
      }
    }
  };

  const handleEdit = (dept) => {
    navigate(`/editDepartment/${dept.id}`);
  };

  return (
    <div className="container my-3 my-md-5">
      <div className="card shadow-lg p-3 p-md-4 rounded-3 border-0">
        <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
          <h4 className="card-title text-start mb-0" style={{ fontSize: "clamp(1.5rem, 4vw, 1.8rem)" }}>
            Department List
          </h4>
          <button 
            className="btn btn-outline-primary flex-shrink-0" 
            onClick={() => navigate(-1)}
            style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
          >
            ← Back
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading departments...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="table-responsive d-none d-md-block">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Permissions</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <tr key={dept.id}>
                        <td>{dept.name}</td>
                        <td>{dept.description}</td>
                        <td>{dept.email_id}</td>
                        <td>
                          <span className="badge bg-dark">
                            {dept.notEncryptPassword || "********"}
                          </span>
                        </td>
                        <td>
                          {Array.isArray(dept.permissions) && dept.permissions.length > 0
                            ? dept.permissions.map((perm) => perm.name || perm).join(", ")
                            : "No Permissions"}
                        </td>
                        <td>
                          <span className="badge bg-info">{dept.role || "Not Assigned"}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(dept)}
                              aria-label="Edit department"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(dept.id)}
                              aria-label="Delete department"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No departments available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="d-md-none">
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <div className="card mb-3 shadow-sm" key={dept.id}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{dept.name}</h5>
                        <div className="d-flex">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(dept)}
                            aria-label="Edit department"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(dept.id)}
                            aria-label="Delete department"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="card-text text-muted small mb-2">{dept.description}</p>
                      <div className="row mb-2">
                        <div className="col-6">
                          <p className="mb-1"><strong>Email:</strong></p>
                          <p className="text-truncate">{dept.email_id}</p>
                        </div>
                        <div className="col-6">
                          <p className="mb-1"><strong>Password:</strong></p>
                          <p><span className="badge bg-dark">
                            {dept.notEncryptPassword || "********"}
                          </span></p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <p className="mb-1"><strong>Permissions:</strong></p>
                          <p className="small">
                            {Array.isArray(dept.permissions) && dept.permissions.length > 0
                              ? dept.permissions.map((perm) => perm.name || perm).join(", ")
                              : "No Permissions"}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="mb-1"><strong>Role:</strong></p>
                          <p><span className="badge bg-info">{dept.role || "Not Assigned"}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  No departments available
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DepartmentList;