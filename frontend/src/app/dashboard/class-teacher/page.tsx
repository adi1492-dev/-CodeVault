'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Send, 
  LogOut, 
  UserCheck, 
  FileText, 
  Award 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, UserRecord } from '@/lib/store';

interface StudentRoster {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  grade: string;
  leaveRequested?: boolean;
}

export default function ClassTeacherDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [section, setSection] = useState('CS-A');
  const [message, setMessage] = useState('');
  const [broadcastLog, setBroadcast] = useState<string[]>([]);

  // Simulated static roster for assigned class
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
      if (user.section) setSection(user.section);
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const sanctionLeave = (id: string) => {
    setRoster(roster.map(s => s.id === id ? { ...s, attendance: s.attendance + 4, leaveRequested: false } : s));
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setBroadcast([`[To: Parents of Section ${section}] ${message}`, ...broadcastLog]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-amber-500/30 pb-20">
      {/* Top Special Access Glow overlay */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-amber-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Top bar */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-xs">
            ⭐ CT
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm block">Class Teacher Portal</span>
            <span className="text-[10px] font-mono text-amber-400 block">Assigned Scope: Section {section}</span>
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
        
        {/* Left Column: Special Access Section Hub */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass p-6 rounded-3xl border-amber-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold">Section Roster Oversight</h2>
                  <p className="text-xs text-slate-400">Authority to finalize attendance & sanctions</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold font-mono">
                {roster.length} Assigned Enrollees
              </span>
            </div>

            {/* Roster View */}
            <div className="space-y-3">
              {roster.map((student) => (
                <div 
                  key={student.id} 
                  className={`p-4 rounded-2xl bg-black/40 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    student.leaveRequested ? 'border-amber-500/30 bg-amber-950/10' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center font-mono font-bold text-xs text-slate-400 shrink-0">
                      {student.rollNo}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{student.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Attendance Streak: <strong className={student.attendance < 75 ? 'text-red-400' : 'text-emerald-400'}>{student.attendance}%</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-mono font-bold text-slate-300">
                      Grade: {student.grade}
                    </span>

                    {student.leaveRequested ? (
                      <button
                        onClick={() => sanctionLeave(student.id)}
                        className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1 animate-bounce"
                      >
                        <CheckSquare size={13} />
                        <span>Sanction Leave</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Logs Validated</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Report Trigger module */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/20 via-black to-amber-900/10 border border-amber-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Mid-Term Consolidations</h4>
                <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                  Generate signed transcripts cross-referencing Subject Teacher ledger scores before broadcasting to Parent nodes.
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('Dispatched signed midterm ledgers to all Section guardians successfully.')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/20 text-amber-400 font-bold text-xs transition-all shrink-0"
            >
              Issue Report Cards
            </button>
          </div>
        </div>

        {/* Right Column: Broadcast Interface */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Send size={14} className="text-amber-400" />
              <span>Parent Dispatch Bridge</span>
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Type urgent circular for parents of ${section}...`}
                className="w-full p-3 rounded-xl bg-black/50 border border-white/10 focus:border-amber-400 focus:outline-none text-xs leading-relaxed resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all"
              >
                Fire Urgent Broadcast
              </button>
            </form>

            {broadcastLog.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Active Traces Dispatch</span>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {broadcastLog.map((log, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-300 font-mono leading-tight">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-400/90 leading-relaxed">
            <AlertTriangle size={16} className="mb-2 text-amber-400" />
            Class Teachers hold the root administrative sanction state for students within their specific designated stream section.
          </div>
        </div>

      </main>
    </div>
  );
}
