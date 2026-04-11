-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2026 at 12:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `procxa-new`
--

-- --------------------------------------------------------

--
-- Table structure for table `assign_intake_request`
--

CREATE TABLE `assign_intake_request` (
  `id` bigint(20) NOT NULL,
  `requestId` bigint(20) NOT NULL,
  `supplierId` bigint(20) DEFAULT NULL,
  `assignedAt` datetime DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `type`, `description`, `userId`, `createdAt`, `updatedAt`) VALUES
(11, 'IT category', 'IT category', 'IT category', 5, '2026-03-13 12:37:37', '2026-03-13 12:37:37'),
(12, 'Sales category', 'Sales category', 'Sales category', 5, '2026-03-13 12:37:58', '2026-03-13 12:38:13'),
(13, 'Developer category', 'Developer category', 'Developer category', 12, '2026-03-13 12:39:27', '2026-03-13 12:39:27');

-- --------------------------------------------------------

--
-- Table structure for table `client_licenses`
--

CREATE TABLE `client_licenses` (
  `id` bigint(20) NOT NULL,
  `license_name` varchar(255) NOT NULL COMMENT 'e.g., Zoom, Adobe, Salesforce',
  `department_id` bigint(20) DEFAULT NULL,
  `total_licenses` int(11) DEFAULT 0,
  `used_licenses` int(11) DEFAULT 0,
  `cost` decimal(10,2) DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `status` enum('active','expired','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_licenses`
--

INSERT INTO `client_licenses` (`id`, `license_name`, `department_id`, `total_licenses`, `used_licenses`, `cost`, `expiry_date`, `status`, `created_at`, `updated_at`, `userId`) VALUES
(1, 'zoom', NULL, 2, 2, NULL, '2026-12-12 00:00:00', 'active', '2026-02-11 07:27:55', '2026-02-11 07:49:45', NULL),
(2, 'adobe', NULL, 2, 1, NULL, '2026-12-10 00:00:00', 'active', '2026-02-11 08:55:11', '2026-02-11 08:55:20', NULL),
(3, 'zoom', NULL, 1, 1, NULL, '2026-02-12 00:00:00', 'active', '2026-02-11 10:32:55', '2026-02-16 07:19:00', 5),
(5, 'adobe', NULL, 1, 0, NULL, '2026-12-12 00:00:00', 'active', '2026-02-11 10:52:59', '2026-02-11 10:52:59', 12),
(6, 'taskus', NULL, 2, 1, NULL, '2026-12-12 00:00:00', 'active', '2026-02-16 07:04:51', '2026-02-16 07:19:09', 5);

-- --------------------------------------------------------

--
-- Table structure for table `client_license_assignments`
--

CREATE TABLE `client_license_assignments` (
  `id` bigint(20) NOT NULL,
  `client_license_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `assigned_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_license_assignments`
--

INSERT INTO `client_license_assignments` (`id`, `client_license_id`, `user_id`, `user_name`, `assigned_date`, `created_at`, `updated_at`) VALUES
(35, 1, NULL, 'mmm', '2026-02-11 07:49:45', '2026-02-11 07:49:45', '2026-02-11 07:49:45'),
(36, 2, NULL, 'abc', '2026-02-11 08:55:20', '2026-02-11 08:55:20', '2026-02-11 08:55:20'),
(37, 3, NULL, 'aaa', '2026-02-16 07:19:00', '2026-02-16 07:19:00', '2026-02-16 07:19:00'),
(38, 6, NULL, 'bbb', '2026-02-16 07:19:09', '2026-02-16 07:19:09', '2026-02-16 07:19:09');

-- --------------------------------------------------------

--
-- Table structure for table `complementary_services`
--

CREATE TABLE `complementary_services` (
  `id` bigint(20) NOT NULL,
  `supplierId` bigint(20) DEFAULT NULL,
  `categoryId` bigint(20) DEFAULT NULL,
  `productPurchased` varchar(255) DEFAULT NULL,
  `complementaryService` varchar(255) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `saving` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'proposed',
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint(20) NOT NULL,
  `contractName` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `contractTypeId` varchar(255) NOT NULL,
  `departmentId` bigint(20) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `sourceLeadName` varchar(255) DEFAULT NULL,
  `sourceDirectorName` varchar(255) DEFAULT NULL,
  `buisnessStackHolder` varchar(255) DEFAULT NULL,
  `supplierId` bigint(20) DEFAULT NULL,
  `agreementId` bigint(20) DEFAULT NULL,
  `budget` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `paymentTerms` text DEFAULT NULL,
  `milestones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`milestones`)),
  `contractAttachmentFile` varchar(255) DEFAULT NULL,
  `approvers` varchar(255) DEFAULT NULL,
  `approvalLevels` varchar(255) DEFAULT NULL,
  `thresholdRules` varchar(255) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contracts`
--

INSERT INTO `contracts` (`id`, `contractName`, `description`, `contractTypeId`, `departmentId`, `startDate`, `endDate`, `sourceLeadName`, `sourceDirectorName`, `buisnessStackHolder`, `supplierId`, `agreementId`, `budget`, `currency`, `paymentTerms`, `milestones`, `contractAttachmentFile`, `approvers`, `approvalLevels`, `thresholdRules`, `userId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'contract', 'description', 'type', NULL, '2025-12-12 00:00:00', '2027-03-13 00:00:00', 'sourcing', 'derector name', '', NULL, NULL, 500, 'EUR', 'net_30', '\"[object Object]\"', 'C:\\Users\\rehan\\OneDrive\\Desktop\\Procurment\\Dipanshu\\procurement_backend\\public\\contractAttachmentFile\\contractAttachmentFile_1766234475977.png', 'contator', 'levels', 'rules', 1, 'Renewed', '2025-12-20 12:41:15', '2026-02-17 11:52:41'),
(2, 'aman', 'dr', 'dfr', NULL, '2025-12-23 00:00:00', '2026-01-10 00:00:00', 'amul', 'amn', NULL, NULL, 1, 10000, 'GBP', 'net_60', '\"[object Object]\"', 'C:\\Users\\hp\\Desktop\\procxa-AI\\procurement_backend\\public\\contractAttachmentFile\\contractAttachmentFile_1766472405847.jpg', 'e', 'v', 'b', 1, 'Renewed', '2025-12-23 06:46:45', '2026-02-16 09:42:58'),
(7, 'contract - Renewed (Manual)', 'cloud service', 'type', NULL, '2025-12-12 00:00:00', '2025-12-25 00:00:00', 'sourcing', 'derector name', '', NULL, NULL, 500, 'EUR', 'net_30', '\"\\\"[object Object]\\\"\"', 'C:\\Users\\hp\\Desktop\\procxa-AI\\procurement_backend\\public\\renewalAttachmentFile\\renewalAttachmentFile_1766490329422.pdf', NULL, NULL, NULL, 5, 'Active', '2026-02-12 07:21:19', '2026-02-12 07:21:19'),
(8, 'contract - Renewed (Manual)', 'cn', 'type', NULL, '2025-12-16 00:00:00', '2025-12-27 00:00:00', 'sourcing', 'derector name', '', NULL, NULL, 500, 'EUR', 'net_30', '\"\\\"[object Object]\\\"\"', 'C:\\Users\\hp\\Desktop\\procxa-AI\\procurement_backend\\public\\renewalAttachmentFile\\renewalAttachmentFile_1766485866798.png', NULL, NULL, NULL, 5, 'Active', '2026-02-16 07:18:03', '2026-03-13 12:23:41'),
(9, 'contract - Renewed (Manual)', 'A reliable sedan', 'type', NULL, '2025-11-12 00:00:00', '2025-12-30 00:00:00', 'sourcing', 'derector name', '', NULL, NULL, 6000, 'EUR', 'net_30', '\"\\\"[object Object]\\\"\"', NULL, NULL, NULL, NULL, 5, 'Active', '2026-02-16 07:18:38', '2026-02-16 07:18:38'),
(10, 'aman - Renewed (Manual)', 'djfk', 'dfr', NULL, '2025-12-12 00:00:00', '2026-12-12 00:00:00', 'amul', 'amn', NULL, NULL, NULL, 10000, 'GBP', 'net_60', '\"\\\"[object Object]\\\"\"', 'D:\\mukul_procxa\\proxca_backend_mukul\\public\\renewalAttachmentFile\\renewalAttachmentFile_1771234968086.docx', NULL, NULL, NULL, 5, 'Active', '2026-02-16 09:42:58', '2026-03-13 12:17:37'),
(11, 'contract - Renewed (Manual)', 'des', 'type', NULL, '2026-01-10 00:00:00', '2026-03-10 00:00:00', 'sourcing', 'derector name', '', NULL, NULL, 500, 'EUR', 'net_30', '\"\\\"[object Object]\\\"\"', 'D:\\mukul_procxa\\proxca_backend_mukul\\public\\renewalAttachmentFile\\renewalAttachmentFile_1771234875701.docx', NULL, NULL, NULL, 5, 'Active', '2026-02-16 09:43:11', '2026-02-16 09:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `contract_templates`
--

CREATE TABLE `contract_templates` (
  `id` bigint(20) NOT NULL,
  `newSupplier` varchar(255) DEFAULT '0',
  `existingSupplier` varchar(255) DEFAULT '0',
  `extendExistingContract` varchar(255) DEFAULT '0',
  `letterOfExtension` varchar(255) DEFAULT '0',
  `customAgreementFile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `admin_id` bigint(20) DEFAULT NULL,
  `templateContent` text DEFAULT NULL,
  `aggrementName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contract_templates`
--

INSERT INTO `contract_templates` (`id`, `newSupplier`, `existingSupplier`, `extendExistingContract`, `letterOfExtension`, `customAgreementFile`, `createdAt`, `updatedAt`, `admin_id`, `templateContent`, `aggrementName`) VALUES
(1, 'new supplier', 'supplier', 'sow', 'letters', NULL, '2025-12-20 06:54:42', '2025-12-20 06:54:42', NULL, NULL, NULL),
(2, '', 'supplier', 'contract', 'letter', NULL, '2025-12-20 12:42:48', '2025-12-20 12:42:48', NULL, NULL, NULL),
(4, 'supplier', 'supplier', 'sow', 'letter of', NULL, '2025-12-20 12:44:03', '2025-12-20 12:44:03', NULL, NULL, NULL),
(11, 'new suplier', '', '', '', 'customAgreementFile\\customAgreementFile_1770989553952.pdf', '2026-02-13 13:32:33', '2026-02-13 13:32:33', NULL, NULL, NULL),
(21, '0', '0', '0', '0', 'customAgreementFile\\customAgreementFile_1773406255500.pdf', '2026-03-13 12:50:55', '2026-03-13 12:50:55', 12, NULL, 'IT contract'),
(22, '0', '0', '0', '0', 'customAgreementFile\\customAgreementFile_1773407164466.pdf', '2026-03-13 13:06:04', '2026-03-13 13:06:04', 12, NULL, 'Sales contract'),
(26, '0', '0', '0', '0', 'customAgreementFile\\customAgreementFile_1773468990033.pdf', '2026-03-14 06:16:30', '2026-03-14 06:16:30', 26, NULL, 'it dep contract'),
(27, '0', '0', '0', '0', 'customAgreementFile\\customAgreementFile_1773469046364.pdf', '2026-03-14 06:17:26', '2026-03-14 06:17:26', 27, NULL, 'sales dep contract');

-- --------------------------------------------------------

--
-- Table structure for table `contract_types`
--

CREATE TABLE `contract_types` (
  `id` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `costsavings`
--

CREATE TABLE `costsavings` (
  `id` bigint(20) NOT NULL,
  `supplierName` varchar(255) NOT NULL,
  `depreciationScheduleYears` int(11) NOT NULL,
  `group` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `reportingYear` int(11) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `benefitStartMonth` varchar(255) NOT NULL,
  `typeOfCostSaving` varchar(255) NOT NULL,
  `historicalUnitPrice` longtext DEFAULT NULL,
  `negotiatedUnitPrice` longtext DEFAULT NULL,
  `reductionPerUnit` longtext DEFAULT NULL,
  `forecastVolumes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`forecastVolumes`)),
  `sourcingBenefits` longtext DEFAULT NULL,
  `intakeRequest` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `currentPrice` varchar(255) DEFAULT NULL,
  `proposedPrice` varchar(255) DEFAULT NULL,
  `notesDescription` text DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `historicalUnitPrices` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`historicalUnitPrices`)),
  `forecastVolumesMultiYear` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`forecastVolumesMultiYear`)),
  `additionalColumns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additionalColumns`)),
  `benefitEndMonth` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `costsavings`
