'use client';

import { useState, useEffect } from 'react';
import {
  User, Lock, Globe,
  Palette, Shield, Database,
  Save, RefreshCcw, Moon, Sun,
  Cpu } from
'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('#F5C842');

  const role = user?.role || 'STAFF';

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) setUser(JSON.parse(userStr));

    const t = localStorage.getItem('libraryos-theme') || 'light';
    const a = localStorage.getItem('libraryos-accent') || '#F5C842';
    setTheme(t);
    setAccent(a);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('libraryos-theme', newTheme);
    toast.success(`Theme set to ${newTheme === 'dark' ? 'Deep Night' : 'Ivory Day'}`);
  };

  const changeAccent = (newAccent) => {
    setAccent(newAccent);
    document.documentElement.style.setProperty('--primary-400', newAccent);
    localStorage.setItem('libraryos-accent', newAccent);
    toast.success('Accent color updated');
  };

  const handleSave = () => {
    toast.success('Configuration updated successfully');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10 fade-up">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            {role === 'ADMIN' ? 'System Settings' : 'Account Settings'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            {role === 'ADMIN' ? 'Configure your personal preferences and institutional defaults' : 'Configure your personal preferences and appearance'}
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-8">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 fade-up fade-up-delay-1">
        {/* Sidebar Tabs */}
        <div className="md:w-64 shrink-0 space-y-2">
          <TabButton icon={<User size={18} />} label="Profile" active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} />
          {role === 'ADMIN' && <TabButton icon={<Database size={18} />} label="System" active={activeTab === 'SYSTEM'} onClick={() => setActiveTab('SYSTEM')} />}
          <TabButton icon={<Lock size={18} />} label="Security" active={activeTab === 'SECURITY'} onClick={() => setActiveTab('SECURITY')} />
          <TabButton icon={<Palette size={18} />} label="Appearance" active={activeTab === 'APPEARANCE'} onClick={() => setActiveTab('APPEARANCE')} />
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="card-glow rounded-3xl p-8" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            {activeTab === 'PROFILE' &&
            <div className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{ background: 'rgba(245,200,66,0.1)', color: 'var(--primary-400)', border: '1px solid rgba(245,200,66,0.2)' }}>
                    {user?.fullName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.fullName || (role === 'ADMIN' ? 'System Administrator' : 'Staff Member')}</h3>
                    <p className="text-sm text-text-muted">@{user?.username || (role === 'ADMIN' ? 'admin' : 'staff')}</p>
                    <button className="text-xs font-bold text-primary-400 mt-2 uppercase tracking-widest hover:underline transition-all">Change Avatar</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <InputGroup label="Full Name" value={user?.fullName || ''} />
                  <InputGroup label="Email Address" value={user?.email || (role === 'ADMIN' ? 'admin@financeos.edu' : 'staff@financeos.edu')} />
                  <InputGroup label="Personal ID" value={user?.studentId || (role === 'ADMIN' ? 'ADM-001' : 'STF-042')} />
                  <InputGroup label="Department" value={role === 'ADMIN' ? 'Administration' : 'Finance Operations'} />
                </div>
              </div>
            }

            {activeTab === 'SYSTEM' &&
            <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-4 flex items-center gap-2">
                    <Globe size={14} /> Backend Connectivity
                  </h4>
                  <div className="space-y-4">
                    <InputGroup label="API Base URL" value="http://localhost:8080/api" />
                    <div className="p-4 rounded-xl border border-ink-700 border bg-ink-700 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><RefreshCcw size={16} /></div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">System Heartbeat</p>
                          <p className="text-[10px] text-text-muted uppercase tracking-widest">Last ping: 2ms ago</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Operational</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-4 flex items-center gap-2">
                    <Cpu size={14} /> Global Defaults
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Default Currency</label>
                      <select className="input-field cursor-pointer">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Language</label>
                      <select className="input-field cursor-pointer">
                        <option>English (US)</option>
                        <option>Khmer (KM)</option>
                        <option>French (FR)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'SECURITY' &&
            <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Instance Security</h4>
                  <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-4 mb-6">
                    <Shield size={20} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-text-primary mb-1">Two-Factor Authentication</p>
                      <p className="text-xs text-text-muted leading-relaxed">Protect your account with an extra layer of security. Once enabled, you'll need to provide a unique code from your authenticator app.</p>
                      <button className="btn-primary py-1.5 px-6 text-[10px] mt-4 bg-rose-600 hover:bg-rose-500 border-none">Enable 2FA</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-ink-700 border">
                  <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="New Password" type="password" placeholder="Minimum 8 characters" />
                    <InputGroup label="Confirm Password" type="password" placeholder="Re-type new password" />
                  </div>
                </div>
              </div>
            }

            {activeTab === 'APPEARANCE' &&
            <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-4">Interface Mode</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <button
                    onClick={() => toggleTheme('dark')}
                    className={clsx(
                      "p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all",
                      theme === 'dark' ? "border-primary-400 bg-primary-400/10 shadow-[0_0_20px_rgba(245,200,66,0.1)]" : "border-ink-700 border bg-ink-700 hover:border-ink-700 border"
                    )}>
                        <Moon size={32} className={theme === 'dark' ? "text-primary-400" : "text-text-dim"} />
                        <span className={clsx("text-[10px] font-bold uppercase tracking-widest", theme === 'dark' ? "text-text-primary" : "text-text-muted")}>Deep Night</span>
                     </button>
                     <button
                    onClick={() => toggleTheme('light')}
                    className={clsx(
                      "p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all",
                      theme === 'light' ? "border-primary-400 bg-primary-400/10 shadow-[0_0_20px_rgba(245,200,66,0.1)]" : "border-ink-700 border bg-ink-700 hover:border-ink-700 border"
                    )}>
                        <Sun size={32} className={theme === 'light' ? "text-primary-400" : "text-text-muted"} />
                        <span className={clsx("text-[10px] font-bold uppercase tracking-widest", theme === 'light' ? "text-text-primary" : "text-text-muted")}>Ivory Day</span>
                     </button>
                  </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Color Palette</h4>
                   <div className="flex gap-4">
                      {['#F5C842', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'].map((color) =>
                  <div
                    key={color}
                    onClick={() => changeAccent(color)}
                    className={clsx(
                      "w-10 h-10 rounded-full border-4 transition-all cursor-pointer shadow-lg",
                      accent === color ? "border-white scale-110" : "border-transparent hover:border-ink-700 border"
                    )}
                    style={{ background: color, boxShadow: `0 0 15px ${color}44` }} />

                  )}
                   </div>
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>);

}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all border",
        active ? "bg-primary-400 text-ink-950 border-primary-400 shadow-xl scale-[1.02]" : "text-text-muted hover:text-text-primary border-transparent hover:bg-ink-700"
      )}>
      
      {icon} {label}
    </button>);

}

function InputGroup({ label, value, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">{label}</label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="input-field" />
      
    </div>);

}