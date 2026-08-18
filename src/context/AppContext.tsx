import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Role,
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
  StallStatus,
} from '../types';
import {
  INITIAL_MALL_STATS,
  INITIAL_STALLS,
  INITIAL_OWNERS,
  INITIAL_PAYMENTS,
  INITIAL_LEASES,
  INITIAL_DEPOSITS,
  INITIAL_APPLICATIONS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_INSPECTIONS,
  INITIAL_HANDOVERS,
  INITIAL_COMPLAINTS,
  INITIAL_FOOTFALL_ZONES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  login: (email: string, role: Role) => void;
  logout: () => void;
  
  stalls: Stall[];
  owners: ShopOwner[];
  payments: PaymentRecord[];
  leases: LeaseRecord[];
  deposits: SecurityDepositRecord[];
  applications: VendorApplication[];
  maintenance: MaintenanceTicket[];
  inspections: InspectionRecord[];
  handovers: HandoverRecord[];
  complaints: ComplaintRecord[];
  activityLogs: ActivityLogItem[];
  auditLogs: AuditLogItem[];
  footfallZones: FootfallZoneData[];

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStallId: string | null;
  setSelectedStallId: (id: string | null) => void;
  
  // Notification / Alert drawer trigger
  alertFilter: string | null;
  setAlertFilter: (filter: string | null) => void;

  // Actions
  recordPayment: (paymentData: {
    stallId: string;
    amount: number;
    method: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'Other';
    rentPeriod: string;
  }) => string; // Returns TxnId

  updateStallStatus: (stallId: string, status: StallStatus, details?: Partial<Stall>) => void;
  addVendorApplication: (app: Omit<VendorApplication, 'id' | 'appliedDate' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: VendorApplication['status'], notes?: string) => void;
  approveAndAssignApplication: (appId: string, stallId: string) => void;
  createMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate' | 'status'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceTicket['status'], staff?: string) => void;
  addInspection: (insp: Omit<InspectionRecord, 'id'>) => void;
  renewLease: (leaseId: string, newEndDate: string, newRent: number) => void;
  addShopOwner: (owner: Omit<ShopOwner, 'id'>) => void;
  addComplaint: (complaint: Omit<ComplaintRecord, 'id' | 'submittedDate' | 'status'>) => void;
  addHandover: (handover: Omit<HandoverRecord, 'id'>) => void;
  sendReminder: (paymentId: string, type: 'WHATSAPP' | 'EMAIL') => void;

  // KPIs
  kpis: {
    totalMallAreaSqFt: number;
    tempRetailAreaSqFt: number;
    totalStalls: number;
    occupiedCount: number;
    availableCount: number;
    vacatedCount: number;
    reservedCount: number;
    maintenanceCount: number;
    expectedRent: number;
    collectedRent: number;
    pendingRent: number;
    overdueRent: number;
    vacancyRevenueLoss: number;
    potentialMonthlyRevenue: number;
    spaceUtilizationPct: number;
    availablePct: number;
    vacancyPct: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('Mall Administrator');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('admin@demo.mall');

  const [stalls, setStalls] = useState<Stall[]>(INITIAL_STALLS);
  const [owners, setOwners] = useState<ShopOwner[]>(INITIAL_OWNERS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [leases, setLeases] = useState<LeaseRecord[]>(INITIAL_LEASES);
  const [deposits, setDeposits] = useState<SecurityDepositRecord[]>(INITIAL_DEPOSITS);
  const [applications, setApplications] = useState<VendorApplication[]>(INITIAL_APPLICATIONS);
  const [maintenance, setMaintenance] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [inspections, setInspections] = useState<InspectionRecord[]>(INITIAL_INSPECTIONS);
  const [handovers, setHandovers] = useState<HandoverRecord[]>(INITIAL_HANDOVERS);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(INITIAL_COMPLAINTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [footfallZones] = useState<FootfallZoneData[]>(INITIAL_FOOTFALL_ZONES);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStallId, setSelectedStallId] = useState<string | null>(null);
  const [alertFilter, setAlertFilter] = useState<string | null>(null);

  const logActivity = (action: string, module: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newLog: ActivityLogItem = {
      id: `ACT-${Date.now()}`,
      user: userEmail,
      role: currentRole,
      action,
      module,
      timestamp,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const logAudit = (action: string, module: string, recordId: string, prevVal?: string, newVal?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newAudit: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      user: userEmail,
      action,
      module,
      recordId,
      previousValue: prevVal,
      newValue: newVal,
      timestamp,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const login = (email: string, role: Role) => {
    setUserEmail(email);
    setCurrentRole(role);
    setIsLoggedIn(true);
    logActivity(`Logged in as ${role}`, 'Auth');
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // KPIs Calculation
  const kpis = useMemo(() => {
    const totalStalls = stalls.length;
    let occupiedCount = 0;
    let availableCount = 0;
    let vacatedCount = 0;
    let reservedCount = 0;
    let maintenanceCount = 0;

    let expectedRent = 0;
    let collectedRent = 0;
    let pendingRent = 0;
    let overdueRent = 0;
    let vacancyRevenueLoss = 0;

    stalls.forEach(s => {
      if (s.status === 'OCCUPIED' || s.status === 'RENT OVERDUE') {
        occupiedCount++;
        expectedRent += s.monthlyRent;
      } else if (s.status === 'AVAILABLE') {
        availableCount++;
        vacancyRevenueLoss += s.monthlyRent;
      } else if (s.status === 'VACATED') {
        vacatedCount++;
        vacancyRevenueLoss += s.monthlyRent;
      } else if (s.status === 'RESERVED') {
        reservedCount++;
      } else if (s.status === 'MAINTENANCE') {
        maintenanceCount++;
        vacancyRevenueLoss += s.monthlyRent;
      }
    });

    payments.forEach(p => {
      if (p.status === 'PAID') {
        collectedRent += p.amount;
      } else if (p.status === 'PENDING') {
        pendingRent += p.amount;
      } else if (p.status === 'OVERDUE') {
        overdueRent += p.amount;
      }
    });

    const totalRetailSqFt = stalls.reduce((acc, s) => acc + s.sizeSqFt, 0);
    const occupiedSqFt = stalls.filter(s => s.status === 'OCCUPIED' || s.status === 'RENT OVERDUE').reduce((acc, s) => acc + s.sizeSqFt, 0);
    const availableSqFt = stalls.filter(s => s.status === 'AVAILABLE').reduce((acc, s) => acc + s.sizeSqFt, 0);
    
    const spaceUtilizationPct = totalRetailSqFt > 0 ? Math.round((occupiedSqFt / totalRetailSqFt) * 100) : 0;
    const availablePct = totalRetailSqFt > 0 ? Math.round((availableSqFt / totalRetailSqFt) * 100) : 0;
    const vacancyPct = 100 - spaceUtilizationPct;

    const potentialMonthlyRevenue = expectedRent + vacancyRevenueLoss;

    return {
      totalMallAreaSqFt: INITIAL_MALL_STATS.totalMallAreaSqFt,
      tempRetailAreaSqFt: INITIAL_MALL_STATS.tempRetailAreaSqFt,
      totalStalls,
      occupiedCount,
      availableCount,
      vacatedCount,
      reservedCount,
      maintenanceCount,
      expectedRent: expectedRent || 1850000,
      collectedRent: collectedRent || 1580000,
      pendingRent: pendingRent || 210000,
      overdueRent: overdueRent || 60000,
      vacancyRevenueLoss: vacancyRevenueLoss || 420000,
      potentialMonthlyRevenue: potentialMonthlyRevenue || 2270000,
      spaceUtilizationPct,
      availablePct,
      vacancyPct,
    };
  }, [stalls, payments]);

  // Record Payment
  const recordPayment = (data: {
    stallId: string;
    amount: number;
    method: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'Other';
    rentPeriod: string;
  }) => {
    const txnId = `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const stall = stalls.find(s => s.id === data.stallId);

    const newPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      txnId,
      shopId: stall?.shopId || `SHP-${data.stallId}`,
      shopName: stall?.shopName || `Shop (${data.stallId})`,
      ownerName: stall?.ownerName || 'Demo Owner',
      stallId: data.stallId,
      rentPeriod: data.rentPeriod,
      amount: data.amount,
      dueDate: '2026-08-05',
      paymentDate: new Date().toISOString().split('T')[0],
      method: data.method,
      status: 'PAID',
      reminderStatus: 'NOT_SENT',
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update stall payment status to PAID
    setStalls(prev =>
      prev.map(s => {
        if (s.id === data.stallId) {
          return {
            ...s,
            status: s.status === 'RENT OVERDUE' ? 'OCCUPIED' : s.status,
            paymentStatus: 'PAID',
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      })
    );

    // Update owner payment status
    if (stall?.shopName) {
      setOwners(prev =>
        prev.map(o => (o.stallId === data.stallId ? { ...o, paymentStatus: 'PAID' } : o))
      );
    }

    logActivity(`Recorded payment ${txnId} of ₹${data.amount.toLocaleString('en-IN')} for stall ${data.stallId}`, 'Revenue');
    logAudit('PAYMENT_RECORDED', 'Payments', txnId, 'PENDING', 'PAID');

    return txnId;
  };

  const updateStallStatus = (stallId: string, status: StallStatus, details?: Partial<Stall>) => {
    const prevStall = stalls.find(s => s.id === stallId);
    setStalls(prev =>
      prev.map(s => {
        if (s.id === stallId) {
          const isVacating = status === 'VACATED' || status === 'AVAILABLE';
          return {
            ...s,
            ...details,
            status,
            vacatedDate: isVacating ? new Date().toISOString().split('T')[0] : s.vacatedDate,
            daysVacant: isVacating ? 1 : undefined,
            previousShopName: isVacating ? s.shopName : s.previousShopName,
            previousRent: isVacating ? s.monthlyRent : s.previousRent,
            shopName: isVacating ? undefined : details?.shopName || s.shopName,
            ownerName: isVacating ? undefined : details?.ownerName || s.ownerName,
            paymentStatus: status === 'RENT OVERDUE' ? 'OVERDUE' : status === 'OCCUPIED' ? 'PAID' : undefined,
          };
        }
        return s;
      })
    );

    logActivity(`Updated stall ${stallId} status to ${status}`, 'Space Management');
    logAudit('STATUS_CHANGE', 'Stalls', stallId, prevStall?.status, status);
  };

  const addVendorApplication = (app: Omit<VendorApplication, 'id' | 'appliedDate' | 'status'>) => {
    const newApp: VendorApplication = {
      ...app,
      id: `APP-${Math.floor(7000 + Math.random() * 1000)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
    };
    setApplications(prev => [newApp, ...prev]);
    logActivity(`Submitted vendor application ${newApp.id} for ${newApp.businessName}`, 'Applications');
  };

  const updateApplicationStatus = (id: string, status: VendorApplication['status'], notes?: string) => {
    const app = applications.find(a => a.id === id);
    setApplications(prev =>
      prev.map(a => (a.id === id ? { ...a, status, notes: notes || a.notes } : a))
    );
    logActivity(`Updated application ${id} status to ${status}`, 'Applications');
    logAudit('APPLICATION_STATUS', 'Applications', id, app?.status, status);
  };

  const approveAndAssignApplication = (appId: string, stallId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // Approve application
    updateApplicationStatus(appId, 'APPROVED');

    // Assign to stall
    const monthlyRent = Math.round((app.requiredAreaSqFt * 150) / 100) * 100;
    const securityDeposit = monthlyRent * 2;

    updateStallStatus(stallId, 'OCCUPIED', {
      shopName: app.businessName,
      ownerName: app.applicantName,
      ownerContact: app.contact,
      ownerEmail: app.email,
      category: app.category,
      monthlyRent,
      securityDeposit,
      paymentStatus: 'PAID',
      leaseStart: app.expectedStartDate,
      leaseEnd: '2026-12-31',
    });

    // Add Owner Record
    const newOwner: ShopOwner = {
      id: `OWN-${Date.now()}`,
      name: app.applicantName,
      businessName: app.businessName,
      shopName: app.businessName,
      contactNumber: app.contact,
      email: app.email,
      category: app.category,
      address: 'Mall Temporary Retail Precinct',
      stallId,
      spaceSizeSqFt: app.requiredAreaSqFt,
      monthlyRent,
      securityDeposit,
      leaseStart: app.expectedStartDate,
      leaseEnd: '2026-12-31',
      paymentStatus: 'PAID',
      status: 'ACTIVE',
    };
    setOwners(prev => [newOwner, ...prev]);

    logActivity(`Approved application ${appId} and assigned to stall ${stallId}`, 'Leasing & Spaces');
  };

  const createMaintenanceTicket = (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate' | 'status'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MNT-${Math.floor(8000 + Math.random() * 1000)}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'REPORTED',
    };
    setMaintenance(prev => [newTicket, ...prev]);
    logActivity(`Created maintenance ticket ${newTicket.id} for stall ${ticket.stallId}`, 'Maintenance');
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceTicket['status'], staff?: string) => {
    setMaintenance(prev =>
      prev.map(m => (m.id === id ? { ...m, status, assignedStaff: staff || m.assignedStaff } : m))
    );
    logActivity(`Updated maintenance ticket ${id} to ${status}`, 'Maintenance');
  };

  const addInspection = (insp: Omit<InspectionRecord, 'id'>) => {
    const newInsp: InspectionRecord = {
      ...insp,
      id: `INS-${Math.floor(9000 + Math.random() * 1000)}`,
    };
    setInspections(prev => [newInsp, ...prev]);
    logActivity(`Completed inspection ${newInsp.id} for ${insp.stallId} with result: ${insp.result}`, 'Inspections');
  };

  const renewLease = (leaseId: string, newEndDate: string, newRent: number) => {
    setLeases(prev =>
      prev.map(l => {
        if (l.id === leaseId) {
          return {
            ...l,
            endDate: newEndDate,
            monthlyRent: newRent,
            status: 'ACTIVE',
            daysUntilExpiry: 180,
          };
        }
        return l;
      })
    );
    logActivity(`Renewed lease ${leaseId} with new end date ${newEndDate} and rent ₹${newRent}`, 'Leases');
  };

  const addShopOwner = (owner: Omit<ShopOwner, 'id'>) => {
    const newOwner: ShopOwner = {
      ...owner,
      id: `OWN-${Date.now()}`,
    };
    setOwners(prev => [newOwner, ...prev]);
    logActivity(`Added new shop owner ${owner.name}`, 'Owners');
  };

  const addComplaint = (complaint: Omit<ComplaintRecord, 'id' | 'submittedDate' | 'status'>) => {
    const newComp: ComplaintRecord = {
      ...complaint,
      id: `CMP-${Math.floor(6000 + Math.random() * 1000)}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
    };
    setComplaints(prev => [newComp, ...prev]);
    logActivity(`Submitted complaint ${newComp.id} for stall ${complaint.stallId}`, 'Complaints');
  };

  const addHandover = (handover: Omit<HandoverRecord, 'id'>) => {
    const newHnd: HandoverRecord = {
      ...handover,
      id: `HND-${Math.floor(1000 + Math.random() * 1000)}`,
    };
    setHandovers(prev => [newHnd, ...prev]);
    logActivity(`Recorded space ${handover.type} for stall ${handover.stallId}`, 'Space Handover');
  };

  const sendReminder = (paymentId: string, type: 'WHATSAPP' | 'EMAIL') => {
    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          const newStatus =
            p.reminderStatus === 'SENT_WHATSAPP' && type === 'EMAIL'
              ? 'SENT_BOTH'
              : p.reminderStatus === 'SENT_EMAIL' && type === 'WHATSAPP'
              ? 'SENT_BOTH'
              : type === 'WHATSAPP'
              ? 'SENT_WHATSAPP'
              : 'SENT_EMAIL';
          return {
            ...p,
            reminderSentDate: new Date().toISOString().split('T')[0],
            reminderStatus: newStatus as any,
          };
        }
        return p;
      })
    );
    logActivity(`Prepared ${type} payment reminder for payment record ${paymentId}`, 'Reminders');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLoggedIn,
        setIsLoggedIn,
        userEmail,
        setUserEmail,
        login,
        logout,
        stalls,
        owners,
        payments,
        leases,
        deposits,
        applications,
        maintenance,
        inspections,
        handovers,
        complaints,
        activityLogs,
        auditLogs,
        footfallZones,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        selectedStallId,
        setSelectedStallId,
        alertFilter,
        setAlertFilter,
        recordPayment,
        updateStallStatus,
        addVendorApplication,
        updateApplicationStatus,
        approveAndAssignApplication,
        createMaintenanceTicket,
        updateMaintenanceStatus,
        addInspection,
        renewLease,
        addShopOwner,
        addComplaint,
        addHandover,
        sendReminder,
        kpis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
