'use client';

import { useEffect, useState } from 'react';
import { getBorrows, getActiveBorrows, getOverdueBorrows, borrowBook, returnBook, getBooks, getMembers } from '@/lib/api';
import {
  ArrowLeftRight, Plus,
  Calendar, User, Book as BookIcon,
  CheckCircle2, AlertCircle, Clock } from
'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { clsx } from 'clsx';

export default function BorrowPage() {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ bookId: '', memberId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsRes, booksRes, membersRes] = await Promise.all([
      tab === 'ALL' ? getBorrows() :
      tab === 'ACTIVE' ? getActiveBorrows() : getOverdueBorrows(),
      getBooks(),
      getMembers()]
      );
      setRecords(recordsRes.data);
      setBooks(booksRes.data.filter((b) => b.availableQuantity > 0));
      setMembers(membersRes.data.filter((m) => m.isActive));
    } catch (error) {
      toast.error('Failed to load borrowing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {fetchData();}, [tab]);

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await borrowBook({
        bookId: parseInt(formData.bookId),
        memberId: parseInt(formData.memberId)
      });
      toast.success('Book issued successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to issue book');
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      toast.success('Book returned successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Circulation
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Manage book issues and returns
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Issue New Book
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-ink-800 p-1.5 rounded-xl w-fit border border-ink-600 mb-8 fade-up fade-up-delay-1">
        <TabButton active={tab === 'ALL'} onClick={() => setTab('ALL')}>All History</TabButton>
        <TabButton active={tab === 'ACTIVE'} onClick={() => setTab('ACTIVE')}>Active Loans</TabButton>
        <TabButton active={tab === 'OVERDUE'} onClick={() => setTab('OVERDUE')}>Overdue</TabButton>
      </div>

      <div className="grid grid-cols-1 gap-4 fade-up fade-up-delay-2">
        {records.map((record) =>
        <div key={record.id} className="card-glow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
            record.status === 'BORROWED' ? "bg-amber-500/10 text-amber-500 border-amber-500/30" :
            record.status === 'RETURNED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
            "bg-rose-500/10 text-rose-500 border-rose-500/30"
          )}>
              {record.status === 'BORROWED' ? <Clock size={24} /> :
            record.status === 'RETURNED' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><BookIcon size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{record.book?.title}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>ID: {record.book?.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500"><User size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{record.member?.fullName}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>{record.member?.studentId}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-zinc-600" />
                <div>
                  <p className="text-sm font-bold text-zinc-300">Due {record.dueDate}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: 'var(--text-dim)' }}>Borrowed {record.borrowDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center px-6 border-l border-white/5 h-12 min-w-[140px] justify-center">
               {record.status === 'BORROWED' ?
            <button
              onClick={() => handleReturn(record.id)}
              className="btn-primary py-1.5 px-6 text-xs whitespace-nowrap">
              
                   Return Book
                 </button> :

            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                   {record.status}
                 </span>
            }
            </div>
          </div>
        )}
        {records.length === 0 && !loading &&
        <div className="py-24 text-center rounded-2xl" style={{ border: '1px dashed var(--ink-600)' }}>
            <ArrowLeftRight size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p style={{ color: 'var(--text-dim)' }}>No borrowing records found</p>
          </div>
        }
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Book">
        <form onSubmit={handleBorrow} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Select Book *</label>
            <select
              className="input-field cursor-pointer"
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              required>
              
              <option value="">Choose a book...</option>
              {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.availableQuantity} left)</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Select Member *</label>
            <select
              className="input-field cursor-pointer"
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              required>
              
              <option value="">Choose a member...</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.fullName} ({m.studentId})</option>)}
            </select>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 flex items-start gap-4" style={{ background: 'rgba(245,200,66,0.05)' }}>
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-zinc-400">
              Issuing this book will set the due date to 14 days from today. 
              The inventory count will be updated automatically.
            </p>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="submit" className="btn-primary flex-1">
              Issue Book Now
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>);

}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-6 py-2 rounded-lg text-xs font-bold transition-all",
        active ? "bg-gold-400 text-ink-950 shadow-lg" : "text-zinc-500 hover:text-white"
      )}>
      
      {children}
    </button>);

}