// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./Sidebar.css";
// import Chatbot from "./Chatbot";

// const Sidebar = ({ collapsed, menuItemClick, permissions, userType, isOpen }) => {
//   const [openSubmenu, setOpenSubmenu] = useState(null); // Tracks the open submenu
//   // Chatbot logic removed (delegated to Chatbot.jsx)

//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleSubmenu = (menuName) => {
//     setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
//   };

//   // Function to check if a path is active
//   const isActive = (path) => {
//     return location.pathname === path;
//   }
//   // Function to check if any of the submenu items are active
//   const isSubmenuActive = (paths) => {
//     return paths.some((path) => location.pathname.startsWith(path));
//   };
//   const isFullAccess = userType === "admin" || userType === "superadmin";

//   // Ensure permissions is always an array
//   const canAccess = (option) => isFullAccess || (Array.isArray(permissions) && permissions.includes(option));



//   return (
//     <>
//       <div className={`sidebar-container ${collapsed ? "collapsed" : ""} ${isOpen ? "show" : ""}`}>
//         <div className="sidebar">
//           <ul className="menu">
//             {/* Dashboard Section */}
//             {(isFullAccess || canAccess("Dashboard")) && (
//               <li className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/dashboard"); menuItemClick(); }} >
//                   <i className="fa-solid fa-cubes"></i>
//                   <span className="menu-text">Dashboard</span>
//                 </div>
//               </li>
//             )}
//             {/* Intake Management Section */}
//             {(isFullAccess || canAccess("Intake Management")) && (
//               <li className={`menu-item ${isSubmenuActive(["/intakemanagement", "/intakecateedit"]) ? "active" : ""}`}>
//                 <div className="menu-link menu-i" onClick={() => toggleSubmenu("intakemanagement")}>
//                   <i className="fa-solid fa-list-check"></i>
//                   <span className="menu-text">Intake Management</span>
//                   <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "intakemanagement" ? "rotated" : ""}`}></i>
//                 </div>
//               </li>
//             )}

//             {(isFullAccess || canAccess("Intake Management")) && (
//               <ul className={`submenu ${openSubmenu === "intakemanagement" ? "expanded" : "collapsed"}`}>
//                 <li className={`submenu-item ${isActive("/intakemanagement") ? "active" : ""}`}
//                   onClick={() => { navigate("/intakemanagement"); setOpenSubmenu(null); menuItemClick(); }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Intake Management Dashboard
//                 </li>
//               </ul>
//             )}

//             {/* Contract Template Section */}
//             {(isFullAccess || canAccess("Contract Template")) && (
//               <li className={`menu-item ${isActive("/contracttemplate") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/contracttemplate"); menuItemClick(); }}>
//                   <i className="fa-solid fa-file-contract"></i>
//                   <span className="menu-text">Contract Template</span>
//                 </div>
//               </li>
//             )}

//             {/* Cost Saving Opportunities Section */}
//             {(isFullAccess || canAccess("Cost Saving Opportunities")) && (
//               <li className={`menu-item ${isSubmenuActive(["/volumedisc", "/suppliercons", "/serviceswo", "/honoring", "/additionalcomp", "/pricecomp", "/multiyear", "/others"]) ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => toggleSubmenu("costSaving")}>
//                   <i className="fa-solid fa-arrow-trend-up"></i>
//                   <span className="menu-text">Cost Saving Opportunities</span>
//                   <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "costSaving" ? "rotated" : ""}`}></i>
//                 </div>
//               </li>
//             )}

