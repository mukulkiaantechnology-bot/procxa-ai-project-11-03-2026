// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import endpoints from "../../../api/endPoints";
// import useApi from "../../../hooks/useApi";
// import CreatableSelect from "react-select/creatable";

// function CategoryEditPage() {
//   const navigate = useNavigate();
//   const { post, get, patch } = useApi();
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingCategory, setEditingCategory] = useState(null);

//   const [categoryData, setCategoryData] = useState({
//     name: '',
//     type: '',
//     description: '',
//   });

//   const [feedbackMessage, setFeedbackMessage] = useState({
//     message: '',
//     type: '',
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await get(endpoints.getCategory);
//       if (response && (response.categories || response.data)) {
//         setCategories(response.categories || response.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setFeedbackMessage({
//         message: "Failed to fetch categories",
//         type: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCategoryData({
//       ...categoryData,
//       [name]: value,
//     });
//   };

//   const handleAddCategory = async () => {
//     if (!categoryData.name) {
//       setFeedbackMessage({
//         message: "Category name is required",
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       const response = await post(endpoints.addCategory, categoryData);
//       setFeedbackMessage({
//         message: response.message || "Category Added Successfully!",
//         type: 'success',
//       });
//       setCategoryData({
//         name: '',
//         type: '',
//         description: '',
//       });
//       fetchCategories();
//       setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
//     } catch (error) {
//       console.error("Error adding category:", error);
//       setFeedbackMessage({
//         message: error.message || "Failed to add category",
//         type: 'error',
//       });
//     }
//   };

//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setCategoryData({
//       name: category.name || '',
//       type: category.type || '',
//       description: category.description || '',
//     });
//   };

//   const handleUpdateCategory = async () => {
//     if (!categoryData.name) {
//       setFeedbackMessage({
//         message: "Category name is required",
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       const response = await patch(`${endpoints.addCategory}/${editingCategory.id}`, categoryData);
//       setFeedbackMessage({
//         message: response.message || "Category Updated Successfully!",
//         type: 'success',
//       });
//       setEditingCategory(null);
//       setCategoryData({
//         name: '',
//         type: '',
//         description: '',
//       });
//       fetchCategories();
//       setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
//     } catch (error) {
//       console.error("Error updating category:", error);
//       setFeedbackMessage({
//         message: error.message || "Failed to update category",
//         type: 'error',
//       });
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingCategory(null);
//     setCategoryData({
//       name: '',
//       type: '',
//       description: '',
//     });
//   };

//   const handleAddSubcategory = () => {
//     navigate("/add-subcategory");
//   };

//   const categoryOptions = categories.map((category) => ({
//     value: category.id,
//     label: category.name,
//     category: category,
//   }));

//   const handleCategorySelect = (selectedOption) => {
//     if (selectedOption && selectedOption.category) {
//       handleEditCategory(selectedOption.category);
//     } else if (selectedOption) {
//       // New category typed
//       setCategoryData({
//         name: selectedOption.label,
//         type: '',
//         description: '',
//       });
//       setEditingCategory(null);
//     }
//   };

//   // Custom styles for the select component
//   const customSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       padding: "6px 4px",
//       fontSize: "16px",
//       minHeight: '50px',
//       borderRadius: "0.375rem",
//       borderColor: state.isFocused ? "#578e7e" : "#ced4da",
//       boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(87, 142, 126, 0.25)" : "none",
//       cursor: "pointer",
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//       fontSize: "16px",
//     }),
//     menuList: (base) => ({
//       ...base,
//       maxHeight: "200px",
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isFocused ? "#f1f1f1" : "white",
//       color: state.isFocused ? "#333" : "#333",
//       padding: "10px 12px",
//     }),
//   };

//   return (
//     <div className="container mt-4 mb-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">Category Management</h3>
//         <button
//           className="btn"
//           style={{ backgroundColor: "#007bff", color: "white" }}
//           onClick={handleAddSubcategory}
//         >
//           <i className="fa-solid fa-plus me-2"></i>Add Subcategory
//         </button>
//       </div>

