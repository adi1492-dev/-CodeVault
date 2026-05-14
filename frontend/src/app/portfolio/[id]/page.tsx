'use client';

import React, { useEffect, useState } from 'react';
import { getUsers, UserRecord } from '@/lib/store';
import { Code2, BookOpen, ShieldCheck, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function StudentPortfolio() {
  const params = useParams();
  const id = params?.id as string;
  const [student, setStudent] = useState<UserRecord | null>(null);

  useEffect(() => {
    if (id) {
      const u = getUsers().find(u => u.id === id && u.role === 'student');
      if (u) setStudent(u);
    }
  }, [id]);

  if (!student) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">Resolving Identity...</div>;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 pb-20 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-950/20 via-cyan-900/10 to-transparent pointer-events-none blur-3xl" />
      
      <main className="max-w-4xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Profile Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 p-1 shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-black text-white">
              {student.name.charAt(0)}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {student.name}
            </h1>
            <p className="text-cyan-400 font-mono text-sm mt-2">{student.department} • {student.academicYear}</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-400" />
              Verified CampusCore Identity
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
              Roll No: {student.rollNo}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Academics */}
          <div className="md:col-span-5 space-y-6">
            
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-400" />
                Academic Standing
              </h2>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-slate-300 text-sm">CGPA</span>
                <span className="text-2xl font-black text-white">{student.cgpa || 'N/A'}</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-slate-300 text-sm">Attendance</span>
                <span className={`text-2xl font-black ${(student.attendancePct || 0) >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {student.attendancePct}%
                </span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-300 text-xs block mb-1">Current Standing</span>
                <span className="text-sm font-bold text-white">{student.gradesSummary || 'Pending Evaluation'}</span>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen size={16} className="text-cyan-400" />
                Semester Performance
              </h2>
              <div className="space-y-2">
                {(student.sgpa || []).map((grade, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/5 text-sm">
                    <span className="text-slate-400 font-mono">Semester {idx + 1}</span>
                    <span className="font-bold text-white">{grade}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Labs, GitHub, Web3 */}
          <div className="md:col-span-7 space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center space-y-2 hover:border-cyan-500/30 transition-all">
                <Code2 size={24} className="text-white" />
                <span className="text-3xl font-black text-white">{student.githubScore || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">GitHub Score</span>
              </div>
              
              <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center space-y-2 hover:border-cyan-500/30 transition-all">
                <Cpu size={24} className="text-cyan-400" />
                <span className="text-3xl font-black text-white">{student.completedLabs || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">AST Labs Completed</span>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-white/5 pb-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                Web3 Soulbound Credentials
              </h2>
              
              {(!student.certificates || student.certificates.length === 0) ? (
                <div className="text-sm text-slate-500 italic p-4 text-center bg-black/20 rounded-xl">
                  No cryptographic credentials minted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {student.certificates.map(cert => (
                    <div key={cert.id} className="p-4 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Award size={14} className="text-cyan-400" />
                            {cert.name}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono block mt-1">Issued: {cert.date}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 rounded bg-white/5 font-mono text-[9px] text-green-400 break-all border border-green-500/10">
                        {cert.txHash}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