//             {(isFullAccess || canAccess("Cost Saving Opportunities")) && (
//               <ul className={`submenu ${openSubmenu === "costSaving" ? "expanded" : "collapsed"}`}>
//                 <li
//                   className={`submenu-item ${isActive("/costsaving") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/costsaving");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Cost Saving
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/volumedisc") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/volumedisc");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Volume Discounts
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/suppliercons") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/suppliercons");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Supplier Consolidation
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/serviceswo") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/serviceswo");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Service/SOW Consolidation
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/honoring") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/honoring");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Honoring Old Pricing
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/additionalcomp") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/additionalcomp");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Additional/Complementary Service
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/pricecomp") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/pricecomp");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Price Comparisons
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/multiyear") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/multiyear");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Multi-Year Contracting
//                 </li>
//                 <li
//                   className={`submenu-item ${isActive("/others") ? "active" : ""}`}
//                   onClick={() => {
//                     navigate("/others");
//                     setOpenSubmenu(null); menuItemClick();
//                   }}>
//                   <i className="fa-solid fa-arrow-trend-up"></i> Others
//                 </li>
//               </ul>
//             )}

//             {/* Approval Workflow Section */}
//             {(isFullAccess || canAccess("Approval Workflow")) && (
//               <li className={`menu-item ${isActive("/approvalworkflow") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/approvalworkflow"); menuItemClick(); }}>
//                   <i className="fa-solid fa-check-circle"></i>
//                   <span className="menu-text">Approval Workflow</span>
//                 </div>
//               </li>
//             )}

//             {/* Renewal Notifications Section */}
//             {(isFullAccess || canAccess("Renewal Notifications")) && (
//               <li className={`menu-item ${isActive("/renewalnotifi") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/renewalnotifi"); menuItemClick(); }}>
//                   <i className="fa-regular fa-comment-dots"></i>
//                   <span className="menu-text">Renewal Notifications</span>
//                 </div>
//               </li>
//             )}

//             {/* Renewal management Section */}
//             {(isFullAccess || canAccess("Renewal Management")) && (
//               <li className={`menu-item ${isActive("/renewalmanage") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/renewalmanage"); menuItemClick(); }}>
//                   <i className="fa-solid fa-envelope-open-text"></i>
//                   <span className="menu-text">Renewal Management</span>
//                 </div>
//               </li>
//             )}

//             {/* Contract Management Section */}
//             {(isFullAccess || canAccess("Contract Management")) && (
//               <>
//                 <li className={`menu-item ${isSubmenuActive(["/contractmanage", "/contractwearhouse", "/addnewcontact"]) ? "active" : ""}`}>
//                   <div className="menu-link menu-i" onClick={() => toggleSubmenu("contractmanage")}>
//                     <i className="fa-solid fa-file-contract"></i>
//                     <span className="menu-text">Contract Management</span>
//                     <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "contractmanage" ? "rotated" : ""}`}></i>
//                   </div>
//                 </li>

//                 <ul className={`submenu ${openSubmenu === "contractmanage" ? "expanded" : "collapsed"}`}>
//                   <li
//                     className={`submenu-item ${isActive("/contractmanage") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/contractmanage");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> Contract Dashboard
//                   </li>

//                   <li
//                     className={`submenu-item ${isActive("/contractwearhouse") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/contractwearhouse");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> All Contracts / Contract Warehouse
//                   </li>

//                   <li
//                     className={`submenu-item ${isActive("/addnewcontact") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/addnewcontact");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> Add Contract
//                   </li>
//                 </ul>
//               </>
//             )}

//             {(isFullAccess || canAccess("Department Management")) && (
//               <>
//                 <li className={`menu-item ${isSubmenuActive(["/adddepartment", "/viewdepartment"]) ? "active" : ""}`}>
//                   <div className="menu-link menu-i" onClick={() => toggleSubmenu("viewdepartment")}>
//                     <i className="fa-solid fa-file-contract"></i>
//                     <span className="menu-text">Department Management</span>
//                     <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "viewdepartment" ? "rotated" : ""}`}></i>
//                   </div>
//                 </li>

//                 <ul className={`submenu ${openSubmenu === "viewdepartment" ? "expanded" : "collapsed"}`}>
//                   <li
//                     className={`submenu-item ${isActive("/viewdepartment") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/viewdepartment");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> view department
//                   </li>

//                   <li
//                     className={`submenu-item ${isActive("/adddepartment") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/adddepartment");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> add department
//                   </li>
//                 </ul>
//               </>
//             )}

