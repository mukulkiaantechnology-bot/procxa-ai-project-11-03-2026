// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import useApi from "../../../hooks/useApi"; // Adjust the path as needed
// import endpoints from "../../../api/endPoints"; // Adjust the path as needed

// function PriceComparisonsForm() {
//   const navigate = useNavigate();
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState("");
//   const [selectedSupplier1, setSelectedSupplier1] = useState("");
//   const [selectedSupplier2, setSelectedSupplier2] = useState("");
//   const [message, setMessage] = useState(null); // Message state

//   const { get, post } = useApi();

//   // Fetch data for departments, subcategories, and suppliers
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const supplierResponse = await get(endpoints.getSuppliers);
//         setSuppliers(supplierResponse.data);

//         const departmentResponse = await get(endpoints.getAllDepartments);
//         setDepartments(departmentResponse.data);

//         const subcategoryResponse = await get(endpoints.getSubCategory);
//         setSubcategories(subcategoryResponse.subcategories);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter suppliers based on selected department and subcategory
//   useEffect(() => {
//     if (selectedDepartment && selectedSubcategory) {
//       const filtered = suppliers.filter(
//         (supplier) =>
//           supplier.departmentId == selectedDepartment &&
//           supplier.subcategoryId == selectedSubcategory
//       );
//       setFilteredSuppliers(filtered);
//     } else {
//       setFilteredSuppliers([]);
//     }
//   }, [selectedDepartment, selectedSubcategory, suppliers]);

//   // Handle supplier selection changes
//   const handleSupplier1Change = (e) => {
//     const selected = e.target.value;
//     setSelectedSupplier1(selected);
//     if (selected === selectedSupplier2) {
//       setSelectedSupplier2("");
//     }
//   };

