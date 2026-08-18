import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import { X, CreditCard, CheckCircle2 } from 'lucide-react';

interface RecordPaymentModalProps {
  stallId: string;
  onClose: () => void;
  onPaymentSuccess?: (txnId: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  stallId,
  onClose,
  onPaymentSuccess,
}) => {
  const { stalls, recordPayment } = useApp();
  const stall = stalls.find(s => s.id === stallId);

  const [amount, setAmount] = useState<number>(stall?.monthlyRent || 25000);
  const [method, setMethod] = useState<'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'Other'>('UPI');
  const [rentPeriod, setRentPeriod] = useState<string>('August 2026');
  const [txnSuccessId, setTxnSuccessId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTxnId = recordPayment({
      stallId,
      amount,
      method,
      rentPeriod,
    });
    setTxnSuccessId(newTxnId);
    if (onPaymentSuccess) {
      onPaymentSuccess(newTxnId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {txnSuccessId ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Demo Payment Recorded!</h3>
            <p className="text-xs text-slate-400 mb-3">
              Payment was recorded successfully in demo environment.
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-left text-xs mb-4 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-blue-400 font-bold">{txnSuccessId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stall ID:</span>
                <span className="font-semibold text-white">{stallId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-green-400">{formatINR(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="text-slate-300">{method}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Record Demo Rent Payment</h3>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Stall:</span>
                <span className="font-bold text-white">{stallId} ({stall?.zone})</span>
              </div>
              {stall?.shopName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Shop Name:</span>
                  <span className="text-slate-200">{stall.shopName}</span>
                </div>
              )}
              {stall?.ownerName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner:</span>
                  <span className="text-slate-200">{stall.ownerName}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Rent Period
              </label>
              <input
                type="text"
                value={rentPeriod}
                onChange={e => setRentPeriod(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                <option value="Cash">Cash Collection</option>
                <option value="Other">Other Mode</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-lg text-xs shadow-lg shadow-green-500/20"
              >
                Record Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