//             {/* Vendor Performance Section */}
//             {(isFullAccess || canAccess("Supplier Performance")) && (
//               <li className={`menu-item ${isActive("/vendorper") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/vendorper"); menuItemClick(); }}>
//                   <i className="fa-solid fa-file-signature"></i>
//                   <span className="menu-text">Supplier Performance</span>
//                 </div>
//               </li>
//             )}

//             {/* Spend Analytics Section */}
//             {(isFullAccess || canAccess("Spend Analytics")) && (
//               <li className={`menu-item ${isActive("/spendanalyt") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/spendanalyt"); menuItemClick(); }}>
//                   <i className="fa-solid fa-chart-line"></i>
//                   <span className="menu-text">Spend Analytics</span>
//                 </div>
//               </li>
//             )}

//             {/* License Management Section */}
//             {(isFullAccess || canAccess("License Management")) && (
//               <li className={`menu-item ${isActive("/license-management") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/license-management"); menuItemClick(); }}>
//                   <i className="fa-solid fa-id-card"></i>
//                   <span className="menu-text">License Management</span>
//                 </div>
//               </li>
//             )}

//             {/* Intelligent Insights Section */}
//             {(isFullAccess || canAccess("Intelligent Insights")) && (
//               <li className={`menu-item ${isActive("/intelligent-insights") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/intelligent-insights"); menuItemClick(); }}>
//                   <i className="fa-solid fa-lightbulb"></i>
//                   <span className="menu-text">Intelligent Insights</span>
//                 </div>
//               </li>
//             )}

//             {/* Add category and Sub Category */}
//             {(isFullAccess || canAccess("Add")) && (
//               <>
//                 <li className={`menu-item ${isSubmenuActive(["/addcategory", "/addtransaction", "/intakecateedit", "/viewdepartment", "/addperformance", "/addSupplier"]) ? "active" : ""}`}>
//                   <div className="menu-link menu-i" onClick={() => toggleSubmenu("addcategory")}>
//                     <i className="fa-solid fa-arrow-trend-up"></i>
//                     <span className="menu-text">Add</span>
//                     <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "addcategory" ? "rotated" : ""}`}></i>
//                   </div>
//                 </li>

//                 <ul className={`submenu ${openSubmenu === "addcategory" ? "expanded" : "collapsed"}`}>
//                   <li className={`submenu-item ${isActive("/intakecateedit") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/intakecateedit");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> Add Category
//                   </li>

//                   <li className={`submenu-item ${isActive("/addSupplier") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/addSupplier");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> Add Supplier
//                   </li>

//                   <li className={`submenu-item ${isActive("/addperformance") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/addperformance");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> Add Supplier Rating
//                   </li>

//                   <li className={`submenu-item ${isActive("/addtransaction") ? "active" : ""}`}
//                     onClick={() => {
//                       navigate("/addtransaction");
//                       setOpenSubmenu(null);
//                       menuItemClick();
//                     }}>
//                     <i className="fa-solid fa-arrow-trend-up"></i> Add Transaction
//                   </li>
//                 </ul>
//               </>
//             )}

//             {/* AI Training Section */}
//             {/* {(isFullAccess || canAccess("Train AI")) && (
//               <li className={`menu-item ${isActive("/train-ai") ? "active" : ""}`}>
//                 <div
//                 className="menu-link menu-i"
//                   onClick={() => { navigate("/train-ai"); menuItemClick(); }}>
//                   <i className="fa-solid fa-robot"></i>
//                   <span className="menu-text">Train AI</span>
//                 </div>
//               </li>
//             )} */}

//             {/* SuperAdmin - Manage Admins Section */}
//             {userType === "superadmin" && (
//               <li className={`menu-item ${isActive("/superadmin/manage-admins") ? "active" : ""}`}>
//                 <div
//                   className="menu-link menu-i"
//                   onClick={() => { navigate("/superadmin/manage-admins"); menuItemClick(); }}>
//                   <i className="fa-solid fa-users-gear"></i>
//                   <span className="menu-text">Manage Admins</span>
//                 </div>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>

