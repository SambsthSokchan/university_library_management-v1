'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const adminMenus = [
{ group: 'Overview', items: [
  { label: 'Dashboard', href: '/dashboard', icon: '▦' }]
},
{ group: 'Users', items: [
  { label: 'Members', href: '/dashboard/members', icon: '👥' }]
},
{ group: 'Invoice', items: [
  { label: 'Thesis Invoice', href: '/dashboard/thesis-invoice', icon: '🎓' },
  { label: 'Clearance Request', href: '/dashboard/clearance', icon: '📋' }]
},
{ group: 'Finance', items: [
  { label: 'Income', href: '/dashboard/income', icon: '💵' },
  { label: 'Expense', href: '/dashboard/expense', icon: '💸' },
  { label: 'Staff Payouts', href: '/dashboard/payouts', icon: '👨💼' }]
},
{ group: 'Admin', items: [
  { label: 'Staff Management', href: '/dashboard/staff', icon: '👤' },
  { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' }]
}];


const staffMenus = [
{ group: 'Overview', items: [
  { label: 'Dashboard', href: '/dashboard', icon: '▦' }]
},
{ group: 'Users', items: [
  { label: 'Members', href: '/dashboard/members', icon: '👥' }]
},
{ group: 'Invoice', items: [
  { label: 'Thesis Invoice', href: '/dashboard/thesis-invoice', icon: '🎓' },
  { label: 'Clearance Request', href: '/dashboard/clearance', icon: '📋' }]
},
{ group: 'Finance', items: [
  { label: 'Income', href: '/dashboard/income', icon: '💵' }]
},
{ group: 'Personal', items: [
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' }]
}];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState('STAFF');
  const [menus, setMenus] = useState(staffMenus);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        const r = parsed?.role || 'STAFF';
        setRole(r);
        setMenus(r === 'ADMIN' ? adminMenus : staffMenus);
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300"
      style={{
        width: collapsed ? '68px' : '240px',
        background: 'var(--ink-900)',
        borderRight: '1px solid var(--ink-700)',
        minWidth: collapsed ? '68px' : '240px'
      }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5"
      style={{ borderBottom: '1px solid var(--ink-700)' }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center p-0.5"
        style={{ background: 'white' }}>
          <img src="/image/rua-logo.png" alt="RUA" className="w-full h-full object-contain" />
        </div>
        {!collapsed &&
        <span className="font-bold text-base" style={{
          fontFamily: 'Playfair Display, serif',
          color: 'var(--text-primary)'
        }}>RUA Finance</span>
        }
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-xs opacity-40 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-muted)' }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menus.map((group) =>
        <div key={group.group} className="mb-4">
            {!collapsed &&
          <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-dim)' }}>
                {group.group}
              </p>
          }
            {group.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-150',
                isActive ? 'nav-active' : 'hover:bg-ink-800'
              )}
              style={{
                color: isActive ? 'var(--primary-400)' : 'var(--text-muted)',
                background: isActive ? undefined : undefined
              }}
              title={collapsed ? item.label : undefined}>
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>);

          })}
          </div>
        )}
      </nav>

      {/* User profile + logout */}
      <div className="p-3" style={{ borderTop: '1px solid var(--ink-700)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg"
        style={{ background: 'var(--ink-800)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #F5C842, #C99A00)', color: 'var(--ink-950)' }}>
            {user?.fullName?.[0] || 'U'}
          </div>
          {!collapsed &&
          <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs" style={{ color: 'var(--primary-400)' }}>{role}</p>
            </div>
          }
          {!collapsed &&
          <button onClick={handleLogout}
          className="text-xs px-2 py-1 rounded transition-colors"
          style={{ color: 'var(--text-dim)', background: 'var(--ink-700)' }}
          title="Logout">
              ⏏
            </button>
          }
        </div>
      </div>
    </aside>);

}