import {
  Stall,
  ShopOwner,
  PaymentRecord,
  SecurityDepositRecord,
  LeaseRecord,
  VendorApplication,
  MaintenanceTicket,
  InspectionRecord,
  HandoverRecord,
  ComplaintRecord,
  ActivityLogItem,
  AuditLogItem,
  FootfallZoneData,
  ZoneId,
  ShopCategory
} from '../types';

export const INITIAL_MALL_STATS = {
  totalMallAreaSqFt: 250000,
  tempRetailAreaSqFt: 15000,
  totalStalls: 120,
};

const CATEGORIES: ShopCategory[] = [
  'Fashion',
  'Electronics',
  'Food',
  'Accessories',
  'Beauty',
  'Home',
  'Gifts',
  'Lifestyle',
  'Seasonal',
  'Promotional',
  'Other'
];

const SHOP_NAMES = [
  'Silk & Style Pop-up',
  'Gadget Express Kiosk',
  'Chai & Bites Food Stall',
  'Glitz Jewelry Corner',
  'Organic Glow Skincare',
  'Artisan Handicrafts Hub',
  'Urban Leather Crafters',
  'Spicy Street Treats',
  'Fragrance Lounge',
  'Trendz Eyewear Kiosk',
  'Cozy Home Decor Stalls',
  'Gourmet Chocolate Booth',
  'Desi Footwear Bazaar',
  'Eco Bamboo Products',
  'Smart Toys & Games'
];

const OWNER_NAMES = [
  'Rajesh Kumar',
  'Priya Sharma',
  'Amitabh Roy',
  'Ananya Iyer',
  'Vikram Patel',
  'Sneh Lata',
  'Rohan Mehta',
  'Kavita Deshmukh',
  'Suresh Nair',
  'Meera Kapoor',
  'Sanjay Verma',
  'Neha Agarwal',
  'Deepak Gupta',
  'Sunita Rao',
  'Arjun Malhotra'
];

