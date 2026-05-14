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
  Calendar,
  Layers,
  Receipt,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Coffee,
  ShieldCheck,
  ShieldAlert,
  Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, setCurrentUser, getSubjects, getUsers, placeCanteenOrder, submitAnonymousGrievance, UserRecord, SubjectRecord } from '@/lib/store';

export default function StudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  
  // Primary Navigation tabs (Left Menu)
  const [activeTab, setActiveTab] = useState<'workspace' | 'ide' | 'syllabus' | 'canteen' | 'certificates' | 'report'>('workspace');
  
  // Secondary Sub-navigation tab states (Top Horizontal Bar)
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'metrics' | 'ask'>('metrics');
  const [syllabusSubTab, setSyllabusSubTab] = useState<'tracking' | 'receipt'>('tracking');

  const [doubtText, setDoubt] = useState('');
  const [doubtsLog, setLog] = useState([
    { q: 'How does operator precedence function for mixed brackets?', ans: 'Prof. Vikram: Check module configuration values for expression priority.' },
  ]);

  // Grievance State
  const [reportMsg, setReportMsg] = useState('');
  const [reportPhoto, setReportPhoto] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'encrypting' | 'sent'>('idle');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrent(user);
    setSubjects(getSubjects());
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText) return;
    setLog([{ q: doubtText, ans: 'Pending instructor resolution queue...' }, ...doubtsLog]);
    setDoubt('');
    // Auto switch sub tab view to observe question log
    setWorkspaceSubTab('ask');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 pb-20 relative overflow-x-hidden font-sans">
      {/* Subtle Background Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Header Container Bar */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-black text-xs shadow-md shadow-cyan-500/20">
              STU
            </div>
            <div>
              <span className="font-bold text-lg block text-white">
                Student Portal
              </span>
              <span className="text-sm text-cyan-400 block font-medium">
                Welcome, {currentUser?.name || 'Aarav Nikam'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 font-medium">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Academic Account Access</span>
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

      {/* Main Framework Container layout */}
      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8 relative z-10 items-start">
        
        {/* Left Vertical Menu Switcher Sidebar */}
        <div className="w-full lg:w-72 shrink-0 p-4 rounded-3xl border border-white/10 bg-[#080d1a]/90 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-20">
          <div className="px-4 pb-3 border-b border-white/10 mb-4">
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wide block">
              Student Menu
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Workspace Overview */}
            <button
              onClick={() => setActiveTab('workspace')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'workspace' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp size={18} className="shrink-0" />
              <span className="truncate">Dashboard</span>
            </button>

            {/* IDE Launchpad */}
            <button
              onClick={() => setActiveTab('ide')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'ide' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 size={18} className="shrink-0" />
              <span className="truncate">Code Editor</span>
            </button>

            {/* Syllabus Overview */}
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'syllabus' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={18} className="shrink-0" />
              <span className="truncate">My Syllabus</span>
            </button>

            {/* Canteen */}
            <button
              onClick={() => setActiveTab('canteen')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'canteen' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Coffee size={18} className="shrink-0" />
              <span className="truncate">Canteen Order</span>
            </button>

            {/* Certificates */}
            <button
              onClick={() => setActiveTab('certificates')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'certificates' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={18} className="shrink-0" />
              <span className="truncate">Certificates</span>
            </button>

            {/* Anti-Ragging */}
            <button
              onClick={() => setActiveTab('report')}
              className={`w-full mt-4 px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'report' 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert size={18} className="shrink-0 text-red-400" />
              <span className="truncate text-red-400">Report Incident</span>
            </button>
          </div>
        </div>

        {/* Right Content Panels */}
        <div className="grow min-w-0 w-full space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: STUDENT WORKSPACE                                  */}
          {/* ========================================================= */}
          {activeTab === 'workspace' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Bar */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setWorkspaceSubTab('metrics')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    workspaceSubTab === 'metrics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>📈 Quick Metrics</span>
                </button>
                <button
                  onClick={() => setWorkspaceSubTab('ask')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    workspaceSubTab === 'ask' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle size={14} />
                  <span>💬 Ask Questions to Faculty</span>
                </button>
              </div>

              {workspaceSubTab === 'metrics' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Quick Stat Blocks from live store */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="glass p-5 rounded-3xl border-white/5">
                      <span className="text-xs text-slate-400 block font-medium">Attendance</span>
                      <span className={`text-3xl font-black mt-1 block ${(currentUser?.attendancePct ?? 0) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{currentUser?.attendancePct ?? 0}%</span>
                      {(currentUser?.attendancePct ?? 0) < 75 && <span className="text-[10px] text-red-400 block mt-0.5 font-bold">⚠ Below 75% shortfall</span>}
                    </div>
                    <div className="glass p-5 rounded-3xl border-white/5">
                      <span className="text-xs text-slate-400 block font-medium">CGPA</span>
                      <span className="text-3xl font-black text-cyan-400 mt-1 block">{currentUser?.cgpa ?? 'N/A'}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Sem {currentUser?.semesterNo ?? 1}</span>
                    </div>
                    <div className="glass p-5 rounded-3xl border-white/5">
                      <span className="text-xs text-slate-400 block font-medium">Fee Status</span>
                      <span className={`text-2xl font-black mt-1 block ${currentUser?.feeStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>{currentUser?.feeStatus ?? 'N/A'}</span>
                      {currentUser?.feeDue ? <span className="text-[10px] text-amber-400 block mt-0.5">Due: ₹{currentUser.feeDue.toLocaleString()}</span> : null}
                    </div>
                    <div className="glass p-5 rounded-3xl border-white/5">
                      <span className="text-xs text-slate-400 block font-medium">Leave Balance</span>
                      <span className="text-3xl font-black text-indigo-400 mt-1 block">{currentUser?.leaveBalance ?? 0}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">days remaining</span>
                    </div>
                  </div>

                  {/* Syllabus downloads references */}
                  <div className="glass p-6 rounded-3xl border-white/5 space-y-4 max-w-xl">
                    <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2">
                      <BookOpen size={16} className="text-cyan-400" />
                      <span>Syllabus & Handouts</span>
                    </h3>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-slate-500" />
                          <span className="text-xs font-bold text-white">Programming_Logic_Guide.pdf</span>
                        </div>
                        <span className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer">Download</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-slate-500" />
                          <span className="text-xs font-bold text-white">Algorithms_And_Arrays_Review.md</span>
                        </div>
                        <span className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer">Download</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {workspaceSubTab === 'ask' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left Form widget */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2">
                        <MessageSquare size={16} className="text-cyan-400" />
                        <span>Ask a Question</span>
                      </h3>

                      <form onSubmit={handleAskDoubt} className="space-y-3 pt-1">
                        <div>
                          <textarea
                            required
                            rows={3}
                            value={doubtText}
                            onChange={(e) => setDoubt(e.target.value)}
                            placeholder="Ask instructors about coding tasks, logic errors, or syllabus expectations..."
                            className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-cyan-400 focus:outline-none text-xs leading-relaxed resize-none text-white"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider transition-all block mt-2"
                        >
                          Submit Question directly
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Logged responses history */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider border-b border-white/5 pb-2">
                        Resolved Questions Pipeline
                      </span>
                      <div className="space-y-2.5">
                        {doubtsLog.map((log, i) => (
                          <div key={i} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                            <span className="text-xs font-bold text-white block">Q: {log.q}</span>
                            <span className="text-[11px] text-cyan-300 block bg-cyan-500/5 p-2.5 rounded-xl border border-cyan-500/10">
                              {log.ans}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CODING SANDBOX IDE                                 */}
          {/* ========================================================= */}
          {activeTab === 'ide' && (
            <div className="glass p-8 rounded-3xl border-cyan-500/20 relative overflow-hidden animate-fade-in max-w-3xl mx-auto space-y-6">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold uppercase tracking-wider block w-max mb-3 border border-cyan-500/20">
                    ⚡ Integrated Coding Lab
                  </span>
                  <h2 className="text-xl font-black text-white">Interactive Coding Lab Workspace</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    Write answers using standard programming constructs. The built-in testing system evaluates your logic instantly for fast review.
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                  <Code2 size={24} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-400 space-y-1">
                <div className="text-white font-bold">// Active Lab Assignment:</div>
                <div className="text-cyan-300">Assignment #104: Iterative Searching Logic</div>
              </div>

              <Link
                href="/problems"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md block text-center"
              >
                <span>Launch Interactive Coding IDE</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SYLLABUS OVERVIEW                                  */}
          {/* ========================================================= */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Switcher */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setSyllabusSubTab('tracking')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    syllabusSubTab === 'tracking' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={14} />
                  <span>📖 Active Courses Mapped</span>
                </button>
                <button
                  onClick={() => setSyllabusSubTab('receipt')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    syllabusSubTab === 'receipt' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt size={14} />
                  <span>📜 Download Fee Clearance</span>
                </button>
              </div>

              {syllabusSubTab === 'tracking' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">Enrolled Syllabus Courses Progress</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Real-time status synced continuously with teacher delivery schedules</p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-xs text-cyan-300 font-bold border border-cyan-500/20">
                      Enrolled Count: {subjects.length} Courses
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjects.map(s => (
                      <div key={s.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-xs font-black text-white block">{s.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-cyan-300 shrink-0">
                              {s.code}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400 block mb-3">
                            Instructor Authority: <strong className="text-cyan-300 font-sans">{s.teacherName || 'Allocated Staff'}</strong>
                          </span>

                          {/* Progress Coverage Indicator */}
                          <div className="space-y-1.5 mb-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">Syllabus Delivered</span>
                              <span className="font-bold text-cyan-300">{s.syllabusCoveredPct}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${s.syllabusCoveredPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Module subunit breakdown */}
                          <div className="space-y-1.5 bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                              Delivered Sub-Units
                            </span>
                            {s.modules.map((m, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.completed ? 'bg-cyan-400' : 'bg-white/10'}`} />
                                <span className={`truncate ${m.completed ? 'text-slate-400 line-through' : 'text-slate-300'}`}>{m.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {syllabusSubTab === 'receipt' && (
                <div className="glass p-6 rounded-3xl border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl mx-auto animate-fade-in bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Download Institutional Fee Statement
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Generate official documents verifying status for local submission.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-2"
                  >
                    <span>Print Receipt</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CANTEEN                                            */}
          {/* ========================================================= */}
          {activeTab === 'canteen' && (
            <div className="glass p-8 rounded-3xl border-cyan-500/20 relative overflow-hidden animate-fade-in max-w-3xl mx-auto space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Canteen Menu</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    Order food directly from the canteen using your wallet balance.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <Coffee size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Wallet: ₹{currentUser?.canteenWalletBalance || 0}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2 mb-2">
                  <span>Veg Biryani</span>
                  <button 
                    onClick={() => {
                      if (currentUser && placeCanteenOrder(currentUser.id, 'Veg Biryani', 60)) {
                        alert('Order Placed Successfully! ₹60 deducted.');
                        setCurrent(getUsers().find(u => u.id === currentUser.id) || null);
                      } else {
                        alert('Insufficient Balance!');
                      }
                    }}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded font-bold text-xs hover:bg-cyan-500/30">
                    Buy (₹60)
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Cold Coffee</span>
                  <button 
                    onClick={() => {
                      if (currentUser && placeCanteenOrder(currentUser.id, 'Cold Coffee', 45)) {
                        alert('Order Placed Successfully! ₹45 deducted.');
                        setCurrent(getUsers().find(u => u.id === currentUser.id) || null);
                      } else {
                        alert('Insufficient Balance!');
                      }
                    }}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded font-bold text-xs hover:bg-cyan-500/30">
                    Buy (₹45)
                  </button>
                </div>
              </div>

              {/* Generate Portfolio CTA */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-400" />
                    Public Web3 Portfolio
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Generate a shareable link containing your AST Labs, Grades, and Certificates.</p>
                </div>
                <Link 
                  href={`/portfolio/${currentUser?.id}`}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all whitespace-nowrap"
                  target="_blank"
                >
                  View Live Resume
                </Link>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CERTIFICATES                                       */}
          {/* ========================================================= */}
          {activeTab === 'certificates' && (
            <div className="glass p-8 rounded-3xl border-cyan-500/20 relative overflow-hidden animate-fade-in max-w-4xl mx-auto space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Web3 Credentials</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    Soulbound tokens securely permanently verifying your academic achievements.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(currentUser?.certificates || []).map(cert => (
                  <div key={cert.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />
                    
                    <ShieldCheck size={20} className="text-cyan-400 mb-3" />
                    <h3 className="text-sm font-bold text-white mb-1">{cert.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mb-4">Issued: {cert.date}</p>
                    
                    <div className="p-2 rounded-lg bg-black border border-white/5 font-mono text-[9px] text-green-400 break-all">
                      Tx: {cert.txHash}
                    </div>
                  </div>
                ))}
                {(!currentUser?.certificates || currentUser.certificates.length === 0) && (
                  <div className="col-span-full p-8 text-center bg-black/20 rounded-2xl text-slate-500 text-sm">
                    No Web3 credentials minted yet. Keep crushing those AST labs!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: ANONYMOUS ANTI-RAGGING                             */}
          {/* ========================================================= */}
          {activeTab === 'report' && (
            <div className="glass p-8 rounded-3xl border-red-500/30 relative overflow-hidden animate-fade-in max-w-3xl mx-auto space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-red-400 flex items-center gap-2">
                    <ShieldAlert size={24} />
                    Secure Incident Report
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    Report bullying or ragging strictly anonymously. Your identity and IP address are stripped before transmission.
                  </p>
                </div>
              </div>

              {reportStatus === 'idle' && (
                <div className="space-y-4">
                  <textarea 
                    value={reportMsg}
                    onChange={e => setReportMsg(e.target.value)}
                    placeholder="Describe the incident securely..."
                    className="w-full h-32 p-4 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-red-400 transition-colors"
                  />
                  
                  <button 
                    onClick={() => setReportPhoto(!reportPhoto)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      reportPhoto ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Camera size={16} />
                    {reportPhoto ? 'Photo Evidence Attached' : 'Attach Photo Evidence'}
                  </button>

                  <button 
                    onClick={() => {
                      if (!reportMsg) return;
                      setReportStatus('encrypting');
                      setTimeout(() => {
                        submitAnonymousGrievance(reportMsg, reportPhoto ? 'mock_photo_data_url' : undefined);
                        setReportStatus('sent');
                        setTimeout(() => {
                          setReportStatus('idle');
                          setReportMsg('');
                          setReportPhoto(false);
                        }, 5000);
                      }, 2500);
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:opacity-90 text-white font-black text-xs uppercase tracking-wider transition-all"
                  >
                    Encrypt & Submit Anonymously
                  </button>
                </div>
              )}

              {reportStatus === 'encrypting' && (
                <div className="p-6 rounded-xl bg-black border border-red-500/20 font-mono text-xs text-red-400 space-y-2">
                  <div className="animate-pulse">{'>'} Initializing AES-256-GCM Protocol...</div>
                  <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>{'>'} Stripping User Metadata & JWT Tokens...</div>
                  <div className="animate-pulse" style={{ animationDelay: '1s' }}>{'>'} Encrypting Payload Buffer...</div>
                  <div className="animate-pulse" style={{ animationDelay: '1.5s' }}>{'>'} Routing via Secure Tor Node proxy...</div>
                  <div className="text-center mt-4">
                    <ShieldAlert size={32} className="mx-auto text-red-500 animate-bounce" />
                  </div>
                </div>
              )}

              {reportStatus === 'sent' && (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-emerald-400 font-bold">Transmission Secured</h3>
                  <p className="text-xs text-slate-300">Your report has been received by the Warden. Your identity remains 100% anonymous.</p>
                </div>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
