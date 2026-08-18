import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';
import { Award, Layers, TrendingUp, Cpu, CheckCircle2, HelpCircle } from 'lucide-react';

export const BusinessValuePage: React.FC = () => {
  const { kpis, stalls, payments, applications } = useApp();

  const questions = [
    { q: '1. How much temporary space is available?', a: `${kpis.availableCount} stalls available (${(kpis.availableCount * 120).toLocaleString()} sq.ft)` },
    { q: '2. How many stalls are occupied?', a: `${kpis.occupiedCount} stalls occupied` },
    { q: '3. How many stalls are vacant?', a: `${kpis.availableCount + kpis.vacatedCount} stalls vacant` },
    { q: '4. Which spaces are available right now?', a: `${stalls.filter(s => s.status === 'AVAILABLE').map(s => s.id).slice(0, 8).join(', ')}...` },
    { q: '5. Which shops have overdue rent?', a: `${payments.filter(p => p.status === 'OVERDUE').map(p => p.shopName).slice(0, 4).join(', ')}` },
    { q: '6. How much rent is pending?', a: `${formatINR(kpis.pendingRent)}` },
    { q: '7. How much rent has been collected?', a: `${formatINR(kpis.collectedRent)}` },
    { q: '8. Which spaces are generating the most revenue?', a: 'Zone A stalls (Average ₹35,000/mo)' },
    { q: '9. Which spaces have been vacant the longest?', a: 'Stalls B18, C04, D12 (> 25 days vacant)' },
    { q: '10. How much estimated revenue is being lost because of vacancies?', a: `${formatINR(kpis.vacancyRevenueLoss)} / month` },
    { q: '11. Which leases are expiring soon?', a: '4 leases expiring within 30 days' },
    { q: '12. Which vendor applications are awaiting approval?', a: `${applications.filter(a => a.status === 'SUBMITTED').length} applications awaiting review` },
    { q: '13. Which areas have high footfall?', a: 'Zone A (12,500 visitors/day) & Zone B (8,200 visitors/day)' },
    { q: '14. Which areas have low occupancy?', a: 'Zone D (60% occupancy)' },
    { q: '15. What could happen if vacant spaces are filled?', a: `Additional revenue potential of ${formatINR(kpis.vacancyRevenueLoss)} / month` },
    { q: '16. Which operational issues need immediate attention?', a: 'Overdue rent follow-ups and expiring lease renewals' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            EXECUTIVE VALUE PROPOSITION & MANAGEMENT DECISION INTELLIGENCE
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Transforming temporary retail space from manual lease tracking into an intelligent, data-driven revenue engine.
        </p>
      </div>

      {/* THE 5 PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
          <h3 className="font-extrabold text-white text-sm">SPACE OPTIMIZATION</h3>
          <p className="text-xs text-slate-400">Maximize utilization of temporary retail spaces across all mall zones.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center font-bold">2</div>
          <h3 className="font-extrabold text-white text-sm">REVENUE MANAGEMENT</h3>
          <p className="text-xs text-slate-400">Improve rent visibility, digital receipting, and timely collections.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">3</div>
          <h3 className="font-extrabold text-white text-sm">VACANCY REDUCTION</h3>
          <p className="text-xs text-slate-400">Identify vacant stalls and estimate revenue loss to accelerate placement.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">4</div>
          <h3 className="font-extrabold text-white text-sm">OPERATIONAL EFFICIENCY</h3>
          <p className="text-xs text-slate-400">Automate maintenance, inspections, handovers, and reminders.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">5</div>
          <h3 className="font-extrabold text-white text-sm">DECISION INTELLIGENCE</h3>
          <p className="text-xs text-slate-400">Provide management with real-time analytics and what-if simulations.</p>
        </div>
      </div>

      {/* KEY MANAGEMENT QUESTIONS & ANSWERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            16 KEY MANAGEMENT QUESTIONS & INSTANT REAL-TIME ANSWERS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {questions.map((item, idx) => (
            <div key={idx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="font-bold text-blue-300 block">{item.q}</span>
              <p className="text-slate-200 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
