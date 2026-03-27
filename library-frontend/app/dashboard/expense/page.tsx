'use client';

import { useEffect, useState } from 'react';
import { getExpenses, createExpense } from '@/lib/api';
import { TrendingDown, DollarSign, Plus, Calendar, ArrowDownRight, Tag, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { clsx } from 'clsx';

export default function ExpensePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ amount: '', category: 'MAINTENANCE', description: '' });

  const fetchExpenses = async () => {
    try {
      const { data } = await getExpenses();
      setData(data);
    } catch { toast.error('Failed to load expense records'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description
      });
      toast.success('Expense recorded');
      setIsModalOpen(false);
      fetchExpenses();
    } catch { toast.error('Failed to record expense'); }
  };

  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Institutional Expenses
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Monitor and record operational expenditures
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 fade-up fade-up-delay-1">
        <div className="card-glow rounded-2xl p-6" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
           <p className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Total Expenditure</p>
           <p className="text-3xl font-bold mb-1" style={{ color: '#EF4444', fontFamily: 'Playfair Display, serif' }}>
             ${totalExpense.toFixed(2)}
           </p>
           <div className="flex items-center gap-2 text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-2">
              <ArrowDownRight size={14} /> -3.2% from last month
           </div>
        </div>

        <div className="card-glow rounded-2xl p-6" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
           <p className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Maintenance</p>
           <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
             ${data.filter(i => i.category === 'MAINTENANCE').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
           </p>
        </div>

        <div className="card-glow rounded-2xl p-6" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
           <p className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Procurement</p>
           <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
             ${data.filter(i => i.category === 'PROCUREMENT').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
           </p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden fade-up fade-up-delay-2"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
        <table className="w-full">
           <thead>
             <tr style={{ borderBottom: '1px solid var(--ink-700)' }}>
                {['Category', 'Reason', 'Amount', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-dim)' }}>{h}</th>
                ))}
             </tr>
           </thead>
           <tbody>
             {data.map((item) => (
                <tr key={item.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--ink-700)' }}>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest"
                       style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                       {item.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-zinc-300 font-medium">{item.description || 'Institutional Cost'}</p>
                    <p className="text-[10px] font-bold tracking-widest mt-1 text-zinc-600 uppercase">Ref: #{item.id}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-rose-400">
                    -${item.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-500">
                    {item.date?.split('T')[0]}
                  </td>
                </tr>
             ))}
             {data.length === 0 && !loading && (
               <tr><td colSpan={4} className="py-24 text-center">
                 <TrendingDown size={48} className="mx-auto text-zinc-800 mb-3 opacity-20" />
                 <p style={{ color: 'var(--text-dim)' }}>No expense records found</p>
               </td></tr>
             )}
           </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Expenditure">
         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Cost Category</label>
              <select className="input-field" value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="MAINTENANCE">Facility Maintenance</option>
                <option value="PROCUREMENT">Book Procurement</option>
                <option value="UTILITIES">Utility Bills</option>
                <option value="OTHER">Other Operational Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (USD)</label>
              <input className="input-field" type="number" step="0.01" value={formData.amount} required
                onChange={e => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description / Justification</label>
              <input className="input-field" placeholder="Brief note about the expense..." value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-3">
              <button type="submit" className="btn-primary flex-1">Record Expense</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
