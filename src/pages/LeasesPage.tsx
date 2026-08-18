import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeaseRecord } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { Key, ShieldAlert, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LeasesPage: React.FC = () => {
  const { leases, deposits, renewLease } = useApp();

  const [selectedLeaseForRenew, setSelectedLeaseForRenew] = useState<LeaseRecord | null>(null);
  const [newEndDate, setNewEndDate] = useState<string>('2027-08-30');
  const [proposedRent, setProposedRent] = useState<number>(35000);

  const handleRenew = () => {
    if (!selectedLeaseForRenew) return;
    renewLease(selectedLeaseForRenew.id, newEndDate, proposedRent);
    setSelectedLeaseForRenew(null);
  };

  const expiringCount = leases.filter(l => l.status === 'EXPIRING').length;
  const activeCount = leases.filter(l => l.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              LEASE & SECURITY DEPOSIT MANAGEMENT
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Monitor lease terms, trigger automated expiration alerts (60d, 30d, 15d, 7d), process renewals, and manage security deposits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {expiringCount} Leases Expiring Soon
          </span>
        </div>
      </div>

      {/* LEASES TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Active & Expiring Leases</h3>
          <span className="text-xs text-slate-400">{leases.length} lease records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Lease ID</th>
                <th className="p-3">Shop & Owner</th>
                <th className="p-3">Stall ID</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Expiry Alert</th>
                <th className="p-3">Monthly Rent</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leases.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-400">{l.id}</td>
                  <td className="p-3">
                    <span className="font-semibold text-white block">{l.shopName}</span>
                    <span className="text-[10px] text-slate-400">{l.ownerName}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-300">{l.stallId}</td>
                  <td className="p-3">{formatDate(l.startDate)}</td>
                  <td className="p-3">{formatDate(l.endDate)}</td>
                  <td className="p-3">
                    {l.daysUntilExpiry <= 30 ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {l.daysUntilExpiry} days remaining
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        {l.daysUntilExpiry} days remaining
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-green-400">{formatINR(l.monthlyRent)}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        l.status === 'ACTIVE'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedLeaseForRenew(l);
                        setProposedRent(l.monthlyRent);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm flex items-center gap-1 ml-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Renew Lease
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECURITY DEPOSITS SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white text-base">SECURITY DEPOSIT AUDIT TRAIL</h3>
          </div>
          <span className="text-xs text-slate-400">Total Held: {formatINR(deposits.reduce((acc, d) => acc + d.depositHeld, 0))}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Deposit ID</th>
                <th className="p-2.5">Shop Name</th>
                <th className="p-2.5">Stall ID</th>
                <th className="p-2.5">Deposit Paid</th>
                <th className="p-2.5">Held Amount</th>
                <th className="p-2.5">Deductions</th>
                <th className="p-2.5">Refundable</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {deposits.slice(0, 10).map(d => (
                <tr key={d.id} className="hover:bg-slate-800/50">
                  <td className="p-2.5 font-mono font-bold text-blue-400">{d.id}</td>
                  <td className="p-2.5 font-semibold text-white">{d.shopName}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-300">{d.stallId}</td>
                  <td className="p-2.5 font-semibold text-slate-200">{formatINR(d.depositPaid)}</td>
                  <td className="p-2.5 font-bold text-green-400">{formatINR(d.depositHeld)}</td>
                  <td className="p-2.5 text-red-400 font-semibold">{formatINR(d.deductions)}</td>
                  <td className="p-2.5 font-bold text-blue-300">{formatINR(d.refundAmount)}</td>
                  <td className="p-2.5">
                    <span className="text-[9px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {d.refundStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENEWAL MODAL */}
      {selectedLeaseForRenew && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Renew Lease Agreement</h3>
            <p className="text-xs text-slate-400 mb-4">
              Shop: <strong>{selectedLeaseForRenew.shopName}</strong> ({selectedLeaseForRenew.stallId})
            </p>

            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block text-slate-400 mb-1">New Lease End Date</label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={e => setNewEndDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Proposed Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={proposedRent}
                  onChange={e => setProposedRent(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold"
                />
              </div>

              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Current Rent:</span>
                  <span>{formatINR(selectedLeaseForRenew.monthlyRent)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-400">
                  <span>Projected Annual Revenue:</span>
                  <span>{formatINR(proposedRent * 12)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLeaseForRenew(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRenew}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-blue-500/20"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
