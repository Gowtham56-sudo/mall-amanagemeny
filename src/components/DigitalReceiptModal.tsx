import React from 'react';
import { PaymentRecord } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { X, Printer, Download, Building2, CheckCircle } from 'lucide-react';

interface DigitalReceiptModalProps {
  payment: PaymentRecord;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  payment,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = `
MALL TEMPORARY RETAIL INTELLIGENCE - DEMO PAYMENT RECEIPT
============================================================
Receipt No: ${payment.id}
Transaction ID: ${payment.txnId || 'N/A'}
Date: ${formatDate(payment.paymentDate || payment.dueDate)}

Shop Name: ${payment.shopName}
Owner Name: ${payment.ownerName}
Stall ID: ${payment.stallId}
Rent Period: ${payment.rentPeriod}
Amount Paid: ${formatINR(payment.amount)}
Payment Method: ${payment.method || 'N/A'}
Status: ${payment.status}

Independent Demonstration Prototype
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${payment.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Area */}
        <div id="printable-receipt" className="bg-white text-slate-900 p-6 rounded-xl shadow-inner border border-slate-200">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900 uppercase tracking-tight">
                  MALL TEMPORARY RETAIL
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Demo Payment Receipt
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 text-green-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-green-300">
                DEMO RECEIPT
              </span>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                No: {payment.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div>
              <span className="text-slate-400 block text-[10px]">SHOP NAME</span>
              <span className="font-bold text-slate-800">{payment.shopName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">OWNER NAME</span>
              <span className="font-semibold text-slate-700">{payment.ownerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">STALL ID</span>
              <span className="font-mono font-bold text-blue-600">{payment.stallId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">RENT PERIOD</span>
              <span className="font-medium text-slate-700">{payment.rentPeriod}</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-3 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Date:</span>
              <span className="font-medium">{formatDate(payment.paymentDate || payment.dueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Transaction ID:</span>
              <span className="font-mono text-slate-800">{payment.txnId || 'DEMO-TXN-SIMULATED'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Method:</span>
              <span className="font-medium">{payment.method || 'UPI / Bank'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
              <span>Amount Received:</span>
              <span className="text-green-700 font-extrabold">{formatINR(payment.amount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-green-50 text-green-800 text-[11px] p-2 rounded border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>Status: <strong>PAID & VERIFIED (DEMO)</strong></span>
          </div>

          <p className="text-[9px] text-slate-400 text-center mt-4 border-t border-slate-100 pt-2">
            This is a simulated digital receipt generated for demonstration purposes only.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            Download TXT
          </button>
        </div>
      </div>
    </div>
  );
};
