import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";


const initialYears = ["2025", "2026", "2027", "2028", "2029"];
const defaultColumns = ["Baseline", "New Cost", "Annualized Benefits", "item1", "item2", "item3"];

const generateYearData = () => {
  const yearData = {};
  initialYears.forEach((year) => {
    yearData[year] = defaultColumns.reduce((acc, col) => ({ ...acc, [col]: "" }), {});
  });
  return yearData;
};

const CostSavingForm = () => {
  const { post, get, patch } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("editId");

  const [intakeRequests, setIntakeRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    supplierName: "",
    requesterName: "",
    departmentId: "",
    category: "",
    reportingYear: "",
    currency: "USD",
    benefitStartMonth: "",
    benefitEndMonth: "",
    typeOfCostSaving: "",
    historicalUnitPrice: "",
    negotiatedUnitPrice: "",
    reductionPerUnit: "",
    currentPrice: "",
    proposedPrice: "",
    notesDescription: "",
    forecastVolumes: generateYearData(),
    forecastVolumesMultiYear: generateYearData(),
    historicalUnitPrices: generateYearData(),
    additionalColumns: [],
    sourcingBenefits: {},
    intakeRequest: "",
  });

  const [requesters, setRequesters] = useState([]);
  const [departments, setDepartments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForecastChange = (year, item, value) => {
    setFormData((prev) => {
      const years = Object.keys(prev.forecastVolumes).sort();
      const yearIndex = years.indexOf(year);
      
      const newForecastVolumes = { ...prev.forecastVolumes };
      
      const updatedYearData = {
        ...(newForecastVolumes[year] || {}),
        [item]: value,
      };

      if (item === "Baseline" || item === "New Cost") {
        const baseline = parseFloat(updatedYearData["Baseline"]) || 0;
        const newCost = parseFloat(updatedYearData["New Cost"]) || 0;
        updatedYearData["Annualized Benefits"] = (baseline - newCost).toFixed(2);
      }
      
      newForecastVolumes[year] = updatedYearData;

      for (let i = yearIndex + 1; i < years.length; i++) {
        const futureYear = years[i];
        newForecastVolumes[futureYear] = {
          ...newForecastVolumes[futureYear],
          [item]: value,
        };
        const baseline = parseFloat(newForecastVolumes[futureYear]["Baseline"]) || 0;
        const newCost = parseFloat(newForecastVolumes[futureYear]["New Cost"]) || 0;
        newForecastVolumes[futureYear]["Annualized Benefits"] = (baseline - newCost).toFixed(2);
      }

      return {
        ...prev,
        forecastVolumes: newForecastVolumes,
      };
    });
  };

  const handleHistoricalChange = (year, col, value) => {
    setFormData((prev) => {
      const years = Object.keys(prev.historicalUnitPrices).sort();
      const yearIndex = years.indexOf(year);
      const newHistoricalUnitPrices = { ...prev.historicalUnitPrices };
      for (let i = yearIndex; i < years.length; i++) {
        const targetYear = years[i];
        newHistoricalUnitPrices[targetYear] = {
          ...(newHistoricalUnitPrices[targetYear] || {}),
          [col]: value,
        };
      }
      return {
        ...prev,
        historicalUnitPrices: newHistoricalUnitPrices,
      };
    });
  };

  const handleAddColumn = () => {
    const newColumn = `item${formData.additionalColumns.length + 4}`;
    setFormData((prev) => {
      const updatedForecast = { ...prev.forecastVolumes };
      const updatedHistorical = { ...prev.historicalUnitPrices };
      for (const year in updatedForecast) {
        updatedForecast[year][newColumn] = "";
        updatedHistorical[year][newColumn] = "";
      }
      return {
        ...prev,
        additionalColumns: [...prev.additionalColumns, newColumn],
        forecastVolumes: updatedForecast,
        historicalUnitPrices: updatedHistorical,
      };
    });
  };

  const handleAddRow = () => {
    const currentYears = Object.keys(formData.forecastVolumes);
    const newYear = (parseInt(currentYears.at(-1)) + 1).toString();
    const newRowData = [...defaultColumns, ...formData.additionalColumns].reduce(
      (acc, col) => ({ ...acc, [col]: "" }),
      {}
    );
    setFormData((prev) => ({
      ...prev,
      forecastVolumes: {
        ...prev.forecastVolumes,
        [newYear]: newRowData,
      },
      historicalUnitPrices: {
        ...prev.historicalUnitPrices,
        [newYear]: { ...newRowData },
      },
    }));
  };

  const handleRemoveRow = (rowIndex) => {
    const years = Object.keys(formData.forecastVolumes);
    if (rowIndex < 0 || rowIndex >= years.length) return;
    const yearToRemove = years[rowIndex];
    setFormData((prev) => {
      const newForecast = { ...prev.forecastVolumes };
      const newHistorical = { ...prev.historicalUnitPrices };
      delete newForecast[yearToRemove];
      delete newHistorical[yearToRemove];
      return {
        ...prev,
        forecastVolumes: newForecast,
        historicalUnitPrices: newHistorical,
      };
    });
  };

  const handleRemoveColumn = (colIndex) => {
    const staticCols = ["Baseline", "New Cost", "Annualized Benefits"];
    const dynamicBaseCols = ["item1", "item2", "item3"];
    const allColumns = [...staticCols, ...dynamicBaseCols, ...formData.additionalColumns];
    const columnToRemove = allColumns[colIndex];
    if (!columnToRemove) return;
    const updatedForecastVolumes = {};
    for (const [year, data] of Object.entries(formData.forecastVolumes)) {
      const newData = { ...data };
      delete newData[columnToRemove];
      updatedForecastVolumes[year] = newData;
    }
    const updatedHistoricalUnitPrices = {};
    for (const [year, data] of Object.entries(formData.historicalUnitPrices || {})) {
      const newData = { ...data };
      delete newData[columnToRemove];
      updatedHistoricalUnitPrices[year] = newData;
    }
    let updatedAdditionalColumns = [...formData.additionalColumns];
    if (columnToRemove.startsWith("item") && !dynamicBaseCols.includes(columnToRemove)) {
      updatedAdditionalColumns = updatedAdditionalColumns.filter((col) => col !== columnToRemove);
    }
    setFormData((prev) => ({
      ...prev,
      forecastVolumes: updatedForecastVolumes,
      historicalUnitPrices: updatedHistoricalUnitPrices,
      additionalColumns: updatedAdditionalColumns,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "supplierName",
      "requesterName",
      "departmentId",
      "category",
      "reportingYear",
      "currency",
      "benefitStartMonth",
      "benefitEndMonth",
      "typeOfCostSaving",
      "intakeRequest",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill out "${field.replace(/([A-Z])/g, " $1")}"`);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
      };

      let response;
      if (editId) {
        response = await patch(`${endpoints.updateCostSaving}/${editId}`, payload);
      } else {
        response = await post(endpoints.createCostSaving, payload);
      }

      if (!response.status && !response.data) throw new Error(response.message || "Submission failed.");

      alert(response.message || "Form submitted successfully!");
      navigate("/costsaving");
      
      setFormData({
        supplierName: "",
        requesterName: "",
        departmentId: "",
        category: "",
        reportingYear: "",
        currency: "USD",
        benefitStartMonth: "",
        benefitEndMonth: "",
        typeOfCostSaving: "",
        historicalUnitPrice: "",
        negotiatedUnitPrice: "",
        reductionPerUnit: "",
        currentPrice: "",
        proposedPrice: "",
        notesDescription: "",
        forecastVolumes: generateYearData(),
        forecastVolumesMultiYear: generateYearData(),
        historicalUnitPrices: generateYearData(),
        additionalColumns: [],
        sourcingBenefits: {},
        intakeRequest: "",
      });
    } catch (err) {
      alert("Error submitting form.");
      console.error(err);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [intakeRes, supplierRes, categoryRes, deptRes, adminRes] = await Promise.all([
          get(endpoints.getIntakeRequest),
          get(endpoints.getSuppliers),
          get(endpoints.getCategory),
          get(endpoints.getAllDepartments),
          get(endpoints.getAllAdmins)
        ]);

        if (intakeRes.status) setIntakeRequests(intakeRes.data);
        if (supplierRes.status) setSuppliers(supplierRes.data);
        
        if (categoryRes) {
          const cats = categoryRes.categories || categoryRes.data || [];
          setCategories(cats);
        }

        if (deptRes.status || deptRes.data) {
          setDepartments(deptRes.data || deptRes);
        }

        if (adminRes.status || adminRes.data) {
          setRequesters(adminRes.data || adminRes);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editId) {
      const fetchEditData = async () => {
        try {
          const res = await get(`${endpoints.getCostSavingById}/${editId}`);
          if (res) {
             const data = res.data || res;

             let parsedForecastVolumes = data.forecastVolumes;
             if (typeof parsedForecastVolumes === "string") {
               try { parsedForecastVolumes = JSON.parse(parsedForecastVolumes); } catch(e) {}
             }
             let parsedForecastMultiYear = data.forecastVolumesMultiYear;
             if (typeof parsedForecastMultiYear === "string") {
               try { parsedForecastMultiYear = JSON.parse(parsedForecastMultiYear); } catch(e) {}
             }
             let parsedHistoricalPrices = data.historicalUnitPrices;
             if (typeof parsedHistoricalPrices === "string") {
               try { parsedHistoricalPrices = JSON.parse(parsedHistoricalPrices); } catch(e) {}
             }
             let parsedAdditionalColumns = data.additionalColumns;
             if (typeof parsedAdditionalColumns === "string") {
               try { parsedAdditionalColumns = JSON.parse(parsedAdditionalColumns); } catch(e) {}
             }

             setFormData({
               ...formData,
               supplierName: data.supplierName || "",
               depreciationScheduleYears: data.depreciationScheduleYears || "",
               category: data.category || "",
               reportingYear: data.reportingYear || "",
               currency: data.currency || "USD",
               benefitStartMonth: data.benefitStartMonth || "",
               benefitEndMonth: data.benefitEndMonth || "",
               typeOfCostSaving: data.typeOfCostSaving || "",
               historicalUnitPrice: data.historicalUnitPrice || "",
               negotiatedUnitPrice: data.negotiatedUnitPrice || "",
               reductionPerUnit: data.reductionPerUnit || "",
               currentPrice: data.currentPrice || "",
               proposedPrice: data.proposedPrice || "",
               notesDescription: data.notesDescription || "",
               forecastVolumes: parsedForecastVolumes || generateYearData(),
               forecastVolumesMultiYear: parsedForecastMultiYear || generateYearData(),
               historicalUnitPrices: parsedHistoricalPrices || generateYearData(),
               additionalColumns: Array.isArray(parsedAdditionalColumns) ? parsedAdditionalColumns : [],
               intakeRequest: data.intakeRequest || ""
             });
          }
        } catch (error) {
          console.error("Error fetching cost saving details:", error);
        }
      };
      fetchEditData();
    }
  }, [editId]);

  const staticColumns = ["Baseline", "New Cost", "Annualized Benefits"];
  const itemColumns = ["item1", "item2", "item3", ...formData.additionalColumns];

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="mb-0 text-md-start" style={{ color: "#578E7E", fontWeight: "600" }}>
          {editId ? "Update" : "Add"} Cost Saving
        </h2>
        <button 
          onClick={() => navigate("/costsaving")} 
          className="btn text-white d-flex align-items-center gap-2"
          style={{ 
            backgroundColor: "#578E7E",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="supplierName" className="form-label">
              Select Spplier Name
            </label>
            <select
              id="supplierName"
              name="supplierName"
              className="form-select"
              value={formData.supplierName || ""}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {`${supplier.name}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="requesterName" className="form-label">Requester Name</label>
            <select
              id="requesterName"
              name="requesterName"
              className="form-select"
              value={formData.requesterName || ""}
              onChange={handleChange}
            >
              <option value="">Select Requester</option>
              {requesters.map((req) => (
                <option key={req.id} value={req.first_name}>
                  {req.first_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="departmentId" className="form-label">Department</label>
            <select
              id="departmentId"
              name="departmentId"
              className="form-select"
              value={formData.departmentId || ""}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="reportingYear" className="form-label">Reporting Year</label>
            <input
              type="number"
              id="reportingYear"
              name="reportingYear"
              className="form-control"
              value={formData.reportingYear}
              onChange={handleChange}
            />
          </div>

          {/* <div className="mb-3 col-12 col-md-6 col-lg-4">
              <label htmlFor="category" className="form-label">
                Select Category
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category || ""}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {`${category.name}`}
                  </option>
                ))}
              </select>
            </div> */}


          {/* Category */}
          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="intakeRequest" className="form-label">
              Select Intake Request
            </label>
            <select
              id="intakeRequest"
              name="intakeRequest"
              className="form-select"
              value={formData.intakeRequest || ""}
              onChange={handleChange}
            >
              <option value="">Select Request</option>
              {intakeRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  {`${request.id} - ${request.requestType} - ${request.department?.name}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="typeOfCostSaving" className="form-label">
              Type of Cost Saving
            </label>
            <select
              id="typeOfCostSaving"
              name="typeOfCostSaving"
              className="form-select"
              value={formData.typeOfCostSaving}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              {[
                "Volume Discounts",
                "Supplier Consolidation",
                "Service/SOW Consolidation",
                "Honoring Old Pricing",
                "Additional/Complementary Service",
                "Price Comparison",
                "Multi Year Contracting",
                "Others",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="currency" className="form-label">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="form-select"
              value={formData.currency}
              onChange={handleChange}
            >
              {["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"].map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="benefitStartMonth" className="form-label">
              Benefit Start Month
            </label>
            <select
              id="benefitStartMonth"
              name="benefitStartMonth"
              className="form-select"
              value={formData.benefitStartMonth}
              onChange={handleChange}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="benefitEndMonth" className="form-label">
              Benefit End Month
            </label>
            <select
              id="benefitEndMonth"
              name="benefitEndMonth"
              className="form-select"
              value={formData.benefitEndMonth}
              onChange={handleChange}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Current Price */}
          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="currentPrice" className="form-label">
              Current Price
            </label>
            <input
              type="number"
              id="currentPrice"
              name="currentPrice"
              className="form-control"
              value={formData.currentPrice}
              onChange={handleChange}
              placeholder="Enter current price"
              step="0.01"
            />
          </div>

          {/* Proposed Price */}
          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="proposedPrice" className="form-label">
              Proposed Price
            </label>
            <input
              type="number"
              id="proposedPrice"
              name="proposedPrice"
              className="form-control"
              value={formData.proposedPrice}
              onChange={handleChange}
              placeholder="Enter proposed price"
              step="0.01"
            />
          </div>

          {/* Estimated Savings Amount (Auto-calculated) */}
          <div className="mb-3 col-12 col-md-6 col-lg-4">
            <label htmlFor="estimatedSavings" className="form-label">
              Estimated Savings Amount
            </label>
            <input
              type="text"
              id="estimatedSavings"
              className="form-control bg-light"
              value={
                formData.currentPrice && formData.proposedPrice
                  ? `${formData.currency} ${(
                    parseFloat(formData.currentPrice) -
                    parseFloat(formData.proposedPrice)
                  ).toFixed(2)}`
                  : ""
              }
              readOnly
              placeholder="Auto-calculated"
            />
          </div>

          {/* Notes/Description */}
          <div className="mb-3 col-12">
            <label htmlFor="notesDescription" className="form-label">
              Notes/Description
            </label>
            <textarea
              id="notesDescription"
              name="notesDescription"
              className="form-control"
              value={formData.notesDescription}
              onChange={handleChange}
              placeholder="Enter any additional notes or description"
              rows="3"
            />
          </div>
        </div>

        {/* Forecast Table */}
        <div className="mt-4">
          <h5 className="text-center text-md-start">Forecasted Saving (Multi-Year)</h5>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              className="table table-bordered text-center"
              style={{
                tableLayout: 'fixed',
                minWidth: '900px',
                width: 'max-content'
              }}
            >
              <thead className="table-light">
                <tr>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    Year
                  </th>
                  {staticColumns.map((col) => (
                    <th
                      key={col}
                      style={{ 
                        textAlign: 'center', 
                        verticalAlign: 'middle',
                        width: (col === "Baseline" || col === "New Cost") ? '200px' : '150px'
                      }}
                    >
                      {col}
                    </th>
                  ))}
                  {itemColumns.map((col, colIndex) => (
                    <React.Fragment key={col}>
                      <th style={{ textAlign: 'left', verticalAlign: 'top', padding: '8px' }}>
                        Historical unit price ({col})
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2"
                          style={{
                            padding: '0',
                            fontSize: '14px',
                            lineHeight: '14px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                          }}
                          onClick={() => handleRemoveColumn(staticColumns.length + colIndex)}
                        >
                          X
                        </button>
                      </th>
                    </React.Fragment>
                  ))}
                  <th style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    Total
                  </th>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.forecastVolumes).map(([year, data], rowIndex) => {
                  const totalSaving = parseFloat(data["Annualized Benefits"]) || 0;
                  return (
                    <tr key={year}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        {year}
                      </td>
                      {staticColumns.map((col) => (
                        <td key={col}>
                          <input
                            type="number"
                            className={`form-control ${col === "Annualized Benefits" ? "bg-light" : ""}`}
                            style={{ width: '100%' }}
                            value={data[col]}
                            onChange={(e) => handleForecastChange(year, col, e.target.value)}
                            readOnly={col === "Annualized Benefits"}
                          />
                        </td>
                      ))}
                      {itemColumns.map((col) => (
                        <td key={col}>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '100%' }}
                            value={formData.historicalUnitPrices?.[year]?.[col] || ''}
                            onChange={(e) => handleHistoricalChange(year, col, e.target.value)}
                          />
                        </td>
                      ))}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <strong>{totalSaving.toFixed(2)}</strong>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveRow(rowIndex)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 mt-3">
            <button
              type="button"
              className="btn flex-fill"
              style={{ backgroundColor: "#578E7E", border: "none", color: "white" }}
              onClick={handleAddColumn}
            >
              Add Column
            </button>
            <button
              type="button"
              className="btn flex-fill"
              style={{ backgroundColor: "#578E7E", border: "none", color: "white" }}
              onClick={handleAddRow}
            >
              Add Row
            </button>
          </div>
        </div>

        {/* Forecast Volume (Multi-Year) Table */}
        {/* <div className="mt-4">
          <h5 className="text-center text-md-start">Forecasted Volume (Multi-Year)</h5>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              className="table table-bordered text-center"
              style={{
                tableLayout: 'fixed',
                minWidth: '900px',
                width: 'max-content'
              }}
            >
              <thead className="table-light">
                <tr>
                  <th style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    Year
                  </th>
                  {staticColumns.map((col) => (
                    <th
                      key={col}
                      style={{ textAlign: 'center', verticalAlign: 'middle' }}
                    >
                      {col}
                    </th>
                  ))}
                  {itemColumns.map((col) => (
                    <th key={col} style={{ textAlign: 'left', verticalAlign: 'top', padding: '8px' }}>
                      Multi-Year ({col})
                    </th>
                  ))}
                  <th style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.forecastVolumesMultiYear).map(([year, data]) => {
                  const total = [...staticColumns, ...itemColumns].reduce(
                    (sum, col) => sum + (parseFloat(data[col]) || 0),
                    0
                  );
                  return (
                    <tr key={year}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                        {year}
                      </td>
                      {staticColumns.map((col) => (
                        <td key={col}>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '100%' }}
                            value={data[col]}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                forecastVolumesMultiYear: {
                                  ...prev.forecastVolumesMultiYear,
                                  [year]: {
                                    ...prev.forecastVolumesMultiYear[year],
                                    [col]: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </td>
                      ))}
                      {itemColumns.map((col) => (
                        <td key={col}>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '100%' }}
                            value={data[col] || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                forecastVolumesMultiYear: {
                                  ...prev.forecastVolumesMultiYear,
                                  [year]: {
                                    ...prev.forecastVolumesMultiYear[year],
                                    [col]: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </td>
                      ))}
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <strong>{total.toFixed(2)}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div> */}


        {/* Submit Button */}
        <div className="d-flex justify-content-center mb-5 mt-4">
          <button
            type="submit"
            className="btn px-5 py-3 text-white fw-bold shadow-lg rounded-pill"
            style={{ 
              backgroundColor: "#578E7E", 
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              border: "none"
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {editId ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CostSavingForm;