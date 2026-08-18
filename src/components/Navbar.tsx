import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  Building2,
  ShieldAlert,
  Search,
  User,
  LogOut,
  Bell,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    userEmail,
    logout,
    searchQuery,
    setSearchQuery,
    applications,
    payments,
    maintenance
  } = useApp();

  const roles: Role[] = [
    'Mall Administrator',
    'Mall Manager',
    'Leasing Manager',
    'Finance Manager',
    'Operations Manager',
    'Maintenance Staff',
    'Inspector',
    'Vendor / Shop Owner'
  ];

  // Action count for alerts
  const overdueCount = payments.filter(p => p.status === 'OVERDUE').length;
  const pendingApps = applications.filter(a => a.status === 'SUBMITTED').length;
  const pendingMaint = maintenance.filter(m => m.status === 'REPORTED').length;
  const totalAlerts = overdueCount + pendingApps + pendingMaint;

  return (
    <header className="bg-zinc-900/90 border-b border-zinc-800/80 text-zinc-100 sticky top-0 z-30 shadow-md backdrop-blur-md">
      {/* Top Banner Disclaimer */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DEMO PROTOTYPE – Independent Concept:</strong> Fictional demo data only. Not connected to real payment, government, or external messaging servers.
          </span>
        </div>
        <span className="hidden md:inline-block font-mono text-[11px] bg-amber-400/20 px-2 py-0.5 rounded text-amber-200">
          DEMO MODE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base leading-tight tracking-tight text-white">
                MALL RETAIL INTELLIGENCE
              </h1>
              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                BENTO OS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
              Smart Space, Vendor, Rent & Revenue Management Platform
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md min-w-[220px]">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shop, owner, stall (e.g. A01), lease, transaction..."
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Role Switcher & User Control */}
        <div className="flex items-center gap-3">
          {/* Notifications badge */}
          <div className="relative">
            <button className="p-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 rounded-xl text-zinc-300 transition-colors relative">
              <Bell className="w-4 h-4" />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalAlerts}
                </span>
              )}
            </button>
          </div>

          {/* Role selector dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 px-3 py-1.5 rounded-xl text-xs cursor-pointer">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <div className="text-left">
                <span className="text-[10px] text-zinc-400 block -mb-0.5 uppercase tracking-wider">Switch Role</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  {currentRole}
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </span>
              </div>
            </div>

            <div className="absolute right-0 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-1 z-50 hidden group-hover:block transition-all">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-800 tracking-wider">
                Demo Role Switcher
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800/80 transition-colors flex items-center justify-between ${
                    currentRole === r ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-zinc-300'
                  }`}
                >
                  <span>{r}</span>
                  {currentRole === r && <Sparkles className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* User Logout */}
          <button
            onClick={logout}
            className="p-2 bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 rounded-xl border border-zinc-700/60 transition-colors"
            title="Logout or Change Credentials"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
