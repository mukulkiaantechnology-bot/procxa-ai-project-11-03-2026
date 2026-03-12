// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import useApi from "../../hooks/useApi";
// import endpoints from "../../api/endPoints";

// // Custom Hook to get window width
// const useWindowWidth = () => {
//   const [width, setWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     // Cleanup function to remove the event listener
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return width;
// };

// const Renewalmanagedash = () => {
//   const { get } = useApi();
//   const [renewals, setRenewals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const windowWidth = useWindowWidth(); // Get window width
//   const isMobile = windowWidth < 768; // Define mobile breakpoint

//   useEffect(() => {
//     const fetchRenewals = async () => {
//       try {
//         const response = await get(endpoints.getAllRenewalRequests);
//         if (response.status) {
//           setRenewals(response.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching renewal data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRenewals();
//   }, []);

//   // Helper function to get status badge color
//   const getStatusBadge = (status) => {
//     const statusClass = status === "Approved" ? "bg-success" :
//                         status === "Closed" ? "bg-secondary" :
//                         status === "Rejected" ? "bg-danger" :
//                         "bg-warning";
//     return <span className={`badge ${statusClass}`}>{status || "Pending Renewal"}</span>;
//   };

//   // Mobile Card View Component
//   const MobileCardView = ({ renewal }) => (
//     <div className="card mb-3 shadow-sm">
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <h6 className="card-title fw-bold mb-0">
//             {renewal.contractName || renewal.description || "Renewal Request"}
//           </h6>
//           {getStatusBadge(renewal.status)}
//         </div>
//         <p className="card-text small text-muted mb-2">
//           Contract ID: {renewal.contractId || `CNT-${String(renewal.id).padStart(6, '0')}`}
//         </p>
//         <p className="card-text small mb-1">
//           <strong>Supplier:</strong> {renewal.supplierName || "N/A"}
//         </p>
//         <p className="card-text small mb-1">
//           <strong>Type:</strong> {renewal.contract?.contractTypeId || renewal.contract?.type || "N/A"}
//         </p>
//         <p className="card-text small mb-1">
//           <strong>Expiry Date:</strong> {
//             renewal.previousExpirationDate 
//               ? new Date(renewal.previousExpirationDate).toLocaleDateString()
//               : renewal.currentEndDate
//               ? new Date(renewal.currentEndDate).toLocaleDateString()
//               : "N/A"
//           }
//         </p>
//         <p className="card-text small mb-3">
//           <strong>Renewal Date:</strong> {
//             renewal.newExpirationDate 
//               ? new Date(renewal.newExpirationDate).toLocaleDateString()
//               : renewal.renewalDate
//               ? new Date(renewal.renewalDate).toLocaleDateString()
//               : "N/A"
//           }
//         </p>
//         {renewal.status !== "Closed" && (
//           <Link to="/renewalform" state={renewal} className="btn btn-sm btn-primary w-100" style={{ backgroundColor: "#578e7e", border: "none" }}>
//             Renew
//           </Link>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="container mt-4">
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-center mb-4 gap-3">
//         <h3 className="fw-bold mb-0">Renewals Dashboard</h3>
//         <Link to="/
// ">
//           <button 
//             className="btn btn-primary" 
//             style={{ backgroundColor: "#578e7e", border: "none" }}
//             data-bs-placement="top" 
//             title="Renewal Form"
//           >
//             <i className="fa-solid fa-plus me-2"></i>
//             Add Renewal Contract
//           </button>
//         </Link>
//       </div>

