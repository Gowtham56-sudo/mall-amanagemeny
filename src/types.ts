export type Role =
  | 'Mall Administrator'
  | 'Mall Manager'
  | 'Leasing Manager'
  | 'Finance Manager'
  | 'Operations Manager'
  | 'Maintenance Staff'
  | 'Inspector'
  | 'Vendor / Shop Owner';

export type StallStatus =
  | 'OCCUPIED'
  | 'AVAILABLE'
  | 'VACATED'
  | 'RESERVED'
  | 'MAINTENANCE'
  | 'RENT OVERDUE';

export type ZoneId = 'ZONE A' | 'ZONE B' | 'ZONE C' | 'ZONE D';

export type ShopCategory =
  | 'Fashion'
  | 'Electronics'
  | 'Food'
  | 'Accessories'
  | 'Beauty'
  | 'Home'
  | 'Gifts'
  | 'Lifestyle'
  | 'Seasonal'
  | 'Promotional'
  | 'Other';

export interface Stall {
  id: string; // e.g. 'A01'
  zone: ZoneId;
  floor: 'Ground Floor' | 'First Floor' | 'Second Floor';
  sizeSqFt: number;
  status: StallStatus;
  monthlyRent: number;
  securityDeposit: number;
  shopId?: string;
  shopName?: string;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  category?: ShopCategory;
  leaseStart?: string;
  leaseEnd?: string;
  paymentStatus?: 'PAID' | 'PENDING' | 'OVERDUE' | 'DUE SOON';
  lastPaymentDate?: string;
  nextDueDate?: string;
  vacatedDate?: string;
  daysVacant?: number;
  previousShopName?: string;
  previousRent?: number;
}

export interface ShopOwner {
  id: string;
  name: string;
  businessName: string;
  shopName: string;
  contactNumber: string; // masked in UI if needed
  email: string;
  category: ShopCategory;
  address: string;
  stallId?: string;
  spaceSizeSqFt?: number;
  monthlyRent: number;
  securityDeposit: number;
  leaseStart: string;
  leaseEnd: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'DUE SOON';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL';
}

export interface PaymentRecord {
  id: string; // e.g. 'PAY-1001'
  txnId?: string; // 'DEMO-TXN-XXXXXX'
  shopId: string;
  shopName: string;
  ownerName: string;
  stallId: string;
  rentPeriod: string; // e.g. 'August 2026'
  amount: number;
  dueDate: string;
  paymentDate?: string;
  method?: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'Other';
  status: 'PAID' | 'PENDING' | 'DUE SOON' | 'OVERDUE';
  daysOverdue?: number;
  reminderSentDate?: string;
  reminderStatus?: 'NOT_SENT' | 'SENT_WHATSAPP' | 'SENT_EMAIL' | 'SENT_BOTH';
}

export interface SecurityDepositRecord {
  id: string;
  shopId: string;
  shopName: string;
  stallId: string;
  depositRequired: number;
  depositPaid: number;
  depositHeld: number;
  deductions: number;
  refundAmount: number;
  refundStatus: 'HELD' | 'PARTIAL_REFUND' | 'FULLY_REFUNDED' | 'PROCESSING';
  notes?: string;
}

export interface LeaseRecord {
  id: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  stallId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'TERMINATED';
  daysUntilExpiry: number;
}

export interface VendorApplication {
  id: string;
  applicantName: string;
  businessName: string;
  contact: string;
  email: string;
  category: ShopCategory;
  preferredSpace: ZoneId | 'ANY';
  requiredAreaSqFt: number;
  preferredDuration: string; // e.g. '3 Months'
  expectedStartDate: string;
  businessDescription: string;
  documentStatus: 'COMPLETE' | 'PENDING_VERIFICATION' | 'REJECTED';
  status: 'SUBMITTED' | 'UNDER REVIEW' | 'APPROVED' | 'REJECTED' | 'MORE INFORMATION REQUIRED';
  appliedDate: string;
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  shopName: string;
  stallId: string;
  reportedBy: string;
  category: 'Electrical' | 'AC' | 'Lighting' | 'Plumbing' | 'Cleaning' | 'Flooring' | 'Signage' | 'Other';
  issue: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reportedDate: string;
  assignedStaff?: string;
  status: 'REPORTED' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export interface InspectionRecord {
  id: string;
  inspectionDate: string;
  inspectorName: string;
  shopName: string;
  stallId: string;
  safetyStatus: 'PASS' | 'FAIL' | 'WARNING';
  spaceCondition: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR';
  cleanliness: 'PASS' | 'WARNING';
  electricalCheck: 'PASS' | 'FAIL';
  mallRequirements: 'COMPLIANT' | 'NON_COMPLIANT';
  result: 'PASS' | 'WARNING' | 'ACTION REQUIRED';
  notes: string;
}

export interface HandoverRecord {
  id: string;
  stallId: string;
  shopName: string;
  type: 'HANDOVER' | 'TAKEOVER';
  date: string;
  condition: string;
  damageNotes?: string;
  meterReading?: string;
  cleaningStatus: 'CLEAN' | 'NEEDS_CLEANING';
  maintenanceRequired: boolean;
  depositDeduction: number;
  status: 'COMPLETED' | 'PENDING_INSPECTION';
  photosCount: number;
}

export interface ComplaintRecord {
  id: string;
  shopName: string;
  stallId: string;
  type: 'Payment Issue' | 'Space Issue' | 'Maintenance' | 'Cleaning' | 'Electricity' | 'AC' | 'Access' | 'Other';
  description: string;
  submittedDate: string;
  status: 'SUBMITTED' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';
}

export interface ActivityLogItem {
  id: string;
  user: string;
  role: Role;
  action: string;
  module: string;
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  module: string;
  recordId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface FootfallZoneData {
  zone: ZoneId;
  dailyVisitors: number;
  peakHour: string;
  occupancyRate: number;
  availableStalls: number;
  footfallDensity: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
}