//       {/* Real Chatbot Component */}
//       <Chatbot />
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Chatbot from "./Chatbot";
import "./Sidebar.css";

const Sidebar = ({ collapsed, menuItemClick, permissions, userType, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);



  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (paths) => paths.some((path) => location.pathname.startsWith(path));
  const isFullAccess = userType === "admin" || userType === "superadmin";
  const canAccess = (option) => isFullAccess || (Array.isArray(permissions) && permissions.includes(option));



  return (
    <>
      <div className={`sidebar-container ${collapsed ? "collapsed" : ""} ${isOpen ? "show" : ""}`}>
        <div className="sidebar">
          <ul className="menu">
            {/* Dashboard Section */}
            {(isFullAccess || canAccess("Dashboard")) && (
              <li className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/dashboard"); menuItemClick(); }} >
                  <i className="fa-solid fa-cubes"></i>
                  <span className="menu-text">Dashboard</span>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Intake Management")) && (
              <li className={`menu-item ${isSubmenuActive(["/intakemanagement", "/intakecateedit"]) ? "active" : ""}`}>
                <div className="menu-link menu-i" onClick={() => toggleSubmenu("intakemanagement")}>
                  <i className="fa-solid fa-list-check"></i>
                  <span className="menu-text">Intake Management</span>
                  <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "intakemanagement" ? "rotated" : ""}`}></i>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Intake Management")) && (
              <ul className={`submenu ${openSubmenu === "intakemanagement" ? "expanded" : "collapsed"}`}>
                <li className={`submenu-item ${isActive("/intakemanagement") ? "active" : ""}`}
                  onClick={() => { navigate("/intakemanagement"); setOpenSubmenu(null); menuItemClick(); }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Intake Management Dashboard
                </li>
              </ul>
            )}

            {(isFullAccess || canAccess("Contract Template")) && (
              <li className={`menu-item ${isActive("/contracttemplate") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/contracttemplate"); menuItemClick(); }}>
                  <i className="fa-solid fa-file-contract"></i>
                  <span className="menu-text">Contract Template</span>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Cost Saving Opportunities")) && (
              <li className={`menu-item ${isSubmenuActive(["/volumedisc", "/suppliercons", "/serviceswo", "/honoring", "/additionalcomp", "/pricecomp", "/multiyear", "/others"]) ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => toggleSubmenu("costSaving")}>
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  <span className="menu-text">Cost Saving Opportunities</span>
                  <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "costSaving" ? "rotated" : ""}`}></i>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Cost Saving Opportunities")) && (
              <ul className={`submenu ${openSubmenu === "costSaving" ? "expanded" : "collapsed"}`}>
                <li
                  className={`submenu-item ${isActive("/costsaving") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/costsaving");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Cost Saving
                </li>
                <li
                  className={`submenu-item ${isActive("/volumedisc") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/volumedisc");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Volume Discounts
                </li>
                <li
                  className={`submenu-item ${isActive("/suppliercons") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/suppliercons");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Supplier Consolidation
                </li>
                <li
                  className={`submenu-item ${isActive("/serviceswo") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/serviceswo");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Service/SOW Consolidation
                </li>
                <li
                  className={`submenu-item ${isActive("/honoring") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/honoring");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Honoring Old Pricing
                </li>
                <li
                  className={`submenu-item ${isActive("/additionalcomp") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/additionalcomp");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Additional/Complementary Service
                </li>
                <li
                  className={`submenu-item ${isActive("/pricecomp") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/pricecomp");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Price Comparisons
                </li>
                <li
                  className={`submenu-item ${isActive("/multiyear") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/multiyear");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Multi-Year Contracting
                </li>
                <li
                  className={`submenu-item ${isActive("/others") ? "active" : ""}`}
                  onClick={() => {
                    navigate("/others");
                    setOpenSubmenu(null); menuItemClick();
                  }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Others
                </li>
              </ul>
            )}

            {(isFullAccess || canAccess("Approval Workflow")) && (
              <li className={`menu-item ${isActive("/approvalworkflow") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/approvalworkflow"); menuItemClick(); }}>
                  <i className="fa-solid fa-check-circle"></i>
                  <span className="menu-text">Approval Workflow</span>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Renewal Notifications")) && (
              <li className={`menu-item ${isActive("/renewalnotifi") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/renewalnotifi"); menuItemClick(); }}>
                  <i className="fa-regular fa-comment-dots"></i>
                  <span className="menu-text">Renewal Notifications</span>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Renewal Management")) && (
              <li className={`menu-item ${isSubmenuActive(["/renewalmanage", "/renewal-automation"]) ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => toggleSubmenu("renewalmanage")}>
                  <i className="fa-solid fa-envelope-open-text"></i>
                  <span className="menu-text">Renewal Management</span>
                  <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "renewalmanage" ? "rotated" : ""}`}></i>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Renewal Management")) && (
              <ul className={`submenu ${openSubmenu === "renewalmanage" ? "expanded" : "collapsed"}`}>
                <li className={`submenu-item ${isActive("/renewalmanage") ? "active" : ""}`}
                  onClick={() => { navigate("/renewalmanage"); setOpenSubmenu(null); menuItemClick(); }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Renewal Dashboard
                </li>
                <li className={`submenu-item ${isActive("/renewal-automation") ? "active" : ""}`}
                  onClick={() => { navigate("/renewal-automation"); setOpenSubmenu(null); menuItemClick(); }}>
                  <i className="fa-solid fa-magic"></i> Automated Renewal
                </li>
              </ul>
            )}

            {(isFullAccess || canAccess("Contract Management")) && (
              <>
                <li className={`menu-item ${isSubmenuActive(["/contractmanage", "/contractwearhouse", "/addnewcontact"]) ? "active" : ""}`}>
                  <div className="menu-link menu-i" onClick={() => toggleSubmenu("contractmanage")}>
                    <i className="fa-solid fa-file-contract"></i>
                    <span className="menu-text">Contract Management</span>
                    <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "contractmanage" ? "rotated" : ""}`}></i>
                  </div>
                </li>

                <ul className={`submenu ${openSubmenu === "contractmanage" ? "expanded" : "collapsed"}`}>
                  <li
                    className={`submenu-item ${isActive("/contractmanage") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/contractmanage");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> Contract Dashboard
                  </li>

                  <li
                    className={`submenu-item ${isActive("/contractwearhouse") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/contractwearhouse");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> All Contracts / Contract Warehouse
                  </li>

                  <li
                    className={`submenu-item ${isActive("/addnewcontact") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/addnewcontact");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> Add Contract
                  </li>
                </ul>
              </>
            )}

            {(isFullAccess || canAccess("Department Management")) && (
              <>
                <li className={`menu-item ${isSubmenuActive(["/adddepartment", "/viewdepartment"]) ? "active" : ""}`}>
                  <div className="menu-link menu-i" onClick={() => toggleSubmenu("viewdepartment")}>
                    <i className="fa-solid fa-file-contract"></i>
                    <span className="menu-text">Department Management</span>
                    <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "viewdepartment" ? "rotated" : ""}`}></i>
                  </div>
                </li>

                <ul className={`submenu ${openSubmenu === "viewdepartment" ? "expanded" : "collapsed"}`}>
                  <li
                    className={`submenu-item ${isActive("/viewdepartment") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/viewdepartment");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> view department
                  </li>

                  <li
                    className={`submenu-item ${isActive("/adddepartment") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/adddepartment");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> add department
                  </li>
                </ul>
              </>
            )}

            {(isFullAccess || canAccess("Supplier Performance")) && (
              <li className={`menu-item ${isActive("/vendorper") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/vendorper"); menuItemClick(); }}>
                  <i className="fa-solid fa-file-signature"></i>
                  <span className="menu-text">Supplier Performance</span>
                </div>
              </li>
            )}

            {(isFullAccess || canAccess("Spend Analytics")) && (
              <li className={`menu-item ${isActive("/spendanalyt") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/spendanalyt"); menuItemClick(); }}>
                  <i className="fa-solid fa-chart-line"></i>
                  <span className="menu-text">Spend Analytics</span>
                </div>
              </li>
            )}

            {/* License Management Section */}
            {(isFullAccess || canAccess("License Management")) && (
              <>
                <li className={`menu-item ${isActive("/license-management") ? "active" : ""}`}>
                  <div
                    className="menu-link menu-i"
                    onClick={() => { navigate("/license-management"); menuItemClick(); }}>
                    <i className="fa-solid fa-chart-pie"></i>
                    <span className="menu-text">License Overview</span>
                  </div>
                </li>
                <li className={`menu-item ${isActive("/client-license-management") ? "active" : ""}`}>
                  <div
                    className="menu-link menu-i"
                    onClick={() => { navigate("/client-license-management"); menuItemClick(); }}>
                    <i className="fa-solid fa-id-card"></i>
                    <span className="menu-text">Third-Party Licenses</span>
                  </div>
                </li>
              </>
            )}

            {/* Inventory Management Section */}
            {(isFullAccess || canAccess("Inventory")) && (
              <li className={`menu-item ${isActive("/inventory-management") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/inventory-management"); menuItemClick(); }}>
                  <i className="fa-solid fa-boxes-stacked"></i>
                  <span className="menu-text">Inventory</span>
                </div>
              </li>
            )}

            {/* Intelligent Insights Section */}
            {(isFullAccess || canAccess("Intelligent Insights")) && (
              <li className={`menu-item ${isActive("/intelligent-insights") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/intelligent-insights"); menuItemClick(); }}>
                  <i className="fa-solid fa-lightbulb"></i>
                  <span className="menu-text">Intelligent Insights</span>
                </div>
              </li>
            )}


            {/* add */}

            {(isFullAccess || canAccess("Add")) && (
              <>
                <li className={`menu-item ${isSubmenuActive(["/addcategory", "/addtransaction", "/intakecateedit", "/viewdepartment", "/addperformance", "/addSupplier"]) ? "active" : ""}`}>
                  <div className="menu-link menu-i" onClick={() => toggleSubmenu("addcategory")}>
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span className="menu-text">Add</span>
                    <i className={`fa-solid fa-chevron-down submenu-arrow ${openSubmenu === "addcategory" ? "rotated" : ""}`}></i>
                  </div>
                </li>

                <ul className={`submenu ${openSubmenu === "addcategory" ? "expanded" : "collapsed"}`}>
                  <li className={`submenu-item ${isActive("/intakecateedit") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/intakecateedit");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> Add Category
                  </li>

                  <li className={`submenu-item ${isActive("/addSupplier") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/addSupplier");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> Add Supplier
                  </li>

                  {/* <li className={`submenu-item ${isActive("/addperformance") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/addperformance");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> Add Supplier Rating
                  </li> */}

                  <li className={`submenu-item ${isActive("/addtransaction") ? "active" : ""}`}
                    onClick={() => {
                      navigate("/addtransaction");
                      setOpenSubmenu(null);
                      menuItemClick();
                    }}>
                    <i className="fa-solid fa-arrow-trend-up"></i> Add Transaction
                  </li>
                </ul>
              </>
            )}

            {userType === "superadmin" && (
              <li className={`menu-item ${isActive("/superadmin/manage-admins") ? "active" : ""}`}>
                <div
                  className="menu-link menu-i"
                  onClick={() => { navigate("/superadmin/manage-admins"); menuItemClick(); }}>
                  <i className="fa-solid fa-users-gear"></i>
                  <span className="menu-text">Admin User Licenses</span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>



      {/* Chatbot UI - Pure Frontend AI */}
      {/* Real Chatbot Component */}
      <Chatbot />
    </>

  );
};

export default Sidebar;