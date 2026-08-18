import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenanceTicket, InspectionRecord, HandoverRecord, ComplaintRecord } from '../types';
import { formatDate } from '../utils/formatters';
import { Wrench, ShieldCheck, ClipboardCheck, MessageSquare, Plus, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export const OperationsPage: React.FC = () => {
  const {
    maintenance,
    inspections,
    handovers,
    complaints,
    createMaintenanceTicket,
    updateMaintenanceStatus,
    addInspection,
    addComplaint,
    stalls
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MAINTENANCE' | 'INSPECTIONS' | 'HANDOVERS' | 'COMPLAINTS'>('MAINTENANCE');

  // Modal State for New Ticket
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [targetStall, setTargetStall] = useState(stalls[0]?.id || 'A01');
  const [category, setCategory] = useState<MaintenanceTicket['category']>('Electrical');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('MEDIUM');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const stallObj = stalls.find(s => s.id === targetStall);
    createMaintenanceTicket({
      shopName: stallObj?.shopName || `Stall ${targetStall}`,
      stallId: targetStall,
      reportedBy: 'Mall Operations Staff',
      category,
      issue: issue || 'General maintenance check required.',
      priority,
    });
    setShowNewTicketModal(false);
    setIssue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              MALL OPERATIONS, MAINTENANCE & INSPECTIONS
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Manage stall repair tickets, conduct safety & compliance inspections, record space handovers, and resolve vendor complaints.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Create Maintenance Request
        </button>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('MAINTENANCE')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
            activeTab === 'MAINTENANCE' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Maintenance Tickets ({maintenance.length})
        </button>

        <button
          onClick={() => setActiveTab('INSPECTIONS')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
            activeTab === 'INSPECTIONS' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Inspections & Compliance ({inspections.length})
        </button>

        <button
          onClick={() => setActiveTab('HANDOVERS')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
            activeTab === 'HANDOVERS' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          Space Handover / Takeover ({handovers.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLAINTS')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
            activeTab === 'COMPLAINTS' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Vendor Complaints ({complaints.length})
        </button>
      </div>

      {/* TAB CONTENT: MAINTENANCE */}
      {activeTab === 'MAINTENANCE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Active Maintenance Requests</h3>
            <span className="text-xs text-slate-400">{maintenance.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Shop / Stall</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Issue Description</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Reported Date</th>
                  <th className="p-3">Assigned Staff</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {maintenance.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-orange-400">{m.id}</td>
                    <td className="p-3 font-semibold text-white">{m.shopName}</td>
                    <td className="p-3"><span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{m.category}</span></td>
                    <td className="p-3 text-slate-300 max-w-xs">{m.issue}</td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        m.priority === 'URGENT' || m.priority === 'HIGH' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {m.priority}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(m.reportedDate)}</td>
                    <td className="p-3 text-slate-400">{m.assignedStaff || 'Unassigned'}</td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        m.status === 'RESOLVED' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {m.status !== 'RESOLVED' && (
                        <button
                          onClick={() => updateMaintenanceStatus(m.id, 'RESOLVED')}
                          className="bg-green-600/20 hover:bg-green-600/30 text-green-300 text-[10px] font-semibold px-2 py-1 rounded border border-green-500/30"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INSPECTIONS */}
      {activeTab === 'INSPECTIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Mall Safety & Requirement Inspections</h3>
            <span className="text-xs text-slate-400">{inspections.length} inspection logs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspections.map(ins => (
              <div key={ins.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-400">{ins.id}</span>
                    <h4 className="font-bold text-white text-sm">{ins.shopName} ({ins.stallId})</h4>
                    <span className="text-[10px] text-slate-400">Inspector: {ins.inspectorName} • {formatDate(ins.inspectionDate)}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    ins.result === 'PASS' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {ins.result}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 pt-2 border-t border-slate-700/60">
                  <div>Safety: <strong className="text-white">{ins.safetyStatus}</strong></div>
                  <div>Space Condition: <strong className="text-white">{ins.spaceCondition}</strong></div>
                  <div>Cleanliness: <strong className="text-white">{ins.cleanliness}</strong></div>
                  <div>Electrical Check: <strong className="text-white">{ins.electricalCheck}</strong></div>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 italic mt-2">
                  Notes: "{ins.notes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HANDOVERS */}
      {activeTab === 'HANDOVERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Space Handover & Takeover Records</h3>
            <span className="text-xs text-slate-400">{handovers.length} records</span>
          </div>

          <div className="space-y-3">
            {handovers.map(h => (
              <div key={h.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{h.id} • {h.type}</span>
                    <h4 className="font-bold text-white text-sm">{h.shopName} (Stall {h.stallId})</h4>
                  </div>
                  <span className="text-slate-400">{formatDate(h.date)}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                  <div>Condition: <strong className="text-white">{h.condition}</strong></div>
                  <div>Meter Reading: <strong className="text-white">{h.meterReading || 'N/A'}</strong></div>
                  <div>Cleaning: <strong className="text-white">{h.cleaningStatus}</strong></div>
                  <div>Photos Attached: <strong className="text-blue-400 flex items-center gap-1 inline-flex"><ImageIcon className="w-3 h-3"/> {h.photosCount} photos</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COMPLAINTS */}
      {activeTab === 'COMPLAINTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Vendor Complaints Desk</h3>
            <span className="text-xs text-slate-400">{complaints.length} tickets</span>
          </div>

          <div className="space-y-3">
            {complaints.map(c => (
              <div key={c.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">{c.id} • {c.type}</span>
                  <span className="text-slate-400">{formatDate(c.submittedDate)}</span>
                </div>
                <h4 className="font-bold text-white">{c.shopName} ({c.stallId})</h4>
                <p className="text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE TICKET */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Create Maintenance Ticket</h3>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Stall</label>
                <select
                  value={targetStall}
                  onChange={e => setTargetStall(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                >
                  {stalls.map(s => (
                    <option key={s.id} value={s.id}>
                      Stall {s.id} ({s.shopName || 'Vacant'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Electrical">Electrical</option>
                  <option value="AC">AC / HVAC</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Flooring">Flooring</option>
                  <option value="Signage">Signage</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-orange-500/20"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
