'use client';

import { useEffect, useState } from 'react';
import { getClearanceRequests, approveClearance, rejectClearance } from '@/lib/api';
import {
  ClipboardCheck,
  CheckCircle2, XCircle, Clock,
  User, ShieldCheck } from
'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import Cookies from 'js-cookie';

export default function ClearancePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  const userStr = Cookies.get('user');
  const userRole = userStr ? JSON.parse(userStr).role : 'STAFF';

  const fetchRequests = async () => {
    try {
      const { data } = await getClearanceRequests();
      setRequests(data);
    } catch {toast.error('Failed to load clearance requests');} finally
    {setLoading(false);}
  };

  useEffect(() => {fetchRequests();}, []);

  const handleReview = async (id, status) => {
    try {
      if (status === 'APPROVED') await approveClearance(id);else
      await rejectClearance(id);
      toast.success(`Request ${status.toLowerCase()}`);
      fetchRequests();
    } catch {toast.error('Review failed');}
  };

  const filtered = requests.filter((r) =>
  filter === 'ALL' ? true : r.status === filter
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Clearance Review
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Evaluate academic clearance for graduating students
          </p>
        </div>
      </div>

      <div className="flex bg-ink-800 p-1.5 rounded-xl w-fit border border-ink-600 mb-8 fade-up fade-up-delay-1">
         {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={clsx(
            "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
            filter === f ? "bg-gold-400 text-ink-950 shadow-lg" : "text-zinc-500 hover:text-white"
          )}>
          
             {f}
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 fade-up fade-up-delay-2">
        {filtered.map((req) =>
        <div key={req.id} className="card-glow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
            req.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/30" :
            req.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
            "bg-rose-500/10 text-rose-500 border-rose-500/30"
          )}>
              {req.status === 'PENDING' ? <Clock size={24} /> :
            req.status === 'APPROVED' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><User size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{req.member?.fullName}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>{req.member?.studentId}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-dim)' }}>Evaluation</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>
                    Check for pending fines, overdue books, and thesis fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center px-6 border-l border-white/5 min-w-[240px] gap-3">
               {req.status === 'PENDING' ?
            <>
                  <button onClick={() => handleReview(req.id, 'APPROVED')} className="btn-primary flex-1 py-1.5 text-[10px]">APPROVE</button>
                  <button onClick={() => handleReview(req.id, 'REJECTED')} className="btn-danger flex-1 py-1.5 text-[10px]">REJECT</button>
                 </> :

            <div className="flex flex-col items-center gap-1 w-full text-center">
                    <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: req.status === 'APPROVED' ? '#5A9E59' : '#EF4444' }}>{req.status}</p>
                    <p className="text-[10px] tracking-widest text-zinc-600">Decision finalize on {req.updatedAt?.split('T')[0]}</p>
                 </div>
            }
            </div>
          </div>
        )}

        {filtered.length === 0 && !loading &&
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px dashed var(--ink-600)' }}>
            <ClipboardCheck size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p style={{ color: 'var(--text-dim)' }}>No clearance requests in this category</p>
          </div>
        }
      </div>
    </div>);

}