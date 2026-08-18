import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import { Building, Calculator, ArrowUpRight, UserPlus, ShieldAlert, Wrench } from 'lucide-react';
import { StallDetailDrawer } from '../components/StallDetailDrawer';

export const VacantSpacesPage: React.FC = () => {
  const { stalls, setSelectedStallId, selectedStallId, updateStallStatus, setActiveTab } = useApp();

  const vacantStalls = stalls.filter(s => s.status === 'VACATED' || s.status === 'AVAILABLE');

  const totalLostRevenue = vacantStalls.reduce((acc, s) => {
    const days = s.daysVacant || 14;
    return acc + Math.round((days * s.monthlyRent) / 30);
  }, 0);

  const totalPotentialRent = vacantStalls.reduce((acc, s) => acc + s.monthlyRent, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              VACANT SPACE MANAGEMENT & LOSS CALCULATOR
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Track unutilized temporary retail spaces, calculate estimated vacancy revenue loss, and convert opportunities to active leases.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('applications')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Assign Pending Vendor Application
        </button>
      </div>

      {/* VACANCY LOSS CALCULATOR KPI BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              VACANCY REVENUE LOSS CALCULATOR
            </h3>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
            DEMO ESTIMATE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Total Vacant / Available Stalls</span>
            <p className="text-2xl font-extrabold text-white mt-1">{vacantStalls.length}</p>
            <span className="text-[10px] text-slate-500 block mt-1">Ready for immediate placement</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Monthly Potential Revenue</span>
            <p className="text-2xl font-extrabold text-green-400 mt-1">{formatINR(totalPotentialRent)}</p>
            <span className="text-[10px] text-slate-500 block mt-1">If all vacant stalls filled</span>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block font-medium">Estimated Revenue Lost</span>
            <p className="text-2xl font-extrabold text-red-400 mt-1">{formatINR(totalLostRevenue)}</p>
            <span className="text-[10px] text-red-300/80 block mt-1">
              Formula: (Days Vacant × Rent) ÷ 30
            </span>
          </div>
        </div>
      </div>

      {/* VACANT SPACES TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Vacant Stalls Inventory</h3>
          <span className="text-xs text-slate-400 font-medium">Showing {vacantStalls.length} spaces</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Stall ID</th>
                <th className="p-3">Zone & Floor</th>
                <th className="p-3">Area</th>
                <th className="p-3">Days Vacant</th>
                <th className="p-3">Previous Shop</th>
                <th className="p-3">Monthly Rent</th>
                <th className="p-3">Est. Lost Revenue</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vacantStalls.map(s => {
                const days = s.daysVacant || 14;
                const estimatedLoss = Math.round((days * s.monthlyRent) / 30);

                return (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-400">{s.id}</td>
                    <td className="p-3">{s.zone} • {s.floor}</td>
                    <td className="p-3">{s.sizeSqFt} sq.ft</td>
                    <td className="p-3 font-bold text-amber-400">{days} days</td>
                    <td className="p-3 text-slate-400">{s.previousShopName || 'N/A'}</td>
                    <td className="p-3 font-semibold text-white">{formatINR(s.monthlyRent)}</td>
                    <td className="p-3 font-bold text-red-400">{formatINR(estimatedLoss)}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          s.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-600/20 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedStallId(s.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded border border-slate-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStallId(s.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm"
                      >
                        Assign Vendor
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStallId && (
        <StallDetailDrawer
          stallId={selectedStallId}
          onClose={() => setSelectedStallId(null)}
        />
      )}
    </div>
  );
};
