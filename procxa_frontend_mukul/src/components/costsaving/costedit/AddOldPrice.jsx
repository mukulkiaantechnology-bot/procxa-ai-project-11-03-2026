// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import useApi from "../../../hooks/useApi";
// import endpoints from "../../../api/endPoints";
// import { useLocation } from 'react-router-dom';

// function AddOldPrice() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get('id');
//   const { get, post, patch } = useApi();
//   const [suppliers, setSuppliers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
  
//   const [message, setMessage] = useState({ text: "", type: "" }); 

//   const [formData, setFormData] = useState({
//     supplierId: null,
//     categoryId: null,
//     subcategoryId: null,
//     oldPrice: "",
//     currentQuotation: "",
//     savingFromOldPricing: "",
//     status: "Pending",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [suppliersRes, categoriesRes, subcategoriesRes] = await Promise.all([
//           get(endpoints.getSuppliers),
//           get(endpoints.getCategory),
//           get(endpoints.getSubCategory),
//         ]);

//         setSuppliers(suppliersRes.data);
//         setCategories(categoriesRes.categories);
//         setSubcategories(subcategoriesRes.subcategories);
//       } catch (error) {
//         setMessage({ text: error.message || "Error fetching data.", type: "error" });
//       }
//     };

//     fetchData();

//     if (id) {
//       const fetchServiceDetails = async () => {
//         try {
//           const response = await get(`${endpoints.getOldPricingById}/${id}`);
//           setFormData(response.data);
//         } catch (error) {
//           setMessage({ text: error.message || "Error fetching old price details.", type: "error" });
//         }
//       };
//       fetchServiceDetails();
//     }
//   }, [id]);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let response;
//       if (id) {
//         response = await patch(`${endpoints.updateOldPricing}/${id}`, formData);
//         setMessage({ text: response.message || "Service updated successfully!", type: "success" });
//         setFormData({
//           supplierId: null,
//           categoryId: null,
//           subcategoryId: null,
//           oldPrice: "",
//           currentQuotation: "",
//           savingFromOldPricing: "",
//           status: "Pending",
//         });
//       } else {
//         response = await post(endpoints.addOldPricing, formData);
//         setMessage({ text: response.message || "Service added successfully!", type: "success" });
//       }

//       // Reset form data after successful submission
//       setFormData({
//         supplierId: null,
//         categoryId: null,
//         subcategoryId: null,
//         oldPrice: "",
//         currentQuotation: "",
//         savingFromOldPricing: "",
//         status: "Pending",
//       });
//     } catch (error) {
//       setMessage({ text: error.message || "Error submitting form.", type: "error" });
//     }
//   };

//   return (
//     <div className="addoldpric-section my-5">
//       <div className="container">
//         <h3>{id ? "Edit" : "Add"} Old Price</h3>

//         {/* Display message */}
//         {message.text && (
//           <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
//             {message.text}
//           </div>
//         )}

//         <form className="row g-3" onSubmit={handleSubmit}>
//           {/* Supplier Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Supplier Name</label>
//             <select className="form-control" name="supplierId" value={formData.supplierId} onChange={handleChange}>
//               <option value="">Select Supplier</option>
//               {suppliers.map((supplier) => (
//                 <option key={supplier.id} value={supplier.id}>
//                   {supplier.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Category Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Category</label>
//             <select className="form-control" name="categoryId" value={formData.categoryId} onChange={handleChange}>
//               <option value="">Select Category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subcategory Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Subcategory</label>
//             <select className="form-control" name="subcategoryId" value={formData.subcategoryId} onChange={handleChange}>
//               <option value="">Select Subcategory</option>
//               {subcategories.map((subcategory) => (
//                 <option key={subcategory.id} value={subcategory.id}>
//                   {subcategory.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Old Pricing */}
//           <div className="col-md-6">
//             <label className="form-label">Old Pricing</label>
//             <input type="text" className="form-control" placeholder="Enter Old Price" name="oldPrice" value={formData.oldPrice} onChange={handleChange} />
//           </div>

