import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { useState } from "react";
import LicenseGuard from "./components/license/LicenseGuard";
import Myrequest from "./components/intakemnagement/Myrequest";
import ContractTemplateSelection from "./components/contracttemplate/ContractTemplateSelection";
import PathSelection from "./components/contracttemplate/PathSelection";
import ValuDiscount from "./components/costsaving/ValuDiscount";
import SupplierConsolidation from "./components/costsaving/SupplierConsolidation";
import Servicesow from "./components/costsaving/Servicesow";
import HonoringOldPricing from "./components/costsaving/HonoringOldPricing";
import PriceComparisons from "./components/costsaving/PriceComparisons";
import Aprovalwork from "./components/approvalworkflo/Aprovalwork";
import EditRenewal from "./components/renawalnotif/EditRenewal";
import Renewalmanagedash from "./components/renewalmanagement/Renewalmanagedash";
import Contractmanage from "./components/contractmanage/Contractmanage";
import VendorPerformanceManagement from "./components/vendorperfo/VendorPerformanceManagement";
import SpendByAnalytics from "./components/spendanalytics/SpendByAnalytics";
import Dashboard from "./components/dashbord/Dashbord";
import IntakeManagement from "./components/intakemnagement/IntakeManagement";
import CreateNewRequest from "./components/intakemnagement/CreateNewRequest";
import Login from "./authtication/Login";
import AditionalComplementry from "./components/costsaving/AditionalComplementry";
import SpendDetail from "./components/spendanalytics/SpendDetail";
import MultiYearContracting from "./components/costsaving/MultiYearContracting";
import AddNewContract from "./components/contractmanage/AddNewContract";
import ContractapprovalWorkflow from "./components/approvalworkflo/ContractapprovalWorkflow";
import AllContractWearehouse from "./components/contractmanage/AllContractWearehouse";
import NotificationPreferences from "./components/renawalnotif/NotificationPreferences";
import ContractDetails from "./components/contractmanage/ContractDetails";
import RenewalRequestForm from "./components/renewalmanagement/RenewalRequestForm";
import RenewalWebform from "./components/renewalmanagement/RenewalWebform";
import RenewalAutomation from "./components/renewalmanagement/RenewalAutomation";
import ContractRenewalPage from "./components/renewalmanagement/ContractRenewalPage";
import DocumentPriview from "./components/contracttemplate/DocumentPriview";
import SupplierEditPage from "./components/costsaving/costedit/SupplierEditPage";
import SowEditPage from "./components/costsaving/costedit/SowEditPage";
import AddOldPrice from "./components/costsaving/costedit/AddOldPrice";
import PriceComparisonsform from "./components/costsaving/costedit/PriceComparisonsform";
import MultiYearEdit from "./components/costsaving/costedit/MultiYearEdit";
import AditionalEditPage from "./components/costsaving/costedit/AditionalEditPage";
import AddDepartmenet from "./components/Add Category/Sub Category/AddDepartmenet";
import AddTransaction from "./components/Add Category/Sub Category/AddTransaction";
import CategoryEditPage from "./components/intakemnagement/addcate/CategoryEditPage";
import CostOther from "./components/costsaving/CostOther";
import EditPage from "./components/contractmanage/EditPage";


