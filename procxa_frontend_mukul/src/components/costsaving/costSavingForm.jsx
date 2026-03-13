import React, { useEffect, useState } from "react";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const initialRow = {
  Group: "",
  Supplier: "",
  Category: "",
  "Savings Year": "",
  "Savings Type": "",
  "In Year Benefit": "",
  "Run Rate": "",
  Currency: "",
};

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
  const { post, get } = useApi();
  const [intakeRequests, setIntakeRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    supplierName: "",
    depreciationScheduleYears: "",
    group: "",
    category: "",
    reportingYear: "",
    currency: "USD",
    benefitStartMonth: "",
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
    intakeRequest: "",
  });

  const [rows, setRows] = useState([{ ...initialRow }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForecastChange = (year, item, value) => {
    setFormData((prev) => ({
      ...prev,
      forecastVolumes: {
        ...prev.forecastVolumes,
        [year]: {
          ...prev.forecastVolumes[year],
          [item]: value,
        },
      },
    }));
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

  const handleSourcingChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addSourcingRow = () => {
    setRows([...rows, { ...initialRow }]);
  };

  const removeSourcingRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
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
    if (
      columnToRemove.startsWith("item") &&
      !dynamicBaseCols.includes(columnToRemove)
    ) {
      updatedAdditionalColumns = updatedAdditionalColumns.filter(
        (col) => col !== columnToRemove
      );
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
      "depreciationScheduleYears",
      "group",
      "category",
      "reportingYear",
      "currency",
      "benefitStartMonth",
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
        sourcingBenefits: rows,
      };

      const response = await post(endpoints.createCostSaving, payload);

      if (!response.status) throw new Error(response.message || "Submission failed.");

      alert(response.message || "Form submitted successfully!");
      setFormData({
        supplierName: "",
        depreciationScheduleYears: "",
        group: "",
        category: "",
        reportingYear: "",
        currency: "USD",
        benefitStartMonth: "",
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
        intakeRequest: "",
      });
    } catch (err) {
      alert("Error submitting form.");
      console.error(err);
    }
  };



  useEffect(() => {
    const fetchIntakeRequests = async () => {
      try {
        const res = await get(endpoints.getIntakeRequest);
        if (res.status) {
          setIntakeRequests(res.data);
        }
      } catch (error) {
        console.error("Error fetching intake requests:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await get(endpoints.getSuppliers);
        if (res.status) {
          setSuppliers(res.data);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };


    const fetchCategories = async () => {
      try {
        const response = await get(endpoints.getCategory);
        if (response) {
          // Handle both response.categories and response.data
          const cats = response.categories || response.data || [];
          setCategories(cats);
        }
      } catch (error) {
        setMessage({ type: "error", message: error.message });
      }
    };
    fetchCategories();
    fetchIntakeRequests();
    fetchSuppliers();
  }, []);

  const staticColumns = ["Baseline", "New Cost", "Annualized Benefits"];
  const itemColumns = ["item1", "item2", "item3", ...formData.additionalColumns];

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      <h2 className="text-center text-md-start">Add Cost Saving</h2>
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

          {[

            {
              label: "Depreciation Schedule Years",
              name: "depreciationScheduleYears",
              type: "number",
            },
            { label: "Group", name: "group" },

            { label: "Reporting Year", name: "reportingYear", type: "number" },
          ].map(({ label, name, type = "text" }) => (
            <div className="mb-3 col-12 col-md-6 col-lg-4" key={name}>
              <label htmlFor={name} className="form-label">
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                className="form-control"
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}

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
          <h5 className="text-center text-md-start">Forecasted price (Multi-Year)</h5>
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
                            onChange={(e) => handleForecastChange(year, col, e.target.value)}
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
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                historicalUnitPrices: {
                                  ...prev.historicalUnitPrices,
                                  [year]: {
                                    ...(prev.historicalUnitPrices?.[year] || {}),
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

        {/* Sourcing Benefit Table */}
        <div className="mt-4">
          <h5 className="text-center text-md-start">Sourcing Benefit</h5>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              className="table table-bordered text-center"
              style={{
                tableLayout: 'fixed',
                minWidth: '800px',
                width: 'max-content'
              }}
            >
              <thead className="table-light">
                <tr>
                  {[
                    "Group",
                    "Supplier",
                    "Category",
                    "Savings Year",
                    "Savings Type",
                    "In Year Benefit",
                    "Run Rate",
                    "Currency",
                  ].map((col) => (
                    <th
                      key={col}
                      style={{ whiteSpace: 'nowrap', textAlign: 'center', verticalAlign: 'middle' }}
                    >
                      {col}
                    </th>
                  ))}
                  <th style={{ whiteSpace: 'nowrap', textAlign: 'center', verticalAlign: 'middle' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {[
                      "Group",
                      "Supplier",
                      "Category",
                      "Savings Year",
                      "Savings Type",
                      "In Year Benefit",
                      "Run Rate",
                      "Currency",
                    ].map((col) => (
                      <td key={col}>
                        {/* {col === "Supplier" ? (
                            <select
                              className="form-select"
                              style={{
                                width: '100%',
                                height: '36px',
                              }}
                              value={row[col]}
                              onChange={(e) => handleSourcingChange(index, col, e.target.value)}
                            >
                              <option value="">Select Supplier</option>
                              {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.name || supplier.supplierName}>
                                  {supplier.name || supplier.supplierName}
                                </option>
                              ))}
                            </select>
                            
                          ) : (
                            <input
                              type={
                                col.includes("Year") ||
                                col.includes("Benefit") ||
                                col.includes("Rate")
                                  ? "number"
                                  : "text"
                              }
                              className="form-control"
                              style={{
                                width: '100%',
                                height: '36px',
                                textAlign: 'center',
                              }}
                              value={row[col]}
                              onChange={(e) => handleSourcingChange(index, col, e.target.value)}
                            />
                          )} */}

                        {col === "Supplier" ? (
                          <select
                            className="form-select"
                            style={{ width: "100%", height: "36px" }}
                            value={row[col]}
                            onChange={(e) => handleSourcingChange(index, col, e.target.value)}
                          >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                              <option
                                key={supplier.id}
                                value={supplier.id}
                              >
                                {supplier.name || supplier.supplierName}
                              </option>
                            ))}
                          </select>
                        ) : col === "Category" ? (
                          <select
                            className="form-select"
                            style={{ width: "100%", height: "36px" }}
                            value={row[col]}
                            onChange={(e) => handleSourcingChange(index, col, e.target.value)}
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option
                                key={category.id}
                                value={category.id}
                              >
                                {category.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={
                              col.includes("Year") ||
                                col.includes("Benefit") ||
                                col.includes("Rate")
                                ? "number"
                                : "text"
                            }
                            className="form-control"
                            style={{
                              width: "100%",
                              height: "36px",
                              textAlign: "center",
                            }}
                            value={row[col]}
                            onChange={(e) => handleSourcingChange(index, col, e.target.value)}
                          />
                        )}

                      </td>
                    ))}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSourcingRow(index)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex flex-column flex-md-row gap-2 mt-3">
            <button
              type="button"
              className="btn flex-fill"
              style={{ backgroundColor: "#578E7E", border: "none", color: "white" }}
              onClick={addSourcingRow}
            >
              Add Row
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center mt-5 mb-4">
          <button
            type="submit"
            className="btn px-5 py-2"
            style={{ backgroundColor: "#578E7E", border: "none", color: "white" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CostSavingForm;