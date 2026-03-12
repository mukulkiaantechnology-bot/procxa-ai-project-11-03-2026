// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Link, useNavigate } from "react-router-dom";
// import endpoints from "../../api/endPoints";
// import useApi from "../../hooks/useApi";
// import { FaEdit, FaTrash } from "react-icons/fa"; 


// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function HonoringOldPricing() {
//   const [pricingData, setPricingData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { get, del } = useApi();
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await get(endpoints.getOldPricing);
//         if (response.status) {
//           setPricingData(response.data || []);
//         } else {
//           setError(response.message || "Failed to fetch data");
//         }
//       } catch (error) {
//         console.error("Error fetching old pricing data:", error);
//         setError(error.message || "An error occurred while fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleEdit = (id) => {
//     navigate(`/addoldpricehonering?id=${id}`);
//   };

//   const handleDelete = async(id) => {
//     if (window.confirm("Are you sure you want to delete this Old Pricing?")) {
//       try {
//         await del(`${endpoints.deleteOldPricing}/${id}`);
//         setPricingData(pricingData.filter(service => service.id !== id));
//       } catch (error) {
//         console.error("Error deleting Old Pricing:", error);
//       }
//     }
//   };

//   const chartData = {
//     labels: pricingData.map((item) => item.supplier?.name || "Unknown"),
//     datasets: [
//       {
//         label: "Old Pricing",
//         data: pricingData.map((item) => parseFloat(item.oldPrice || 0)),
//         backgroundColor: "#518bbb",
//       },
//       {
//         label: "Current Quotation",
//         data: pricingData.map((item) => parseFloat(item.currentQuotation || 0)),
//         backgroundColor: "#c47088",
//       },
//     ],
//   };

//   return (
//     <div className="container">
//       <div className="mb-4 text-start">
//         <div className="d-flex justify-content-between align-items-center">
//           <h3 className="fw-bold">Honoring Old Pricing</h3>
//           <Link to="/addoldpricehonering">
//             <button className="btn btn-success">Add Honoring</button>
//           </Link>
//         </div>
//         <h5 className="mt-5">
//           <u className="fw-bold">Historical Contracts</u>
//         </h5>
//       </div>

//       {/* ================= LOADING STATE ================= */}
//       {loading && (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading data...</p>
//         </div>
//       )}

//       {/* ================= ERROR STATE ================= */}
//       {error && !loading && (
//         <div className="alert alert-danger" role="alert">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* ================= TABLE ================= */}
//       {!loading && !error && (
//         <div className="table-responsive">
//           <table className="table table-striped table-bordered text-center">
//             <thead className="table-light">
//               <tr>
//                 <th>Supplier Name</th>
//                 <th>Product/Service Name</th>
//                 <th>Old Pricing</th>
//                 <th>Current Quotation</th>
//                 <th>Saving from Old Pricing</th>
//                 <th>Status</th>
//                 <th>Action</th> {/* Added Action Column */}
//               </tr>
//             </thead>
//             <tbody>
//               {pricingData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.supplier?.name || "N/A"}</td>
//                   <td>{row.subcategory?.name || "N/A"}</td>
//                   <td>${row.oldPrice}</td>
//                   <td>${row.currentQuotation}</td>
//                   <td>${row.savingFromOldPricing}</td>
//                   <td>{row.status}</td>
//                   <td>
//                     <FaEdit className="text-primary mx-2 cursor-pointer" onClick={() => handleEdit(row.id)} />
//                     <FaTrash className="text-danger cursor-pointer" onClick={() => handleDelete(row.id)} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ================= CHART ================= */}
//       {!loading && !error && pricingData.length > 0 && (
//         <div className="mt-5">
//         <div className="row justify-content-center">
//           <div className="col-12 col-md-10">
//             <Bar
//               data={chartData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: "top" },
//                   title: { display: true, text: "Supplier Pricing Comparison" },
//                   tooltip: {
//                     callbacks: {
//                       label: (context) => `$${context.raw}`,
//                     },
//                   },
//                 },
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: { callback: (value) => `$${value}` },
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>
//       </div>
//       )}

