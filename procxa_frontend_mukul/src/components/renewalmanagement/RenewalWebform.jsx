import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import { useLocation, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";


const RenewalWebform = () => {
  const { post, get } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);

  const [feedbackMessage, setFeedbackMessage] = useState({
    message: "",
    type: "",
  });

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const initialFormData = location.state || {};
  const [formData, setFormData] = useState({
    contractId: initialFormData.contractId || "",
    description: initialFormData.description || "",
    amendments: initialFormData.amendments || "",
    previousExpirationDate: initialFormData.previousExpirationDate || "",
    newExpirationDate: initialFormData.newExpirationDate || "",
    startDate: initialFormData.startDate || "",
    endDate: initialFormData.endDate || "",
    additionalNotes: initialFormData.additionalNotes || "",
    selectDepartment: initialFormData.selectDepartment || "",
    vendorName: "",
    contractPrice: "",
    addService: "",
    renewalAttachmentFile: null,
  });
  const handleSubmitForApproval = async () => {
    const formDataToSend = new FormData();

    // Append all regular fields to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Ensure attachmentFile is appended if it exists in formData
    if (formData.renewalAttachmentFile) {
      formDataToSend.append("renewalAttachmentFile", formData.renewalAttachmentFile);
      console.log("File appended:", formData.renewalAttachmentFile);
    }

    // Log FormData to check if the file is there
    formDataToSend.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await post(endpoints.addRenewalRequest, formDataToSend);

      if (response.status) {
        setFeedbackMessage({
          message: response.message || "Renewal request added successfully!",
          type: "success",
        });
      } else {
        setFeedbackMessage({
          message: response.message || "Failed to add renewal request.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFeedbackMessage({
        message: error.message || "Error submitting the form. Please try again.",
        type: "error",
      });
    }
  };
  const fetchSuppliers = async () => {
    try {
      const response = await get(endpoints.getSuppliers);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, renewalAttachmentFile: file });
      setImage(URL.createObjectURL(file));
    }
  };

  // Handle text content input
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  return (
    <div className="container">
      {feedbackMessage.message && (
        <div
          className={`alert ${feedbackMessage.type === "success" ? "alert-success" : "alert-danger"
            }`}
        >
          {feedbackMessage.message}
        </div>
      )}

      <h2 className="text-start mb-4">Renewal Webform with Document Preview</h2>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <button
          onClick={() => navigate(-1)} // Navigates one page back
          style={{
            width: "120px",
            height: "49px",
            border: "none",
            backgroundColor: "#578E7E",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      <div className="row">
        {/* Left Side - Form */}
        <div className="col-md-6 mt-3">
          <h4 className=""><u>Renewal Webform</u></h4>
          <form>
            <div className="mb-3 p-2">
              {suppliers && suppliers.length > 0 ? (
                <select className="form-select p-3" name="vendorName" value={formData.vendorName} onChange={handleChange}>
                  <option value="">Supplier Name</option>
                  {suppliers.map((supplier, index) => (
                    <option key={index} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No suppliers available</p> // Message when the suppliers array is empty
              )}
            </div>

            <div className="mb-3 p-2">
              <input type="text" className="form-control p-3" name="contractPrice"
                placeholder="Contract Price" value={formData.contractPrice} onChange={handleChange} />
            </div>

            <div className="mb-3 p-2">
              <input type="text" className="form-control p-3" name="contractPrice"
                placeholder="Contract Price" value={formData.contractPrice} onChange={handleChange} />
            </div>

            <div className="mb-3 p-2">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control p-3" name="startDate"
                value={formData.startDate} onChange={handleChange} />
            </div>

            <div className="mb-3 p-2">
              <label className="form-label">End Date</label>
              <input type="date" className="form-control p-3" name="endDate"
                value={formData.endDate} onChange={handleChange} />
            </div>

            <div className="mb-3 p-2">
              <label className="form-label">New Expiration Date</label>
              <input type="date" className="form-control p-3" name="newExpirationDate"
                value={formData.newExpirationDate} onChange={handleChange} />
            </div>
            <div className="mb-3 p-2">
              <input type="text" className="form-control p-3" name="addService"
                placeholder="Add Service" value={formData.addService} onChange={handleChange} />
            </div>

            <div className="mb-3 p-2">
              <textarea className="form-control p-3" name="additionalNotes"
                rows="4" placeholder="Additional Notes" value={formData.additionalNotes}
                onChange={handleChange}></textarea>
            </div>

            <div
              className="d-flex justify-content-center align-items-center flex-wrap"
              style={{ height: "100%" }}
            >
              <button
                type="button"
                style={{
                  width: "334px",
                  height: "42px",
                  borderRadius: "8px",
                  margin: "8px 12px",
                  backgroundColor: "#578E7E",
                  color: "white",
                  border: 'none'
                }}
              >
                Generate Document
              </button>
              <button
                type="button"
                style={{
                  width: "334px",
                  height: "42px",
                  borderRadius: "8px",
                  margin: "8px 12px",
                  backgroundColor: "#32E886",
                  color: "white",
                  border: 'none'
                }}
              >
                Download Document
              </button>
              <button
                onClick={handleSubmitForApproval}
                type="button"
                style={{
                  width: "334px",
                  height: "42px",
                  borderRadius: "8px",
                  margin: "8px 12px",
                  backgroundColor: "#0D99FF",
                  color: "white",
                  border: 'none'
                }}
              >
                Submit for Approval
              </button>
            </div>

          </form>
        </div>

        {/* Right Side - Document Preview */}
        <div className="col-md-6 mt-3">
          <h4>
            <u>Document Preview</u>
          </h4>
          <div
            className="border p-3 shadow-sm"
            style={{ height: "700px", overflowY: "scroll", position: "relative" }}
          >
            {image ? (
              <img
                src={image}
                alt="User Uploaded"
                className="img-fluid"
                style={{ width: "100%" }}
              />
            ) : (
              <div
                className="p-4 bg-white"
                style={{
                  minHeight: "100%",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#333",
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <div className="text-center mb-5">
                  <h3 className="fw-bold text-uppercase">Contract Renewal Agreement</h3>
                  <hr />
                </div>

                <p>This Contract Renewal Agreement is made as of <strong>{new Date().toLocaleDateString()}</strong>.</p>

                <p><strong>RECITALS:</strong></p>
                <ol>
                  <li>The parties entered into an agreement with <strong>{formData.vendorName || "[VENDOR NAME]"}</strong> on [ORIGINAL DATE].</li>
                  <li>The parties wish to renew the agreement and update certain terms.</li>
                </ol>

                <p><strong>TERMS OF RENEWAL:</strong></p>
                <div className="ms-4">
                  <p>1. <strong>Service:</strong> {formData.addService || "[SERVICE NAME]"}</p>
                  <p>2. <strong>Start Date:</strong> {formData.startDate || "[START DATE]"}</p>
                  <p>3. <strong>End Date:</strong> {formData.endDate || "[END DATE]"}</p>
                  <p>4. <strong>New Expiration Date:</strong> {formData.newExpirationDate || "[EXPIRATION DATE]"}</p>
                  <p>5. <strong>Renewal Price:</strong> {formData.contractPrice || "[PRICE]"}</p>
                  <p>6. <strong>Department:</strong> {formData.selectDepartment || "[DEPARTMENT]"}</p>
                </div>

                <p className="mt-4"><strong>ADDITIONAL NOTES:</strong></p>
                <p className="border p-2 bg-light">{formData.additionalNotes || "No additional notes provided."}</p>

                <div className="mt-5 pt-5 row">
                  <div className="col-6">
                    <div style={{ borderTop: "1px solid #000", width: "80%" }}></div>
                    <p className="small">Authorized Signature (Client)</p>
                  </div>
                  <div className="col-6">
                    <div style={{ borderTop: "1px solid #000", width: "80%" }}></div>
                    <p className="small">Authorized Signature (Vendor)</p>
                  </div>
                </div>

                <div className="mt-5 text-center text-muted small">
                  <p>This is a system-generated renewal preview.</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls to add content */}
          <div className="mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setContent("") || setImage(null)} // Reset content
            >
              Clear
            </button>
            <label className="btn btn-primary">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                name="renewalAttachmentFile"

              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalWebform;