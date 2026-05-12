'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  Bell, 
  ArrowUpRight, 
  ShieldAlert,
  Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getSubjects, UserRecord, SubjectRecord } from '@/lib/store';

export default function ParentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  
  // Appointment scheduler state
  const [targetFaculty, setFaculty] = useState('Prof. Anjali M. (Class Teacher)');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [successAppt, setSuccess] = useState(false);

  // Fee dues state
  const [duesPaid, setPaid] = useState(false);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrent(user);
    setSubjects(getSubjects());
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setSuccess(true);
    setDate('');
    setReason('');
    setTimeout(() => setSuccess(false), 6000);
  };

  const handlePayFees = () => {
    setPaid(true);
    alert('Simulated encrypted institutional gateway transaction successful. Real-time ledger updated.');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-emerald-500/30 pb-20">
      {/* Top overlay glow */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black text-xs">
            👪 PAR
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm block">Parent Overview Portal</span>
            <span className="text-[10px] font-mono text-emerald-400 block">Ward Access: Aarav Nikam (Section CS-A)</span>
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
        
        {/* Left Column: Ward metrics & Fee ledger */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Ward Streak Dashboard banner */}
          <div className="glass p-6 rounded-3xl border-emerald-500/20 bg-gradient-to-r from-emerald-950/10 via-transparent to-transparent">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 block mb-2">
              📊 Continuous Streak Tracking
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Validated Streak</span>
                <span className="text-3xl font-black text-white block mt-1">92%</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">⚡ Within Tier-1 Buffer</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Sandbox Average</span>
                <span className="text-3xl font-black text-white block mt-1">90/100</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">14 Labs Evaluated</span>
              </div>
              <div className="col-span-2 sm:col-span-1 border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
                <span className="text-xs text-slate-400 block">Unexcused Skips</span>
                <span className="text-3xl font-black text-emerald-400 block mt-1">0</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Logs Perfect</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <span>Active Target Subject Grade:</span>
              <span className="font-mono font-bold px-2.5 py-0.5 rounded bg-white/5 text-emerald-400">
                Grade O (Excellent)
              </span>
            </div>
          </div>

          {/* Fee & Ledger Transaction Portal */}
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Fee Ledger & Dues Matrix</h3>
                  <p className="text-[10px] text-slate-400">Secure digital payments verified by institutional root</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                duesPaid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {duesPaid ? 'Status: ZERO DUES' : 'Status: PENDING'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Even Semester Tuition & Lab Compute Dues</span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Due date: May 30, 2026</span>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-emerald-400 block font-mono">₹42,500</span>
                {duesPaid ? (
                  <span className="text-[9px] text-emerald-500 font-mono italic block">Paid Via Portal</span>
                ) : (
                  <button
                    onClick={handlePayFees}
                    className="mt-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all"
                  >
                    Clear Dues
                  </button>
                )}
              </div>
            </div>

            {/* Past receipts download lists */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">
                Historical Encrypted Receipts
              </span>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <span className="text-xs font-medium text-slate-300">Odd Semester Lab Fee Receipt #8912</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span>Download</span>
                    <ArrowUpRight size={10} />
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Broadcast Alerts & PTM dispatcher */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active circular alert */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Bell size={13} />
              <span>Broadcast Circular Stream</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              [Circular From Section CS-A Class Teacher] Mid-term consolidated reports have been formally signed. Guardians are requested to review performance tracks below.
            </p>
          </div>

          {/* Schedule Meeting dispatcher */}
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                <Calendar size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Appointment Dispatch Engine</h3>
                <p className="text-[10px] text-slate-400">Request formal interactions with assigned core faculty</p>
              </div>
            </div>

            {successAppt && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>Successfully dispatched slot request directly to assigned faculty node. Pending approval notification alert.</span>
              </div>
            )}

            <form onSubmit={handleSchedule} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Target Authority Node
                </label>
                <select
                  value={targetFaculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs font-bold text-emerald-400 focus:outline-none"
                >
                  <option value="Prof. Anjali M. (Class Teacher)">Prof. Anjali M. (Class Teacher)</option>
                  <option value="Mr. Vikram K. (Subject Faculty)">Mr. Vikram K. (Subject Faculty)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Preferred Date Slot
                </label>
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Discussion Agenda Summary
                </label>
                <textarea 
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Discuss micro-compiler sandbox scoring weightages..."
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all"
              >
                Dispatch Interactive Slot Request
              </button>
            </form>
          </div>

        </div>

        {/* Full-width bottom space: Parent Guardian Dynamic Tracked Syllabus Supervision View */}
        <div className="lg:col-span-12">
          <div className="glass p-8 rounded-3xl border-emerald-500/20 bg-gradient-to-r from-emerald-950/10 via-transparent to-teal-950/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  <Layers className="text-emerald-400" size={20} />
                  <span>Ward Course Syllabus Master Coverage Telemetry</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synchronous multi-stream metrics updated directly by course administrators and subject faculty.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
                Supervised Streams: {subjects.length} Mapped
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjects.map(s => (
                <div key={s.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-black text-white block">{s.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-emerald-400 shrink-0">
                        {s.code}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 block mb-3 font-mono">
                      Instructor Node: <strong className="text-emerald-300 font-sans">{s.teacherName || 'Allocated Core'}</strong>
                    </span>

                    {/* Progress Slider indicator */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Syllabus Covered output</span>
                        <span className="font-mono font-black text-emerald-300">{s.syllabusCoveredPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${s.syllabusCoveredPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Sub-item state lists */}
                    <div className="space-y-1.5 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1">
                        Syllabus Delivery Modules
                      </span>
                      {s.modules.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.completed ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-white/10'}`} />
                          <span className={`truncate ${m.completed ? 'line-through text-slate-500' : ''}`}>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500 text-right">
                    Sync status: Live Blockchain Ledger
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
