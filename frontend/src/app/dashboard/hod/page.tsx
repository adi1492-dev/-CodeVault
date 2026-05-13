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
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUsers, getSubjects, getCurrentUser, setCurrentUser, UserRecord, SubjectRecord } from '@/lib/store';

export default function HodDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [department, setDepartment] = useState('Computer Science');
  const [faculty, setFaculty] = useState<UserRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  
  // Directive Form state
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveBody, setDirectiveBody] = useState('');
  const [targetScope, setTargetScope] = useState('all');
  const [directives, setDirectives] = useState([
    { id: 'd1', title: 'Mandatory AST Integration Checkpoint', scope: 'All Subject Faculty', date: '2026-05-12', active: true },
    { id: 'd2', title: 'Mid-Term Core Grading Deadline Sanction', scope: 'Class Teachers', date: '2026-05-10', active: true }
  ]);
  const [successMsg, setSuccessMsg] = useState('');

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
      (u.role === 'subjectteacher' || u.role === 'classteacher') && 
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
        scope: targetScope === 'all' ? 'All Faculty Nodes' : targetScope === 'ct' ? 'Class Teachers' : 'Subject Faculty', 
        date: new Date().toISOString().split('T')[0], 
        active: true 
      },
      ...directives
    ]);
    
    setSuccessMsg(`Directive successfully pushed to real-time notification pipelines for [${targetScope.toUpperCase()}].`);
    setDirectiveTitle('');
    setDirectiveBody('');
    
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-fuchsia-500/30 pb-20 relative overflow-x-hidden">
      {/* Deep Fuchsia/Purple Top Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-fuchsia-950/25 via-purple-950/10 to-transparent pointer-events-none" />

      {/* Sticky Glassmorphic Header */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fuchsia-500 to-purple-500 flex items-center justify-center font-black text-black text-xs shadow-md shadow-fuchsia-500/20">
            {currentUser?.role === 'vicehod' ? 'VHOD' : 'HOD'}
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm block">
              {currentUser?.role === 'vicehod' ? 'Department Deputy Supervisory Suite' : 'Department Head Supervisory Suite'}
            </span>
            <span className="text-[10px] font-mono text-fuchsia-400 block">Scope Authority: {department}</span>
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
        
        {/* Left Column: Metrics & Directive Dispatcher */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Department Analytics & AST Execution Health */}
          <div className="glass p-6 rounded-3xl border-fuchsia-500/20 bg-gradient-to-b from-white/[0.02] to-transparent space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu size={14} className="text-fuchsia-400" />
              <span>Department Telemetry & Compilation Pipeline</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 block font-mono">AST PASS RATE</span>
                <span className="text-xl font-black text-emerald-400 font-mono">98.4%</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 block font-mono">ACTIVE MODULES</span>
                <span className="text-xl font-black text-fuchsia-400 font-mono">{subjects.length} Suites</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/10 text-xs text-fuchsia-300 leading-relaxed font-medium">
              📊 Core Micro-C AST Token Trees evaluate directly inside isolated sandbox RAM blocks without network delays.
            </div>
          </div>

          {/* Broadcast Directive to Faculty */}
          <div className="glass p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
                <Send size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold">Dispatch Department Directive</h2>
                <p className="text-xs text-slate-400">Push high-priority orders to faculty interfaces</p>
              </div>
            </div>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleBroadcastDirective} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Directive Title Heading
                </label>
                <input 
                  type="text"
                  required
                  value={directiveTitle}
                  onChange={(e) => setDirectiveTitle(e.target.value)}
                  placeholder="e.g. Midterm Lab Evaluation Checklist Audit"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-fuchsia-400 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Detailed Advisory Content
                </label>
                <textarea 
                  rows={3}
                  required
                  value={directiveBody}
                  onChange={(e) => setDirectiveBody(e.target.value)}
                  placeholder="Specify syllabus milestones or AST pass constraints..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:border-fuchsia-400 focus:outline-none text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Target Broadcast Cohort Scope
                </label>
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/10 focus:border-fuchsia-400 focus:outline-none text-xs font-bold text-fuchsia-400"
                >
                  <option value="all">📢 Full Department Broadcast</option>
                  <option value="st">👨‍🏫 Subject Teachers Only</option>
                  <option value="ct">⭐ Class Teachers Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-fuchsia-500/10"
              >
                Broadcast Advisory Instantly
              </button>
            </form>
          </div>

          {/* Active Broadcasts History Widget */}
          <div className="glass p-5 rounded-3xl border-white/5 space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Active Institutional Directives
            </span>
            <div className="space-y-2">
              {directives.map(d => (
                <div key={d.id} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white block">{d.title}</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Scope: {d.scope}</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 shrink-0">
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Complete Syllabus Supervision & Faculty Mastery Lists */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Detailed Module-by-Module Syllabus Trackers */}
          <div className="glass p-6 rounded-3xl border-fuchsia-500/20 bg-gradient-to-tr from-fuchsia-950/10 via-transparent to-transparent space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold">Granular Syllabus Completion Master</h2>
                  <p className="text-xs text-slate-400">Supervise percentage outputs pushed directly by assigned faculty</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/10 text-[10px] font-mono font-bold text-fuchsia-400 border border-fuchsia-500/20">
                Live DB Sync
              </span>
            </div>

            <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {subjects.map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-fuchsia-500/30 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{s.name}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                          {s.code}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        Assigned Faculty: <strong className="text-fuchsia-300 font-sans">{s.teacherName || '⚠️ Unassigned'}</strong>
                      </span>
                    </div>

                    <span className="text-xs font-mono font-black text-fuchsia-400 bg-fuchsia-500/10 px-2 py-1 rounded border border-fuchsia-500/20">
                      {s.syllabusCoveredPct}% Covered
                    </span>
                  </div>

                  {/* Coverage Tracking Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-fuchsia-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${s.syllabusCoveredPct}%` }}
                    />
                  </div>

                  {/* Detailed Unit Checks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    {s.modules.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                        <span className={`w-3 h-3 rounded flex items-center justify-center shrink-0 text-[8px] font-bold ${
                          m.completed ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : 'bg-white/5 text-slate-600'
                        }`}>
                          {m.completed ? '✓' : ''}
                        </span>
                        <span className={`truncate ${m.completed ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Faculty Directory Supervision Matrix */}
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Department Faculty Registry
                </h3>
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                Total Allocated: {faculty.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faculty.map(f => (
                <div key={f.id} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{f.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 block">{f.email}</span>
                  </div>
                  <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                    f.role === 'classteacher' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {f.role === 'classteacher' ? 'Class Master' : 'Subject Faculty'}
                  </span>
                </div>
              ))}
            </div>

            {faculty.length === 0 && (
              <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-slate-500">
                No faculty members explicitly allocated to this specific department domain yet. Use the system provisioning hub to load records.
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
