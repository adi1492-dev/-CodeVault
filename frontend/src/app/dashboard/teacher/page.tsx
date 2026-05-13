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
  BookOpen,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getSubjects, updateSyllabusCoverage, UserRecord, SubjectRecord } from '@/lib/store';

interface StudentSubmission {
  id: string;
  studentName: string;
  rollNo: string;
  codeSnippet: string;
  status: string;
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
  
  // Primary Navigation tabs (Left Menu)
  const [activeTab, setActiveTab] = useState<'teaching' | 'labs' | 'class'>('teaching');
  
  // Secondary Sub-navigation tab states (Top Horizontal Bar)
  const [teachingSubTab, setTeachingSubTab] = useState<'curriculum' | 'problems'>('curriculum');
  const [classSubTab, setClassSubTab] = useState<'roster' | 'announcements'>('roster');
  
  // Shared context properties
  const [department, setDepartment] = useState('Computer Science');
  const [section, setSection] = useState('CS-A');
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);

  // ==========================================
  // TEACHING SUBJECTS & LABS STATES
  // ==========================================
  const [title, setTitle] = useState('');
  const [testcase, setTest] = useState('');
  const [problems, setProblems] = useState([
    { id: 'p1', title: 'Array Sum Iteration Test', testcases: 4, activeSubmissions: 32 },
    { id: 'p2', title: 'Recursive Factorial Verification', testcases: 6, activeSubmissions: 28 },
  ]);

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    { 
      id: 'sub1', 
      studentName: 'Aarav Nikam', 
      rollNo: 'CS-01', 
      codeSnippet: 'void main() { int sum = 0; for(int i=0; i<10; i=i+1) sum=sum+i; printf("%d", sum); }', 
      status: 'Passed Successful', 
      autoScore: 90 
    },
    { 
      id: 'sub2', 
      studentName: 'Neha Sharma', 
      rollNo: 'CS-02', 
      codeSnippet: 'int fact(int n) { if(n<=1) return 1; return n * fact(n-1); }', 
      status: 'Logic Optimal', 
      autoScore: 95 
    },
    { 
      id: 'sub3', 
      studentName: 'Rohan Verma', 
      rollNo: 'CS-03', 
      codeSnippet: 'while(true) { malloc(1024); } // infinite memory allocation loop', 
      status: 'Runtime Trapped (Loop limits exceeded)', 
      autoScore: 10,
      manualOverride: 25 
    },
  ]);

  // ==========================================
  // ASSIGNED CLASS ROSTER & ALERTS STATES
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
    setTest('');
    // Auto switch sub tab view to observe deployed problems
    setTeachingSubTab('problems');
  };

  const handleOverrideScore = (subId: string, newScore: number) => {
    setSubmissions(submissions.map(s => s.id === subId ? { ...s, manualOverride: newScore } : s));
  };

  const handleToggleModule = (subjectId: string, moduleIdx: number) => {
    const targetSub = subjects.find(s => s.id === subjectId);
    if (!targetSub) return;
    const updatedModules = targetSub.modules.map((m, idx) => idx === moduleIdx ? { ...m, completed: !m.completed } : m);
    const completedCount = updatedModules.filter(m => m.completed).length;
    const calculatedPct = Math.round((completedCount / updatedModules.length) * 100);
    
    updateSyllabusCoverage(subjectId, calculatedPct, updatedModules);
    setSubjects(getSubjects());
  };

  const handleSliderChange = (subjectId: string, val: number) => {
    updateSyllabusCoverage(subjectId, val);
    setSubjects(getSubjects());
  };

  const sanctionLeave = (id: string) => {
    setRoster(roster.map(s => s.id === id ? { ...s, attendance: s.attendance + 4, leaveRequested: false } : s));
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setBroadcast([`[To: Guardians of Section ${section}] ${message}`, ...broadcastLog]);
    setMessage('');
    // Auto switch sub tab view to observe logs
    setClassSubTab('announcements');
  };

  const mySubjects = subjects.filter(s => s.teacherId === currentUser?.id || s.teacherName?.includes('Vikram') || s.department === department);
  const activeDisplaySubs = mySubjects.length > 0 ? mySubjects : subjects;

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30 pb-20 relative overflow-x-hidden font-sans">
      {/* Subtle Background Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Sticky Header Container */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-400 to-indigo-600 flex items-center justify-center font-black text-black text-xs shadow-md shadow-indigo-500/20">
              FAC
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm block bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Faculty Hub Interface
              </span>
              <span className="text-[10px] text-indigo-400 block font-semibold">
                Instructor: {currentUser?.name || 'Dr. Vikram Anjali'} | Dept: {department}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-slate-400 border border-white/5 font-medium">
              <Sparkles size={11} className="text-amber-400" />
              <span>Assigned Scope: Section {section}</span>
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

      {/* Main Layout Grid with Left Menu Sidebar */}
      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8 relative z-10 items-start">
        
        {/* Left Menu Options Sidebar */}
        <div className="w-full lg:w-72 shrink-0 p-4 rounded-3xl border border-white/10 bg-[#080d1a]/90 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-20">
          <div className="px-2 pb-1 border-b border-white/5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
              Teaching Tools
            </span>
            <span className="text-xs text-slate-400 block mt-0.5 font-medium">
              Manage Assignments
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Teaching Subjects */}
            <button
              onClick={() => setActiveTab('teaching')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'teaching' 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen size={16} className="shrink-0" />
              <span className="truncate">Teaching Subjects</span>
            </button>

            {/* Lab Evaluator */}
            <button
              onClick={() => setActiveTab('labs')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'labs' 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 size={16} className="shrink-0" />
              <span className="truncate">Evaluate Code Answers</span>
            </button>

            {/* Assigned Class Roster */}
            <button
              onClick={() => setActiveTab('class')}
              className={`w-full px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-start gap-3 ${
                activeTab === 'class' 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={16} className="shrink-0" />
              <span className="truncate">My Assigned Class ⭐</span>
            </button>
          </div>
        </div>

        {/* Right Content Screen Sphere */}
        <div className="grow min-w-0 w-full space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: TEACHING SUBJECTS                                  */}
          {/* ========================================================= */}
          {activeTab === 'teaching' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setTeachingSubTab('curriculum')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    teachingSubTab === 'curriculum' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders size={14} />
                  <span>📖 Track Syllabus Delivery</span>
                </button>
                <button
                  onClick={() => setTeachingSubTab('problems')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    teachingSubTab === 'problems' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PlusCircle size={14} />
                  <span>➕ Create Coding Test</span>
                </button>
              </div>

              {teachingSubTab === 'curriculum' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">Syllabus Completion Control</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Drag range controls to instantly register global delivery rates</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeDisplaySubs.map(sub => (
                      <div key={sub.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-black text-white block">{sub.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Streams: {sub.sections.join(', ')}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-indigo-400 shrink-0">
                            {sub.code}
                          </span>
                        </div>

                        {/* Interactive Range Slider Bar */}
                        <div className="space-y-2 bg-black/50 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Coverage Completed</span>
                            <span className="font-bold text-indigo-300">{sub.syllabusCoveredPct}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={sub.syllabusCoveredPct}
                            onChange={(e) => handleSliderChange(sub.id, Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                          />
                        </div>

                        {/* Delivery Checklist Arrays */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Sub-Unit Progress Checks
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
              )}

              {teachingSubTab === 'problems' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left Form sphere */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <PlusCircle size={14} className="text-indigo-400" />
                        <span>Deploy Lab Assignment Problem</span>
                      </h3>

                      <form onSubmit={handleAddProblem} className="space-y-3 pt-1">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Problem Title</label>
                          <input 
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Iterative Array Searching Task"
                            className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">Expected Evaluator Cases</label>
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
                          className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider transition-all block mt-2"
                        >
                          Publish Problem Set Definition
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Deployed Active problem suite list */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider border-b border-white/5 pb-2">
                        Configured Assignment Master Suite
                      </span>
                      {problems.map(p => (
                        <div key={p.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{p.title}</span>
                            <span className="text-[10px] text-indigo-400 block mt-0.5">{p.testcases} Verification Cases Mapped</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0">
                            {p.activeSubmissions} Runs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: LAB EVALUATOR SUBMISSIONS                          */}
          {/* ========================================================= */}
          {activeTab === 'labs' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 size={16} className="text-indigo-400" />
                    <span>Evaluate Submitted Answers</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Review automatic scores assigned by the code checker module</p>
                </div>

                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-[10px] font-bold text-indigo-300 border border-indigo-500/20">
                  Live Evaluation Scope
                </span>
              </div>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
                {submissions.map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white block">{sub.studentName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Stream identifier: {sub.rollNo}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Assigned Score</span>
                        <span className="text-sm font-black text-indigo-400 block">
                          {sub.manualOverride !== undefined ? `${sub.manualOverride} (Adjusted)` : `${sub.autoScore}/100`}
                        </span>
                      </div>
                    </div>

                    {/* Pre Code display */}
                    <pre className="p-3 rounded-xl bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto border border-white/5">
                      {sub.codeSnippet}
                    </pre>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-300 block">
                        Evaluation message: <strong className="text-white font-mono">{sub.status}</strong>
                      </span>

                      {/* Manual overriding score handles */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-slate-500">Adjust Grade:</span>
                        {[25, 50, 75, 100].map(sVal => (
                          <button
                            key={sVal}
                            onClick={() => handleOverrideScore(sub.id, sVal)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
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
          )}

          {/* ========================================================= */}
          {/* TAB 3: ASSIGNED CLASS ROSTER                              */}
          {/* ========================================================= */}
          {activeTab === 'class' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Switcher */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setClassSubTab('roster')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    classSubTab === 'roster' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>👥 Student Attendance Ledgers</span>
                </button>
                <button
                  onClick={() => setClassSubTab('announcements')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    classSubTab === 'announcements' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Send size={14} />
                  <span>📢 Send Announcement to Parents</span>
                </button>
              </div>

              {classSubTab === 'roster' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-3xl mx-auto">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Assigned Class Roster: Stream Section [{section}]
                    </h3>
                    <span className="text-xs font-bold text-amber-400">
                      Managing Master Roster
                    </span>
                  </div>

                  <div className="space-y-3">
                    {roster.map(student => (
                      <div key={student.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{student.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-amber-300 shrink-0">
                              {student.rollNo}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Attendance Coverage standing: <strong className="text-white">{student.attendance}%</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] uppercase text-slate-500 block font-bold">Midterm Grade</span>
                            <span className="text-xs font-black text-indigo-300 block">{student.grade}</span>
                          </div>

                          {student.leaveRequested ? (
                            <button
                              onClick={() => sanctionLeave(student.id)}
                              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] animate-pulse shrink-0 transition-all"
                            >
                              Approve Leave (+4%)
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                              <CheckCircle2 size={12} />
                              <span>Approved</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {classSubTab === 'announcements' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left Form */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Send size={14} className="text-indigo-400" />
                        <span>Message Parents Interface</span>
                      </h3>

                      <form onSubmit={handleBroadcast} className="space-y-3 pt-1">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Circular Statement Content
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type important advisory updates regarding coding lab schedules..."
                            className="w-full p-3 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all block mt-2"
                        >
                          Dispatch Class Message
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Logs list sphere */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider border-b border-white/5 pb-2">
                        Published Message Trace
                      </span>
                      {broadcastLog.length === 0 ? (
                        <span className="text-xs text-slate-500 block italic">No messages dispatched during this session.</span>
                      ) : (
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                          {broadcastLog.map((logStr, lIdx) => (
                            <div key={lIdx} className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                              {logStr}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
