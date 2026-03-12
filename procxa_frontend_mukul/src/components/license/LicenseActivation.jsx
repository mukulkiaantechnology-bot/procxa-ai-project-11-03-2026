import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import "./LicenseActivation.css";

const LicenseActivation = () => {
  const { post, get, loading } = useApi();
  const [licenseKey, setLicenseKey] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Check if user is admin
  const userType = localStorage.getItem("userType");
  const isAdmin = userType === "admin" || userType === "superadmin";

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Format input as user types: APP-XXXX-YYYY-ZZZZ
    let formatted = value.replace(/[^A-Z0-9]/g, "");
    if (formatted.length > 0 && !formatted.startsWith("APP")) {
      formatted = "APP" + formatted;
    }
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
    }
    if (formatted.length > 8) {
      formatted = formatted.slice(0, 8) + "-" + formatted.slice(8);
    }
    if (formatted.length > 13) {
      formatted = formatted.slice(0, 13) + "-" + formatted.slice(13);
    }
    if (formatted.length > 18) {
      formatted = formatted.slice(0, 18);
    }
    setLicenseKey(formatted);
    setMessage({ type: "", text: "" });
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Check if license is already assigned (from login response)
    const licenseAssigned = localStorage.getItem("licenseAssigned");
    if (licenseAssigned === "true") {
      setMessage({
        type: "success",
        text: "License is already assigned to your account. Redirecting...",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return;
    }

    // Validate format
    const licenseKeyPattern = /^APP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!licenseKeyPattern.test(licenseKey)) {
      setMessage({
        type: "error",
        text: "Please enter a valid license key format (APP-XXXX-YYYY-ZZZZ)",
      });
      return;
    }

    try {
      // Ensure licenseKey is properly formatted and not null
      const trimmedLicenseKey = licenseKey.trim().toUpperCase();
      
      if (!trimmedLicenseKey) {
        setMessage({
          type: "error",
          text: "License key cannot be empty",
        });
        return;
      }

      const response = await post(endpoints.activateLicense, {
        licenseKey: trimmedLicenseKey,
      });

      if (response?.status) {
        // Store license key in localStorage for future verification
        localStorage.setItem("licenseKey", trimmedLicenseKey);
        localStorage.setItem("licenseAssigned", "true");
        
        setMessage({
          type: "success",
          text: response.message || "License activated successfully! Reloading...",
        });
        // Reload app after 1.5 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Invalid or already used key",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to activate license. Please try again.",
      });
    }
  };

  const handleGenerateLicense = async () => {
    setIsGenerating(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await get(endpoints.generateLicense);

      if (response?.status && response?.license_key) {
        setLicenseKey(response.license_key);
        setMessage({
          type: "success",
          text: "License key generated! You can now activate it.",
        });
      } else {
        setMessage({
          type: "error",
          text: response?.message || "Failed to generate license key",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate license key. Admin access required.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="license-activation-container">
      <div className="license-activation-card">
        <div className="license-activation-header">
          <h2>License Activation Required</h2>
          <p>Please enter your license key to activate the application</p>
          {isAdmin && (
            <p style={{ marginTop: "10px", fontSize: "13px", color: "#667eea" }}>
              Admin: You can generate a new license key below
            </p>
          )}
        </div>

        <form onSubmit={handleActivate} className="license-activation-form">
          <div className="form-group">
            <label htmlFor="licenseKey">License Key</label>
            <input
              type="text"
              id="licenseKey"
              value={licenseKey}
              onChange={handleInputChange}
              placeholder="APP-XXXX-YYYY-ZZZZ"
              className="license-input"
              disabled={loading}
              autoFocus
            />
          </div>

          {message.text && (
            <div
              className={`message ${
                message.type === "success" ? "message-success" : "message-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={handleGenerateLicense}
              className="generate-button"
              disabled={isGenerating}
              style={{
                marginBottom: "10px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              }}
            >
              {isGenerating ? "Generating..." : "Generate New License Key (Admin)"}
            </button>
          )}

          <button
            type="submit"
            className="activate-button"
            disabled={loading || !licenseKey}
          >
            {loading ? "Activating..." : "Activate License"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LicenseActivation;