//           {/* Current Quotation */}
//           <div className="col-md-6">
//             <label className="form-label">Current Quotation</label>
//             <input type="text" className="form-control" placeholder="Enter Current Quotation" name="currentQuotation" value={formData.currentQuotation} onChange={handleChange} />
//           </div>

//           {/* Saving from Old Pricing */}
//           <div className="col-md-6">
//             <label className="form-label">Saving from Honoring Old Pricing</label>
//             <input type="text" className="form-control" placeholder="Enter Saving" name="savingFromOldPricing" value={formData.savingFromOldPricing} onChange={handleChange} />
//           </div>

//           {/* Status Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Status</label>
//             <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
//               <option value="Pending">Pending</option>
//               <option value="Approved">Approved</option>
//               <option value="Denied">Denied</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <div className="col-12">
//             <button type="submit" className="btn" style={{ backgroundColor: "#578e7e", color: "white" }}>
//               {id ? "Update" : "Submit"}
//             </button>
//             <Link to="/honoring" className="btn btn-secondary ms-3">
//               Cancel
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddOldPrice;


// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import useApi from "../../../hooks/useApi";
// import endpoints from "../../../api/endPoints";

// function AddOldPrice() {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get('id');
//   const { get, post, put } = useApi(); // ✅ Use 'put' instead of 'patch'

//   const [suppliers, setSuppliers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });

//   const [formData, setFormData] = useState({
//     supplierId: "",
//     categoryId: "",
//     subcategoryId: "",
//     oldPrice: "",
//     currentQuotation: "",
//     savingFromOldPricing: "",
//     status: "Pending",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch dropdown data
//         const [suppliersRes, categoriesRes, subcategoriesRes] = await Promise.all([
//           get(endpoints.getSuppliers),
//           get(endpoints.getCategory),
         
//         ]);

//         // ✅ Safe fallbacks — prevent white screen
//         setSuppliers(Array.isArray(suppliersRes?.data) ? suppliersRes.data : []);
//         setCategories(Array.isArray(categoriesRes?.categories) ? categoriesRes.categories : []);
//         setSubcategories(Array.isArray(subcategoriesRes?.subcategories) ? subcategoriesRes.subcategories : []);
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//         setMessage({ text: "Failed to load form options. Please refresh.", type: "error" });
//       }
//     };

//     fetchData();

//     // Fetch existing data if editing
//     if (id) {
//       const fetchServiceDetails = async () => {
//         try {
//           const response = await get(`${endpoints.getOldPricingById}/${id}`);
//           const data = response?.data;

//           if (data) {
//             // ✅ Manually map fields — avoid direct object assignment
//             setFormData({
//               supplierId: data.supplierId?.toString() || "",
//               categoryId: data.categoryId?.toString() || "",
//               subcategoryId: data.subcategoryId?.toString() || "",
//               oldPrice: data.oldPrice?.toString() || "",
//               currentQuotation: data.currentQuotation?.toString() || "",
//               savingFromOldPricing: data.savingFromOldPricing?.toString() || "",
//               status: data.status || "Pending",
//             });
//           } else {
//             setMessage({ text: "Item not found.", type: "error" });
//           }
//         } catch (error) {
//           console.error("Error fetching old price details:", error);
//           setMessage({ text: "Failed to load item for editing.", type: "error" });
//         }
//       };
//       fetchServiceDetails();
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let response;
//       const payload = {
//         ...formData,
//         // Convert empty strings to null if needed by API
//         supplierId: formData.supplierId || null,
//         categoryId: formData.categoryId || null,
//         subcategoryId: formData.subcategoryId || null,
//         oldPrice: formData.oldPrice || null,
//         currentQuotation: formData.currentQuotation || null,
//         savingFromOldPricing: formData.savingFromOldPricing || null,
//       };

