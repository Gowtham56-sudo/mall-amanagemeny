import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Building2, Key, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@demo.mall');
  const [password, setPassword] = useState('demo1234');
  const [selectedRole, setSelectedRole] = useState<Role>('Mall Administrator');

  const demoAccounts = [
    { email: 'admin@demo.mall', role: 'Mall Administrator' as Role, label: 'Mall Administrator' },
    { email: 'manager@demo.mall', role: 'Mall Manager' as Role, label: 'Mall Manager' },
    { email: 'finance@demo.mall', role: 'Finance Manager' as Role, label: 'Finance Manager' },
    { email: 'operations@demo.mall', role: 'Operations Manager' as Role, label: 'Operations Manager' },
    { email: 'vendor@demo.mall', role: 'Vendor / Shop Owner' as Role, label: 'Vendor / Shop Owner' },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setSelectedRole(acc.role);
    login(acc.email, acc.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 text-white relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/30 border border-blue-400/20">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-white uppercase">
            MALL RETAIL INTELLIGENCE
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Smart Space, Vendor, Rent & Revenue Management Platform
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-[11px] font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>DEMO MODE – Independent Prototype</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              User Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as Role)}
              className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Mall Administrator">Mall Administrator</option>
              <option value="Mall Manager">Mall Manager</option>
              <option value="Leasing Manager">Leasing Manager</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Operations Manager">Operations Manager</option>
              <option value="Maintenance Staff">Maintenance Staff</option>
              <option value="Inspector">Inspector</option>
              <option value="Vendor / Shop Owner">Vendor / Shop Owner</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/25"
            >
              Login
            </button>
          </div>
        </form>

        {/* Quick Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-zinc-800">
          <p className="text-xs font-bold text-zinc-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Quick Demo Accounts (Click to Login)
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {demoAccounts.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className="w-full text-left px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/80 text-xs flex items-center justify-between transition-colors border border-zinc-700/50"
              >
                <span className="font-mono text-zinc-300">{acc.email}</span>
                <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {acc.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[11px] text-zinc-500 text-center font-mono uppercase">
          Independent demonstration prototype. Do not use real credentials.
        </p>
      </div>
    </div>
  );
};
