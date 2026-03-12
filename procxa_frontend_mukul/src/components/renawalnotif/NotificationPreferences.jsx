// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import endpoints from "../../api/endPoints";
// import useApi from "../../hooks/useApi";

// const NotificationPreferences = () => {
//   const { get, post } = useApi();
//   const navigate = useNavigate();

//   // State Management - Simplified
//   const [remindBeforeDays, setRemindBeforeDays] = useState("");
//   const [contractId, setContractId] = useState("");
//   const [message, setMessage] = useState("");

//   // Fetch contract templates from API (if needed)
//   useEffect(() => {
//     // Can add API call here if needed in future
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const value = e.target.value;
//     // Ensure only positive numbers are allowed
//     if (/^\d*$/.test(value)) {
//       setRemindBeforeDays(value);
//     }
//   };

//   // Save preferences and send to API
//   const handleSave = async () => {
//     if (!remindBeforeDays) {
//       setMessage("Please enter renewal days!");
//       return;
//     }
//     if (!contractId) {
//       setMessage("Please enter Contract ID!");
//       return;
//     }

//     const payload = {
//       remindBeforeDays,
//       contractId
//     };

//     try {
//       await post(endpoints.addNotification, payload);
//       setMessage("Preferences Saved Successfully!");
//     } catch (error) {
//       console.error("Error saving preferences:", error);
//       setMessage("Error saving preferences, please try again.");
//     }
//   };

//   const handleEmailTemplateRedirect = () => {
//     navigate("/editrenewalnoti", {
//       state: {
//         remindBeforeDays
//       },
//     });
//   };

//   return (
//     <>
//       <style jsx>{`
//         .notification-container {
//           max-width: 800px;
//           margin: 0 auto;
//           padding: 20px;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }

//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           gap: 20px;
//         }

//         .noti-main-head {
//           flex: 1;
//           min-width: 250px;
//         }

//         .title {
//           font-size: clamp(1.5rem, 4vw, 2rem);
//           font-weight: 600;
//           color: #333;
//           margin: 0 0 10px 0;
//         }

//         .subtitle {
//           font-size: clamp(0.875rem, 2vw, 1rem);
//           color: #666;
//           margin: 0;
//         }

//         .email-template-btn {
//           background-color: #578e7e;
//           color: white;
//           border: none;
//           padding: 12px 20px;
//           border-radius: 6px;
//           font-weight: 500;
//           font-size: clamp(0.875rem, 2vw, 1rem);
//           cursor: pointer;
//           transition: all 0.3s ease;
//           white-space: nowrap;
//           text-decoration: none;
//           display: inline-block;
//         }

//         .email-template-btn:hover {
//           background-color: #467568;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 8px rgba(0,0,0,0.1);
//         }

//         .form {
//           background-color: #fff;
//           border-radius: 10px;
//           padding: 25px;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.05);
//         }

//         .form-group {
//           margin-bottom: 25px;
//         }

//         .form-label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 500;
//           color: #333;
//           font-size: clamp(0.875rem, 2vw, 1rem);
//         }

//         .form-control {
//           width: 100%;
//           padding: 12px 15px;
//           border: 1px solid #ddd;
//           border-radius: 6px;
//           font-size: clamp(0.875rem, 2vw, 1rem);
//           transition: border-color 0.3s;
//         }

//         .form-control:focus {
//           outline: none;
//           border-color: #578e7e;
//           box-shadow: 0 0 0 3px rgba(87, 142, 126, 0.2);
//         }

//         .message {
//           padding: 10px 15px;
//           border-radius: 6px;
//           margin-bottom: 20px;
//           font-size: clamp(0.875rem, 2vw, 1rem);
//         }

//         .notifi-button-group {
//           display: flex;
//           justify-content: flex-end;
//           gap: 15px;
//           margin-top: 30px;
//           flex-wrap: wrap;
//         }

//         .reset-button, .save-button {
//           padding: 12px 25px;
//           border: none;
//           border-radius: 6px;
//           font-weight: 500;
//           font-size: clamp(0.875rem, 2vw, 1rem);
//           cursor: pointer;
//           transition: all 0.3s ease;
//           min-width: 120px;
//         }

//         .reset-button {
//           background-color: #f8f9fa;
//           color: #333;
//           border: 1px solid #ddd;
//         }

//         .reset-button:hover {
//           background-color: #e9ecef;
//         }

//         .save-button {
//           background-color: #578e7e;
//           color: white;
//         }

//         .save-button:hover {
//           background-color: #467568;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 8px rgba(0,0,0,0.1);
//         }

//         /* Mobile Responsive Styles */
//         @media (max-width: 768px) {
//           .notification-container {
//             padding: 15px;
//           }

//           .header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 15px;
//           }

//           .email-template-btn {
//             width: 100%;
//             text-align: center;
//           }

//           .form {
//             padding: 20px 15px;
//           }

//           .notifi-button-group {
//             justify-content: center;
//             margin-top: 20px;
//           }

//           .reset-button, .save-button {
//             flex: 1;
//             min-width: 100px;
//           }
//         }

//         @media (max-width: 480px) {
//           .notification-container {
//             padding: 10px;
//           }

//           .form {
//             padding: 15px 10px;
//           }

//           .form-control {
//             padding: 10px 12px;
//           }

//           .reset-button, .save-button {
//             padding: 10px 20px;
//           }
//         }
//       `}</style>

