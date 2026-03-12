


// import React, { useState, useEffect } from "react";
// import useApi from "../../hooks/useApi";
// import endpoints from "../../api/endPoints";
// import { useNavigate } from "react-router-dom";

// const RenewalRequestForm = () => {
//   const navigate = useNavigate();
//   const { get, post } = useApi();

//   const [departments, setDepartments] = useState([]);
//   const [attachment, setAttachment] = useState(null);

//   const [formData, setFormData] = useState({
//     contractId: "",
//     description: "",
//     amendments: "",
//     previousExpirationDate: "",
//     newExpirationDate: "",
//     additionalNotes: "",
//     selectDepartment: "",
//   });

//   const [feedbackMessage, setFeedbackMessage] = useState({
//     message: "",
//     type: "",
//   });

//   /* ================= FETCH DEPARTMENTS ================= */
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await get(endpoints.getAllDepartments);
//         if (res?.data) {
//           setDepartments(res.data);
//         }
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   /* ================= INPUT HANDLER ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const payload = new FormData();

//     payload.append("contractId", formData.contractId);
//     payload.append("description", formData.description);
//     payload.append("amendments", formData.amendments);
//     payload.append("previousExpirationDate", formData.previousExpirationDate);
//     payload.append("newExpirationDate", formData.newExpirationDate);
//     payload.append("additionalNotes", formData.additionalNotes);
//     payload.append("selectDepartment", formData.selectDepartment);

//     // 🔥 EXACT FIELD NAME (MATCHES MULTER)
//     if (attachment) {
//       payload.append("renewalAttachmentFile", attachment);
//     }

//     try {
//       const response = await post(endpoints.addRenewalRequest, payload);

//       if (response?.status) {
//         setFeedbackMessage({
//           message: "Renewal request added successfully!",
//           type: "success",
//         });

//         setTimeout(() => navigate(-1), 1500);
//       } else {
//         setFeedbackMessage({
//           message: response?.message || "Failed to submit renewal request",
//           type: "error",
//         });
//       }
//     } catch (error) {
//       setFeedbackMessage({
//         message: "Error submitting the form",
//         type: "error",
//       });
//       console.error(error);
//     }
//   };

//   return (
//     <div className="container my-4">
//       {/* MESSAGE */}
//       {feedbackMessage.message && (
//         <div
//           className={`alert ${
//             feedbackMessage.type === "success"
//               ? "alert-success"
//               : "alert-danger"
//           }`}
//         >
//           {feedbackMessage.message}
//         </div>
//       )}

//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Renewal Request Form</h3>
//         <button
//           className="btn btn-secondary"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </button>
//       </div>

//       <form onSubmit={handleFormSubmit}>
//         <div className="row g-3">
//           {/* Contract ID */}
//           <div className="col-md-4">
//             <label className="form-label">Contract ID *</label>
//             <input
//               type="number"
//               className="form-control"
//               name="contractId"
//               value={formData.contractId}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {/* Description */}
//           <div className="col-md-4">
//             <label className="form-label">Description</label>
//             <input
//               type="text"
//               className="form-control"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* Amendments */}
//           <div className="col-md-4">
//             <label className="form-label">Amendments</label>
//             <input
//               type="text"
//               className="form-control"
//               name="amendments"
//               value={formData.amendments}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* Previous Date */}
//           <div className="col-md-4">
//             <label className="form-label">Previous Expiration Date *</label>
//             <input
//               type="date"
//               className="form-control"
//               name="previousExpirationDate"
//               value={formData.previousExpirationDate}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {/* New Date */}
//           <div className="col-md-4">
//             <label className="form-label">New Expiration Date *</label>
//             <input
//               type="date"
//               className="form-control"
//               name="newExpirationDate"
//               value={formData.newExpirationDate}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {/* Department */}
//           <div className="col-md-4">
//             <label className="form-label">Select Department *</label>
//             <select
//               className="form-select"
//               name="selectDepartment"
//               value={formData.selectDepartment}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept.id} value={dept.id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Additional Notes */}
//           <div className="col-md-12">
//             <label className="form-label">Additional Notes</label>
//             <input
//               type="text"
//               className="form-control"
//               name="additionalNotes"
//               value={formData.additionalNotes}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* FILE UPLOAD */}
//           <div className="col-md-6 mt-3">
//             <label className="form-label">Attachment</label>
//             <input
//               type="file"
//               name="renewalAttachmentFile"
//               className="form-control"
//               onChange={(e) => setAttachment(e.target.files[0])}
//             />
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="d-flex justify-content-end gap-3 mt-4">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="btn text-white"
//             style={{ backgroundColor: "#578e7e" }}
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RenewalRequestForm;