//       if (id) {
//         response = await put(`${endpoints.updateOldPricing}/${id}`, payload); // ✅ Use 'put'
//       } else {
//         response = await post(endpoints.addOldPricing, payload);
//       }

//       setMessage({ text: response?.message || (id ? "Updated successfully!" : "Added successfully!"), type: "success" });

//       // Redirect after success
//       setTimeout(() => {
//         window.location.href = "/honoringoldpricing"; // or use navigate if preferred
//       }, 1500);
//     } catch (error) {
//       console.error("Submission error:", error);
//       setMessage({ text: error?.message || "Failed to save. Please try again.", type: "error" });
//     }
//   };

//   return (
//     <div className="addoldpric-section my-5">
//       <div className="container">
//         <h3>{id ? "Edit" : "Add"} Old Price</h3>

//         {message.text && (
//           <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
//             {message.text}
//           </div>
//         )}

//         <form className="row g-3" onSubmit={handleSubmit}>
//           {/* Supplier Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Supplier Name</label>
//             <select
//               className="form-control"
//               name="supplierId"
//               value={formData.supplierId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Supplier</option>
//               {suppliers.map((supplier) => (
//                 <option key={supplier.id} value={supplier.id}>
//                   {supplier.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Category Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Category</label>
//             <select
//               className="form-control"
//               name="categoryId"
//               value={formData.categoryId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subcategory Dropdown */}
//           <div className="col-md-6">
//             <label className="form-label">Subcategory</label>
//             <select
//               className="form-control"
//               name="subcategoryId"
//               value={formData.subcategoryId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Subcategory</option>
//               {subcategories.map((subcategory) => (
//                 <option key={subcategory.id} value={subcategory.id}>
//                   {subcategory.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Old Pricing */}
//           <div className="col-md-6">
//             <label className="form-label">Old Pricing</label>
//             <input
//               type="number"
//               step="0.01"
//               className="form-control"
//               placeholder="Enter Old Price"
//               name="oldPrice"
//               value={formData.oldPrice}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Current Quotation */}
//           <div className="col-md-6">
//             <label className="form-label">Current Quotation</label>
//             <input
//               type="number"
//               step="0.01"
//               className="form-control"
//               placeholder="Enter Current Quotation"
//               name="currentQuotation"
//               value={formData.currentQuotation}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Saving from Old Pricing */}
//           <div className="col-md-6">
//             <label className="form-label">Saving from Honoring Old Pricing</label>
//             <input
//               type="number"
//               step="0.01"
//               className="form-control"
//               placeholder="Enter Saving"
//               name="savingFromOldPricing"
//               value={formData.savingFromOldPricing}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Status */}
//           <div className="col-md-6">
//             <label className="form-label">Status</label>
//             <select
//               className="form-control"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Approved">Approved</option>
//               <option value="Denied">Denied</option>
//             </select>
//           </div>

//           {/* Buttons */}
//           <div className="col-12">
//             <button
//               type="submit"
//               className="btn"
//               style={{ backgroundColor: "#578e7e", color: "white" }}
//             >
//               {id ? "Update" : "Submit"}
//             </button>
//             <Link to="/honoring" className="btn btn-secondary ms-3">
//               Cancel
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddOldPrice;



