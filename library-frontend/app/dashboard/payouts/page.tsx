'use client';

import { useEffect, useState } from 'react';
import { getStaffPayouts, createPayout, approvePayout, getStaff } from '@/lib/api';
import { 
  Banknote, Plus, Search, 
  CheckCircle2, Clock, User, 
  Wallet, Briefcase, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { clsx } from 'clsx';
import Cookies from 'js-cookie';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ userId: '', amount: '', period: '' });

  const userStr = Cookies.get('user');
  const userRole = userStr ? JSON.parse(userStr).role : 'STAFF';

  const fetchData = async () => {
    try {
      const [payoutsRes, staffRes] = await Promise.all([getStaffPayouts(), getStaff()]);
      setPayouts(payoutsRes.data);
      setStaff(staffRes.data);
    } catch { toast.error('Failed to load payroll data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPayout({
        userId: parseInt(formData.userId),
        amount: parseFloat(formData.amount),
        payoutPeriod: formData.period
      });
      toast.success('Payout request created');
      setIsModalOpen(false);
      fetchData();
    } catch { toast.error('Creation failed'); }
  };

  const handleApprove = async (id: number) => {
    try {
      await approvePayout(id);
      toast.success('Payout approved and processed');
      fetchData();
    } catch { toast.error('Approval failed'); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Staff Payouts
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Manage salary disbursements and internal payroll
          </p>
        </div>
        {userRole === 'ADMIN' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Request Payout
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 fade-up fade-up-delay-1">
        {payouts.map((p) => (
          <div key={p.id} className="card-glow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
            style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            <div className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
              p.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-amber-500/10 text-amber-500 border-amber-500/30"
            )}>
              {p.status === 'PAID' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><User size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{p.user?.fullName}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>{p.user?.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><Calendar size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white">{p.payoutPeriod || 'March 2024'}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--gold-400)' }}>Payout Period</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><Wallet size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">${p.amount.toFixed(2)}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>{p.payoutDate?.split('T')[0] || 'Pending'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center px-6 border-l border-white/5 min-w-[160px] justify-center text-center">
              {p.status === 'PENDING' && userRole === 'ADMIN' ? (
                <button onClick={() => handleApprove(p.id)} className="btn-primary py-1.5 px-6 text-xs whitespace-nowrap">
                  Approve Pay
                </button>
              ) : (
                <span className={clsx(
                  "text-[10px] uppercase font-bold tracking-widest",
                  p.status === 'PAID' ? "text-emerald-500" : "text-amber-500"
                )}>
                  {p.status}
                </span>
              )}
            </div>
          </div>
        ))}
        {payouts.length === 0 && !loading && (
          <div className="py-24 text-center rounded-2xl" style={{ border: '1px dashed var(--ink-600)' }}>
            <Banknote size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p style={{ color: 'var(--text-dim)' }}>No payroll records found</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Staff Payout">
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Staff Member *</label>
            <select className="input-field" value={formData.userId} required
              onChange={e => setFormData({ ...formData, userId: e.target.value })}>
              <option value="">Select staff...</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.username})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (USD) *</label>
            <input className="input-field" type="number" step="0.01" value={formData.amount} required
              onChange={e => setFormData({ ...formData, amount: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Period (e.g. March 2024) *</label>
            <input className="input-field" placeholder="Monthly period..." value={formData.period} required
              onChange={e => setFormData({ ...formData, period: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-3">
            <button type="submit" className="btn-primary flex-1">Create Request</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
