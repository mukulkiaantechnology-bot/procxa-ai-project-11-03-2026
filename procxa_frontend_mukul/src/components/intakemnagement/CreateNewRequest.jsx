// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import useApi from "../../hooks/useApi"
// import endpoints from "../../api/endPoints";
// import CreatableSelect from "react-select/creatable";

// const CreateNewRequest = () => {
//   const { get, post } = useApi();
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [errors, setErrors] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubCategories] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [startDateFocus, setStartDateFocus] = useState(false);
//   const [endDateFocus, setEndDateFocus] = useState(false);
//   const [showMoreInfo, setShowMoreInfo] = useState(false);

//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     requestType: "",
//     category: "",
//     subcategory: "",
//     engagementType: "",
//     itemDescription: "",
//     projectName: "",
//     quantity: "",
//     duration: "",
//     executionTimeline: "",
//     reasonForEarlierExecution: "",
//     serviceDuration: "",
//     amendmentType: "",
//     contractDocument: "",
//     budgetCode: "",
//     requestedAmount: "",
//     requesterName: "",
//     requesterDepartmentId: "",
//     requesterEmail: "",
//     requesterContactNumber: "",
//     additionalDescription: "",
//     authorizedSignatory: "",
//     reqAttachMentfile: "",
//     suppliersCountry: "",
//     subcontractorInvolved: "",
//     subcontractorInfo: "",
//     vendor: "",
//     contract: "",
//     helpDescription: "",
//     whatToBuy: "",
//     addLicenseToExistingProduct: false,
//     involvesCloud: false,
//     shareCustomerOrEmployeeInfo: false,
//     rfpCompetitiveBid: false,
//     status: "pending",
//     intakeAttachment: "",
//     supplierEmail: "",
//     supplierName: "",
//     supplierContact: "",
//     startDate: "",
//     endDate: ""
//   });

