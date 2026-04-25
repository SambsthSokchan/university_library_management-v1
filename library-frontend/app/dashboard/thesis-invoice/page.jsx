'use client';

import { useEffect, useState } from 'react';
import { getThesisInvoices, createThesisInvoice, payThesisInvoice, getMembers } from '@/lib/api';
import { FileText, Plus, DollarSign, CheckCircle2, Clock, User, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { clsx } from 'clsx';

export default function ThesisInvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ memberId: '', amount: '50.00', title: '' });

  const fetchData = async () => {
    try {
      const [invRes, memRes] = await Promise.all([getThesisInvoices(), getMembers()]);
      setInvoices(invRes.data);
      setMembers(memRes.data.filter((m) => m.isActive));
    } catch {toast.error('Failed to load invoices');} finally
    {setLoading(false);}
  };

  useEffect(() => {fetchData();}, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createThesisInvoice({
        memberId: parseInt(formData.memberId),
        amount: parseFloat(formData.amount),
        thesisTitle: formData.title
      });
      toast.success('Invoice generated');
      setIsModalOpen(false);
      fetchData();
    } catch {toast.error('Creation failed');}
  };

  const handlePay = async (id) => {
    try {
      await payThesisInvoice(id);
      toast.success('Invoice paid');
      fetchData();
    } catch {toast.error('Payment failed');}
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Thesis Invoices
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Manage graduate thesis submission fees
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Generate Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 fade-up fade-up-delay-1">
        {invoices.map((inv) =>
        <div key={inv.id} className="card-glow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
            inv.paid ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-amber-500/10 text-amber-500 border-amber-500/30"
          )}>
              {inv.paid ? <CheckCircle2 size={24} /> : <Clock size={24} />}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><User size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{inv.member?.fullName}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>{inv.member?.studentId}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><GraduationCap size={20} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate max-w-[200px]">{inv.thesisTitle || 'General Thesis Submission'}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--primary-400)' }}>Academic Fee</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><DollarSign size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">${inv.amount.toFixed(2)}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>{inv.invoiceDate?.split('T')[0]}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center px-6 border-l border-white/5 min-w-[140px] justify-center">
              {!inv.paid ?
            <button onClick={() => handlePay(inv.id)} className="btn-primary py-1.5 px-6 text-xs whitespace-nowrap">
                  Pay Now
                </button> :

            <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">PAID</span>
                  <button className="text-[10px] underline tracking-widest text-zinc-600 hover:text-text-primary transition-colors">RECEIPT</button>
                </div>
            }
            </div>
          </div>
        )}

        {invoices.length === 0 && !loading &&
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px dashed var(--ink-600)' }}>
            <FileText size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p style={{ color: 'var(--text-dim)' }}>No thesis invoices found</p>
          </div>
        }
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Thesis Invoice">
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Student *</label>
            <select className="input-field" value={formData.memberId} required
            onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}>
              <option value="">Select student...</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.fullName} ({m.studentId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Thesis Title *</label>
            <input className="input-field" placeholder="Full title of the thesis..." value={formData.title} required
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (USD)</label>
            <input className="input-field" type="number" step="0.01" value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-3">
            <button type="submit" className="btn-primary flex-1">Issue Invoice</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>);

}