'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, User, Clock, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Violation {
  id: string;
  studentName: string;
  type: string;
  details: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export default function ProctoringDashboard() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [activeStudents, setActiveStudents] = useState<number>(0);

  useEffect(() => {
    // In a real app, this would come from the useWebSocket hook or similar
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PROCTOR_ALERT') {
          const newViolation: Violation = {
            id: String(Date.now()),
            studentName: data.studentName || 'Unknown Student',
            type: data.violationType,
            details: data.details,
            timestamp: new Date().toLocaleTimeString(),
            severity: data.violationType === 'TAB_SWITCH' || data.violationType === 'FULLSCREEN_EXIT' ? 'high' : 'medium'
          };
          setViolations(prev => [newViolation, ...prev].slice(0, 50));
          setActiveStudents(prev => Math.max(prev, data.activeCount || 0));
        }
      } catch (e) {
        // Not a JSON message or wrong format
      }
    };

    window.addEventListener('message', handleWebSocketMessage); // Mocking for now, in reality WebSocketProvider does this
    
    // Custom window event listener for our WebSocketProvider
    const handleCustomEvent = (e: any) => {
        if (e.detail && e.detail.type === 'PROCTOR_ALERT') {
            const data = e.detail;
            const newViolation: Violation = {
                id: String(Date.now()),
                studentName: data.studentName || 'Unknown Student',
                type: data.violationType,
                details: data.details,
                timestamp: new Date().toLocaleTimeString(),
                severity: data.violationType === 'TAB_SWITCH' || data.violationType === 'FULLSCREEN_EXIT' ? 'high' : 'medium'
              };
              setViolations(prev => [newViolation, ...prev].slice(0, 50));
        }
    };
    window.addEventListener('campuscore_proctor_alert', handleCustomEvent);

    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
      window.removeEventListener('campuscore_proctor_alert', handleCustomEvent);
    };
  }, []);

  const clearLogs = () => setViolations([]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-5 rounded-3xl border-emerald-500/20 bg-emerald-500/[0.02] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Exam Status</span>
            <span className="text-lg font-black text-white block">SECURE</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border-indigo-500/20 bg-indigo-500/[0.02] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <User size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Students Live</span>
            <span className="text-lg font-black text-white block">42 Participating</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border-red-500/20 bg-red-500/[0.02] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Violations</span>
            <span className="text-lg font-black text-white block">{violations.length} Flagged</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Live Proctoring Violation Feed</h3>
          </div>
          <button 
            onClick={clearLogs}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {violations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-400">No violations detected</h4>
                <p className="text-[10px] text-slate-600">Waiting for real-time proctoring telemetry...</p>
              </div>
            </div>
          ) : (
            violations.map(v => (
              <div key={v.id} className={`p-4 rounded-2xl border flex items-start gap-4 animate-slide-in ${
                v.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  v.severity === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-white">{v.studentName}</span>
                    <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            v.severity === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-amber-500/20 text-amber-400 border-amber-500/20'
                        }`}>
                            {v.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{v.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{v.details}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
