'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Trophy, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { getProblems } from '@/lib/api';

const ProblemsPage = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProblems().then(res => setProblems(res.data));
  }, []);

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white p-8 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Practice Arena
            </h1>
            <p className="text-xl text-white/50">Level up your C skills with real-time grading</p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 w-full lg:w-96 focus:outline-none focus:ring-2 ring-blue-500/50 transition-all text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProblems.map((p) => (
            <Link 
              key={p.id}
              href={`/problems/${p.id}`}
              className="glass rounded-3xl p-8 hover:bg-white/10 transition-all group border border-white/5 hover:border-white/20"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  p.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : 
                  p.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {p.difficulty}
                </span>
                <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
              <p className="text-white/50 mb-8 line-clamp-2">{p.description}</p>

              <div className="flex items-center gap-6 text-sm text-white/30 font-bold uppercase tracking-tighter">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>{p.test_cases?.length || 0} Tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={16} />
                  <span>100 pts</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProblemsPage;
