'use client';

import { useEffect, useState } from 'react';
import { getIncomeTransactions, createIncome } from '@/lib/api';
import { TrendingUp, Plus, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';


export default function IncomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ amount: '', source: 'FINES', description: '' });

  const fetchIncome = async () => {
    try {
      const { data } = await getIncomeTransactions();
      setData(data);
    } catch {toast.error('Failed to load income reports');} finally
    {setLoading(false);}
  };

  useEffect(() => {fetchIncome();}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIncome({
        amount: parseFloat(formData.amount),
        source: formData.source,
        description: formData.description
      });
      toast.success('Income recorded');
      setIsModalOpen(false);
      fetchIncome();
    } catch {toast.error('Failed to record income');}
  };

  const totalIncome = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Financial Income
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Track institutional revenue and collections
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Record Revenue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 fade-up fade-up-delay-1">
        <div className="card-glow rounded-2xl p-6" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
           <p className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Gross Revenue</p>
           <p className="text-3xl font-bold mb-1" style={{ color: '#5A9E59', fontFamily: 'Playfair Display, serif' }}>
             ${totalIncome.toFixed(2)}
           </p>
           <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-2">
              <ArrowUpRight size={14} /> +12.5% from last month
           </div>
        </div>

        <div className="card-glow rounded-2xl p-6" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
           <p className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Fines Collected</p>
           <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
             ${data.filter((i) => i.source === 'FINES').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
           </p>
        </div>

        <div className="card-glow rounded-2xl p-6" style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
           <p className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: 'var(--text-dim)' }}>Service Fees</p>
           <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
             ${data.filter((i) => i.source === 'SERVICE_FEE').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
           </p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden fade-up fade-up-delay-2"
      style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
        <table className="w-full">
           <thead>
             <tr style={{ borderBottom: '1px solid var(--ink-700)' }}>
                {['Source', 'Reference', 'Amount', 'Date'].map((h) =>
              <th key={h} className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-dim)' }}>{h}</th>
              )}
             </tr>
           </thead>
           <tbody>
             {data.map((item) =>
            <tr key={item.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--ink-700)' }}>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest"
                style={{ background: 'rgba(90,158,89,0.1)', color: '#5A9E59' }}>
                       {item.source}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-zinc-300 font-medium">{item.description || 'General Collection'}</p>
                    <p className="text-[10px] font-bold tracking-widest mt-1 text-zinc-600 uppercase">Ref: #{item.id}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-white">
                    +${item.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-500">
                    {item.date?.split('T')[0]}
                  </td>
                </tr>
            )}
             {data.length === 0 && !loading &&
            <tr><td colSpan={4} className="py-24 text-center">
                 <TrendingUp size={48} className="mx-auto text-zinc-800 mb-3 opacity-20" />
                 <p style={{ color: 'var(--text-dim)' }}>No income transactions recorded</p>
               </td></tr>
            }
           </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Manual Revenue">
         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Source Category</label>
              <select className="input-field" value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                <option value="FINES">Library Fines</option>
                <option value="SERVICE_FEE">Service Fees</option>
                <option value="DONATION">Donations</option>
                <option value="OTHER">Other Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount (USD)</label>
              <input className="input-field" type="number" step="0.01" value={formData.amount} required
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description / Reference</label>
              <input className="input-field" placeholder="Brief note about the collection..." value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-3">
              <button type="submit" className="btn-primary flex-1">Record Transaction</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
         </form>
      </Modal>
    </div>);

}