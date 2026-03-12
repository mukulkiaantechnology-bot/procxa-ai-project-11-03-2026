import React, { useState, useEffect } from "react";
import useApi from "../../../hooks/useApi";
import endpoints from "../../../api/endPoints";

function Subcategory() {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryDescription, setSubcategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState({
    message: "",
    type: "",
  });
  const { get, post } = useApi();

  const fetchCategories = async () => {
    try {
      const response = await get(endpoints.getCategory);
      if (response.categories.length > 0) {
        setCategories(response.categories);
        console.log(response.message)
      } else {
        console.error(response.message)
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle subcategory submit
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();

    if (!subcategoryName || !subcategoryDescription || !selectedCategory) {
      setFeedbackMessage({
        message: "Please fill all fields.",
        type: "error",
      });
      return;
    }

    const subcategoryData = {
      name: subcategoryName,
      description: subcategoryDescription,
      categoryId: selectedCategory,
    };

    try {
      const response = await post(endpoints.addSubcategory, subcategoryData);
      setFeedbackMessage({
        message: response.message || "Subcategory added successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      setFeedbackMessage({
        message: error.message || "Failed to add subcategory.",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="cateedit-section">
        <div className="container">
          <h3>Add Subcategory</h3>

          {/* Show feedback message */}
          {feedbackMessage.message && (
            <div className={`alert alert-${feedbackMessage.type === 'success' ? 'success' : 'danger'}`}>
              {feedbackMessage.message}
            </div>
          )}


          <form className="row g-3" onSubmit={handleSubcategorySubmit}>
            <div className="col-md-6">
              <label className="form-label">Select Category</label>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={categories.length === 0} 
              >
                {categories.length > 0 ? (
                  <>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>

            </div>
            <div className="col-md-6">
              <label className="form-label">Subcategory Name</label>
              <input
                type="text"
                className="form-control"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Enter Subcategory Name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Subcategory Description</label>
              <input
                type="text"
                className="form-control"
                value={subcategoryDescription}
                onChange={(e) => setSubcategoryDescription(e.target.value)}
                placeholder="Enter Subcategory Description"
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#578e7e", color: "white" }}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Subcategory;
