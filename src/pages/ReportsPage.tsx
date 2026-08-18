import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/csvExporter';
import { BarChart3, Download, Printer, FileSpreadsheet, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    kpis,
    stalls,
    payments,
    owners,
    leases,
    deposits,
    applications,
    maintenance,
    inspections,
    footfallZones
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'EXECUTIVE_SUMMARY' | 'REPORTS_CENTER'>('EXECUTIVE_SUMMARY');
  const [selectedReportType, setSelectedReportType] = useState<string>('Space Utilization');

  const reportOptions = [
    'Space Utilization',
    'Stall Occupancy',
    'Vacancy',
    'Vacancy Revenue Loss',
    'Rent Collection',
    'Pending Payments',
    'Overdue Payments',
    'Shop Owners',
    'Lease Expiry',
    'Security Deposits',
    'Revenue by Zone',
    'Revenue by Category',
    'Footfall',
    'Maintenance',
    'Inspection',
    'Vendor Applications',
  ];

  const handleExportCSV = () => {
    let exportData: Record<string, any>[] = [];

    switch (selectedReportType) {
      case 'Space Utilization':
      case 'Stall Occupancy':
      case 'Vacancy':
        exportData = stalls.map(s => ({
          Stall_ID: s.id,
          Zone: s.zone,
          Floor: s.floor,
          Size_SqFt: s.sizeSqFt,
          Status: s.status,
          Monthly_Rent: s.monthlyRent,
          Shop_Name: s.shopName || '',
          Owner_Name: s.ownerName || '',
        }));
        break;

      case 'Rent Collection':
      case 'Pending Payments':
      case 'Overdue Payments':
        exportData = payments.map(p => ({
          Payment_ID: p.id,
          Shop_Name: p.shopName,
          Owner_Name: p.ownerName,
          Stall_ID: p.stallId,
          Rent_Period: p.rentPeriod,
          Amount: p.amount,
          Due_Date: p.dueDate,
          Payment_Date: p.paymentDate || '',
          Status: p.status,
          Method: p.method || '',
        }));
        break;

      case 'Shop Owners':
        exportData = owners.map(o => ({
          Owner_ID: o.id,
          Owner_Name: o.name,
          Business_Name: o.businessName,
          Shop_Name: o.shopName,
          Category: o.category,
          Monthly_Rent: o.monthlyRent,
          Lease_End: o.leaseEnd,
          Payment_Status: o.paymentStatus,
        }));
        break;

      default:
        exportData = stalls.map(s => ({
          Stall_ID: s.id,
          Zone: s.zone,
          Monthly_Rent: s.monthlyRent,
          Status: s.status,
        }));
    }

    exportToCSV(`Mall_Retail_Report_${selectedReportType.replace(/\s+/g, '_')}`, exportData);
  };

  const topVacantSpaces = stalls.filter(s => s.status === 'VACATED' || s.status === 'AVAILABLE').slice(0, 5);
  const topOverdueAccounts = payments.filter(p => p.status === 'OVERDUE').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              MANAGEMENT REPORTS & EXECUTIVE SUMMARY
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Generate printable executive management summaries and export detailed CSV reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print Summary
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs gap-1">
        <button
          onClick={() => setActiveReportTab('EXECUTIVE_SUMMARY')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeReportTab === 'EXECUTIVE_SUMMARY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          1-Page Executive Summary
        </button>
        <button
          onClick={() => setActiveReportTab('REPORTS_CENTER')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeReportTab === 'REPORTS_CENTER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Detailed 16 Reports Center
        </button>
      </div>

      {/* 1-PAGE EXECUTIVE MANAGEMENT SUMMARY */}
      {activeReportTab === 'EXECUTIVE_SUMMARY' && (
        <div id="executive-summary-print" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-lg text-white">EXECUTIVE MANAGEMENT REPORT</h3>
              <p className="text-xs text-slate-400">Mall Temporary Retail Intelligence • Performance Brief</p>
            </div>
            <span className="text-xs bg-blue-500/10 text-blue-300 font-mono font-bold px-3 py-1 rounded border border-blue-500/30">
              DEMO SUMMARY
            </span>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Temp Space</span>
              <p className="text-base font-extrabold text-white mt-0.5">{kpis.tempRetailAreaSqFt.toLocaleString()} sq.ft</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupancy</span>
              <p className="text-base font-extrabold text-blue-400 mt-0.5">{kpis.spaceUtilizationPct}% ({kpis.occupiedCount} stalls)</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Vacancy</span>
              <p className="text-base font-extrabold text-amber-400 mt-0.5">{kpis.vacancyPct}% ({kpis.availableCount + kpis.vacatedCount} stalls)</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Collected Rent</span>
              <p className="text-base font-extrabold text-green-400 mt-0.5">{formatINR(kpis.collectedRent)}</p>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Collection %</span>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">{Math.round((kpis.collectedRent/kpis.expectedRent)*100)}%</p>
            </div>
          </div>

          {/* TOP 5 TABLES GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Top 5 Vacant Spaces */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                TOP 5 VACANT SPACES & ESTIMATED LOSS
              </h4>
              <div className="divide-y divide-slate-700/60">
                {topVacantSpaces.map(v => (
                  <div key={v.id} className="py-2 flex justify-between items-center text-slate-300">
                    <div>
                      <span className="font-mono font-bold text-white">Stall {v.id}</span> ({v.zone})
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-400 block">{formatINR(v.monthlyRent)}/mo</span>
                      <span className="text-[10px] text-slate-400">{v.daysVacant || 14} days vacant</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Overdue Accounts */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
                TOP 5 OVERDUE ACCOUNTS
              </h4>
              <div className="divide-y divide-slate-700/60">
                {topOverdueAccounts.map(o => (
                  <div key={o.id} className="py-2 flex justify-between items-center text-slate-300">
                    <div>
                      <span className="font-bold text-white block">{o.shopName}</span>
                      <span className="text-[10px] text-slate-400">Stall {o.stallId} • {o.ownerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-red-400 block">{formatINR(o.amount)}</span>
                      <span className="text-[10px] text-slate-400">{o.daysOverdue || 8} days overdue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED 16 REPORTS CENTER */}
      {activeReportTab === 'REPORTS_CENTER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-base">SELECT REPORT TYPE</h3>
              <p className="text-xs text-slate-400">Select any of the 16 management reports to view or export as CSV.</p>
            </div>

            <select
              value={selectedReportType}
              onChange={e => setSelectedReportType(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-2"
            >
              {reportOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">Active Report: {selectedReportType}</span>
              <button
                onClick={handleExportCSV}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded text-xs flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export CSV Data
              </button>
            </div>
            <p className="text-slate-400">
              This report compiles data across all stalls, shop owners, payment records, and lease parameters ready for executive review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
