'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

const incomeData = [
  { month: 'Oct', income: 240 },
  { month: 'Nov', income: 310 },
  { month: 'Dec', income: 180 },
  { month: 'Jan', income: 420 },
  { month: 'Feb', income: 390 },
  { month: 'Mar', income: 510 }
];

function StatCard({ label, value, sub, color, icon, delay }) {
  return (
    <div className={`card-glow rounded-2xl p-5 fade-up fade-up-delay-${delay}`}
      style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
            style={{ background: `${color}18` }}>
            {icon}
          </div>
          <span className="font-semibold text-sm tracking-wide" style={{ color: 'var(--text-dim)' }}>
            {label}
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: `${color}12`, color }}>
          {sub}
        </span>
      </div>
      <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const stats = [
    { label: 'Total Members', value: '3,041', sub: '+28 this month', color: '#5A9E59', icon: '👥', delay: 1 },
    { label: 'Active Clearances', value: '24', sub: '12 pending', color: '#60A5FA', icon: '📋', delay: 2 },
    { label: 'Unpaid Invoices', value: '$342', sub: '18 pending', color: '#F87171', icon: '⚠️', delay: 3 }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 fade-up">
        <h1 className="text-2xl font-bold mb-1"
          style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
          Good morning, {user?.fullName?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
          Here's what's happening in your finance system today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Income Chart */}
        <div className="rounded-2xl p-6 fade-up fade-up-delay-2"
          style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Income Overview
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                Last 6 months
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: 'rgba(90,158,89,0.12)', color: '#5A9E59' }}>
              USD
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData} barSize={40}>
              <XAxis dataKey="month" axisLine={false} tickLine={false}
                tick={{ fill: '#6B6B85', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Bar dataKey="income" fill="#5A9E59" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}