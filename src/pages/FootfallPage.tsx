import React from 'react';
import { useApp } from '../context/AppContext';
import { Footprints, TrendingUp, Sparkles, Building, Flame } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const FootfallPage: React.FC = () => {
  const { footfallZones, stalls, setActiveTab } = useApp();

  const hourlyData = [
    { hour: '10 AM', visitors: 1200 },
    { hour: '12 PM', visitors: 2800 },
    { hour: '2 PM', visitors: 3500 },
    { hour: '4 PM', visitors: 5800 },
    { hour: '6 PM', visitors: 8900 },
    { hour: '8 PM', visitors: 7200 },
    { hour: '10 PM', visitors: 2100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Footprints className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              FOOTFALL ANALYTICS & ZONE HEATMAP
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Analyze visitor densities across mall zones, cross-reference high footfall with vacant stalls, and identify revenue activation opportunities.
          </p>
        </div>

        <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-lg">
          DEMO FOOTFALL DATA
        </span>
      </div>

      {/* FOOTFALL + VACANT SPACE OPPORTUNITY DETECTOR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            HIGH FOOTFALL + VACANT SPACE OPPORTUNITY DETECTOR
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-400 text-xs">ZONE A OPPORTUNITY</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">HIGH TRAFFIC</span>
            </div>
            <p className="text-xs text-slate-200">
              Zone A records <strong>12,500 visitors/day</strong> but currently has <strong>2 vacant stalls</strong>.
            </p>
            <p className="text-[11px] text-indigo-300 font-medium">
              💡 Potential opportunity for temporary food, accessories, or seasonal retail activation.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-400 text-xs">ZONE B OPPORTUNITY</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">MODERATE TRAFFIC</span>
            </div>
            <p className="text-xs text-slate-200">
              Zone B records <strong>8,200 visitors/day</strong> with <strong>6 available stalls</strong>.
            </p>
            <p className="text-[11px] text-emerald-300 font-medium">
              💡 Suitable for fast fashion pop-ups or lifestyle kiosks.
            </p>
          </div>
        </div>
      </div>

      {/* ZONE HEATMAP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {footfallZones.map(fz => {
          const vacantInZone = stalls.filter(s => s.zone === fz.zone && (s.status === 'AVAILABLE' || s.status === 'VACATED')).length;

          return (
            <div key={fz.zone} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-extrabold text-white text-sm">{fz.zone}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  fz.footfallDensity === 'VERY HIGH'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {fz.footfallDensity}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Daily Visitors</span>
                <p className="text-xl font-extrabold text-white mt-0.5">{fz.dailyVisitors.toLocaleString()} / day</p>
              </div>

              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak Hours:</span>
                  <span className="font-medium">{fz.peakHour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Occupancy Rate:</span>
                  <span className="font-bold text-blue-400">{fz.occupancyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vacant Stalls:</span>
                  <span className="font-bold text-amber-400">{vacantInZone} stalls</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* HOURLY FOOTFALL CHART */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          Hourly Visitor Density (Mall Average)
        </h3>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
