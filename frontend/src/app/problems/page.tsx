'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Trophy, BookOpen, Users, ChevronLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { getProblems } from '@/lib/api';

const DEFAULT_PROBLEMS = [
  {
    id: 101,
    title: 'Array Summation Pipeline',
    difficulty: 'easy',
    description: 'Parse standard C pointer buffers to evaluate linear integer summation constraints without looping memory traps.',
    test_cases: [1, 2, 3, 4]
  },
  {
    id: 102,
    title: 'Recursive Factorial Evaluator',
    difficulty: 'medium',
    description: 'Design an optimal tail-recursive token pass. Verify stack limits and handle edge literal variables efficiently.',
    test_cases: [1, 2, 3, 4, 5]
  },
  {
    id: 104,
    title: 'Node Tree Allocation Bounds',
    difficulty: 'hard',
    description: 'Simulate manual memory traversal allocations through custom C structure mappings. Validate tree balancing rules.',
    test_cases: [1, 2, 3, 4, 5, 6]
  }
];

const ProblemsPage = () => {
  const [problems, setProblems] = useState<any[]>(DEFAULT_PROBLEMS);
  const [search, setSearch] = useState('');
  const [serverSynced, setSynced] = useState(false);

  useEffect(() => {
    // Attempt instant local server data pull, fallback immediately to default suite on delay/failure
    getProblems()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProblems(res.data);
          setSynced(true);
        }
      })
      .catch(() => {
        // Retain ultra-fast resilient mock items if backend micro-compiler is unlinked
      });
  }, []);

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 lg:p-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Switch Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/student" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group text-xs font-bold uppercase tracking-wider">
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            <span>Return to Workspace Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono">
            <span className={`w-2 h-2 rounded-full ${serverSynced ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span className="text-slate-400">{serverSynced ? 'Backend Engine Connected' : 'Simulated Real-time AST Framework'}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-blue-400" size={28} />
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Practice Arena IDE
              </h1>
            </div>
            <p className="text-sm lg:text-base text-slate-400">Level up your C programming syntax with simulated zero-latency AST parsing</p>
          </div>

          <div className="relative group w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 w-full focus:outline-none focus:border-blue-500 transition-all text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((p, idx) => {
            const problemId = p.id || p.ID || idx + 101;
            return (
            <Link 
              key={problemId}
              href={`/problems/${problemId}`}
              className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group border border-white/5 hover:border-blue-500/30 flex flex-col justify-between h-56 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    p.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    p.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {p.difficulty}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">Suite #{problemId}</span>
                </div>

                <h2 className="text-base font-bold mb-2 group-hover:text-blue-300 transition-colors flex items-center justify-between">
                  <span className="truncate">{p.title}</span>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </h2>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-tight pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={13} className="text-blue-400" />
                  <span>{p.test_cases?.length || p.TestCases?.length || 4} Tests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={13} className="text-amber-400" />
                  <span>100 pts</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
};

export default ProblemsPage;
