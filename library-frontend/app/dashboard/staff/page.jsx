'use client';

import { useEffect, useState } from 'react';
import { getStaff, createStaff, updateStaff, deleteStaff } from '@/lib/api';
import { Shield, Edit2, Trash2, UserPlus, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';

import Cookies from 'js-cookie';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '', role: 'STAFF' });

  const userStr = Cookies.get('user');
  const userRole = userStr ? JSON.parse(userStr).role : 'STAFF';

  const fetchStaff = async () => {
    try {
      const { data } = await getStaff();
      setStaff(data);
    } catch {toast.error('Failed to load user records');} finally
    {setLoading(false);}
  };

  useEffect(() => {fetchStaff();}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
        toast.success('User updated');
      } else {
        await createStaff(formData);
        toast.success('New user created');
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch {toast.error('Operation failed');}
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteStaff(id);
      toast.success('User removed');
      fetchStaff();
    } catch {toast.error('Delete failed');}
  };

  if (userRole !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center fade-up">
        <Shield size={64} className="text-rose-500 mb-6 opacity-40" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p style={{ color: 'var(--text-dim)' }}>Only system administrators can manage staff accounts.</p>
      </div>);

  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Staff Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Admin control panel for system users and roles
          </p>
        </div>
        <button
          onClick={() => {setEditingStaff(null);setFormData({ fullName: '', username: '', email: '', password: '', role: 'STAFF' });setIsModalOpen(true);}}
          className="btn-primary flex items-center gap-2">
          
          <UserPlus size={18} /> Add Staff Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up fade-up-delay-1">
        {staff.map((user) =>
        <div key={user.id} className="card-glow rounded-2xl p-6 relative group transition-all"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ background: 'rgba(245,200,66,0.1)', color: 'var(--primary-400)' }}>
                {user.fullName.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => {setEditingStaff(user);setFormData({ ...user, password: '' });setIsModalOpen(true);}}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-text-primary transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(user.id)}
              className="p-2 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user.fullName}</h3>
              <p className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-dim)' }}>
                @{user.username}
              </p>
            </div>

            <div className="space-y-2 py-4 border-y border-white/5">
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Mail size={14} className="opacity-40" /> {user.email || 'no email'}
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} className="opacity-40" /> {user.role}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-500">Live Access</span>
              <span style={{ color: 'var(--text-dim)' }}>UID: #{user.id}</span>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? 'Edit Account' : 'Register New Staff'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
            <input className="input-field" value={formData.fullName} required
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Username *</label>
              <input className="input-field" value={formData.username} required
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label>
              <select className="input-field" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input className="input-field" type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>{editingStaff ? 'New Password (Optional)' : 'Password *'}</label>
            <input className="input-field" type="password" value={formData.password} required={!editingStaff}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingStaff ? 'Confirm Update' : 'Initialize Account'}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>);

}