// Helper to generate 120 stalls
export const generateInitialStalls = (): Stall[] => {
  const stalls: Stall[] = [];
  const zones: ZoneId[] = ['ZONE A', 'ZONE B', 'ZONE C', 'ZONE D'];

  let occupiedCount = 0;
  let availableCount = 0;
  let vacatedCount = 0;
  let reservedCount = 0;
  let maintenanceCount = 0;

  for (let z = 0; z < 4; z++) {
    const zone = zones[z];
    for (let i = 1; i <= 30; i++) {
      const numStr = i < 10 ? `0${i}` : `${i}`;
      const prefix = zone.split(' ')[1]; // A, B, C, D
      const id = `${prefix}${numStr}`;
      const floor = z === 0 ? 'Ground Floor' : z === 1 ? 'Ground Floor' : z === 2 ? 'First Floor' : 'Second Floor';
      const sizeSqFt = 100 + ((i % 5) * 30); // 100 to 220 sq.ft

      // Determine status distribution to match prompt target:
      // Occupied: 82, Available: 20, Vacated: 10, Reserved: 5, Maintenance: 3
      let status: Stall['status'] = 'OCCUPIED';
      const globalIndex = z * 30 + (i - 1);

      if (globalIndex < 75) {
        status = 'OCCUPIED';
        occupiedCount++;
      } else if (globalIndex < 82) {
        status = 'RENT OVERDUE';
        occupiedCount++;
      } else if (globalIndex < 102) {
        status = 'AVAILABLE';
        availableCount++;
      } else if (globalIndex < 112) {
        status = 'VACATED';
        vacatedCount++;
      } else if (globalIndex < 117) {
        status = 'RESERVED';
        reservedCount++;
      } else {
        status = 'MAINTENANCE';
        maintenanceCount++;
      }

      const monthlyRent = Math.round((sizeSqFt * (140 + (z * 15))) / 100) * 100; // e.g. ~15,000 to 38,000
      const securityDeposit = monthlyRent * 2;

      const shopName = status === 'OCCUPIED' || status === 'RENT OVERDUE' || status === 'RESERVED'
        ? SHOP_NAMES[globalIndex % SHOP_NAMES.length] + ` (${id})`
        : undefined;

      const ownerName = status === 'OCCUPIED' || status === 'RENT OVERDUE' || status === 'RESERVED'
        ? OWNER_NAMES[globalIndex % OWNER_NAMES.length]
        : undefined;

      const category = (status === 'OCCUPIED' || status === 'RENT OVERDUE' || status === 'RESERVED')
        ? CATEGORIES[globalIndex % CATEGORIES.length]
        : undefined;

      const paymentStatus = status === 'RENT OVERDUE'
        ? 'OVERDUE'
        : status === 'OCCUPIED'
        ? (globalIndex % 4 === 0 ? 'PENDING' : 'PAID')
        : undefined;

      stalls.push({
        id,
        zone,
        floor,
        sizeSqFt,
        status,
        monthlyRent,
        securityDeposit,
        shopId: shopName ? `SHP-${1000 + globalIndex}` : undefined,
        shopName,
        ownerName,
        ownerContact: ownerName ? `+91 98${Math.floor(10000000 + Math.random() * 8999999)}` : undefined,
        ownerEmail: ownerName ? `${ownerName.toLowerCase().replace(' ', '.')}@demovendor.com` : undefined,
        category,
        leaseStart: status === 'OCCUPIED' || status === 'RENT OVERDUE' ? '2026-01-01' : undefined,
        leaseEnd: status === 'OCCUPIED' || status === 'RENT OVERDUE' ? (globalIndex % 5 === 0 ? '2026-08-30' : '2026-12-31') : undefined,
        paymentStatus,
        lastPaymentDate: paymentStatus === 'PAID' ? '2026-07-05' : undefined,
        nextDueDate: '2026-08-05',
        vacatedDate: status === 'VACATED' ? '2026-07-12' : undefined,
        daysVacant: status === 'VACATED' ? 29 : status === 'AVAILABLE' ? 14 : undefined,
        previousShopName: status === 'VACATED' ? `Prev Shop (${id})` : undefined,
        previousRent: status === 'VACATED' ? monthlyRent : undefined,
      });
    }
  }

  return stalls;
};

export const INITIAL_STALLS = generateInitialStalls();

export const INITIAL_OWNERS: ShopOwner[] = INITIAL_STALLS
  .filter(s => s.ownerName && s.shopName)
  .map((s, idx) => ({
    id: `OWN-${2000 + idx}`,
    name: s.ownerName!,
    businessName: `${s.ownerName} Retail Pvt Ltd`,
    shopName: s.shopName!,
    contactNumber: s.ownerContact!,
    email: s.ownerEmail!,
    category: s.category || 'Lifestyle',
    address: '123 Commercial Plaza, Mall Precinct, Sector 4',
    stallId: s.id,
    spaceSizeSqFt: s.sizeSqFt,
    monthlyRent: s.monthlyRent,
    securityDeposit: s.securityDeposit,
    leaseStart: s.leaseStart || '2026-01-01',
    leaseEnd: s.leaseEnd || '2026-12-31',
    paymentStatus: s.paymentStatus === 'OVERDUE' ? 'OVERDUE' : s.paymentStatus === 'PENDING' ? 'PENDING' : 'PAID',
    status: 'ACTIVE',
  }));

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  // Paid records
  ...INITIAL_STALLS.filter(s => s.paymentStatus === 'PAID').slice(0, 30).map((s, i) => ({
    id: `PAY-${3000 + i}`,
    txnId: `DEMO-TXN-${880000 + i}`,
    shopId: s.shopId || `SHP-${1000 + i}`,
    shopName: s.shopName || 'Demo Shop',
    ownerName: s.ownerName || 'Demo Owner',
    stallId: s.id,
    rentPeriod: 'August 2026',
    amount: s.monthlyRent,
    dueDate: '2026-08-05',
    paymentDate: '2026-08-03',
    method: (i % 3 === 0 ? 'UPI' : i % 3 === 1 ? 'Bank Transfer' : 'Card') as any,
    status: 'PAID' as const,
    reminderSentDate: undefined,
    reminderStatus: 'NOT_SENT' as const,
  })),
  // Pending records
  ...INITIAL_STALLS.filter(s => s.paymentStatus === 'PENDING').slice(0, 12).map((s, i) => ({
    id: `PAY-${3100 + i}`,
    shopId: s.shopId || `SHP-${1100 + i}`,
    shopName: s.shopName || 'Demo Shop',
    ownerName: s.ownerName || 'Demo Owner',
    stallId: s.id,
    rentPeriod: 'August 2026',
    amount: s.monthlyRent,
    dueDate: '2026-08-05',
    daysOverdue: 5,
    status: 'PENDING' as const,
    reminderSentDate: '2026-08-07',
    reminderStatus: 'SENT_WHATSAPP' as const,
  })),
  // Overdue records
  ...INITIAL_STALLS.filter(s => s.paymentStatus === 'OVERDUE').map((s, i) => ({
    id: `PAY-${3200 + i}`,
    shopId: s.shopId || `SHP-${1200 + i}`,
    shopName: s.shopName || 'Demo Shop',
    ownerName: s.ownerName || 'Demo Owner',
    stallId: s.id,
    rentPeriod: 'August 2026',
    amount: s.monthlyRent,
    dueDate: '2026-08-01',
    daysOverdue: 9 + i * 2,
    status: 'OVERDUE' as const,
    reminderSentDate: '2026-08-08',
    reminderStatus: 'SENT_BOTH' as const,
  })),
];

