const endpoints = {
    // 🔐 Auth
    registration: "/procxa/registration",
    login: "/procxa/login",
    refreshToken: "/procxa/refresh_token",
    getProfile: "/procxa/get_profile",
    updateProfile: "/procxa/update_profile",
    changePassword: "/procxa/change_password",

    // 📁 Category & Subcategory
    addCategory: "/procxa/add_category",
    getCategory: "/procxa/get_categories",
    updateCategory: "/procxa/update_category",
    deleteCategory: "/procxa/delete_category",
    addSubcategory: "/procxa/add_subcategory",
    getSubCategory: "/procxa/get_sub_categories",

    // 📥 Intake
    intakeDashboard: "/procxa/intake_dashboard",
    addIntakeRequest: "/procxa/add_intake_request",
    getIntakeRequest: "/procxa/get_all_intake_requests",
    updateIntakeRequest: "/procxa/update_intake_request",
    deleteIntakeRequest: "/procxa/delete_intake_request",
    addComment: "/procxa/add_comment",

    // 📄 Contracts
    addContract: "/procxa/add_contract",
    getAllContracts: "/procxa/get_all_contracts",
    getContractsDashboard: "/procxa/get_contracts_dashboard",
    updateContract: "/procxa/update_contract",

    // 📑 Contract Templates
    addContractTemplate: "/procxa/add_contract_template",
    getAllContractTemplates: "/procxa/get_all_contract_templates",
    contractTemplateDelete: "/procxa/delete_contract_template",
    generateContractPreview: "/procxa/generate_contract_preview",

    // 🔄 Contract Renewal
    renewContractFromTemplate: "/procxa/renew_contract",
    getContractForRenewal: "/procxa/get_contract_for_renewal",
    previewRenewedContract: "/procxa/preview_renewed_contract",
    getContractsExpiringSoon: "/procxa/get_contracts_expiring_soon",
    processRenewalRequest: "/procxa/process_renewal_request",

    // 🏢 Departments
    addDepartment: "/procxa/add_department",
    getAllDepartments: "/procxa/get_all_departments",
    deleteDepartment: "/procxa/delete_department",
    updateDepartment: "/procxa/update_department",
    getDepartmentById: "/procxa/get_department_by_id",
    getApproversRequest: "/procxa/get_all_approvers_request",

    // 🔔 Notifications
    addNotification: "/procxa/add_notification",
    getNotifications: "/procxa/notifications",
    markNotificationRead: "/procxa/notifications",
    getUnreadCount: "/procxa/notifications/unread-count",

    // 💰 Transactions
    addTransaction: "/procxa/add_transaction",
    getAllTransactions: "/procxa/get_all_transactions",
    updateTransaction: "/procxa/update_transaction",
    deleteTransaction: "/procxa/delete_transaction",

    // 🔄 Renewal
    getAllRenewalRequests: "/procxa/get_all_renewal_requests",
    addRenewalRequest: "/procxa/add_renewal_request",
    updateRenewalRequest: "/procxa/update_renewal_request",

    // 🚚 Suppliers
    addSupplier: "/procxa/add_supplier",
    getSuppliers: "/procxa/get_all_suppliers",
    updateSupplier: "/procxa/update_supplier",
    deleteSupplier: "/procxa/delete_supplier",
    assignSupplier: "/procxa/assign_intake_request",
    deleteAssignSupplier: "/procxa/delete_assign_intake_request",

    // 📊 Analytics
    getSpendsDetails: "/procxa/get_spends_details",
    getDashboardSpendsAnalytics: "/procxa/get_dashboard_spends_analytics",

    // 🤝 Supplier Consolidation
    getSupplierConsolidations: "/procxa/get_all_supplier_consolidations",

    // 🧩 Complementary Services
    addComplementaryService: "/procxa/add_complementary_service",
    getComplementaryServices: "/procxa/get_all_complementary_services",
    deleteComplementaryService: "/procxa/delete_complementary_service",
    updateComplementaryService: "/procxa/update_complementary_service",
    getComplementaryServiceById: "/procxa/get_complementary_service_by_id",

    // 💵 Old Pricing
    addOldPricing: "/procxa/add_old_pricing",
    getOldPricing: "/procxa/get_all_old_pricing",
    updateOldPricing: "/procxa/update_old_pricing",
    deleteOldPricing: "/procxa/delete_old_pricing",
    getOldPricingById: "/procxa/get_old_pricing_by_id",

    // 📈 Volume Discounts
    getVolumeDiscounts: "/procxa/get_all_volume_discounts",

    // 📃 SOW Consolidation
    addServiceSowConsolidation: "/procxa/add_service_sow_consolidation",
    getSowConsolidations: "/procxa/get_all_service_sow_consolidations",
    getSowConsolidationsById: "/procxa/get_service_sow_consolidation_by_id",
    updateSowConsolidations: "/procxa/update_service_sow_consolidation",

    // 📆 Multi-Year Contracts
    addMultiYearContract: "/procxa/add_multi_year_contract",
    getMultiYearContracts: "/procxa/get_all_multi_year_contracts",
    getMultiYearContractById: "/procxa/get_multi_year_contract_by_id",
    updateMultiYearContract: "/procxa/update_multi_year_contract",

    // 🧮 Dashboard
    getDashboardData: "/procxa/get_dashboard_data",

    // ⚖️ Price Comparison
    addPriceComparison: "/procxa/add_price_comparison",
    getPriceComparisons: "/procxa/get_all_price_comparisons",

    // 🧑‍⚖️ Approval Flow
    approverFlow: "/procxa/approver_flow",

    // ⭐ Ratings
    addRating: "/procxa/add_rating",
    getRatings: "/procxa/get_ratings",
    getRankings: "/procxa/get_rankings",
    deleteRating: "/procxa/delete_rating",
    updateRating: "/procxa/update_rating",

    // 🔄 Status & Requests
    updatestatus: "/procxa/updatestatus",
    getIntakeRequestById: "/procxa/get_intake_request_by_id",
    updateRequest: "/procxa/update_request",

    // 💸 Cost Saving
    createCostSaving: "/procxa/createCostSaving",
    getAllCostSavings: "/procxa/getAllCostSavings",
    getCostSavingById: "/procxa/getCostSavingById",
    updateCostSaving: "/procxa/updateCostSaving",
    deleteCostSaving: "/procxa/deleteCostSaving",
    getAllNotPendingIntakeRequests:
        "/procxa/get_all_not_pending_intake_requests",
    get_intake_request_details:
        "/procxa/get_intake_request_details",

    // 🏗️ Department Flow
    add_department_flow: "/procxa/add_department_flow",
    update_workflow_status: "/procxa/update_workflow_status",
    check_approval_flow: "/procxa/check_approval_flow",
    deleteFlowByUserId: "/procxa/deleteFlowByUserId",
    assign_request_flow: "/procxa/assign_request_flow",

    // 🔑 License
    activateLicense: "/procxa/license/activate",
    validateLicense: "/procxa/license/validate",
    verifyLicense: "/procxa/license/verify",
    generateLicense: "/procxa/license/generate",
    getAllLicenses: "/procxa/license/all",
    toggleLicenseStatus: "/procxa/license/toggle",
    updateExpiryDate: "/procxa/license/expiry",
    getLicenseAnalytics: "/procxa/license/analytics",
    getLicenseInsights: "/procxa/license/insights",

    // 👑 SuperAdmin
    createAdmin: "/procxa/superadmin/create-admin",
    getAllAdmins: "/procxa/superadmin/admins",
    renewLicense: "/procxa/superadmin/renew-license",
    toggleAdmin: "/procxa/superadmin/toggle-admin",
    updateExpiry: "/procxa/superadmin/update-expiry",
    getExpiringLicenses: "/procxa/superadmin/expiring-licenses",

    // 🧑 Admin (self only)
    getMyAdminData: "/procxa/admin/my-data",
    updateApiKey: "/procxa/update_api_key",
    chat: "/procxa/chat",

    // 🔑 Client License & Inventory
    createClientLicense: "/procxa/client-license/create",
    getAllClientLicenses: "/procxa/client-license/all",
    assignLicense: "/procxa/client-license/assign",
    getLicenseReport: "/procxa/client-license/report",

    createInventoryItem: "/procxa/inventory/create",
    getAllInventoryItems: "/procxa/inventory/all",
    updateInventoryStock: "/procxa/inventory/update",
    getInventoryAlerts: "/procxa/inventory/alerts",
};

export default endpoints;
