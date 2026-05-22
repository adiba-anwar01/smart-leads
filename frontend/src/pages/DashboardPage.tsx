import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { getDashboardStats } from '../api/leads.api';
import type { DashboardStats } from '../types';
import { Users, UserPlus, CheckCircle, XCircle } from 'lucide-react';

const quickActions = [
  { id: 'qa-report', label: 'Analytics', desc: 'View performance metrics', icon: '📊', path: null },
  { id: 'qa-leads', label: 'Leads', desc: 'Browse and manage all leads', icon: '🎯', path: '/leads' },
];



const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-emerald-500',
  Lost: 'bg-red-500',
};

export function DashboardPage(): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    getDashboardStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      id: 'total-leads',
      label: 'Total Leads',
      value: stats ? stats.totalLeads : '—',
      positive: true,
      icon: <Users className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      ring: 'ring-emerald-100 dark:ring-emerald-500/20',
    },
    {
      id: 'new-leads',
      label: 'New This Month',
      value: stats ? stats.newThisMonth : '—',
      positive: true,
      icon: <UserPlus className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      ring: 'ring-emerald-100 dark:ring-emerald-500/20',
    },
    {
      id: 'qualified-leads',
      label: 'Qualified',
      value: stats ? stats.qualifiedLeads : '—',
      positive: true,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
      ring: 'ring-amber-100 dark:ring-amber-500/20',
    },
    {
      id: 'lost-leads',
      label: 'Lost',
      value: stats ? (stats.statusCounts?.['Lost'] ?? 0) : '—',
      positive: false,
      icon: <XCircle className="w-5 h-5" />,
      color: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
      ring: 'ring-red-100 dark:ring-red-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 py-3 px-5 text-white shadow-md shadow-emerald-200">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 right-10 w-14 h-14 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-3">
          <div>
            <p className="text-emerald-200 text-[11px] font-medium uppercase tracking-widest leading-none mb-0.5">Welcome back</p>
            <h2 className="text-lg font-bold leading-tight">{user?.name ?? 'User'} 👋</h2>
          </div>
          <p className="text-emerald-200 text-[12.5px] ml-4 hidden sm:block">
            Here&apos;s a snapshot of your leads pipeline today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ring-2 shrink-0 ${card.color} ${card.ring}`}>
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 leading-none mb-0.5">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 p-5">
          <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                id={action.id}
                onClick={() => action.path && navigate(action.path)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-100 dark:hover:border-emerald-500/20 border border-transparent dark:border-slate-700/50 text-left transition-all duration-150 group"
              >
                <span className="text-xl">{action.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 leading-tight">{action.label}</p>
                  <p className="text-[11.5px] text-slate-400 leading-tight mt-0.5">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white">Pipeline Overview</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center py-2 space-y-5">
            {['New', 'Contacted', 'Qualified', 'Lost'].map((status) => {
              const count = stats?.statusCounts?.[status] || 0;
              const total = stats?.totalLeads || 0;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const colorClass = STATUS_COLORS[status] || 'bg-slate-500';

              return (
                <div key={status}>
                  <div className="flex justify-between text-[13px] font-medium mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300">{status}</span>
                    <span className="text-slate-500 dark:text-slate-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
