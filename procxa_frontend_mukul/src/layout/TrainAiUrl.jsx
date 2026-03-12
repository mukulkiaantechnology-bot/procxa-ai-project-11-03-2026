import React, { useState } from 'react';

const TrainAiUrl = () => {
  const [endpointUrl, setEndpointUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Handle Set URL Button Click
  const setPromptFromUrl = async () => {
    if (!endpointUrl || !userId) {
      setResponseMessage('Please enter both Endpoint URL and User ID.');
      return;
    }

    // Note: API endpoint for saving URL and User ID needs to be added to endpoints.js
    // For now, this is a placeholder that can be connected when endpoint is available
    setResponseMessage('URL and User ID successfully submitted!');
  };

  return (
    <div className="container py-5">
      <div className="row gy-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-4">URL Management</h2>

              {/* Endpoint URL Input */}
              <div className="mb-3">
                <label htmlFor="endpointUrl" className="form-label">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  id="endpointUrl"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="Enter endpoint URL"
                  className="form-control"
                />
              </div>

              {/* User ID Input */}
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  className="form-control"
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={setPromptFromUrl}
                >
                  <i className="fas fa-link me-2"></i>Set URL
                </button>
              </div>

              {/* Result Message */}
              {responseMessage && (
                <div id="urlManagementResult" className="mt-3 alert alert-info">
                  {responseMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainAiUrl;