//       {feedbackMessage.message && (
//         <div className={`alert alert-${feedbackMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
//           {feedbackMessage.message}
//           <button type="button" className="btn-close" onClick={() => setFeedbackMessage({ message: '', type: '' })}></button>
//         </div>
//       )}

//       {/* Searchable Category Dropdown */}
//       <div className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">Search or Add Category</h5>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-12 mb-3">
//               <label className="form-label fw-semibold">Category</label>
//               <CreatableSelect
//                 options={categoryOptions}
//                 value={editingCategory ? categoryOptions.find(opt => opt.value === editingCategory.id) : null}
//                 onChange={handleCategorySelect}
//                 placeholder="Type or select category to edit"
//                 isClearable
//                 isSearchable
//                 styles={customSelectStyles}
//                 menuPortalTarget={document.body}
//                 menuPosition={'fixed'}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Category Form */}
//       <div className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">{editingCategory ? "Edit Category" : "Add New Category"}</h5>
//         </div>
//         <div className="card-body">
//           <form className="row g-3">
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Category Name <span className="text-danger">*</span></label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={categoryData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter The Category Name"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Category Description</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="description"
//                 value={categoryData.description}
//                 onChange={handleInputChange}
//                 placeholder="Enter The Category Description"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Category Type</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="type"
//                 value={categoryData.type}
//                 onChange={handleInputChange}
//                 placeholder="Category type"
//               />
//             </div>
//             <div className="col-12">
//               {editingCategory ? (
//                 <div className="d-flex gap-2">
//                   <button
//                     type="button"
//                     className="btn"
//                     style={{ backgroundColor: "#578e7e", color: "white" }}
//                     onClick={handleUpdateCategory}
//                   >
//                     <i className="fa-solid fa-save me-2"></i>Update Category
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={handleCancelEdit}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   className="btn"
//                   style={{ backgroundColor: "#578e7e", color: "white" }}
//                   onClick={handleAddCategory}
//                 >
//                   <i className="fa-solid fa-plus me-2"></i>Add Category
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Categories List */}
//       <div className="card">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">All Categories</h5>
//         </div>
//         <div className="card-body">
//           {loading ? (
//             <div className="text-center py-4">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : categories.length === 0 ? (
//             <p className="text-muted text-center py-4">No categories found. Add your first category above.</p>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Category Name</th>
//                     <th>Type</th>
//                     <th>Description</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories.map((category) => (
//                     <tr key={category.id}>
//                       <td>{category.name}</td>
//                       <td>{category.type || "N/A"}</td>
//                       <td>{category.description || "N/A"}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => handleEditCategory(category)}
//                           title="Edit Category"
//                         >
//                           <i className="fa-solid fa-pencil"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CSS for mobile responsiveness */}
//       <style jsx>{`
//         @media (max-width: 768px) {
//           .react-select__menu {
//             position: fixed !important;
//             top: auto !important;
//             bottom: 0 !important;
//             left: 0 !important;
//             right: 0 !important;
//             max-height: 50vh !important;
//             border-top-left-radius: 8px !important;
//             border-top-right-radius: 8px !important;
//             box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
//           }
          
//           .react-select__menu-list {
//             max-height: 100% !important;
//             overflow-y: auto !important;
//           }
          
//           .react-select__option {
//             padding: 15px !important;
//             font-size: 16px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default CategoryEditPage;

//================================================================================================================

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import endpoints from "../../../api/endPoints";
// import useApi from "../../../hooks/useApi";
// import CreatableSelect from "react-select/creatable";

// function CategoryEditPage() {
//   const navigate = useNavigate();
//   const { post, get } = useApi(); // Removed patch, using post for both update/delete
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingCategory, setEditingCategory] = useState(null);

//   const [categoryData, setCategoryData] = useState({
//     name: '',
//     type: '',
//     description: '',
//   });

//   const [feedbackMessage, setFeedbackMessage] = useState({
//     message: '',
//     type: '',
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await get(endpoints.getCategory);
//       if (response && (response.categories || response.data)) {
//         setCategories(response.categories || response.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setFeedbackMessage({
//         message: "Failed to fetch categories",
//         type: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCategoryData({
//       ...categoryData,
//       [name]: value,
//     });
//   };