//       <div className="notification-container">
//         <div className="header">
//           <div className="noti-main-head">
//             <h1 className="title">Set Your Notification Preferences</h1>
//             <p className="subtitle">
//               Customize when and how you want to receive renewal reminders
//             </p>
//           </div>
//           <Link to="/editrenewalnoti">
//             <button className="email-template-btn" onClick={handleEmailTemplateRedirect}>Email Template →</button>
//           </Link>
//         </div>

//         {message && <div className="message" style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</div>}

//         <div className="form">
//           {/* Contract ID Field */}
//           <div className="form-group">
//             <label className="form-label">Contract ID</label>
//             <input
//               type="text"
//               className="form-control"
//               value={contractId}
//               onChange={(e) => setContractId(e.target.value)}
//               placeholder="Enter Contract ID"
//             />
//           </div>
//           {/* Simple Form with Just One Field */}
//           <div className="form-group">
//             <label className="form-label">Remind me before renewal</label>
//             <input
//               type="number"
//               className="form-control"
//               value={remindBeforeDays}
//               onChange={handleChange}
//               placeholder="Enter days (e.g., 180)"
//               min="1"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="notifi-button-group">
//             <button className="reset-button" onClick={() => {
//               setRemindBeforeDays("");
//               setContractId("");
//               setMessage("");
//             }}>
//               RESET
//             </button>
//             <button className="save-button" onClick={handleSave}>
//               SAVE
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationPreferences;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const NotificationPreferences = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();

  // State Management
  const [contracts, setContracts] = useState([]);
  const [contractId, setContractId] = useState("");
  const [emailRecipients, setEmailRecipients] = useState("");
  const [reminderSchedule, setReminderSchedule] = useState({
    30: false,
    60: false,
    90: false
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await get(endpoints.getAllContracts);
        if (res?.data) {
          setContracts(res.data);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
    fetchContracts();
  }, []);

  // Handle Checkbox Change
  const handleCheckboxChange = (day) => {
    setReminderSchedule(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Save preferences and send to API
  const handleSave = async () => {
    if (!contractId) {
      setMessage("Please select a Contract!");
      return;
    }

    // Get selected days
    const selectedDays = Object.keys(reminderSchedule)
      .filter(day => reminderSchedule[day])
      .map(Number);

    const payload = {
      contractId,
      emailRecipients,
      reminderSchedule: selectedDays
    };

    try {
      await post(endpoints.addNotification, payload);
      setMessage("Preferences Saved Successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Error saving preferences, please try again.");
    }
  };

  const selectedContract = contracts.find(c => c.id.toString() === contractId.toString());

  return (
    <>
      <style jsx>{`
        .notification-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
        }
        
        .subtitle {
          color: #666;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
        }

        .form-card {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .summary-card {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #e9ecef;
          height: fit-content;
        }

        .form-group {
          margin-bottom: 25px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }

        .checkbox-group {
          display: flex;
          gap: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .save-button {
          background-color: #578e7e;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          font-weight: 500;
          transition: background 0.2s;
        }

        .save-button:hover {
          background-color: #467568;
        }

        .summary-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
          border-bottom: 2px solid #578e7e;
          padding-bottom: 10px;
          display: inline-block;
        }

        .summary-item {
          margin-bottom: 15px;
        }

        .summary-label {
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .summary-value {
          font-weight: 500;
          color: #333;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="notification-container">
        <div className="header">
          <div>
            <h1 className="title">Preferences</h1>
            <p className="subtitle">Configure renewal alerts for your contracts</p>
          </div>
          <Link to="/editrenewalnoti" className="btn btn-outline-secondary">
            Edit Email Template
          </Link>
        </div>

        {message && (
          <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"} mb-4`}>
            {message}
          </div>
        )}

        <div className="content-grid">
          {/* Main Configuration Form */}
          <div className="form-card">
            <h3 className="mb-4">Configuration</h3>

            <div className="form-group">
              <label className="form-label">Link to Contract <span className="text-danger">*</span></label>
              <select
                className="form-control"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
              >
                <option value="">Select a Contract</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>{c.contractName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Recipients</label>
              <input
                type="text"
                className="form-control"
                placeholder="email1@example.com, email2@example.com"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
              />
              <small className="text-muted">Separate multiple emails with commas</small>
            </div>

            <div className="form-group">
              <label className="form-label">Reminder Schedule <span className="text-danger">*</span></label>
              <div className="checkbox-group">
                {[30, 60, 90].map(days => (
                  <label key={days} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reminderSchedule[days]}
                      onChange={() => handleCheckboxChange(days)}
                    />
                    {days} Days
                  </label>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="save-button" onClick={handleSave}>
                Save Preferences
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="summary-card">
            <h3 className="summary-title">Renewal Summary</h3>

            <div className="summary-item">
              <div className="summary-label">Linked Contract</div>
              <div className="summary-value">
                {selectedContract ? selectedContract.contractName : <span className="text-muted fst-italic">No Contract Selected</span>}
              </div>
            </div>

            {selectedContract && (
              <div className="summary-item">
                <div className="summary-label">Expiry Date</div>
                <div className="summary-value">
                  {selectedContract.endDate ? new Date(selectedContract.endDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            )}

            <div className="summary-item">
              <div className="summary-label">Recipients</div>
              <div className="summary-value">
                {emailRecipients ? emailRecipients.split(',').length : 0} Recipients
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-label">Schedule</div>
              <div className="summary-value">
                {Object.keys(reminderSchedule).filter(d => reminderSchedule[d]).length > 0
                  ? Object.keys(reminderSchedule).filter(d => reminderSchedule[d]).map(d => `${d} Days`).join(', ')
                  : <span className="text-muted">None selected</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPreferences;