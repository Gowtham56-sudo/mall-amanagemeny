import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ZoneId, StallStatus } from '../types';
import { formatINR } from '../utils/formatters';
import { Grid3X3, Filter, Building, Tag, Search } from 'lucide-react';
import { StallDetailDrawer } from '../components/StallDetailDrawer';

export const SpaceMapPage: React.FC = () => {
  const { stalls, searchQuery, setSelectedStallId, selectedStallId } = useApp();

  const [selectedZone, setSelectedZone] = useState<ZoneId | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StallStatus | 'ALL'>('ALL');

  const statusColorMap: Record<StallStatus, { bg: string; border: string; text: string; label: string }> = {
    OCCUPIED: { bg: 'bg-blue-600/80 hover:bg-blue-500', border: 'border-blue-400', text: 'text-white', label: 'Occupied' },
    AVAILABLE: { bg: 'bg-emerald-600/80 hover:bg-emerald-500', border: 'border-emerald-400', text: 'text-white', label: 'Available' },
    VACATED: { bg: 'bg-slate-600/80 hover:bg-slate-500', border: 'border-slate-400', text: 'text-slate-200', label: 'Vacated' },
    RESERVED: { bg: 'bg-amber-500/80 hover:bg-amber-400', border: 'border-amber-300', text: 'text-slate-900', label: 'Reserved' },
    MAINTENANCE: { bg: 'bg-slate-800 hover:bg-slate-700', border: 'border-slate-600', text: 'text-slate-300', label: 'Maintenance' },
    'RENT OVERDUE': { bg: 'bg-red-600/90 hover:bg-red-500', border: 'border-red-400', text: 'text-white font-bold animate-pulse', label: 'Rent Overdue' },
  };

  const filteredStalls = useMemo(() => {
    return stalls.filter(s => {
      const matchesZone = selectedZone === 'ALL' || s.zone === selectedZone;
      const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
      const matchesSearch =
        !searchQuery ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.shopName && s.shopName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.ownerName && s.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.zone.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesZone && matchesStatus && matchesSearch;
    });
  }, [stalls, selectedZone, selectedStatus, searchQuery]);

  const zones: ZoneId[] = ['ZONE A', 'ZONE B', 'ZONE C', 'ZONE D'];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Grid3X3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight uppercase">
              INTERACTIVE MALL FLOOR / SPACE MAP
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Click any stall block to view owner details, record payments, manage leases, or toggle status.
          </p>
        </div>

        {/* Zone & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zone Selector */}
          <div className="flex bg-zinc-800/80 border border-zinc-700/60 p-1 rounded-2xl text-xs">
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                selectedZone === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Zones
            </button>
            {zones.map(z => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                  selectedZone === z ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as any)}
            className="bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OCCUPIED">Occupied (Blue)</option>
            <option value="AVAILABLE">Available (Green)</option>
            <option value="VACATED">Vacated (Gray)</option>
            <option value="RESERVED">Reserved (Yellow)</option>
            <option value="RENT OVERDUE">Rent Overdue (Red)</option>
            <option value="MAINTENANCE">Maintenance (Dark Gray)</option>
          </select>
        </div>
      </div>

      {/* COLOR LEGEND */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-extrabold text-zinc-500 uppercase text-[10px] tracking-widest">
          Color Legend:
        </span>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600 border border-blue-400 inline-block"></span>
            <span className="text-zinc-300 font-mono text-[11px]">BLUE = OCCUPIED</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-400 inline-block"></span>
            <span className="text-zinc-300 font-mono text-[11px]">GREEN = AVAILABLE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-zinc-600 border border-zinc-400 inline-block"></span>
            <span className="text-zinc-300 font-mono text-[11px]">GRAY = VACATED</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-300 inline-block"></span>
            <span className="text-zinc-300 font-mono text-[11px]">YELLOW = RESERVED</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-600 border border-red-400 inline-block animate-pulse"></span>
            <span className="text-zinc-300 font-mono text-[11px]">RED = RENT OVERDUE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-zinc-800 border border-zinc-600 inline-block"></span>
            <span className="text-zinc-300 font-mono text-[11px]">DARK = MAINTENANCE</span>
          </span>
        </div>
      </div>

      {/* MAP ZONES GRID */}
      <div className="space-y-6">
        {zones
          .filter(z => selectedZone === 'ALL' || selectedZone === z)
          .map(zone => {
            const zoneStalls = filteredStalls.filter(s => s.zone === zone);
            if (zoneStalls.length === 0) return null;

            return (
              <div key={zone} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2">
                  <h3 className="font-extrabold text-white text-xs tracking-wider uppercase flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    {zone} TEMPORARY STALLS
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">
                    {zoneStalls.length} stalls
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
                  {zoneStalls.map(stall => {
                    const style = statusColorMap[stall.status];
                    return (
                      <button
                        key={stall.id}
                        onClick={() => setSelectedStallId(stall.id)}
                        className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 transform hover:scale-105 shadow-sm min-h-[72px] relative group ${style.bg} ${style.border} ${style.text}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-xs font-black">{stall.id}</span>
                          <span className="text-[9px] opacity-80 font-mono">{stall.sizeSqFt} sq.ft</span>
                        </div>

                        <div className="mt-1">
                          {stall.shopName ? (
                            <p className="text-[10px] font-semibold truncate leading-tight">
                              {stall.shopName.replace(/\s*\([^)]*\)/, '')}
                            </p>
                          ) : (
                            <p className="text-[10px] italic opacity-75">{style.label}</p>
                          )}
                          <p className="text-[9px] opacity-90 font-mono mt-0.5">
                            {formatINR(stall.monthlyRent)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Side Panel Drawer when stall is selected */}
      {selectedStallId && (
        <StallDetailDrawer
          stallId={selectedStallId}
          onClose={() => setSelectedStallId(null)}
        />
      )}
    </div>
  );
};
