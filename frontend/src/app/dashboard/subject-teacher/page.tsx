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
  Layers 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, UserRecord } from '@/lib/store';

interface StudentSubmission {
  id: string;
  studentName: string;
  rollNo: string;
  codeSnippet: string;
  astStatus: string;
  autoScore: number;
  manualOverride?: number;
}

export default function SubjectTeacherDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [department, setDepartment] = useState('Computer Science');
  
  // Create Problem statement form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [testcase, setTest] = useState('');
  const [problems, setProblems] = useState([
    { id: 'p1', title: 'Array Sum Iteration', testcases: 4, activeSubmissions: 32 },
    { id: 'p2', title: 'Recursive Factorial Tokenizer', testcases: 6, activeSubmissions: 28 },
  ]);

  // Review Submissions list
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
      studentName: 'Rohan Verma', 
      rollNo: 'CS-03', 
      codeSnippet: 'void main() { printf("Hello World"); }', 
      astStatus: 'Standard Fallback Triggered', 
      autoScore: 70 
    },
  ]);

  const [selectedSub, setSelected] = useState<StudentSubmission | null>(submissions[0]);
  const [overrideScore, setScore] = useState<number>(selectedSub?.autoScore || 0);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrent(user);
      if (user.department) setDepartment(user.department);
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setProblems([...problems, { id: `p${Date.now()}`, title, testcases: testcase ? 3 : 1, activeSubmissions: 0 }]);
    setTitle('');
    setDesc('');
    setTest('');
  };

  const handleOverride = (id: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, manualOverride: overrideScore } : s));
    if (selectedSub && selectedSub.id === id) {
      setSelected({ ...selectedSub, manualOverride: overrideScore });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30 pb-20">
      {/* Top overlay glow */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-black text-xs">
            👨‍🏫 ST
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm block">Subject Teacher Portal</span>
            <span className="text-[10px] font-mono text-indigo-400 block">Department: {department}</span>
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
        
        {/* Left Column: Create Labs & Active Assignment pipelines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-6 rounded-3xl border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold">Deploy Programming Lab</h2>
                <p className="text-xs text-slate-400">Inject code tasks into sandbox testbed</p>
              </div>
            </div>

            <form onSubmit={handleCreateLab} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Problem Statement Title
                </label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Memory Matrix Swapper"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Task Specification / Expected Output
                </label>
                <textarea 
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe memory constraints or target arrays..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 focus:outline-none text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Hidden Sandbox Test Vector
                </label>
                <input 
                  type="text"
                  value={testcase}
                  onChange={(e) => setTest(e.target.value)}
                  placeholder="e.g. 5,10 -> 15"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/10"
              >
                Provision & Activate Suite
              </button>
            </form>
          </div>

          {/* Active deployed suites */}
          <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deployed Subject Suites</h3>
            
            <div className="space-y-2">
              {problems.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{p.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{p.testcases} Vectors Bound</span>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    {p.activeSubmissions} Traced
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Submissions Inspection & Manual Grader Override */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass p-6 rounded-3xl border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                <Code2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold">Submissions Inspection Engine</h2>
                <p className="text-xs text-slate-400">Parse execution streams and apply ledger score overrides</p>
              </div>
            </div>

            {/* List of subs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {submissions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelected(s);
                    setScore(s.manualOverride ?? s.autoScore);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedSub?.id === s.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-black/30 border-white/5 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{s.studentName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{s.rollNo}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">{s.codeSnippet}</div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Ledger Rating</span>
                    <span className="text-xs font-black text-indigo-400">
                      {s.manualOverride !== undefined ? `${s.manualOverride} (Override)` : `${s.autoScore} (Auto)`}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Sub Detail and manual score adjust */}
            {selectedSub && (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Pipeline Execution Context
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                    {selectedSub.astStatus}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto">
                  {selectedSub.codeSnippet}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block">
                      Manual Override Slider
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={overrideScore}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-32 accent-indigo-500"
                      />
                      <span className="text-sm font-black font-mono text-white">{overrideScore} pts</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOverride(selectedSub.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Sliders size={13} />
                    <span>Commit Direct Override</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Department Compute Summary</span>
              <span className="text-xs text-slate-400 block">AST Node pass ratios stand stable at 98.4% across target batches.</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              98%
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
