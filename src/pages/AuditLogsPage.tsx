import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, ShieldCheck, User } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { activityLogs, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<'ACTIVITY' | 'AUDIT'>('ACTIVITY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              ACTIVITY & AUDIT LOG TRAIL
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Immutable operation history recording user actions, payment entries, and state changes for compliance audit.
          </p>
        </div>

        <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg font-mono">
          SECURE LOG ENGINE
        </span>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs gap-1">
        <button
          onClick={() => setActiveTab('ACTIVITY')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === 'ACTIVITY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Activity Log ({activityLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === 'AUDIT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit History ({auditLogs.length})
        </button>
      </div>

      {/* ACTIVITY LOG TABLE */}
      {activeTab === 'ACTIVITY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">User Activity Timeline</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Action Description</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activityLogs.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-blue-400">{a.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-white block">{a.user}</span>
                      <span className="text-[10px] text-blue-300/80">{a.role}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-300">{a.module}</td>
                    <td className="p-3 font-medium text-slate-200">{a.action}</td>
                    <td className="p-3 font-mono text-slate-400">{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOG TABLE */}
      {activeTab === 'AUDIT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Field Mutation Audit Logs</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Audit ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action / Module</th>
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Previous Value</th>
                  <th className="p-3">New Value</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map(au => (
                  <tr key={au.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-amber-400">{au.id}</td>
                    <td className="p-3 font-medium text-white">{au.user}</td>
                    <td className="p-3"><span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{au.action} ({au.module})</span></td>
                    <td className="p-3 font-mono text-blue-300">{au.recordId}</td>
                    <td className="p-3 text-red-300">{au.previousValue || 'N/A'}</td>
                    <td className="p-3 text-green-300 font-semibold">{au.newValue || 'N/A'}</td>
                    <td className="p-3 font-mono text-slate-400">{au.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