//       {/* Conditional Rendering: Table for Desktop, Cards for Mobile */}
//       {loading ? (
//         <div className="d-flex justify-content-center py-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : renewals.length === 0 ? (
//         <div className="text-center py-4 text-muted">No renewal requests found</div>
//       ) : (
//         <>
//           {/* Desktop View: Table */}
//           {!isMobile && (
//             <div className="table-responsive mt-4">
//               {/* Added a custom class 'renewals-table' for specific styling */}
//               <table className="table table-bordered text-center align-middle table-striped renewals-table">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Contract ID</th>
//                     <th>Contract Name</th>
//                     <th>Supplier Name</th>
//                     <th>Type</th>
//                     <th>Expiry Date</th>
//                     <th>Renewal Date</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {renewals.map((renewal) => (
//                     <tr key={renewal.id}>
//                       <td>{renewal.contractId || `CNT-${String(renewal.id).padStart(6, '0')}`}</td>
//                       <td>{renewal.contractName || renewal.description || "Renewal Request"}</td>
//                       <td>{renewal.supplierName || "N/A"}</td>
//                       <td>{renewal.contract?.contractTypeId || renewal.contract?.type || "N/A"}</td>
//                       <td>
//                         {renewal.previousExpirationDate 
//                           ? new Date(renewal.previousExpirationDate).toLocaleDateString()
//                           : renewal.currentEndDate
//                           ? new Date(renewal.currentEndDate).toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td>
//                         {renewal.newExpirationDate 
//                           ? new Date(renewal.newExpirationDate).toLocaleDateString()
//                           : renewal.renewalDate
//                           ? new Date(renewal.renewalDate).toLocaleDateString()
//                           : "N/A"}
//                       </td>
//                       <td>{getStatusBadge(renewal.status)}</td>
//                       <td>
//                         {renewal.status === "Closed" ? (
//                           <span className="text-muted">Closed</span>
//                         ) : (
//                           <Link to="/renewalform" state={renewal}>
//                             <button 
//                               className="btn btn-sm btn-primary" 
//                               style={{ backgroundColor: "#578e7e", border: "none" }}
//                               data-bs-placement="top" 
//                               title="Renew Contract"
//                             >
//                             Renew
//                             </button>
//                           </Link>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Mobile View: Cards */}
//           {isMobile && (
//             <div className="mt-4">
//               {renewals.map((renewal) => (
//                 <MobileCardView key={renewal.id} renewal={renewal} />
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* CSS to fix the Status and Action column widths properly */}
//       <style>
//         {`
//           /* Make sure the Status and Action columns don't shrink and their content stays on one line */
//           .renewals-table th:nth-last-child(2),
//           .renewals-table td:nth-last-child(2),
//           .renewals-table th:last-child,
//           .renewals-table td:last-child {
//             width: 150px; /* Give them enough space */
//             white-space: nowrap;
//             vertical-align: middle; /* Align content vertically */
//           }

//           /* Specifically target the badge inside the status column to ensure it doesn't wrap */
//           .renewals-table td:nth-last-child(2) .badge {
//             white-space: nowrap;
//             display: inline-block; /* Helps with alignment */
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default Renewalmanagedash;