// import React, { useState, useEffect } from "react";
// import useApi from "../../hooks/useApi";
// import endpoints from "../../api/endPoints";
// import { useNavigate } from "react-router-dom";

// const RenewalRequestForm = () => {
//   const navigate = useNavigate();
//   const { get, post } = useApi();

//   const [contracts, setContracts] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [attachment, setAttachment] = useState(null);

//   const [formData, setFormData] = useState({
//     contractId: "",
//     description: "",
//     amendments: "",
//     previousExpirationDate: "",
//     newExpirationDate: "",
//     additionalNotes: "",
//     selectDepartment: "",
//   });

//   const [feedbackMessage, setFeedbackMessage] = useState({
//     message: "",
//     type: "",
//   });

//   /* ================= INITIAL contracts FETCH ================= */
//   useEffect(() => {
//     const fetchContracts = async () => {
//       try {
//         const res = await get(endpoints.getAllContracts);
//         if (res?.data) {
//            setContracts(res.data);
//         }
//       } catch (error) {
//         console.error("Error fetching contracts:", error);
//       }
//     };
//     fetchContracts();
//   }, []);

//   /* ================= FETCH DEPARTMENTS ================= */
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await get(endpoints.getAllDepartments);
//         if (res?.data) {
//           setDepartments(res.data);
//         }
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   /* ================= INPUT HANDLER ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const payload = new FormData();

//     payload.append("contractId", formData.contractId);
//     payload.append("description", formData.description);
//     payload.append("amendments", formData.amendments);
//     payload.append("previousExpirationDate", formData.previousExpirationDate);
//     payload.append("newExpirationDate", formData.newExpirationDate);
//     payload.append("additionalNotes", formData.additionalNotes);
//     payload.append("selectDepartment", formData.selectDepartment);

//     // 🔥 EXACT FIELD NAME (MATCHES MULTER)
//     if (attachment) {
//       payload.append("renewalAttachmentFile", attachment);
//     }

//     try {
//       const response = await post(endpoints.addRenewalRequest, payload);

//       if (response?.status) {
//         setFeedbackMessage({
//           message: "Renewal request added successfully!",
//           type: "success",
//         });

//         setTimeout(() => navigate(-1), 1500);
//       } else {
//         setFeedbackMessage({
//           message: response?.message || "Failed to submit renewal request",
//           type: "error",
//         });
//       }
//     } catch (error) {
//       setFeedbackMessage({
//         message: "Error submitting the form",
//         type: "error",
//       });
//       console.error(error);
//     }
//   };

//   return (
//     <div className="container my-4">
//       {/* MESSAGE */}
//       {feedbackMessage.message && (
//         <div
//           className={`alert ${
//             feedbackMessage.type === "success"
//               ? "alert-success"
//               : "alert-danger"
//           }`}
//         >
//           {feedbackMessage.message}
//         </div>
//       )}

//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Renewal Request Form</h3>
//         <button
//           className="btn btn-secondary"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </button>
//       </div>

//       <form onSubmit={handleFormSubmit}>
//         <div className="row g-3">

//           {/* Contract ID */}
//           <div className="col-md-4">
//             <label className="form-label">Contract ID *</label>
//             <select
//               className="form-select"
//               name="contractId"
//               value={formData.contractId}
//               onChange={handleInputChange}
//               required
//             >
//             <option value="">Select Contract</option>
//             {contracts.map((contract) => (
//               <option key={contract.id} value={contract.id}>
//                 {contract.contractName}
//               </option>
//             ))}
//             </select>
//           </div>

//             {/* Department */}
//           <div className="col-md-4">
//             <label className="form-label">Select Department *</label>
//             <select
//               className="form-select"
//               name="selectDepartment"
//               value={formData.selectDepartment}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept.id} value={dept.id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Description */}
//           <div className="col-md-4">
//             <label className="form-label">Description</label>
//             <input
//               type="text"
//               className="form-control"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* Amendments */}
//           <div className="col-md-4">
//             <label className="form-label">Amendments</label>
//             <input
//               type="text"
//               className="form-control"
//               name="amendments"
//               value={formData.amendments}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* Previous Date */}
//           <div className="col-md-4">
//             <label className="form-label">Previous Expiration Date *</label>
//             <input
//               type="date"
//               className="form-control"
//               name="previousExpirationDate"
//               value={formData.previousExpirationDate}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {/* New Date */}
//           <div className="col-md-4">
//             <label className="form-label">New Expiration Date *</label>
//             <input
//               type="date"
//               className="form-control"
//               name="newExpirationDate"
//               value={formData.newExpirationDate}
//               onChange={handleInputChange}
//               required
//             />
//           </div>



//           {/* Additional Notes */}
//           <div className="col-md-12">
//             <label className="form-label">Additional Notes</label>
//             <input
//               type="text"
//               className="form-control"
//               name="additionalNotes"
//               value={formData.additionalNotes}
//               onChange={handleInputChange}
//             />
//           </div>

//           {/* FILE UPLOAD */}
//           <div className="col-md-6 mt-3">
//             <label className="form-label">Attachment</label>
//             <input
//               type="file"
//               name="renewalAttachmentFile"
//               className="form-control"
//               onChange={(e) => setAttachment(e.target.files[0])}
//             />
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="d-flex justify-content-end gap-3 mt-4">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="btn text-white"
//             style={{ backgroundColor: "#578e7e" }}
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RenewalRequestForm;



import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { useNavigate } from "react-router-dom";

const RenewalRequestForm = () => {
  const navigate = useNavigate();
  const { get, post } = useApi();

  const [contracts, setContracts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attachment, setAttachment] = useState(null);

  const [formData, setFormData] = useState({
    contractId: "",
    description: "",
    amendments: "",
    previousExpirationDate: "",
    newExpirationDate: "",
    startDate: "",
    endDate: "",
    additionalNotes: "",
    selectDepartment: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState({
    message: "",
    type: "",
  });

  /* ================= INITIAL contracts FETCH ================= */
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await get(endpoints.getAllContracts);
        if (Array.isArray(res?.data)) {
          setContracts(res.data);
        } else if (Array.isArray(res)) {
          setContracts(res);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
    fetchContracts();
  }, []);

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await get(endpoints.getAllDepartments);
        if (Array.isArray(res?.data)) {
          setDepartments(res.data);
        } else if (Array.isArray(res)) {
          setDepartments(res);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("contractId", formData.contractId);
    payload.append("description", formData.description);
    payload.append("amendments", formData.amendments);
    payload.append("previousExpirationDate", formData.previousExpirationDate);
    payload.append("newExpirationDate", formData.newExpirationDate);
    payload.append("startDate", formData.startDate);
    payload.append("endDate", formData.endDate);
    payload.append("additionalNotes", formData.additionalNotes);
    payload.append("selectDepartment", formData.selectDepartment);

    if (attachment) {
      payload.append("renewalAttachmentFile", attachment);
    }

    try {
      const response = await post(endpoints.addRenewalRequest, payload);

      if (response && (response.status === true || response.success)) {
        setFeedbackMessage({
          message: "Renewal request added successfully!",
          type: "success",
        });
        setTimeout(() => navigate("/renewalmanage"), 1500); // ✅ Better than -1
      } else {
        setFeedbackMessage({
          message: response?.message || "Failed to submit renewal request",
          type: "error",
        });
      }
    } catch (error) {
      setFeedbackMessage({
        message: "Error submitting the form",
        type: "error",
      });
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="container my-4">
      {/* MESSAGE */}
      {feedbackMessage.message && (
        <div
          className={`alert ${feedbackMessage.type === "success"
            ? "alert-success"
            : "alert-danger"
            }`}
        >
          {feedbackMessage.message}
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Renewal Request Form</h3>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="row g-3">
          {/* Contract ID */}
          <div className="col-md-4">
            <label className="form-label">Contract ID *</label>
            <select
              className="form-select"
              name="contractId"
              value={formData.contractId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Contract</option>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.contractName || contract.contract_name || `Contract #${contract.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="col-md-4">
            <label className="form-label">Select Department *</label>
            <select
              className="form-select"
              name="selectDepartment"
              value={formData.selectDepartment}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-md-4">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Amendments */}
          <div className="col-md-4">
            <label className="form-label">Amendments</label>
            <input
              type="text"
              className="form-control"
              name="amendments"
              value={formData.amendments}
              onChange={handleInputChange}
            />
          </div>

          {/* Previous Date */}
          <div className="col-md-4">
            <label className="form-label">Previous Expiration Date *</label>
            <input
              type="date"
              className="form-control"
              name="previousExpirationDate"
              value={formData.previousExpirationDate}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Start Date */}
          {/* <div className="col-md-4">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div> */}

          {/* End Date */}
          {/* <div className="col-md-4">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div> */}

          {/* New Date */}
          <div className="col-md-4">
            <label className="form-label">New Expiration Date *</label>
            <input
              type="date"
              className="form-control"
              name="newExpirationDate"
              value={formData.newExpirationDate}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="col-md-12">
            <label className="form-label">Additional Notes</label>
            <input
              type="text"
              className="form-control"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
            />
          </div>

          {/* FILE UPLOAD */}
          <div className="col-md-6 mt-3">
            <label className="form-label">Attachment</label>
            <input
              type="file"
              name="renewalAttachmentFile"
              className="form-control"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-end gap-3 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn text-white"
            style={{ backgroundColor: "#578e7e" }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RenewalRequestForm;