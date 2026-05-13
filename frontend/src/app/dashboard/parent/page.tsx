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
  Layers,
  Sparkles,
  TrendingUp,
  Receipt,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getSubjects, UserRecord, SubjectRecord } from '@/lib/store';

export default function ParentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  
  // Primary Navigation tabs (Left Menu)
  const [activeTab, setActiveTab] = useState<'ward' | 'fees' | 'appointments' | 'syllabus'>('ward');
  
  // Secondary Sub-navigation tab states (Top Horizontal Bar)
  const [feeSubTab, setFeeSubTab] = useState<'pay' | 'history'>('pay');
  const [apptSubTab, setApptSubTab] = useState<'schedule' | 'circulars'>('schedule');

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
    alert('Payment verified securely via standard gateway routing. Ledger records updated instantly.');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-emerald-500/30 pb-20 relative overflow-x-hidden font-sans">
      {/* Subtle Background Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Header Framework Bar */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center font-black text-black text-xs shadow-md shadow-emerald-500/20">
              PAR
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                Parent Portal Overview
              </span>
              <span className="text-[10px] text-emerald-400 block font-semibold">
                Supervising Ward: Aarav Nikam (Section CS-A)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-slate-400 border border-white/5 font-medium">
              <Sparkles size={11} className="text-emerald-400" />
              <span>Guardian Authorization Access</span>
            </span>

            <button 
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Structural Flow Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8 relative z-10 items-start">
        
        {/* Left Menu Selection Sidebar */}
        <div className="w-full lg:w-72 shrink-0 p-4 rounded-3xl border border-white/10 bg-[#080d1a]/90 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-20">
          <div className="px-2 pb-1 border-b border-white/5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Guardian Options
            </span>
            <span className="text-xs text-slate-400 block mt-0.5 font-medium">
              Ward Management
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Ward Performance */}
            <button
              onClick={() => setActiveTab('ward')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'ward' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp size={16} className="shrink-0" />
              <span className="truncate">Ward Overview</span>
            </button>

            {/* Fee Management */}
            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'fees' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard size={16} className="shrink-0" />
              <span className="truncate">Fee Payments</span>
            </button>

            {/* Teacher Appointments */}
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'appointments' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={16} className="shrink-0" />
              <span className="truncate">Teacher Appointments</span>
            </button>

            {/* Syllabus Overview */}
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'syllabus' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={16} className="shrink-0" />
              <span className="truncate">Syllabus Overview</span>
            </button>
          </div>
        </div>

        {/* Right Content View Pane */}
        <div className="grow min-w-0 w-full space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: WARD PERFORMANCE OVERVIEW                          */}
          {/* ========================================================= */}
          {activeTab === 'ward' && (
            <div className="glass p-6 rounded-3xl border-emerald-500/20 bg-gradient-to-r from-emerald-950/10 via-transparent to-transparent animate-fade-in max-w-2xl mx-auto space-y-6">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block border-b border-white/5 pb-2">
                📊 Continuous Academic Tracking
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-xs text-slate-400 block font-medium">Verified Attendance</span>
                  <span className="text-3xl font-black text-white mt-1 block">92%</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">⚡ Tier-1 Status</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-xs text-slate-400 block font-medium">Lab Scoring Average</span>
                  <span className="text-3xl font-black text-white mt-1 block">90/100</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">14 Evaluations</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-xs text-slate-400 block font-medium">Unexcused Absences</span>
                  <span className="text-3xl font-black text-emerald-400 mt-1 block">0</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Perfect Record</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                <span>Active Objective Standing Target:</span>
                <span className="font-bold px-2.5 py-0.5 rounded bg-white/5 text-emerald-400">
                  Grade O (Outstanding)
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: FEE PAYMENTS                                       */}
          {/* ========================================================= */}
          {activeTab === 'fees' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Switcher */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setFeeSubTab('pay')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    feeSubTab === 'pay' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>💳 Clear Pending Dues</span>
                </button>
                <button
                  onClick={() => setFeeSubTab('history')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    feeSubTab === 'history' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt size={14} />
                  <span>📜 Payment History</span>
                </button>
              </div>

              {feeSubTab === 'pay' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">Tuition & Lab Fee Management</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Secure integrated standard payment workflow</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      duesPaid ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {duesPaid ? 'Status: FULLY PAID' : 'Status: PENDING'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-white block">Even Semester Tuition & Lab Maintenance</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Cutoff Target: May 30, 2026</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-sm font-black text-emerald-400 block">₹42,500</span>
                      {duesPaid ? (
                        <span className="text-[10px] text-emerald-400 italic block mt-0.5 font-medium">Cleared Remotely</span>
                      ) : (
                        <button
                          onClick={handlePayFees}
                          className="mt-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-md"
                        >
                          Clear Dues Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {feeSubTab === 'history' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-3 animate-fade-in max-w-xl mx-auto">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-white/5 pb-2">
                    Verified Past Transaction Receipts
                  </span>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <span className="text-xs font-medium text-slate-300">Odd Semester Consolidated Receipt #8912</span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <span>Download Statement</span>
                      <ArrowUpRight size={10} />
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: TEACHER APPOINTMENTS                               */}
          {/* ========================================================= */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Switcher */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setApptSubTab('schedule')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    apptSubTab === 'schedule' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar size={14} />
                  <span>📅 Schedule Appointment</span>
                </button>
                <button
                  onClick={() => setApptSubTab('circulars')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    apptSubTab === 'circulars' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bell size={14} />
                  <span>📢 Institute Circulars</span>
                </button>
              </div>

              {apptSubTab === 'schedule' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Schedule Teacher Interaction</h3>
                      <p className="text-xs text-slate-400">Request designated formal consultation slots</p>
                    </div>
                  </div>

                  {successAppt && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2 animate-fade-in">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <span>Request successfully routed to the specific faculty member. Check your registered inbox for acceptance confirmation.</span>
                    </div>
                  )}

                  <form onSubmit={handleSchedule} className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Select Faculty Member
                      </label>
                      <select
                        value={targetFaculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
                      >
                        <option value="Prof. Anjali M. (Class Teacher)">Prof. Anjali M. (Class Teacher)</option>
                        <option value="Mr. Vikram K. (Subject Teacher)">Mr. Vikram K. (Subject Teacher)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Proposed Consultation Date
                      </label>
                      <input 
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Agenda Reason
                      </label>
                      <textarea 
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Briefly describe academic queries or review requirements..."
                        className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md block mt-2"
                    >
                      Dispatch Slot Request
                    </button>
                  </form>
                </div>
              )}

              {apptSubTab === 'circulars' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
                  <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider border-b border-white/5 pb-2">
                    📢 Published Ward Bulletins
                  </span>

                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">
                      Circular Issued By Section CS-A Supervisor
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Midterm validation reports have been released. Parents are requested to browse updated module scores under the syllabus section to monitor tracks securely.
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SYLLABUS OVERVIEW                                  */}
          {/* ========================================================= */}
          {activeTab === 'syllabus' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Ward Curriculum Progress Tracker</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Multi-stream tracking managed directly by designated course faculties</p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-xs text-emerald-300 font-bold border border-emerald-500/20">
                  Supervised Courses: {subjects.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map(s => (
                  <div key={s.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-white block">{s.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-emerald-300 shrink-0">
                          {s.code}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 block mb-3">
                        Allocated Teacher: <strong className="text-emerald-300 font-sans">{s.teacherName || 'Assigned Core'}</strong>
                      </span>

                      {/* Covered Progress feedback Indicator */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Delivered Extent</span>
                          <span className="font-bold text-emerald-300">{s.syllabusCoveredPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${s.syllabusCoveredPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Module breakdown array */}
                      <div className="space-y-1.5 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                          Covered Topics List
                        </span>
                        {s.modules.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.completed ? 'bg-emerald-400' : 'bg-white/10'}`} />
                            <span className={`truncate ${m.completed ? 'text-slate-400 line-through' : 'text-slate-300'}`}>{m.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-[9px] text-slate-500 text-right">
                      Verified Secure Ledger Record
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