export const INITIAL_LEASES: LeaseRecord[] = INITIAL_STALLS
  .filter(s => s.shopName && s.leaseStart && s.leaseEnd)
  .map((s, idx) => {
    const isExpiring = idx < 4;
    const daysUntilExpiry = isExpiring ? 18 + idx * 3 : 120 + idx * 10;
    return {
      id: `LSE-${4000 + idx}`,
      shopId: s.shopId || `SHP-${1000 + idx}`,
      shopName: s.shopName!,
      ownerName: s.ownerName!,
      stallId: s.id,
      startDate: s.leaseStart!,
      endDate: isExpiring ? '2026-08-28' : s.leaseEnd!,
      monthlyRent: s.monthlyRent,
      deposit: s.securityDeposit,
      status: isExpiring ? 'EXPIRING' : 'ACTIVE',
      daysUntilExpiry,
    };
  });

export const INITIAL_DEPOSITS: SecurityDepositRecord[] = INITIAL_STALLS
  .filter(s => s.shopName)
  .slice(0, 40)
  .map((s, idx) => ({
    id: `DEP-${5000 + idx}`,
    shopId: s.shopId || `SHP-${1000 + idx}`,
    shopName: s.shopName!,
    stallId: s.id,
    depositRequired: s.securityDeposit,
    depositPaid: s.securityDeposit,
    depositHeld: s.securityDeposit,
    deductions: idx % 5 === 0 ? 5000 : 0,
    refundAmount: idx % 5 === 0 ? s.securityDeposit - 5000 : s.securityDeposit,
    refundStatus: 'HELD',
    notes: idx % 5 === 0 ? '5,000 deduction pending for fixture repair during handover' : 'Standard security deposit held',
  }));

