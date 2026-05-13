'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Users, 
  CheckCircle2, 
  Cpu, 
  LogOut, 
  ShieldAlert, 
  Send, 
  FileText,
  AlertTriangle,
  Building2,
  BookOpen,
  Sparkles,
  TrendingUp,
  FileCheck,
  PlusCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUsers, getSubjects, getCurrentUser, setCurrentUser, addUser, UserRecord, SubjectRecord } from '@/lib/store';

export default function HodDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [department, setDepartment] = useState('Computer Science');
  const [faculty, setFaculty] = useState<UserRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  
  // Primary Navigation tabs (Left Menu)
  const [activeTab, setActiveTab] = useState<'overview' | 'directives' | 'syllabus' | 'faculty'>('overview');
  
  // Secondary Sub-navigation tab states (Top Horizontal Bar)
  const [overviewSubTab, setOverviewSubTab] = useState<'metrics' | 'guidelines'>('metrics');
  const [directiveSubTab, setDirectiveSubTab] = useState<'send' | 'history'>('send');
  const [syllabusSubTab, setSyllabusSubTab] = useState<'tracking' | 'summary'>('tracking');
  const [facultySubTab, setFacultySubTab] = useState<'list' | 'create' | 'load'>('list');

  // Directive Form state
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveBody, setDirectiveBody] = useState('');
  const [targetScope, setTargetScope] = useState('all');
  const [directives, setDirectives] = useState([
    { id: 'd1', title: 'Midterm Evaluation Preparation Checklist', scope: 'All Subject Faculty', date: '2026-05-12', active: true },
    { id: 'd2', title: 'Final Review Guidelines for Lab Scoring', scope: 'Class Teachers', date: '2026-05-10', active: true }
  ]);
  const [successMsg, setSuccessMsg] = useState('');

  // New Teacher creation state
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState<'teacher' | 'classteacher' | 'subjectteacher'>('teacher');
  const [newTeacherSection, setNewTeacherSection] = useState('CS-A');
  const [newTeacherPassword, setNewTeacherPassword] = useState('teacher123');
  const [teacherSuccessMsg, setTeacherSuccessMsg] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrent(user);
      if (user.department) setDepartment(user.department);
    }
    
    // Load state
    const allUsers = getUsers();
    const allSubs = getSubjects();
    
    // Filter faculty belonging to this department
    setFaculty(allUsers.filter(u => 
      (u.role === 'subjectteacher' || u.role === 'classteacher' || u.role === 'teacher') && 
      (!u.department || u.department.toLowerCase() === department.toLowerCase())
    ));
    
    // Filter subjects mapped to this department
    setSubjects(allSubs.filter(s => s.department.toLowerCase() === department.toLowerCase()));
  }, [department]);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleBroadcastDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveTitle) return;
    
    setDirectives([
      { 
        id: String(Date.now()), 
        title: directiveTitle, 
        scope: targetScope === 'all' ? 'All Department Faculty' : targetScope === 'ct' ? 'Class Teachers' : 'Subject Teachers', 
        date: new Date().toISOString().split('T')[0], 
        active: true 
      },
      ...directives
    ]);
    
    setSuccessMsg(`Announcement sent successfully to [${targetScope === 'all' ? 'All Faculty' : targetScope.toUpperCase()}].`);
    setDirectiveTitle('');
    setDirectiveBody('');
    
    // Switch to history to view newly pushed directive
    setDirectiveSubTab('history');

    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName || !newTeacherEmail) return;

    const added = addUser({
      name: newTeacherName,
      email: newTeacherEmail,
      role: newTeacherRole,
      password: newTeacherPassword || 'password',
      department: department, // Automatically map to the HOD's active managed department!
      section: newTeacherSection,
    });

    // Refresh localized state list
    setFaculty(getUsers().filter(u => 
      (u.role === 'subjectteacher' || u.role === 'classteacher' || u.role === 'teacher') && 
      (!u.department || u.department.toLowerCase() === department.toLowerCase())
    ));

    setTeacherSuccessMsg(`Teacher profile "${added.name}" successfully created and mapped to ${department}!`);
    setNewTeacherName('');
    setNewTeacherEmail('');
    setNewTeacherPassword('teacher123');

    setTimeout(() => setTeacherSuccessMsg(''), 6000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-fuchsia-500/30 pb-20 relative overflow-x-hidden font-sans">
      {/* Subtle Background Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-fuchsia-950/25 via-purple-950/10 to-transparent pointer-events-none blur-3xl" />

      {/* Sticky Glassmorphic Header */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-400 to-purple-500 flex items-center justify-center font-black text-black text-xs shadow-md shadow-fuchsia-500/20">
              {currentUser?.role === 'vicehod' ? 'VHOD' : 'HOD'}
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block bg-gradient-to-r from-white via-slate-100 to-fuchsia-200 bg-clip-text text-transparent">
                {currentUser?.role === 'vicehod' ? 'Vice HOD Portal' : 'Head of Department Portal'}
              </span>
              <span className="text-[10px] text-fuchsia-400 block font-semibold">
                Managing Department: {department}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-slate-400 border border-white/5 font-medium">
              <Sparkles size={11} className="text-fuchsia-400" />
              <span>Department Supervisor Access</span>
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

      {/* Main Container Layout with Left Sidebar */}
      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8 relative z-10 items-start">
        
        {/* Left Navigation Sidebar */}
        <div className="w-full lg:w-72 shrink-0 p-4 rounded-3xl border border-white/10 bg-[#080d1a]/90 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-20">
          <div className="px-2 pb-1 border-b border-white/5">
            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider block">
              Department Control
            </span>
            <span className="text-xs text-slate-400 block mt-0.5 font-medium">
              Academic Oversight
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Overview Button */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={16} className="shrink-0" />
              <span className="truncate">Department Overview</span>
            </button>

            {/* Directives Button */}
            <button
              onClick={() => setActiveTab('directives')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'directives' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send size={16} className="shrink-0" />
              <span className="truncate">Announcements</span>
            </button>

            {/* Syllabus Tracking */}
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'syllabus' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={16} className="shrink-0" />
              <span className="truncate">Syllabus Progress</span>
            </button>

            {/* Faculty List */}
            <button
              onClick={() => setActiveTab('faculty')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'faculty' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={16} className="shrink-0" />
              <span className="truncate">Faculty Registry ({faculty.length})</span>
            </button>
          </div>
        </div>

        {/* Right Content Workspace */}
        <div className="grow min-w-0 w-full space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: DEPARTMENT OVERVIEW                                */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setOverviewSubTab('metrics')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    overviewSubTab === 'metrics' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>📊 Core Metrics</span>
                </button>
                <button
                  onClick={() => setOverviewSubTab('guidelines')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    overviewSubTab === 'guidelines' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCheck size={14} />
                  <span>📋 Operational Guidelines</span>
                </button>
              </div>

              {overviewSubTab === 'metrics' && (
                <div className="glass p-6 rounded-3xl border-fuchsia-500/20 bg-gradient-to-b from-white/[0.02] to-transparent space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Cpu size={14} className="text-fuchsia-400" />
                    <span>Department Performance Summary</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block font-medium">Lab Success Passing Rate</span>
                      <span className="text-2xl font-black text-emerald-400 mt-1 block">98.4%</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Based on automated testing benchmarks</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <span className="text-xs text-slate-400 block font-medium">Active Subjects Offered</span>
                      <span className="text-2xl font-black text-fuchsia-400 mt-1 block">{subjects.length} Courses</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Assigned across student streams</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-xs text-fuchsia-300 leading-relaxed font-medium">
                    📊 Live code checks execute securely inside virtual evaluation systems to track actual progress without configuration delays.
                  </div>
                </div>
              )}

              {overviewSubTab === 'guidelines' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in text-xs text-slate-300">
                  <h3 className="text-sm font-bold text-white">📋 Institutional Operating Guidelines</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <strong className="text-fuchsia-300 block mb-1">1. Weekly Progress Review</strong>
                      Ensure all subject teachers submit completion records through their portals by every Friday afternoon.
                    </div>
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                      <strong className="text-fuchsia-300 block mb-1">2. Class Teacher Supervision</strong>
                      Class teachers retain primary scope authority to manage leave sanctions and mid-term student assessment records.
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ANNOUNCEMENTS DIRECTIVES                           */}
          {/* ========================================================= */}
          {activeTab === 'directives' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setDirectiveSubTab('send')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    directiveSubTab === 'send' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Send size={14} />
                  <span>📢 Send Announcement</span>
                </button>
                <button
                  onClick={() => setDirectiveSubTab('history')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    directiveSubTab === 'history' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText size={14} />
                  <span>📜 Announcement History</span>
                </button>
              </div>

              {directiveSubTab === 'send' && (
                <div className="max-w-xl mx-auto glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center shrink-0">
                      <Send size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Send Announcement to Faculty</h2>
                      <p className="text-xs text-slate-400">Instantly share updates with instructors</p>
                    </div>
                  </div>

                  {successMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2 animate-fade-in">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleBroadcastDirective} className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Announcement Title
                      </label>
                      <input 
                        type="text"
                        required
                        value={directiveTitle}
                        onChange={(e) => setDirectiveTitle(e.target.value)}
                        placeholder="e.g. Mandatory Lab Verification Timeline Update"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-fuchsia-400 focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Message Content
                      </label>
                      <textarea 
                        rows={3}
                        required
                        value={directiveBody}
                        onChange={(e) => setDirectiveBody(e.target.value)}
                        placeholder="Provide details regarding delivery tracking checks..."
                        className="w-full p-3 rounded-xl bg-black/60 border border-white/10 focus:border-fuchsia-400 focus:outline-none text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Target Audience
                      </label>
                      <select
                        value={targetScope}
                        onChange={(e) => setTargetScope(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs font-bold text-fuchsia-400 focus:outline-none cursor-pointer"
                      >
                        <option value="all">📢 All Department Instructors</option>
                        <option value="st">👨‍🏫 Subject Teachers Only</option>
                        <option value="ct">⭐ Class Teachers Only</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      Publish Announcement
                    </button>
                  </form>
                </div>
              )}

              {directiveSubTab === 'history' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-2xl mx-auto">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-white/5 pb-2">
                    Published Announcements History
                  </span>
                  <div className="space-y-3">
                    {directives.map(d => (
                      <div key={d.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-white block">{d.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Audience Scope: {d.scope}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 shrink-0 w-fit">
                          {d.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SYLLABUS TRACKING                                  */}
          {/* ========================================================= */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setSyllabusSubTab('tracking')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    syllabusSubTab === 'tracking' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={14} />
                  <span>📚 Course Completion Trackers</span>
                </button>
                <button
                  onClick={() => setSyllabusSubTab('summary')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    syllabusSubTab === 'summary' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>📋 Overview Statement</span>
                </button>
              </div>

              {syllabusSubTab === 'tracking' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">Supervise Course Progress</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Verify updates managed actively by designated instructors</p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-xs text-fuchsia-300 font-bold border border-fuchsia-500/20">
                      Active Syllabi: {subjects.length}
                    </span>
                  </div>

                  {subjects.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-black/30 border border-white/5">
                      No matching subjects configured under this department yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {subjects.map(s => (
                        <div key={s.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-fuchsia-500/30 transition-all space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white">{s.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">
                                  {s.code}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                Assigned Instructor: <strong className="text-fuchsia-300 font-sans">{s.teacherName || '⚠️ Not Linked'}</strong>
                              </span>
                            </div>

                            <span className="text-xs font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2.5 py-1 rounded-lg border border-fuchsia-500/20 shrink-0">
                              {s.syllabusCoveredPct}% Covered
                            </span>
                          </div>

                          {/* Coverage Bar */}
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-gradient-to-r from-fuchsia-400 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${s.syllabusCoveredPct}%` }}
                            />
                          </div>

                          {/* Unit checklist */}
                          <div className="space-y-1.5 pt-2 border-t border-white/5 bg-black/30 p-2.5 rounded-xl">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">
                              Module Units
                            </span>
                            {s.modules.map((m, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.completed ? 'bg-fuchsia-400' : 'bg-white/10'}`} />
                                <span className={`truncate ${m.completed ? 'text-slate-400 line-through' : 'text-slate-300'}`}>
                                  {m.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {syllabusSubTab === 'summary' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
                  <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">📋 Department Syllabus Summary</h3>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Total Supervised Courses</span>
                      <span className="font-bold text-white">{subjects.length} Courses</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Fully Completed Courses</span>
                      <span className="font-bold text-emerald-400">
                        {subjects.filter(s => s.syllabusCoveredPct === 100).length}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Ongoing Course Modules</span>
                      <span className="font-bold text-cyan-300">
                        {subjects.filter(s => s.syllabusCoveredPct < 100).length}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: FACULTY REGISTRY                                   */}
          {/* ========================================================= */}
          {activeTab === 'faculty' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Switcher */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setFacultySubTab('list')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    facultySubTab === 'list' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>👥 Assigned Instructors</span>
                </button>
                <button
                  onClick={() => setFacultySubTab('create')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    facultySubTab === 'create' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PlusCircle size={14} />
                  <span>➕ Add Teacher Account</span>
                </button>
                <button
                  onClick={() => setFacultySubTab('load')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    facultySubTab === 'load' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 size={14} />
                  <span>🏢 Delegation Summary</span>
                </button>
              </div>

              {facultySubTab === 'list' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-2xl mx-auto">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Assigned Department Faculty Registry
                    </h3>
                    <span className="text-xs font-bold text-fuchsia-400">
                      Total Allocated: {faculty.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {faculty.map(f => (
                      <div key={f.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
                        <div>
                          <span className="text-xs font-bold text-white block">{f.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{f.email}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded capitalize shrink-0 ${
                          f.role === 'classteacher' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        }`}>
                          {f.role === 'classteacher' ? 'Class Teacher' : f.role === 'subjectteacher' ? 'Subject Teacher' : f.role}
                        </span>
                      </div>
                    ))}
                  </div>

                  {faculty.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 italic bg-black/30 rounded-xl">
                      No faculty members explicitly allocated to this department yet. Manage records using the central Administration Portal.
                    </div>
                  )}
                </div>
              )}

              {facultySubTab === 'create' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <PlusCircle size={16} className="text-fuchsia-400" />
                      <span>Provision Teacher Profile</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Create a dedicated instructor account directly bound to the <strong className="text-fuchsia-300">{department}</strong> department.
                    </p>
                  </div>

                  {teacherSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2 animate-fade-in">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <span>{teacherSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateTeacher} className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                      <input 
                        type="text"
                        required
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="e.g. Dr. Ramesh Kumar"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email Address (Sign-In ID)</label>
                      <input 
                        type="email"
                        required
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        placeholder="e.g. ramesh.k@campuscore.edu"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Instructor Role</label>
                        <select
                          value={newTeacherRole}
                          onChange={(e) => setNewTeacherRole(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs font-bold text-fuchsia-300 focus:outline-none cursor-pointer"
                        >
                          <option value="teacher">Standard Faculty</option>
                          <option value="subjectteacher">Subject Teacher</option>
                          <option value="classteacher">Class Teacher</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Primary Class Section</label>
                        <input 
                          type="text"
                          required
                          value={newTeacherSection}
                          onChange={(e) => setNewTeacherSection(e.target.value)}
                          placeholder="e.g. CS-A"
                          className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-fuchsia-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Temporary Portal Password</label>
                      <input 
                        type="text"
                        required
                        value={newTeacherPassword}
                        onChange={(e) => setNewTeacherPassword(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-fuchsia-400 font-mono"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">Instructor can use this key to authenticate instantly</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider transition-all block mt-2 shadow-md"
                    >
                      Provision Instructor Profile
                    </button>
                  </form>
                </div>
              )}

              {facultySubTab === 'load' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto text-xs text-slate-400">
                  <h3 className="text-sm font-bold text-white">🏢 Faculty Responsibilities Overview</h3>
                  <p>Instructors configured inside this designated module space maintain real-time evaluation authority for student solution files. Mappings stay strictly persistent locally.</p>
                </div>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
