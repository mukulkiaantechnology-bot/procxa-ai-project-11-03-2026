// const navigate = useNavigate();
// const [searchTerm, setSearchTerm] = useState("");
// const [requests, setRequests] = useState([]);
// const [pendingApprovals, setPendingApprovals] = useState(0);
// const [spendData, setSpendData] = useState({
//   totalSpend: 0,
//   spendThisMonth: 0,
// });
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);
// const [pagination, setPagination] = useState({
//   currentPage: 1,
//   totalPages: 1,
//   totalRecords: 0,
//   limit: 7,
// });

// const { get } = useApi();
// const [selectedContract, setSelectedContract] = useState(null);
// const [contracts, setContracts] = useState({
//   allContracts: [],
//   expiringSoonCount: 0,
//   totalContractsCount: 0,
//   pagination: {
//     currentPage: 1,
//     totalPages: 0,
//     totalRecords: 0,
//     limit: 7,
//   },
// });
// const handleEdit = (contract) => {
//   navigate('/editpage', { state: { contract: contract } });
// };

// const fetchContracts = async (page = 1, limit = 7, searchTerm = "") => {
//   try {
//     const response = await get(
//       `${endpoints.getContractsDashboard}?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
//     );
//     setContracts({
//       allContracts: response.data?.contracts || [],
//       totalContractsCount: response.data?.totalContractsCount || 0,
//       expiringSoonCount: response.data?.expiringSoonCount || 0,
//       pagination: {
//         currentPage: response.pagination?.currentPage || 1,
//         totalPages: response.pagination?.totalPages || 1,
//         totalRecords: response.pagination?.totalRecords || 0,
//         limit: response.pagination?.limit || 7,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     setError("Failed to load contract data. Please try again later.");
//   }
// };

// const fetchPendingApprovals = async () => {
//   try {
//     const response = await get(`${endpoints.intakeDashboard}?page=1&limit=100`);
//     if (response && response.data) {
//       const pendingCount = response.data.allRequests?.filter(
//         (req) => req.status === "pending" || !req.status
//       ).length || 0;
//       setPendingApprovals(pendingCount);
//     }
//   } catch (error) {
//     console.error("Error fetching pending approvals:", error);
//   }
// };

// const fetchSpendData = async () => {
//   try {
//     const response = await get(endpoints.getDashboardSpendsAnalytics);
//     if (response && response.status) {
//       const data = response.data || response;
//       setSpendData({
//         totalSpend: data.summary?.totalSpendCount || 0,
//         spendThisMonth: data.summary?.spendThisMonth || 0,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching spend data:", error);
//   }
// };

// useEffect(() => {
//   setLoading(true);
//   Promise.all([
//     fetchContracts(),
//     fetchMyRequests(),
//     fetchPendingApprovals(),
//     fetchSpendData(),
//   ]).finally(() => {
//     setLoading(false);
//   });
// }, []);

// const handlePageChange = (page) => {
//   fetchContracts(page, contracts.pagination.limit, searchTerm);
// };

// const handleViewDetails = (contract) => {
//   setSelectedContract(contract);
// };

// const handleSearchChange = (event) => {
//   const value = event.target.value;
//   setSearchTerm(value);

//   clearTimeout(window.searchTimeout);
//   window.searchTimeout = setTimeout(() => {
//     fetchContracts(1, contracts.pagination.limit, value);
//   }, 300);
// };

// const handleDownloadPdf = (pdfUrl) => {
//   if (!pdfUrl || pdfUrl === import.meta.env.VITE_APP_API_BASE_URL + "/undefined") {
//     alert("PDF is not available");
//     console.error("PDF URL is not available.");
//     return;
//   }

//   console.log("Downloading PDF from:", pdfUrl);
//   window.open(pdfUrl, "_blank");

//   const link = document.createElement("a");
//   link.href = pdfUrl;
//   link.target = "_blank";
//   link.setAttribute("download", `contract_${Date.now()}.pdf`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// const fetchMyRequests = async (page = 1) => {
//   try {
//     const response = await get(`${endpoints.getIntakeRequest}?page=${page}&limit=${pagination.limit}`);
//     if (response && response.data) {
//       if (Array.isArray(response.data) && response.data.length > 0) {
//         setRequests(response.data);
//         setPagination((prev) => ({
//           ...prev,
//           currentPage: page,
//           totalPages: response.pagination?.totalPages || 1,
//           totalRecords: response.pagination?.totalRecords || response.totalRecords || 0,
//         }));
//       } else {
//         setRequests([]);
//       }
//     } else if (Array.isArray(response) && response.length > 0) {
//       setRequests(response);
//     } else {
//       setRequests([]);
//     }
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     setRequests([]);
//   }
// };

// if (loading) {
//   return (
//     <div className="container mt-3 mt-md-5">
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// if (error) {
//   return (
//     <div className="container mt-3 mt-md-5">
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     </div>
//   );
// }

