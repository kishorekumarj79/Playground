import type { CredentialSchema, CredentialField } from "@/types/playground";

export interface CredentialTemplate {
  id: string;
  name: string;
  description: string;
  sector: string;
  subsector: string;
  useCase: string;
  benefit: string;
  issuerType: string;
  issuerAuthority: Record<string, string>; // by country/region
  fields: CredentialField[];
  version: string;
}

export interface Sector {
  id: string;
  name: string;
  subsectors: Subsector[];
}

export interface Subsector {
  id: string;
  name: string;
}

export const sectors: Sector[] = [
  {
    id: "public-sector",
    name: "Public Sector",
    subsectors: [
      { id: "identity-civil", name: "Identity & Civil Registration" },
      { id: "border-travel", name: "Border Control & Travel" },
      { id: "social-services", name: "Social Services" },
      { id: "civic-engagement", name: "Civic Engagement" },
      { id: "regulatory", name: "Regulatory Compliance" },
      { id: "public-health", name: "Public Health" },
    ],
  },
  {
    id: "financial-services",
    name: "Financial Services",
    subsectors: [
      { id: "banking-kyc", name: "Banking (KYC/AML)" },
      { id: "lending", name: "Lending & Mortgages" },
      { id: "accreditation", name: "High Net Worth Accreditation" },
      { id: "payments", name: "Payments" },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    subsectors: [
      { id: "patient-records", name: "Patient Records" },
      { id: "provider-credentialing", name: "Provider Credentialing" },
      { id: "insurance", name: "Insurance" },
    ],
  },
  {
    id: "education",
    name: "Education",
    subsectors: [
      { id: "academic-records", name: "Academic Records" },
      { id: "professional-development", name: "Professional Development" },
      { id: "student-identity", name: "Student Identity" },
    ],
  },
  {
    id: "employment",
    name: "Employment (HR)",
    subsectors: [
      { id: "recruitment", name: "Recruitment" },
      { id: "workplace-access", name: "Workplace Access" },
      { id: "gig-economy", name: "Gig Economy" },
    ],
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    subsectors: [
      { id: "logistics", name: "Logistics" },
      { id: "sustainability", name: "Sustainability (ESG)" },
      { id: "manufacturing", name: "Manufacturing" },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    subsectors: [
      { id: "tenant-screening", name: "Tenant Screening" },
      { id: "property-rights", name: "Property Rights" },
    ],
  },
];

export const countries = [
  { id: "india", name: "India" },
  { id: "eu", name: "European Union" },
  { id: "uae", name: "UAE" },
  { id: "usa", name: "United States" },
  { id: "global", name: "Global" },
];

export const credentialTemplates: CredentialTemplate[] = [
  // PUBLIC SECTOR - Identity & Civil Registration
  {
    id: "national-id",
    name: "Digital National ID",
    description: "MOSIP-style government identity credential",
    sector: "public-sector",
    subsector: "identity-civil",
    useCase: "Digital Driver's License / National ID",
    benefit: "Enable instant identity verification across government services and reduce fraud",
    issuerType: "Government Authority",
    issuerAuthority: {
      india: "Government of India (UIDAI)",
      eu: "EU Member State Authority",
      uae: "UAE Federal Authority",
      usa: "State DMV / Federal Authority",
      global: "National Government Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { key: "nationality", label: "Nationality", type: "select", required: true, options: ["India", "United States", "United Kingdom", "Germany", "France", "Singapore", "UAE"] },
      { key: "idNumber", label: "ID Number", type: "text", required: true },
      { key: "gender", label: "Gender", type: "select", required: false, options: ["Male", "Female", "Other"] },
    ],
  },
  // PUBLIC SECTOR - Border Control & Travel
  {
    id: "digital-visa",
    name: "Digital Visa / E-Passport",
    description: "Electronic travel authorization credential",
    sector: "public-sector",
    subsector: "border-travel",
    useCase: "Digital Visas & E-Passports",
    benefit: "Streamline border crossings with tamper-proof digital travel documents",
    issuerType: "Immigration Authority",
    issuerAuthority: {
      india: "Ministry of External Affairs",
      eu: "Schengen Authority",
      uae: "Federal Authority for Identity",
      usa: "US Department of State",
      global: "Immigration Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "passportNumber", label: "Passport Number", type: "text", required: true },
      { key: "nationality", label: "Nationality", type: "select", required: true, options: ["India", "United States", "United Kingdom", "Germany", "France", "Singapore", "UAE"] },
      { key: "visaType", label: "Visa Type", type: "select", required: true, options: ["Tourist", "Business", "Work", "Student", "Transit"] },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // PUBLIC SECTOR - Social Services
  {
    id: "benefits-eligibility",
    name: "Benefits Eligibility Proof",
    description: "Social welfare eligibility credential",
    sector: "public-sector",
    subsector: "social-services",
    useCase: "Benefits Eligibility (Means Testing)",
    benefit: "Enable privacy-preserving eligibility checks without exposing sensitive income data",
    issuerType: "Social Services Authority",
    issuerAuthority: {
      india: "Ministry of Social Justice",
      eu: "National Social Services Agency",
      uae: "Ministry of Community Development",
      usa: "Department of Health & Human Services",
      global: "Social Services Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "beneficiaryId", label: "Beneficiary ID", type: "text", required: true },
      { key: "eligibilityCategory", label: "Eligibility Category", type: "select", required: true, options: ["Low Income", "Senior Citizen", "Disability", "Veteran"] },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // PUBLIC SECTOR - Civic Engagement
  {
    id: "voter-registration",
    name: "Voter Registration",
    description: "Electoral registration credential",
    sector: "public-sector",
    subsector: "civic-engagement",
    useCase: "Voter Registration",
    benefit: "Ensure election integrity with verifiable voter credentials",
    issuerType: "Electoral Commission",
    issuerAuthority: {
      india: "Election Commission of India",
      eu: "National Electoral Authority",
      uae: "Federal National Council",
      usa: "State Election Board",
      global: "Electoral Commission",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "voterId", label: "Voter ID", type: "text", required: true },
      { key: "constituency", label: "Constituency", type: "text", required: true },
      { key: "registrationDate", label: "Registration Date", type: "date", required: true },
    ],
  },
  // PUBLIC SECTOR - Regulatory
  {
    id: "business-permit",
    name: "Business Permit",
    description: "Business license and permit credential",
    sector: "public-sector",
    subsector: "regulatory",
    useCase: "Business Permits & Inspections",
    benefit: "Digitize regulatory compliance with instantly verifiable permits",
    issuerType: "Regulatory Authority",
    issuerAuthority: {
      india: "Ministry of Corporate Affairs",
      eu: "National Business Registry",
      uae: "Department of Economic Development",
      usa: "State Business Registry",
      global: "Business Regulatory Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "businessName", label: "Business Name", type: "text", required: true },
      { key: "permitNumber", label: "Permit Number", type: "text", required: true },
      { key: "permitType", label: "Permit Type", type: "select", required: true, options: ["Trade License", "Health Permit", "Safety Certificate", "Environmental Clearance"] },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // PUBLIC SECTOR - Public Health
  {
    id: "vaccination-certificate",
    name: "Vaccination Certificate",
    description: "Health immunization credential",
    sector: "public-sector",
    subsector: "public-health",
    useCase: "Immunization Registries",
    benefit: "Enable instant verification of immunization status across healthcare systems",
    issuerType: "Health Authority",
    issuerAuthority: {
      india: "Ministry of Health & Family Welfare",
      eu: "European Centre for Disease Control",
      uae: "Ministry of Health",
      usa: "CDC / State Health Department",
      global: "National Health Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Patient Name", type: "text", required: true },
      { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { key: "vaccineType", label: "Vaccine Type", type: "select", required: true, options: ["COVID-19 (Pfizer)", "COVID-19 (Moderna)", "COVID-19 (AstraZeneca)", "Influenza", "Hepatitis B"] },
      { key: "doseNumber", label: "Dose Number", type: "select", required: true, options: ["1", "2", "3", "Booster"] },
      { key: "administrationDate", label: "Administration Date", type: "date", required: true },
    ],
  },
  // FINANCIAL SERVICES - Banking
  {
    id: "kyc-profile",
    name: "Reusable KYC Profile",
    description: "Portable identity verification credential",
    sector: "financial-services",
    subsector: "banking-kyc",
    useCase: "Reusable KYC Profiles",
    benefit: "Reduce onboarding time from days to minutes with portable verified identity",
    issuerType: "Licensed Financial Institution",
    issuerAuthority: {
      india: "RBI-Licensed Bank",
      eu: "EU-Licensed Credit Institution",
      uae: "CBUAE-Licensed Bank",
      usa: "FDIC-Insured Bank",
      global: "Licensed Financial Institution",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { key: "nationality", label: "Nationality", type: "select", required: true, options: ["India", "United States", "United Kingdom", "Germany", "France", "Singapore", "UAE"] },
      { key: "idNumber", label: "Government ID Number", type: "text", required: true },
      { key: "kycLevel", label: "KYC Level", type: "select", required: true, options: ["Basic", "Standard", "Enhanced"] },
    ],
  },
  // FINANCIAL SERVICES - Lending
  {
    id: "income-verification",
    name: "Income Verification",
    description: "Employment and income credential",
    sector: "financial-services",
    subsector: "lending",
    useCase: "Income & Employment Verification",
    benefit: "Accelerate loan approvals with instantly verifiable income credentials",
    issuerType: "Payroll Provider / Employer",
    issuerAuthority: {
      india: "EPFO / Registered Employer",
      eu: "Certified Payroll Provider",
      uae: "Ministry of Labour Certified Employer",
      usa: "Certified Payroll Provider",
      global: "Verified Employer / Payroll Provider",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Employee Name", type: "text", required: true },
      { key: "employerId", label: "Employer ID", type: "text", required: true },
      { key: "annualIncome", label: "Annual Income Range", type: "select", required: true, options: ["< $50,000", "$50,000 - $100,000", "$100,000 - $200,000", "> $200,000"] },
      { key: "employmentDate", label: "Employment Start Date", type: "date", required: true },
    ],
  },
  // FINANCIAL SERVICES - Accreditation
  {
    id: "accredited-investor",
    name: "Accredited Investor Status",
    description: "High net worth accreditation credential",
    sector: "financial-services",
    subsector: "accreditation",
    useCase: "Accredited Investor Status",
    benefit: "Streamline private placement access with portable investor credentials",
    issuerType: "Certified Wealth Advisor",
    issuerAuthority: {
      india: "SEBI-Registered Investment Advisor",
      eu: "MiFID-Authorized Advisor",
      uae: "SCA-Licensed Investment Advisor",
      usa: "SEC-Registered Investment Advisor",
      global: "Certified Wealth Management Firm",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Investor Name", type: "text", required: true },
      { key: "accreditationType", label: "Accreditation Type", type: "select", required: true, options: ["Income-Based", "Net Worth", "Professional Certification", "Entity"] },
      { key: "verificationDate", label: "Verification Date", type: "date", required: true },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // FINANCIAL SERVICES - Payments
  {
    id: "transaction-auth",
    name: "Transaction Authorization",
    description: "Payment authorization credential",
    sector: "financial-services",
    subsector: "payments",
    useCase: "Transaction Authorization",
    benefit: "Enable secure, fraud-resistant payment authorizations",
    issuerType: "Payment Service Provider",
    issuerAuthority: {
      india: "RBI-Authorized PSP",
      eu: "PSD2-Licensed Payment Institution",
      uae: "CBUAE-Licensed Payment Provider",
      usa: "State-Licensed Money Transmitter",
      global: "Licensed Payment Service Provider",
    },
    version: "1.0.0",
    fields: [
      { key: "accountHolder", label: "Account Holder", type: "text", required: true },
      { key: "accountId", label: "Account ID (masked)", type: "text", required: true },
      { key: "authorizationLimit", label: "Authorization Limit", type: "select", required: true, options: ["$1,000", "$10,000", "$100,000", "Unlimited"] },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // HEALTHCARE - Patient Records
  {
    id: "portable-prescription",
    name: "Portable Prescription",
    description: "Digital prescription credential",
    sector: "healthcare",
    subsector: "patient-records",
    useCase: "Portable Prescriptions",
    benefit: "Enable secure, verifiable prescriptions across pharmacies",
    issuerType: "Licensed Healthcare Provider",
    issuerAuthority: {
      india: "Medical Council of India Registered Doctor",
      eu: "EU-Licensed Medical Practitioner",
      uae: "DHA/DOH Licensed Physician",
      usa: "State Medical Board Licensed Physician",
      global: "Licensed Healthcare Provider",
    },
    version: "1.0.0",
    fields: [
      { key: "patientName", label: "Patient Name", type: "text", required: true },
      { key: "medication", label: "Medication", type: "text", required: true },
      { key: "dosage", label: "Dosage", type: "text", required: true },
      { key: "prescriptionDate", label: "Prescription Date", type: "date", required: true },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // HEALTHCARE - Provider Credentialing
  {
    id: "medical-license",
    name: "Medical License",
    description: "Healthcare provider credential",
    sector: "healthcare",
    subsector: "provider-credentialing",
    useCase: "Medical Licensing",
    benefit: "Instant verification of healthcare provider credentials",
    issuerType: "Medical Licensing Board",
    issuerAuthority: {
      india: "Medical Council of India",
      eu: "National Medical Council",
      uae: "Dubai Health Authority / DOH",
      usa: "State Medical Board",
      global: "Medical Licensing Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Practitioner Name", type: "text", required: true },
      { key: "licenseNumber", label: "License Number", type: "text", required: true },
      { key: "specialty", label: "Specialty", type: "select", required: true, options: ["General Practice", "Internal Medicine", "Surgery", "Pediatrics", "Psychiatry"] },
      { key: "issuedDate", label: "Issued Date", type: "date", required: true },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // HEALTHCARE - Insurance
  {
    id: "insurance-coverage",
    name: "Insurance Coverage Proof",
    description: "Health insurance credential",
    sector: "healthcare",
    subsector: "insurance",
    useCase: "Proof of Insurance Coverage",
    benefit: "Streamline healthcare access with instantly verifiable coverage",
    issuerType: "Licensed Insurance Provider",
    issuerAuthority: {
      india: "IRDAI-Registered Insurer",
      eu: "Solvency II Authorized Insurer",
      uae: "IA-Licensed Insurance Company",
      usa: "State-Licensed Insurance Company",
      global: "Licensed Insurance Provider",
    },
    version: "1.0.0",
    fields: [
      { key: "policyHolder", label: "Policy Holder", type: "text", required: true },
      { key: "policyNumber", label: "Policy Number", type: "text", required: true },
      { key: "coverageType", label: "Coverage Type", type: "select", required: true, options: ["Basic", "Standard", "Premium", "Comprehensive"] },
      { key: "validUntil", label: "Coverage End Date", type: "date", required: true },
    ],
  },
  // EDUCATION - Academic Records
  {
    id: "university-degree",
    name: "Digital Diploma / Transcript",
    description: "Academic credential for higher education",
    sector: "education",
    subsector: "academic-records",
    useCase: "Digital Diplomas & Transcripts",
    benefit: "Eliminate credential fraud with instantly verifiable academic records",
    issuerType: "Educational Institution",
    issuerAuthority: {
      india: "UGC-Recognized University",
      eu: "EHEA-Recognized Institution",
      uae: "CAA-Accredited University",
      usa: "Regionally Accredited University",
      global: "Accredited Educational Institution",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Graduate Name", type: "text", required: true },
      { key: "degree", label: "Degree Type", type: "select", required: true, options: ["Bachelor of Science", "Bachelor of Arts", "Master of Science", "Master of Arts", "Doctor of Philosophy"] },
      { key: "major", label: "Major / Field of Study", type: "text", required: true },
      { key: "graduationDate", label: "Graduation Date", type: "date", required: true },
      { key: "honors", label: "Honors", type: "select", required: false, options: ["Summa Cum Laude", "Magna Cum Laude", "Cum Laude", "None"] },
    ],
  },
  // EDUCATION - Professional Development
  {
    id: "micro-credential",
    name: "Micro-credential / Skills Badge",
    description: "Professional skills verification",
    sector: "education",
    subsector: "professional-development",
    useCase: "Micro-credentials & Skills Badges",
    benefit: "Enable portable, verifiable proof of professional skills",
    issuerType: "Certified Training Provider",
    issuerAuthority: {
      india: "NSDC-Certified Training Partner",
      eu: "EQF-Aligned Training Provider",
      uae: "KHDA-Approved Training Institute",
      usa: "Accredited Continuing Education Provider",
      global: "Certified Training Provider",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Learner Name", type: "text", required: true },
      { key: "credentialName", label: "Credential Name", type: "text", required: true },
      { key: "skillLevel", label: "Skill Level", type: "select", required: true, options: ["Foundational", "Intermediate", "Advanced", "Expert"] },
      { key: "completionDate", label: "Completion Date", type: "date", required: true },
    ],
  },
  // EDUCATION - Student Identity
  {
    id: "student-id",
    name: "Student Identity",
    description: "Campus access and student verification",
    sector: "education",
    subsector: "student-identity",
    useCase: "Campus Access & Discounts",
    benefit: "Secure campus access and enable student benefit verification",
    issuerType: "Educational Institution",
    issuerAuthority: {
      india: "UGC-Recognized Institution",
      eu: "EHEA-Member Institution",
      uae: "CAA-Accredited Institution",
      usa: "Accredited Educational Institution",
      global: "Accredited Educational Institution",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Student Name", type: "text", required: true },
      { key: "studentId", label: "Student ID", type: "text", required: true },
      { key: "program", label: "Program", type: "text", required: true },
      { key: "enrollmentDate", label: "Enrollment Date", type: "date", required: true },
      { key: "expectedGraduation", label: "Expected Graduation", type: "date", required: true },
    ],
  },
  // EMPLOYMENT - Recruitment
  {
    id: "background-check",
    name: "Background Check",
    description: "Pre-employment verification credential",
    sector: "employment",
    subsector: "recruitment",
    useCase: "Instant Background Checks",
    benefit: "Reduce hiring time with portable, verified employment history",
    issuerType: "Licensed Background Check Provider",
    issuerAuthority: {
      india: "PBSA-Accredited Provider",
      eu: "GDPR-Compliant Verification Service",
      uae: "Ministry of Labour Authorized Provider",
      usa: "FCRA-Compliant Background Check Agency",
      global: "Certified Background Verification Service",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Candidate Name", type: "text", required: true },
      { key: "checkType", label: "Check Type", type: "select", required: true, options: ["Criminal", "Employment History", "Education", "Credit", "Comprehensive"] },
      { key: "status", label: "Status", type: "select", required: true, options: ["Clear", "Flagged", "Pending Review"] },
      { key: "verificationDate", label: "Verification Date", type: "date", required: true },
    ],
  },
  // EMPLOYMENT - Workplace Access
  {
    id: "employee-badge",
    name: "Digital Employee Badge",
    description: "Workplace access credential",
    sector: "employment",
    subsector: "workplace-access",
    useCase: "Digital Employee Badge",
    benefit: "Secure workplace access with verifiable employee credentials",
    issuerType: "Employer HR System",
    issuerAuthority: {
      india: "Corporate HR Department",
      eu: "Corporate HR Department",
      uae: "Corporate HR Department",
      usa: "Corporate HR Department",
      global: "Employer HR Department",
    },
    version: "1.0.0",
    fields: [
      { key: "fullName", label: "Employee Name", type: "text", required: true },
      { key: "employeeId", label: "Employee ID", type: "text", required: true },
      { key: "department", label: "Department", type: "text", required: true },
      { key: "accessLevel", label: "Access Level", type: "select", required: true, options: ["General", "Restricted", "Executive", "All Areas"] },
      { key: "validUntil", label: "Valid Until", type: "date", required: true },
    ],
  },
  // EMPLOYMENT - Gig Economy
  {
    id: "portable-reputation",
    name: "Portable Reputation",
    description: "Cross-platform work history credential",
    sector: "employment",
    subsector: "gig-economy",
    useCase: "Portable Reputation",
    benefit: "Enable workers to carry verified reputation across platforms",
    issuerType: "Gig Platform / Previous Employer",
    issuerAuthority: {
      india: "Registered Gig Platform",
      eu: "EU-Operating Platform",
      uae: "Licensed Service Platform",
      usa: "Major Gig Economy Platform",
      global: "Verified Gig Economy Platform",
    },
    version: "1.0.0",
    fields: [
      { key: "workerName", label: "Worker Name", type: "text", required: true },
      { key: "platformId", label: "Platform ID", type: "text", required: true },
      { key: "completedJobs", label: "Completed Jobs", type: "text", required: true },
      { key: "rating", label: "Average Rating", type: "select", required: true, options: ["5.0", "4.5+", "4.0+", "3.5+"] },
      { key: "memberSince", label: "Member Since", type: "date", required: true },
    ],
  },
  // SUPPLY CHAIN - Logistics
  {
    id: "bill-of-lading",
    name: "Electronic Bill of Lading",
    description: "Digital shipping document",
    sector: "supply-chain",
    subsector: "logistics",
    useCase: "Electronic Bill of Lading",
    benefit: "Reduce shipping delays with instantly verifiable cargo documents",
    issuerType: "Licensed Carrier / Freight Forwarder",
    issuerAuthority: {
      india: "DG Shipping Licensed Carrier",
      eu: "EU Maritime Registered Carrier",
      uae: "FTA Licensed Freight Forwarder",
      usa: "FMC Licensed Carrier",
      global: "Licensed Maritime Carrier",
    },
    version: "1.0.0",
    fields: [
      { key: "shipperName", label: "Shipper Name", type: "text", required: true },
      { key: "consigneeName", label: "Consignee Name", type: "text", required: true },
      { key: "blNumber", label: "B/L Number", type: "text", required: true },
      { key: "origin", label: "Port of Origin", type: "text", required: true },
      { key: "destination", label: "Port of Destination", type: "text", required: true },
    ],
  },
  // SUPPLY CHAIN - Sustainability
  {
    id: "product-provenance",
    name: "Product Provenance Certificate",
    description: "ESG and sustainability credential",
    sector: "supply-chain",
    subsector: "sustainability",
    useCase: "Product Provenance & Ethics",
    benefit: "Build consumer trust with verifiable sustainability claims",
    issuerType: "Certified Sustainability Auditor",
    issuerAuthority: {
      india: "BIS / Certified Auditor",
      eu: "EU Ecolabel Authorized Body",
      uae: "ESMA Certified Auditor",
      usa: "EPA / Third-Party Certifier",
      global: "Certified Sustainability Auditor",
    },
    version: "1.0.0",
    fields: [
      { key: "productName", label: "Product Name", type: "text", required: true },
      { key: "manufacturer", label: "Manufacturer", type: "text", required: true },
      { key: "certification", label: "Certification Type", type: "select", required: true, options: ["Organic", "Fair Trade", "Carbon Neutral", "Sustainable Sourcing"] },
      { key: "certificationDate", label: "Certification Date", type: "date", required: true },
    ],
  },
  // SUPPLY CHAIN - Manufacturing
  {
    id: "parts-authentication",
    name: "Parts Authentication",
    description: "Digital twin / parts verification",
    sector: "supply-chain",
    subsector: "manufacturing",
    useCase: "Digital Twins / Parts Authentication",
    benefit: "Combat counterfeiting with verifiable part authenticity",
    issuerType: "Original Equipment Manufacturer",
    issuerAuthority: {
      india: "Authorized OEM",
      eu: "CE-Certified Manufacturer",
      uae: "ESMA-Certified Manufacturer",
      usa: "Authorized OEM",
      global: "Original Equipment Manufacturer",
    },
    version: "1.0.0",
    fields: [
      { key: "partNumber", label: "Part Number", type: "text", required: true },
      { key: "serialNumber", label: "Serial Number", type: "text", required: true },
      { key: "manufacturerName", label: "Manufacturer", type: "text", required: true },
      { key: "manufactureDate", label: "Manufacture Date", type: "date", required: true },
      { key: "batchNumber", label: "Batch Number", type: "text", required: false },
    ],
  },
  // REAL ESTATE - Tenant Screening
  {
    id: "rental-history",
    name: "Rental History & Credit Proof",
    description: "Tenant verification credential",
    sector: "real-estate",
    subsector: "tenant-screening",
    useCase: "Rental History & Credit Proof",
    benefit: "Streamline tenant screening with portable rental credentials",
    issuerType: "Property Management Company",
    issuerAuthority: {
      india: "Registered Property Manager",
      eu: "Licensed Property Management Firm",
      uae: "RERA Registered Property Manager",
      usa: "Licensed Property Management Company",
      global: "Certified Property Manager",
    },
    version: "1.0.0",
    fields: [
      { key: "tenantName", label: "Tenant Name", type: "text", required: true },
      { key: "previousAddress", label: "Previous Address", type: "text", required: true },
      { key: "tenancyDuration", label: "Tenancy Duration", type: "select", required: true, options: ["< 1 year", "1-2 years", "2-5 years", "> 5 years"] },
      { key: "paymentHistory", label: "Payment History", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
    ],
  },
  // REAL ESTATE - Property Rights
  {
    id: "title-deed",
    name: "Digital Title Deed",
    description: "Property ownership credential",
    sector: "real-estate",
    subsector: "property-rights",
    useCase: "Digital Title Deeds",
    benefit: "Enable instant property ownership verification and transfer",
    issuerType: "Land Registry Authority",
    issuerAuthority: {
      india: "State Land Revenue Department",
      eu: "National Land Registry",
      uae: "Dubai Land Department",
      usa: "County Recorder's Office",
      global: "Land Registry Authority",
    },
    version: "1.0.0",
    fields: [
      { key: "ownerName", label: "Owner Name", type: "text", required: true },
      { key: "propertyId", label: "Property ID / Title Number", type: "text", required: true },
      { key: "propertyType", label: "Property Type", type: "select", required: true, options: ["Residential", "Commercial", "Industrial", "Agricultural"] },
      { key: "registrationDate", label: "Registration Date", type: "date", required: true },
    ],
  },
];

// Helper function to convert template to CredentialSchema (for compatibility)
export function templateToSchema(template: CredentialTemplate, country: string): CredentialSchema {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    version: template.version,
    issuerType: template.issuerAuthority[country] || template.issuerAuthority.global || template.issuerType,
    fields: template.fields,
  };
}

// Get templates filtered by sector
export function getTemplatesBySector(sectorId: string): CredentialTemplate[] {
  return credentialTemplates.filter(t => t.sector === sectorId);
}

// Get templates filtered by subsector
export function getTemplatesBySubsector(subsectorId: string): CredentialTemplate[] {
  return credentialTemplates.filter(t => t.subsector === subsectorId);
}

// Get sector name by ID
export function getSectorName(sectorId: string): string {
  return sectors.find(s => s.id === sectorId)?.name || sectorId;
}

// Get subsector name by ID
export function getSubsectorName(sectorId: string, subsectorId: string): string {
  const sector = sectors.find(s => s.id === sectorId);
  return sector?.subsectors.find(ss => ss.id === subsectorId)?.name || subsectorId;
}
