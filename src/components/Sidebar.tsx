import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Grid3X3,
  Building,
  CreditCard,
  FileText,
  Key,
  Wrench,
  Footprints,
  Calculator,
  BarChart3,
  Award,
  History,
  Store,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, payments, applications, maintenance, leases } = useApp();

  const overdueCount = payments.filter(p => p.status === 'OVERDUE').length;
  const pendingApps = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER REVIEW').length;
  const openMaint = maintenance.filter(m => m.status !== 'RESOLVED' && m.status !== 'CLOSED').length;
  const expiringLeases = leases.filter(l => l.status === 'EXPIRING').length;

  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'spacemap', label: 'Mall Floor / Space Map', icon: Grid3X3 },
    { id: 'storedirectory', label: 'Store Directory', icon: Store },
    { id: 'vacant', label: 'Vacant Spaces & Loss', icon: Building },
    { id: 'revenue', label: 'Revenue & Payments', icon: CreditCard, badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined, badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30' },
    { id: 'applications', label: 'Vendor Applications', icon: FileText, badge: pendingApps > 0 ? `${pendingApps}` : undefined, badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
    { id: 'leases', label: 'Lease & Deposits', icon: Key, badge: expiringLeases > 0 ? `${expiringLeases} Expiring` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { id: 'operations', label: 'Maintenance & Operations', icon: Wrench, badge: openMaint > 0 ? `${openMaint}` : undefined, badgeColor: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
    { id: 'footfall', label: 'Footfall Analytics', icon: Footprints },
    { id: 'simulator', label: 'Revenue Simulator', icon: Calculator },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'business', label: 'Business Value & Q&A', icon: Award },
    { id: 'audit', label: 'Activity & Audit Logs', icon: History },
  ];

  return (
    <nav className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl w-full lg:w-64 shrink-0 p-3.5 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible sticky top-20 z-20 backdrop-blur-md shadow-xl">
      <div className="hidden lg:block px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        PLATFORM NAVIGATION
      </div>
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-300 shrink-0 whitespace-nowrap overflow-hidden relative ${
              isActive
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700/80 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 hover:shadow-lg'
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
            )}
            <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-400 group-hover:rotate-6' : 'text-zinc-400'}`} />
            <span className="flex-1 text-left relative z-10 transition-transform duration-300 group-hover:translate-x-1">{t.label}</span>
            {t.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.badgeColor}`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