//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files[0],
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.requestType) {
//       newErrors.requestType = "Ye field zaroori hai – Request Type";
//     }
//     if (!formData.category) {
//       newErrors.category = "Ye field zaroori hai – Category";
//     }
//     if (!formData.itemDescription) {
//       newErrors.itemDescription = "Ye field zaroori hai – Item Description";
//     }
//     if (!formData.requesterName) {
//       newErrors.requesterName = "Ye field zaroori hai – Requester Name";
//     }
//     if (!formData.requesterDepartmentId) {
//       newErrors.requesterDepartmentId = "Ye field zaroori hai – Department";
//     }
//     if (!formData.requesterEmail) {
//       newErrors.requesterEmail = "Ye field zaroori hai – Email";
//     }
//     if (!formData.startDate) {
//       newErrors.startDate = "Ye field zaroori hai – Start Date";
//     }
//     if (!formData.endDate) {
//       newErrors.endDate = "Ye field zaroori hai – End Date";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setMessage({ type: "error", text: "Please fill all required fields." });
//       return;
//     }

//     const payload = new FormData();
//     Object.keys(formData).forEach((key) => {
//       const value = formData[key] !== null && formData[key] !== undefined
//         ? formData[key]
//         : "";
//       payload.append(key, value);
//     });

//     try {
//       const response = await post(endpoints.addIntakeRequest, payload);
//       setMessage({ type: "success", text: response.message || "Request submitted successfully!" });
//       // Reset form after successful submission
//       setTimeout(() => {
//         navigate("/intakemanagement");
//       }, 2000);
//     } catch (error) {
//       console.error("Error submitting the request:", error);
//       setMessage({ type: "error", text: error.message || "Failed to submit the request." });
//     }
//   };

// const fetchCategoriesAndSubCategoriesAndDepartment = async () => {
//   try {
//     const categoryResponse = await get(endpoints.getCategory).catch((error) => {
//       console.error("Failed to fetch categories:", error);
//       return null;
//     });

// const subCategoryResponse = await get(endpoints.getSubCategory).catch((error) => {
//   console.error("Failed to fetch subcategories:", error);
//   return null;
// });

//       const departmentsResponse = await get(endpoints.getAllDepartments).catch((error) => {
//         console.error("Failed to fetch departments:", error);
//         return null;
//       });

//       const supplierResponse = await get(endpoints.getSuppliers).catch((error) => {
//         console.error("Failed to fetch suppliers:", error);
//         return null;
//       });

//       if (categoryResponse && (categoryResponse?.categories?.length > 0 || categoryResponse?.data?.length > 0)) {
//         setCategories(categoryResponse.categories || categoryResponse.data || []);
//       }

//       if (subCategoryResponse && (subCategoryResponse?.subcategories?.length > 0 || subCategoryResponse?.data?.length > 0)) {
//         setSubCategories(subCategoryResponse.subcategories || subCategoryResponse.data || []);
//       }

//       if (departmentsResponse && departmentsResponse?.data?.length > 0) {
//         setDepartments(departmentsResponse.data);
//       }

//       if (supplierResponse && supplierResponse?.data?.length > 0) {
//         setSuppliers(supplierResponse.data);
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategoriesAndSubCategoriesAndDepartment();
//   }, []);

//   const supplierOptions = suppliers.map((supplier) => ({
//     label: `${supplier.name}${supplier.contactEmail ? ` (${supplier.contactEmail})` : ""}`,
//     value: supplier.id || supplier.contactEmail,
//     supplier,
//   }));

//   const handleSupplierChange = (selectedOption) => {
//     if (selectedOption && selectedOption.supplier) {
//       setFormData({
//         ...formData,
//         supplierName: selectedOption.supplier.name,
//         supplierEmail: selectedOption.supplier.contactEmail || "",
//         supplierContact: selectedOption.supplier.contactPhone || "",
//       });
//     } else if (selectedOption) {
//       setFormData({
//         ...formData,
//         supplierName: selectedOption.label,
//         supplierEmail: "",
//         supplierContact: "",
//       });
//     } else {
//       setFormData({
//         ...formData,
//         supplierName: "",
//         supplierEmail: "",
//         supplierContact: "",
//       });
//     }
//   };

//   const departmentOptions = departments.map((dept) => ({
//     label: dept.name,
//     value: dept.id,
//     department: dept,
//   }));

//   const handleDepartmentChange = (selectedOption) => {
//     if (selectedOption && selectedOption.department) {
//       setFormData({
//         ...formData,
//         requesterDepartmentId: selectedOption.department.id,
//       });
//     } else if (selectedOption) {
//       // New department typed
//       setFormData({
//         ...formData,
//         requesterDepartmentId: selectedOption.label,
//       });
//     } else {
//       setFormData({
//         ...formData,
//         requesterDepartmentId: "",
//       });
//     }
//     if (errors.requesterDepartmentId) {
//       setErrors((prev) => ({ ...prev, requesterDepartmentId: "" }));
//     }
//   };

//   // const categoryOptions = categories.map((category) => ({
//   //   value: category.id,
//   //   label: category.name,
//   // }));

// const categoryOptions = categories.map((category) => ({
//   value: Number(category.id),
//   label: category.name,
// }));

//   // const subcategoryOptions = subcategories
//   //   .filter((subcat) => !formData.category || subcat.categoryId === formData.category)
//   //   .map((subcategory) => ({
//   //     value: subcategory.id,
//   //     label: subcategory.name,
//   //   }));


// const subcategoryOptions = subcategories
// .filter(
//   (subcat) =>
//     !formData.category ||
//     Number(subcat.categoryId) === Number(formData.category)
// )
// .map((subcategory) => ({
//   value: subcategory.id,
//   label: subcategory.name,
// }));

//   return (
//     <div className="container mt-4 mt-md-5 mb-5">
//       {message.text && (
//         <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`}>
//           {message.text}
//           <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
//         </div>
//       )}

//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
//         <div>
//           <h3 className="fw-bold mb-1">Create New Request</h3>
//           <p className="text-muted mb-0">Please Provide the details of your request</p>
//         </div>
//         <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
//           <Link to="/intakemyrequ" className="text-decoration-none">
//             <button className="btn w-100" style={{ backgroundColor: '#578E7E', color: 'white', border: 'none' }}>
//               <i className="fa-solid fa-book me-2"></i> My Request
//             </button>
//           </Link>
//           <button className="btn w-100" style={{ backgroundColor: '#578E7E', color: 'white', border: 'none' }} onClick={() => navigate(-1)}>
//             <i className="fa-solid fa-arrow-left me-2"></i> Back
//           </button>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* Request Type */}
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Request Type <span className="text-danger">*</span></label>
//             <select
//               id="requestType"
//               className={`form-select p-3 ${errors.requestType ? "is-invalid" : ""}`}
//               name="requestType"
//               value={formData.requestType}
//               onChange={handleChange}
//             >
//               <option value="">Select Request Type</option>
//               <option value="new_agreement">New Agreement</option>
//               <option value="agreement">Agreement</option>
//               <option value="amendment">Amendment</option>
//               <option value="termination">Termination</option>
//             </select>
//             {errors.requestType && <div className="invalid-feedback">{errors.requestType}</div>}
//           </div>
//         </div>

//         {/* Category and Subcategory */}
//         <h5 className="border-bottom pb-2 mb-3 fw-semibold">What is the category of your request?</h5>
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Category <span className="text-danger">*</span></label>
//             <div className="d-flex gap-2">
//               <div className="flex-grow-1">
//             <CreatableSelect
//   options={categoryOptions}
//   value={categoryOptions.find(
//     (option) => option.value === formData.category
//   ) || null}
//   onChange={async (selectedOption) => {
//     const categoryId = selectedOption ? selectedOption.value : "";

//     // 1️⃣ category set karo, subcategory reset
//     setFormData((prev) => ({
//       ...prev,
//       category: categoryId,
//       subcategory: "",
//     }));

//     // 2️⃣ agar category select hui hai → subcategory lao
//     if (categoryId) {
//       try {
//         const res = await get(
//           `${endpoints.getSubCategory}?categoryId=${categoryId}`
//         );

//         setSubCategories(res?.subcategories || []);
//       } catch (error) {
//         console.error("Failed to fetch subcategories:", error);
//         setSubCategories([]);
//       }
//     } else {
//       setSubCategories([]);
//     }

//     if (errors.category) {
//       setErrors((prev) => ({ ...prev, category: "" }));
//     }
//   }}
//   placeholder="Type or select category"
//   isClearable
//   styles={{
//                 control: (base) => ({
//                   ...base,
//                   padding: "6px 4px",
//                   minHeight: '60px',
//                   fontSize: "16px",
//                   borderRadius: "0.375rem",
//                   borderColor: "#ced4da",
//                   cursor: "pointer",
//                 }),
//               }}

// />

//               </div>
//               <Link to="/intakecateedit" className="btn btn-outline-secondary d-flex align-items-center" style={{ minWidth: "45px", height: "60px" }} title="Edit Category">
//                 <i className="fa-solid fa-pencil"></i>
//               </Link>
//             </div>
//             {errors.category && <div className="text-danger small mt-1">{errors.category}</div>}
// </div>

// <div className="col-md-4 mb-3">
//   <label className="form-label fw-semibold">Subcategory</label>
//   <CreatableSelect
//     options={subcategoryOptions}
//     value={subcategoryOptions.find(option => option.value === formData.subcategory) || null}
//     onChange={(selectedOption) =>
//       setFormData({ ...formData, subcategory: selectedOption ? selectedOption.value : "" })
//     }
//     placeholder="Type or select subcategory"
//     isClearable
//     isSearchable
//     isDisabled={!formData.category}
//     styles={{
//       control: (base) => ({
//         ...base,
//         padding: "6px 4px",
//         minHeight: '60px',
//         fontSize: "16px",
//         borderRadius: "0.375rem",
//         borderColor: "#ced4da",
//         cursor: "pointer",
//       }),
//     }}
//   />
//           </div>

//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Engagement Type</label>
//             <select
//               id="engagementType"
//               name="engagementType"
//               value={formData.engagementType}
//               onChange={handleChange}
//               className="form-select p-3"
//             >
//               <option value="">Select Engagement Type</option>
//               <option value="new_supplier">New Supplier</option>
//               <option value="old_supplier">Old/Onboarded Supplier</option>
//             </select>
//           </div>
//         </div>

//         {/* Request Details */}
//         <h5 className="border-bottom pb-2 mb-3 fw-semibold">Request Details</h5>
//         <div className="row mb-3">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Item Description <span className="text-danger">*</span></label>
//             <input
//               type="text"
//               id="itemDescription"
//               name="itemDescription"
//               placeholder="Item Description"
//               value={formData.itemDescription}
//               onChange={handleChange}
//               className={`form-control p-3 ${errors.itemDescription ? "is-invalid" : ""}`}
//             />
//             {errors.itemDescription && <div className="invalid-feedback">{errors.itemDescription}</div>}
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Project Name</label>
//             <input
//               type="text"
//               id="projectName"
//               name="projectName"
//               placeholder="Project Name"
//               value={formData.projectName}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Quantity (for Goods)</label>
//             <input
//               type="number"
//               id="quantity"
//               name="quantity"
//               placeholder="Quantity"
//               value={formData.quantity}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//         </div>

//         <div className="row mb-3">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Duration (for Services)</label>
//             <input
//               type="text"
//               id="duration"
//               name="duration"
//               placeholder="Duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Start Date <span className="text-danger">*</span></label>
//             <input
//               type={startDateFocus ? "date" : "text"}
//               id="startDate"
//               name="startDate"
//               className={`form-control p-3 ${errors.startDate ? "is-invalid" : ""}`}
//               value={formData.startDate}
//               onChange={handleChange}
//               placeholder="Start Date"
//               onFocus={() => setStartDateFocus(true)}
//               onBlur={(e) => {
//                 if (!e.target.value) setStartDateFocus(false);
//               }}
//             />
//             {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">End Date <span className="text-danger">*</span></label>
//             <input
//               type={endDateFocus ? "date" : "text"}
//               id="endDate"
//               name="endDate"
//               className={`form-control p-3 ${errors.endDate ? "is-invalid" : ""}`}
//               value={formData.endDate}
//               onChange={handleChange}
//               placeholder="End Date"
//               onFocus={() => setEndDateFocus(true)}
//               onBlur={(e) => {
//                 if (!e.target.value) setEndDateFocus(false);
//               }}
//             />
//             {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
//           </div>
//         </div>

//         <div className="row mb-3">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Execution Timeline</label>
//             <input
//               type="text"
//               id="executionTimeline"
//               name="executionTimeline"
//               placeholder="Execution Timeline"
//               value={formData.executionTimeline}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Amendment Type</label>
//             <select
//               id="amendmentType"
//               name="amendmentType"
//               className="form-select p-3"
//               value={formData.amendmentType}
//               onChange={handleChange}
//             >
//               <option value="">Select Amendment Type</option>
//               <option value="amendment">Amendment</option>
//               <option value="extension">Extension</option>
//               <option value="renewal">Renewal</option>
//               <option value="sow">SOW</option>
//             </select>
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Reason for earlier execution (IF Services)</label>
//             <input
//               type="text"
//               id="reasonForEarlierExecution"
//               name="reasonForEarlierExecution"
//               placeholder="Reason for earlier execution"
//               value={formData.reasonForEarlierExecution}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//         </div>

//         {/* Budget Information */}
//         <h5 className="border-bottom pb-2 mb-3 fw-semibold">Budget Information</h5>
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Budget Code</label>
//             <input
//               type="text"
//               id="budgetCode"
//               name="budgetCode"
//               placeholder="Budget Code"
//               className="form-control p-3"
//               value={formData.budgetCode}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Requested Amount</label>
//             <input
//               type="number"
//               id="requestedAmount"
//               name="requestedAmount"
//               placeholder="Requested Amount"
//               className="form-control p-3"
//               value={formData.requestedAmount}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* Requester Information */}
//         <h5 className="border-bottom pb-2 mb-3 fw-semibold">Requester Information</h5>
//         <div className="row mb-3">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Name <span className="text-danger">*</span></label>
//             <input
//               type="text"
//               id="requesterName"
//               name="requesterName"
//               placeholder="Name"
//               value={formData.requesterName}
//               onChange={handleChange}
//               className={`form-control p-3 ${errors.requesterName ? "is-invalid" : ""}`}
//             />
//             {errors.requesterName && <div className="invalid-feedback">{errors.requesterName}</div>}
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Department <span className="text-danger">*</span></label>
//             <CreatableSelect
//               options={departmentOptions}
//               value={departmentOptions.find(option => option.value === formData.requesterDepartmentId) || 
//                      (formData.requesterDepartmentId && typeof formData.requesterDepartmentId === 'string' ? 
//                       { label: formData.requesterDepartmentId, value: formData.requesterDepartmentId } : null)}
//               onChange={handleDepartmentChange}
//               placeholder="Type or select department"
//               isClearable
//               isSearchable
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   padding: "6px 4px",
//                   minHeight: '60px',
//                   fontSize: "16px",
//                   borderRadius: "0.375rem",
//                   borderColor: errors.requesterDepartmentId ? "#dc3545" : "#ced4da",
//                   cursor: "pointer",
//                 }),
//               }}
//             />
//             {errors.requesterDepartmentId && <div className="text-danger small mt-1">{errors.requesterDepartmentId}</div>}
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
//             <input
//               type="email"
//               id="requesterEmail"
//               name="requesterEmail"
//               placeholder="Email"
//               value={formData.requesterEmail}
//               onChange={handleChange}
//               className={`form-control p-3 ${errors.requesterEmail ? "is-invalid" : ""}`}
//             />
//             {errors.requesterEmail && <div className="invalid-feedback">{errors.requesterEmail}</div>}
//           </div>
//         </div>
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Contact Number</label>
//             <input
//               type="text"
//               id="requesterContactNumber"
//               name="requesterContactNumber"
//               placeholder="Contact Number"
//               value={formData.requesterContactNumber}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//           <div className="col-md-8 mb-3">
//             <label className="form-label fw-semibold">Additional Description</label>
//             <input
//               type="text"
//               id="additionalDescription"
//               name="additionalDescription"
//               placeholder="Additional Description"
//               value={formData.additionalDescription}
//               onChange={handleChange}
//               className="form-control p-3"
//             />
//           </div>
//         </div>

//         {/* Attachments */}
//         <h5 className="border-bottom pb-2 mb-3 fw-semibold">Attachments</h5>
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <label htmlFor="intakeAttachment" className="btn btn-outline-secondary w-100 p-3">
//               <i className="fa-solid fa-file-import me-2"></i>
//               Click to Upload
//               <input
//                 type="file"
//                 id="intakeAttachment"
//                 name="intakeAttachment"
//                 className="d-none"
//                 onChange={handleFileChange}
//               />
//             </label>
//           </div>
//         </div>

//         {/* Supplier Information */}
//         <h5 className="border-bottom pb-2 mb-3 fw-semibold">Supplier Information</h5>
//         <div className="row mb-3">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Supplier Name</label>
//             <CreatableSelect
//               isClearable
//               placeholder="Type or select supplier name"
//               options={supplierOptions}
//               onChange={handleSupplierChange}
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   minHeight: '60px',
//                   borderColor: '#ced4da',
//                   boxShadow: 'none',
//                   '&:hover': {
//                     borderColor: '#86b7fe',
//                   },
//                 }),
//                 valueContainer: (base) => ({
//                   ...base,
//                   padding: '0 12px',
//                 }),
//                 indicatorsContainer: (base) => ({
//                   ...base,
//                   height: '56px',
//                 }),
//               }}
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Supplier Email</label>
//             <input
//               type="email"
//               id="supplierEmail"
//               name="supplierEmail"
//               placeholder="Supplier Email"
//               className="form-control p-3"
//               value={formData.supplierEmail}
//               onChange={(e) => setFormData({ ...formData, supplierEmail: e.target.value })}
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Supplier Contact</label>
//             <input
//               type="text"
//               id="supplierContact"
//               name="supplierContact"
//               placeholder="Supplier Contact"
//               className="form-control p-3"
//               value={formData.supplierContact}
//               onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
//             />
//           </div>
//         </div>

//         {/* RFP / Competitive Bid Checkbox */}
//         <div className="form-check mb-3">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             id="rfpCompetitiveBid"
//             name="rfpCompetitiveBid"
//             checked={formData.rfpCompetitiveBid}
//             onChange={handleChange}
//           />
//           <label className="form-check-label" htmlFor="rfpCompetitiveBid">
//             RFP / Competitive Bid
//           </label>
//         </div>

//         {/* License Checkbox */}
//         <div className="form-check mb-3">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             id="addLicenseToExistingProduct"
//             name="addLicenseToExistingProduct"
//             checked={formData.addLicenseToExistingProduct}
//             onChange={handleChange}
//           />
//           <label className="form-check-label" htmlFor="addLicenseToExistingProduct">
//             Do you need to add licenses for an existing product?
//           </label>
//         </div>

//         {/* More Info Collapsible Section */}
//         <div className="card mb-4">
//           <div className="card-header bg-light" style={{ cursor: "pointer" }} onClick={() => setShowMoreInfo(!showMoreInfo)}>
//             <h5 className="mb-0 d-flex justify-content-between align-items-center">
//               <span>More Info</span>
//               <i className={`fa-solid fa-chevron-${showMoreInfo ? "up" : "down"}`}></i>
//             </h5>
//           </div>
//           {showMoreInfo && (
//             <div className="card-body">
//               <div className="form-check mb-2">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="involvesCloud"
//                   checked={formData.involvesCloud}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, involvesCloud: e.target.checked }))
//                   }
//                 />
//                 <label className="form-check-label" htmlFor="involvesCloud">
//                   Does it involve cloud?
//                 </label>
//               </div>
//               <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id="shareInfo"
//                   checked={formData.shareCustomerOrEmployeeInfo}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       shareCustomerOrEmployeeInfo: e.target.checked,
//                     }))
//                   }
//                 />
//                 <label className="form-check-label" htmlFor="shareInfo">
//                   Does this contract need to share customer/employee info?
//                 </label>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="d-flex justify-content-center mb-4">
//           <button type="submit" className="btn px-5 py-2" style={{ backgroundColor: '#578E7E', color: 'white', border: 'none' }}>
//             <i className="fa-solid fa-save me-2"></i> Initiate Process
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateNewRequest; 








import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useApi from "../../hooks/useApi"
import endpoints from "../../api/endPoints";
import CreatableSelect from "react-select/creatable";

const CreateNewRequest = () => {
  const { get, post } = useApi();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [categories, setCategories] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [startDateFocus, setStartDateFocus] = useState(false);
  const [endDateFocus, setEndDateFocus] = useState(false);
  const [contractTemplates, setContractTemplates] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestType: "",
    category: "",

    engagementType: "",
    itemDescription: "",
    quantity: "",
    duration: "",
    executionTimeline: "",
    reasonForEarlierExecution: "",
    serviceDuration: "",
    amendmentType: "",
    contractDocument: "",
    budgetCode: "",
    requestedAmount: "",
    requesterName: "",
    requesterDepartmentId: "",
    requesterEmail: "",
    requesterContactNumber: "",
    additionalDescription: "",
    authorizedSignatory: "",
    reqAttachMentfile: "",
    suppliersCountry: "",
    subcontractorInvolved: "",
    subcontractorInfo: "",
    vendor: "",
    contract: "",
    helpDescription: "",
    whatToBuy: "",
    addLicenseToExistingProduct: "",
    involvesCloud: false,
    shareCustomerOrEmployeeInfo: false,
    status: "pending",
    intakeAttachment: "",
    supplierEmail: "",
    supplierName: "",
    supplierContact: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key] !== null && formData[key] !== undefined
        ? formData[key]
        : "";

      payload.append(key, value);
    });

    try {
      const response = await post(endpoints.addIntakeRequest, payload);
      setMessage({ type: "success", text: response.message });
      navigate("/intakemanagement");
    } catch (error) {
      console.error("Error submitting the request:", error);
      setMessage({ type: "error", text: error.message || "Failed to submit the request." });
    }
  };
  const fetchCategoriesAndSubCategoriesAndDepartment = async () => {
    try {
      const categoryResponse = await get(endpoints.getCategory).catch((error) => {
        console.error("Failed to fetch categories:", error);
        return null;
      });



      const departmentsResponse = await get(endpoints.getAllDepartments).catch((error) => {
        console.error("Failed to fetch departments:", error);
        return null;
      });
      const supplierResponse = await get(endpoints.getSuppliers).catch((error) => {
        console.error("Failed to fetch suppliers:", error);
        return null;
      });

      // Handling categories
      if (categoryResponse && categoryResponse?.categories?.length > 0) {
        setCategories(categoryResponse.categories);
      } else {
        console.error(categoryResponse?.message || "No categories found.");
      }



      // Handling departments
      if (departmentsResponse && departmentsResponse?.data?.length > 0) {
        console.log(departmentsResponse.data, "h");
        setDepartments(departmentsResponse.data);
      } else {
        console.error(departmentsResponse?.message || "No departments found.");
      }

      if (supplierResponse && supplierResponse?.data?.length > 0) {
        setSuppliers(supplierResponse.data);
      } else {
        console.error(supplierResponse?.message || "No suppliers found.");
      }

      const templatesResponse = await get(endpoints.getAllContractTemplates).catch((error) => {
        console.error("Failed to fetch contract templates:", error);
        return null;
      });

      if (templatesResponse && templatesResponse?.templates?.length > 0) {
        setContractTemplates(templatesResponse.templates);
      } else {
        console.error(templatesResponse?.message || "No contract templates found.");
      }


    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubCategoriesAndDepartment();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await get(endpoints.getProfile);
      if (response && response.data) {
        const user = response.data;
        const userType = localStorage.getItem("userType");

        setFormData((prev) => ({
          ...prev,
          requesterName: user.first_name || user.name || prev.requesterName,
          requesterEmail: user.email_id || user.email || prev.requesterEmail,
          // If the user is a department type, they should be their own department
          requesterDepartmentId: userType === "department" ? user.id : prev.requesterDepartmentId,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };
  const supplierOptions = suppliers.map((supplier) => ({
    label: `${supplier.name} (${supplier.contactEmail})`,
    value: supplier.contactEmail,
    supplier,
  }));
  const handleSupplierChange = (selectedOption) => {
    if (selectedOption && selectedOption.supplier) {
      // Existing supplier selected
      setFormData({
        ...formData,
        supplierName: selectedOption.supplier.name,
        supplierEmail: selectedOption.supplier.contactEmail,
        supplierContact: selectedOption.supplier.contactPhone,
      });
    } else if (selectedOption) {
      // New supplier typed
      setFormData({
        ...formData,
        supplierName: selectedOption.label,
        supplierEmail: "",
        supplierContact: "",
      });
    } else {
      // Cleared
      setFormData({
        ...formData,
        supplierName: "",
        supplierEmail: "",
        supplierContact: "",
      });
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: Number(category.id),
    label: category.name,
  }));



  return (
    <div className="container mt-5">
      {message.text && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
            }`}
        >
          {message.text}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h3 className="fw-bold" style={{ textAlign: 'start', margin: 0 }}>Create New Request</h3>
          <p style={{ textAlign: 'start', margin: 0 }}>Please Provide the details of your request</p>

        </div>
        <div className="d-flex justify-content-end gap-2">
          <button
            style={{
              width: "120px",
              height: "49px", // Made height consistent with "My Request" button
              border: "none",
              backgroundColor: "#578E7E",
              color: "white",
              borderRadius: "5px",
              fontSize: '16px', // Consistent font size
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

        <style>
          {`
      @media (max-width: 768px) {
        div[style*="display: flex"] {
          flex-direction: column; /* Stack items vertically */
          align-items: flex-start; /* Align items to start */
        }
        button {
          width: 100%; /* Full-width button on smaller screens */
          margin-top: 15px; /* Add spacing between sections */
        }
      }
    `}
        </style>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3 mt-5">
          <div className="col-md-3 mb-3">
            <select
              id="requestType"
              className="form-select p-3"
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Request Type</option>
              <option value="new_agreement">New Agreement</option>
              <option value="agreement">Agreement</option>
              <option value="amendment">Amendment</option>
              <option value="termination">Termination</option>
              <option value="travel">Travel</option>
            </select>
          </div>
        </div>




        {/* Category and Subcategory */}
        <h5 style={{ borderBottom: "1px solid black", textAlign: "start", marginBottom: "15px" }}>
          What is the category of your request?
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">

            <CreatableSelect
              options={categoryOptions}
              value={categoryOptions.find(
                (option) => option.value === formData.category
              ) || null}
              onChange={async (selectedOption) => {
                const categoryId = selectedOption ? selectedOption.value : "";

                // category set karo
                setFormData((prev) => ({
                  ...prev,
                  category: categoryId,
                }));

                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: "" }));
                }
              }}
              placeholder="Type or select category"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  padding: "6px 4px",
                  minHeight: '60px',
                  fontSize: "16px",
                  borderRadius: "0.375rem",
                  borderColor: "#ced4da",
                  cursor: "pointer",
                }),
              }}

            />
          </div>





          <div className="col-md-4 mb-3">
            <select
              id="engagementType"
              name="engagementType"
              value={formData.engagementType}
              onChange={handleChange}
              className="form-select p-3"
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Engagement Type</option>
              <option value="new_supplier">New Supplier</option>
              <option value="old_supplier">Old/Onboarded Supplier</option>
            </select>
          </div>

        </div>

        {/* Request Details */}
        <h5 style={{ borderBottom: "1px solid black", textAlign: "start", marginBottom: "15px" }}>
          Request Details
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="itemDescription"
              name="itemDescription"
              placeholder="Item Description"
              value={formData.itemDescription}
              onChange={handleChange}
              className="form-control p-3"
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantity (for Goods)"
              value={formData.quantity}
              onChange={handleChange}
              className="form-control p-3"
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="Duration (for Services)"
              value={formData.duration}
              onChange={handleChange}
              className="form-control p-3"
            />
          </div>
        </div>


        <div className="row">
          <div className="col-md-4 mb-4">
            <input
              type="text"
              id="executionTimeline"
              name="executionTimeline"
              placeholder="Execution Timeline"
              className="form-control p-3"
              value={formData.executionTimeline}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-4">
            <input
              type="text"
              id="reasonForEarlierExecution"
              name="reasonForEarlierExecution"
              placeholder="Reason for earlier execution (IF Services)"
              className="form-control p-3"
              value={formData.reasonForEarlierExecution}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <select
              id="amendmentType"
              name="amendmentType"
              className="form-select p-3"
              style={{ fontSize: '16px', fontFamily: 'inherit', color: 'gray' }}
              value={formData.amendmentType}
              onChange={handleChange}
            >
              <option value="">Select Amendment Type</option>
              <option value="amendment">Amendment</option>
              <option value="extension">Extension</option>
              <option value="renewal">Renewal</option>
              <option value="sow">SOW</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <input
              type={startDateFocus ? "date" : "text"}
              id="startDate"
              name="startDate"
              className="form-control p-3"
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Start Date"
              onFocus={() => setStartDateFocus(true)}
              onBlur={(e) => {
                if (!e.target.value) setStartDateFocus(false);
              }}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              type={endDateFocus ? "date" : "text"}
              id="endDate"
              name="endDate"
              className="form-control p-3"
              style={{ fontSize: '16px', fontFamily: 'inherit' }}
              value={formData.endDate}
              onChange={handleChange}
              placeholder="End Date"
              onFocus={() => setEndDateFocus(true)}
              onBlur={(e) => {
                if (!e.target.value) setEndDateFocus(false);
              }}
            />
          </div>
        </div>


        {/* Budget Information */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Budget Information
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="budgetCode"
              name="budgetCode"
              placeholder="Budget Code"
              className="form-control p-3"
              value={formData.budgetCode}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              id="requestedAmount"
              name="requestedAmount"
              placeholder="Requested Amount"
              className="form-control p-3"
              value={formData.requestedAmount}
              onChange={handleChange}
            />
          </div>
        </div>


        {/* Requester Information */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Requester Information
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label className="form-label"><strong>Requester Name <span className="text-danger">*</span></strong></label>
            <input
              type="text"
              id="requesterName"
              name="requesterName"
              placeholder="Name"
              className="form-control p-3"
              value={formData.requesterName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label"><strong>Department</strong></label>
            <select
              id="requesterDepartmentId"
              className="form-select p-3"
              name="requesterDepartmentId"
              value={formData.requesterDepartmentId}
              onChange={handleChange}
              style={{ fontSize: "16px", fontFamily: "inherit", color: "gray" }}
            >
              <option value="">Select Department</option>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Not Available</option>
              )}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label"><strong>Requester Email <span className="text-danger">*</span></strong></label>
            <input
              type="email"
              id="requesterEmail"
              name="requesterEmail"
              placeholder="Email"
              className="form-control p-3"
              value={formData.requesterEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              id="requesterContactNumber"
              name="requesterContactNumber"
              placeholder="Contact Number"
              className="form-control p-3"
              value={formData.requesterContactNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-8 mb-3">
            <input
              type="text"
              id="additionalDescription"
              name="additionalDescription"
              placeholder="Additional Description"
              className="form-control p-3"
              value={formData.additionalDescription}
              onChange={handleChange}
            />
          </div>
        </div>



        {/* Attachments */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Attachments
        </h5>
        <div className="row mb-3">
          <div className="col-md-4 mb-3">
            <label htmlFor="intakeAttachment" className="btn text-secondary w-100 p-3">
              <i className="fa-solid fa-file-import pe-2"></i>
              Click to Upload
              <input
                type="file"
                id="intakeAttachment"
                name="intakeAttachment"
                className="d-none"  // Hide the input
                onChange={(e) => handleFileChange(e)}  // Handle file change
              />
            </label>
          </div>
        </div>
        {/*Supplier Information */}
        <h5 style={{ borderBottom: "1px solid black", marginBottom: "15px" }}>
          Supplier Information
        </h5>
        <div className="row mb-3 align-items-end">
          <div className="col-md-4 mb-3">
            <label><strong>Supplier Name</strong></label>
            <CreatableSelect
              isClearable
              placeholder="supplier name"
              options={supplierOptions}
              onChange={handleSupplierChange}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '60px', // same as p-3 input
                  borderColor: '#ced4da',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#86b7fe',
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 12px',
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: '56px',
                }),
              }}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label><strong>Supplier Email</strong></label>
            <input
              type="email"
              id="supplierEmail"
              name="supplierEmail"
              placeholder="Supplier Email"
              className="form-control p-3"
              value={formData.supplierEmail}
              onChange={(e) =>
                setFormData({ ...formData, supplierEmail: e.target.value })
              }
            />
          </div>

          <div className="col-md-4 mb-3">
            <label><strong>Supplier Contact</strong></label>
            <input
              type="text"
              id="supplierContact"
              name="supplierContact"
              placeholder="Supplier Contact"
              className="form-control p-3"
              value={formData.supplierContact}
              onChange={(e) =>
                setFormData({ ...formData, supplierContact: e.target.value })
              }
            />
          </div>
        </div>

        {/* Some More Information */}
        <div className="form-check mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="involvesCloud"
            checked={formData.involvesCloud}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, involvesCloud: e.target.checked }))
            }
          />
          <label className="form-check-label" htmlFor="involvesCloud">
            Does it involve cloud?
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="shareInfo"
            checked={formData.shareCustomerOrEmployeeInfo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shareCustomerOrEmployeeInfo: e.target.checked,
              }))
            }
          />
          <label className="form-check-label" htmlFor="shareInfo">
            Does this contract need to share customer or employee information?
          </label>
        </div>




        {/* Buttons */}
        <div className="d-flex justify-content-center ">
          {/* <button type="button" className="btn me-3 " style={{ backgroundColor: 'white', border: '1px solid #578e7e', color: '#578e7e', padding: '10px', width: '150px' }}>Cancel</button> */}
          <button type="submit" className="btn " style={{ backgroundColor: '#578E7E', color: 'white', padding: '10px', width: '150px' }}>Save</button>
        </div>
      </form>
    </div>

  );
};

export default CreateNewRequest;
