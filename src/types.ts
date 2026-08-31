export type ServiceCategory =
  | "all"
  | "identity"
  | "certificates"
  | "banking_aeps"
  | "govt_schemes"
  | "utility_bills"
  | "transport"
  | "education"
  | "business_tax"
  | "document_services";

export interface CscService {
  id: string;
  name: string;
  nameHi: string;
  category: ServiceCategory;
  description: string;
  descriptionHi: string;
  requiredDocuments: string[];
  requiredDocumentsHi: string[];
  govtFee: number;
  cscServiceCharge: number;
  processingDays: string;
  officialPortalUrl: string;
  portalName: string;
  photoRequirements?: string;
  signatureRequirements?: string;
  isPopular?: boolean;
}

export type ApplicationStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "ready"
  | "delivered"
  | "rejected";

export type PaymentMode = "cash" | "upi" | "due" | "aeps";

export interface CustomerApplication {
  id: string;
  tokenNumber: number;
  customerName: string;
  customerMobile: string;
  customerAadhaarLast4?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  status: ApplicationStatus;
  acknowledgementNumber?: string;
  portalReference?: string;
  govtFee: number;
  cscFee: number;
  totalAmount: number;
  paymentMode: PaymentMode;
  isPaid: boolean;
  notes?: string;
  documentsCollected?: string[];
  createdAt: string; // ISO date string
  updatedAt: string;
  deliveredAt?: string;
}

export type LedgerEntryType = "income" | "expense" | "aeps_withdrawal" | "dmt_transfer";

export interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  title: string;
  titleHi: string;
  amount: number;
  paymentMode: "cash" | "upi" | "bank";
  category: string;
  customerName?: string;
  customerMobile?: string;
  aepsCommission?: number;
  notes?: string;
  createdAt: string;
}

export interface VleProfile {
  centerName: string;
  vleName: string;
  cscId: string;
  mobile: string;
  email: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  upiId: string;
  tagline?: string;
}

export interface PortalLink {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  categoryHi: string;
  url: string;
  description: string;
  descriptionHi: string;
  badge?: string;
  iconName: string;
}

export interface AffidavitTemplate {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  description: string;
  hindiTemplate: string;
  englishTemplate: string;
  requiredFields: {
    key: string;
    label: string;
    labelHi: string;
    placeholder: string;
  }[];
}

export interface RateItem {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  govtFee: number;
  cscCharge: number;
  totalPrice: number;
  unit?: string;
}

export interface SchemeEligibility {
  id: string;
  name: string;
  nameHi: string;
  department: string;
  minAge?: number;
  maxAge?: number;
  gender?: "All" | "Male" | "Female";
  incomeLimit?: number;
  benefits: string;
  benefitsHi: string;
  keyRequirements: string[];
  keyRequirementsHi: string[];
  officialUrl: string;
}
