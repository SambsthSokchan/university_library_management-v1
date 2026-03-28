'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Cookies from 'js-cookie';

const borrowData = [
{ month: 'Oct', borrows: 42 },
{ month: 'Nov', borrows: 58 },
{ month: 'Dec', borrows: 35 },
{ month: 'Jan', borrows: 67 },
{ month: 'Feb', borrows: 72 },
{ month: 'Mar', borrows: 89 }];


const incomeData = [
{ month: 'Oct', income: 240 },
{ month: 'Nov', income: 310 },
{ month: 'Dec', income: 180 },
{ month: 'Jan', income: 420 },
{ month: 'Feb', income: 390 },
{ month: 'Mar', income: 510 }];


function StatCard({ label, value, sub, color, icon, delay }) {
  return (
    <div className={`card-glow rounded-2xl p-5 fade-up fade-up-delay-${delay}`}
    style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: `${color}18` }}>
          {icon}
        </div>
        <span className="text-xs px-2 py-1 rounded-full"
        style={{ background: `${color}15`, color }}>
          {sub}
        </span>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
        {value}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{label}</p>
    </div>);

}

export default function DashboardPage() {
  const userStr = Cookies.get('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const stats = [
  { label: 'Total Books', value: '1,248', sub: '+12 this month', color: '#F5C842', icon: '📚', delay: 1 },
  { label: 'Total Members', value: '3,041', sub: '+28 this month', color: '#5A9E59', icon: '👥', delay: 2 },
  { label: 'Active Borrows', value: '187', sub: '12 overdue', color: '#60A5FA', icon: '🔄', delay: 3 },
  { label: 'Unpaid Fines', value: '$342', sub: '18 pending', color: '#F87171', icon: '⚠️', delay: 4 }];


  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 fade-up">
        <h1 className="text-2xl font-bold mb-1"
        style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
          Good morning, {user?.fullName?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
          Here's what's happening in your library today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {/* Borrow Activity Chart */}
        <div className="rounded-2xl p-6 fade-up fade-up-delay-1"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Borrow Activity
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                Last 6 months
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(245,200,66,0.12)', color: 'var(--gold-400)' }}>
              Monthly
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={borrowData}>
              <defs>
                <linearGradient id="borrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5C842" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5C842" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false}
              tick={{ fill: '#6B6B85', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1A1A24', border: '1px solid #363648', borderRadius: '8px', color: '#E8E8F0' }}
                labelStyle={{ color: '#A8A8C0' }} />
              
              <Area type="monotone" dataKey="borrows" stroke="#F5C842" strokeWidth={2}
              fill="url(#borrowGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

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
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={incomeData} barSize={24}>
              <XAxis dataKey="month" axisLine={false} tickLine={false}
              tick={{ fill: '#6B6B85', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1A1A24', border: '1px solid #363648', borderRadius: '8px', color: '#E8E8F0' }} />
              
              <Bar dataKey="income" fill="#5A9E59" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl fade-up fade-up-delay-3"
      style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
        <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--ink-700)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Recent Borrow Activity
          </h3>
          <a href="/dashboard/borrow" className="text-xs"
          style={{ color: 'var(--gold-400)' }}>
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink-700)' }}>
                {['Member', 'Book', 'Borrow Date', 'Due Date', 'Status'].map((h) =>
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-dim)' }}>
                    {h}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {[
              { member: 'Chan Dara', book: 'Introduction to Algorithms', borrow: 'Mar 20', due: 'Apr 3', status: 'BORROWED', statusColor: '#60A5FA' },
              { member: 'Sok Vannak', book: 'Database Systems', borrow: 'Mar 18', due: 'Apr 1', status: 'OVERDUE', statusColor: '#F87171' },
              { member: 'Ly Sopha', book: 'Clean Code', borrow: 'Mar 15', due: 'Mar 29', status: 'RETURNED', statusColor: '#5A9E59' },
              { member: 'Heng Pisey', book: 'Design Patterns', borrow: 'Mar 22', due: 'Apr 5', status: 'BORROWED', statusColor: '#60A5FA' }].
              map((row, i) =>
              <tr key={i} className="table-row-hover transition-colors"
              style={{ borderBottom: '1px solid var(--ink-700)' }}>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>{row.member}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{row.book}</td>
                  <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text-dim)' }}>{row.borrow}</td>
                  <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text-dim)' }}>{row.due}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${row.statusColor}18`, color: row.statusColor }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}