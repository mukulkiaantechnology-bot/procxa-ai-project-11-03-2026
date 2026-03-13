// Comprehensive Dummy Data for ProcXa-AI
// This file contains all realistic dummy data used across the application

// ============================
// BASE ENTITIES
// ============================

export const departments = [
  { id: 1, name: "IT", code: "IT001" },
  { id: 2, name: "HR", code: "HR001" },
  { id: 3, name: "Finance", code: "FIN001" },
  { id: 4, name: "Operations", code: "OPS001" },
  { id: 5, name: "Marketing", code: "MKT001" },
  { id: 6, name: "Legal", code: "LEG001" },
  { id: 7, name: "Procurement", code: "PROC001" }
];

export const suppliers = [
  { id: 1, name: "TechCorp Solutions", email: "contact@techcorp.com", phone: "+1-555-0101", category: "Technology" },
  { id: 2, name: "Global Services Inc", email: "info@globalservices.com", phone: "+1-555-0102", category: "Services" },
  { id: 3, name: "Office Supplies Pro", email: "sales@officesupplies.com", phone: "+1-555-0103", category: "Goods" },
  { id: 4, name: "Cloud Solutions Ltd", email: "support@cloudsol.com", phone: "+1-555-0104", category: "Technology" },
  { id: 5, name: "Business Consultants Group", email: "contact@bcg.com", phone: "+1-555-0105", category: "Services" },
  { id: 6, name: "Digital Marketing Agency", email: "hello@dma.com", phone: "+1-555-0106", category: "Marketing" },
  { id: 7, name: "Security Systems Co", email: "sales@securitysys.com", phone: "+1-555-0107", category: "Technology" },
  { id: 8, name: "HR Solutions Provider", email: "info@hrsolutions.com", phone: "+1-555-0108", category: "Services" }
];

export const categories = [
  { id: 1, name: "Technology", description: "IT Equipment and Services" },
  { id: 2, name: "Services", description: "Professional Services" },
  { id: 3, name: "Goods", description: "Physical Products" },
  { id: 4, name: "Marketing", description: "Marketing and Advertising" },
  { id: 5, name: "Facilities", description: "Facilities Management" }
];



// ============================
// INTAKE REQUESTS
// ============================

const generateIntakeRequests = () => {
  const statuses = ["pending", "approved", "rejected", "active"];
  const requestTypes = ["Goods", "Services", "Software", "Hardware"];
  const requests = [];
  
  for (let i = 1; i <= 25; i++) {
    const dept = departments[i % departments.length];
    const supplier = i % 3 === 0 ? null : suppliers[i % suppliers.length];
    const status = statuses[i % statuses.length];
    
    requests.push({
      id: i,
      requesterName: `User ${String(i).padStart(3, '0')}`,
      department: dept,
      "department.name": dept.name,
      supplierName: supplier ? supplier.name : "Not Assigned",
      requestType: requestTypes[i % requestTypes.length],
      status: status,
      createdAt: new Date(2024, 11, 20 - (i % 15)).toISOString(),
      assigncontractTemplateId: i % 4 === 0 ? i % 5 + 1 : null,
      comments: []
    });
  }
  
  return requests;
};

export const intakeRequests = generateIntakeRequests();

// ============================
// CONTRACTS
// ============================

const generateContracts = () => {
  const statuses = ["Active", "Expired", "Renewal", "Terminated"];
  const contracts = [];
  
  for (let i = 1; i <= 30; i++) {
    const supplier = suppliers[i % suppliers.length];
    const dept = departments[i % departments.length];
    const status = statuses[i % statuses.length];
    const startDate = new Date(2024, 0, 1 + (i % 365));
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + (i % 3) + 1);
    
    contracts.push({
      id: i,
      contractId: `CNT-${String(i).padStart(6, '0')}`,
      supplierName: supplier.name,
      department: dept.name,
      businessStakeholder: `Stakeholder ${i}`,
      type: ["Service", "Goods", "Software"][i % 3],
      sourcingLead: `Lead ${i}`,
      sourcingDirector: `Director ${i}`,
      status: status,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      value: (Math.random() * 500000 + 50000).toFixed(2),
      pdfUrl: `/contracts/contract-${i}.pdf`
    });
  }
  
  return contracts;
};

export const contracts = generateContracts();

// ============================
// CONTRACT TEMPLATES
// ============================