--

INSERT INTO `costsavings` (`id`, `supplierName`, `depreciationScheduleYears`, `group`, `category`, `reportingYear`, `currency`, `benefitStartMonth`, `typeOfCostSaving`, `historicalUnitPrice`, `negotiatedUnitPrice`, `reductionPerUnit`, `forecastVolumes`, `sourcingBenefits`, `intakeRequest`, `createdAt`, `updatedAt`, `currentPrice`, `proposedPrice`, `notesDescription`, `userId`, `historicalUnitPrices`, `forecastVolumesMultiYear`, `additionalColumns`, `benefitEndMonth`) VALUES
(8, '8', 2026, 'N/A', '11', 2026, 'USD', 'July', 'Volume Discounts', '', '', '', '{\"2025\":{\"Baseline\":\"1000\",\"New Cost\":\"2000\",\"Annualized Benefits\":\"-1000.00\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"},\"2026\":{\"Baseline\":\"1000\",\"New Cost\":\"2000\",\"Annualized Benefits\":\"-1000.00\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"}}', '{}', 37, '2026-04-08 07:56:58', '2026-04-08 07:56:58', '5000', '1000', 'additional', 12, '{\"2025\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"2\",\"item2\":\"5\",\"item3\":\"4\"},\"2026\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"2\",\"item2\":\"5\",\"item3\":\"4\"}}', '{\"2025\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"},\"2026\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"},\"2027\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"},\"2028\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"},\"2029\":{\"Baseline\":\"\",\"New Cost\":\"\",\"Annualized Benefits\":\"\",\"item1\":\"\",\"item2\":\"\",\"item3\":\"\"}}', '[]', 'December');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `email_id` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `refreshToken_Expiration` varchar(255) DEFAULT NULL,
  `userType` varchar(255) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `role` varchar(255) DEFAULT NULL,
  `notEncryptPassword` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `email_id`, `password`, `refreshToken`, `refreshToken_Expiration`, `userType`, `userId`, `permissions`, `role`, `notEncryptPassword`, `type`, `createdAt`, `updatedAt`) VALUES
