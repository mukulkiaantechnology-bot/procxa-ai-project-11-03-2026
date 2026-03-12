import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import LicenseActivation from "./LicenseActivation";

/**
 * LicenseGuard Component
 * Checks if the software has a valid license before showing the app
 * Uses verify endpoint which checks: exists, is_active, not expired
 */
const LicenseGuard = ({ children }) => {
  const { post } = useApi();
  const location = useLocation();
  const [isLicenseValid, setIsLicenseValid] = useState(null); // null = checking, true = valid, false = invalid
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLicense = async () => {
      // Don't check license on login page
      if (location.pathname === "/") {
        setIsLicenseValid(true);
        setIsChecking(false);
        return;
      }

      // Check if user is SuperAdmin - SuperAdmin never needs license
      const userType = localStorage.getItem("userType");
      if (userType === "superadmin") {
        setIsLicenseValid(true);
        setIsChecking(false);
        return;
      }

      // For Admin users, check license via backend validate endpoint
      // (This uses the user's email from token, not localStorage licenseKey)
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setIsLicenseValid(true); // Let login page show
        setIsChecking(false);
        return;
      }

      // Check if license was already assigned during login
      const licenseAssigned = localStorage.getItem("licenseAssigned");
      if (licenseAssigned === "true") {
        // License is already assigned, skip validation and allow access
        setIsLicenseValid(true);
        setIsChecking(false);
        return;
      }

      try {
        // Use validate endpoint - checks license linked to user's email
        const response = await post(endpoints.validateLicense, {});

        if (response?.valid === true) {
          setIsLicenseValid(true);
          // Update localStorage flag for future checks
          localStorage.setItem("licenseAssigned", "true");
        } else {
          // License invalid, expired, or inactive
          setIsLicenseValid(false);
          localStorage.setItem("licenseAssigned", "false");
        }
      } catch (error) {
        // If validation fails, treat as invalid
        console.error("License validation error:", error);
        setIsLicenseValid(false);
        localStorage.setItem("licenseAssigned", "false");
      } finally {
        setIsChecking(false);
      }
    };

    checkLicense();
  }, [location.pathname, post]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          color: "white",
          fontSize: "18px",
          fontWeight: "500"
        }}>
          Checking license...
        </div>
      </div>
    );
  }

  // Show license activation screen if license is invalid
  if (isLicenseValid === false) {
    return <LicenseActivation />;
  }

  // Show main app if license is valid or on login page
  return children;
};

export default LicenseGuard;