export const contractTemplates = [
  { id: 1, aggrementName: "Master Service Agreement", customAgreementFile: "msa-template.pdf" },
  { id: 2, aggrementName: "Software License Agreement", customAgreementFile: "sla-template.pdf" },
  { id: 3, aggrementName: "Statement of Work", customAgreementFile: "sow-template.pdf" },
  { id: 4, aggrementName: "Non-Disclosure Agreement", customAgreementFile: "nda-template.pdf" },
  { id: 5, aggrementName: "Purchase Order Terms", customAgreementFile: "po-template.pdf" },
  { id: 6, aggrementName: "Consulting Services Agreement", customAgreementFile: "csa-template.pdf" },
  { id: 7, aggrementName: "Vendor Agreement", customAgreementFile: "va-template.pdf" },
  { id: 8, aggrementName: "Support Services Agreement", customAgreementFile: "ssa-template.pdf" }
];

// ============================
// DASHBOARD DATA
// ============================

export const dashboardData = {
  summary: {
    totalSpendCount: intakeRequests.length,
    totalExpiringContracts: contracts.filter(c => c.status === "Renewal").length
  },
  topSuppliers: [
    { topSupplier: suppliers[0].name, totalAmount: 1250000 },
    { topSupplier: suppliers[1].name, totalAmount: 980000 },
    { topSupplier: suppliers[2].name, totalAmount: 750000 },
    { topSupplier: suppliers[3].name, totalAmount: 650000 },
    { topSupplier: suppliers[4].name, totalAmount: 520000 }
  ],
  categoryData: [
    { categoryName: "Technology", month: "Dec 2024", totalAmount: 450000 },
    { categoryName: "Technology", month: "Jan 2025", totalAmount: 520000 },
    { categoryName: "Technology", month: "Feb 2025", totalAmount: 480000 },
    { categoryName: "Services", month: "Dec 2024", totalAmount: 320000 },
    { categoryName: "Services", month: "Jan 2025", totalAmount: 380000 },
    { categoryName: "Services", month: "Feb 2025", totalAmount: 350000 },
    { categoryName: "Goods", month: "Dec 2024", totalAmount: 150000 },
    { categoryName: "Goods", month: "Jan 2025", totalAmount: 180000 },
    { categoryName: "Goods", month: "Feb 2025", totalAmount: 165000 }
  ]
};

// ============================
// RENEWAL REQUESTS
// ============================