import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const Renewalmanagedash = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  // ✅ Fetch contracts for name mapping
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await get(endpoints.getAllContracts);
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setContracts(data);
      } catch (err) {
        console.warn("Could not load contracts");
      }
    };
    fetchContracts();
  }, []);

  // Helper: Get contract name by ID
  const getContractName = (contractId) => {
    const contract = contracts.find(c => c.id == contractId);
    return contract ? (contract.contractName || contract.contract_name || `Contract #${contractId}`) : `Contract #${contractId}`;
  };

  // ✅ Fetch departments
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await get(endpoints.getAllDepartments);
        const depts = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setDepartments(depts);
      } catch (err) {
        console.warn("Could not load departments");
      }
    };
    fetchDepts();
  }, []);

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id == deptId);
    return dept ? dept.name : "N/A";
  };

  const handleProcess = async (id) => {
    if (!window.confirm("Are you sure you want to process this renewal? This will create a new contract and mark the current one as renewed.")) {
      return;
    }

    try {
      const response = await post(`${endpoints.processRenewalRequest}/${id}`);
      if (response.status || response.success) {
        alert("Renewal processed successfully!");
        fetchRenewals();
      } else {
        alert(response.message || "Failed to process renewal");
      }
    } catch (error) {
      console.error("Error processing renewal:", error);
      alert("An error occurred while processing the renewal.");
    }
  };

  // ✅ MAIN: Fetch renewals — SAFE & DIRECT
  const fetchRenewals = async () => {
    setLoading(true);
    try {
      const response = await get(endpoints.getAllRenewalRequests);

      // ✅ Handle ANY response format
      let data = [];
      if (response && typeof response === "object") {
        if (Array.isArray(response)) {
          data = response;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.results) { // Some APIs use 'results'
          data = response.results;
        }
      }

      // ✅ Add default status if missing
      const formattedData = data.map(item => ({
        ...item,
        status: item.status || "Pending Renewal", // ✅ Default status
        description: item.description || item.additionalNotes || "No Description",
        amendments: item.amendments || "None",
      }));

      setRenewals(formattedData);
    } catch (error) {
      console.error("Error fetching renewals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  // Force refresh on tab focus (optional)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRenewals();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const getStatusBadge = (status) => {
    const statusClass =
      status === "Approved" ? "bg-success" :
        status === "Closed" ? "bg-secondary" :
          status === "Rejected" ? "bg-danger" :
            "bg-warning";
    return <span className={`badge ${statusClass}`}>{status}</span>;
  };

  const MobileCardView = ({ renewal }) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-bold mb-0">
            {renewal.description || "Renewal Request"}
          </h6>
          {getStatusBadge(renewal.status)}
        </div>
        <p className="card-text small text-muted mb-2">
          Contract: {getContractName(renewal.contractId)}
        </p>
        <p className="card-text small mb-1">
          <strong>Department:</strong> {getDepartmentName(renewal.selectDepartment)}
        </p>
        <p className="card-text small mb-1">
          <strong>Previous Expiry:</strong> {
            renewal.previousExpirationDate
              ? new Date(renewal.previousExpirationDate).toLocaleDateString()
              : "N/A"
          }
        </p>
        <p className="card-text small mb-1">
          <strong>New Expiry:</strong> {
            renewal.newExpirationDate
              ? new Date(renewal.newExpirationDate).toLocaleDateString()
              : "N/A"
          }
        </p>
        <p className="card-text small mb-3">
          <strong>Amendments:</strong> {renewal.amendments || "None"}
        </p>
        {renewal.status !== "Closed" && (
          <div className="d-flex gap-2">
            <button
              onClick={() => navigate(`/editrenewalnoti/${renewal.id}`)}
              className="btn btn-sm btn-primary flex-grow-1"
              style={{ backgroundColor: "#578e7e", border: "none" }}
            >
              Edit
            </button>
            {renewal.status === "Pending Renewal" && (
              <button
                onClick={() => handleProcess(renewal.id)}
                className="btn btn-sm btn-success flex-grow-1"
              >
                Process
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h3 className="fw-bold mb-0">Renewals Dashboard</h3>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate("/renewal-automation")}
            className="btn btn-success"
            style={{ backgroundColor: "#1e1b4b", border: "none" }}
            title="Automated Renewal"
          >
            <i className="fa-solid fa-magic me-2"></i>
            Automated Renewal
          </button>
          <button
            onClick={() => navigate("/editrenewalnoti")}
            className="btn btn-primary"
            style={{ backgroundColor: "#578e7e", border: "none" }}
            title="Add Renewal Request"
          >
            <i className="fa-solid fa-plus me-2"></i>
            Manual Request
          </button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : renewals.length === 0 ? (
        <div className="text-center py-4 text-muted">No renewal requests found</div>
      ) : (
        <>
          {!isMobile && (
            <div className="table-responsive mt-4">
              <table className="table table-bordered text-center align-middle table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Contract Name</th>
                    <th>Supplier</th>
                    <th>Dept</th>
                    <th>PreviousExpirationDate</th>
                    <th>NewExpirationDate</th>
                    <th>Agreement</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {renewals.map((renewal) => (
                    <tr key={renewal.id}>
                      <td>{getContractName(renewal.contractId)}</td>
                      <td>{renewal.vendorName || "N/A"}</td>
                      <td>{getDepartmentName(renewal.selectDepartment)}</td>
                      <td>
                        {renewal.previousExpirationDate
                          ? new Date(renewal.previousExpirationDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      {/* <td>
                        {renewal.endDate
                          ? new Date(renewal.endDate).toLocaleDateString()
                          : "N/A"}
                      </td> */}
                      <td>
                        {renewal.newExpirationDate
                          ? new Date(renewal.newExpirationDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      {/* <td>
                        {renewal.renewalAttachmentPath || renewal.attachmentPath ? (
                          <span className="badge bg-success"><i className="fa-solid fa-check"></i> Yes</span>
                        ) : (
                          <span className="badge bg-secondary"><i className="fa-solid fa-times"></i> No</span>
                        )}
                          
                      </td> */}
                      <td>
                        {renewal.renewalAttachmentFile || renewal.attachmentPath ? (
                          <span className="badge bg-success"><i className="fa-solid fa-check"></i> Yes</span>
                        ) : (
                          <span className="badge bg-secondary"><i className="fa-solid fa-times"></i> No</span>
                        )}
                      </td>

                      <td>{getStatusBadge(renewal.status)}</td>
                      <td>
                        {renewal.status === "Closed" || renewal.status === "Processed" ? (
                          <span className="text-muted">{renewal.status}</span>
                        ) : (
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              onClick={() => navigate(`/editrenewalnoti/${renewal.id}`)}
                              className="btn btn-sm btn-primary"
                              style={{ backgroundColor: "#578e7e", border: "none" }}
                              title="Edit Request"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            {renewal.status === "Pending Renewal" && (
                              <button
                                onClick={() => handleProcess(renewal.id)}
                                className="btn btn-sm btn-success"
                                title="Process Renewal"
                                style={{ backgroundColor: "#1e1b4b", border: "none" }}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isMobile && (
            <div className="mt-4">
              {renewals.map((renewal) => (
                <MobileCardView key={renewal.id} renewal={renewal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Renewalmanagedash;