//       {/* Cost Saving Navigation Buttons */}
//       <div className="d-flex justify-content-between align-items-center mt-4 mb-4" style={{ flexWrap: 'wrap', gap: '10px' }}>
//         <button
//           className="btn"
//           onClick={() => navigate('/serviceswo')}
//           style={{
//             backgroundColor: '#f8f9fa',
//             color: '#333',
//             border: '1px solid #dee2e6',
//             padding: '10px 20px',
//             borderRadius: '6px',
//             minWidth: '120px'
//           }}
//         >
//           <i className="fa-solid fa-arrow-left me-2"></i>Previous
//         </button>
//         <button
//           className="btn text-white"
//           onClick={() => navigate('/additionalcomp')}
//           style={{
//             backgroundColor: '#578e7e',
//             border: 'none',
//             padding: '10px 30px',
//             borderRadius: '6px',
//             minWidth: '150px',
//             fontWeight: '500'
//           }}
//         >
//           Next<i className="fa-solid fa-arrow-right ms-2"></i>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default HonoringOldPricing;





import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import endpoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";
import { FaEdit, FaTrash } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HonoringOldPricing() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get, del } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await get(endpoints.getOldPricing);

        // ✅ SAFE API RESPONSE HANDLING — Works with your /procxa/get_all_old_pricing
        if (response && typeof response === "object") {
          // Case: API returns { status: true, data: [...] }
          if (response.status === true && Array.isArray(response.data)) {
            setPricingData(response.data);
          }
          // Case: API returns direct array (some backends do this)
          else if (Array.isArray(response)) {
            setPricingData(response);
          }
          // Case: API returns { data: [...] } without status
          else if (Array.isArray(response.data)) {
            setPricingData(response.data);
          }
          // Case: Error from backend
          else if (response.message) {
            setError(response.message);
          } else {
            setError("Unexpected response format from server");
          }
        } else {
          setError("Invalid or empty response from server");
        }
      } catch (err) {
        console.error("Error fetching old pricing data:", err);
        setError(err.message || "Failed to load pricing data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // ❌ DO NOT unregister ChartJS — causes white screen on client-side nav
  }, []);

  const handleEdit = (id) => {
    navigate(`/addoldpricehonering?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Old Pricing?")) return;

    try {
      await del(`${endpoints.deleteOldPricing}/${id}`);
      setPricingData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const chartData = {
    labels: pricingData.map((item) => item.supplier?.name || "Unknown"),
    datasets: [
      {
        label: "Old Pricing",
        data: pricingData.map((item) => parseFloat(item.oldPrice) || 0),
        backgroundColor: "#518bbb",
      },
      {
        label: "Current Quotation",
        data: pricingData.map((item) => parseFloat(item.currentQuotation) || 0),
        backgroundColor: "#c47088",
      },
    ],
  };

  return (
    <div className="container">
      <div className="mb-4 text-start">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">Honoring Old Pricing</h3>
          <Link to="/addoldpricehonering">
            <button className="btn btn-success">Add Honoring</button>
          </Link>
        </div>
        <h5 className="mt-5">
          <u className="fw-bold">Historical Contracts</u>
        </h5>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading data...</p>
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Supplier Name</th>
                <th>Product/Service Name</th>
                <th>Old Pricing</th>
                <th>Current Quotation</th>
                <th>Saving from Old Pricing</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row) => (
                <tr key={row.id || row.supplier?.name || Math.random()}>
                  <td>{row.supplier?.name || "N/A"}</td>
                  <td>{row.subcategory?.name || "N/A"}</td>
                  <td>${parseFloat(row.oldPrice || 0).toFixed(2)}</td>
                  <td>${parseFloat(row.currentQuotation || 0).toFixed(2)}</td>
                  <td>${parseFloat(row.savingFromOldPricing || 0).toFixed(2)}</td>
                  <td>{row.status || "N/A"}</td>
                  <td>
                    <FaEdit
                      className="text-primary mx-2 cursor-pointer"
                      onClick={() => handleEdit(row.id)}
                    />
                    <FaTrash
                      className="text-danger cursor-pointer"
                      onClick={() => handleDelete(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHART */}
      {!loading && !error && pricingData.length > 0 && (
        <div className="mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Supplier Pricing Comparison" },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <button
          className="btn"
          onClick={() => navigate('/serviceswo')}
          style={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            border: '1px solid #dee2e6',
            padding: '10px 20px',
            borderRadius: '6px',
            minWidth: '120px'
          }}
        >
          <i className="fa-solid fa-arrow-left me-2"></i>Previous
        </button>
        <button
          className="btn text-white"
          onClick={() => navigate('/additionalcomp')}
          style={{
            backgroundColor: '#578e7e',
            border: 'none',
            padding: '10px 30px',
            borderRadius: '6px',
            minWidth: '150px',
            fontWeight: '500'
          }}
        >
          Next<i className="fa-solid fa-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  );
}

export default HonoringOldPricing;






// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useNavigate } from "react-router-dom";
// import endpoints from "../../api/endPoints";
// import useApi from "../../hooks/useApi";
// import { FaEdit, FaTrash } from "react-icons/fa";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function HonoringOldPricing() {
//   const [pricingData, setPricingData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { get, del } = useApi();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await get(endpoints.getOldPricing);

//         if (response?.status) {
//           setPricingData(response.data || []);
//         } else {
//           setError(response?.message || "Failed to fetch data");
//         }
//       } catch (err) {
//         console.error("Error fetching old pricing data:", err);
//         setError("An error occurred while fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Chart.js safe cleanup (prevents white screen)
//     return () => {
//       ChartJS.unregister(
//         CategoryScale,
//         LinearScale,
//         BarElement,
//         Title,
//         Tooltip,
//         Legend
//       );
//     };
//   }, []);

//   const handleEdit = (id) => {
//     navigate(`/addoldpricehonering?id=${id}`);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this Old Pricing?"))
//       return;

//     try {
//       await del(`${endpoints.deleteOldPricing}/${id}`);
//       setPricingData((prev) => prev.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error("Error deleting Old Pricing:", error);
//     }
//   };

//   const chartData = {
//     labels: pricingData.map((item) => item.supplier?.name || "Unknown"),
//     datasets: [
//       {
//         label: "Old Pricing",
//         data: pricingData.map((item) => Number(item.oldPrice || 0)),
//         backgroundColor: "#518bbb",
//       },
//       {
//         label: "Current Quotation",
//         data: pricingData.map((item) =>
//           Number(item.currentQuotation || 0)
//         ),
//         backgroundColor: "#c47088",
//       },
//     ],
//   };

//   return (
//     <div className="container">
//       <div className="mb-4 text-start">
//         <div className="d-flex justify-content-between align-items-center">
//           <h3 className="fw-bold">Honoring Old Pricing</h3>


//         {/* FIXED BUTTON */}
//           {/* <button
//             type="button"
//             className="btn btn-success"
//             onClick={() => navigate("/addoldpricehonering")}
//           >
//             Add Honoring
//           </button> */}
//         </div> 

//         <h5 className="mt-5">
//           <u className="fw-bold">Historical Contracts</u>
//         </h5>
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status" />
//           <p className="mt-2">Loading data...</p>
//         </div>
//       )}

//       {/* ERROR */}
//       {error && !loading && (
//         <div className="alert alert-danger">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* TABLE */}
//       {!loading && !error && (
//         <div className="table-responsive">
//           <table className="table table-striped table-bordered text-center">
//             <thead className="table-light">
//               <tr>
//                 <th>Supplier Name</th>
//                 <th>Product/Service Name</th>
//                 <th>Old Pricing</th>
//                 <th>Current Quotation</th>
//                 <th>Saving from Old Pricing</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pricingData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.supplier?.name || "N/A"}</td>
//                   <td>{row.subcategory?.name || "N/A"}</td>
//                   <td>${row.oldPrice}</td>
//                   <td>${row.currentQuotation}</td>
//                   <td>${row.savingFromOldPricing}</td>
//                   <td>{row.status}</td>
//                   <td>
//                     {/* <FaEdit
//                       className="text-primary mx-2 cursor-pointer"
//                       onClick={() => handleEdit(row.id)}
//                     /> */}
//                     <FaTrash
//                       className="text-danger cursor-pointer"
//                       onClick={() => handleDelete(row.id)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* CHART */}
//       {!loading && !error && pricingData.length > 0 && (
//         <div className="mt-5">
//           <div className="row justify-content-center">
//             <div className="col-12 col-md-10">
//               <Bar
//                 data={chartData}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: { position: "top" },
//                     title: {
//                       display: true,
//                       text: "Supplier Pricing Comparison",
//                     },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       ticks: {
//                         callback: (value) => `$${value}`,
//                       },
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* NAV BUTTONS */}
//       <div className="d-flex justify-content-between mt-4 mb-4 flex-wrap gap-2">
//         <button
//           type="button"
//           className="btn"
//           onClick={() => navigate("/serviceswo")}
//           style={{
//             backgroundColor: "#f8f9fa",
//             border: "1px solid #dee2e6",
//           }}
//         >
//           ← Previous
//         </button>

//         <button
//           type="button"
//           className="btn text-white"
//           onClick={() => navigate("/additionalcomp")}
//           style={{ backgroundColor: "#578e7e" }}
//         >
//           Next →
//         </button>
//       </div>
//     </div>
//   );
// }

// export default HonoringOldPricing;

//-----------------------------------------------------------