import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function AddOldPrice() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const { get, post, put } = useApi();

  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    supplierId: "",
    categoryId: "",
    subcategoryId: "",
    oldPrice: "",
    currentQuotation: "",
    savingFromOldPricing: "",
    status: "Pending",
  });

  // 🔁 Fetch initial data (suppliers + categories ONLY)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, categoriesRes] = await Promise.all([
          get(endpoints.getSuppliers),
          get(endpoints.getCategory),
        ]);

        setSuppliers(Array.isArray(suppliersRes?.data) ? suppliersRes.data : []);
        // ✅ Handle both response.categories and response.data
        const cats = categoriesRes?.categories || categoriesRes?.data || [];
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setMessage({ text: "Failed to load form options. Please refresh.", type: "error" });
      }
    };

    fetchData();

    // Fetch existing data if editing
    if (id) {
      const fetchServiceDetails = async () => {
        try {
          const response = await get(`${endpoints.getOldPricingById}/${id}`);
          const data = response?.data;

          if (data) {
            const updatedFormData = {
              supplierId: data.supplierId?.toString() || "",
              categoryId: data.categoryId?.toString() || "",
              subcategoryId: data.subcategoryId?.toString() || "",
              oldPrice: data.oldPrice?.toString() || "",
              currentQuotation: data.currentQuotation?.toString() || "",
              savingFromOldPricing: data.savingFromOldPricing?.toString() || "",
              status: data.status || "Pending",
            };
            setFormData(updatedFormData);

            // 🔁 If editing, also load subcategories for the selected category
            if (data.categoryId) {
              loadSubcategories(data.categoryId);
            }
          } else {
            setMessage({ text: "Item not found.", type: "error" });
          }
        } catch (error) {
          console.error("Error fetching old price details:", error);
          setMessage({ text: "Failed to load item for editing.", type: "error" });
        }
      };
      fetchServiceDetails();
    }
  }, [id]);

  // 🔁 Load subcategories based on selected category
  const loadSubcategories = async (categoryId) => {
    try {
      const response = await get(`${endpoints.getSubCategory}?categoryId=${categoryId}`);
      // ✅ Handle both response.subcategories and response.data
      const subcats = response?.subcategories || response?.data || [];
      setSubcategories(Array.isArray(subcats) ? subcats : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setMessage({ text: "Failed to load subcategories.", type: "error" });
    }
  };

  // 🔁 Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setFormData({
      ...formData,
      categoryId: selectedCategoryId,
      subcategoryId: "", // Reset subcategory when category changes
    });

    if (selectedCategoryId) {
      loadSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const payload = {
        ...formData,
        supplierId: formData.supplierId || null,
        categoryId: formData.categoryId || null,
        subcategoryId: formData.subcategoryId || null,
        oldPrice: formData.oldPrice || null,
        currentQuotation: formData.currentQuotation || null,
        savingFromOldPricing: formData.savingFromOldPricing || null,
      };

      if (id) {
        response = await put(`${endpoints.updateOldPricing}/${id}`, payload);
      } else {
        response = await post(endpoints.addOldPricing, payload);
      }

      setMessage({ text: response?.message || (id ? "Updated successfully!" : "Added successfully!"), type: "success" });

      setTimeout(() => {
        window.location.href = "/honoring";
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({ text: error?.message || "Failed to save. Please try again.", type: "error" });
    }
  };

  return (
    <div className="addoldpric-section my-5">
      <div className="container">
        <h3>{id ? "Edit" : "Add"} Old Price</h3>

        {message.text && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
            {message.text}
          </div>
        )}

        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Supplier Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Supplier Name</label>
            <select
              className="form-control"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleCategoryChange} // ✅ Use special handler
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Subcategory</label>
            <select
              className="form-control"
              name="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          {/* Old Pricing */}
          <div className="col-md-6">
            <label className="form-label">Old Pricing</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Enter Old Price"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              required
            />
          </div>

          {/* Current Quotation */}
          <div className="col-md-6">
            <label className="form-label">Current Quotation</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Enter Current Quotation"
              name="currentQuotation"
              value={formData.currentQuotation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Saving from Old Pricing */}
          <div className="col-md-6">
            <label className="form-label">Saving from Honoring Old Pricing</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Enter Saving"
              name="savingFromOldPricing"
              value={formData.savingFromOldPricing}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-12">
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: "#578e7e", color: "white" }}
            >
              {id ? "Update" : "Submit"}
            </button>
            <Link to="/honoring" className="btn btn-secondary ms-3">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOldPrice;