'use client';

import { useEffect, useState } from 'react';
import { getMembers, createMember, updateMember, deleteMember } from '@/lib/api';
import { Users2, Plus, Edit2, Trash2, Mail, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';

import Cookies from 'js-cookie';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '', address: '',
    role: 'STUDENT', studentId: '', department: ''
  });

  const userStr = Cookies.get('user');
  const userRole = userStr ? JSON.parse(userStr).role : 'STAFF';

  const fetchMembers = async () => {
    try {
      const { data } = await getMembers();
      setMembers(data);
    } catch {toast.error('Failed to load members');} finally
    {setLoading(false);}
  };

  useEffect(() => {fetchMembers();}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
        toast.success('Member profiles updated');
      } else {
        await createMember(formData);
        toast.success('New member registered');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch {toast.error('Operation failed');}
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This will deactivate the member.')) return;
    try {
      await deleteMember(id);
      toast.success('Member removed');
      fetchMembers();
    } catch {toast.error('Delete failed');}
  };

  const filteredMembers = members.filter((m) =>
  m.fullName.toLowerCase().includes(search.toLowerCase()) ||
  m.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8 fade-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text-primary)' }}>
            Members
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>
            Manage student and faculty records
          </p>
        </div>
        <button
          onClick={() => {setEditingMember(null);setFormData({
              fullName: '', email: '', phoneNumber: '', address: '',
              role: 'STUDENT', studentId: '', department: ''
            });setIsModalOpen(true);}}
          className="btn-primary flex items-center gap-2">
          
          <Plus size={18} /> Register Member
        </button>
      </div>

      <div className="mb-6 fade-up fade-up-delay-1">
        <input
          className="input-field"
          style={{ maxWidth: '400px' }}
          placeholder="🔍  Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up fade-up-delay-2">
        {filteredMembers.map((member) =>
        <div key={member.id} className="card-glow rounded-2xl p-6 relative group transition-all"
        style={{ background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ background: 'rgba(90,158,89,0.1)', color: '#5A9E59' }}>
                {member.fullName.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => {setEditingMember(member);setFormData(member);setIsModalOpen(true);}}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"><Edit2 size={16} /></button>
                {userRole === 'ADMIN' &&
              <button onClick={() => handleDelete(member.id)}
              className="p-2 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
              }
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{member.fullName}</h3>
              <p className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--gold-400)' }}>
                {member.role} • {member.studentId}
              </p>
            </div>

            <div className="space-y-2 py-4 border-y border-white/5">
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Mail size={14} className="opacity-40" /> {member.email}
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <GraduationCap size={14} className="opacity-40" /> {member.department}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: member.isActive ? '#5A9E59' : '#EF4444' }}>
              <span>{member.isActive ? 'Active' : 'Deactivated'}</span>
              <span style={{ color: 'var(--text-dim)' }}>ID: #{member.id}</span>
            </div>
          </div>
        )}
        {filteredMembers.length === 0 && !loading &&
        <div className="col-span-full py-20 text-center rounded-2xl" style={{ border: '1px dashed var(--ink-600)' }}>
            <Users2 size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p style={{ color: 'var(--text-dim)' }}>No members found matching your search</p>
          </div>
        }
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? 'Edit Profile' : 'Register New Member'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
            <input className="input-field" value={formData.fullName} required
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email *</label>
            <input className="input-field" type="email" value={formData.email} required
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Student/Staff ID *</label>
            <input className="input-field" value={formData.studentId} required
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label>
            <select className="input-field" value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Department</label>
            <input className="input-field" value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </div>
          <div className="col-span-2 flex gap-3 mt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingMember ? 'Update Profile' : 'Confirm Registration'}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>);

}