import AddSupplier from "./components/Add Category/AddSupplier";
import SupplierPerformance from "./components/Add Category/AddFeedBack";
import DepartmentList from "./components/Add Category/Sub Category/DepartmentList";
import EditDepartment from "./components/Add Category/Sub Category/EditDepartment";
// import ChangePassword from "./authtication/ChangePassword";
import TrainAi from "./layout/TrainAi";
import UploadAgreement from "./components/contracttemplate/uploadAgreement";
import EditIntakeRequest from "./components/intakemnagement/editRequest";
import CostSavingForm from "./components/costsaving/costSavingForm";
import CostsavingDashboard from "./components/costsaving/CostsavingDashboard";
import CreateApprovalPrompt from "./components/approvalworkflo/CreateFlow";
import CreateApprovalFlow from "./components/approvalworkflo/AddContractFlow";
import AdminLicenseDashboard from "./components/license/AdminLicenseDashboard";
import ManageAdmins from "./components/superadmin/ManageAdmins";
import LicenseManagement from "./components/license/LicenseManagement";
import ClientLicenseManagement from "./components/license/ClientLicenseManagement";
import InventoryDashboard from "./components/inventory/InventoryDashboard";
import IntelligentInsights from "./components/insights/IntelligentInsights";
import Profile from "./components/user/Profile";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Menu item click handler - only closes sidebar on mobile, never collapses on desktop
  const menusidebarcollaps = () => {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    // Do NOT collapse sidebar on desktop - it should always remain visible
  };

  // Toggle sidebar - only works on mobile
  const toggleSidebar = () => {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
    }
    // On desktop, sidebar should always be visible, no toggle
  };
  const location = useLocation();

  const hideLayout = location.pathname === "/";
  const userType = localStorage.getItem("userType")
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  return (
    <LicenseGuard>
      <>
        {/* navbar */}
        {!hideLayout && <Navbar toggleSidebar={toggleSidebar} />}
        {/* navbar end */}
        {/* sidebar start */}
        <div className={`main-content  ${hideLayout ? "" : ""}`}>
          {!hideLayout && (
            <>
              {/* Mobile overlay */}
              {isSidebarOpen && (
                <div
                  className="sidebar-overlay show"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              {userType === "admin" || userType === "superadmin" ? (
                <Sidebar
                  collapsed={isSidebarCollapsed}
                  menuItemClick={menusidebarcollaps}
                  userType={userType}
                  isOpen={isSidebarOpen}
                />
              ) : (
                <Sidebar
                  collapsed={isSidebarCollapsed}
                  menuItemClick={menusidebarcollaps}
                  permissions={permissions}
                  userType={userType}
                  isOpen={isSidebarOpen}
                />
              )}
            </>
          )}
          {/* sidebar end */}
          {/* right side  */}
          <div className={`right-side-content ${hideLayout ? "login-layout-reset" : ""}`}>
            <Routes>
              {/* login signup */}
              <Route path="/" element={<Login />} />
              {/* login signup */}

              {/* dashbord */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* dashbord */}

              {/* intakemanagement */}
              <Route path="/intakemanagement" element={<IntakeManagement />} />
              <Route path="/intakenewreq" element={<CreateNewRequest />} />
              <Route path="/intakemyrequ" element={<Myrequest />} />
              <Route path="/intakecateedit" element={<CategoryEditPage />} />
              <Route path="/editIntakeRequest/:id" element={<EditIntakeRequest />} />
              {/* intakemanagement */}

              {/* contracttemplate */}
              <Route
                path="/contracttemplate"
                element={<ContractTemplateSelection />}
              />
              <Route path="/costumeagent" element={<PathSelection />} />
              <Route path="/documentpre" element={<DocumentPriview />} />
              <Route path="/uploadAgreement" element={<UploadAgreement />} />
              {/* contracttemplate */}

              {/* const saving */}
              <Route path="/costsaving" element={<CostsavingDashboard />} />
              <Route path="/costsavingform" element={<CostSavingForm />} />
              <Route path="/volumedisc" element={<ValuDiscount />} />
              <Route path="/suppliercons" element={<SupplierConsolidation />} />
              <Route path="/supplieredit" element={<SupplierEditPage />} />
              <Route path="/serviceswo" element={<Servicesow />} />
              <Route path="/sowedit" element={<SowEditPage />} />
              <Route path="/honoring" element={<HonoringOldPricing />} />
              <Route path="/addoldpricehonering" element={<AddOldPrice />} />
              <Route path="/additionalcomp" element={<AditionalComplementry />} />
              <Route path="/additionaledit" element={<AditionalEditPage />} />
              <Route path="/pricecomp" element={<PriceComparisons />} />
              <Route
                path="/pricecomparisonsprice"
                element={<PriceComparisonsform />}
              />
              <Route path="/multiyear" element={<MultiYearContracting />} />
              <Route path="/multiyearedit" element={<MultiYearEdit />} />
              <Route path="/others" element={<CostOther />} />
              {/* const saving */}

              {/* approval workflow */}
              <Route path="/approvalworkflow" element={<Aprovalwork />} />
              <Route
                path="/contractapproval/:id"
                element={<ContractapprovalWorkflow />}
              />
              {/* approval workflow */}

              {/* renewal notification */}
              <Route
                path="/renewalnotifi"
                element={<NotificationPreferences />}
              />
              {/* renewal notification */}

              {/* renewal management */}
              <Route path="/renewalmanage" element={<Renewalmanagedash />} />
              <Route path="/renewalform" element={<RenewalRequestForm />} />
              <Route path="/renewaldocument" element={<RenewalWebform />} />
              <Route path="/renewal-automation" element={<RenewalAutomation />} />
              <Route path="/contract-renewal" element={<ContractRenewalPage />} />
              <Route path="/editrenewalnoti/:id?" element={<EditRenewal />} />
              {/* renewal management */}

              {/* contract management */}
              <Route path="/contractmanage" element={<Contractmanage />} />
              <Route path="/editpage" element={<EditPage />} />
              <Route path="/contractwearhouse" element={<AllContractWearehouse />} />
              <Route path="/addnewcontact" element={<AddNewContract />} />
              <Route path="/contractdetail" element={<ContractDetails />} />
              {/* contract management */}

              {/* vendorperformance */}
              <Route
                path="/vendorper"
                element={<VendorPerformanceManagement />}

              />
              {/* vendorperformance */}

              {/* spend analytics */}
              <Route path="/spendanalyt" element={<SpendByAnalytics />} />
              <Route path="/spenddetail" element={<SpendDetail />} />
              {/* spend analytics */}

              {/* add category sub category  */}
              <Route path="/adddepartment" element={<AddDepartmenet />} />

              <Route path="/viewdepartment" element={<DepartmentList />} />
              <Route path="/editDepartment/:id" element={<EditDepartment />} />

              <Route path="/addtransaction" element={<AddTransaction />} />
              {/* add category sub category  */}


              <Route path="/addSupplier" element={<AddSupplier />} />
              <Route path="/flowPrompt" element={<CreateApprovalPrompt />} />
              <Route path="/createFlow" element={<CreateApprovalFlow />} />

              <Route path="/addperformance" element={<SupplierPerformance />} />
              <Route path="/train-ai" element={<TrainAi />} />

              {/* License Management */}
              <Route path="/admin/licenses" element={<AdminLicenseDashboard />} />

              {/* SuperAdmin - Manage Admins */}
              <Route path="/superadmin/manage-admins" element={<ManageAdmins />} />
              <Route path="/client-license-management" element={<ClientLicenseManagement />} />
              <Route path="/inventory-management" element={<InventoryDashboard />} />
              <Route path="/license-management" element={<LicenseManagement />} />
              <Route path="/intelligent-insights" element={<IntelligentInsights />} />
              <Route path="/profile" element={<Profile />} />

            </Routes>
          </div>
          {/* right end  */}
        </div>
      </>
    </LicenseGuard>
  );
}
export default App;
