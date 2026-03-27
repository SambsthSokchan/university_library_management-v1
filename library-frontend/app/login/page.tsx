'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { login } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const { token, ...user } = res.data;
      Cookies.set('token', token, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      toast.success(`Welcome back, ${user.fullName}!`);
      router.push('/dashboard');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--ink-950)' }}>

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-60" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F5C842 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, #5A9E59 0%, transparent 70%)' }} />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Logo area */}
        <div className="text-center mb-10 fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #F5C842 0%, #C99A00 100%)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#0A0A0F" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--text-primary)'
          }}>
            LibraryOS
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
            University Library Management System
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 fade-up fade-up-delay-1"
          style={{
            background: 'var(--ink-800)',
            border: '1px solid var(--ink-600)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
          }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Username
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              style={{ padding: '12px', fontSize: '15px' }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'var(--ink-950)', borderTopColor: 'transparent' }} />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
          © 2025 University Library System · All rights reserved
        </p>
      </div>
    </div>
  );
}
