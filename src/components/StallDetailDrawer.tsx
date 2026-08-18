import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StallStatus } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  CreditCard,
  Send,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench,
  Tag
} from 'lucide-react';
import { RecordPaymentModal } from './RecordPaymentModal';
import { ReminderModal } from './ReminderModal';
import { DigitalReceiptModal } from './DigitalReceiptModal';

interface StallDetailDrawerProps {
  stallId: string;
  onClose: () => void;
}

export const StallDetailDrawer: React.FC<StallDetailDrawerProps> = ({
  stallId,
  onClose,
}) => {
  const { stalls, updateStallStatus, payments, createMaintenanceTicket } = useApp();
  const stall = stalls.find(s => s.id === stallId);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState<'WHATSAPP' | 'EMAIL' | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<StallStatus | null>(null);

  if (!stall) return null;

  const stallPayments = payments.filter(p => p.stallId === stallId);

  const statusColors: Record<StallStatus, string> = {
    OCCUPIED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    AVAILABLE: 'bg-green-500/20 text-green-300 border-green-500/30',
    VACATED: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    RESERVED: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    MAINTENANCE: 'bg-slate-700/80 text-slate-300 border-slate-600',
    'RENT OVERDUE': 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const handleStatusChange = (newStatus: StallStatus) => {
    if (confirm(`Are you sure you want to change stall ${stall.id} status to ${newStatus}?`)) {
      updateStallStatus(stall.id, newStatus);
      setEditingStatus(null);
    }
  };

  const handleCreateMaintenance = () => {
    createMaintenanceTicket({
      shopName: stall.shopName || `Stall ${stall.id}`,
      stallId: stall.id,
      reportedBy: 'Mall Management',
      category: 'Other',
      issue: 'Routine maintenance check requested from stall drawer.',
      priority: 'MEDIUM',
    });
    alert(`Maintenance ticket created for stall ${stall.id}`);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-zinc-900 border-l border-zinc-800 shadow-2xl overflow-y-auto p-6 text-white flex flex-col backdrop-blur-xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-extrabold text-blue-400">
              STALL {stall.id}
            </span>
            <span className={`text-xs px-3 py-0.5 rounded-full font-bold border ${statusColors[stall.status]}`}>
              {stall.status}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            {stall.zone} • {stall.floor} • {stall.sizeSqFt} sq.ft
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Details */}
      <div className="space-y-4 flex-1">
        {/* Stall & Shop Specs */}
        <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-zinc-700/40">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              Shop Name
            </span>
            <span className="font-bold text-zinc-100">{stall.shopName || 'Vacant / Unassigned'}</span>
          </div>

          {stall.ownerName && (
            <div className="flex justify-between items-center py-1 border-b border-zinc-700/40">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Owner Name
              </span>
              <span className="font-semibold text-zinc-200">{stall.ownerName}</span>
            </div>
          )}

          {stall.category && (
            <div className="flex justify-between items-center py-1 border-b border-zinc-700/40">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Category
              </span>
              <span className="font-medium bg-zinc-700/60 px-2.5 py-0.5 rounded-full text-zinc-300">
                {stall.category}
              </span>
            </div>
          )}

          {stall.ownerContact && (
            <div className="flex justify-between items-center py-1 border-b border-zinc-700/40">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                Contact Number
              </span>
              <span className="font-mono text-zinc-300">{stall.ownerContact}</span>
            </div>
          )}

          {stall.ownerEmail && (
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Email Address
              </span>
              <span className="font-mono text-zinc-300">{stall.ownerEmail}</span>
            </div>
          )}
        </div>

        {/* Commercial & Financial Specs */}
        <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Monthly Rent</span>
            <p className="text-base font-extrabold text-emerald-400 mt-0.5">{formatINR(stall.monthlyRent)}</p>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Security Deposit</span>
            <p className="text-base font-extrabold text-zinc-200 mt-0.5">{formatINR(stall.securityDeposit)}</p>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Lease Period</span>
            <p className="text-xs font-mono text-zinc-300 mt-0.5">
              {formatDate(stall.leaseStart)} - {formatDate(stall.leaseEnd)}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Rent Payment Status</span>
            <p className="mt-0.5">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  stall.paymentStatus === 'PAID'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : stall.paymentStatus === 'OVERDUE'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {stall.paymentStatus || 'N/A'}
              </span>
            </p>
          </div>
        </div>

        {/* Vacancy & History Details */}
        {(stall.status === 'VACATED' || stall.status === 'AVAILABLE') && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-2">
              <Clock className="w-4 h-4" />
              <span>Vacancy Analysis</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Days Vacant:</span>
                <span className="font-bold text-amber-400">{stall.daysVacant || 14} days</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Revenue Loss:</span>
                <span className="font-bold text-red-400">
                  {formatINR(Math.round(((stall.daysVacant || 14) * stall.monthlyRent) / 30))}
                </span>
              </div>
              {stall.previousShopName && (
                <div className="flex justify-between">
                  <span>Previous Occupant:</span>
                  <span>{stall.previousShopName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment History Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Payment History</span>
            <span className="text-[10px] text-slate-400 font-normal">({stallPayments.length} records)</span>
          </h4>

          {stallPayments.length === 0 ? (
            <p className="text-xs text-slate-500 italic bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              No payment transactions recorded for this stall yet.
            </p>
          ) : (
            <div className="bg-slate-800/40 border border-slate-800 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-800 text-slate-400">
                  <tr>
                    <th className="p-2">Period</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {stallPayments.map(p => (
                    <tr key={p.id}>
                      <td className="p-2">{p.rentPeriod}</td>
                      <td className="p-2 font-semibold text-green-400">{formatINR(p.amount)}</td>
                      <td className="p-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => setShowReceiptModal(p.id)}
                          className="text-[10px] text-blue-400 hover:underline font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions Grid */}
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Stall Management Actions
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/20"
            >
              <CreditCard className="w-4 h-4" />
              Record Payment
            </button>

            <button
              onClick={() => setShowReminderModal('WHATSAPP')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              WhatsApp Reminder
            </button>

            <button
              onClick={() => setShowReminderModal('EMAIL')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Mail className="w-4 h-4" />
              Email Reminder
            </button>

            <button
              onClick={handleCreateMaintenance}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              <Wrench className="w-4 h-4 text-orange-400" />
              Maintenance Ticket
            </button>
          </div>

          {/* Quick Status Setter */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 mt-3">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              Change Stall Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['OCCUPIED', 'AVAILABLE', 'VACATED', 'RESERVED', 'MAINTENANCE', 'RENT OVERDUE'] as StallStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                    stall.status === st
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nested Modals */}
      {showPaymentModal && (
        <RecordPaymentModal
          stallId={stall.id}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showReminderModal && stallPayments[0] && (
        <ReminderModal
          payment={stallPayments[0]}
          type={showReminderModal}
          onClose={() => setShowReminderModal(null)}
        />
      )}

      {showReceiptModal && (
        <DigitalReceiptModal
          payment={payments.find(p => p.id === showReceiptModal)!}
          onClose={() => setShowReceiptModal(null)}
        />
      )}
    </div>
  );
};
