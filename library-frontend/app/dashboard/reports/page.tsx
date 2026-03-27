'use client';

import { BarChart3, Construction } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center text-accent ring-1 ring-accent/30 shadow-2xl mb-8">
            <BarChart3 size={48} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-white">Advanced Reports</h1>
        <p className="text-zinc-500 mt-4 max-w-md mx-auto leading-relaxed">
            The reporting engine is currently being optimized for high-volume data analysis. 
            Automated PDF generation and yearly trend insights will be available in the next release.
        </p>
        
        <div className="mt-12 p-6 glass-card inline-flex items-center gap-3 border-accent/20">
            <Construction size={20} className="text-accent" />
            <span className="text-xs uppercase font-bold tracking-widest text-zinc-500">Feature under active development</span>
        </div>
    </div>
  );
}
