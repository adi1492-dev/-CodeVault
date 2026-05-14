'use client';

import React, { useEffect, useState } from 'react';
import { getUsers, UserRecord } from '@/lib/store';
import { Code2, BookOpen, ShieldCheck, CheckCircle2, TrendingUp, Cpu, Award, Calendar, Sparkles } from 'lucide-react';
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
    return (
      <div className="min-h-screen bg-[#190019] text-[#FBE4D8] flex flex-col items-center justify-center font-mono space-y-4">
        <Sparkles size={32} className="animate-spin text-[#FEA38E]" />
        <div className="text-sm tracking-widest uppercase">Rendering Premium Synthesized Portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] selection:bg-[#854F6C] selection:text-[#FFDFC3] pb-24 relative overflow-x-hidden font-sans">
      {/* Ambient Synthesized Glow Overlays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#2B124C] via-[#522B5B]/30 to-transparent pointer-events-none blur-3xl rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#854F6C]/10 pointer-events-none blur-3xl rounded-full" />
      
      {/* Top Decorator Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#FEA38E] via-[#FBA2AB] via-[#FFDFC3] to-[#F3B5A0]" />

      <main className="max-w-5xl mx-auto px-6 pt-16 relative z-10 space-y-12">
        
        {/* Header Profile Hero Card */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#2B124C]/80 border-2 border-[#522B5B] backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-[#190019]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#854F6C]/30 via-transparent to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* Avatar Frame */}
            <div className="w-28 h-28 shrink-0 rounded-full bg-gradient-to-tr from-[#FEA38E] via-[#FBA2AB] to-[#FFDFC3] p-1.5 shadow-xl shadow-[#522B5B]/50">
              <div className="w-full h-full rounded-full bg-[#190019] flex items-center justify-center text-4xl font-black text-[#FBE4D8]">
                {student.name.charAt(0)}
              </div>
            </div>

            {/* Profile Overview Details */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-[#522B5B] border border-[#854F6C] text-[#FFDFC3] font-mono text-[10px] font-bold tracking-widest uppercase">
                  ⚡ Soulbound Ledger ID: {student.id}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#854F6C]/40 border border-[#854F6C] text-[#F6E6D0] font-mono text-[10px]">
                  Roll: {student.rollNo}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-[#FBE4D8] via-[#FFDFC3] to-[#DFB6B2] bg-clip-text text-transparent font-serif">
                {student.name}
              </h1>

              <p className="text-[#FEA38E] font-medium text-sm sm:text-base tracking-wide">
                {student.department} Department • <span className="text-[#FBA2AB]">{student.academicYear}</span> (Semester {student.semesterNo})
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#DFB6B2]">
                {student.phone && (
                  <span className="bg-[#190019]/60 px-3 py-1 rounded-lg border border-[#522B5B]">📞 {student.phone}</span>
                )}
                {student.bloodGroup && (
                  <span className="bg-[#190019]/60 px-3 py-1 rounded-lg border border-[#522B5B]">🩸 Group {student.bloodGroup}</span>
                )}
                <span className="bg-[#190019]/60 px-3 py-1 rounded-lg border border-[#522B5B] text-[#F3B5A0] font-bold">
                  ✓ Core Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Portfolio Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Academic Standing & Analytics Matrix */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Global Standing card */}
            <div className="p-6 rounded-3xl bg-[#2B124C]/60 border border-[#522B5B] space-y-5 backdrop-blur-md">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#FBA2AB] flex items-center gap-2 border-b border-[#522B5B] pb-3">
                <TrendingUp size={16} className="text-[#FEA38E]" />
                <span>Statutory Academic Ledger</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#190019]/80 border border-[#522B5B] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#DFB6B2] block font-mono">Verified CGPA</span>
                  <span className="text-3xl font-black text-[#FFDFC3] tracking-tight block">{student.cgpa || '8.85'}</span>
                  <span className="text-[9px] text-[#854F6C] block">Out of 10.0 Scale</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#190019]/80 border border-[#522B5B] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#DFB6B2] block font-mono">Attendance Ratio</span>
                  <span className="text-3xl font-black text-[#FEA38E] tracking-tight block">{student.attendancePct || 88.5}%</span>
                  <span className="text-[9px] text-[#F3B5A0] block">
                    {(student.attendancePct || 0) >= 75 ? '✓ Clean Target' : '⚠️ Warning Area'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#522B5B]/40 border border-[#854F6C]/40 space-y-1 text-center">
                <span className="text-[10px] uppercase font-mono text-[#F6E6D0] block tracking-wider">Semantic Evaluation Verdict</span>
                <span className="text-xs font-black text-[#FBE4D8] block tracking-wide">
                  {student.gradesSummary || 'Passed Standard Output Matrix Constraints'}
                </span>
              </div>
            </div>

            {/* Semester Trajectory Breakdown */}
            <div className="p-6 rounded-3xl bg-[#2B124C]/60 border border-[#522B5B] space-y-4 backdrop-blur-md">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#FBA2AB] flex items-center gap-2 border-b border-[#522B5B] pb-3">
                <BookOpen size={16} className="text-[#FEA38E]" />
                <span>SGPA Term Progressions</span>
              </h2>

              <div className="space-y-3 font-mono">
                {(student.sgpa && student.sgpa.length > 0 ? student.sgpa : [8.6, 9.1]).map((grade, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-xl bg-[#190019]/50 border border-[#522B5B]/50 hover:border-[#854F6C] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#522B5B] text-[#FFDFC3] flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-[#F6E6D0]">Semester Scope #{idx + 1}</span>
                    </div>
                    <span className="text-sm font-black text-[#FEA38E] bg-[#854F6C]/20 px-2.5 py-1 rounded-md border border-[#854F6C]/30">
                      {grade} SGPA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer navigation */}
            <div className="text-center pt-2">
              <Link 
                href="/" 
                className="inline-block text-xs font-bold text-[#FBA2AB] underline hover:text-[#FEA38E] transition-all"
              >
                ← Return to Universal Authentication Portal
              </Link>
            </div>

          </div>

          {/* Right Block: Practical Implementation Output & Verified Cryptographic Enclosures */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Simulator Counters Container Matrix */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B124C] to-[#522B5B]/50 border border-[#854F6C]/40 text-center space-y-2 hover:border-[#FEA38E] transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#190019] text-[#FEA38E] flex items-center justify-center mx-auto border border-[#522B5B] group-hover:scale-110 transition-transform duration-300">
                  <Code2 size={24} />
                </div>
                <span className="text-4xl font-black text-[#FFDFC3] block tracking-tight font-serif mt-2">
                  {student.githubScore || 450}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#DFB6B2] block">
                  Weighted GitHub Score
                </span>
              </div>
              
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B124C] to-[#522B5B]/50 border border-[#854F6C]/40 text-center space-y-2 hover:border-[#FEA38E] transition-all group shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#190019] text-[#FBA2AB] flex items-center justify-center mx-auto border border-[#522B5B] group-hover:scale-110 transition-transform duration-300">
                  <Cpu size={24} />
                </div>
                <span className="text-4xl font-black text-[#FBE4D8] block tracking-tight font-serif mt-2">
                  {student.completedLabs || 14}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#DFB6B2] block">
                  AST Parsed Sandbox Labs
                </span>
              </div>
            </div>

            {/* High-Fidelity Responsive Photographic Web3 Badges Container */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#2B124C]/60 border border-[#522B5B] space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#522B5B] pb-4">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#FBA2AB] flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#FEA38E]" />
                    <span>Persistent Soulbound Badges</span>
                  </h2>
                  <p className="text-[11px] text-[#DFB6B2] mt-0.5">Cryptographically certified and bound permanently to student state ledgers</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#522B5B] text-[#FBE4D8] text-[10px] font-mono border border-[#854F6C]">
                  {student.certificates?.length || 0} Assets
                </span>
              </div>

              {(!student.certificates || student.certificates.length === 0) ? (
                <div className="p-10 rounded-2xl bg-[#190019]/60 border border-dashed border-[#522B5B] text-center space-y-2">
                  <Award size={32} className="mx-auto text-[#854F6C]" />
                  <p className="text-xs text-[#DFB6B2] font-medium">No specialized Web3 credentials populated yet.</p>
                  <p className="text-[10px] text-[#854F6C] font-mono max-w-sm mx-auto">
                    Administrators can distribute bulk assignments with embedded photographic URLs mapping directly to this interface.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {student.certificates.map(cert => (
                    <div 
                      key={cert.id} 
                      className="rounded-2xl overflow-hidden bg-[#190019] border-2 border-[#522B5B] hover:border-[#854F6C] transition-all space-y-3 relative group shadow-2xl"
                    >
                      {/* Enclosed Photo Cover Banner if available */}
                      {cert.photoUrl ? (
                        <div className="relative w-full aspect-video max-h-56 overflow-hidden border-b border-[#522B5B]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={cert.photoUrl} 
                            alt={cert.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#190019] via-[#190019]/40 to-transparent p-4 flex flex-col justify-end">
                            <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-[#FFDFC3] block drop-shadow-md">
                              {cert.issuerName || 'CampusCore Issuing Engine'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-2 w-full bg-gradient-to-r from-[#522B5B] to-[#854F6C]" />
                      )}

                      <div className="p-5 pt-2 space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-black text-[#FBE4D8] tracking-tight flex items-center gap-2">
                              <Award size={16} className="text-[#FEA38E] shrink-0" />
                              <span>{cert.name}</span>
                            </h3>
                            <span className="text-[9px] font-mono uppercase bg-[#2B124C] px-2 py-0.5 rounded border border-[#522B5B] text-[#F3B5A0] shrink-0 font-bold">
                              ✓ Polygon Ledger
                            </span>
                          </div>
                          
                          <span className="text-[10px] text-[#DFB6B2] font-mono block mt-1 flex items-center gap-1">
                            <Calendar size={10} />
                            <span>Award Date: {cert.date}</span>
                          </span>
                        </div>

                        {/* Description verification overlay box */}
                        {cert.description && (
                          <div className="p-3 rounded-xl bg-[#2B124C]/40 border border-[#522B5B] text-xs text-[#F6E6D0] leading-relaxed">
                            {cert.description}
                          </div>
                        )}

                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono border-t border-[#522B5B]/40">
                          <span className="text-[#854F6C] font-bold uppercase">Signatory: {cert.issuerName || 'Dean of Framework Labs'}</span>
                          <span className="text-[#FEA38E] truncate max-w-[180px] sm:max-w-xs block" title={cert.txHash}>
                            Hash: {cert.txHash}
                          </span>
                        </div>
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
