'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  CheckCircle2, 
  LogOut, 
  UserCheck, 
  Sparkles, 
  ShieldAlert,
  CalendarCheck,
  DoorOpen,
  Send,
  AlertTriangle,
  FileText,
  Wrench,
  Coffee
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUsers, getCurrentUser, setCurrentUser, UserRecord } from '@/lib/store';

export default function WardenDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [students, setStudents] = useState<UserRecord[]>([]);
  
  // Left Navigation Menu
  const [activeTab, setActiveTab] = useState<'rooms' | 'passes' | 'visitors' | 'directives' | 'mess' | 'maintenance'>('rooms');
  
  // Top Secondary Menu switchers
  const [roomSubTab, setRoomSubTab] = useState<'matrix' | 'status'>('matrix');
  const [passSubTab, setPassSubTab] = useState<'requests' | 'log'>('requests');

  // Interactive UI States
  const [successMsg, setSuccessMsg] = useState('');

  // Sample room records
  const [rooms, setRooms] = useState([
    { id: 'r1', block: 'Block A (Boys)', roomNo: '101', capacity: 2, occupants: ['Aarav Nikam', 'Rahul Verma'], status: 'Fully Occupied' },
    { id: 'r2', block: 'Block A (Boys)', roomNo: '102', capacity: 2, occupants: [], status: 'Vacant' },
    { id: 'r3', block: 'Block B (Girls)', roomNo: '201', capacity: 2, occupants: ['Ananya Sharma'], status: 'Partially Occupied' }
  ]);

  // Sample Outing pass requests
  const [passes, setPasses] = useState([
    { id: 'p1', studentName: 'Aarav Nikam', rollNo: 'CS2026-001', destination: 'Local Marketplace / Weekend Groceries', outTime: 'Saturday 04:00 PM', status: 'Pending' },
    { id: 'p2', studentName: 'Rahul Verma', rollNo: 'CS2026-018', destination: 'Medical Checkup Appointment', outTime: 'Friday 10:00 AM', status: 'Sanctioned' }
  ]);

  // Directives state
  const [directiveTitle, setDirectiveTitle] = useState('');
  const [directiveBody, setDirectiveBody] = useState('');
  const [directivesList, setDirectivesList] = useState([
    { id: 'wd1', title: 'Curfew Timing Strict Implementation Notice', date: '2026-05-11', target: 'All Hostel Blocks' }
  ]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrent(user);

    // Load static list of students
    const allUsers = getUsers();
    setStudents(allUsers.filter(u => u.role === 'student'));
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleSanctionPass = (passId: string) => {
    setPasses(passes.map(p => {
      if (p.id === passId) return { ...p, status: 'Sanctioned' };
      return p;
    }));
    setSuccessMsg('Outing pass application instantly elevated to Sanctioned status.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDispatchDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveTitle) return;

    setDirectivesList([
      { id: String(Date.now()), title: directiveTitle, date: new Date().toISOString().split('T')[0], target: 'All Residents' },
      ...directivesList
    ]);

    setSuccessMsg('Hostel directive successfully dispatched to master residential board.');
    setDirectiveTitle('');
    setDirectiveBody('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-rose-500/30 pb-20 relative overflow-x-hidden font-sans">
      {/* Dynamic Background Gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-950/20 via-orange-950/10 to-transparent pointer-events-none blur-3xl" />

      {/* Glassmorphic Top Bar */}
      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-black text-black text-xs shadow-md shadow-rose-500/20">
              HW
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                Hostel Warden Command
              </span>
              <span className="text-[10px] text-rose-400 font-mono block">
                Residential Tier DB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">{currentUser?.name || 'Capt. R. K. Dogra'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all border border-white/5"
              title="Terminate Portal Access"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Horizontal Selector Toolbar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass p-4 rounded-3xl border-white/5 space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2 font-mono">
              Warden Tiers
            </span>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                activeTab === 'rooms' 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home size={16} className={activeTab === 'rooms' ? 'text-rose-400' : ''} />
                <span>Room Matrix</span>
              </div>
              {activeTab === 'rooms' && <Sparkles size={12} className="text-rose-400" />}
            </button>

            <button
              onClick={() => setActiveTab('passes')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                activeTab === 'passes' 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DoorOpen size={16} className={activeTab === 'passes' ? 'text-rose-400' : ''} />
                <span>Gate Outing Passes</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('visitors')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                activeTab === 'visitors' 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} className={activeTab === 'visitors' ? 'text-rose-400' : ''} />
                <span>Visitor Security Log</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('directives')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                activeTab === 'directives' 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={16} className={activeTab === 'directives' ? 'text-rose-400' : ''} />
                <span>Dispatch Directives</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mess')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                activeTab === 'mess' 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coffee size={16} className={activeTab === 'mess' ? 'text-rose-400' : ''} />
                <span>Mess Management</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between ${
                activeTab === 'maintenance' 
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench size={16} className={activeTab === 'maintenance' ? 'text-rose-400' : ''} />
                <span>Maintenance</span>
              </div>
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/20 to-black border border-rose-500/10 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold">
              <ShieldAlert size={14} />
              <span>Residential Authority</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enforce master residential guidelines, log outbound application clearances, and document live campus security visitor logs.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Feature Workspaces */}
        <div className="lg:col-span-9 space-y-6">
          
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: ROOM MATRIX */}
          {activeTab === 'rooms' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setRoomSubTab('matrix')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    roomSubTab === 'matrix' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Home size={14} />
                  <span>🛏️ Live Room Capacity Binder</span>
                </button>
                <button
                  onClick={() => setRoomSubTab('status')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    roomSubTab === 'status' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>👥 Boarder Occupancy Roster</span>
                </button>
              </div>

              {roomSubTab === 'matrix' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Residential Ledger Blocks
                    </h3>
                    <span className="text-xs font-bold text-rose-400">
                      Total Tracked Nodes: {rooms.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rooms.map(rm => (
                      <div key={rm.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 hover:border-white/10 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-black text-white block">Room {rm.roomNo}</span>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{rm.block}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                            rm.status === 'Fully Occupied' ? 'bg-red-500/10 text-red-300 border border-red-500/20' : rm.status === 'Vacant' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}>
                            {rm.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 block font-bold">Occupants List:</span>
                          {rm.occupants.length === 0 ? (
                            <span className="text-[10px] text-slate-600 italic block">None registered</span>
                          ) : (
                            rm.occupants.map((occ, idx) => (
                              <span key={idx} className="text-xs text-slate-200 block font-medium">
                                • {occ}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {roomSubTab === 'status' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-3 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono border-b border-white/5 pb-2">
                    Verified Residential Roster
                  </h3>
                  {students.map(s => (
                    <div key={s.id} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Stream Section: {s.section || 'N/A'}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                        Hostel Ledger Verified
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GATE PASSES */}
          {activeTab === 'passes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setPassSubTab('requests')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    passSubTab === 'requests' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DoorOpen size={14} />
                  <span>📥 Live Application Requests</span>
                </button>
                <button
                  onClick={() => setPassSubTab('log')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    passSubTab === 'log' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CalendarCheck size={14} />
                  <span>📋 Sanctioned Archives</span>
                </button>
              </div>

              {passSubTab === 'requests' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono border-b border-white/5 pb-2">
                    Pending Outing & Gate Buffer Checks
                  </h3>

                  <div className="space-y-3">
                    {passes.filter(p => p.status === 'Pending').map(pass => (
                      <div key={pass.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-white block">{pass.studentName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Roll Index: {pass.rollNo} • Requested Outflow: {pass.outTime}</span>
                          <span className="text-xs text-rose-300 font-medium block mt-1.5 bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
                            📍 Dest: {pass.destination}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSanctionPass(pass.id)}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold shrink-0 transition-all shadow-sm"
                        >
                          Sanction Gate Pass
                        </button>
                      </div>
                    ))}

                    {passes.filter(p => p.status === 'Pending').length === 0 && (
                      <div className="p-6 text-center text-xs text-slate-500 italic bg-black/20 rounded-xl">
                        Zero pending gate outflow passes documented on current block index.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {passSubTab === 'log' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-3 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono border-b border-white/5 pb-2">
                    Verified Gate Flow Register
                  </h3>
                  
                  {passes.filter(p => p.status === 'Sanctioned').map(pass => (
                    <div key={pass.id} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{pass.studentName}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">Dest: {pass.destination} • Target Flow: {pass.outTime}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-500/10">
                        Gate Key Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISITORS LOG */}
          {activeTab === 'visitors' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto text-xs text-slate-300">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users size={16} className="text-rose-400" />
                  <span>Campus Visitor Security Logbook</span>
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Supervisory module validating identity tokens for all transient guest arrivals. Security parameters enforce strict timestamp bounds for boarder protection.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-rose-300">
                🛡️ Live Token Layer: Encrypted Local Access Ledger
              </div>
            </div>
          )}

          {/* TAB 4: DIRECTIVES */}
          {activeTab === 'directives' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send size={16} className="text-rose-400" />
                  <span>Dispatch Boarding Directive</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Broadcast continuous disciplinary announcements to institutional residential blocks instantly.
                </p>
              </div>

              <form onSubmit={handleDispatchDirective} className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Notice Headline</label>
                  <input
                    type="text"
                    required
                    value={directiveTitle}
                    onChange={(e) => setDirectiveTitle(e.target.value)}
                    placeholder="e.g. Mandatory Block Maintenance Assembly"
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Detailed Directives Document</label>
                  <textarea
                    rows={4}
                    value={directiveBody}
                    onChange={(e) => setDirectiveBody(e.target.value)}
                    placeholder="Provide specific implementation instructions..."
                    className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-rose-400 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider transition-all block mt-2 shadow-md"
                >
                  Confirm Dispatch Directive
                </button>
              </form>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 block uppercase font-mono">Live Disciplinary Noticeboards</span>
                {directivesList.map(d => (
                  <div key={d.id} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{d.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESS MANAGEMENT */}
          {activeTab === 'mess' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Coffee size={16} className="text-rose-400" />
                  <span>Mess Management System</span>
                </h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm">
                  <span className="font-bold text-rose-300">Today's Menu (Block A)</span>
                  <div className="mt-2 text-xs text-slate-300">Breakfast: Poha, Tea<br/>Lunch: Rajma Chawal<br/>Dinner: Dal Tadka, Roti</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-xl mx-auto">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench size={16} className="text-rose-400" />
                  <span>Hostel Maintenance Log</span>
                </h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between text-xs">
                  <span>Room 101 - Fan not working</span>
                  <span className="text-rose-400 font-bold">Open</span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between text-xs">
                  <span>Room 205 - Leaking tap</span>
                  <span className="text-amber-400 font-bold">In Progress</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
