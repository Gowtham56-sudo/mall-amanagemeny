import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentRecord } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { X, Send, Mail, Copy, Check, MessageSquare } from 'lucide-react';

interface ReminderModalProps {
  payment: PaymentRecord;
  type: 'WHATSAPP' | 'EMAIL';
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  payment,
  type,
  onClose,
}) => {
  const { sendReminder } = useApp();
  const [copied, setCopied] = useState(false);

  const rawPhone = payment.ownerName ? '+919876543210' : '+919999999999';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const messageText = `Hello ${payment.ownerName || 'Valued Shop Owner'},

This is a payment reminder regarding your temporary retail space.

Mall: Mall Temporary Retail Intelligence
Shop: ${payment.shopName}
Stall: ${payment.stallId}
Rent Period: ${payment.rentPeriod}
Rent Amount: ${formatINR(payment.amount)}
Due Date: ${formatDate(payment.dueDate)}
Status: ${payment.status}

Kindly complete the pending payment at the earliest.

Regards,
Mall Management Team`;

  const emailSubject = `Rent Payment Reminder – ${payment.shopName} (${payment.stallId})`;
  const emailBody = `Dear ${payment.ownerName || 'Shop Owner'},

This is a reminder regarding the pending rent payment for your temporary retail space.

Shop: ${payment.shopName}
Stall: ${payment.stallId}
Rent Period: ${payment.rentPeriod}
Rent Amount: ${formatINR(payment.amount)}
Due Date: ${formatDate(payment.dueDate)}
Status: ${payment.status}

Kindly complete the payment at the earliest.

Regards,
Mall Management Team`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrigger = () => {
    sendReminder(payment.id, type);
    if (type === 'WHATSAPP') {
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(waUrl, '_blank');
    } else {
      const mailtoUrl = `mailto:demo.owner@example.com?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          {type === 'WHATSAPP' ? (
            <MessageSquare className="w-5 h-5 text-green-400" />
          ) : (
            <Mail className="w-5 h-5 text-blue-400" />
          )}
          <h3 className="text-lg font-bold text-white">
            {type === 'WHATSAPP' ? 'Prepare WhatsApp Reminder' : 'Prepare Email Reminder'}
          </h3>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 text-xs mb-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Recipient:</span>
            <span className="font-semibold text-white">{payment.ownerName} ({payment.shopName})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Stall ID:</span>
            <span className="font-mono text-blue-400">{payment.stallId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Rent Amount:</span>
            <span className="font-bold text-amber-400">{formatINR(payment.amount)}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Generated {type === 'WHATSAPP' ? 'WhatsApp Message' : 'Email Content'}
          </label>
          <textarea
            readOnly
            rows={8}
            value={type === 'WHATSAPP' ? messageText : `Subject: ${emailSubject}\n\n${emailBody}`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleCopy(type === 'WHATSAPP' ? messageText : emailBody)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleTrigger}
            className={`flex-1 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg ${
              type === 'WHATSAPP'
                ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
            }`}
          >
            <Send className="w-4 h-4" />
            {type === 'WHATSAPP' ? 'Open WhatsApp' : 'Open Email'}
          </button>
        </div>

        <p className="mt-3 text-[10px] text-slate-500 text-center">
          Simulated reminder action. Does not send automated messages in demo mode.
        </p>
      </div>
    </div>
  );
};
