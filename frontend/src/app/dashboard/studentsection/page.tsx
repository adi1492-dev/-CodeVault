'use client';
import React, { useState, useEffect } from 'react';
import { Users, LogOut, Search, GraduationCap, CreditCard, CalendarCheck, FileText, UserCheck, ChevronRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUsers, saveUsers, getCurrentUser, setCurrentUser, UserRecord } from '@/lib/store';

const NAV = [
  { id: 'directory', label: 'Student Directory', icon: Users },
  { id: 'academics', label: 'Academics & Grades', icon: GraduationCap },
  { id: 'fees', label: 'Fee Management', icon: CreditCard },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'enrollment', label: 'Enrollment & Clearance', icon: UserCheck },
];

export default function StudentSectionDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  const [students, setStudents] = useState<UserRecord[]>([]);
  const [selected, setSelected] = useState<UserRecord | null>(null);
  const [activeTab, setActiveTab] = useState('directory');
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [msg, setMsg] = useState('');
  const [payAmt, setPayAmt] = useState('');
  const [editAttendance, setEditAttendance] = useState('');
  const [editLeave, setEditLeave] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState(''); const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState(''); const [newSection, setNewSection] = useState('CS-A');
  const [newYear, setNewYear] = useState('1st Year'); const [newDob, setNewDob] = useState('');
  const [newParent, setNewParent] = useState(''); const [newParentPh, setNewParentPh] = useState('');
  const [allocSection, setAllocSection] = useState('CS-A');
  const [clearances, setClearances] = useState([
    { id: 'c1', name: 'Ananya Sharma', roll: 'CS2026-002', type: 'Semester Leave', status: 'Pending', date: '2026-05-12' },
    { id: 'c2', name: 'Aarav Nikam', roll: 'CS2026-001', type: 'Library Fine Clearance', status: 'Approved', date: '2026-05-10' },
  ]);

  useEffect(() => {
    const u = getCurrentUser(); if (u) setCurrent(u);
    refreshStudents();
  }, []);

  const refreshStudents = () => {
    const studs = getUsers().filter(u => u.role === 'student');
    setStudents(studs);
    if (!selected && studs.length) setSelected(studs[0]);
  };

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };

  const persist = (updatedStudent: UserRecord) => {
    const all = getUsers();
    const upd = all.map(u => u.id === updatedStudent.id ? updatedStudent : u);
    saveUsers(upd);
    setStudents(upd.filter(u => u.role === 'student'));
    setSelected(updatedStudent);
  };

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.rollNo || '').includes(search);
    const matchYear = filterYear === 'all' || s.academicYear === filterYear;
    return matchSearch && matchYear;
  });

  // -- SECTION ALLOCATION --
  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    persist({ ...selected, section: allocSection });
    flash(`${selected.name} moved to Section ${allocSection}`);
  };

  // -- CLEARANCE --
  const approveClearance = (id: string) => {
    setClearances(c => c.map(x => x.id === id ? { ...x, status: 'Approved' } : x));
    flash('Clearance approved.');
  };

  // -- RECORD FEE PAYMENT (real working) --
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !payAmt) return;
    const amt = Number(payAmt);
    if (isNaN(amt) || amt <= 0) return;
    const newPaid = (selected.feePaid ?? 0) + amt;
    const newDue = Math.max(0, (selected.totalFee ?? 0) - newPaid);
    const newStatus: 'Paid' | 'Pending' | 'Overdue' = newDue === 0 ? 'Paid' : 'Pending';
    persist({ ...selected, feePaid: newPaid, feeDue: newDue, feeStatus: newStatus, feeAmountDue: newDue });
    setPayAmt('');
    flash(`₹${amt.toLocaleString()} payment recorded for ${selected.name}. Due: ₹${newDue.toLocaleString()}`);
  };

  // -- TOGGLE DOCUMENT STATUS (real working) --
  const toggleDoc = (docIndex: number) => {
    if (!selected || !selected.documentStatus) return;
    const docs = selected.documentStatus.map((d, i) => i === docIndex ? { ...d, submitted: !d.submitted } : d);
    persist({ ...selected, documentStatus: docs });
    flash(`Document "${docs[docIndex].name}" marked as ${docs[docIndex].submitted ? 'Submitted' : 'Pending'}`);
  };

  // -- UPDATE ATTENDANCE (real working) --
  const handleUpdateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const att = editAttendance ? Number(editAttendance) : selected.attendancePct;
    const lv = editLeave ? Number(editLeave) : selected.leaveBalance;
    persist({ ...selected, attendancePct: Math.min(100, Math.max(0, att ?? 0)), leaveBalance: Math.max(0, lv ?? 0) });
    setEditAttendance(''); setEditLeave('');
    flash(`Attendance updated for ${selected.name}`);
  };

  // -- ADD NEW STUDENT (real working) --
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const roll = `CS2026-${String(Math.floor(100 + Math.random() * 899))}`;
    const newStudent: UserRecord = {
      id: String(Date.now()), name: newName, email: newEmail, role: 'student', password: 'password',
      section: newSection, department: 'Computer Science', academicYear: newYear, semesterNo: 1,
      rollNo: roll, phone: newPhone, dob: newDob, parentName: newParent, parentPhone: newParentPh,
      bloodGroup: 'O+', category: 'General', admissionDate: new Date().toISOString().split('T')[0],
      scholarshipStatus: 'None', hostelStatus: 'Day Scholar', nationality: 'Indian',
      attendancePct: 100, feeStatus: 'Pending', feePaid: 0, feeDue: 85000, totalFee: 85000, feeAmountDue: 85000,
      sgpa: [], cgpa: 0, backlogCount: 0, leaveBalance: 12,
      documentStatus: [
        { name: '10th Marksheet', submitted: false }, { name: '12th Marksheet', submitted: false },
        { name: 'Birth Certificate', submitted: false }, { name: 'Caste Certificate', submitted: false },
        { name: 'Migration Certificate', submitted: false }, { name: 'Medical Fitness', submitted: false },
      ],
    };
    const all = getUsers();
    saveUsers([...all, newStudent]);
    setStudents([...all, newStudent].filter(u => u.role === 'student'));
    setSelected(newStudent);
    setNewName(''); setNewEmail(''); setNewPhone(''); setNewDob(''); setNewParent(''); setNewParentPh('');
    setShowAddForm(false);
    flash(`New student ${newName} enrolled as ${roll}`);
  };

  // -- DELETE STUDENT (real working) --
  const handleDeleteStudent = (id: string) => {
    if (!confirm('Remove this student from the system?')) return;
    const all = getUsers().filter(u => u.id !== id);
    saveUsers(all);
    const studs = all.filter(u => u.role === 'student');
    setStudents(studs);
    setSelected(studs[0] || null);
    flash('Student record removed.');
  };

  const feeColor = (s?: string) => s === 'Paid' ? 'text-emerald-400' : s === 'Overdue' ? 'text-red-400' : 'text-amber-400';
  const pct = (n?: number) => `${n ?? 0}%`;

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans pb-16">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-950/20 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-black">SS</div>
            <span className="font-bold text-sm">Students Section — ERP Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{currentUser?.name}</span>
            <button onClick={() => { setCurrentUser(null); router.push('/'); }} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all"><LogOut size={15} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-12 gap-6 relative z-10">

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-2 space-y-1">
          {NAV.map(n => {
            const Icon = n.icon;
            return (
              <button key={n.id} onClick={() => setActiveTab(n.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === n.id ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Icon size={14} />{n.label}
              </button>
            );
          })}
        </div>

        {/* Main */}
        <div className="col-span-12 lg:col-span-10 space-y-5">
          {msg && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2"><CheckCircle2 size={14} />{msg}</div>}

          {/* DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-48">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or roll no..." className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400" />
                </div>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none cursor-pointer">
                  <option value="all">All Years</option>
                  {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
                </select>
                <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/25 transition-all">
                  {showAddForm ? '✕ Cancel' : '+ Add Student'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddStudent} className="p-4 rounded-2xl bg-black/60 border border-purple-500/20 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-full text-xs font-bold text-purple-300 border-b border-white/5 pb-2">New Student Enrollment</div>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name *" className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400" />
                  <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email *" className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400" />
                  <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone" className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none" />
                  <input type="date" value={newDob} onChange={e => setNewDob(e.target.value)} className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none" />
                  <input value={newParent} onChange={e => setNewParent(e.target.value)} placeholder="Parent Name" className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none" />
                  <input value={newParentPh} onChange={e => setNewParentPh(e.target.value)} placeholder="Parent Phone" className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none" />
                  <select value={newSection} onChange={e => setNewSection(e.target.value)} className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white cursor-pointer">{['CS-A','CS-B','CS-C'].map(s => <option key={s}>{s}</option>)}</select>
                  <select value={newYear} onChange={e => setNewYear(e.target.value)} className="p-2 rounded-xl bg-black border border-white/10 text-xs text-white cursor-pointer">{['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}</select>
                  <button type="submit" className="col-span-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs uppercase">Enroll Student</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map(s => (
                  <div key={s.id} onClick={() => setSelected(s)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${selected?.id === s.id ? 'border-purple-500/40 bg-purple-500/5' : 'border-white/5 bg-black/40 hover:border-white/10'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.rollNo} · {s.section} · {s.academicYear}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.email}</div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${s.feeStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>{s.feeStatus}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                      <div className="text-center bg-black/40 rounded-lg p-1.5"><div className="font-bold text-white">{s.cgpa ?? 'N/A'}</div><div className="text-slate-500">CGPA</div></div>
                      <div className="text-center bg-black/40 rounded-lg p-1.5"><div className="font-bold text-white">{s.attendancePct}%</div><div className="text-slate-500">Attend.</div></div>
                      <div className="text-center bg-black/40 rounded-lg p-1.5"><div className={`font-bold ${s.backlogCount ? 'text-red-400' : 'text-emerald-400'}`}>{s.backlogCount ?? 0}</div><div className="text-slate-500">Backlogs</div></div>
                    </div>
                  </div>
                ))}
              </div>

              {selected && (
                <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="text-sm font-bold text-purple-300">Full Profile — {selected.name}</div>
                    <button onClick={() => handleDeleteStudent(selected.id)} className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-bold hover:bg-red-500/20 transition-all">Remove Student</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                      ['Roll No', selected.rollNo], ['Section', selected.section], ['Year', selected.academicYear], ['Semester', `Sem ${selected.semesterNo ?? 1}`],
                      ['Phone', selected.phone], ['DOB', selected.dob], ['Blood Group', selected.bloodGroup], ['Category', selected.category],
                      ['Parent', selected.parentName], ['Parent Phone', selected.parentPhone], ['Hostel', selected.hostelStatus], ['Scholarship', selected.scholarshipStatus],
                      ['Nationality', selected.nationality], ['Admission', selected.admissionDate], ['Leave Balance', `${selected.leaveBalance ?? 0} days`], ['Backlogs', String(selected.backlogCount ?? 0)],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-black/40 rounded-xl p-2">
                        <div className="text-[9px] text-slate-500 uppercase">{k}</div>
                        <div className="font-bold text-white mt-0.5 truncate">{v ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div><span className="text-[10px] text-slate-500">Address: </span><span className="text-xs text-slate-300">{selected.address ?? '—'}</span></div>
                </div>
              )}
            </div>
          )}

          {/* ACADEMICS */}
          {activeTab === 'academics' && selected && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white">Academics — {selected.name}</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                  <div className="text-2xl font-black text-purple-400">{selected.cgpa ?? '—'}</div>
                  <div className="text-xs text-slate-400 mt-1">CGPA</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                  <div className={`text-2xl font-black ${selected.backlogCount ? 'text-red-400' : 'text-emerald-400'}`}>{selected.backlogCount ?? 0}</div>
                  <div className="text-xs text-slate-400 mt-1">Backlogs</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                  <div className="text-2xl font-black text-amber-400">Sem {selected.semesterNo ?? 1}</div>
                  <div className="text-xs text-slate-400 mt-1">Current Semester</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                <div className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">SGPA Per Semester</div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const v = selected.sgpa?.[i];
                    return (
                      <div key={i} className="text-center p-2 rounded-xl bg-black/40 border border-white/5">
                        <div className={`text-sm font-black ${v ? (v >= 8 ? 'text-emerald-400' : v >= 6 ? 'text-amber-400' : 'text-red-400') : 'text-slate-600'}`}>{v ?? '—'}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">S{i + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-xs text-slate-400">
                <div className="font-bold text-slate-300 mb-2">Grade Summary</div>
                <p>{selected.gradesSummary ?? 'No summary available.'}</p>
              </div>
            </div>
          )}

          {/* FEES */}
          {activeTab === 'fees' && selected && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white">Fee Management — {selected.name}</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                  <div className="text-xl font-black text-white">₹{(selected.totalFee ?? 0).toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-1">Total Fee</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 text-center">
                  <div className="text-xl font-black text-emerald-400">₹{(selected.feePaid ?? 0).toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-1">Paid</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/20 text-center">
                  <div className="text-xl font-black text-amber-400">₹{(selected.feeDue ?? 0).toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-1">Due</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Fee Status</span>
                  <span className={`text-xs font-black ${feeColor(selected.feeStatus)}`}>{selected.feeStatus}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: pct(Math.round(((selected.feePaid ?? 0) / (selected.totalFee || 1)) * 100)) }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Paid: {Math.round(((selected.feePaid ?? 0) / (selected.totalFee || 1)) * 100)}%</span>
                  <span>Scholarship: <strong className="text-purple-300">{selected.scholarshipStatus ?? 'None'}</strong></span>
                </div>
                {selected.feeStatus !== 'Paid' && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
                    <AlertTriangle size={13} />Due amount ₹{(selected.feeDue ?? 0).toLocaleString()} pending. Notify parent for immediate payment.
                  </div>
                )}
              </div>
              <form onSubmit={handleRecordPayment} className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-3">
                <div className="text-xs font-bold text-emerald-300 border-b border-white/5 pb-2">Record Fee Payment</div>
                <div className="flex gap-3">
                  <input type="number" min="1" required value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="Enter amount (₹)" className="flex-1 p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400" />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase">Record Payment</button>
                </div>
              </form>
            </div>
          )}

          {/* ATTENDANCE */}
          {activeTab === 'attendance' && selected && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white">Attendance — {selected.name}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                  <div className={`text-2xl font-black ${(selected.attendancePct ?? 0) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{selected.attendancePct}%</div>
                  <div className="text-xs text-slate-400 mt-1">Overall Attendance</div>
                  {(selected.attendancePct ?? 0) < 75 && <div className="text-[10px] text-red-400 mt-1 font-bold">⚠ Below 75% — Shortfall</div>}
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                  <div className="text-2xl font-black text-blue-400">{selected.leaveBalance ?? 0}</div>
                  <div className="text-xs text-slate-400 mt-1">Leave Balance (days)</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                <div className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">Attendance Progress</div>
                {[['Overall', selected.attendancePct ?? 0], ['Theory Classes', Math.min(100, (selected.attendancePct ?? 0) + 3)], ['Lab Sessions', Math.max(0, (selected.attendancePct ?? 0) - 5)]].map(([label, val]) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-[10px]"><span className="text-slate-400">{label}</span><span className={`font-bold ${Number(val) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{val}%</span></div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full"><div className={`h-full rounded-full ${Number(val) >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${val}%` }} /></div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleUpdateAttendance} className="p-4 rounded-2xl bg-black/60 border border-blue-500/20 space-y-3">
                <div className="text-xs font-bold text-blue-300 border-b border-white/5 pb-2">Update Attendance & Leave</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Attendance %</label>
                    <input type="number" min="0" max="100" step="0.1" value={editAttendance} onChange={e => setEditAttendance(e.target.value)} placeholder={String(selected.attendancePct)} className="w-full p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Leave Balance (days)</label>
                    <input type="number" min="0" value={editLeave} onChange={e => setEditLeave(e.target.value)} placeholder={String(selected.leaveBalance)} className="w-full p-2 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs uppercase">Save Changes</button>
              </form>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'documents' && selected && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white">Documents — {selected.name}</div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="font-bold text-slate-300">Document Checklist</span>
                  <span className="text-purple-400">{selected.documentStatus?.filter(d => d.submitted).length ?? 0} / {selected.documentStatus?.length ?? 0} Submitted</span>
                </div>
                {(selected.documentStatus ?? []).map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      {doc.submitted ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <XCircle size={14} className="text-red-400 shrink-0" />}
                      <span className="text-xs text-slate-200">{doc.name}</span>
                    </div>
                    <button onClick={() => toggleDoc(i)} className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${doc.submitted ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20'}`}>
                      {doc.submitted ? 'Mark Pending' : 'Mark Submitted'}
                    </button>
                  </div>
                ))}
                {!(selected.documentStatus?.length) && <div className="text-xs text-slate-500 text-center py-4 italic">No document records available.</div>}
              </div>
            </div>
          )}

          {/* ENROLLMENT */}
          {activeTab === 'enrollment' && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-white">Enrollment & Clearance Management</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                  <div className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">Section Allocation</div>
                  <form onSubmit={handleAllocate} className="space-y-3">
                    <select onChange={e => { const s = students.find(x => x.id === e.target.value); if (s) setSelected(s); }} className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none cursor-pointer">
                      {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo}) — {s.section}</option>)}
                    </select>
                    <select value={allocSection} onChange={e => setAllocSection(e.target.value)} className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none cursor-pointer">
                      {['CS-A','CS-B','CS-C'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs uppercase">Commit Allocation</button>
                  </form>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                  <div className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2">Clearance Audits</div>
                  {clearances.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.roll} · {c.type}</div>
                      </div>
                      {c.status === 'Pending'
                        ? <button onClick={() => approveClearance(c.id)} className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold hover:bg-purple-500/20 transition-all">Approve</button>
                        : <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Approved</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5">
                <div className="text-xs font-bold text-slate-300 border-b border-white/5 pb-2 mb-3">Roll Index — Master Ledger</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-[10px] text-slate-500 uppercase border-b border-white/5">{['Roll No','Name','Section','Year','CGPA','Fee Status','Attendance'].map(h => <th key={h} className="text-left py-2 px-2 font-bold">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelected(s)}>
                          <td className="py-2 px-2 font-mono text-slate-300">{s.rollNo}</td>
                          <td className="py-2 px-2 font-bold text-white">{s.name}</td>
                          <td className="py-2 px-2 text-slate-400">{s.section}</td>
                          <td className="py-2 px-2 text-slate-400">{s.academicYear}</td>
                          <td className="py-2 px-2"><span className={s.cgpa && s.cgpa >= 8 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{s.cgpa ?? '—'}</span></td>
                          <td className="py-2 px-2"><span className={`font-bold ${feeColor(s.feeStatus)}`}>{s.feeStatus}</span></td>
                          <td className="py-2 px-2"><span className={(s.attendancePct ?? 0) >= 75 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{s.attendancePct}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {!selected && activeTab !== 'directory' && activeTab !== 'enrollment' && (
            <div className="p-8 text-center text-xs text-slate-500 italic bg-black/20 rounded-2xl border border-white/5">Select a student from the Directory tab first.</div>
          )}
        </div>
      </div>
    </div>
  );
}
