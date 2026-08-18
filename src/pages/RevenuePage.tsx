import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentRecord } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import {
  CreditCard,
  Plus,
  Send,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertOctagon,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import { ReminderModal } from '../components/ReminderModal';
import { DigitalReceiptModal } from '../components/DigitalReceiptModal';

export const RevenuePage: React.FC = () => {
  const { payments, kpis } = useApp();

  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [selectedPaymentForModal, setSelectedPaymentForModal] = useState<PaymentRecord | null>(null);
  const [showRecordModalForStall, setShowRecordModalForStall] = useState<string | null>(null);
  const [reminderType, setReminderType] = useState<'WHATSAPP' | 'EMAIL' | null>(null);
  const [showReceipt, setShowReceipt] = useState<PaymentRecord | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkPreparedMsg, setBulkPreparedMsg] = useState<string | null>(null);

  const filteredPayments = payments.filter(p => {
    if (paymentFilter === 'ALL') return true;
    return p.status === paymentFilter;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPayments.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePrepareBulkReminders = (type: 'WHATSAPP' | 'EMAIL') => {
    if (selectedIds.length === 0) {
      alert('Please select at least one pending/overdue payment record first.');
      return;
    }
    setBulkPreparedMsg(`Successfully prepared ${selectedIds.length} ${type} reminder message templates for selected shops.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              REVENUE & RENT PAYMENT MANAGEMENT
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Track collected rent, pending dues, overdue accounts, record demo payments, and dispatch reminders.
          </p>
        </div>

        <button
          onClick={() => setShowRecordModalForStall('A01')}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          <Plus className="w-4 h-4" />
          Record Demo Payment
        </button>
      </div>

      {/* KPI METRICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Collected Rent</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-xl font-bold text-green-400">{formatINR(kpis.collectedRent)}</p>
          <span className="text-[10px] text-slate-500">
            Collection Efficiency: {Math.round((kpis.collectedRent / kpis.expectedRent) * 100)}%
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Pending Rent</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-400">{formatINR(kpis.pendingRent)}</p>
          <span className="text-[10px] text-slate-500">Within grace period</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Overdue Rent</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xl font-bold text-red-400">{formatINR(kpis.overdueRent)}</p>
          <span className="text-[10px] text-red-300/80">Action required immediately</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Vacancy Revenue Loss</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-bold text-slate-300">{formatINR(kpis.vacancyRevenueLoss)}</p>
          <span className="text-[10px] text-slate-500">Unleased stalls</span>
        </div>
      </div>

      {/* BULK REMINDER CENTER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-4 h-4 text-blue-400" />
            Bulk Payment Reminder Center
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select multiple pending or overdue shops below to dispatch bulk WhatsApp or Email reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePrepareBulkReminders('WHATSAPP')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Prepare WhatsApp ({selectedIds.length})
          </button>
          <button
            onClick={() => handlePrepareBulkReminders('EMAIL')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            Prepare Email ({selectedIds.length})
          </button>
        </div>
      </div>

      {bulkPreparedMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex justify-between items-center">
          <span>{bulkPreparedMsg}</span>
          <button onClick={() => setBulkPreparedMsg(null)} className="font-bold text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* PAYMENTS TABLE CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        {/* Table Filter Tabs */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex bg-slate-800 border border-slate-700 p-1 rounded-lg text-xs">
            {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setPaymentFilter(tab)}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  paymentFilter === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'All Payments' : tab}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredPayments.length} payment records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredPayments.length && filteredPayments.length > 0}
                    className="rounded bg-slate-800 border-slate-700"
                  />
                </th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Shop Name</th>
                <th className="p-3">Stall ID</th>
                <th className="p-3">Rent Period</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPayments.map(p => {
                const isSelected = selectedIds.includes(p.id);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(p.id)}
                        className="rounded bg-slate-800 border-slate-700"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-400">{p.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-white block">{p.shopName}</span>
                      <span className="text-[10px] text-slate-400">{p.ownerName}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-300">{p.stallId}</td>
                    <td className="p-3 text-slate-400">{p.rentPeriod}</td>
                    <td className="p-3 font-bold text-green-400">{formatINR(p.amount)}</td>
                    <td className="p-3 font-medium text-slate-300">{formatDate(p.dueDate)}</td>
                    <td className="p-3 text-slate-400">{p.method || 'N/A'}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          p.status === 'PAID'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : p.status === 'OVERDUE'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {p.status === 'PAID' ? (
                        <button
                          onClick={() => setShowReceipt(p)}
                          className="bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded border border-slate-700"
                        >
                          Receipt
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPaymentForModal(p);
                              setReminderType('WHATSAPP');
                            }}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2 py-1 rounded"
                          >
                            WhatsApp
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPaymentForModal(p);
                              setReminderType('EMAIL');
                            }}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold px-2 py-1 rounded"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => setShowRecordModalForStall(p.stallId)}
                            className="bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold px-2 py-1 rounded"
                          >
                            Pay
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showRecordModalForStall && (
        <RecordPaymentModal
          stallId={showRecordModalForStall}
          onClose={() => setShowRecordModalForStall(null)}
        />
      )}

      {selectedPaymentForModal && reminderType && (
        <ReminderModal
          payment={selectedPaymentForModal}
          type={reminderType}
          onClose={() => {
            setSelectedPaymentForModal(null);
            setReminderType(null);
          }}
        />
      )}

      {showReceipt && (
        <DigitalReceiptModal
          payment={showReceipt}
          onClose={() => setShowReceipt(null)}
        />
      )}
    </div>
  );
};