//   const handleSupplier2Change = (e) => {
//     const selected = e.target.value;
//     setSelectedSupplier2(selected);
//     if (selected === selectedSupplier1) {
//       setSelectedSupplier1("");
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedSupplier1 || !selectedSupplier2 || !selectedSubcategory) {
//       setMessage({ type: "error", text: "Please select both suppliers and a subcategory for comparison." });
//       return;
//     }
//     try {
//       const response = await post(endpoints.addPriceComparison, {
//         supplier1: selectedSupplier1,
//         supplier2: selectedSupplier2,
//         subcategoryId: selectedSubcategory, // Include selected subcategoryId
//       });
//       setMessage({ type: "success", text: "Comparison submitted successfully!" });
//       setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
//     } catch (error) {
//       setMessage({ type: "error", text: "Failed to submit comparison." });
//     }
//   };

//   return (
//     <div className="priceeditcompr-section my-5">
//       <div className="container">
//         {/* Header with Back Button */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h3>Price Comparisons</h3>
//           <button className="btn btn-secondary" onClick={() => navigate(-1)}>
//             Back
//           </button>
//         </div>

//         {/* Display message if exists */}
//         {message && (
//           <div
//             className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}
//             role="alert"
//           >
//             {message.text}
//           </div>
//         )}

//         <form className="row g-3 mt-4" onSubmit={handleSubmit}>
//           <div className="col-md-6">
//             <label className="form-label">Department</label>
//             <select
//               className="form-select"
//               value={selectedDepartment}
//               onChange={(e) => setSelectedDepartment(e.target.value)}
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept.id} value={dept.id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Product Service</label>
//             <select
//               className="form-select"
//               value={selectedSubcategory}
//               onChange={(e) => setSelectedSubcategory(e.target.value)}
//               disabled={!selectedDepartment} // Disable until department is selected
//             >
//               <option value="">Select Product Service</option>
//               {subcategories.map((subcat) => (
//                 <option key={subcat.id} value={subcat.id}>
//                   {subcat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Select Comparisons 1</label>
//             <select
//               className="form-select"
//               value={selectedSupplier1}
//               onChange={handleSupplier1Change}
//               disabled={!selectedDepartment || !selectedSubcategory} // Disable until both are selected
//             >
//               <option value="">Select Supplier</option>
//               {filteredSuppliers
//                 .filter((supplier) => supplier.id !== selectedSupplier2)
//                 .map((supplier) => (
//                   <option key={supplier.id} value={supplier.id}>
//                     {supplier.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Select Comparisons 2</label>
//             <select
//               className="form-select"
//               value={selectedSupplier2}
//               onChange={handleSupplier2Change}
//               disabled={!selectedDepartment || !selectedSubcategory} // Disable until both are selected
//             >
//               <option value="">Select Supplier</option>
//               {filteredSuppliers
//                 .filter((supplier) => supplier.id !== selectedSupplier1)
//                 .map((supplier) => (
//                   <option key={supplier.id} value={supplier.id}>
//                     {supplier.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="col-12">
//             <button
//               type="submit"
//               className="btn"
//               style={{ backgroundColor: "#578e7e", color: "white" }}
//               disabled={!selectedSupplier1 || !selectedSupplier2} // Disable if suppliers are not selected
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PriceComparisonsForm;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useApi from "../../../hooks/useApi";
// import endpoints from "../../../api/endPoints";

// function PriceComparisonsForm() {
//   const navigate = useNavigate();
//   const { get, post } = useApi();

//   const [suppliers, setSuppliers] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);

//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState("");
//   const [selectedSupplier1, setSelectedSupplier1] = useState("");
//   const [selectedSupplier2, setSelectedSupplier2] = useState("");

//   const [message, setMessage] = useState(null);

//   /* ================= FETCH DATA ================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const supplierRes = await get(endpoints.getSuppliers);
//         if (supplierRes?.status) {
//           setSuppliers(supplierRes.data || []);
//         }

//         const deptRes = await get(endpoints.getAllDepartments);
//         if (deptRes?.status) {
//           setDepartments(deptRes.data || []);
//         }

//         const subcatRes = await get(endpoints.getSubCategory);
//         if (subcatRes?.status) {
//           setSubcategories(subcatRes.subcategories || []);
//         }
//       } catch (err) {
//         console.error("Error loading data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedSupplier1 || !selectedSupplier2 || !selectedSubcategory) {
//       setMessage({
//         type: "error",
//         text: "Please select both suppliers and product service",
//       });
//       return;
//     }

//     try {
//       await post(endpoints.addPriceComparison, {
//         supplier1: selectedSupplier1,
//         supplier2: selectedSupplier2,
//         subcategoryId: selectedSubcategory,
//       });

//       setMessage({
//         type: "success",
//         text: "Price comparison added successfully",
//       });

//       setTimeout(() => navigate(-1), 1500);
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: "Failed to submit price comparison",
//       });
//     }
//   };

//   return (
//     <div className="container my-5">
//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>Price Comparisons</h3>
//         <button className="btn btn-secondary" onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>

//       {/* MESSAGE */}
//       {message && (
//         <div
//           className={`alert ${
//             message.type === "success" ? "alert-success" : "alert-danger"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <form className="row g-3" onSubmit={handleSubmit}>
//         {/* Department (optional, no filter logic) */}
//         <div className="col-md-6">
//           <label className="form-label">Department</label>
//           <select
//             className="form-select"
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept.id} value={dept.id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Product / Service */}
//         <div className="col-md-6">
//           <label className="form-label">Product Service</label>
//           <select
//             className="form-select"
//             value={selectedSubcategory}
//             onChange={(e) => setSelectedSubcategory(e.target.value)}
//           >
//             <option value="">Select Product Service</option>
//             {subcategories.map((sub) => (
//               <option key={sub.id} value={sub.id}>
//                 {sub.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Supplier 1 */}
//         <div className="col-md-6">
//           <label className="form-label">Select Comparisons 1</label>
//           <select
//             className="form-select"
//             value={selectedSupplier1}
//             onChange={(e) => setSelectedSupplier1(e.target.value)}
//           >
//             <option value="">Select Supplier</option>
//             {suppliers
//               .filter((s) => s.id !== Number(selectedSupplier2))
//               .map((supplier) => (
//                 <option key={supplier.id} value={supplier.id}>
//                   {supplier.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* Supplier 2 */}
//         <div className="col-md-6">
//           <label className="form-label">Select Comparisons 2</label>
//           <select
//             className="form-select"
//             value={selectedSupplier2}
//             onChange={(e) => setSelectedSupplier2(e.target.value)}
//           >
//             <option value="">Select Supplier</option>
//             {suppliers
//               .filter((s) => s.id !== Number(selectedSupplier1))
//               .map((supplier) => (
//                 <option key={supplier.id} value={supplier.id}>
//                   {supplier.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div className="col-12">
//           <button
//             type="submit"
//             className="btn text-white"
//             style={{ backgroundColor: "#578e7e" }}
//             disabled={!selectedSupplier1 || !selectedSupplier2}
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default PriceComparisonsForm;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function PriceComparisonsForm() {
  const navigate = useNavigate();
  const { get, post } = useApi();

  const [suppliers, setSuppliers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [complementaryServices, setComplementaryServices] = useState([]); // ✅ Renamed

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // This now holds service ID
  const [selectedSupplier1, setSelectedSupplier1] = useState("");
  const [selectedSupplier2, setSelectedSupplier2] = useState("");

  const [message, setMessage] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Suppliers
        const supplierRes = await get(endpoints.getSuppliers);
        setSuppliers(Array.isArray(supplierRes?.data) ? supplierRes.data : []);

        // Fetch Departments
        const deptRes = await get(endpoints.getAllDepartments);
        setDepartments(Array.isArray(deptRes?.data) ? deptRes.data : []);

        // ✅ Fetch Complementary Services — YOUR NEW ENDPOINT
        const servicesRes = await get(endpoints.getComplementaryServices);
        // Handle both { data: [...] } and direct array
        const services = servicesRes?.data || servicesRes || [];
        setComplementaryServices(Array.isArray(services) ? services : []);
      } catch (err) {
        console.error("Error loading data:", err);
        setMessage({ type: "error", text: "Failed to load form data." });
      }
    };

    fetchData();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSupplier1 || !selectedSupplier2 || !selectedSubcategory) {
      setMessage({
        type: "error",
        text: "Please select both suppliers and product service",
      });
      return;
    }

    try {
      await post(endpoints.addPriceComparison, {
        supplier1: selectedSupplier1,
        supplier2: selectedSupplier2,
        subcategoryId: selectedSubcategory, // API expects this key
      });

      setMessage({
        type: "success",
        text: "Price comparison added successfully",
      });

      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Submit error:", err);
      setMessage({
        type: "error",
        text: "Failed to submit price comparison",
      });
    }
  };

  return (
    <div className="container my-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Price Comparisons</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Department (optional) */}
        <div className="col-md-6">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Product / Service — NOW FROM COMPLEMENTARY SERVICES */}
        <div className="col-md-6">
          <label className="form-label">Product Service</label>
          <select
            className="form-select"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            required
          >
            <option value="">Select Product Service</option>
            {complementaryServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.productPurchased }
              </option>
            ))}
          </select>
        </div>

        {/* Supplier 1 */}
        <div className="col-md-6">
          <label className="form-label">Select Comparisons 1</label>
          <select
            className="form-select"
            value={selectedSupplier1}
            onChange={(e) => setSelectedSupplier1(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers
              .filter((s) => s.id !== Number(selectedSupplier2))
              .map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
          </select>
        </div>

        {/* Supplier 2 */}
        <div className="col-md-6">
          <label className="form-label">Select Comparisons 2</label>
          <select
            className="form-select"
            value={selectedSupplier2}
            onChange={(e) => setSelectedSupplier2(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers
              .filter((s) => s.id !== Number(selectedSupplier1))
              .map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn text-white"
            style={{ backgroundColor: "#578e7e" }}
            disabled={!selectedSupplier1 || !selectedSupplier2 || !selectedSubcategory}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default PriceComparisonsForm;