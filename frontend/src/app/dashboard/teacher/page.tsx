'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  PlusCircle, 
  CheckCircle2, 
  Sliders, 
  LogOut, 
  Cpu, 
  Award, 
  Layers, 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Send, 
  UserCheck, 
  FileText,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getSubjects, updateSyllabusCoverage, UserRecord, SubjectRecord } from '@/lib/store';

interface StudentSubmission {
  id: string;
  studentName: string;
  rollNo: string;
  codeSnippet: string;
  astStatus: string;
  autoScore: number;
  manualOverride?: number;
}

interface StudentRoster {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  grade: string;
  leaveRequested?: boolean;
}

export default function UnifiedTeacherDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'teaching' | 'class'>('teaching');
  
  // Shared context properties
  const [department, setDepartment] = useState('Computer Science');
  const [section, setSection] = useState('CS-A');
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);

  // ==========================================
  // TAB A STATE: Teaching Subjects & Labs
  // ==========================================
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [testcase, setTest] = useState('');
  const [problems, setProblems] = useState([
    { id: 'p1', title: 'Array Sum Iteration', testcases: 4, activeSubmissions: 32 },
    { id: 'p2', title: 'Recursive Factorial Tokenizer', testcases: 6, activeSubmissions: 28 },
  ]);

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    { 
      id: 'sub1', 
      studentName: 'Aarav Nikam', 
      rollNo: 'CS-01', 
      codeSnippet: 'void main() { int sum = 0; for(int i=0; i<10; i=i+1) sum=sum+i; printf("%d", sum); }', 
      astStatus: 'Passed (No unrecoverable loops)', 
      autoScore: 90 
    },
    { 
      id: 'sub2', 
      studentName: 'Neha Sharma', 
      rollNo: 'CS-02', 
      codeSnippet: 'int fact(int n) { if(n<=1) return 1; return n * fact(n-1); }', 
      astStatus: 'AST Depth Optimal', 
      autoScore: 95 
    },
    { 
      id: 'sub3', 
      studentName: 'Rohan Verma', 
      rollNo: 'CS-03', 
      codeSnippet: 'while(true) { malloc(1024); } // infinite memory allocation loop', 
      astStatus: 'Runtime Trapped (Infinite AST nodes)', 
      autoScore: 10,
      manualOverride: 25 
    },
  ]);

  // ==========================================
  // TAB B STATE: Assigned Class Roster & Alerts
  // ==========================================
  const [message, setMessage] = useState('');
  const [broadcastLog, setBroadcast] = useState<string[]>([]);
  const [roster, setRoster] = useState<StudentRoster[]>([
    { id: '101', name: 'Aarav Nikam', rollNo: 'CS-01', attendance: 92, grade: 'A+' },
    { id: '102', name: 'Neha Sharma', rollNo: 'CS-02', attendance: 85, grade: 'A' },
    { id: '103', name: 'Rohan Verma', rollNo: 'CS-03', attendance: 64, grade: 'B-', leaveRequested: true },
    { id: '104', name: 'Priya Patel', rollNo: 'CS-04', attendance: 98, grade: 'O' },
  ]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrent(user);
      if (user.department) setDepartment(user.department);
      if (user.section) setSection(user.section);
    }
    setSubjects(getSubjects());
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  // Tab A Handlers
  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setProblems([...problems, {
      id: String(Date.now()),
      title,
      testcases: Number(testcase) || 5,
      activeSubmissions: 0
    }]);
    setTitle('');
    setDesc('');
    setTest('');
  };

  const handleOverrideScore = (subId: string, newScore: number) => {
    setSubmissions(submissions.map(s => s.id === subId ? { ...s, manualOverride: newScore } : s));
  };

  const handleToggleModule = (subjectId: string, moduleIdx: number) => {
    const targetSub = subjects.find(s => s.id === subjectId);
    if (!targetSub) return;
    const updatedModules = targetSub.modules.map((m, idx) => idx === moduleIdx ? { ...m, completed: !m.completed } : m);
    // Auto calc new pct based on checked sub units
    const completedCount = updatedModules.filter(m => m.completed).length;
    const calculatedPct = Math.round((completedCount / updatedModules.length) * 100);
    
    updateSyllabusCoverage(subjectId, calculatedPct, updatedModules);
    setSubjects(getSubjects());
  };

  const handleSliderChange = (subjectId: string, val: number) => {
    updateSyllabusCoverage(subjectId, val);
    setSubjects(getSubjects());
  };

  // Tab B Handlers
  const sanctionLeave = (id: string) => {
    setRoster(roster.map(s => s.id === id ? { ...s, attendance: s.attendance + 4, leaveRequested: false } : s));
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setBroadcast([`[To: Guardians of Section ${section}] ${message}`, ...broadcastLog]);
    setMessage('');
  };

  // Determine subjects matching the instructor profile
  const mySubjects = subjects.filter(s => s.teacherId === currentUser?.id || s.teacherName?.includes('Vikram') || s.department === department);
  const activeDisplaySubs = mySubjects.length > 0 ? mySubjects : subjects;

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30 pb-20">
      {/* Dynamic top gradient changing based on active view context */}
      <div className={`absolute top-0 left-0 w-full h-[450px] transition-colors duration-700 pointer-events-none ${
        activeTab === 'teaching' ? 'bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent' : 'bg-gradient-to-b from-amber-950/20 via-transparent to-transparent'
      }`} />

      {/* Header Bar */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-xs transition-colors ${
            activeTab === 'teaching' ? 'bg-indigo-400' : 'bg-amber-400'
          }`}>
            FAC
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm block">Unified Faculty Interface</span>
            <span className="text-[9px] font-mono text-slate-400 block">
              Node: {currentUser?.name || 'Dr. Vikram Anjali'} | Dept: {department}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300"
        >
          <LogOut size={13} />
          <span>Terminate Access</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8 relative z-10">
        
        {/* Persistent Premium Tab Navigation Switcher */}
        <div className="glass p-2 rounded-2xl border-white/5 max-w-md mx-auto grid grid-cols-2 gap-2 bg-black/40">
          <button
            type="button"
            onClick={() => setActiveTab('teaching')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'teaching' 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen size={16} />
            <span>📚 Teaching Subjects</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('class')}
            className={`py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'class' 
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Users size={16} />
            <span>⭐ My Assigned Class</span>
          </button>
        </div>

        {/* View Layout Context Scope Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-6 rounded-2xl border-white/5">
          <div>
            <h1 className="text-xl font-black tracking-tight">
              {activeTab === 'teaching' ? 'Curriculum Delivery & Code Execution Engine' : `Section Authority Core: Class Stream [${section}]`}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'teaching' 
                ? 'Adjust synchronized coverage range sliders and supervise online AST parsed token runs.' 
                : 'Authorize student leaves, process midterm grades, and broadcast real-time alert directives to ward parent nodes.'}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
            activeTab === 'teaching' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            Active Context: {activeTab === 'teaching' ? `${activeDisplaySubs.length} Streams Managed` : `Roster Section: ${section}`}
          </span>
        </div>

        {/* ========================================== */}
        {/* RENDER TAB A: TEACHING SUBJECTS & LABS     */}
        {/* ========================================== */}
        {activeTab === 'teaching' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Live Synchronized Syllabus Submitter Area */}
            <div className="glass p-8 rounded-3xl border-indigo-500/20 bg-gradient-to-r from-indigo-950/10 via-transparent to-transparent space-y-6">
              <div className="flex items-center gap-2">
                <Sliders className="text-indigo-400" size={20} />
                <h2 className="text-base font-extrabold tracking-tight">Interactive Syllabus Coverage Sync Matrix</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeDisplaySubs.map(sub => (
                  <div key={sub.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-white block">{sub.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Target stream: {sub.sections.join(', ')}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-indigo-400 shrink-0">
                        {sub.code}
                      </span>
                    </div>

                    {/* Interactive Slider Bar */}
                    <div className="space-y-2 bg-black/50 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Coverage Level</span>
                        <span className="font-mono font-black text-indigo-300">{sub.syllabusCoveredPct}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sub.syllabusCoveredPct}
                        onChange={(e) => handleSliderChange(sub.id, Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                      />
                      <span className="text-[9px] text-slate-500 block text-right font-mono">Drag slider to instantly map global DB status</span>
                    </div>

                    {/* Sub-unit Checkbox array */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        Delivery Checkboxes
                      </span>
                      {sub.modules.map((m, idx) => (
                        <label 
                          key={idx}
                          onClick={() => handleToggleModule(sub.id, idx)}
                          className="flex items-start gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none p-1.5 rounded-lg hover:bg-white/5 transition-all"
                        >
                          <input 
                            type="checkbox"
                            checked={m.completed}
                            readOnly
                            className="mt-0.5 rounded accent-indigo-500"
                          />
                          <span className={`leading-tight ${m.completed ? 'line-through text-slate-500' : ''}`}>{m.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submissions & Custom Testing Laboratory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-4 space-y-6">
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <PlusCircle size={14} className="text-indigo-400" />
                    <span>Deploy Lab Problem Suite</span>
                  </h3>

                  <form onSubmit={handleAddProblem} className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Problem Title</label>
                      <input 
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Infix to Postfix AST parser"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Expected Testcases</label>
                      <input 
                        type="number"
                        value={testcase}
                        onChange={(e) => setTest(e.target.value)}
                        placeholder="5"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all"
                    >
                      Broadcast Problem Definition
                    </button>
                  </form>
                </div>

                {/* Deployed Active Problems list */}
                <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Active Problem Descriptors</span>
                  {problems.map(p => (
                    <div key={p.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200 block">{p.title}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">{p.testcases} Verification Nodes</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {p.activeSubmissions} Runs
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parsed Code Pipelines Array */}
              <div className="lg:col-span-8 glass p-6 rounded-3xl border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span>Real-time Student Sandbox AST Parses</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Auto Compiler Validation</span>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {submissions.map(sub => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-white block">{sub.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Stream string: {sub.rollNo}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-mono uppercase text-slate-500 block">Evaluated Score</span>
                          <span className="text-sm font-black text-indigo-400">
                            {sub.manualOverride !== undefined ? `${sub.manualOverride} (Overridden)` : `${sub.autoScore}/100`}
                          </span>
                        </div>
                      </div>

                      {/* Code Block snippet view */}
                      <pre className="p-3 rounded-xl bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto border border-white/5">
                        {sub.codeSnippet}
                      </pre>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <Cpu size={12} className={sub.autoScore > 50 ? 'text-emerald-400' : 'text-red-400'} />
                          <span>Status: <strong className="font-mono text-white">{sub.astStatus}</strong></span>
                        </span>

                        {/* Override scoring triggers */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono text-slate-500">Override:</span>
                          {[25, 50, 75, 100].map(sVal => (
                            <button
                              key={sVal}
                              onClick={() => handleOverrideScore(sub.id, sVal)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                                sub.manualOverride === sVal ? 'bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'
                              }`}
                            >
                              {sVal}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* RENDER TAB B: ASSIGNED CLASS ROSTER & PTM  */}
        {/* ========================================== */}
        {activeTab === 'class' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Section Roster Management array */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 glass p-6 rounded-3xl border-amber-500/20 bg-gradient-to-r from-amber-950/10 via-transparent to-transparent space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <UserCheck size={14} className="text-amber-400" />
                    <span>Assigned Section Roster Roster</span>
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400/80 font-bold">Stream Identity: {section}</span>
                </div>

                <div className="space-y-3">
                  {roster.map(student => (
                    <div key={student.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{student.name}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-amber-400">
                            {student.rollNo}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Verified Term Attendance String: <strong>{student.attendance}%</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[9px] font-mono uppercase text-slate-500 block">Midterm Mark</span>
                          <span className="text-xs font-black text-amber-300">{student.grade}</span>
                        </div>

                        {student.leaveRequested ? (
                          <button
                            onClick={() => sanctionLeave(student.id)}
                            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] animate-pulse shrink-0 transition-all"
                          >
                            Sanction Leave (+4%)
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 shrink-0">
                            <CheckCircle2 size={12} />
                            <span>Sanctioned</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Directives Broadcast Node & Parents Dispatch Pipeline */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Send size={14} className="text-amber-400" />
                    <span>Parent Circular Broadcast Bridge</span>
                  </h3>

                  <form onSubmit={handleBroadcast} className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Urgent Circular Broadcast Summary
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Push mandatory notification alert regarding AST submission cutoff dates directly to registered ward guardians..."
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all"
                    >
                      Dispatch Section Alert Stream
                    </button>
                  </form>
                </div>

                {/* Log list view */}
                <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                  <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Dispatched Dispatch Logs</span>
                  {broadcastLog.length === 0 ? (
                    <span className="text-xs text-slate-600 block italic">No real-time circulars pushed this session.</span>
                  ) : (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                      {broadcastLog.map((logStr, lIdx) => (
                        <div key={lIdx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-amber-200/80 leading-relaxed">
                          {logStr}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