// return (
//   <>
//     <div className="container mt-3 mt-md-5">
//       <div className="top d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-start align-items-md-center mb-3">
//         <div className="heading mb-3 mb-md-0">
//           <h3 className="mb-0 fw-bold" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>Contract Dashboard</h3>
//         </div>
//         <div className="dropdown mt-0 mt-md-0 w-100 w-md-auto">
//           <form className="d-flex">
//             <input
//               className="form-control p-2 text-secondary border-secondary w-100"
//               type="search"
//               placeholder="Search by Depart&Type"
//               aria-label="Search"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               style={{ maxWidth: "300px" }}
//             />
//           </form>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="row text-center mb-4 mt-3 mt-md-4 g-3">
//         {/* Card 1 */}
//         <div className="col-12 col-sm-6 col-lg-3 mb-3">
//           <div
//             className="card portalcard text-white fw-semibold h-100 d-flex justify-content-center"
//             style={{ backgroundColor: "#ff6567" }}
//           >
//             <div className="content d-flex justify-content-start align-items-center p-2 p-md-3">
//               <div className="icon">
//                 <i
//                   className="fa-regular fa-user rounded-circle p-2 p-md-3"
//                   style={{ backgroundColor: "#fdabab", fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
//                 />
//               </div>
//               <div className="text ms-2 ms-md-4 text-start">
//                 <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{contracts.totalContractsCount}</h2>
//                 <p className="mb-0" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>Total Contracts</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 2 */}
//         <div className="col-12 col-sm-6 col-lg-3 mb-3">
//           <div
//             className="card portalcard text-white fw-semibold h-100 d-flex justify-content-center"
//             style={{ backgroundColor: "#ff9318" }}
//           >
//             <div className="content d-flex justify-content-start align-items-center p-2 p-md-3">
//               <div className="icon">
//                 <i
//                   className="fa-regular fa-user rounded-circle p-2 p-md-3"
//                   style={{ backgroundColor: "#fcc586", fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
//                 />
//               </div>
//               <div className="text ms-2 ms-md-4 text-start">
//                 <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{contracts.expiringSoonCount}</h2>
//                 <p className="mb-0" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>Contracts Expiring Soon</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Card 3 */}
//         <div className="col-12 col-sm-6 col-lg-3 mb-3">
//           <div
//             className="card portalcard text-white fw-semibold h-100 d-flex justify-content-center"
//             style={{ backgroundColor: "#39bf1b" }}
//           >
//             <div className="content d-flex justify-content-start align-items-center p-2 p-md-3">
//               <div className="icon">
//                 <i
//                   className="fa-regular fa-user rounded-circle p-2 p-md-3"
//                   style={{ backgroundColor: "#74d25f", fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
//                 />
//               </div>
//               <div className="text ms-2 ms-md-4 text-start">
//                 <h2 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{pendingApprovals}</h2>
//                 <p className="mb-0" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>Pending Approvals</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Btn */}
//         <div className="col-12 col-sm-6 col-lg-3 mb-3 d-flex align-items-center align-items-md-end">
//           <div className="content w-100">
//             <div className="dropdown d-flex w-100">
//               <button
//                 className="btn dropdown-toggle w-100 w-md-auto px-3 px-md-4 py-2 rounded-3 fw-semibold text-white"
//                 type="button"
//                 id="dropdownMenuButton1"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//                 style={{ backgroundColor: "#578E7E", color: "white", fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
//               >
//                 <span><i className="fa-solid fa-book"></i></span> Add New Contract
//               </button>
//               <ul
//                 className="dropdown-menu w-100"
//                 aria-labelledby="dropdownMenuButton1"
//               >
//                 <li>
//                   <Link to="/addnewcontact" className="dropdown-item">
//                     Add New Contract
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/contracttemplate" className="dropdown-item">
//                     Contract Template Selection
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/costumeagent" className="dropdown-item">
//                     Path Selection
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Requests Table */}
//       <div className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Recent Requests</h5>
//         </div>
//         <div className="card-body p-0">
//           {/* Mobile Card View */}
//           <div className="d-block d-md-none p-3">
//             {requests && requests.filter(request => request.status?.toLowerCase() !== "pending").length > 0 ? (
//               requests
//                 .filter(request => request.status?.toLowerCase() !== "pending")
//                 .map((request) => (
//                   <div key={request.id} className="card mb-3">
//                     <div className="card-body p-3">
//                       <div className="d-flex justify-content-between align-items-start mb-2">
//                         <h6 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
//                           Request ID: {request.id}
//                         </h6>
//                         <span className="badge bg-primary flex-shrink-0 ms-2" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>
//                           {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : "N/A"}
//                         </span>
//                       </div>
//                       <div className="row mb-2">
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {request.supplierName || "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {request.department ? request.department.name : "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="row mb-2">
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Request Name:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {request.requestType ? request.requesterName : "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Type:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {request.requestType || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-12">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Submission Date:</small>
//                           <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {request.createdAt ? request.createdAt.split('T')[0] : "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//             ) : (
//               <div className="text-center py-4">
//                 <p className="text-muted mb-0">No requests available</p>
//               </div>
//             )}
//           </div>

//           {/* Desktop Table View */}
//           <div className="table-responsive d-none d-md-block" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
//             <table className="table table-striped table-bordered text-center mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Request ID</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Supplier Name</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Request Name</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Department</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Status</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Request Type</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Submission Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {requests && requests.filter(request => request.status?.toLowerCase() !== "pending").length > 0 ? (
//                   requests
//                     .filter(request => request.status?.toLowerCase() !== "pending")
//                     .map((request) => (
//                       <tr key={request.id}>
//                         <td style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', fontWeight: 'bold', wordBreak: "break-word" }}>{request.id}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.supplierName || "N/A"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.requestType ? request.requesterName : "N/A"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.department ? request.department.name : "N/A"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>
//                           {request.status
//                             ? request.status.charAt(0).toUpperCase() + request.status.slice(1)
//                             : "N/A"}
//                         </td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.requestType ? request.requestType : "N/A"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{request.createdAt ? request.createdAt.split('T')[0] : "N/A"}</td>
//                       </tr>
//                     ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No requests available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Section */}
//           <div className="p-3">
//             <nav aria-label="Page navigation">
//               <ul className="pagination justify-content-center flex-wrap mb-0">
//                 <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link text-secondary px-3 py-2"
//                     onClick={() => pagination.currentPage > 1 && fetchMyRequests(pagination.currentPage - 1)}
//                     disabled={pagination.currentPage === 1}
//                     style={{
//                       minWidth: "80px",
//                       height: "40px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       border: "1px solid #dee2e6",
//                       borderRadius: "0.25rem",
//                       cursor: pagination.currentPage === 1 ? "not-allowed" : "pointer"
//                     }}
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 {[...Array(pagination.totalPages)].map((_, index) => (
//                   <li key={index} className={`page-item mx-1 ${pagination.currentPage === index + 1 ? "active" : ""}`}>
//                     <button
//                       className={`page-link rounded fw-semibold px-3 py-2 ${pagination.currentPage === index + 1 ? "text-white" : "text-dark"}`}
//                       style={{
//                         backgroundColor: pagination.currentPage === index + 1 ? "#0096d4" : "rgb(212, 212, 212)",
//                         minWidth: "40px",
//                         height: "40px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         border: "1px solid #dee2e6",
//                         borderRadius: "0.25rem",
//                         cursor: "pointer"
//                       }}
//                       onClick={() => fetchMyRequests(index + 1)}
//                     >
//                       {index + 1}
//                     </button>
//                   </li>
//                 ))}
//                 <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}`}>
//                   <button
//                     className="page-link text-secondary px-3 py-2"
//                     onClick={() => pagination.currentPage < pagination.totalPages && fetchMyRequests(pagination.currentPage + 1)}
//                     disabled={pagination.currentPage === pagination.totalPages}
//                     style={{
//                       minWidth: "80px",
//                       height: "40px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       border: "1px solid #dee2e6",
//                       borderRadius: "0.25rem",
//                       cursor: pagination.currentPage === pagination.totalPages ? "not-allowed" : "pointer"
//                     }}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Spend Details Section */}
//       <div className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">Spend Details</h5>
//         </div>
//         <div className="card-body">
//           <div className="row text-center">
//             <div className="col-6 col-md-3 mb-3">
//               <div className="p-3 border rounded">
//                 <h4 className="text-primary mb-1">${spendData.totalSpend.toLocaleString()}</h4>
//                 <small className="text-muted">Total Spend</small>
//               </div>
//             </div>
//             <div className="col-6 col-md-3 mb-3">
//               <div className="p-3 border rounded">
//                 <h4 className="text-success mb-1">${spendData.spendThisMonth.toLocaleString()}</h4>
//                 <small className="text-muted">This Month</small>
//               </div>
//             </div>
//             <div className="col-6 col-md-3 mb-3">
//               <div className="p-3 border rounded">
//                 <h4 className="text-warning mb-1">{contracts.expiringSoonCount}</h4>
//                 <small className="text-muted">Expiring Soon</small>
//               </div>
//             </div>
//             <div className="col-6 col-md-3 mb-3">
//               <div className="p-3 border rounded">
//                 <h4 className="text-info mb-1">{contracts.totalContractsCount}</h4>
//                 <small className="text-muted">Active Contracts</small>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hierarchy View Toggle */}
//       <div className="mb-3">
//         <button
//           className="btn btn-outline-primary"
//           onClick={() => {
//             const hierarchyView = document.getElementById('hierarchyView');
//             const tableView = document.getElementById('tableView');
//             if (hierarchyView && tableView) {
//               hierarchyView.style.display = hierarchyView.style.display === 'none' ? 'block' : 'none';
//               tableView.style.display = tableView.style.display === 'none' ? 'block' : 'none';
//             }
//           }}
//         >
//           <i className="fa-solid fa-sitemap me-2"></i>Toggle Hierarchy View
//         </button>
//       </div>

//       {/* Hierarchy View */}
//       <div id="hierarchyView" style={{ display: 'none' }} className="mb-4">
//         <div className="card">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Contract Hierarchy</h5>
//           </div>
//           <div className="card-body">
//             {contracts.allContracts && contracts.allContracts.length > 0 ? (
//               contracts.allContracts
//                 .filter(c => c.status === "Active")
//                 .map((contract) => {
//                   const daysUntilExpiry = Math.ceil((new Date(contract.endDate || contract.endDate) - new Date()) / (1000 * 60 * 60 * 24));
//                   return (
//                     <div key={contract.id} className="mb-3 p-3 border rounded">
//                       <div className="d-flex justify-content-between align-items-start">
//                         <div>
//                           <h6 className="mb-1">
//                             <i className="fa-solid fa-file-contract me-2 text-primary"></i>
//                             {contract.contractId || contract.id} - {contract.supplier?.name || contract.supplierName}
//                           </h6>
//                           <small className="text-muted">
//                             {contract.department?.name || contract.department} | {contract.contractTypeId || contract.type}
//                           </small>
//                         </div>
//                         <span className={`badge ${contract.status === "Active" ? "bg-success" : "bg-secondary"}`}>
//                           {contract.status}
//                         </span>
//                       </div>
//                       {/* SOWs and Amendments as children */}
//                       <div className="ms-4 mt-2">
//                         <small className="text-muted">
//                           <i className="fa-solid fa-arrow-right me-1"></i>
//                           SOWs & Amendments: {Math.floor(Math.random() * 3)} related documents
//                         </small>
//                       </div>
//                     </div>
//                   );
//                 })
//             ) : (
//               <p className="text-muted">No contracts available</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Table View */}
//       <div id="tableView" className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Contract Details</h5>
//         </div>
//         <div className="card-body p-0">
//           {/* Mobile Card View */}
//           <div className="d-block d-md-none p-3">
//             {contracts.allContracts && contracts.allContracts.length > 0 ? (
//               contracts.allContracts.map((contract) => {
//                 const endDate = contract.endDate || (contract.endDate ? new Date(contract.endDate) : null);
//                 const daysUntilExpiry = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
//                 const renewalNotification = daysUntilExpiry !== null
//                   ? (daysUntilExpiry <= 30 && daysUntilExpiry > 0
//                     ? `Renewal due in ${daysUntilExpiry} days`
//                     : daysUntilExpiry <= 0
//                       ? "Expired"
//                       : `Renewal due in ${Math.ceil(daysUntilExpiry / 30)} months`)
//                   : "N/A";

//                 return (
//                   <div key={contract.id} className="card mb-3">
//                     <div className="card-body p-3">
//                       <div className="d-flex justify-content-between align-items-start mb-2">
//                         <h6 className="card-title mb-0 fw-bold text-truncate" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
//                           {contract.contractId || contract.id || "Not Available"}
//                         </h6>
//                         <span
//                           className={`badge rounded-pill flex-shrink-0 ms-2 ${contract.status === "Active"
//                             ? "bg-success"
//                             : contract.status === "Expired"
//                               ? "bg-danger"
//                               : contract.status === "Renewal" || contract.status === "Under Renewal"
//                                 ? "bg-warning"
//                                 : contract.status === "Terminated"
//                                   ? "bg-secondary"
//                                   : "bg-secondary"}`}
//                           style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}
//                         >
//                           {contract.status || "Not Available"}
//                         </span>
//                       </div>

//                       <div className="row mb-2">
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {contract.supplier?.name || contract.supplierName || "Not Available"}
//                           </p>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {contract.department?.name || contract.department || "Not Available"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="row mb-2">
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Type:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {contract.contractTypeId || contract.type || "Not Available"}
//                           </p>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Stakeholder:</small>
//                           <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {contract.buisnessStackHolder || contract.businessStakeholder || "Not Available"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="row mb-2">
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Start Date:</small>
//                           <p className="mb-1" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}
//                           </p>
//                         </div>
//                         <div className="col-6">
//                           <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>End Date:</small>
//                           <p className="mb-1" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
//                             {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="row mb-3">
//                         <div className="col-12">
//                           <small className="text-muted d-block mb-1" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Renewal:</small>
//                           <span className={`badge ${daysUntilExpiry !== null && daysUntilExpiry <= 30 ? "bg-warning" : daysUntilExpiry !== null && daysUntilExpiry <= 0 ? "bg-danger" : "bg-info"}`} style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>
//                             {renewalNotification}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="d-flex justify-content-center gap-3 pt-2 border-top">
//                         <button
//                           className="btn btn-link p-0"
//                           style={{ color: "#624de3", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
//                           title="Edit"
//                           onClick={() => handleEdit(contract)}
//                         >
//                           <i className="fa-regular fa-pen-to-square"></i>
//                         </button>
//                         <button
//                           className="btn btn-link p-0"
//                           style={{ color: "#32CD32", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
//                           title="Comments"
//                           data-bs-toggle="modal"
//                           data-bs-target="#exampleModalToggle2"
//                         >
//                           <i className="fa-regular fa-comment"></i>
//                         </button>
//                         <button
//                           className="btn btn-link p-0"
//                           style={{ color: "green", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             handleDownloadPdf(
//                               contract.pdfUrl || `${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType?.customAgreementFile}`
//                             );
//                           }}
//                           title="Download"
//                         >
//                           <i className="fa-solid fa-download"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-4">
//                 <p className="text-muted mb-0">No contracts available</p>
//               </div>
//             )}
//           </div>

//           {/* Desktop Table View */}
//           <div className="table-responsive d-none d-md-block" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
//             <table className="table table-striped table-bordered text-center mb-0">
//               <thead>
//                 <tr>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Contract ID</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Supplier Name</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Department</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Business Stakeholder</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Type</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Start Date</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>End Date</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Renewal Notification</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Status</th>
//                   <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contracts.allContracts && contracts.allContracts.length > 0 ? (
//                   contracts.allContracts.map((contract) => {
//                     const endDate = contract.endDate || (contract.endDate ? new Date(contract.endDate) : null);
//                     const daysUntilExpiry = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
//                     const renewalNotification = daysUntilExpiry !== null
//                       ? (daysUntilExpiry <= 30 && daysUntilExpiry > 0
//                         ? `Renewal due in ${daysUntilExpiry} days`
//                         : daysUntilExpiry <= 0
//                           ? "Expired"
//                           : `Renewal due in ${Math.ceil(daysUntilExpiry / 30)} months`)
//                       : "N/A";

//                     return (
//                       <tr key={contract.id}>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.contractId || contract.id || "Not Available"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.supplier?.name || contract.supplierName || "Not Available"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.department?.name || contract.department || "Not Available"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.buisnessStackHolder || contract.businessStakeholder || "Not Available"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.contractTypeId || contract.type || "Not Available"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}</td>
//                         <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}</td>
//                         <td>
//                           <span className={`badge ${daysUntilExpiry !== null && daysUntilExpiry <= 30 ? "bg-warning" : daysUntilExpiry !== null && daysUntilExpiry <= 0 ? "bg-danger" : "bg-info"}`} style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}>
//                             {renewalNotification}
//                           </span>
//                         </td>
//                         <td>
//                           <span
//                             className={`badge rounded-pill px-3 py-1 ${contract.status === "Active"
//                               ? "bg-success"
//                               : contract.status === "Expired"
//                                 ? "bg-danger"
//                                 : contract.status === "Renewal" || contract.status === "Under Renewal"
//                                   ? "bg-warning"
//                                   : contract.status === "Terminated"
//                                     ? "bg-secondary"
//                                     : "bg-secondary"}`}
//                             style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
//                           >
//                             {contract.status || "Not Available"}
//                           </span>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center justify-content-center gap-2">
//                             <i
//                               className="fa-regular fa-pen-to-square"
//                               style={{ color: "#624de3", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
//                               title="Edit"
//                               onClick={() => handleEdit(contract)}
//                             />
//                             <i
//                               className="fa-regular fa-comment"
//                               style={{ color: "#32CD32", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
//                               title="Comments"
//                               data-bs-toggle="modal"
//                               data-bs-target="#exampleModalToggle2"
//                             />
//                             <button
//                               className="btn btn-link text-decoration-none p-0"
//                               style={{
//                                 color: "green",
//                                 background: "none",
//                                 border: "none",
//                                 cursor: "pointer",
//                                 fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
//                               }}
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 handleDownloadPdf(
//                                   contract.pdfUrl || `${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType?.customAgreementFile}`
//                                 );
//                               }}
//                               title="Download"
//                             >
//                               <i className="fa-solid fa-download"></i>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="text-center">No contracts available</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="p-3">
//             <nav aria-label="Page navigation">
//               <ul className="pagination justify-content-center mb-0">
//                 {/* Previous Button */}
//                 <li className={`page-item ${contracts.pagination.currentPage === 1 ? "disabled" : ""}`}>
//                   <button
//                     className="page-link text-secondary px-3 py-2"
//                     onClick={() =>
//                       handlePageChange(contracts.pagination.currentPage - 1)
//                     }
//                     disabled={contracts.pagination.currentPage === 1}
//                     style={{
//                       minWidth: "80px",
//                       height: "40px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       border: "1px solid #dee2e6",
//                       borderRadius: "0.25rem",
//                       cursor: contracts.pagination.currentPage === 1 ? "not-allowed" : "pointer"
//                     }}
//                   >
//                     Previous
//                   </button>
//                 </li>

//                 {/* Page Numbers */}
//                 {Array.from(
//                   { length: contracts.pagination.totalPages },
//                   (_, index) => index + 1
//                 ).map((page) => (
//                   <li
//                     key={page}
//                     className={`page-item mx-1 ${contracts.pagination.currentPage === page ? "active" : ""
//                       }`}
//                   >
//                     <button
//                       className={`page-link rounded fw-semibold px-3 py-2 ${contracts.pagination.currentPage === page
//                         ? "text-white"
//                         : "text-dark"
//                         }`}
//                       style={{
//                         backgroundColor:
//                           contracts.pagination.currentPage === page
//                             ? "#0096d4"
//                             : "rgb(212, 212, 212)",
//                         minWidth: "40px",
//                         height: "40px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         border: "1px solid #dee2e6",
//                         borderRadius: "0.25rem",
//                         cursor: "pointer"
//                       }}
//                       onClick={() => handlePageChange(page)}
//                     >
//                       {page}
//                     </button>
//                   </li>
//                 ))}

//                 {/* Next Button */}
//                 <li
//                   className={`page-item ${contracts.pagination.currentPage ===
//                     contracts.pagination.totalPages
//                     ? "disabled"
//                     : ""
//                     }`}
//                 >
//                   <button
//                     className="page-link text-secondary px-3 py-2"
//                     onClick={() =>
//                       handlePageChange(contracts.pagination.currentPage + 1)
//                     }
//                     disabled={
//                       contracts.pagination.currentPage ===
//                       contracts.pagination.totalPages
//                     }
//                     style={{
//                       minWidth: "80px",
//                       height: "40px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       border: "1px solid #dee2e6",
//                       borderRadius: "0.25rem",
//                       cursor: contracts.pagination.currentPage === contracts.pagination.totalPages ? "not-allowed" : "pointer"
//                     }}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Modal for Details */}
//       <div
//         className="modal fade"
//         id="exampleModal"
//         tabIndex="-1"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered modal-lg">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalLabel">
//                 More Details
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               {selectedContract ? (
//                 <ul>
//                   <li>
//                     <strong>Contract ID:</strong> {selectedContract.id}
//                   </li>
//                   <li>
//                     {/* <strong>Supplier Name:</strong> {selectedContract.supplierName} */}
//                   </li>
//                   <li>
//                     <strong>Type of Contract:</strong> {selectedContract.contractType.type}
//                   </li>
//                   <li>
//                     <strong>Department:</strong> {selectedContract.department.name}
//                   </li>
//                   <li>
//                     <strong>Status:</strong>{" "}
//                     <span
//                       className={`badge rounded-pill px-5 py-1 ${selectedContract.status === "Active"
//                         ? "activebadge"
//                         : selectedContract.status === "Expired"
//                           ? "expiredbadge"
//                           : selectedContract.status === "Under Renewal"
//                             ? "renewalbadge"
//                             : selectedContract.status === "Terminated"
//                               ? "terminatedbadge"
//                               : ""
//                         }`}
//                     >
//                       {selectedContract.status}
//                     </span>
//                   </li>
//                   <li>
//                     <strong>Description:</strong>{" "}
//                     {selectedContract.description}
//                   </li>
//                 </ul>
//               ) : (
//                 <p>No contract selected.</p>
//               )}
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className="modal fade"
//         id="exampleModalToggle2"
//         aria-hidden="true"
//         aria-labelledby="exampleModalToggleLabel2"
//         tabIndex="-1"
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="exampleModalToggleLabel2">
//                 Enter Comments
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <div className="form-floating">
//                 <textarea
//                   className="form-control"
//                   placeholder="Leave a comment here"
//                   id="floatingTextarea"
//                 ></textarea>
//                 <label htmlFor="floatingTextarea">Comments</label>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="btn"
//                 data-bs-target="#exampleModalToggle"
//                 data-bs-toggle="modal"
//                 data-bs-dismiss="modal"
//                 style={{ backgroundColor: "#578e7e", color: "white" }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// );
//  };

// export default Contractmanage;




import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { useNavigate } from 'react-router-dom';

const Contractmanage = () => {

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [spendData, setSpendData] = useState({
    totalSpend: 0,
    spendThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 7,
  });

  const { get } = useApi();
  const [selectedContract, setSelectedContract] = useState(null);
  const [contracts, setContracts] = useState({
    allContracts: [],
    expiringSoonCount: 0,
    totalContractsCount: 0,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      limit: 7,
    },
  });
  const handleEdit = (contract) => {
    navigate('/editpage', { state: { contract: contract } });
  };

  const fetchContracts = async (page = 1, limit = 7, searchTerm = "") => {
    try {
      const response = await get(
        `${endpoints.getContractsDashboard}?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
      );
      setContracts({
        allContracts: response.data?.contracts || [],
        totalContractsCount: response.data?.totalContractsCount || 0,
        expiringSoonCount: response.data?.expiringSoonCount || 0,
        pagination: {
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalRecords: response.pagination?.totalRecords || 0,
          limit: response.pagination?.limit || 7,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load contract data. Please try again later.");
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await get(`${endpoints.intakeDashboard}?page=1&limit=100`);
      if (response && response.data) {
        const pendingCount = response.data.allRequests?.filter(
          (req) => req.status === "pending" || !req.status
        ).length || 0;
        setPendingApprovals(pendingCount);
      }
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
    }
  };

  const fetchSpendData = async () => {
    try {
      const response = await get(endpoints.getDashboardSpendsAnalytics);
      if (response && response.status) {
        const data = response.data || response;
        setSpendData({
          totalSpend: data.summary?.totalSpendCount || 0,
          spendThisMonth: data.summary?.spendThisMonth || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching spend data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchContracts(),
      fetchMyRequests(),
      fetchPendingApprovals(),
      fetchSpendData(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handlePageChange = (page) => {
    fetchContracts(page, contracts.pagination.limit, searchTerm);
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchContracts(1, contracts.pagination.limit, value);
    }, 300);
  };

  const handleDownloadPdf = (pdfUrl) => {
    if (!pdfUrl || pdfUrl === import.meta.env.VITE_APP_API_BASE_URL + "/undefined") {
      alert("PDF is not available");
      console.error("PDF URL is not available.");
      return;
    }

    console.log("Downloading PDF from:", pdfUrl);
    window.open(pdfUrl, "_blank");

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.setAttribute("download", `contract_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchMyRequests = async (page = 1) => {
    try {
      const response = await get(`${endpoints.getIntakeRequest}?page=${page}&limit=${pagination.limit}`);
      if (response && response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setRequests(response.data);
          setPagination((prev) => ({
            ...prev,
            currentPage: page,
            totalPages: response.pagination?.totalPages || 1,
            totalRecords: response.pagination?.totalRecords || response.totalRecords || 0,
          }));
        } else {
          setRequests([]);
        }
      } else if (Array.isArray(response) && response.length > 0) {
        setRequests(response);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };

  if (loading) {
    return (
      <div className="container mt-3 mt-md-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-3 mt-md-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-3 mt-md-5">
        <div className="top d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-start align-items-md-center mb-3">
          <div className="heading mb-3 mb-md-0">
            <h3 className="mb-0 fw-bold" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>Contract Dashboard</h3>
          </div>

        </div>

        {/* Summary Cards */}
        <div className="row text-center mb-4 mt-3 g-3">

          {/* Card 1 */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="card text-white h-100"
              style={{ backgroundColor: "#ff6567", borderRadius: "14px" }}
            >
              <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-2 gap-md-3">

                {/* Icon */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#fdabab",
                    width: "56px",
                    height: "56px",
                    fontSize: "1.5rem",
                    margin: "0 auto",
                  }}
                >
                  <i className="fa-regular fa-user"></i>
                </div>

                {/* Text */}
                <div className="text-center text-md-start">
                  <h2 className="mb-0 fw-bold">{contracts.totalContractsCount}</h2>
                  <small>Total Contracts</small>
                </div>

              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="card text-white h-100"
              style={{ backgroundColor: "#ff9318", borderRadius: "14px" }}
            >
              <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-2 gap-md-3">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#fcc586",
                    width: "56px",
                    height: "56px",
                    fontSize: "1.5rem",
                    margin: "0 auto",
                  }}
                >
                  <i className="fa-regular fa-clock"></i>
                </div>

                <div className="text-center text-md-start">
                  <h2 className="mb-0 fw-bold">{contracts.expiringSoonCount}</h2>
                  <small>Contracts Expiring Soon</small>
                </div>

              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className="card text-white h-100"
              style={{ backgroundColor: "#39bf1b", borderRadius: "14px" }}
            >
              <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-2 gap-md-3">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "#74d25f",
                    width: "56px",
                    height: "56px",
                    fontSize: "1.5rem",
                    margin: "0 auto",
                  }}
                >
                  <i className="fa-regular fa-circle-check"></i>
                </div>

                <div className="text-center text-md-start">
                  <h2 className="mb-0 fw-bold">{pendingApprovals}</h2>
                  <small>Pending Approvals</small>
                </div>

              </div>
            </div>
          </div>

          {/* Button Card (same as before, untouched) */}
          <div className="col-12 col-sm-6 col-lg-3 d-flex align-items-center">
            <div className="w-100">
              <div className="dropdown w-100">
                <button
                  className="btn dropdown-toggle w-100 py-3 rounded-3 fw-semibold text-white"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{ backgroundColor: "#578E7E" }}
                >
                  <i className="fa-solid fa-book me-2"></i>
                  Add New Contract
                </button>
                <ul className="dropdown-menu w-100">
                  <li><Link to="/addnewcontact" className="dropdown-item">Add New Contract</Link></li>
                  <li><Link to="/contracttemplate" className="dropdown-item">Contract Template Selection</Link></li>
                  <li><Link to="/costumeagent" className="dropdown-item">Path Selection</Link></li>
                </ul>
              </div>
            </div>
          </div>

        </div>


        {/* Requests Table */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Recent Requests</h5>
          </div>
          <div className="card-body p-0">
            {/* Mobile Card View */}
            <div className="d-block d-md-none p-3">
              {requests && requests.filter(request => request.status?.toLowerCase() !== "pending").length > 0 ? (
                requests
                  .filter(request => request.status?.toLowerCase() !== "pending")
                  .map((request) => (
                    <div key={request.id} className="card mb-3">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0 fw-bold" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
                            Request ID: {request.id}
                          </h6>
                          <span className="badge bg-primary flex-shrink-0 ms-2" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>
                            {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : "N/A"}
                          </span>
                        </div>
                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {request.supplierName || "N/A"}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {request.department ? request.department.name : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Request Name:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {request.requestType ? request.requesterName : "N/A"}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Type:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {request.requestType || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Submission Date:</small>
                            <p className="mb-0" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {request.createdAt ? request.createdAt.split('T')[0] : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No requests available</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="table table-striped table-bordered text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Request ID</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Supplier Name</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Request Name</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Department</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Status</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Request Type</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Submission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests && requests.filter(request => request.status?.toLowerCase() !== "pending").length > 0 ? (
                    requests
                      .filter(request => request.status?.toLowerCase() !== "pending")
                      .map((request) => (
                        <tr key={request.id}>
                          <td style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', fontWeight: 'bold', wordBreak: "break-word" }}>{request.id}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.supplierName || "N/A"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.requestType ? request.requesterName : "N/A"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.department ? request.department.name : "N/A"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>
                            {request.status
                              ? request.status.charAt(0).toUpperCase() + request.status.slice(1)
                              : "N/A"}
                          </td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{request.requestType ? request.requestType : "N/A"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{request.createdAt ? request.createdAt.split('T')[0] : "N/A"}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No requests available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            <div className="p-3">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center flex-wrap mb-0">
                  <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link text-secondary px-3 py-2"
                      onClick={() => pagination.currentPage > 1 && fetchMyRequests(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      style={{
                        minWidth: "80px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.25rem",
                        cursor: pagination.currentPage === 1 ? "not-allowed" : "pointer"
                      }}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <li key={index} className={`page-item mx-1 ${pagination.currentPage === index + 1 ? "active" : ""}`}>
                      <button
                        className={`page-link rounded fw-semibold px-3 py-2 ${pagination.currentPage === index + 1 ? "text-white" : "text-dark"}`}
                        style={{
                          backgroundColor: pagination.currentPage === index + 1 ? "#0096d4" : "rgb(212, 212, 212)",
                          minWidth: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #dee2e6",
                          borderRadius: "0.25rem",
                          cursor: "pointer"
                        }}
                        onClick={() => fetchMyRequests(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link text-secondary px-3 py-2"
                      onClick={() => pagination.currentPage < pagination.totalPages && fetchMyRequests(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      style={{
                        minWidth: "80px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.25rem",
                        cursor: pagination.currentPage === pagination.totalPages ? "not-allowed" : "pointer"
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Spend Details Section */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Spend Details</h5>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-6 col-md-3 mb-3">
                <div className="p-3 border rounded">
                  <h4 className="text-primary mb-1">${spendData.totalSpend.toLocaleString()}</h4>
                  <small className="text-muted">Total Spend</small>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className="p-3 border rounded">
                  <h4 className="text-success mb-1">${spendData.spendThisMonth.toLocaleString()}</h4>
                  <small className="text-muted">This Month</small>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className="p-3 border rounded">
                  <h4 className="text-warning mb-1">{contracts.expiringSoonCount}</h4>
                  <small className="text-muted">Expiring Soon</small>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className="p-3 border rounded">
                  <h4 className="text-info mb-1">{contracts.totalContractsCount}</h4>
                  <small className="text-muted">Active Contracts</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchy View Toggle */}
        <div className="mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              const hierarchyView = document.getElementById('hierarchyView');
              const tableView = document.getElementById('tableView');
              if (hierarchyView && tableView) {
                hierarchyView.style.display = hierarchyView.style.display === 'none' ? 'block' : 'none';
                tableView.style.display = tableView.style.display === 'none' ? 'block' : 'none';
              }
            }}
          >
            <i className="fa-solid fa-sitemap me-2"></i>Toggle Hierarchy View
          </button>
        </div>

        {/* Hierarchy View */}
        <div id="hierarchyView" style={{ display: 'none' }} className="mb-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Contract Hierarchy</h5>
            </div>
            <div className="card-body">
              {contracts.allContracts && contracts.allContracts.length > 0 ? (
                contracts.allContracts
                  .filter(c => c.status === "Active")
                  .map((contract) => {
                    const daysUntilExpiry = Math.ceil((new Date(contract.endDate || contract.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={contract.id} className="mb-3 p-3 border rounded">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              <i className="fa-solid fa-file-contract me-2 text-primary"></i>
                              {contract.contractId || contract.id} - {contract.supplier?.name || contract.supplierName}
                            </h6>
                            <small className="text-muted">
                              {contract.department?.name || contract.department} | {contract.contractTypeId || contract.type}
                            </small>
                          </div>
                          <span className={`badge ${contract.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                            {contract.status}
                          </span>
                        </div>
                        {/* SOWs and Amendments as children */}
                        <div className="ms-4 mt-2">
                          <small className="text-muted">
                            <i className="fa-solid fa-arrow-right me-1"></i>
                            SOWs & Amendments: {Math.floor(Math.random() * 3)} related documents
                          </small>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-muted">No contracts available</p>
              )}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div id="tableView" className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>Contract Details</h5>
          </div>
          <div className="card-body p-0">
            {/* Mobile Card View */}
            <div className="d-block d-md-none p-3">
              {contracts.allContracts && contracts.allContracts.length > 0 ? (
                contracts.allContracts.map((contract) => {
                  const endDate = contract.endDate || (contract.endDate ? new Date(contract.endDate) : null);
                  const daysUntilExpiry = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                  const renewalNotification = daysUntilExpiry !== null
                    ? (daysUntilExpiry <= 30 && daysUntilExpiry > 0
                      ? `Renewal due in ${daysUntilExpiry} days`
                      : daysUntilExpiry <= 0
                        ? "Expired"
                        : `Renewal due in ${Math.ceil(daysUntilExpiry / 30)} months`)
                    : "N/A";

                  return (
                    <div key={contract.id} className="card mb-3">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0 fw-bold text-truncate" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1rem)" }}>
                            {contract.contractId || contract.id || "Not Available"}
                          </h6>
                          <span
                            className={`badge rounded-pill flex-shrink-0 ms-2 ${contract.status === "Active"
                              ? "activebadge"
                              : contract.status === "Expired"
                                ? "expiredbadge"
                                : contract.status === "Renewal" || contract.status === "Under Renewal"
                                  ? "renewalbadge"
                                  : contract.status === "Terminated"
                                    ? "terminatedbadge"
                                    : contract.status === "Renewed"
                                      ? "renewedbadge"
                                      : "bg-secondary"}`}
                            style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}
                          >
                            {contract.status || "Not Available"}
                          </span>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Supplier:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {contract.supplier?.name || contract.supplierName || "Not Available"}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Department:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {contract.department?.name || contract.department || "Not Available"}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Type:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {contract.contractTypeId || contract.type || "Not Available"}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Stakeholder:</small>
                            <p className="mb-1 text-truncate" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {contract.buisnessStackHolder || contract.businessStakeholder || "Not Available"}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Start Date:</small>
                            <p className="mb-1" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>End Date:</small>
                            <p className="mb-1" style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)" }}>
                              {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-12">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>Renewal:</small>
                            <span className={`badge ${daysUntilExpiry !== null && daysUntilExpiry <= 30 ? "bg-warning" : daysUntilExpiry !== null && daysUntilExpiry <= 0 ? "bg-danger" : "bg-info"}`} style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)" }}>
                              {renewalNotification}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center gap-3 pt-2 border-top">
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#624de3", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                            title="Edit"
                            onClick={() => handleEdit(contract)}
                          >
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "#32CD32", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                            title="Comments"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalToggle2"
                          >
                            <i className="fa-regular fa-comment"></i>
                          </button>
                          <button
                            className="btn btn-link p-0"
                            style={{ color: "green", fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownloadPdf(
                                contract.pdfUrl || `${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType?.customAgreementFile}`
                              );
                            }}
                            title="Download"
                          >
                            <i className="fa-solid fa-download"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No contracts available</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="table table-striped table-bordered text-center mb-0">
                <thead>
                  <tr>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Contract ID</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Supplier Name</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Department</th>
                    {/* <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Business Stakeholder</th> */}
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Type</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>Start Date</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>End Date</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Renewal Notification</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap", minWidth: "120px" }}>Status</th>
                    <th style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.allContracts && contracts.allContracts.length > 0 ? (
                    contracts.allContracts.map((contract) => {
                      const endDate = contract.endDate || (contract.endDate ? new Date(contract.endDate) : null);
                      const daysUntilExpiry = endDate ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                      const renewalNotification = daysUntilExpiry !== null
                        ? (daysUntilExpiry <= 30 && daysUntilExpiry > 0
                          ? `Renewal due in ${daysUntilExpiry} days`
                          : daysUntilExpiry <= 0
                            ? "Expired"
                            : `Renewal due in ${Math.ceil(daysUntilExpiry / 30)} months`)
                        : "N/A";

                      return (
                        <tr key={contract.id}>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.contractId || contract.id || "Not Available"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.supplier?.name || contract.supplierName || "Not Available"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.department?.name || contract.department || "Not Available"}</td>
                          {/* <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.buisnessStackHolder || contract.businessStakeholder || "Not Available"}</td> */}
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", wordBreak: "break-word" }}>{contract.contractTypeId || contract.type || "Not Available"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A"}</td>
                          <td style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", whiteSpace: "nowrap" }}>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "N/A"}</td>
                          <td>
                            <span className={`badge ${daysUntilExpiry !== null && daysUntilExpiry <= 30 ? "bg-warning" : daysUntilExpiry !== null && daysUntilExpiry <= 0 ? "bg-danger" : "bg-info"}`} style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}>
                              {renewalNotification}
                            </span>
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <span
                              className={`badge rounded-pill px-3 py-1 ${contract.status === "Active"
                                ? "bg-success"
                                : contract.status === "Expired"
                                  ? "bg-danger"
                                  : contract.status === "Renewal" || contract.status === "Under Renewal"
                                    ? "bg-warning"
                                    : contract.status === "Terminated"
                                      ? "bg-secondary"
                                      : "bg-secondary"}`}
                              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
                            >
                              {contract.status || "Not Available"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <i
                                className="fa-regular fa-eye"
                                style={{ color: "#0d99ff", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
                                title="View Details"
                                onClick={() => navigate('/contractdetail', { state: { contract: contract } })}
                              />
                              <i
                                className="fa-regular fa-pen-to-square"
                                style={{ color: "#624de3", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
                                title="Edit"
                                onClick={() => handleEdit(contract)}
                              />
                              <i
                                className="fa-regular fa-comment"
                                style={{ color: "#32CD32", cursor: "pointer", fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
                                title="Comments"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalToggle2"
                              />
                              <button
                                className="btn btn-link text-decoration-none p-0"
                                style={{
                                  color: "green",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDownloadPdf(
                                    contract.pdfUrl || `${import.meta.env.VITE_APP_API_BASE_URL}/${contract.contractType?.customAgreementFile}`
                                  );
                                }}
                                title="Download"
                              >
                                <i className="fa-solid fa-download"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">No contracts available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mb-0">
                  {/* Previous Button */}
                  <li className={`page-item ${contracts.pagination.currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link text-secondary px-3 py-2"
                      onClick={() =>
                        handlePageChange(contracts.pagination.currentPage - 1)
                      }
                      disabled={contracts.pagination.currentPage === 1}
                      style={{
                        minWidth: "80px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.25rem",
                        cursor: contracts.pagination.currentPage === 1 ? "not-allowed" : "pointer"
                      }}
                    >
                      Previous
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: contracts.pagination.totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item mx-1 ${contracts.pagination.currentPage === page ? "active" : ""
                        }`}
                    >
                      <button
                        className={`page-link rounded fw-semibold px-3 py-2 ${contracts.pagination.currentPage === page
                          ? "text-white"
                          : "text-dark"
                          }`}
                        style={{
                          backgroundColor:
                            contracts.pagination.currentPage === page
                              ? "#0096d4"
                              : "rgb(212, 212, 212)",
                          minWidth: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #dee2e6",
                          borderRadius: "0.25rem",
                          cursor: "pointer"
                        }}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Next Button */}
                  <li
                    className={`page-item ${contracts.pagination.currentPage ===
                      contracts.pagination.totalPages
                      ? "disabled"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link text-secondary px-3 py-2"
                      onClick={() =>
                        handlePageChange(contracts.pagination.currentPage + 1)
                      }
                      disabled={
                        contracts.pagination.currentPage ===
                        contracts.pagination.totalPages
                      }
                      style={{
                        minWidth: "80px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.25rem",
                        cursor: contracts.pagination.currentPage === contracts.pagination.totalPages ? "not-allowed" : "pointer"
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal for Details */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  More Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedContract ? (
                  <ul>
                    <li>
                      <strong>Contract ID:</strong> {selectedContract.id}
                    </li>
                    <li>
                      {/* <strong>Supplier Name:</strong> {selectedContract.supplierName} */}
                    </li>
                    <li>
                      <strong>Type of Contract:</strong> {selectedContract.contractType.type}
                    </li>
                    <li>
                      <strong>Department:</strong> {selectedContract.department.name}
                    </li>
                    <li>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge rounded-pill px-5 py-1 ${selectedContract.status === "Active"
                          ? "activebadge"
                          : selectedContract.status === "Expired"
                            ? "expiredbadge"
                            : selectedContract.status === "Under Renewal"
                              ? "renewalbadge"
                              : selectedContract.status === "Terminated"
                                ? "terminatedbadge"
                                : ""
                          }`}
                      >
                        {selectedContract.status}
                      </span>
                    </li>
                    <li>
                      <strong>Description:</strong>{" "}
                      {selectedContract.description}
                    </li>
                  </ul>
                ) : (
                  <p>No contract selected.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModalToggle2"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel2"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalToggleLabel2">
                  Enter Comments
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                  ></textarea>
                  <label htmlFor="floatingTextarea">Comments</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  data-bs-target="#exampleModalToggle"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  style={{ backgroundColor: "#578e7e", color: "white" }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Contractmanage;