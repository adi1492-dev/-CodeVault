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
  Camera,
  Bell,
  Bus,
  MapPin,
  Users as UsersIcon,
  Search,
  Globe,
  Monitor,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, setCurrentUser, getSubjects, getUsers, placeCanteenOrder, submitAnonymousGrievance, UserRecord, SubjectRecord, getAlerts, markAlertRead, AlertRecord } from '@/lib/store';
import CollaborativeIDE from '@/components/CollaborativeIDE';
import ExamInterface from '@/components/ExamInterface';

export default function StudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [selectedCertModal, setSelectedCertModal] = useState<{ id: string; name: string; txHash: string; date: string; issuerName?: string; photoUrl?: string; description?: string; signerName?: string } | null>(null);
  const [activeCanteenOrder, setActiveCanteenOrder] = useState<{ item: string; amount: number; orderNo: string; pickupTime: string } | null>(null);
  const [busEta, setBusEta] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setBusEta(prev => prev > 2 ? prev - 1 : 14);
    }, 8000);
    return () => clearInterval(timer);
  }, []);
  
  // Primary Navigation tabs (Left Menu)
  const [activeTab, setActiveTab] = useState<'workspace' | 'ide' | 'collab' | 'exams' | 'syllabus' | 'canteen' | 'certificates' | 'report' | 'transport'>('workspace');
  
  // Secondary Sub-navigation tab states (Top Horizontal Bar)
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'metrics' | 'ask'>('metrics');
  const [collabSubTab, setCollabSubTab] = useState<'explore' | 'active'>('explore');
  const [syllabusSubTab, setSyllabusSubTab] = useState<'tracking' | 'receipt'>('tracking');

  // Collaboration State
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [exploreRooms, setExploreRooms] = useState([
    { id: 'ROOM-102', name: 'DSA Group Study', creator: 'Ananya S.', lang: 'C++', members: 3, tags: ['DSA', 'Pointers'] },
    { id: 'LAB-402', name: 'Compiler Project', creator: 'Vikram K.', lang: 'C', members: 5, tags: ['Compiler', 'AST'] },
    { id: 'WEB-301', name: 'Frontend Workshop', creator: 'Sneha R.', lang: 'HTML', members: 2, tags: ['React', 'CSS'] },
  ]);

  const [doubtText, setDoubt] = useState('');
  const [doubtsLog, setLog] = useState([
    { q: 'How does operator precedence function for mixed brackets?', ans: 'Prof. Vikram: Check module configuration values for expression priority.' },
    { q: 'Can k-epsilon turbulence iterations be run locally on standard sandbox nodes?', ans: 'Dr. Anjali: Yes, decrease grid density resolution coefficients below 0.05.' },
    { q: 'Are we permitted to use external cloud API wrappers for final semester evaluation submittals?', ans: 'Prof. S. Mehta: Absolutely, provided IAM tokens are explicitly masked.' },
    { q: 'What causes intermittent memory paging faults during extreme matrix allocation tests?', ans: 'Dr. Ramesh: Verify stack pointers alignment boundaries match word intervals.' }
  ]);

  // Grievance State
  const [reportMsg, setReportMsg] = useState('');
  const [reportPhoto, setReportPhoto] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'encrypting' | 'sent'>('idle');

  const loadAlerts = () => {
    if (currentUser) {
      setAlerts(getAlerts(currentUser.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrent(user);
    setSubjects(getSubjects());
  }, []);

  useEffect(() => {
    loadAlerts();
    window.addEventListener('campuscore_alerts_refresh', loadAlerts);
    return () => window.removeEventListener('campuscore_alerts_refresh', loadAlerts);
  }, [currentUser]);

  const handleMarkAlertRead = (id: string) => {
    markAlertRead(id);
    loadAlerts();
  };

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
    <div className="min-h-screen bg-[#0a0b10] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              EDU
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Student Portal</h1>
              <p className="text-[10px] text-slate-500 font-medium">
                Welcome, {currentUser?.name || 'Aarav Nikam'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 font-medium">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Academic Account Access</span>
            </span>

            <button 
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5 relative"
            >
              <Bell size={16} />
              {alerts.some(a => !a.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {isAlertsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 glass rounded-2xl border-white/10 shadow-2xl overflow-hidden z-50 bg-[#080d1a]">
                <div className="p-3 border-b border-white/5 bg-white/5">
                  <span className="text-sm font-bold text-white">Notifications</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No alerts found</div>
                  ) : (
                    alerts.map(a => (
                      <div key={a.id} className={`p-3 border-b border-white/5 ${a.read ? 'bg-black/20' : 'bg-indigo-500/10'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-xs font-bold ${a.type === 'fee' ? 'text-amber-400' : a.type === 'attendance' ? 'text-red-400' : 'text-blue-400'}`}>{a.title}</span>
                            <p className="text-[10px] text-slate-300 mt-1">{a.message}</p>
                          </div>
                          {!a.read && (
                            <button onClick={() => handleMarkAlertRead(a.id)} className="text-[10px] text-indigo-300 hover:text-indigo-200">
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Main Navigation
          </div>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'workspace' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp size={18} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('ide')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'ide' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu size={18} />
            <span>Practice Arena</span>
          </button>
          <button
            onClick={() => setActiveTab('collab')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'collab' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UsersIcon size={18} />
            <span>Collaborative Lab</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'exams' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield size={18} />
            <span>Examinations</span>
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'syllabus' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={18} />
            <span>Syllabus</span>
          </button>
          <button
            onClick={() => setActiveTab('canteen')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'canteen' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Coffee size={18} />
            <span>Canteen</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'certificates' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award size={18} />
            <span>Certificates</span>
          </button>
          
          <div className="pt-4 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Reporting
          </div>
          <button
            onClick={() => setActiveTab('report')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'report' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' 
                : 'text-red-400 hover:text-white hover:bg-red-500/10'
            }`}
          >
            <ShieldAlert size={18} />
            <span>Report Incident</span>
          </button>
        </aside>

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#14161e] p-5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Attendance</span>
                      <div className="flex items-end gap-2 mt-1">
                        <span className={`text-2xl font-bold ${(currentUser?.attendancePct ?? 0) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{currentUser?.attendancePct ?? 0}%</span>
                        {(currentUser?.attendancePct ?? 0) < 75 && <span className="text-[10px] text-red-500 font-bold pb-1 underline decoration-red-500/30">Shortfall</span>}
                      </div>
                    </div>
                    <div className="bg-[#14161e] p-5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Academic CGPA</span>
                      <span className="text-2xl font-bold text-white mt-1 block">{currentUser?.cgpa ?? 'N/A'}</span>
                    </div>
                    <div className="bg-[#14161e] p-5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Fee Status</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xl font-bold ${currentUser?.feeStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>{currentUser?.feeStatus ?? 'N/A'}</span>
                        {currentUser?.feeDue ? <span className="text-[10px] text-slate-500">₹{currentUser.feeDue.toLocaleString()} Due</span> : null}
                      </div>
                    </div>
                    <div className="bg-[#14161e] p-5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Leave Balance</span>
                      <span className="text-2xl font-bold text-white mt-1 block">{currentUser?.leaveBalance ?? 0} <span className="text-xs text-slate-500 font-normal">Days</span></span>
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
          {/* TAB 2.5: COLLABORATIVE LAB                                */}
          {/* ========================================================= */}
          {activeTab === 'collab' && (
            <div className="space-y-6 animate-fade-in">
              {/* Secondary Horizontal Menu Bar */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setCollabSubTab('explore')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    collabSubTab === 'explore' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe size={14} />
                  <span>Explore Rooms</span>
                </button>
                <button
                  onClick={() => setCollabSubTab('active')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    collabSubTab === 'active' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UsersIcon size={14} />
                  <span>Your Sessions</span>
                </button>
              </div>

              {collabSubTab === 'explore' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Create/Join Card */}
                    <div className="md:w-80 shrink-0 space-y-4">
                      <div className="glass p-6 rounded-3xl border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
                        <h3 className="text-sm font-bold text-white mb-4">Start Collaborating</h3>
                        
                        <div className="space-y-3">
                          <button 
                            onClick={() => {
                              const newId = `ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
                              setActiveRoomId(newId);
                            }}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                          >
                            Create New Room
                          </button>
                          
                          <div className="relative py-2 text-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <span className="relative px-2 bg-[#080d1a] text-[10px] text-slate-500 font-bold">OR JOIN EXISTING</span>
                          </div>
                          
                          <div className="space-y-2">
                            <input 
                              value={joinRoomId}
                              onChange={e => setJoinRoomId(e.target.value.toUpperCase())}
                              placeholder="Enter Room ID (e.g. ROOM-102)"
                              className="w-full p-3 rounded-xl bg-black border border-white/10 text-xs text-white focus:border-indigo-400 transition-all outline-none"
                            />
                            <button 
                              onClick={() => {
                                if (joinRoomId) setActiveRoomId(joinRoomId);
                              }}
                              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
                            >
                              Join Session
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="glass p-5 rounded-2xl border-white/5 text-center">
                        <Monitor size={24} className="mx-auto text-indigo-400 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Live Connections</span>
                        <span className="text-xl font-black text-white block mt-1">128 Active</span>
                      </div>
                    </div>

                    {/* Explore Rooms Grid */}
                    <div className="grow space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={16} className="text-indigo-400" />
                          <span>Active Public Hubs</span>
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>LIVE UPDATING</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {exploreRooms.map(room => (
                          <div key={room.id} className="glass p-5 rounded-3xl border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer" onClick={() => setActiveRoomId(room.id)}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <span className="text-[10px] font-bold text-indigo-400 mb-1 block">{room.id}</span>
                                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{room.name}</h4>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                                <UsersIcon size={10} />
                                <span>{room.members}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-4">
                              <span>By {room.creator}</span>
                              <div className="w-1 h-1 rounded-full bg-white/10" />
                              <span className="text-cyan-400">{room.lang}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {room.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-bold text-slate-400 border border-white/5">#{tag}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {collabSubTab === 'active' && (
                <div className="glass p-12 rounded-3xl border-white/5 text-center space-y-4 max-w-xl mx-auto animate-fade-in">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                    <UsersIcon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white">No active sessions found</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You haven't participated in any collaborative labs recently. Create a room to invite your colleagues or join a public session from the Explore tab.
                  </p>
                  <button 
                    onClick={() => setCollabSubTab('explore')}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Return to Explore
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3.5: EXAMINATION HUB                                  */}
          {/* ========================================================= */}
          {activeTab === 'exams' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 glass rounded-[2.5rem] border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                      <Shield size={20} />
                    </div>
                    <h2 className="text-xl font-black text-white">Institutional Examination Center</h2>
                  </div>
                  <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                    Access your scheduled assessments and mid-term evaluations. All sessions are protected by the **CampusCore Integrity Shield** real-time proctoring telemetry.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-4 relative z-10">
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</span>
                        <span className="text-xs font-black text-emerald-400">Hub Online</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold transition-all">
                        View Schedule
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { id: 'EX-101', title: 'Mid-Term Lab Automata Evaluation', dept: 'CS', duration: '60m', status: 'Live Now' },
                    { id: 'EX-102', title: 'Data Structures & Algorithms Final', dept: 'CS', duration: '120m', status: 'Upcoming' },
                    { id: 'EX-103', title: 'Operating Systems Quiz', dept: 'IT', duration: '30m', status: 'Scheduled' }
                ].map((exam, i) => (
                    <div key={exam.id} className="glass p-6 rounded-3xl border-white/5 hover:border-red-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-indigo-400 font-black text-[10px]">
                                {exam.dept}
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                exam.status === 'Live Now' ? 'bg-red-500/20 text-red-400 border border-red-500/20 animate-pulse' : 'bg-white/5 text-slate-500 border border-white/5'
                            }`}>
                                {exam.status}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2 group-hover:text-red-400 transition-colors leading-tight">{exam.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-6">
                            <span>ID: {exam.id}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span>{exam.duration}</span>
                        </div>
                        <button 
                            disabled={exam.status !== 'Live Now'}
                            onClick={() => setActiveExamId(exam.id)}
                            className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                exam.status === 'Live Now' ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                            }`}
                        >
                            {exam.status === 'Live Now' ? 'Enter Examination' : 'Awaiting Window'}
                        </button>
                    </div>
                ))}
              </div>
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

              {/* Active Live Ticket Alert */}
              {activeCanteenOrder && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/30 animate-bounce-short space-y-3 relative">
                  <button onClick={() => setActiveCanteenOrder(null)} className="absolute top-3 right-3 text-xs text-slate-400 hover:text-white">✕</button>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">✅</span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Order successfully queued!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Order Number</span>
                      <span className="font-bold text-white text-sm">{activeCanteenOrder.orderNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Est. Pickup Time</span>
                      <span className="font-bold text-emerald-300 text-sm">{activeCanteenOrder.pickupTime}</span>
                    </div>
                    <div className="col-span-full pt-1">
                      <span className="text-[10px] text-slate-400 block font-mono">Item Ordered</span>
                      <span className="font-bold text-cyan-300">{activeCanteenOrder.item} (₹{activeCanteenOrder.amount})</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2 mb-2">
                  <span>Veg Biryani</span>
                  <button 
                    onClick={() => {
                      if (currentUser) {
                        const res = placeCanteenOrder(currentUser.id, 'Veg Biryani', 60);
                        if (res.success && res.orderNo && res.pickupTime) {
                          setActiveCanteenOrder({ item: 'Veg Biryani', amount: 60, orderNo: res.orderNo, pickupTime: res.pickupTime });
                          setCurrent(getUsers().find(u => u.id === currentUser.id) || null);
                        } else {
                          alert('Insufficient Balance!');
                        }
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
                      if (currentUser) {
                        const res = placeCanteenOrder(currentUser.id, 'Cold Coffee', 45);
                        if (res.success && res.orderNo && res.pickupTime) {
                          setActiveCanteenOrder({ item: 'Cold Coffee', amount: 45, orderNo: res.orderNo, pickupTime: res.pickupTime });
                          setCurrent(getUsers().find(u => u.id === currentUser.id) || null);
                        } else {
                          alert('Insufficient Balance!');
                        }
                      }
                    }}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded font-bold text-xs hover:bg-cyan-500/30">
                    Buy (₹45)
                  </button>
                </div>
              </div>

              {/* Order History Table */}
              {currentUser?.canteenTransactions && currentUser.canteenTransactions.filter(t => t.type === 'debit' && t.orderNo).length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider font-mono">Active Pickups & Order History</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                    {currentUser.canteenTransactions.filter(t => t.type === 'debit' && t.orderNo).reverse().map((tx, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="font-bold text-white block">{tx.item}</span>
                          <span className="text-[10px] text-slate-500">Order: {tx.orderNo}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold block">Pickup: {tx.pickupTime || 'N/A'}</span>
                          <span className="text-[10px] text-slate-500">₹{tx.amount} Paid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            <div className="glass p-8 rounded-3xl border-cyan-500/20 relative overflow-hidden animate-fade-in max-w-5xl mx-auto space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Photographic Web3 Credentials</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                    Soulbound token badges incorporating responsive graphics, complete layout summaries, and verifiable issuing parameters securely bound to your identity.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(currentUser?.certificates || []).map((cert: any) => (
                  <div 
                    key={cert.id} 
                    onClick={() => setSelectedCertModal(cert)}
                    className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    {cert.photoUrl ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-cyan-500/40 transition-all">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={cert.photoUrl} 
                          alt={cert.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
                          <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-amber-400 block">
                            {cert.issuerName || 'CampusCore Academic Authority'}
                          </span>
                          <span className="text-xs font-black text-white truncate block">
                            {cert.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />
                    )}
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 truncate">
                          <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                          <span className="truncate">{cert.name}</span>
                        </span>
                        <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
                          {cert.photoUrl ? '📸 Photo Enclosed' : '🔗 Standard Token'}
                        </span>
                      </div>
                      {cert.description && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {cert.description}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 font-mono">Issued on: {cert.date}</p>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-black border border-white/5 font-mono text-[9px] text-green-400 truncate">
                      Tx: {cert.txHash}
                    </div>
                  </div>
                ))}
                {(!currentUser?.certificates || currentUser.certificates.length === 0) && (
                  <div className="col-span-full p-8 text-center bg-black/20 rounded-2xl text-slate-500 text-sm border border-white/5">
                    No Web3 credentials minted yet. Request bulk validation badges via the administrative distribution interface!
                  </div>
                )}
              </div>

              {/* Certificate Modal Photographic Overlay View */}
              {selectedCertModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                  <div className="relative w-full max-w-4xl bg-[#0b1220] border-4 border-double border-cyan-500/40 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden text-center space-y-6 max-h-[90vh] overflow-y-auto">
                    {/* Corner decorative ambient accents */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-br-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-tl-full pointer-events-none" />
                    
                    {/* Header Ribbon */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase block">
                        {selectedCertModal.issuerName || 'CampusCore Sovereign Academic Hub'}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black text-white font-serif tracking-wide">
                        {selectedCertModal.name}
                      </h3>
                    </div>

                    {/* Photographic Cover if present */}
                    {selectedCertModal.photoUrl && (
                      <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={selectedCertModal.photoUrl} 
                          alt="Certificate Frame" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 text-[9px] text-slate-300 font-mono">
                          Cryptographically Embedded Frame
                        </div>
                      </div>
                    )}

                    {/* Body contents */}
                    <div className="max-w-2xl mx-auto space-y-3 py-3 border-y border-white/5 text-left">
                      <div className="text-center">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                          This permanent digital instrument testifies that
                        </p>
                        <p className="text-xl md:text-2xl font-extrabold text-cyan-300 tracking-tight my-1">
                          {currentUser?.name || 'Student Identity'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed text-center">
                        {selectedCertModal.description || 'Has fulfilled all statutory academic constraints and semantic program evaluation rules established by the institutional engineering board.'}
                      </div>
                    </div>

                    {/* Signatures & Verification blocks */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end pt-2 text-left">
                      <div>
                        <div className="border-b border-white/20 pb-1 mb-1 font-serif text-cyan-400 italic text-xs">
                          {selectedCertModal.issuerName || 'Dr. Ramesh S.'}
                        </div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Signatory Representative</span>
                      </div>

                      <div className="text-center">
                        <div className="inline-block p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400 font-bold">
                          ✓ Soulbound Badge
                        </div>
                        <span className="text-[9px] block text-slate-500 mt-1 font-mono">Date: {selectedCertModal.date}</span>
                      </div>

                      <div className="text-right">
                        <div className="border-b border-white/20 pb-1 mb-1 font-serif text-indigo-400 italic text-xs justify-end flex">
                          Institutional Hub
                        </div>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Polygon Verification Key</span>
                      </div>
                    </div>

                    {/* Footer Tx info */}
                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono bg-black/40 p-3 rounded-xl">
                      <span className="text-[9px] text-green-400 truncate max-w-md block">
                        Tx Hash: {selectedCertModal.txHash}
                      </span>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => window.print()} 
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-1"
                        >
                          🖨️ Print Frame
                        </button>
                        <button 
                          onClick={() => setSelectedCertModal(null)} 
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
                        >
                          ❌ Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

          {/* ========================================================= */}
          {/* TAB 7: LIVE BUS TRACKING MAP                              */}
          {/* ========================================================= */}
          {activeTab === 'transport' && (
            <div className="glass p-6 rounded-3xl border-cyan-500/20 space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Bus size={24} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Live Route Telemetry — Route #04A</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time student transportation GPS polling service</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Vehicle speed</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">42 km/h</span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block">Driver Contact</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Mr. Santosh K.</span>
                  <span className="text-[9px] text-cyan-400 font-mono block">+91 98221 04921</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block">Current Route Status</span>
                  <span className="text-xs font-bold text-cyan-400 block mt-0.5">🟢 En Route</span>
                  <span className="text-[9px] text-slate-500 block">GPS Polling Active</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center animate-pulse">
                  <span className="text-[10px] text-cyan-300 block font-bold">Estimated Arrival</span>
                  <span className="text-xl font-black text-cyan-400 block font-mono">{busEta} Mins</span>
                  <span className="text-[9px] text-cyan-500 block">Next Drop: Gate 2</span>
                </div>
              </div>

              {/* Simulated Graphical GPS Map Interface */}
              <div className="relative w-full h-80 rounded-2xl bg-[#030712] border border-white/10 overflow-hidden flex items-center justify-center">
                {/* Background Grid Patterns */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25" />
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5" />
                
                {/* Simulated Road Line */}
                <div className="absolute top-1/2 left-10 right-10 h-3 bg-slate-800 rounded-full border-y border-slate-700 flex items-center shadow-inner" />
                
                {/* Simulated Route Line Progression */}
                <div 
                  className="absolute top-1/2 left-10 h-3 bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                  style={{ width: `${Math.min(90, Math.max(15, 100 - busEta * 6))}%` }}
                />

                {/* Start Pin */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-white flex items-center justify-center shadow-md">
                    <span className="text-[8px] font-bold text-white">S</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded border border-white/5">Campus Hub</span>
                </div>

                {/* Moving Bus Target Marker */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 z-10 flex flex-col items-center"
                  style={{ left: `calc(2.5rem + ${Math.min(90, Math.max(15, 100 - busEta * 6))}% - 2.5rem)` }}
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-cyan-500 rounded-full animate-ping opacity-40" />
                    <div className="w-8 h-8 rounded-xl bg-cyan-500 border-2 border-white flex items-center justify-center shadow-lg text-black font-black">
                      <Bus size={16} />
                    </div>
                  </div>
                  <div className="mt-2 px-2 py-1 bg-cyan-400 text-black font-black text-[9px] rounded shadow tracking-wider uppercase font-mono whitespace-nowrap">
                    College Bus • {busEta}m left
                  </div>
                </div>

                {/* Destination Pin */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 translate-x-1/2 flex flex-col items-center">
                  <MapPin size={20} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-bounce" />
                  <span className="text-[9px] font-bold text-red-300 mt-1 whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-red-500/20">Drop Stop</span>
                </div>

                {/* HUD Overlay Info Overlay */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                  🛰️ Signal Strength: <strong className="text-cyan-400">Excellent (5/5 Satellites)</strong>
                </div>

                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                  Last Updated: Live
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Collaborative IDE Overlay */}
      {activeRoomId && (
        <CollaborativeIDE 
          roomId={activeRoomId} 
          userName={currentUser?.name || 'Student'} 
          onExit={() => setActiveRoomId(null)} 
        />
      )}

      {/* Exam Interface Overlay */}
      {activeExamId && (
        <ExamInterface 
          examId={activeExamId}
          examTitle="Mid-Term Lab Automata Evaluation"
          userName={currentUser?.name || 'Student'}
          onExit={() => setActiveExamId(null)}
        />
      )}
    </div>
  );
}