//   const handleAddCategory = async () => {
//     if (!categoryData.name) {
//       setFeedbackMessage({
//         message: "Category name is required",
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       const response = await post(endpoints.addCategory, categoryData);
//       setFeedbackMessage({
//         message: response.message || "Category Added Successfully!",
//         type: 'success',
//       });
//       setCategoryData({
//         name: '',
//         type: '',
//         description: '',
//       });
//       fetchCategories();
//       setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
//     } catch (error) {
//       console.error("Error adding category:", error);
//       setFeedbackMessage({
//         message: error.message || "Failed to add category",
//         type: 'error',
//       });
//     }
//   };

//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setCategoryData({
//       name: category.name || '',
//       type: category.type || '',
//       description: category.description || '',
//     });
//   };

//   const handleUpdateCategory = async () => {
//     if (!categoryData.name) {
//       setFeedbackMessage({
//         message: "Category name is required",
//         type: 'error',
//       });
//       return;
//     }

//     try {
//       const response = await post(endpoints.updateCategory, {
//         id: editingCategory.id,
//         ...categoryData
//       });
//       setFeedbackMessage({
//         message: response.message || "Category Updated Successfully!",
//         type: 'success',
//       });
//       setEditingCategory(null);
//       setCategoryData({
//         name: '',
//         type: '',
//         description: '',
//       });
//       fetchCategories();
//       setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
//     } catch (error) {
//       console.error("Error updating category:", error);
//       setFeedbackMessage({
//         message: error.message || "Failed to update category",
//         type: 'error',
//       });
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     try {
//       const response = await post(endpoints.deleteCategory, { id: categoryId });
//       setFeedbackMessage({
//         message: response.message || "Category deleted successfully!",
//         type: 'success',
//       });
//       fetchCategories();
//       setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       setFeedbackMessage({
//         message: error.message || "Failed to delete category",
//         type: 'error',
//       });
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingCategory(null);
//     setCategoryData({
//       name: '',
//       type: '',
//       description: '',
//     });
//   };

//   const handleAddSubcategory = () => {
//     navigate("/add-subcategory");
//   };

//   const categoryOptions = categories.map((category) => ({
//     value: category.id,
//     label: category.name,
//     category: category,
//   }));

//   const handleCategorySelect = (selectedOption) => {
//     if (selectedOption && selectedOption.category) {
//       handleEditCategory(selectedOption.category);
//     } else if (selectedOption) {
//       setCategoryData({
//         name: selectedOption.label,
//         type: '',
//         description: '',
//       });
//       setEditingCategory(null);
//     }
//   };

//   const customSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       padding: "6px 4px",
//       fontSize: "16px",
//       minHeight: '50px',
//       borderRadius: "0.375rem",
//       borderColor: state.isFocused ? "#578e7e" : "#ced4da",
//       boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(87, 142, 126, 0.25)" : "none",
//       cursor: "pointer",
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 9999,
//       fontSize: "16px",
//     }),
//     menuList: (base) => ({
//       ...base,
//       maxHeight: "200px",
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isFocused ? "#f1f1f1" : "white",
//       color: state.isFocused ? "#333" : "#333",
//       padding: "10px 12px",
//     }),
//   };

//   return (
//     <div className="container mt-4 mb-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">Category Management</h3>
//         <button
//           className="btn"
//           style={{ backgroundColor: "#007bff", color: "white" }}
//           onClick={handleAddSubcategory}
//         >
//           <i className="fa-solid fa-plus me-2"></i>Add Subcategory
//         </button>
//       </div>

//       {feedbackMessage.message && (
//         <div className={`alert alert-${feedbackMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
//           {feedbackMessage.message}
//           <button type="button" className="btn-close" onClick={() => setFeedbackMessage({ message: '', type: '' })}></button>
//         </div>
//       )}

//       <div className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">Search or Add Category</h5>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-12 mb-3">
//               <label className="form-label fw-semibold">Category</label>
//               <CreatableSelect
//                 options={categoryOptions}
//                 value={editingCategory ? categoryOptions.find(opt => opt.value === editingCategory.id) : null}
//                 onChange={handleCategorySelect}
//                 placeholder="Type or select category to edit"
//                 isClearable
//                 isSearchable
//                 styles={customSelectStyles}
//                 menuPortalTarget={document.body}
//                 menuPosition={'fixed'}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="card mb-4">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">{editingCategory ? "Edit Category" : "Add New Category"}</h5>
//         </div>
//         <div className="card-body">
//           <form className="row g-3">
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Category Name <span className="text-danger">*</span></label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={categoryData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter The Category Name"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Category Description</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="description"
//                 value={categoryData.description}
//                 onChange={handleInputChange}
//                 placeholder="Enter The Category Description"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label fw-semibold">Category Type</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="type"
//                 value={categoryData.type}
//                 onChange={handleInputChange}
//                 placeholder="Category type"
//               />
//             </div>
//             <div className="col-12">
//               {editingCategory ? (
//                 <div className="d-flex gap-2">
//                   <button
//                     type="button"
//                     className="btn"
//                     style={{ backgroundColor: "#578e7e", color: "white" }}
//                     onClick={handleUpdateCategory}
//                   >
//                     <i className="fa-solid fa-save me-2"></i>Update Category
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={handleCancelEdit}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   className="btn"
//                   style={{ backgroundColor: "#578e7e", color: "white" }}
//                   onClick={handleAddCategory}
//                 >
//                   <i className="fa-solid fa-plus me-2"></i>Add Category
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header bg-light">
//           <h5 className="mb-0">All Categories</h5>
//         </div>
//         <div className="card-body">
//           {loading ? (
//             <div className="text-center py-4">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : categories.length === 0 ? (
//             <p className="text-muted text-center py-4">No categories found. Add your first category above.</p>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-striped table-bordered">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Category Name</th>
//                     <th>Type</th>
//                     <th>Description</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories.map((category) => (
//                     <tr key={category.id}>
//                       <td>{category.name}</td>
//                       <td>{category.type || "N/A"}</td>
//                       <td>{category.description || "N/A"}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-primary me-2"
//                           onClick={() => handleEditCategory(category)}
//                           title="Edit Category"
//                         >
//                           <i className="fa-solid fa-pencil"></i>
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-danger"
//                           onClick={() => handleDeleteCategory(category.id)}
//                           title="Delete Category"
//                         >
//                           <i className="fa-solid fa-trash"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 768px) {
//           .react-select__menu {
//             position: fixed !important;
//             top: auto !important;
//             bottom: 0 !important;
//             left: 0 !important;
//             right: 0 !important;
//             max-height: 50vh !important;
//             border-top-left-radius: 8px !important;
//             border-top-right-radius: 8px !important;
//             box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
//           }
//           .react-select__menu-list {
//             max-height: 100% !important;
//             overflow-y: auto !important;
//           }
//           .react-select__option {
//             padding: 15px !important;
//             font-size: 16px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default CategoryEditPage;

//================================================================================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../../api/endPoints";
import useApi from "../../../hooks/useApi";
import CreatableSelect from "react-select/creatable";

function CategoryEditPage() {
  const navigate = useNavigate();
  const { post, get } = useApi(); // Removed patch, using post for both update/delete
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryData, setCategoryData] = useState({
    name: '',
    type: '',
    description: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState({
    message: '',
    type: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await get(endpoints.getCategory);
      if (response && (response.categories || response.data)) {
        setCategories(response.categories || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setFeedbackMessage({
        message: "Failed to fetch categories",
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleAddCategory = async () => {
    if (!categoryData.name) {
      setFeedbackMessage({
        message: "Category name is required",
        type: 'error',
      });
      return;
    }

    try {
      const response = await post(endpoints.addCategory, categoryData);
      setFeedbackMessage({
        message: response.message || "Category Added Successfully!",
        type: 'success',
      });
      setCategoryData({
        name: '',
        type: '',
        description: '',
      });
      fetchCategories();
      setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error("Error adding category:", error);
      setFeedbackMessage({
        message: error.message || "Failed to add category",
        type: 'error',
      });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name || '',
      type: category.type || '',
      description: category.description || '',
    });
  };

  const handleUpdateCategory = async () => {
    if (!categoryData.name) {
      setFeedbackMessage({
        message: "Category name is required",
        type: 'error',
      });
      return;
    }

    try {
      // Appending ID to the endpoint URL as per requirement: .../update_category/3
      const response = await post(`${endpoints.updateCategory}/${editingCategory.id}`, categoryData);
      
      setFeedbackMessage({
        message: response.message || "Category Updated Successfully!",
        type: 'success',
      });
      setEditingCategory(null);
      setCategoryData({
        name: '',
        type: '',
        description: '',
      });
      fetchCategories();
      setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error("Error updating category:", error);
      setFeedbackMessage({
        message: error.message || "Failed to update category",
        type: 'error',
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      // Appending ID to the endpoint URL assuming similar structure: .../delete_category/3
      const response = await post(`${endpoints.deleteCategory}/${categoryId}`, {});
      
      setFeedbackMessage({
        message: response.message || "Category deleted successfully!",
        type: 'success',
      });
      fetchCategories();
      setTimeout(() => setFeedbackMessage({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error("Error deleting category:", error);
      setFeedbackMessage({
        message: error.message || "Failed to delete category",
        type: 'error',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryData({
      name: '',
      type: '',
      description: '',
    });
  };

  const handleAddSubcategory = () => {
    navigate("/add-subcategory");
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
    category: category,
  }));

  const handleCategorySelect = (selectedOption) => {
    if (selectedOption && selectedOption.category) {
      handleEditCategory(selectedOption.category);
    } else if (selectedOption) {
      setCategoryData({
        name: selectedOption.label,
        type: '',
        description: '',
      });
      setEditingCategory(null);
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "6px 4px",
      fontSize: "16px",
      minHeight: '50px',
      borderRadius: "0.375rem",
      borderColor: state.isFocused ? "#578e7e" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(87, 142, 126, 0.25)" : "none",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "16px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "200px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f1f1f1" : "white",
      color: state.isFocused ? "#333" : "#333",
      padding: "10px 12px",
    }),
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Category Management</h3>
        <button
          className="btn"
          style={{ backgroundColor: "#007bff", color: "white" }}
          onClick={handleAddSubcategory}
        >
          <i className="fa-solid fa-plus me-2"></i>Add Subcategory
        </button>
      </div>

      {feedbackMessage.message && (
        <div className={`alert alert-${feedbackMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
          {feedbackMessage.message}
          <button type="button" className="btn-close" onClick={() => setFeedbackMessage({ message: '', type: '' })}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Search or Add Category</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Category</label>
              <CreatableSelect
                options={categoryOptions}
                value={editingCategory ? categoryOptions.find(opt => opt.value === editingCategory.id) : null}
                onChange={handleCategorySelect}
                placeholder="Type or select category to edit"
                isClearable
                isSearchable
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">{editingCategory ? "Edit Category" : "Add New Category"}</h5>
        </div>
        <div className="card-body">
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
                placeholder="Enter The Category Name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={categoryData.description}
                onChange={handleInputChange}
                placeholder="Enter The Category Description"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Type</label>
              <input
                type="text"
                className="form-control"
                name="type"
                value={categoryData.type}
                onChange={handleInputChange}
                placeholder="Category type"
              />
            </div>
            <div className="col-12">
              {editingCategory ? (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: "#578e7e", color: "white" }}
                    onClick={handleUpdateCategory}
                  >
                    <i className="fa-solid fa-save me-2"></i>Update Category
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#578e7e", color: "white" }}
                  onClick={handleAddCategory}
                >
                  <i className="fa-solid fa-plus me-2"></i>Add Category
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">All Categories</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-muted text-center py-4">No categories found. Add your first category above.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Category Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.type || "N/A"}</td>
                      <td>{category.description || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditCategory(category)}
                          title="Edit Category"
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCategory(category.id)}
                          title="Delete Category"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .react-select__menu {
            position: fixed !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            max-height: 50vh !important;
            border-top-left-radius: 8px !important;
            border-top-right-radius: 8px !important;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important;
          }
          .react-select__menu-list {
            max-height: 100% !important;
            overflow-y: auto !important;
          }
          .react-select__option {
            padding: 15px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CategoryEditPage;