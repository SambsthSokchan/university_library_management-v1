'use client';

import { X } from 'lucide-react';








export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      
      
      {/* Modal Content */}
      <div className="glass-card w-full max-w-lg relative z-10 animate-fade-in shadow-2xl border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-accent">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
            
            <X size={20} />
          </button>
        </div>
        
        {children}
      </div>
    </div>);

}