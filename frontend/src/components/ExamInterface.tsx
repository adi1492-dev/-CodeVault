'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle2, ChevronRight, Lock, Maximize2 } from 'lucide-react';
import { useProctoring } from '@/hooks/useProctoring';
import { useWebSocket } from '@/components/WebSocketProvider';

interface ExamInterfaceProps {
  examId: string;
  examTitle: string;
  userName: string;
  onExit: () => void;
}

export default function ExamInterface({ examId, examTitle, userName, onExit }: ExamInterfaceProps) {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const { socket, isConnected } = useWebSocket();

  const handleViolation = (type: string, details: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setViolations(prev => [`[${timestamp}] ${type}: ${details}`, ...prev]);
    
    // Send to teacher via WebSocket
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'PROCTOR_ALERT',
        studentName: userName,
        violationType: type,
        details: details,
        examId: examId,
        timestamp: new Date().toISOString()
      }));
    }
  };

  const { enterFullscreen } = useProctoring({
    onViolation: handleViolation,
    enabled: isExamStarted
  });

  useEffect(() => {
    if (isExamStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isExamStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isExamStarted) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0b10] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-[#14161e] p-10 rounded-2xl border border-white/5 space-y-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
            <Shield size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{examTitle}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Institutional Integrity Mode</p>
          </div>

          <div className="bg-black/20 p-6 rounded-xl border border-white/5 text-left space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Compliance Guidelines</h4>
            <ul className="space-y-3">
              <li className="text-xs text-slate-300 flex items-center gap-3">
                <Lock size={14} className="text-indigo-500" />
                <span>Locked Environment: System restricts navigation</span>
              </li>
              <li className="text-xs text-slate-300 flex items-center gap-3">
                <Maximize2 size={14} className="text-indigo-500" />
                <span>Forced Full-screen monitoring</span>
              </li>
              <li className="text-xs text-slate-300 flex items-center gap-3">
                <AlertTriangle size={14} className="text-indigo-500" />
                <span>Real-time Telemetry flagging</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                enterFullscreen();
                setIsExamStarted(true);
              }}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
            >
              Begin Assessment
            </button>
            <button onClick={onExit} className="text-xs text-slate-500 hover:text-white transition-colors">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#030712] text-white flex flex-col font-sans overflow-hidden">
      {/* Exam Header */}
      <header className="h-14 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-red-500 animate-pulse" />
            <span className="text-sm font-black uppercase tracking-wider">{examTitle}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <Clock size={14} className="text-indigo-400" />
            <span className="text-xs font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
            <Lock size={12} />
            <span>SESSION ENCRYPTED</span>
          </div>
          <button 
            onClick={onExit}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase transition-all shadow-lg shadow-red-600/20"
          >
            Finalize & Submit
          </button>
        </div>
      </header>

      <div className="grow flex overflow-hidden">
        {/* Main Exam Content (Mocked questions) */}
        <div className="grow p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Question 1 of 12</span>
              <h2 className="text-xl font-bold leading-relaxed">
                Explain the structural difference between a Pratt Parser and a traditional LL(k) recursive descent parser in the context of binary operator precedence.
              </h2>
              <div className="grid grid-cols-1 gap-3 pt-4">
                {['Pratt parsers use a lookup table for binding power tokens.', 'Recursive descent handles precedence via nested function calls.', 'Pratt parsers are inherently top-down operator precedence machines.', 'All of the above.'].map((opt, i) => (
                  <button key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.08] text-left text-sm transition-all flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-xl bg-black border border-white/10 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-px w-full bg-white/5" />
            
            <div className="space-y-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Question 2 of 12</span>
              <h2 className="text-xl font-bold leading-relaxed">
                Write a C snippet to traverse a binary tree in-order without using recursion.
              </h2>
              <div className="h-64 rounded-2xl bg-black border border-white/10 p-4 font-mono text-sm text-emerald-400">
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Sidebar */}
        <aside className="w-80 border-l border-white/5 bg-black/40 p-6 space-y-6 overflow-y-auto hidden xl:block">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Integrity Status</h4>
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-white block">Active Proctoring</span>
                <span className="text-[9px] text-slate-400 block uppercase">No Critical Flags</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Violation Logs</h4>
            <div className="space-y-2">
              {violations.length === 0 ? (
                <p className="text-[10px] text-slate-600 italic">No violations recorded yet.</p>
              ) : (
                violations.map((v, i) => (
                  <div key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-2">
                    <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                    <span className="text-[9px] text-red-300 font-mono leading-relaxed">{v}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Exam Controls</h4>
            <button 
              onClick={enterFullscreen}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold text-white transition-all flex items-center justify-center gap-2"
            >
              <Maximize2 size={12} />
              <span>Fix Full-screen</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Violation Overlay Warning */}
      {violations.length > 0 && violations[0].includes('WINDOW_BLUR') && (
        <div className="fixed inset-0 z-[100] bg-red-950/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-red-600 p-8 rounded-3xl text-white text-center space-y-4 shadow-2xl">
            <AlertTriangle size={48} className="mx-auto animate-bounce" />
            <h3 className="text-xl font-black">WINDOW FOCUS LOST!</h3>
            <p className="text-sm font-medium">This incident has been reported to the institutional proctoring hub. Subsequent violations will lead to immediate session termination.</p>
            <button 
              onClick={() => {
                enterFullscreen();
                setViolations(prev => prev.slice(1));
              }}
              className="px-8 py-3 bg-white text-red-600 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Return to Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