export const INITIAL_APPLICATIONS: VendorApplication[] = [
  {
    id: `APP-7001`,
    applicantName: 'Vikram Sethi',
    businessName: 'Artisan Pottery & Clay',
    contact: '+91 9823456710',
    email: 'vikram.clay@demovendor.com',
    category: 'Home',
    preferredSpace: 'ZONE A',
    requiredAreaSqFt: 200,
    preferredDuration: '3 Months',
    expectedStartDate: '2026-08-20',
    businessDescription: 'Handcrafted ceramic cookware and decorative pottery items.',
    documentStatus: 'COMPLETE',
    status: 'SUBMITTED',
    appliedDate: '2026-08-08',
  },
  {
    id: `APP-7002`,
    applicantName: 'Ritu Nambiar',
    businessName: 'SnackBites Organic Chips',
    contact: '+91 9845678912',
    email: 'ritu@snackbites.demo',
    category: 'Food',
    preferredSpace: 'ZONE B',
    requiredAreaSqFt: 180,
    preferredDuration: '6 Months',
    expectedStartDate: '2026-08-25',
    businessDescription: 'Gourmet banana chips and millet healthy snacks.',
    documentStatus: 'COMPLETE',
    status: 'UNDER REVIEW',
    appliedDate: '2026-08-06',
  },
  {
    id: `APP-7003`,
    applicantName: 'Kunal Deshmukh',
    businessName: 'SmartGlow LED Gadgets',
    contact: '+91 9811223344',
    email: 'kunal.led@demovendor.com',
    category: 'Electronics',
    preferredSpace: 'ZONE C',
    requiredAreaSqFt: 150,
    preferredDuration: '1 Month',
    expectedStartDate: '2026-09-01',
    businessDescription: 'Portable LED lamps, ambient strip lights, and phone accessories.',
    documentStatus: 'PENDING_VERIFICATION',
    status: 'SUBMITTED',
    appliedDate: '2026-08-09',
  },
  {
    id: `APP-7004`,
    applicantName: 'Simran Bajaj',
    businessName: 'Ethnik Wear Sarees & Dupattas',
    contact: '+91 9899887766',
    email: 'simran.ethnik@demovendor.com',
    category: 'Fashion',
    preferredSpace: 'ZONE A',
    requiredAreaSqFt: 250,
    preferredDuration: '3 Months',
    expectedStartDate: '2026-08-15',
    businessDescription: 'Festival festive collection sarees and embroidered dupattas.',
    documentStatus: 'COMPLETE',
    status: 'APPROVED',
    appliedDate: '2026-08-02',
  },
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'MNT-8001',
    shopName: 'Silk & Style Pop-up (A01)',
    stallId: 'A01',
    reportedBy: 'Rajesh Kumar',
    category: 'Lighting',
    issue: '2 spotlight fixtures in front display flickering constantly.',
    priority: 'MEDIUM',
    reportedDate: '2026-08-08',
    assignedStaff: 'Ramesh (Electrician)',
    status: 'IN PROGRESS',
  },
  {
    id: 'MNT-8002',
    shopName: 'Chai & Bites Food Stall (A03)',
    stallId: 'A03',
    reportedBy: 'Amitabh Roy',
    category: 'AC',
    issue: 'Air vent cooling insufficient during peak afternoon hours.',
    priority: 'HIGH',
    reportedDate: '2026-08-09',
    assignedStaff: 'Suresh (HVAC Tech)',
    status: 'ASSIGNED',
  },
  {
    id: 'MNT-8003',
    shopName: 'Vacant Space K-018 (B18)',
    stallId: 'B18',
    reportedBy: 'Operations Team',
    category: 'Flooring',
    issue: 'Floor tile cracked near entrance during vendor move-out.',
    priority: 'LOW',
    reportedDate: '2026-08-05',
    assignedStaff: 'Mahesh (Civil)',
    status: 'REPORTED',
  },
];

export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INS-9001',
    inspectionDate: '2026-08-08',
    inspectorName: 'Inspector Alok Sharma',
    shopName: 'Spicy Street Treats (A08)',
    stallId: 'A08',
    safetyStatus: 'PASS',
    spaceCondition: 'EXCELLENT',
    cleanliness: 'PASS',
    electricalCheck: 'PASS',
    mallRequirements: 'COMPLIANT',
    result: 'PASS',
    notes: 'Food safety and fire extinguisher check passed with zero non-compliances.',
  },
  {
    id: 'INS-9002',
    inspectionDate: '2026-08-07',
    inspectorName: 'Inspector Sunita V',
    shopName: 'Glitz Jewelry Corner (A04)',
    stallId: 'A04',
    safetyStatus: 'WARNING',
    spaceCondition: 'GOOD',
    cleanliness: 'PASS',
    electricalCheck: 'FAIL',
    mallRequirements: 'NON_COMPLIANT',
    result: 'ACTION REQUIRED',
    notes: 'Extension box overloaded. Required to replace with mall-approved surge protector by 12th Aug.',
  },
];

