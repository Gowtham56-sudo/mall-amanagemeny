import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatINR, formatLakhs } from '../utils/formatters';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileText,
  CreditCard,
  Wrench,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    kpis,
    stalls,
    payments,
    applications,
    maintenance,
    leases,
    setActiveTab,
    setSelectedStallId,
    setAlertFilter
  } = useApp();

  const overdueShopsCount = payments.filter(p => p.status === 'OVERDUE').length;
  const expiringLeasesCount = leases.filter(l => l.daysUntilExpiry <= 30).length;
  const longVacantCount = stalls.filter(s => (s.status === 'VACATED' || s.status === 'AVAILABLE') && (s.daysVacant || 0) >= 15).length;
  const pendingAppsCount = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER REVIEW').length;
  const openMaintCount = maintenance.filter(m => m.status !== 'RESOLVED' && m.status !== 'CLOSED').length;
  const pendingRemindersCount = payments.filter(p => (p.status === 'PENDING' || p.status === 'OVERDUE') && p.reminderStatus === 'NOT_SENT').length;

  // Category revenue aggregation for chart
  const categoryData = React.useMemo(() => {
    const cats: Record<string, { rent: number; count: number }> = {};
    stalls.forEach(s => {
      if (s.category && (s.status === 'OCCUPIED' || s.status === 'RENT OVERDUE')) {
        if (!cats[s.category]) cats[s.category] = { rent: 0, count: 0 };
        cats[s.category].rent += s.monthlyRent;
        cats[s.category].count += 1;
      }
    });
    return Object.keys(cats).map(key => ({
      name: key,
      rent: cats[key].rent,
      count: cats[key].count,
    })).sort((a, b) => b.rent - a.rent).slice(0, 6);
  }, [stalls]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const paymentStatusData = React.useMemo(() => {
    const statusCounts: Record<string, number> = { PAID: 0, PENDING: 0, OVERDUE: 0, 'DUE SOON': 0 };
    payments.forEach(p => {
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status]++;
      }
    });
    return [
      { name: 'Paid', value: statusCounts['PAID'], fill: '#10b981' },
      { name: 'Pending', value: statusCounts['PENDING'], fill: '#f59e0b' },
      { name: 'Overdue', value: statusCounts['OVERDUE'], fill: '#ef4444' },
      { name: 'Due Soon', value: statusCounts['DUE SOON'], fill: '#3b82f6' },
    ].filter(item => item.value > 0);
  }, [payments]);

  // Mock revenue trend data for the last 6 months
  const revenueTrendData = [
    { name: 'Mar', expected: 1200000, collected: 1150000 },
    { name: 'Apr', expected: 1250000, collected: 1200000 },
    { name: 'May', expected: 1300000, collected: 1280000 },
    { name: 'Jun', expected: 1350000, collected: 1300000 },
    { name: 'Jul', expected: 1400000, collected: 1350000 },
    { name: 'Aug', expected: kpis.expectedRent, collected: kpis.collectedRent },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Executive Welcome Banner - Bento Hero */}
      <motion.div variants={itemVariants} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                MALL EXECUTIVE OVERVIEW
              </span>
              <span className="text-xs font-mono text-zinc-500">August 2026</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Mall Temporary Retail Intelligence
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
              Real-time space occupancy, rent collections, vacancy revenue recovery, and lease operations portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all border border-blue-400/20"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              Launch Revenue Simulator
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI CARDS BENTO GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
        {/* Total Mall Area */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Mall Area</span>
          <p className="text-lg font-extrabold text-white mt-1">
            {kpis.totalMallAreaSqFt.toLocaleString()} <span className="text-xs font-normal text-zinc-500">sq.ft</span>
          </p>
          <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Full footprint</span>
        </motion.div>

        {/* Temporary Retail Area */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Temp Retail Area</span>
          <p className="text-lg font-extrabold text-blue-400 mt-1">
            {kpis.tempRetailAreaSqFt.toLocaleString()} <span className="text-xs font-normal text-zinc-500">sq.ft</span>
          </p>
          <span className="text-[10px] text-blue-400/80 font-mono block mt-1">{kpis.spaceUtilizationPct}% utilized</span>
        </motion.div>

        {/* Total Stalls */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Stalls</span>
          <p className="text-lg font-extrabold text-white mt-1">{kpis.totalStalls}</p>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1">4 Zones (A-D)</span>
        </motion.div>

        {/* Occupied */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Occupied</span>
          <p className="text-lg font-extrabold text-blue-400 mt-1">{kpis.occupiedCount}</p>
          <span className="text-[10px] text-blue-400/80 font-mono block mt-1">{Math.round((kpis.occupiedCount/kpis.totalStalls)*100)}% occupancy</span>
        </motion.div>

        {/* Available */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Available</span>
          <p className="text-lg font-extrabold text-emerald-400 mt-1">{kpis.availableCount}</p>
          <span className="text-[10px] text-emerald-400/80 font-mono block mt-1">Ready to lease</span>
        </motion.div>

        {/* Vacated */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Vacated</span>
          <p className="text-lg font-extrabold text-zinc-300 mt-1">{kpis.vacatedCount}</p>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1">Turnover pending</span>
        </motion.div>

        {/* Monthly Expected Rent */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Expected Rent</span>
          <p className="text-lg font-extrabold text-white mt-1">{formatINR(kpis.expectedRent)}</p>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1">Contractual total</span>
        </motion.div>

        {/* Rent Collected */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Rent Collected</span>
          <p className="text-lg font-extrabold text-emerald-400 mt-1">{formatINR(kpis.collectedRent)}</p>
          <span className="text-[10px] text-emerald-400/80 font-mono block mt-1">
            {Math.round((kpis.collectedRent / kpis.expectedRent) * 100)}% efficiency
          </span>
        </motion.div>

        {/* Pending Rent */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Pending Rent</span>
          <p className="text-lg font-extrabold text-amber-400 mt-1">{formatINR(kpis.pendingRent)}</p>
          <span className="text-[10px] text-amber-400/80 font-mono block mt-1">In grace period</span>
        </motion.div>

        {/* Overdue Rent */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Overdue Rent</span>
          <p className="text-lg font-extrabold text-red-400 mt-1">{formatINR(kpis.overdueRent)}</p>
          <span className="text-[10px] text-red-400/80 font-mono block mt-1">Requires reminder</span>
        </motion.div>

        {/* Vacancy Revenue Loss */}
        <motion.div variants={itemVariants} className="bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 rounded-3xl p-4 transition-all col-span-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
            Vacancy Revenue Loss
          </span>
          <p className="text-lg font-extrabold text-red-400 mt-1">
            {formatINR(kpis.vacancyRevenueLoss)} <span className="text-xs text-zinc-500 font-normal">/ month</span>
          </p>
          <span className="text-[10px] text-zinc-500 font-mono block mt-1">
            {kpis.availableCount + kpis.vacatedCount} unutilized stalls
          </span>
        </motion.div>
      </div>

      {/* EXECUTIVE ACTION CENTER - BENTO BOX */}
      <motion.div variants={itemVariants} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-extrabold text-white tracking-widest uppercase">
              ACTION REQUIRED CENTER
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Click tile to execute</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Overdue card */}
          <motion.div
            variants={itemVariants}
            onClick={() => {
              setActiveTab('revenue');
            }}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-red-500/20 hover:border-red-500/50 rounded-2xl p-4 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-red-400 group-hover:text-red-300">
                Overdue Payments
              </span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-xs font-extrabold border border-red-500/30">
                {overdueShopsCount}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {overdueShopsCount} shops have overdue rent ({formatINR(kpis.overdueRent)})
            </p>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-3 group-hover:underline">
              Send Reminders <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Lease expiring */}
          <motion.div
            variants={itemVariants}
            onClick={() => {
              setActiveTab('leases');
            }}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                Leases Expiring Soon
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs font-extrabold border border-amber-500/30">
                {expiringLeasesCount}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {expiringLeasesCount} leases expire within 30 days
            </p>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-3 group-hover:underline">
              Renew Leases <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Long Vacant */}
          <motion.div
            variants={itemVariants}
            onClick={() => {
              setActiveTab('vacant');
            }}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-zinc-300 group-hover:text-white">
                Long Vacancy Duration
              </span>
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full text-xs font-extrabold border border-zinc-700">
                {longVacantCount}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {longVacantCount} stalls vacant for &gt; 15 days
            </p>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-3 group-hover:underline">
              Assign Vendors <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Applications awaiting */}
          <motion.div
            variants={itemVariants}
            onClick={() => {
              setActiveTab('applications');
            }}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-blue-500/20 hover:border-blue-500/50 rounded-2xl p-4 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
                Pending Applications
              </span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-extrabold border border-blue-500/30">
                {pendingAppsCount}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {pendingAppsCount} vendor applications awaiting review
            </p>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-3 group-hover:underline">
              Review & Approve <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Reminders needed */}
          <motion.div
            variants={itemVariants}
            onClick={() => {
              setActiveTab('revenue');
            }}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-4 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                Payment Reminders
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-extrabold border border-emerald-500/30">
                {pendingRemindersCount}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {pendingRemindersCount} payment reminders ready to send
            </p>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-3 group-hover:underline">
              Send Reminders <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>

          {/* Maintenance */}
          <motion.div
            variants={itemVariants}
            onClick={() => {
              setActiveTab('operations');
            }}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl p-4 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-orange-400 group-hover:text-orange-300">
                Maintenance Required
              </span>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-xs font-extrabold border border-orange-500/30">
                {openMaintCount}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 font-medium">
              {openMaintCount} stalls require maintenance
            </p>
            <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1 mt-3 group-hover:underline">
              Manage Tickets <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* REVENUE OPPORTUNITY SECTION - BENTO BOX */}
      <motion.div variants={itemVariants} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-extrabold text-emerald-300 uppercase tracking-widest">
              REVENUE OPPORTUNITY SUMMARY
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-mono font-bold border border-emerald-400/30">
            DEMO ESTIMATE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Current Monthly Revenue</span>
            <p className="text-xl font-extrabold text-white mt-1">{formatLakhs(kpis.collectedRent)}</p>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Collected rent</span>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Vacancy Loss Recovery</span>
            <p className="text-xl font-extrabold text-amber-400 mt-1">{formatLakhs(kpis.vacancyRevenueLoss)}</p>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">From vacant stalls</span>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Potential Max Revenue</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">
              {formatLakhs(kpis.collectedRent + kpis.vacancyRevenueLoss + kpis.pendingRent)}
            </p>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">100% occupancy target</span>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Collections Pipeline</span>
            <p className="text-xl font-extrabold text-blue-400 mt-1">
              {formatLakhs(kpis.pendingRent + kpis.overdueRent)}
            </p>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">Pending + Overdue</span>
          </motion.div>
        </div>

        <p className="text-[10px] text-zinc-500 mt-4 border-t border-emerald-500/20 pt-3 font-mono">
          * Revenue opportunity is an estimated DEMO calculation based on vacant spaces and pending payments. Do not represent predictions as guaranteed revenue.
        </p>
      </motion.div>

      {/* CHARTS BENTO SECTION */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-widest">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Category Rent Distribution
            </h4>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              Full Analytics
            </button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#71717a" fontSize={10} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${formatINR(Number(val))}`, 'Monthly Rent']}
                />
                <Bar dataKey="rent" radius={[6, 6, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Space Utilization Donut */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-widest">
              <PieChartIcon className="w-4 h-4 text-emerald-400" />
              Space Allocation Breakdown
            </h4>
            <span className="text-xs font-mono text-zinc-500">{kpis.totalStalls} Stalls Total</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-60">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Occupied', value: kpis.occupiedCount, fill: '#3b82f6' },
                      { name: 'Available', value: kpis.availableCount, fill: '#10b981' },
                      { name: 'Vacated', value: kpis.vacatedCount, fill: '#71717a' },
                      { name: 'Reserved', value: kpis.reservedCount, fill: '#f59e0b' },
                      { name: 'Maintenance', value: kpis.maintenanceCount, fill: '#ef4444' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
                <span>Occupied: <strong className="text-white">{kpis.occupiedCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span>Available: <strong className="text-white">{kpis.availableCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-zinc-500 inline-block"></span>
                <span>Vacated: <strong className="text-white">{kpis.vacatedCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                <span>Reserved: <strong className="text-white">{kpis.reservedCount}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500 inline-block"></span>
                <span>Maintenance: <strong className="text-white">{kpis.maintenanceCount}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ADDITIONAL CHARTS ROW */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Revenue Trend Area Chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              6-Month Revenue Trend
            </h4>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} tickFormatter={(v) => `₹${v/100000}L`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any, name: string) => [formatINR(Number(val)), name === 'collected' ? 'Collected' : 'Expected']}
                />
                <Area type="monotone" dataKey="expected" stroke="#3b82f6" fillOpacity={1} fill="url(#colorExpected)" />
                <Area type="monotone" dataKey="collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Breakdown */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-widest">
              <CreditCard className="w-4 h-4 text-amber-400" />
              Payment Status Breakdown
            </h4>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: number) => [`${value} Payments`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
