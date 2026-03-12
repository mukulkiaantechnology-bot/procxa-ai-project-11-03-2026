import React from "react";
import { useNavigate } from "react-router-dom";

const CreateApprovalPrompt = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/createFlow"); 
  };

  return (
    <div
      style={{
        border: "2px dashed #ccc",
        borderRadius: "16px",
        padding: "50px",
        textAlign: "center",
        backgroundColor: "#fafafa",
        margin: "40px auto",
        maxWidth: "600px",
      }}
    >
      <div style={{ fontSize: "50px", marginBottom: "20px" }}>🛠️</div>
      <h2 style={{ marginBottom: "10px", fontWeight: "bold" }}>
        No Approval Workflow Yet
      </h2>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
        Start by creating your first approval workflow to streamline requests and approvals.
      </p>
      <button
        onClick={handleCreateClick}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ➕ Create Workflow
      </button>
    </div>
  );
};

export default CreateApprovalPrompt;
