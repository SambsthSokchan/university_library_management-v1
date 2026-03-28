'use client';

import { useEffect, useState } from 'react';
import { getFines, payFine } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export default function FinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchFines = async () => {
    try {
      const { data } = await getFines();
      setFines(data);
    } catch {toast.error('Failed to load fines');} finally
    {setLoading(false);}
  };

  useEffect(() => {fetchFines();}, []);

  const handlePay = async (id) => {
    try {
      await payFine(id);
      toast.success('Fine paid successfully');
      fetchFines();
    } catch {toast.error('Payment failed');}
  };

  const filteredFines = fines.filter((f) =>
  f.member?.fullName.toLowerCase().includes(search.toLowerCase()) ||
  f.member?.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnpaid = fines.filter((f) => !f.paid).reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Fines & Penalties
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Track and collect overdue book fines
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--text-dim)' }}>Total Outstanding</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--gold-400)', fontFamily: 'Playfair Display, serif' }}>
            ${totalUnpaid.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6 fade-up fade-up-delay-1">
        <input
          className="input-field"
          style={{ maxWidth: '400px' }}
          placeholder="🔍  Search by member name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
        
      </div>

      <div className="rounded-2xl overflow-hidden fade-up fade-up-delay-2"
      style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ink-700)' }}>
              {['Member', 'Amount', 'Reason', 'Date', 'Status', 'Action'].map((h) =>
              <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-dim)' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredFines.map((fine) =>
            <tr key={fine.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--ink-700)' }}>
                <td className="px-6 py-4">
                   <p className="text-sm font-bold text-white leading-tight">{fine.member?.fullName}</p>
                   <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--gold-400)' }}>{fine.member?.studentId}</p>
                </td>
                <td className="px-6 py-4 font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  ${fine.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  {fine.reason || 'Overdue Book'}
                </td>
                <td className="px-6 py-4 text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                  {fine.createdAt?.split('T')[0]}
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                  "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                  fine.paid ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                )}>
                    {fine.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {!fine.paid &&
                <button
                  onClick={() => handlePay(fine.id)}
                  className="btn-primary py-1 px-4 text-[10px]">
                  
                      Collect Pay
                    </button>
                }
                </td>
              </tr>
            )}
            {filteredFines.length === 0 && !loading &&
            <tr>
                <td colSpan={6} className="py-20 text-center">
                  <AlertCircle size={32} className="mx-auto text-zinc-800 mb-3 opacity-20" />
                  <p style={{ color: 'var(--text-dim)' }}>No pending fines found</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>);

}