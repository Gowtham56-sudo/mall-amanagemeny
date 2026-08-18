import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatLakhs } from '../utils/formatters';
import { Calculator, Sparkles, TrendingUp, Cpu, Sliders, AlertCircle } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const { kpis, stalls } = useApp();

  // Simulator Sliders
  const [stallsToFill, setStallsToFill] = useState<number>(5);
  const [avgRentInput, setAvgRentInput] = useState<number>(35000);
  const [rentIncreasePct, setRentIncreasePct] = useState<number>(5);
  const [targetOccupancyPct, setTargetOccupancyPct] = useState<number>(92);

  // Calculations
  const additionalFromNewStalls = stallsToFill * avgRentInput;
  const currentBase = kpis.collectedRent;
  const rentIncreaseMultiplier = 1 + rentIncreasePct / 100;

  const projectedMonthlyRevenue = Math.round((currentBase + additionalFromNewStalls) * rentIncreaseMultiplier);
  const projectedAnnualRevenue = projectedMonthlyRevenue * 12;

  // AI Recommendations logic for sample vacant stall
  const vacantStalls = stalls.filter(s => s.status === 'VACATED' || s.status === 'AVAILABLE');
  const sampleVacant = vacantStalls[0] || stalls[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              REVENUE SCENARIO SIMULATOR & AI FORECAST
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Simulate revenue variations based on vacancy conversion, pricing adjustments, and AI space recommendations.
          </p>
        </div>

        <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-400" />
          AI DEMO ESTIMATE
        </span>
      </div>

      {/* WHAT-IF REVENUE SIMULATOR SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            WHAT-IF REVENUE SIMULATOR
          </h3>
          <span className="text-xs text-slate-400 font-medium">Dynamic Business Logic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls Sliders */}
          <div className="space-y-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Fill Vacant Stalls</span>
                <span className="font-bold text-blue-400">{stallsToFill} stalls</span>
              </div>
              <input
                type="range"
                min={0}
                max={kpis.availableCount + kpis.vacatedCount}
                value={stallsToFill}
                onChange={e => setStallsToFill(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <span className="text-[10px] text-slate-400">
                Max available to fill: {kpis.availableCount + kpis.vacatedCount} stalls
              </span>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Average Monthly Rent / Stall</span>
                <span className="font-bold text-green-400">{formatINR(avgRentInput)}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={60000}
                step={1000}
                value={avgRentInput}
                onChange={e => setAvgRentInput(Number(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-200 mb-1">
                <span>Rent Increase / Escalation %</span>
                <span className="font-bold text-amber-400">+{rentIncreasePct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={1}
                value={rentIncreasePct}
                onChange={e => setRentIncreasePct(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Results Output Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-xl border border-indigo-500/30 flex flex-col justify-between text-xs space-y-3">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                Simulated Projection Output
              </span>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Current Collected Monthly Rent:</span>
                  <span className="font-semibold text-white">{formatINR(currentBase)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Additional Estimated Rent (+{stallsToFill} stalls):</span>
                  <span className="font-bold text-emerald-400">+{formatINR(additionalFromNewStalls)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Rent Escalation Impact (+{rentIncreasePct}%):</span>
                  <span className="font-bold text-amber-400">
                    +{formatINR(Math.round((currentBase + additionalFromNewStalls) * (rentIncreasePct / 100)))}
                  </span>
                </div>

                <div className="border-t border-slate-700/80 pt-3 flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Projected Monthly Revenue:</span>
                  <span className="font-black text-xl text-green-400">{formatINR(projectedMonthlyRevenue)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Projected Annual Revenue:</span>
                  <span className="font-bold text-blue-300">{formatINR(projectedAnnualRevenue)}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic border-t border-slate-800 pt-2">
              * Simulation model based on active shop rents and configurable parameter inputs.
            </p>
          </div>
        </div>
      </div>

      {/* AI SPACE RECOMMENDATION ENGINE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">AI SPACE RECOMMENDATION ENGINE</h3>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
            DEMO AI ENGINE
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-xs space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-xs font-bold text-amber-400">Sample Vacant Target: Stall {sampleVacant.id}</span>
              <p className="text-slate-300 mt-0.5">{sampleVacant.zone} • {sampleVacant.sizeSqFt} sq.ft • Rent: {formatINR(sampleVacant.monthlyRent)}</p>
            </div>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
              Vacant {sampleVacant.daysVacant || 14} days
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Category Placement Recommendations:
            </span>
            <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
              <li><strong>Food & Beverage / Artisan Snacks:</strong> High footfall synergy in {sampleVacant.zone} during 4 PM - 8 PM peak.</li>
              <li><strong>Fashion Accessories & Jewelry:</strong> Matches historical 90%+ occupancy rates for nearby stalls.</li>
              <li><strong>Seasonal / Festive Merchandise:</strong> Suitable for short-term 30-day lease activation.</li>
            </ul>
          </div>

          <p className="text-[10px] text-slate-400 italic">
            * Recommendation is based on DEMO historical data. Do not present AI output as guaranteed business advice.
          </p>
        </div>
      </div>
    </div>
  );
};