export const INITIAL_HANDOVERS: HandoverRecord[] = [
  {
    id: 'HND-1001',
    stallId: 'B18',
    shopName: 'Urban Leather Crafters (B18)',
    type: 'HANDOVER',
    date: '2026-07-12',
    condition: 'Good overall, minor tile crack near threshold.',
    damageNotes: '1 floor tile cracked near entrance.',
    meterReading: '1,420 kWh',
    cleaningStatus: 'CLEAN',
    maintenanceRequired: true,
    depositDeduction: 5000,
    status: 'COMPLETED',
    photosCount: 4,
  },
];

export const INITIAL_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'CMP-6001',
    shopName: 'Glitz Jewelry Corner (A04)',
    stallId: 'A04',
    type: 'AC',
    description: 'Blower noise too loud during morning hours.',
    submittedDate: '2026-08-07',
    status: 'IN PROGRESS',
  },
];

export const INITIAL_FOOTFALL_ZONES: FootfallZoneData[] = [
  {
    zone: 'ZONE A',
    dailyVisitors: 12500,
    peakHour: '5:00 PM - 8:00 PM',
    occupancyRate: 90,
    availableStalls: 2,
    footfallDensity: 'VERY HIGH',
  },
  {
    zone: 'ZONE B',
    dailyVisitors: 8200,
    peakHour: '4:00 PM - 7:00 PM',
    occupancyRate: 75,
    availableStalls: 6,
    footfallDensity: 'HIGH',
  },
  {
    zone: 'ZONE C',
    dailyVisitors: 6100,
    peakHour: '6:00 PM - 9:00 PM',
    occupancyRate: 68,
    availableStalls: 7,
    footfallDensity: 'MODERATE',
  },
  {
    zone: 'ZONE D',
    dailyVisitors: 4100,
    peakHour: '2:00 PM - 5:00 PM',
    occupancyRate: 60,
    availableStalls: 5,
    footfallDensity: 'MODERATE',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'ACT-1',
    user: 'admin@demo.mall',
    role: 'Mall Administrator',
    action: 'Recorded demo payment ₹35,000 for stall A01',
    module: 'Revenue Management',
    timestamp: '2026-08-10 09:15',
  },
  {
    id: 'ACT-2',
    user: 'manager@demo.mall',
    role: 'Mall Manager',
    action: 'Approved vendor application APP-7004 for Simran Bajaj',
    module: 'Vendor Applications',
    timestamp: '2026-08-09 16:40',
  },
  {
    id: 'ACT-3',
    user: 'operations@demo.mall',
    role: 'Operations Manager',
    action: 'Assigned maintenance ticket MNT-8002 to HVAC Tech',
    module: 'Maintenance',
    timestamp: '2026-08-09 11:20',
  },
  {
    id: 'ACT-4',
    user: 'finance@demo.mall',
    role: 'Finance Manager',
    action: 'Prepared WhatsApp rent payment reminder for stall B02',
    module: 'Overdue Reminders',
    timestamp: '2026-08-08 14:10',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-101',
    user: 'admin@demo.mall',
    action: 'STATUS_CHANGE',
    module: 'Stalls',
    recordId: 'A01',
    previousValue: 'RENT OVERDUE',
    newValue: 'OCCUPIED (PAID)',
    timestamp: '2026-08-10 09:15:22',
  },
  {
    id: 'AUD-102',
    user: 'manager@demo.mall',
    action: 'APPLICATION_STATUS',
    module: 'Vendor Applications',
    recordId: 'APP-7004',
    previousValue: 'SUBMITTED',
    newValue: 'APPROVED',
    timestamp: '2026-08-09 16:40:05',
  },
];
