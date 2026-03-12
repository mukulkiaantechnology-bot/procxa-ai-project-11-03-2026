// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";

// const Navbar = ({ toggleSidebar }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <nav className="custom-navbar">
//         <div className="nav-container">

//           {/* LEFT : BRAND */}
//           <div className="nav-left">
//             {/* <span className="nav-brand">ProcXa-AI</span> */}
//             <span className="nav-brand">Kiaan Technology</span>
//           </div>

//           {/* RIGHT : ICONS */}
//           <div className="nav-right">

//             {/* MOBILE TOGGLE (ONLY MOBILE) */}
//             <button
//               className="mobile-toggle"
//               onClick={toggleSidebar}
//               aria-label="Toggle Sidebar">
//               <i className="fa fa-bars"></i>
//             </button>

//             {/* NOTIFICATION */}
//             <span className="bell-icon">
//               <i className="fa-regular fa-bell"></i>
//             </span>

//             {/* PROFILE */}
//             <div className="dropdown profile-elemen" ref={dropdownRef}>
//               <div
//                 className="profile-trigger"
//                 onClick={toggleDropdown}
//                 aria-expanded={isDropdownOpen}>
//                 <i className="fa-solid fa-circle-user user-icon"></i>
//               </div>

//               <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
//                 <li>
//                   <Link className="dropdown-item" to="/" onClick={() => setIsDropdownOpen(false)}>
//                     Logout
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//           </div>
//         </div>
//       </nav>

//       {/* ================= CSS ================= */}
//       <style>{`
//         /* NAVBAR BASE */
//         .custom-navbar {
//           height: 60px;
//           background-color: #ffffff;
//           border-bottom: 1px solid #eee;
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           z-index: 100;
//         }

//         .nav-container {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           height: 100%;
//           padding: 0 16px;
//         }

//         /* LEFT */
//         .nav-brand {
//           font-size: 22px;
//           font-weight: 700;
//           color: #578e7e;
//         }

//         /* RIGHT */
//         .nav-right {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//         }

//         /* MOBILE TOGGLE */
//         .mobile-toggle {
//           display: none;
//           background: none;
//           border: none;
//           font-size: 20px;
//           color: #578e7e;
//           cursor: pointer;
//         }

//         @media (max-width: 640px) {
//           .mobile-toggle {
//             display: block;
//           }
//         }

//         /* ICONS */
//         .bell-icon i {
//           font-size: 18px;
//           color: #578e7e;
//           cursor: pointer;
//         }

//         /* PROFILE */
//         .profile-trigger {
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//         }

//         .user-icon {
//           font-size: 26px;
//           color: #578e7e;
//         }

//         /* DESKTOP DROPDOWN */
//         .dropdown-menu {
//           position: absolute;
//           right: 0;
//           background-color: white;
//           border: 1px solid rgba(0,0,0,.15);
//           border-radius: 0.375rem;
//           box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
//           padding: 0.5rem 0;
//           margin: 0.125rem 0 0;
//           min-width: 10rem;
//           display: none;
//         }

//         .dropdown-menu.show {
//           display: block;
//         }

//         .dropdown-item {
//           display: block;
//           width: 100%;
//           padding: 0.25rem 1rem;
//           clear: both;
//           font-weight: 400;
//           color: #212529;
//           text-align: inherit;
//           text-decoration: none;
//           white-space: nowrap;
//           background-color: transparent;
//           border: 0;
//         }

//         .dropdown-item:hover {
//           color: #1e2125;
//           background-color: #e9ecef;
//         }

//         /* REMOVE DESKTOP EXTRA GAP */
//         @media (min-width: 641px) {
//           .nav-container {
//             padding-right: 20px;
//           }
//         }

//         /* FIX FOR MOBILE: Adjust dropdown positioning */
//         @media (max-width: 640px) {
//           .profile-elemen {
//             position: relative;
//           }

//           .profile-elemen .dropdown-menu {
//             position: fixed !important;
//             top: 60px !important; /* Align with navbar height */
//             right: 0 !important;
//             left: auto !important;
//             width: 150px !important;
//             max-width: 50vw !important;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//             border-radius: 0 0 4px 4px;
//             z-index: 1000;
//           }

//           /* Make the dropdown more mobile-friendly */
//           .dropdown-menu-end {
//             right: 0 !important;
//             left: auto !important;
//           }

//           .nav-container {
//             padding-right: 8px; /* Reduces the gap to avoid overflowing */
//           }
//         }
//       `}</style>
//     </>
//   );
// };
// {/* <Chatbot/> */ }
// export default Navbar;



import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="custom-navbar">
        <div className="nav-container">
          <span className="nav-brand" >Procxa-Ai</span>

          {/* LEFT : LOGO + BRAND */}
          {/* <div className="nav-left brand-wrapper">
            <img
              src={logo}
              alt="Kiaan Technology Logo"
              className="brand-logo"
            />
            <span className="nav-brand">Kiaan Technology</span>
          </div> */}

          {/* RIGHT : ICONS */}
          <div className="nav-right">

            {/* MOBILE TOGGLE */}
            <button
              className="mobile-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar">
              <i className="fa fa-bars"></i>
            </button>

            {/* NOTIFICATION */}
            <span className="bell-icon">
              <i className="fa-regular fa-bell"></i>
            </span>

            {/* PROFILE */}
            <div className="dropdown profile-elemen" ref={dropdownRef}>
              <div
                className="profile-trigger"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}>
                <i className="fa-solid fa-circle-user user-icon"></i>
              </div>

              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/"
                    onClick={() => setIsDropdownOpen(false)}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </nav>

      {/* ================= CSS ================= */}
      <style>{`
        /* NAVBAR BASE */
        .custom-navbar {
          height: 60px;
          background-color: #ffffff;
          border-bottom: 1px solid #eee;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 16px;
        }

        /* LEFT */
        .brand-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-logo {
          height: 36px;
          width: auto;
          object-fit: contain;
        }

        .nav-brand {
          font-size: 22px;
          font-weight: 700;
          color: #578e7e;
        }

        /* RIGHT */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* MOBILE TOGGLE */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          color: #578e7e;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .mobile-toggle {
            display: block;
          }
        }

        /* ICONS */
        .bell-icon i {
          font-size: 18px;
          color: #578e7e;
          cursor: pointer;
        }

        /* PROFILE */
        .profile-trigger {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .user-icon {
          font-size: 26px;
          color: #578e7e;
        }

        /* DROPDOWN */
        .dropdown-menu {
          position: absolute;
          right: 0;
          background-color: white;
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
          padding: 0.5rem 0;
          margin-top: 8px;
          min-width: 10rem;
          display: none;
        }

        .dropdown-menu.show {
          display: block;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          color: #212529;
          text-decoration: none;
          background-color: transparent;
          border: 0;
        }

        .dropdown-item:hover {
          background-color: #f1f3f5;
        }

        /* MOBILE DROPDOWN FIX */
        @media (max-width: 640px) {
          .profile-elemen {
            position: relative;
          }

          .profile-elemen .dropdown-menu {
            position: fixed !important;
            top: 60px !important;
            right: 10px !important;
            width: 160px !important;
            z-index: 1000;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;