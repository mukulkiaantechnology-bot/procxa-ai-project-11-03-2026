import React, { useState } from "react";
import useApi from "../hooks/useApi";
import endpoints from "../api/endPoints";

const TrainAi = () => {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const { post } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct call to the new endpoint
      const response = await post(endpoints.updateApiKey, { apiKey });
      if (response.status) {
        setMessage("API Key updated successfully! Your bot is now smart.");
        setApiKey("");
      } else {
        setMessage("Failed to update API Key.");
      }
    } catch (error) {
      console.error("Error updating API key:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3>Train Your AI Agent</h3>
        <p className="text-muted">
          To make your chatbot significantly smarter, please provide your Google Gemini API Key.
          This key will be stored securely and used to power your assistant.
        </p>

        {message && <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label font-weight-bold">Google Gemini API Key</label>
            <input
              type="password"
              className="form-control"
              placeholder="Paste your API key here (starts with AIza...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <small className="form-text text-muted">
              Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Get one for free here</a>.
            </small>
          </div>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#578e7e", border: "none" }}>
            Save API Key
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainAi;