const generateRenewalRequests = () => {
  const requests = [];
  const contractTypes = ["Service", "Goods", "Software"];
  for (let i = 1; i <= 15; i++) {
    const contract = contracts[i % contracts.length];
    const currentEndDate = new Date(contract.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    
    requests.push({
      id: i,
      contractId: contract.contractId,
      contractName: `Renewal Request ${i}`,
      description: `${contract.supplierName} - ${contract.type} Renewal`,
      supplierName: contract.supplierName,
      department: contract.department,
      currentEndDate: contract.endDate,
      previousExpirationDate: currentEndDate.toISOString(),
      renewalDate: newEndDate.toISOString().split('T')[0],
      newExpirationDate: newEndDate.toISOString(),
      status: ["Pending Renewal", "Approved", "Closed", "Pending Renewal"][i % 4],
      value: contract.value,
      createdAt: new Date(2024, 11, 15 - (i % 10)).toISOString(),
      contract: {
        contractTypeId: contractTypes[i % contractTypes.length],
        type: contract.type
      }
    });
  }
  return requests;
};

export const renewalRequests = generateRenewalRequests();

// ============================
// COST SAVING OPPORTUNITIES
// ============================

export const volumeDiscounts = [
  { 
    id: 1,
    totalUnits: 500,
    bestSupplier: {
      supplierId: 1,
      supplierName: suppliers[0].name,
      maxUnitPurchase: 600,
      discountPercent: 15,
      estimatedSavings: 18000,
      volumeDiscountStatus: "New Opportunity"
    }
  },
  { 
    id: 2,
    totalUnits: 300,
    bestSupplier: {
      supplierId: 2,
      supplierName: suppliers[1].name,
      maxUnitPurchase: 400,
      discountPercent: 12,
      estimatedSavings: 12000,
      volumeDiscountStatus: "Under Review"
    }
  },
  { 
    id: 3,
    totalUnits: 250,
    bestSupplier: {
      supplierId: 3,
      supplierName: suppliers[2].name,
      maxUnitPurchase: 350,
      discountPercent: 10,
      estimatedSavings: 8500,
      volumeDiscountStatus: "Approved"
    }
  }
];

export const supplierConsolidations = [
  { id: 1, category: "IT Services", currentSuppliers: 5, proposedSuppliers: 2, estimatedSavings: 25000 },
  { id: 2, category: "Office Supplies", currentSuppliers: 8, proposedSuppliers: 3, estimatedSavings: 15000 }
];

export const priceComparisons = [
  { id: 1, item: "Cloud Storage", supplierA: "Cloud Solutions", priceA: 5000, supplierB: "TechCorp", priceB: 4200, savings: 800 },
  { id: 2, item: "Software Licenses", supplierA: "TechCorp", priceA: 15000, supplierB: "Global Services", priceB: 13200, savings: 1800 }
];

// ============================
// SPEND ANALYTICS
// ============================

export const spendAnalytics = {
  totalSpend: 4850000,
  monthlySpend: [
    { month: "Jan 2024", amount: 425000 },
    { month: "Feb 2024", amount: 480000 },
    { month: "Mar 2024", amount: 510000 },
    { month: "Apr 2024", amount: 495000 },
    { month: "May 2024", amount: 520000 },
    { month: "Jun 2024", amount: 485000 }
  ],
  byCategory: [
    { category: "Technology", amount: 2850000, percentage: 58.8 },
    { category: "Services", amount: 1450000, percentage: 29.9 },
    { category: "Goods", amount: 550000, percentage: 11.3 }
  ],
  byDepartment: [
    { department: "IT", amount: 1850000 },
    { department: "Operations", amount: 1250000 },
    { department: "Finance", amount: 950000 },
    { department: "Marketing", amount: 800000 }
  ]
};

// ============================
// VENDOR PERFORMANCE
// ============================

// Vendor Performance Ratings - used for comparison
export const vendorPerformanceRatings = [
  {
    supplierId: 1,
    supplierName: suppliers[0].name,
    totalRating: 132,
    kpiData: [
      {
        KPI1: 45,
        KPI2: 47,
        KPI3: 22,
        KPI4: 48
      }
    ]
  },
  {
    supplierId: 2,
    supplierName: suppliers[1].name,
    totalRating: 125,
    kpiData: [
      {
        KPI1: 42,
        KPI2: 44,
        KPI3: 20,
        KPI4: 45
      }
    ]
  },
  {
    supplierId: 3,
    supplierName: suppliers[2].name,
    totalRating: 118,
    kpiData: [
      {
        KPI1: 40,
        KPI2: 41,
        KPI3: 18,
        KPI4: 42
      }
    ]
  },
  {
    supplierId: 4,
    supplierName: suppliers[3].name,
    totalRating: 130,
    kpiData: [
      {
        KPI1: 46,
        KPI2: 46,
        KPI3: 21,
        KPI4: 47
      }
    ]
  }
];

// Legacy vendor performance (for backward compatibility)
export const vendorPerformance = [
  { id: 1, supplierName: suppliers[0].name, rating: 4.8, onTimeDelivery: 98, qualityScore: 95, costScore: 88 },
  { id: 2, supplierName: suppliers[1].name, rating: 4.6, onTimeDelivery: 96, qualityScore: 92, costScore: 90 },
  { id: 3, supplierName: suppliers[2].name, rating: 4.4, onTimeDelivery: 94, qualityScore: 89, costScore: 92 },
  { id: 4, supplierName: suppliers[3].name, rating: 4.7, onTimeDelivery: 97, qualityScore: 93, costScore: 85 }
];

// ============================
// APPROVAL WORKFLOWS
// ============================

export const approvalFlows = [
  {
    id: 1,
    departmentId: 1,
    departmentName: "IT",
    approvers: [
      { id: 1, name: "Manager 1", level: 1, status: "pending" },
      { id: 2, name: "Director 1", level: 2, status: "pending" }
    ]
  }
];

// ============================
// TRANSACTIONS
// ============================

const generateTransactions = () => {
  const transactions = [];
  for (let i = 1; i <= 20; i++) {
    const supplier = suppliers[i % suppliers.length];
    transactions.push({
      id: i,
      transactionId: `TXN-${String(i).padStart(6, '0')}`,
      supplierName: supplier.name,
      amount: (Math.random() * 50000 + 1000).toFixed(2),
      date: new Date(2024, 11, 25 - (i % 20)).toISOString().split('T')[0],
      category: categories[i % categories.length].name,
      status: ["Completed", "Pending", "Approved"][i % 3]
    });
  }
  return transactions;
};

export const transactions = generateTransactions();

// ============================
// NOTIFICATIONS
// ============================

export const notificationPreferences = {
  emailNotifications: true,
  contractExpiryAlerts: true,
  renewalReminders: true,
  approvalRequests: true,
  statusUpdates: true,
  daysBeforeExpiry: 30
};

// ============================
// HELPER FUNCTIONS
// ============================

export const getById = (array, id) => array.find(item => item.id === id || item.id === parseInt(id));
export const filterByStatus = (array, status) => array.filter(item => item.status === status);
export const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalRecords: array.length,
      limit: limit
    }
  };
};

