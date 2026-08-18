import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 py-6 px-4 sm:px-6 text-xs mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-bold text-zinc-200 tracking-tight text-xs uppercase">
            MALL TEMPORARY RETAIL INTELLIGENCE & REVENUE MANAGEMENT PLATFORM
          </p>
          <p className="mt-1 text-zinc-500 max-w-2xl text-[11px]">
            This application is an independent demonstration prototype and is not officially affiliated with Reliance Retail or Reliance Malls.
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-1">
          <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-[11px] font-mono text-amber-300">
            DEMO PROTOTYPE – Independent Concept
          </span>
          <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
            Fictional Data Only • Simulated Integrations
          </span>
        </div>
      </div>
    </footer>
  );
};
