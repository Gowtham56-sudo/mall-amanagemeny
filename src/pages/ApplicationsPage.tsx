import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VendorApplication, ZoneId, ShopCategory } from '../types';
import { FileText, Plus, CheckCircle, XCircle, Clock, Building, UserCheck } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    approveAndAssignApplication,
    addVendorApplication,
    stalls
  } = useApp();

  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [selectedAppForAssign, setSelectedAppForAssign] = useState<VendorApplication | null>(null);
  const [targetStallId, setTargetStallId] = useState<string>('');

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<ShopCategory>('Fashion');
  const [preferredSpace, setPreferredSpace] = useState<ZoneId | 'ANY'>('ZONE A');
  const [requiredAreaSqFt, setRequiredAreaSqFt] = useState(200);
  const [preferredDuration, setPreferredDuration] = useState('3 Months');
  const [expectedStartDate, setExpectedStartDate] = useState('2026-08-20');
  const [businessDescription, setBusinessDescription] = useState('');

  const vacantStalls = stalls.filter(s => s.status === 'AVAILABLE' || s.status === 'VACATED');

  const handleSubmitNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    addVendorApplication({
      applicantName,
      businessName,
      contact: contact || '+91 9876500112',
      email: email || `${applicantName.toLowerCase().replace(' ', '.')}@demovendor.com`,
      category,
      preferredSpace,
      requiredAreaSqFt,
      preferredDuration,
      expectedStartDate,
      businessDescription: businessDescription || 'Temporary pop-up retail vendor application.',
      documentStatus: 'COMPLETE',
    });
    setShowNewAppModal(false);
  };

  const handleConfirmAssign = () => {
    if (!selectedAppForAssign || !targetStallId) {
      alert('Please select a target stall.');
      return;
    }
    approveAndAssignApplication(selectedAppForAssign.id, targetStallId);
    setSelectedAppForAssign(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              TEMPORARY SPACE VENDOR APPLICATIONS
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Review incoming vendor placement requests, evaluate document compliance, and assign vacant stalls.
          </p>
        </div>

        <button
          onClick={() => setShowNewAppModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Submit Vendor Application
        </button>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map(app => (
          <div
            key={app.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative"
          >
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">{app.id}</span>
                <h3 className="font-extrabold text-white text-base mt-0.5">{app.businessName}</h3>
                <p className="text-xs text-slate-400">{app.applicantName} • {app.contact}</p>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  app.status === 'APPROVED'
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : app.status === 'REJECTED'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Category</span>
                <span className="font-medium">{app.category}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Preferred Space</span>
                <span className="font-medium text-blue-300">{app.preferredSpace} ({app.requiredAreaSqFt} sq.ft)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Duration & Start</span>
                <span className="font-medium">{app.preferredDuration} (Starts {app.expectedStartDate})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Document Status</span>
                <span className="font-semibold text-emerald-400">{app.documentStatus}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-800 italic">
              "{app.businessDescription}"
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              {app.status !== 'APPROVED' && app.status !== 'REJECTED' && (
                <>
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'APPROVED')}
                    className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppForAssign(app);
                      if (vacantStalls.length > 0) setTargetStallId(vacantStalls[0].id);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Approve & Assign Stall
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'REJECTED')}
                    className="px-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Submit Application */}
      {showNewAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Submit Vendor Space Application</h3>

            <form onSubmit={handleSubmitNewApp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Applicant Full Name</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Business / Brand Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g. Crafty Leather Pop-up"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Business Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Home">Home</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Preferred Zone</label>
                  <select
                    value={preferredSpace}
                    onChange={e => setPreferredSpace(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="ZONE A">Zone A</option>
                    <option value="ZONE B">Zone B</option>
                    <option value="ZONE C">Zone C</option>
                    <option value="ZONE D">Zone D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Required Area (sq.ft)</label>
                  <input
                    type="number"
                    value={requiredAreaSqFt}
                    onChange={e => setRequiredAreaSqFt(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Business Description</label>
                <textarea
                  value={businessDescription}
                  onChange={e => setBusinessDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAppModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Approve & Assign Stall */}
      {selectedAppForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Assign Stall to {selectedAppForAssign.businessName}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select an available vacant stall to allocate to this approved vendor.
            </p>

            <div className="space-y-3 text-xs mb-4">
              <label className="block text-slate-300 font-semibold">Available Vacant Stalls:</label>
              <select
                value={targetStallId}
                onChange={e => setTargetStallId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              >
                {vacantStalls.map(s => (
                  <option key={s.id} value={s.id}>
                    Stall {s.id} ({s.zone} • {s.sizeSqFt} sq.ft)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedAppForAssign(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg shadow-lg shadow-green-500/20"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