(26, 'IT department', 'it', 'it@gmail.com', '$2b$10$1WTJgWWZQ60Z.7jtkzGtrev8Ntoc5OACs9qOSW//GrGyRzSK7cdAS', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImVtYWlsIjoiaXRAZ21haWwuY29tIiwidHlwZSI6ImRlcGFydG1lbnQiLCJpYXQiOjE3NzU2MzM1MDIsImV4cCI6MTc3NjIzODMwMn0.oa25VgWlJTl8rhLdujw_HFlzyVnxNVDSLcFSUDrYMSo', '1775806302193', 'department', 12, '[\"Dashboard\",\"Intake Management\",\"Contract Template\",\"Approval Workflow\"]', 'it field', '123456', 'working', '2026-03-13 12:35:31', '2026-04-08 07:31:42'),
(27, 'Sales Deapartment', 'Sales Deapartment', 'sales@gmail.com', '$2b$10$TQ.UwcLw4QOxRL8CrDwnf.TACC7xtLd2Fet8YOfQLj1sv.h70L4Ae', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsImVtYWlsIjoic2FsZXNAZ21haWwuY29tIiwidHlwZSI6ImRlcGFydG1lbnQiLCJpYXQiOjE3NzU2MzE2NTIsImV4cCI6MTc3NjIzNjQ1Mn0.l2VtQ0D6pgopOu4Hlrrmo2R3kF0Br_mWjDp2CeR00sM', '1775804452391', 'department', 12, '[\"Dashboard\",\"Intake Management\",\"Contract Template\",\"Approval Workflow\"]', 'sales', '123456', 'working', '2026-03-13 12:49:37', '2026-04-08 07:00:52');

-- --------------------------------------------------------

--
-- Table structure for table `intake_requests`
--

CREATE TABLE `intake_requests` (
  `id` bigint(20) NOT NULL,
  `requestType` varchar(255) DEFAULT NULL,
  `categoryId` bigint(20) DEFAULT NULL,
  `engagementType` varchar(255) DEFAULT NULL,
  `itemDescription` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `executionTimeline` varchar(255) DEFAULT NULL,
  `reasonForEarlierExecution` text DEFAULT NULL,
  `serviceDuration` varchar(255) DEFAULT NULL,
  `amendmentType` varchar(255) DEFAULT NULL,
  `contractDocument` varchar(255) DEFAULT NULL,
  `intakeAttachement` varchar(255) DEFAULT NULL,
  `budgetCode` varchar(255) DEFAULT NULL,
  `requestedAmount` float DEFAULT NULL,
  `requesterName` varchar(255) DEFAULT NULL,
  `requesterDepartmentId` bigint(20) DEFAULT NULL,
  `requesterEmail` varchar(255) DEFAULT NULL,
  `requesterContactNumber` varchar(255) DEFAULT NULL,
  `additionalDescription` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','active') DEFAULT 'pending',
  `assignStatus` tinyint(1) DEFAULT 0,
  `userId` bigint(20) DEFAULT NULL,
  `supplierEmail` varchar(255) DEFAULT NULL,
  `supplierName` varchar(255) DEFAULT NULL,
  `supplierContact` varchar(255) DEFAULT NULL,
  `startDate` text DEFAULT NULL,
  `endDate` text DEFAULT NULL,
  `involvesCloud` tinyint(1) DEFAULT 0,
  `shareCustomerOrEmployeeInfo` tinyint(1) DEFAULT 0,
  `assigncontractTemplateId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `intake_requests`
--

INSERT INTO `intake_requests` (`id`, `requestType`, `categoryId`, `engagementType`, `itemDescription`, `quantity`, `duration`, `executionTimeline`, `reasonForEarlierExecution`, `serviceDuration`, `amendmentType`, `contractDocument`, `intakeAttachement`, `budgetCode`, `requestedAmount`, `requesterName`, `requesterDepartmentId`, `requesterEmail`, `requesterContactNumber`, `additionalDescription`, `status`, `assignStatus`, `userId`, `supplierEmail`, `supplierName`, `supplierContact`, `startDate`, `endDate`, `involvesCloud`, `shareCustomerOrEmployeeInfo`, `assigncontractTemplateId`, `createdAt`, `updatedAt`) VALUES
(35, 'new_agreement', 11, 'new_supplier', 'Zoom subsciption', 0, '', '3 months', '', '', '', '', '', '4000', 0, 'john requester', 26, 'john@gmail.com', '', '', 'approved', 0, 12, 'suppiler@gmail.com', 'supplier', '1111111111', '', '', 0, 0, 27, '2026-03-13 12:40:30', '2026-03-14 06:21:31'),
(36, 'new_agreement', 12, 'new_supplier', 'sales intake', 0, '', '3 months', '', '', '', '', '', '', 1000, 'sales requester', 27, 'salesrequester@gmail.com', '', '', 'active', 0, 12, 'supie2r@gmail.com', 'supier2', '2222222222', '', '', 0, 0, 21, '2026-03-13 13:04:50', '2026-04-08 07:39:40'),
(37, 'agreement', 12, 'new_supplier', 'sdfasd', 0, '', '', '', '', '', '', '', '', 0, 'admin', 26, 'admin@gmail.com', '', '', 'approved', 0, 12, 'suppiler@gmail.com', 'supplier', '', '2026-04-10', '2026-05-10', 0, 0, 26, '2026-04-08 07:30:04', '2026-04-08 09:33:14');

-- --------------------------------------------------------

--
-- Table structure for table `intake_request_approvers`
--

CREATE TABLE `intake_request_approvers` (
  `id` bigint(20) NOT NULL,
  `intakeRequestId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `userType` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `comments` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `intake_request_approvers`
--

INSERT INTO `intake_request_approvers` (`id`, `intakeRequestId`, `userId`, `userType`, `status`, `comments`, `createdAt`, `updatedAt`) VALUES
(194, 35, 26, 'department', 'approved', 'Contract Assigned & Approved from table dropdown', '2026-03-13 13:23:39', '2026-03-14 06:19:37'),
(195, 35, 27, 'department', 'approved', 'Contract Assigned & Approved from table dropdown', '2026-03-13 13:23:39', '2026-03-14 06:21:31'),
(196, 37, 26, 'department', 'approved', 'Contract Assigned & Approved from table dropdown', '2026-04-08 07:31:19', '2026-04-08 07:31:53'),
(197, 36, 26, 'department', 'pending', NULL, '2026-04-08 07:39:11', '2026-04-08 07:39:11');

-- --------------------------------------------------------

--
-- Table structure for table `intake_request_comments`
--

CREATE TABLE `intake_request_comments` (
  `id` bigint(20) NOT NULL,
  `requestId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `commentMessage` text NOT NULL,
  `userType` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `departmentId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `intake_request_comments`
--

INSERT INTO `intake_request_comments` (`id`, `requestId`, `userId`, `commentMessage`, `userType`, `createdAt`, `updatedAt`, `departmentId`) VALUES
(30, 35, 26, 'APPROVED: Approved', 'department', '2026-03-13 13:18:46', '2026-03-13 13:18:46', NULL),
(31, 35, 26, 'REJECTED: jijhk', 'department', '2026-03-13 13:23:02', '2026-03-13 13:23:02', NULL),
(32, 35, 27, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-03-13 13:39:45', '2026-03-13 13:39:45', 27),
(33, 35, 26, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-03-13 13:40:17', '2026-03-13 13:40:17', 26),
(34, 36, 12, 'no', 'admin', '2026-03-13 13:53:51', '2026-03-13 13:53:51', 27),
(35, 36, 26, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-03-13 13:54:14', '2026-03-13 13:54:14', 26),
(36, 36, 26, 'PENDING: Status reset to Pending', 'department', '2026-03-13 13:54:24', '2026-03-13 13:54:24', 26),
(37, 36, 26, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-03-13 13:54:32', '2026-03-13 13:54:32', 26),
(38, 35, 12, 'PENDING: Status reset to Pending', 'admin', '2026-03-14 06:18:47', '2026-03-14 06:18:47', 26),
(39, 35, 12, 'PENDING: Status reset to Pending', 'admin', '2026-03-14 06:18:52', '2026-03-14 06:18:52', 27),
(40, 35, 26, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-03-14 06:19:37', '2026-03-14 06:19:37', 26),
(41, 35, 27, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-03-14 06:21:31', '2026-03-14 06:21:31', 27),
(42, 36, 12, 'approved admin', 'admin', '2026-04-08 07:00:04', '2026-04-08 07:00:04', 27),
(43, 36, 27, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-04-08 07:01:06', '2026-04-08 07:01:06', 27),
(44, 36, 12, 'PENDING: Status reset to Pending', 'admin', '2026-04-08 07:28:01', '2026-04-08 07:28:01', 27),
(45, 37, 26, 'APPROVED: Contract Assigned & Approved from table dropdown (Contract Template Updated)', 'department', '2026-04-08 07:31:53', '2026-04-08 07:31:53', 26);

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` bigint(20) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `current_stock` int(11) DEFAULT 0,
  `threshold_type` enum('percentage','quantity') DEFAULT 'quantity',
  `threshold_value` float DEFAULT 10,
  `last_restock_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `notification_emails` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `sku`, `item_name`, `description`, `current_stock`, `threshold_type`, `threshold_value`, `last_restock_date`, `created_at`, `updated_at`, `userId`, `notification_emails`) VALUES
(1, '001', 'it', '', 100, 'percentage', 20, NULL, '2026-02-11 07:28:16', '2026-02-11 08:53:21', NULL, NULL),
(2, '002', 'name', '', 50, 'percentage', 10, NULL, '2026-02-11 08:55:44', '2026-02-11 08:55:51', NULL, NULL),
(24, '0001', 'tcs', '', 100, 'percentage', 1, NULL, '2026-02-11 11:08:35', '2026-02-11 11:08:35', 12, NULL),
(26, '0002', 'zoom', '', 1000, 'percentage', 10, NULL, '2026-02-11 11:09:19', '2026-02-17 09:11:55', 5, NULL),
(29, '10001', 'stock', '', 1, 'percentage', 10, NULL, '2026-02-17 07:57:41', '2026-02-17 07:57:41', 12, 'admin@gmail.com, manager@gmail.com'),
(30, 'sku001', 'jhjk', '', 1, 'quantity', 2, NULL, '2026-02-17 07:59:24', '2026-02-17 07:59:24', 12, 'admin@gmail.com,superamdin@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

CREATE TABLE `licenses` (
  `id` int(11) NOT NULL,
  `license_key` varchar(255) NOT NULL,
  `assigned_email` varchar(255) DEFAULT NULL,
  `status` enum('unused','active','revoked') NOT NULL DEFAULT 'unused',
  `created_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `expiry_date` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `admin_id` bigint(20) DEFAULT NULL COMMENT 'User ID of the admin this license belongs to'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `licenses`
--

INSERT INTO `licenses` (`id`, `license_key`, `assigned_email`, `status`, `created_at`, `is_active`, `expiry_date`, `updated_at`, `admin_id`) VALUES
(1, 'APP-TEST-1234-5678', 'admin@gmail.com', 'active', '2025-12-27 17:41:34', 1, NULL, NULL, NULL),
(2, 'APP-RBUW-WAV3-K8GU', 'user@gmail.com', 'active', '2025-12-27 17:44:55', 1, NULL, NULL, NULL),
(3, 'APP-UE2U-GM5B-KVRW', 'superadmin@gmail.com', 'active', '2025-12-27 18:11:58', 1, NULL, NULL, NULL),
(4, 'APP-3FVV-UNBZ-39GY', 'kamal@gmail.com', 'active', '2025-12-27 18:18:46', 1, NULL, NULL, NULL),
(5, 'APP-ZSN6-AW6H-B8TM', NULL, 'unused', '2025-12-27 18:31:27', 1, NULL, NULL, NULL),
(6, 'APP-KRYV-KB5S-G8AC', NULL, 'unused', '2025-12-27 18:32:14', 1, NULL, NULL, NULL),
(7, 'APP-P4LB-SWGB-SPGF', NULL, 'unused', '2025-12-27 18:33:31', 1, NULL, NULL, NULL),
(8, 'APP-97L7-B2A5-KUU7', 'amul@gmail.com', 'active', '2025-12-27 19:11:26', 1, '2025-12-31 18:29:59', NULL, 6),
(9, 'APP-QTYF-M2YX-X9EY', 'akash@gmail.com', 'active', '2025-12-29 12:24:22', 1, '2026-01-10 18:29:59', NULL, 7),
(10, 'APP-36Z7-FQH2-7CG4', NULL, 'unused', '2025-12-29 12:31:02', 1, NULL, NULL, NULL),
(11, 'APP-L35S-K3EN-VNFB', 'aman@gmail.com', 'active', '2025-12-29 12:49:42', 1, '2026-02-05 18:29:59', NULL, 8),
(12, 'APP-59AZ-BHBA-MGZM', 'ram@gmail.com', 'active', '2025-12-29 13:02:18', 1, '2026-02-07 18:29:59', NULL, 9),
(13, 'APP-ZZ6W-YM6J-9QNC', 'ramu@gamil.com', 'active', '2025-12-29 13:07:37', 1, '2025-12-26 18:29:59', NULL, 10),
(14, 'APP-YB3X-UV89-GRP2', 'ak@gmail.com', 'active', '2025-12-29 15:35:25', 1, '2026-03-14 18:29:59', NULL, 11),
(15, 'APP-ATW7-SCU9-QVLH', 'abc@gmail.com', 'active', '2025-12-29 19:09:30', 1, '2027-12-12 18:29:59', '2026-03-12 10:31:27', 12),
(16, 'APP-PPUH-GTBR-RFMF', 'xyz@gmail.com', 'active', '2025-12-29 19:13:09', 1, '2026-12-12 18:29:59', '2026-02-11 06:29:01', 13),
(17, 'APP-PFNK-9A65-6KZ8', 'r@gmail.com', 'active', '2026-02-13 13:45:44', 1, '2027-02-12 18:29:59', '2026-02-13 13:45:44', 14);

-- --------------------------------------------------------

--
-- Table structure for table `multi_year_contractings`
--

CREATE TABLE `multi_year_contractings` (
  `id` bigint(20) NOT NULL,
  `supplierId` bigint(20) DEFAULT NULL,
  `currentContractDuration` varchar(255) NOT NULL,
  `multiYearProposal` varchar(255) NOT NULL,
  `savingsEstimate` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `multi_year_contractings`
--

INSERT INTO `multi_year_contractings` (`id`, `supplierId`, `currentContractDuration`, `multiYearProposal`, `savingsEstimate`, `status`, `userId`, `createdAt`, `updatedAt`) VALUES
(2, NULL, '23', '93', 0.00, 'Under Review', 1, '2025-12-23 09:22:04', '2025-12-23 09:22:04');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL COMMENT 'license_expiry, license_expired, renewal_request, renewal_approved',
  `message` text NOT NULL,
  `target_user_id` bigint(20) DEFAULT NULL COMMENT 'NULL for SuperAdmin notifications, user_id for Admin notifications',
  `target_role` varchar(20) NOT NULL COMMENT 'superadmin or admin',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `related_license_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `message`, `target_user_id`, `target_role`, `is_read`, `related_license_id`, `created_at`) VALUES
(1, 'admin_created', 'New admin created: amul@gmail.com', NULL, 'superadmin', 0, 8, '2025-12-27 19:11:26'),
(2, 'admin_created', 'New admin created: akash@gmail.com', NULL, 'superadmin', 0, 9, '2025-12-29 12:24:22'),
(3, 'admin_created', 'New admin created: aman@gmail.com', NULL, 'superadmin', 0, 11, '2025-12-29 12:49:42'),
(4, 'admin_created', 'New admin created: ram@gmail.com', NULL, 'superadmin', 0, 12, '2025-12-29 13:02:18'),
(5, 'admin_created', 'New admin created: ramu@gamil.com', NULL, 'superadmin', 0, 13, '2025-12-29 13:07:37'),
(6, 'admin_created', 'New admin created: ak@gmail.com', NULL, 'superadmin', 0, 14, '2025-12-29 15:35:25'),
(7, 'admin_created', 'New admin created: abc@gmail.com', NULL, 'superadmin', 0, 15, '2025-12-29 19:09:30'),
(8, 'admin_created', 'New admin created: xyz@gmail.com', NULL, 'superadmin', 0, 16, '2025-12-29 19:13:09'),
(9, 'renewal_approved', 'Your license has been renewed. New expiry date: 2026-12-12', 12, 'admin', 0, 15, '2026-02-11 06:28:41'),
(10, 'license_renewed', 'License renewed for admin: abc@gmail.com', NULL, 'superadmin', 0, 15, '2026-02-11 06:28:41'),
(11, 'renewal_approved', 'Your license has been renewed. New expiry date: 2026-12-12', 12, 'admin', 0, 15, '2026-02-11 06:28:49'),
(12, 'license_renewed', 'License renewed for admin: abc@gmail.com', NULL, 'superadmin', 0, 15, '2026-02-11 06:28:49'),
(13, 'renewal_approved', 'Your license has been renewed. New expiry date: 2026-12-12', 13, 'admin', 0, 16, '2026-02-11 06:29:01'),
(14, 'license_renewed', 'License renewed for admin: xyz@gmail.com', NULL, 'superadmin', 0, 16, '2026-02-11 06:29:01'),
(15, 'admin_created', 'New admin created: r@gmail.com', NULL, 'superadmin', 0, 17, '2026-02-13 13:45:44'),
(16, 'renewal_approved', 'Your license has been renewed. New expiry date: 2027-12-12', 12, 'admin', 0, 15, '2026-03-12 10:31:27'),
(17, 'license_renewed', 'License renewed for admin: abc@gmail.com', NULL, 'superadmin', 0, 15, '2026-03-12 10:31:27');

-- --------------------------------------------------------

--
-- Table structure for table `old_pricings`
--

CREATE TABLE `old_pricings` (
  `id` bigint(20) NOT NULL,
  `supplierId` bigint(20) DEFAULT NULL,
  `categoryId` bigint(20) DEFAULT NULL,
  `subcategoryId` bigint(20) DEFAULT NULL,
  `oldPrice` decimal(10,2) NOT NULL,
  `productPurchased` varchar(255) DEFAULT NULL,
  `currentQuotation` decimal(10,2) NOT NULL,
  `savingFromOldPricing` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `old_pricings`
--

INSERT INTO `old_pricings` (`id`, `supplierId`, `categoryId`, `subcategoryId`, `oldPrice`, `productPurchased`, `currentQuotation`, `savingFromOldPricing`, `status`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, NULL, NULL, 1, 1000.00, NULL, 200.00, 1000.00, 'Approved', '2025-12-23 06:59:11', '2025-12-23 06:59:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `price_comparisons`
--

CREATE TABLE `price_comparisons` (
  `id` bigint(20) NOT NULL,
  `supplier1` bigint(20) DEFAULT NULL,
  `subcategoryId` bigint(20) NOT NULL,
  `supplier2` bigint(20) DEFAULT NULL,
  `recommendedSupplierId` bigint(20) DEFAULT NULL,
  `recommendedSupplierName` varchar(255) DEFAULT NULL,
  `notRecommendedSupplierName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_comparisons`
--

INSERT INTO `price_comparisons` (`id`, `supplier1`, `subcategoryId`, `supplier2`, `recommendedSupplierId`, `recommendedSupplierName`, `notRecommendedSupplierName`, `createdAt`, `updatedAt`, `userId`) VALUES
(2, 3, 1, 1, NULL, 'supplier', 'amul', '2025-12-23 09:21:14', '2025-12-23 09:21:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `procurement_request_approvers`
--

CREATE TABLE `procurement_request_approvers` (
  `id` bigint(20) NOT NULL,
  `intakeRequestId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `userType` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renewal_notifications`
--

CREATE TABLE `renewal_notifications` (
  `id` int(11) NOT NULL,
  `emailSubject` varchar(255) NOT NULL DEFAULT 'Reminder: Contract Renewal Approaching',
  `emailBody` text NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `contractType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`contractType`)),
  `remindBeforeDays` int(11) NOT NULL DEFAULT 7
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renewal_notifications`
--

INSERT INTO `renewal_notifications` (`id`, `emailSubject`, `emailBody`, `createdAt`, `updatedAt`, `contractType`, `remindBeforeDays`) VALUES
(1, 'Reminder: Contract Renewal Approaching', '\n      Dear [Recipient\'s Name],\n\n      This is a friendly reminder that your [Contract Type] contract is approaching its renewal date. Please review the details and take action if necessary.\n\n      Regards,  \n      [Your Company Name]\n    ', '2026-02-17 10:14:32', '2026-02-17 10:14:32', '[null]', 7),
(2, 'Reminder: Contract Renewal Approaching', '\n      Dear [Recipient\'s Name],\n\n      This is a friendly reminder that your [Contract Type] contract is approaching its renewal date. Please review the details and take action if necessary.\n\n      Regards,  \n      [Your Company Name]\n    ', '2026-02-17 10:31:24', '2026-02-17 10:31:24', '[null]', 7);

-- --------------------------------------------------------

--
-- Table structure for table `renewal_requests`
--

CREATE TABLE `renewal_requests` (
  `id` int(11) NOT NULL,
  `contractId` bigint(20) NOT NULL,
  `description` text NOT NULL,
  `amendments` text DEFAULT NULL,
  `previousExpirationDate` datetime NOT NULL,
  `newExpirationDate` datetime NOT NULL,
  `additionalNotes` text DEFAULT NULL,
  `selectDepartment` bigint(20) NOT NULL,
  `renewalAttachmentFile` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending Renewal',
  `vendorName` varchar(255) DEFAULT NULL,
  `contractPrice` varchar(255) DEFAULT NULL,
  `addService` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renewal_requests`
--

INSERT INTO `renewal_requests` (`id`, `contractId`, `description`, `amendments`, `previousExpirationDate`, `newExpirationDate`, `additionalNotes`, `selectDepartment`, `renewalAttachmentFile`, `status`, `vendorName`, `contractPrice`, `addService`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'des', 'amen', '2026-01-10 00:00:00', '2026-03-10 00:00:00', 'add', 3, 'D:\\mukul_procxa\\proxca_backend_mukul\\public\\renewalAttachmentFile\\renewalAttachmentFile_1771234875701.docx', 'Processed', NULL, NULL, NULL, '2026-02-16 09:41:15', '2026-02-16 09:43:11'),
(2, 2, 'djfk', 'jkfdasjkj', '2025-12-12 00:00:00', '2026-12-12 00:00:00', 'jhj', 12, 'D:\\mukul_procxa\\proxca_backend_mukul\\public\\renewalAttachmentFile\\renewalAttachmentFile_1771234968086.docx', 'Processed', NULL, NULL, NULL, '2026-02-16 09:42:48', '2026-02-16 09:42:58'),
(3, 2, 'kdsjfklj', 'ame', '2026-01-01 00:00:00', '2026-02-01 00:00:00', 'add', 19, 'D:\\mukul_procxa\\proxca_backend_mukul\\public\\renewalAttachmentFile\\renewalAttachmentFile_1771235093030.png', 'Pending Renewal', NULL, NULL, NULL, '2026-02-16 09:44:53', '2026-02-16 09:44:53'),
(4, 2, 'ddd', 'list', '2025-12-12 00:00:00', '2026-02-02 00:00:00', 'ooo', 4, 'D:\\mukul_procxa\\proxca_backend_mukul\\public\\renewalAttachmentFile\\renewalAttachmentFile_1771323460102.pdf', 'Pending Renewal', 'supplier2', '50000', 'aaa', '2026-02-17 10:17:40', '2026-02-17 10:17:40');

-- --------------------------------------------------------

--
-- Table structure for table `service_sow_consolidations`
--

CREATE TABLE `service_sow_consolidations` (
  `id` bigint(20) NOT NULL,
  `requestedTeamDepartmentId` bigint(20) DEFAULT NULL,
  `requestedServiceTool` varchar(255) NOT NULL,
  `existingSupplierServiceId` bigint(20) DEFAULT NULL,
  `consolidationSavings` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` bigint(20) NOT NULL,
  `categoryId` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `categoryId`, `name`, `description`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'subcategory', 'subcategory description', 1, '2025-12-20 06:20:25', '2025-12-20 06:20:25');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contactEmail` varchar(255) NOT NULL,
  `contactPhone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `categoryId` bigint(20) DEFAULT NULL,
  `departmentId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `perUnitPrice` bigint(20) DEFAULT NULL,
  `maxUnitPurchase` bigint(20) DEFAULT NULL,
  `discountPercent` bigint(20) DEFAULT NULL,
  `deliveryTerms` varchar(255) DEFAULT NULL,
  `additionalBenefits` text DEFAULT NULL,
  `volumeDiscountStatus` varchar(255) DEFAULT 'New Opportunity',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contactEmail`, `contactPhone`, `address`, `status`, `categoryId`, `departmentId`, `userId`, `perUnitPrice`, `maxUnitPurchase`, `discountPercent`, `deliveryTerms`, `additionalBenefits`, `volumeDiscountStatus`, `createdAt`, `updatedAt`) VALUES
(7, 'supplier', 'suppiler@gmail.com', '1111111111', '', 'active', 11, 26, 12, 0, 0, 0, '', '', 'New Opportunity', '2026-03-13 12:46:20', '2026-03-13 12:46:20'),
(8, 'supier2', 'supie2r@gmail.com', '2222222222', '', 'active', 12, 27, 12, 0, 0, 0, '', '', 'New Opportunity', '2026-03-13 13:06:43', '2026-03-13 13:06:43');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_consolidations`
--

CREATE TABLE `supplier_consolidations` (
  `id` bigint(20) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `currentSupplier` varchar(255) NOT NULL,
  `spendWithEachSupplier` decimal(10,2) NOT NULL,
  `recommendedSupplier` varchar(255) NOT NULL,
  `potentialSaving` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_performances`
--

CREATE TABLE `supplier_performances` (
  `id` bigint(20) NOT NULL,
  `supplierId` bigint(20) NOT NULL,
  `deliveryScore` int(11) DEFAULT 0,
  `qualityScore` int(11) DEFAULT 0,
  `costScore` int(11) DEFAULT 0,
  `complianceScore` int(11) DEFAULT 0,
  `supportScore` int(11) DEFAULT 0,
  `totalScore` int(11) DEFAULT 0,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_performances`
--

INSERT INTO `supplier_performances` (`id`, `supplierId`, `deliveryScore`, `qualityScore`, `costScore`, `complianceScore`, `supportScore`, `totalScore`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 3, 4, 5, 15, NULL, '2026-02-16 13:33:01', '2026-02-16 13:36:49');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_ratings`
--

CREATE TABLE `supplier_ratings` (
  `id` bigint(20) NOT NULL,
  `supplierId` bigint(20) NOT NULL,
  `ratings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`ratings`)),
  `totalRating` float DEFAULT 0,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_ratings`
--

INSERT INTO `supplier_ratings` (`id`, `supplierId`, `ratings`, `totalRating`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 1, '[{\"KPI1\":2,\"KPI2\":1,\"KPI3\":5,\"KPI4\":54,\"KPI5\":6}]', 68, 1, '2025-12-20 06:23:13', '2026-02-16 13:15:16'),
(2, 3, '[{\"KPI1\":100,\"KPI2\":1,\"KPI3\":20,\"KPI4\":20,\"KPI5\":20}]', 161, 1, '2025-12-23 06:40:31', '2026-02-16 12:59:48'),
(3, 2, '[{\"KPI1\":2,\"KPI2\":1,\"KPI3\":5,\"KPI4\":3,\"KPI5\":4}]', 15, 1, '2025-12-23 09:25:39', '2026-02-16 13:12:42'),
(4, 5, '[{\"KPI1\":40,\"KPI2\":3,\"KPI3\":20,\"KPI4\":19}]', 82, 1, '2025-12-23 11:41:41', '2025-12-23 11:41:41'),
(5, 6, '[{\"KPI1\":50,\"KPI2\":5,\"KPI3\":25,\"KPI4\":50}]', 130, 12, '2025-12-30 06:37:32', '2025-12-30 06:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) NOT NULL,
  `dateOfTransaction` datetime NOT NULL,
  `supplierId` bigint(20) DEFAULT NULL,
  `departmentId` bigint(20) DEFAULT NULL,
  `categoryId` bigint(20) DEFAULT NULL,
  `subcategoryId` bigint(20) DEFAULT NULL,
  `amount` float NOT NULL,
  `year` varchar(255) DEFAULT NULL,
  `quarter` varchar(255) DEFAULT NULL,
  `unit` float DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `dateOfTransaction`, `supplierId`, `departmentId`, `categoryId`, `subcategoryId`, `amount`, `year`, `quarter`, `unit`, `userId`, `createdAt`, `updatedAt`) VALUES
(5, '2026-03-10 00:00:00', 7, 26, 11, NULL, 10000, '2025-2026', 'one', 2, 12, '2026-03-13 12:58:21', '2026-03-13 12:58:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `userType` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `refreshToken_Expiration` varchar(255) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_verify` tinyint(1) DEFAULT 0,
  `is_verify` tinyint(1) DEFAULT 0,
  `isapprovalFlow` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `gender`, `phone_no`, `country`, `city`, `state`, `email_id`, `password`, `userType`, `profile_image`, `refreshToken`, `refreshToken_Expiration`, `resetToken`, `resetTokenExpiry`, `otp`, `otp_verify`, `is_verify`, `isapprovalFlow`, `createdAt`, `updatedAt`, `is_active`) VALUES
(1, 'admin', 'admin', 'male', '6985236589', 'india', 'indore', 'mp', 'admin@gmail.com', '$2b$10$OtQev96PRzFE3pZmtoYyx.PRyq.OaTzdV.nIHOB0IGqf5pCozI6oi', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NjY4NDA0NTksImV4cCI6MTc2NzQ0NTI1OX0.63rZsyw-xaf8a7Bo5nYEh2G_bZmqQN_-FOVukcvo4sg', '1767013259373', NULL, NULL, NULL, 0, 0, 1, '2025-12-20 06:17:47', '2025-12-27 13:00:59', 1),
(2, 'user', 'user', 'male', '63258784125', 'india', 'indore', 'Madhya Pradesh', 'user@gmail.com', '$2b$10$Dc3nd8G2US4t1lIvQqvO2uKq7n/m.orjhsGk9HdSd45r3ix8ycOZy', 'user', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzY2ODM4NDAyLCJleHAiOjE3Njc0NDMyMDJ9.5uU0gPXGqq326bnRMryboxAwJ5gCX-opUPkixRzcMKo', '1767011202083', NULL, NULL, NULL, 0, 0, 0, '2025-12-20 12:49:34', '2025-12-27 12:26:42', 1),
(3, 'Super', 'Admin', 'male', '9876543210', 'India', 'Indore', 'Madhya Pradesh', 'superadmin@gmail.com', '$2a$12$.A3dOk3Wg.cuikgBihwEXuDksF9.BkByg9fG3xlh7T2Ma0Ml5es1C', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc2Njg0MDU5MSwiZXhwIjoxNzY3NDQ1MzkxfQ.BBV1co7uOkl3sL_dio8EUmnpQimfIOpzsNhC7rBzgUo', '1767013391131', NULL, NULL, NULL, 0, 1, 0, '2025-12-27 18:09:38', '2025-12-27 13:03:11', 1),
(4, 'kamal', 'patel', 'male', '444551145', 'india', 'inode', 'mp', 'kamal@gmail.com', '$2b$10$z7iu3lxJHU3WuQeevipVW.qzLvpxaw3XncJ8prF1gArWQXMJrBWpu', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJrYW1hbEBnbWFpbC5jb20iLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NjY4Mzk1NzEsImV4cCI6MTc2NzQ0NDM3MX0.FaBXS8oySKgHuPiohqya_nBleXS4RKGRyrxgC6j414w', '1767012371967', NULL, NULL, NULL, 0, 0, 0, '2025-12-27 12:45:54', '2025-12-27 12:46:11', 1),
(5, 'superadmin ', 'login', NULL, NULL, NULL, NULL, NULL, 'superadmin@procxa.com', '$2a$10$gDQN5CZ3bfvjps9j7Gl0iObpA.hfOWxIZ1envwjjcBDsrMKW9wlHu', 'superadmin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJzdXBlcmFkbWluQHByb2N4YS5jb20iLCJ0eXBlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MzQ2NzkzNCwiZXhwIjoxNzc0MDcyNzM0fQ.18XgBIM5xZSpFVgNyZ_kyNtXgOZnR9dG85rIsjBYiu8', '1773640734917', NULL, NULL, NULL, 0, 0, 1, '2025-12-27 13:32:57', '2026-03-14 05:58:54', 1),
(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'amul@gmail.com', '$2a$10$IV2SWJqh8Jewk0TjxKgxiu8ElhInqp0mI0hN0/tV1Jj1xrtk8TBIi', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhbXVsQGdtYWlsLmNvbSIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc2Njg0Mjk5OCwiZXhwIjoxNzY3NDQ3Nzk4fQ.yahl5NHk_OehWk5LqFnhRaCwu0n6dC0mj8w4dFEloaI', '1767015798019', NULL, NULL, NULL, 0, 0, 0, '2025-12-27 13:41:26', '2025-12-27 13:43:18', 1),
(7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'akash@gmail.com', '$2a$10$1gfHqPAeAxtYVij27f9r4uhtRrbMnTK5aQq0PyRkLoZ3LAy78FmtG', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJha2FzaEBnbWFpbC5jb20iLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NjcwNzQ2MzEsImV4cCI6MTc2NzY3OTQzMX0.8MCOtXd2HUjgqGzUY-KUy4TqvWiUrs3cncaCiviih8U', '1767247431856', NULL, NULL, NULL, 0, 0, 0, '2025-12-29 06:54:22', '2025-12-30 06:03:51', 1),
(8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aman@gmail.com', '$2a$10$GEPNTOMVq40RLRw2b/AveeVqX32YFnyGyRkADLq2F64jKS1L/AdaC', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJhbWFuQGdtYWlsLmNvbSIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc2Njk5MzQzOCwiZXhwIjoxNzY3NTk4MjM4fQ.uMGsXxz6V1ZTNkLNGiplHsSSgurQJwmk6GxCoXs2TV0', '1767166238282', NULL, NULL, NULL, 0, 0, 0, '2025-12-29 07:19:42', '2025-12-29 07:30:38', 1),
(9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ram@gmail.com', '$2a$10$oXo7E5oeHSbQwFK9U/hiB.e3O7yMQiT11pXuS1iPKxvFtujn9d2im', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJyYW1AZ21haWwuY29tIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzY3MDAxNjA1LCJleHAiOjE3Njc2MDY0MDV9.d8C9N_xCXyYlLDlGib5lrQcYzbpAw-hVwzfGa85CEFE', '1767174405768', NULL, NULL, NULL, 0, 0, 0, '2025-12-29 07:32:18', '2025-12-29 09:46:45', 1),
(10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ramu@gamil.com', '$2a$10$4TbpEBNicuL1aS3N9zaP1uQVhmL9jSI1Fq1Hdq585t30hPnpJAY2C', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2025-12-29 07:37:37', '2025-12-29 07:37:37', 1),
(11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ak@gmail.com', '$2a$10$wmNv3.06jyaq18K97Gbl8uPpu2amzj0yTvkPCuv/tuo9aWgCXtMxy', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoiYWtAZ21haWwuY29tIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzY3MDAyNzc3LCJleHAiOjE3Njc2MDc1Nzd9.7uW-fhHMOjovkBnytVK8VkzjIj8ymTNcE1oLZ_y6rfw', '1767175577615', NULL, NULL, NULL, 0, 0, 0, '2025-12-29 10:05:25', '2025-12-29 10:06:17', 1),
(12, 'admin', 'login', NULL, NULL, NULL, NULL, NULL, 'abc@gmail.com', '$2a$10$p5nzrXGr97zg1/euSl3Fb.yInh5k6p2lhFyWIjDUi1L.5IX2H1mKi', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc3NTY0MDU2NSwiZXhwIjoxNzc2MjQ1MzY1fQ.3_0XPlQZzd_84XLgPM0XP3gcz8kAxK-Rvh4jyRjBMzI', '1775813365521', NULL, NULL, NULL, 0, 0, 0, '2025-12-29 13:39:30', '2026-04-08 09:29:25', 1),
(13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'xyz@gmail.com', '$2a$10$PQtLxR1GSfr/vWhpIZ8HD.bApLCdbIbBlHqJhjSi3CyrckgEmI7S6', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoieHl6QGdtYWlsLmNvbSIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc3MTIyNTg0MiwiZXhwIjoxNzcxODMwNjQyfQ.d8cws0fpZVLp4g_NYSfO4ZBDDk9qZYakXcuvDYvnrWc', '1771398642405', NULL, NULL, NULL, 0, 0, 0, '2025-12-29 13:43:09', '2026-02-16 07:10:42', 1),
(14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'r@gmail.com', '$2a$10$ThXUdyZ86ghU2VkwCeIlFemHF995LVEiU0n1lynKHkugWnE8ysyiK', 'admin', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoickBnbWFpbC5jb20iLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NzA5OTAzNzMsImV4cCI6MTc3MTU5NTE3M30.E-ngGTcsrxD_kcCvLncmie_JSI50rotv9hnixLfNHZ4', '1771163173118', NULL, NULL, NULL, 0, 0, 0, '2026-02-13 13:45:44', '2026-03-12 10:30:09', 1);

-- --------------------------------------------------------

--
-- Table structure for table `volume_discounts`
--

CREATE TABLE `volume_discounts` (
  `id` bigint(20) NOT NULL,
  `categoryId` bigint(20) DEFAULT NULL,
  `historicalVolumePurchased` decimal(10,2) NOT NULL,
  `discountThreshold` int(11) NOT NULL,
  `estimatedSavings` decimal(10,2) DEFAULT NULL,
  `recommendedSupplierId` bigint(20) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `admin_id` bigint(20) DEFAULT NULL COMMENT 'Admin ID this volume discount belongs to'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assign_intake_request`
--
ALTER TABLE `assign_intake_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requestId` (`requestId`),
  ADD KEY `supplierId` (`supplierId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client_licenses`
--
ALTER TABLE `client_licenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_licenses_ibfk_1` (`department_id`);

--
-- Indexes for table `client_license_assignments`
--
ALTER TABLE `client_license_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_license_id` (`client_license_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `complementary_services`
--
ALTER TABLE `complementary_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplierId` (`supplierId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `supplierId` (`supplierId`),
  ADD KEY `agreementId` (`agreementId`);

--
-- Indexes for table `contract_templates`
--
ALTER TABLE `contract_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contract_types`
--
ALTER TABLE `contract_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `costsavings`
--
ALTER TABLE `costsavings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `intake_requests`
--
ALTER TABLE `intake_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `requesterDepartmentId` (`requesterDepartmentId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `assigncontractTemplateId` (`assigncontractTemplateId`);

--
-- Indexes for table `intake_request_approvers`
--
ALTER TABLE `intake_request_approvers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `intakeRequestId` (`intakeRequestId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `intake_request_comments`
--
ALTER TABLE `intake_request_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requestId` (`requestId`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `sku_2` (`sku`),
  ADD UNIQUE KEY `sku_3` (`sku`);

--
-- Indexes for table `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_key` (`license_key`),
  ADD UNIQUE KEY `license_key_2` (`license_key`),
  ADD UNIQUE KEY `license_key_3` (`license_key`),
  ADD UNIQUE KEY `license_key_4` (`license_key`),
  ADD UNIQUE KEY `license_key_5` (`license_key`),
  ADD UNIQUE KEY `license_key_6` (`license_key`),
  ADD UNIQUE KEY `license_key_7` (`license_key`),
  ADD UNIQUE KEY `license_key_8` (`license_key`),
  ADD UNIQUE KEY `license_key_9` (`license_key`),
  ADD UNIQUE KEY `license_key_10` (`license_key`),
  ADD UNIQUE KEY `license_key_11` (`license_key`),
  ADD UNIQUE KEY `license_key_12` (`license_key`),
  ADD UNIQUE KEY `license_key_13` (`license_key`),
  ADD UNIQUE KEY `license_key_14` (`license_key`),
  ADD UNIQUE KEY `license_key_15` (`license_key`),
  ADD UNIQUE KEY `license_key_16` (`license_key`),
  ADD UNIQUE KEY `license_key_17` (`license_key`),
  ADD UNIQUE KEY `license_key_18` (`license_key`),
  ADD UNIQUE KEY `license_key_19` (`license_key`),
  ADD UNIQUE KEY `license_key_20` (`license_key`),
  ADD UNIQUE KEY `license_key_21` (`license_key`),
  ADD UNIQUE KEY `license_key_22` (`license_key`),
  ADD UNIQUE KEY `license_key_23` (`license_key`),
  ADD UNIQUE KEY `license_key_24` (`license_key`),
  ADD UNIQUE KEY `license_key_25` (`license_key`),
  ADD UNIQUE KEY `license_key_26` (`license_key`),
  ADD UNIQUE KEY `license_key_27` (`license_key`),
  ADD UNIQUE KEY `license_key_28` (`license_key`),
  ADD UNIQUE KEY `license_key_29` (`license_key`),
  ADD UNIQUE KEY `license_key_30` (`license_key`),
  ADD UNIQUE KEY `license_key_31` (`license_key`),
  ADD UNIQUE KEY `license_key_32` (`license_key`),
  ADD UNIQUE KEY `license_key_33` (`license_key`),
  ADD UNIQUE KEY `license_key_34` (`license_key`),
  ADD UNIQUE KEY `license_key_35` (`license_key`),
  ADD UNIQUE KEY `license_key_36` (`license_key`),
  ADD UNIQUE KEY `license_key_37` (`license_key`),
  ADD UNIQUE KEY `license_key_38` (`license_key`),
  ADD UNIQUE KEY `license_key_39` (`license_key`),
  ADD UNIQUE KEY `license_key_40` (`license_key`),
  ADD UNIQUE KEY `license_key_41` (`license_key`),
  ADD UNIQUE KEY `license_key_42` (`license_key`),
  ADD UNIQUE KEY `license_key_43` (`license_key`),
  ADD UNIQUE KEY `license_key_44` (`license_key`),
  ADD UNIQUE KEY `license_key_45` (`license_key`),
  ADD UNIQUE KEY `license_key_46` (`license_key`),
  ADD UNIQUE KEY `license_key_47` (`license_key`),
  ADD UNIQUE KEY `license_key_48` (`license_key`),
  ADD UNIQUE KEY `license_key_49` (`license_key`),
  ADD UNIQUE KEY `license_key_50` (`license_key`),
  ADD UNIQUE KEY `license_key_51` (`license_key`),
  ADD UNIQUE KEY `license_key_52` (`license_key`),
  ADD UNIQUE KEY `license_key_53` (`license_key`),
  ADD UNIQUE KEY `license_key_54` (`license_key`),
  ADD UNIQUE KEY `license_key_55` (`license_key`),
  ADD UNIQUE KEY `license_key_56` (`license_key`),
  ADD UNIQUE KEY `license_key_57` (`license_key`),
  ADD UNIQUE KEY `license_key_58` (`license_key`),
  ADD UNIQUE KEY `license_key_59` (`license_key`),
  ADD UNIQUE KEY `license_key_60` (`license_key`),
  ADD UNIQUE KEY `license_key_61` (`license_key`),
  ADD UNIQUE KEY `license_key_62` (`license_key`),
  ADD UNIQUE KEY `license_key_63` (`license_key`);

--
-- Indexes for table `multi_year_contractings`
--
ALTER TABLE `multi_year_contractings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplierId` (`supplierId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `old_pricings`
--
ALTER TABLE `old_pricings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplierId` (`supplierId`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `subcategoryId` (`subcategoryId`);

--
-- Indexes for table `price_comparisons`
--
ALTER TABLE `price_comparisons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recommendedSupplierId` (`recommendedSupplierId`);

--
-- Indexes for table `procurement_request_approvers`
--
ALTER TABLE `procurement_request_approvers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `renewal_notifications`
--
ALTER TABLE `renewal_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `renewal_requests`
--
ALTER TABLE `renewal_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contractId` (`contractId`);

--
-- Indexes for table `service_sow_consolidations`
--
ALTER TABLE `service_sow_consolidations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requestedTeamDepartmentId` (`requestedTeamDepartmentId`),
  ADD KEY `existingSupplierServiceId` (`existingSupplierServiceId`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `suppliers_ibfk_2` (`departmentId`),
  ADD KEY `suppliers_ibfk_1` (`categoryId`);

--
-- Indexes for table `supplier_consolidations`
--
ALTER TABLE `supplier_consolidations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_performances`
--
ALTER TABLE `supplier_performances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_ratings`
--
ALTER TABLE `supplier_ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplierId` (`supplierId`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `subcategoryId` (`subcategoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `volume_discounts`
--
ALTER TABLE `volume_discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `recommendedSupplierId` (`recommendedSupplierId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assign_intake_request`
--
ALTER TABLE `assign_intake_request`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `client_licenses`
--
ALTER TABLE `client_licenses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `client_license_assignments`
--
ALTER TABLE `client_license_assignments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `complementary_services`
--
ALTER TABLE `complementary_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `contract_templates`
--
ALTER TABLE `contract_templates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `contract_types`
--
ALTER TABLE `contract_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `costsavings`
--
ALTER TABLE `costsavings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `intake_requests`
--
ALTER TABLE `intake_requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `intake_request_approvers`
--
ALTER TABLE `intake_request_approvers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `intake_request_comments`
--
ALTER TABLE `intake_request_comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `licenses`
--
ALTER TABLE `licenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `multi_year_contractings`
--
ALTER TABLE `multi_year_contractings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `old_pricings`
--
ALTER TABLE `old_pricings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `price_comparisons`
--
ALTER TABLE `price_comparisons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `procurement_request_approvers`
--
ALTER TABLE `procurement_request_approvers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renewal_notifications`
--
ALTER TABLE `renewal_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `renewal_requests`
--
ALTER TABLE `renewal_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_sow_consolidations`
--
ALTER TABLE `service_sow_consolidations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `supplier_consolidations`
--
ALTER TABLE `supplier_consolidations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_performances`
--
ALTER TABLE `supplier_performances`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `supplier_ratings`
--
ALTER TABLE `supplier_ratings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `volume_discounts`
--
ALTER TABLE `volume_discounts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assign_intake_request`
--
ALTER TABLE `assign_intake_request`
  ADD CONSTRAINT `assign_intake_request_ibfk_191` FOREIGN KEY (`requestId`) REFERENCES `intake_requests` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `assign_intake_request_ibfk_192` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `client_licenses`
--
ALTER TABLE `client_licenses`
  ADD CONSTRAINT `client_licenses_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `client_license_assignments`
--
ALTER TABLE `client_license_assignments`
  ADD CONSTRAINT `client_license_assignments_ibfk_1` FOREIGN KEY (`client_license_id`) REFERENCES `client_licenses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `client_license_assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `complementary_services`
--
ALTER TABLE `complementary_services`
  ADD CONSTRAINT `complementary_services_ibfk_197` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `complementary_services_ibfk_198` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_361` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `contracts_ibfk_362` FOREIGN KEY (`agreementId`) REFERENCES `contract_templates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_contracts_department` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `intake_requests`
--
ALTER TABLE `intake_requests`
  ADD CONSTRAINT `intake_requests_ibfk_485` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `intake_requests_ibfk_486` FOREIGN KEY (`requesterDepartmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `intake_requests_ibfk_487` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `intake_requests_ibfk_488` FOREIGN KEY (`assigncontractTemplateId`) REFERENCES `contract_templates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `intake_request_approvers`
--
ALTER TABLE `intake_request_approvers`
  ADD CONSTRAINT `intake_request_approvers_ibfk_1` FOREIGN KEY (`intakeRequestId`) REFERENCES `intake_requests` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `intake_request_comments`
--
ALTER TABLE `intake_request_comments`
  ADD CONSTRAINT `intake_request_comments_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `intake_requests` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `multi_year_contractings`
--
ALTER TABLE `multi_year_contractings`
  ADD CONSTRAINT `multi_year_contractings_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `old_pricings`
--
ALTER TABLE `old_pricings`
  ADD CONSTRAINT `old_pricings_ibfk_298` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `old_pricings_ibfk_299` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `old_pricings_ibfk_300` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `price_comparisons`
--
ALTER TABLE `price_comparisons`
  ADD CONSTRAINT `price_comparisons_ibfk_1` FOREIGN KEY (`recommendedSupplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `renewal_requests`
--
ALTER TABLE `renewal_requests`
  ADD CONSTRAINT `renewal_requests_ibfk_1` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `service_sow_consolidations`
--
ALTER TABLE `service_sow_consolidations`
  ADD CONSTRAINT `service_sow_consolidations_ibfk_203` FOREIGN KEY (`requestedTeamDepartmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `service_sow_consolidations_ibfk_204` FOREIGN KEY (`existingSupplierServiceId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `suppliers_ibfk_2` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_415` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_416` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_417` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_418` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `volume_discounts`
--
ALTER TABLE `volume_discounts`
  ADD CONSTRAINT `volume_discounts_ibfk_207` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `volume_discounts_ibfk_208` FOREIGN KEY (`recommendedSupplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
