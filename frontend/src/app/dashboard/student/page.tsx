'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  ArrowRight, 
  BookOpen, 
  MessageSquare, 
  Award, 
  LogOut, 
  CheckCircle2, 
  Cpu, 
  Calendar 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, setCurrentUser, UserRecord } from '@/lib/store';

export default function StudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [doubtText, setDoubt] = useState('');
  const [doubtsLog, setLog] = useState([
    { q: 'How does the Pratt Parser handle infix precedences?', ans: 'Prof. Vikram: Check ast.go map values for literal bounds.' },
  ]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrent(user);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText) return;
    setLog([{ q: doubtText, ans: 'Pending Faculty resolution review...' }, ...doubtsLog]);
    setDoubt('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 pb-20">
      {/* Glow overlay */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-black text-xs">
            👨‍🎓 STU
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm block">Student Workspace Hub</span>
            <span className="text-[10px] font-mono text-cyan-400 block">Active Node: {currentUser?.name || 'Aarav Nikam'}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300"
        >
          <LogOut size={13} />
          <span>Terminate Session</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Metrics & Active Laboratory Launchpad */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Stats banner */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-4 rounded-2xl border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Attendance</span>
              <span className="text-2xl font-black text-emerald-400">92%</span>
              <span className="text-[9px] text-slate-500 block mt-1">Section CT Logs</span>
            </div>
            <div className="glass p-4 rounded-2xl border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Completed Labs</span>
              <span className="text-2xl font-black text-cyan-400">14/15</span>
              <span className="text-[9px] text-slate-500 block mt-1">Micro C Sandbox</span>
            </div>
            <div className="glass p-4 rounded-2xl border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">GPA Estimate</span>
              <span className="text-2xl font-black text-indigo-400">9.4</span>
              <span className="text-[9px] text-slate-500 block mt-1">Tier-1 Rank</span>
            </div>
          </div>

          {/* Code Execution Launchpad */}
          <div className="glass p-8 rounded-3xl border-cyan-500/20 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider block w-max mb-3">
                  ⚡ Auto-Grading Engine Integration
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight">Micro C IDE Sandbox</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                  Step directly into the Monaco editor framework. Write C arrays, loops, or standard algorithms to hit custom AST evaluator validation pipelines.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Code2 size={24} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-400 mb-6 space-y-1">
              <div className="text-white font-bold">// Today's Assigned Suite:</div>
              <div className="text-cyan-400">#104: Recursive Node Tree Allocation Bounds</div>
            </div>

            <Link
              href="/problems"
              className="w-full py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/10"
            >
              <span>Launch IDE Testbed Interface</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Active resources hub */}
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen size={14} className="text-cyan-400" />
              <span>Syllabus & Lecture References</span>
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-200">Pratt_Parser_Theory_Guide.pdf</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer">Download</span>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-200">C_Memory_Allocation_Cheatsheet.md</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer">Download</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Faculty Chat Portal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Faculty Doubt Channel</h3>
                <p className="text-[10px] text-slate-400">Directly bypass queues to hit Subject Faculty</p>
              </div>
            </div>

            <form onSubmit={handleAskDoubt} className="space-y-3">
              <textarea
                required
                rows={3}
                value={doubtText}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="Ask about pointers, division errors, or memory buffer bounds..."
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs leading-relaxed resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Submit Doubt Inquiry
              </button>
            </form>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-[10px] text-slate-500 font-mono block uppercase">Resolved Pipeline Log</span>
              
              <div className="space-y-2.5">
                {doubtsLog.map((log, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-white block">Q: {log.q}</span>
                    <span className="text-[11px] font-mono text-cyan-400 block bg-cyan-500/5 p-2 rounded border border-cyan-500/10">
                      {log.ans}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Simple premium banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/20 to-transparent border border-cyan-500/10 text-xs text-slate-400 leading-relaxed">
            🎓 Students authenticate against their section roll numbers to automatically feed results to class teacher ledgers.
          </div>
        </div>

      </main>
    </div>
  );
}
