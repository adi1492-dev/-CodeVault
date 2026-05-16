'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Cpu, 
  Database, 
  LogOut, 
  CheckCircle2, 
  Layers,
  Building2,
  UserCheck,
  PlusCircle,
  Briefcase,
  Filter,
  Search,
  GraduationCap,
  Calendar,
  Award,
  CreditCard,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  Send,
  BookOpen,
  ShieldCheck,
  Zap,
  AlertCircle,
  Coffee,
  LayoutDashboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  getUsers, 
  addUser, 
  saveUsers,
  getCurrentUser, 
  setCurrentUser, 
  getSubjects, 
  assignSubjectTeacher, 
  assignClassTeacher, 
  getDepartments,
  addDepartment,
  assignDepartmentLeadership,
  mintCertificate,
  createAlert,
  UserRecord, 
  UserRole, 
  SubjectRecord,
  DepartmentRecord,
  getLeaves,
  getPasses,
  getGrievances,
  getStudentRequests,
  LeaveRequest,
  GatePass,
  GrievanceRecord,
  StudentRequest
} from '@/lib/store';
import { useWebSocket } from '@/components/WebSocketProvider';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  
  const { broadcastRefresh } = useWebSocket();
  
  // Primary Navigation tabs (Left Menu)
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'students' | 'users' | 'academics' | 'telemetry' | 'certificates'>('overview');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  
  // Secondary Sub-navigation tab states (Top Horizontal Bar)
  const [deptSubTab, setDeptSubTab] = useState<'list' | 'create'>('list');
  const [studentSubTab, setStudentSubTab] = useState<'search' | 'update'>('search');
  const [staffSubTab, setStaffSubTab] = useState<'directory' | 'add'>('directory');
  const [academicSubTab, setAcademicSubTab] = useState<'subjects' | 'class_teachers'>('subjects');

  // Create Department & Auto Account Creation State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [autoCreateHeads, setAutoCreateHeads] = useState(true);
  const [hodName, setHodName] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [vhodName, setVhodName] = useState('');
  const [vhodEmail, setVhodEmail] = useState('');
  const [deptSuccessMsg, setDeptSuccessMsg] = useState('');
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');

  // Student Search State
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editAttendanceVal, setEditAttendanceVal] = useState<number>(90);
  const [editFeeVal, setEditFeeVal] = useState<'Paid' | 'Pending'>('Paid');
  const [infoNotice, setInfoNotice] = useState('');

  // ==========================================
  // STAFF & FACULTY MANAGEMENT STATES
  // ==========================================
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('teacher');
  const [newStaffDept, setNewStaffDept] = useState('');
  const [newStaffSection, setNewStaffSection] = useState('');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  // Search and Select Staff in User Accounts view
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // ==========================================
  // ACADEMIC YEAR SCOPE FILTERS & ALLOCATIONS
  // ==========================================
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('1st Year');
  const [newDeptYear, setNewDeptYear] = useState<string>('1st Year');
  const [newStaffYear, setNewStaffYear] = useState<string>('1st Year');
  const [newStaffMultiYears, setNewStaffMultiYears] = useState<string[]>(['1st Year']);

  const [mintTx, setMintTx] = useState('');

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [passes, setPasses] = useState<GatePass[]>([]);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [adminRequests, setAdminRequests] = useState<StudentRequest[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrent(user);
    }
    setUsers(getUsers());
    setSubjects(getSubjects());
    setDepartments(getDepartments());
    setLeaves(getLeaves());
    setPasses(getPasses());
    setGrievances(getGrievances());
    setAdminRequests(getStudentRequests());
  }, []);

  // Default selection when tabs load
  useEffect(() => {
    const allStudents = users.filter(u => u.role === 'student');
    if (activeTab === 'students' && !selectedStudentId && allStudents.length > 0) {
      setSelectedStudentId(allStudents[0].id);
    }

    const staffList = users.filter(u => u.role !== 'student' && u.role !== 'parent');
    if (activeTab === 'users' && !selectedStaffId && staffList.length > 0) {
      setSelectedStaffId(staffList[0].id);
    }
  }, [activeTab, users, selectedStudentId, selectedStaffId]);

  // Sync update controls when active item changes
  useEffect(() => {
    if (selectedStudentId) {
      const target = users.find(u => u.id === selectedStudentId);
      if (target) {
        setEditAttendanceVal(target.attendancePct || 91.5);
        setEditFeeVal(target.feeStatus === 'Pending' ? 'Pending' : 'Paid');
      }
    }
  }, [selectedStudentId, users]);

  // ==========================================
  // ACTIONS & SUBMISSIONS
  // ==========================================

  const sendFeeReminder = (student: UserRecord) => {
    const alertMsg = `Reminder: ₹${student.feeAmountDue?.toLocaleString() || 0} is pending for the current academic year. Please clear your dues.`;
    
    // Alert Student
    createAlert(student.id, 'fee', 'Pending Fee Reminder', alertMsg);
    
    // Alert Parent (mock lookup for parent)
    const parent = getUsers().find(u => u.role === 'parent' && u.department === student.id);
    if (parent) {
      createAlert(parent.id, 'fee', `Ward Pending Fee Reminder: ${student.name}`, alertMsg);
    }
    
    broadcastRefresh('REFRESH_ALERTS');
    setStudentSuccessMsg(`Fee reminder sent successfully to ${student.name} and their guardian.`);
    setTimeout(() => setStudentSuccessMsg(''), 4000);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    
    let createdHodId: string | undefined = undefined;
    let createdVhodId: string | undefined = undefined;

    if (autoCreateHeads) {
      if (hodName && hodEmail) {
        const generatedHod = addUser({
          name: hodName,
          email: hodEmail,
          password: 'password',
          role: 'hod',
          department: newDeptName,
          academicYear: newDeptYear
        });
        createdHodId = generatedHod.id;
      }
      if (vhodName && vhodEmail) {
        const generatedVhod = addUser({
          name: vhodName,
          email: vhodEmail,
          password: 'password',
          role: 'vicehod',
          department: newDeptName,
          academicYear: newDeptYear
        });
        createdVhodId = generatedVhod.id;
      }
    }

    const created = addDepartment(
      newDeptName, 
      newDeptCode || newDeptName.substring(0, 4).toUpperCase(),
      createdHodId,
      createdVhodId,
      newDeptYear
    );

    if (createdHodId || createdVhodId) {
      assignDepartmentLeadership(created.id, createdHodId, createdVhodId, newDeptYear);
    }

    setDepartments(getDepartments());
    setUsers(getUsers());
    
    setDeptSuccessMsg(`Department "${created.name}" created successfully under ${newDeptYear}.`);
    setNewDeptName('');
    setNewDeptCode('');
    setHodName('');
    setHodEmail('');
    setVhodName('');
    setVhodEmail('');
    
    setDeptSubTab('list');
    
    setTimeout(() => setDeptSuccessMsg(''), 6000);
  };

  const handleCreateStaffProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const created = addUser({
      name: newStaffName,
      email: newStaffEmail,
      password: 'password',
      role: newStaffRole,
      department: newStaffDept || departments[0]?.name || 'General Institute',
      section: newStaffSection || undefined,
      academicYear: newStaffYear,
      academicYears: newStaffMultiYears.length > 0 ? newStaffMultiYears : [newStaffYear]
    });

    setUsers(getUsers());
    setSelectedStaffId(created.id);
    setStaffSuccessMsg(`Profile for "${created.name}" successfully created as ${created.role} (${newStaffMultiYears.join(', ')}).`);
    setNewStaffName('');
    setNewStaffEmail('');
    
    setStaffSubTab('directory');

    setTimeout(() => setStaffSuccessMsg(''), 6000);
  };

  const handleUpdateStudentStats = (studentId: string) => {
    const updated = users.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          attendancePct: editAttendanceVal,
          feeStatus: editFeeVal,
          feeAmountDue: editFeeVal === 'Paid' ? 0 : 45000
        };
      }
      return u;
    });
    saveUsers(updated);
    setUsers(updated);
    setInfoNotice('Student records updated successfully.');
    setTimeout(() => setInfoNotice(''), 4000);
  };

  const handleUpdateStaffSection = (staffId: string, newSection: string) => {
    const updated = users.map(u => {
      if (u.id === staffId) {
        return { ...u, section: newSection || undefined };
      }
      return u;
    });
    saveUsers(updated);
    setUsers(updated);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const filteredDepartments = selectedYearFilter === 'All Years' 
    ? departments 
    : departments.filter(d => !d.academicYear || d.academicYear === selectedYearFilter);

  const filteredSubjects = subjects.filter(s => {
    const yearMatch = selectedYearFilter === 'All Years' || !s.academicYear || s.academicYear === selectedYearFilter;
    const deptMatch = selectedDeptFilter === 'all' || s.department.toLowerCase() === selectedDeptFilter.toLowerCase();
    return yearMatch && deptMatch;
  });

  const eligibleStaff = users.filter(u => {
    if (u.role === 'student' || u.role === 'parent') return false;
    if (selectedYearFilter !== 'All Years') {
      const singleMatch = !u.academicYear || u.academicYear === selectedYearFilter;
      const multiMatch = u.academicYears?.includes(selectedYearFilter);
      return singleMatch || multiMatch;
    }
    return true;
  });

  const studentSearchResults = users.filter(u => {
    if (u.role !== 'student') return false;
    if (selectedYearFilter !== 'All Years' && u.academicYear && u.academicYear !== selectedYearFilter) return false;
    if (!studentSearchQuery) return true;
    const q = studentSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || 
           u.rollNo?.toLowerCase().includes(q) || 
           u.email.toLowerCase().includes(q) || 
           u.section?.toLowerCase().includes(q);
  });

  const selectedStudent = users.find(u => u.id === selectedStudentId);

  const staffAndFacultyUsers = users.filter(u => {
    if (u.role === 'student' || u.role === 'parent') return false;
    if (selectedYearFilter !== 'All Years') {
      const singleMatch = !u.academicYear || u.academicYear === selectedYearFilter;
      const multiMatch = u.academicYears?.includes(selectedYearFilter);
      if (!singleMatch && !multiMatch) return false;
    }
    if (selectedDeptFilter !== 'all' && u.department?.toLowerCase() !== selectedDeptFilter.toLowerCase()) {
      return false;
    }
    if (!staffSearchQuery) return true;
    const q = staffSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || 
           u.email.toLowerCase().includes(q) || 
           u.role.toLowerCase().includes(q) ||
           u.department?.toLowerCase().includes(q) ||
           u.section?.toLowerCase().includes(q);
  });

  const selectedStaff = users.find(u => u.id === selectedStaffId);

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] selection:bg-[#854F6C] selection:text-[#FFDFC3] pb-20 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/25 via-indigo-950/15 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-fuchsia-950/10 rounded-full pointer-events-none blur-3xl" />

      <header className="border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 flex items-center justify-center font-black text-black text-xs shadow-md shadow-cyan-400/20">
              ADM
            </div>
            <div>
              <span className="font-bold text-lg block text-white">
                Administration Portal
              </span>
              <span className="text-sm text-cyan-400 block font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Administrator</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 font-medium">
              <Sparkles size={14} className="text-amber-400" />
              <span>Full Admin Access</span>
            </span>

            <button 
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8 relative z-10 items-start">
        <div className="w-full lg:w-72 shrink-0 p-4 rounded-3xl border border-white/10 bg-[#080d1a]/90 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-20">
          <div className="px-4 pb-3 border-b border-white/10 mb-4">
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wide block">
              Menu Options
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'overview' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} className="shrink-0" />
              <span className="truncate">Institutional Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'departments' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 size={18} className="shrink-0" />
              <span className="truncate">Departments</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'students' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <GraduationCap size={18} className="shrink-0" />
              <div className="text-left truncate flex-grow">
                <span className="block truncate">Search Students</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'users' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={18} className="shrink-0" />
              <span className="truncate">Staff & Teachers</span>
            </button>

            <button
              onClick={() => setActiveTab('academics')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'academics' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={18} className="shrink-0" />
              <span className="truncate">Academic Subjects ({subjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'telemetry' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu size={18} className="shrink-0" />
              <span className="truncate">System Status</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`w-full px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-start gap-3 ${
                activeTab === 'certificates' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={18} className="shrink-0" />
              <span className="truncate">Issue Certificates</span>
            </button>

          </div>

          {(activeTab === 'users' || activeTab === 'academics') && (
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <Filter size={13} className="text-cyan-400 shrink-0" />
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Filter by Department
                </span>
              </div>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/80 border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-black text-white">🌐 All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name} className="bg-black text-white truncate">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grow min-w-0 w-full space-y-6">

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 hidden sm:inline-block">
                Academic Year Scope:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto justify-end">
              {['1st Year', '2nd Year', '3rd Year', '4th Year', 'All Years'].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYearFilter(year)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedYearFilter === year
                      ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-black shadow-md shadow-cyan-400/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-cyan-950/20 to-black/40 space-y-2">
                  <div className="flex items-center justify-between text-cyan-400">
                    <Users size={24} />
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-4xl font-black text-white block">{users.filter(u => u.role === 'student').length}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Active Students</span>
                </div>

                <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-indigo-950/20 to-black/40 space-y-2">
                  <div className="flex items-center justify-between text-indigo-400">
                    <Briefcase size={24} />
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-4xl font-black text-white block">{users.filter(u => u.role !== 'student' && u.role !== 'parent' && u.role !== 'admin').length}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Teaching & Staff Cadre</span>
                </div>

                <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-rose-950/20 to-black/40 space-y-2">
                  <div className="flex items-center justify-between text-rose-400">
                    <ShieldAlert size={24} />
                    <Zap size={16} />
                  </div>
                  <span className="text-4xl font-black text-white block">{grievances.filter(g => g.status === 'Encrypted').length}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Security Reports</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Residency Metrics */}
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">Residency Operational State</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Pending Leaves</span>
                      <span className="text-xl font-bold text-amber-400">{leaves.filter(l => l.status === 'Pending').length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Passes Awaiting Action</span>
                      <span className="text-xl font-bold text-rose-400">{passes.filter(p => p.status === 'Pending').length}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Hostel Feedback Index</span>
                      <span className="text-xs font-bold text-emerald-400">Stable (4.2/5.0)</span>
                    </div>
                    <Sparkles className="text-amber-400" size={20} />
                  </div>
                </div>

                {/* Administrative Pipeline */}
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">Institutional Service Pipeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                          <FileText size={16} />
                        </div>
                        <span className="text-xs font-bold text-white">Pending Document Requests</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400">{adminRequests.filter(r => r.status === 'Pending' && r.type === 'Document').length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <Layers size={16} />
                        </div>
                        <span className="text-xs font-bold text-white">Academic Clearances</span>
                      </div>
                      <span className="text-xs font-bold text-blue-400">{adminRequests.filter(r => r.status === 'Pending' && r.type === 'Academic').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setDeptSubTab('list')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    deptSubTab === 'list' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 size={14} />
                  <span>🏢 Departments & Staff List</span>
                </button>
                <button
                  onClick={() => setDeptSubTab('create')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    deptSubTab === 'create' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PlusCircle size={14} />
                  <span>➕ Create New Department</span>
                </button>
              </div>

              {deptSubTab === 'list' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <Building2 className="text-cyan-400" size={18} />
                        <span>Departments & Staff Progress ({selectedYearFilter})</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Assign department leaders and track teacher syllabus updates.
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-bold text-cyan-400">
                      Total Departments: {filteredDepartments.length}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {filteredDepartments.map((d) => {
                      const currentHod = users.find(u => u.id === d.hodId);
                      const currentViceHod = users.find(u => u.id === d.viceHodId);
                      
                      const deptTeachers = users.filter(u => 
                        u.department?.toLowerCase() === d.name.toLowerCase() && 
                        (u.role === 'teacher' || u.role === 'subjectteacher' || u.role === 'classteacher')
                      );

                      return (
                        <div 
                          key={d.id} 
                          className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-all space-y-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-white">{d.name}</span>
                                {d.code && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-cyan-400">
                                    {d.code}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                Department ID: {d.id}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-400 font-medium">
                              Active Department
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                            <div className="space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                              <label className="text-[10px] font-bold text-fuchsia-400 uppercase block">
                                Head of Department (HOD)
                              </label>
                              <select
                                value={d.hodId || ''}
                                onChange={(e) => {
                                  assignDepartmentLeadership(d.id, e.target.value, d.viceHodId);
                                  setDepartments(getDepartments());
                                  setUsers(getUsers());
                                }}
                                className="w-full px-2 py-1 rounded bg-black text-xs text-white border border-white/5 focus:outline-none focus:border-fuchsia-400 font-medium"
                              >
                                <option value="">⚠️ Select User</option>
                                {eligibleStaff.map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.role})
                                  </option>
                                ))}
                              </select>
                              {currentHod && (
                                <div className="text-[10px] text-slate-400 truncate pt-0.5">
                                  {currentHod.email}
                                </div>
                              )}
                            </div>

                            <div className="space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                              <label className="text-[10px] font-bold text-cyan-400 uppercase block">
                                Vice HOD
                              </label>
                              <select
                                value={d.viceHodId || ''}
                                onChange={(e) => {
                                  assignDepartmentLeadership(d.id, d.hodId, e.target.value);
                                  setDepartments(getDepartments());
                                  setUsers(getUsers());
                                }}
                                className="w-full px-2 py-1 rounded bg-black text-xs text-white border border-white/5 focus:outline-none focus:border-cyan-400 font-medium"
                              >
                                <option value="">⚠️ Select User</option>
                                {eligibleStaff.map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.role})
                                  </option>
                                ))}
                              </select>
                              {currentViceHod && (
                                <div className="text-[10px] text-slate-400 truncate pt-0.5">
                                  {currentViceHod.email}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5 space-y-2.5">
                            <span className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                              <span>👨‍🏫 Teaching Staff & Syllabus Progress</span>
                              <span className="text-[11px] text-cyan-400 font-normal">
                                {deptTeachers.length} Teacher{deptTeachers.length === 1 ? '' : 's'}
                              </span>
                            </span>

                            {deptTeachers.length === 0 ? (
                              <div className="p-3 text-center rounded-xl bg-white/5 text-xs text-slate-500 font-medium">
                                No teachers assigned to this department yet.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {deptTeachers.map(t => {
                                  const tSubs = subjects.filter(s => s.teacherId === t.id);
                                  const avgCovered = tSubs.length > 0 
                                    ? Math.round(tSubs.reduce((acc, curr) => acc + curr.syllabusCoveredPct, 0) / tSubs.length)
                                    : 75;

                                  return (
                                    <div key={t.id} className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-bold text-white truncate block">{t.name}</span>
                                          <span className="text-[9px] font-bold px-1.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                                            {t.role === 'classteacher' ? 'Class Teacher' : 'Subject Teacher'}
                                          </span>
                                        </div>
                                        <span className="text-[11px] text-slate-400 block truncate">
                                          {tSubs.length > 0 ? `Subjects: ${tSubs.map(sub => sub.name).join(', ')}` : 'No subjects assigned'}
                                        </span>
                                      </div>

                                      <div className="w-24 sm:w-32 text-right shrink-0">
                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                          <span className="text-slate-500">Syllabus</span>
                                          <span className="font-bold text-cyan-400">{avgCovered}%</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                                            style={{ width: `${avgCovered}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {deptSubTab === 'create' && (
                <div className="max-w-xl mx-auto glass p-6 rounded-3xl border-cyan-500/20 bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <PlusCircle size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-white">Create New Department</h2>
                      <p className="text-xs text-slate-400">Add a department and assign its heads</p>
                    </div>
                  </div>

                  {deptSuccessMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <span>{deptSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateDepartment} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Department Name
                      </label>
                      <input 
                        type="text"
                        required
                        value={newDeptName}
                        onChange={(e) => setNewDeptName(e.target.value)}
                        placeholder="e.g. Artificial Intelligence"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Department Shortcode
                        </label>
                        <input 
                          type="text"
                          value={newDeptCode}
                          onChange={(e) => setNewDeptCode(e.target.value)}
                          placeholder="e.g. AI (Optional)"
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Target Academic Year Scope
                        </label>
                        <select
                          value={newDeptYear}
                          onChange={(e) => setNewDeptYear(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 mt-4 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={autoCreateHeads}
                          onChange={(e) => setAutoCreateHeads(e.target.checked)}
                          className="rounded border-white/10 bg-black text-cyan-400 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                          Create user accounts for HOD and Vice HOD
                        </span>
                      </label>

                      {autoCreateHeads && (
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-3 animate-fade-in">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-white/5">
                            Account Information
                          </span>
                          
                          <div className="space-y-2">
                            <span className="text-xs text-slate-300 block font-medium">Head of Department (HOD)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="text" 
                                value={hodName}
                                onChange={e => setHodName(e.target.value)}
                                placeholder="Full Name"
                                className="px-2.5 py-1.5 rounded-lg bg-black text-xs border border-white/10 focus:border-cyan-400 focus:outline-none"
                              />
                              <input 
                                type="text" 
                                value={hodEmail}
                                onChange={e => setHodEmail(e.target.value)}
                                placeholder="Email Address"
                                className="px-2.5 py-1.5 rounded-lg bg-black text-xs border border-white/10 focus:border-cyan-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-xs text-slate-300 block font-medium">Vice HOD / Assistant Head</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="text" 
                                value={vhodName}
                                onChange={e => setVhodName(e.target.value)}
                                placeholder="Full Name"
                                className="px-2.5 py-1.5 rounded-lg bg-black text-xs border border-white/10 focus:border-cyan-400 focus:outline-none"
                              />
                              <input 
                                type="text" 
                                value={vhodEmail}
                                onChange={e => setVhodEmail(e.target.value)}
                                placeholder="Email Address"
                                className="px-2.5 py-1.5 rounded-lg bg-black text-xs border border-white/10 focus:border-cyan-400 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 text-center pt-1">
                            Default password for new accounts is set to "password".
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      Save Department
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setStudentSubTab('search')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    studentSubTab === 'search' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Search size={14} />
                  <span>🔍 Search & View Profiles</span>
                </button>
                <button
                  onClick={() => setStudentSubTab('update')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    studentSubTab === 'update' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText size={14} />
                  <span>⚙️ Update Student Records</span>
                </button>
              </div>

              {studentSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{studentSuccessMsg}</span>
                </div>
              )}

              <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <GraduationCap className="text-cyan-400" size={20} />
                      <span>Student Profiles Query</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Search for any student to inspect overall standings.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-80">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="text"
                      value={studentSearchQuery}
                      onChange={e => setStudentSearchQuery(e.target.value)}
                      placeholder="Search by Name, Roll No, or Email..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs placeholder:text-slate-500"
                    />
                    {studentSearchQuery && (
                      <button 
                        onClick={() => setStudentSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 items-center">
                  <span className="text-[11px] text-slate-400 font-bold mr-1">
                    Search Results:
                  </span>
                  {studentSearchResults.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedStudentId === s.id 
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-black/30 text-slate-400 border border-white/5 hover:border-white/10 hover:text-slate-200'
                      }`}
                    >
                      <span>{s.name}</span>
                      {s.rollNo && <span className="text-[10px] text-slate-500 font-normal">({s.rollNo})</span>}
                    </button>
                  ))}
                  {studentSearchResults.length === 0 && (
                    <span className="text-xs text-slate-500 italic">
                      No matching students found.
                    </span>
                  )}
                </div>
              </div>

              {studentSubTab === 'search' && selectedStudent && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                  <div className="lg:col-span-5 space-y-6">
                    <div className="glass p-6 rounded-3xl border-cyan-500/20 bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-b border-cyan-500/20">
                        Student Record
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-xl shrink-0">
                          {selectedStudent.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-black text-white truncate">{selectedStudent.name}</h3>
                          <span className="text-xs text-cyan-400 block font-semibold">
                            Roll No: {selectedStudent.rollNo || 'N/A'}
                          </span>
                          <span className="text-xs text-slate-400 block truncate mt-0.5">
                            {selectedStudent.email}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/5 text-xs">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-500">Department</span>
                          <span className="font-bold text-white">{selectedStudent.department || 'Computer Science'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-500">Class Section</span>
                          <span className="font-bold text-cyan-300">Section {selectedStudent.section || 'CS-A'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Account ID</span>
                          <span className="text-slate-400 font-mono">{selectedStudent.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-cyan-400" />
                          <h4 className="text-xs font-bold text-slate-200">
                            Attendance Record
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Live Tracking
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center space-y-1">
                          <span className="text-xs text-slate-500 block">Total Attendance</span>
                          <span className="text-3xl font-black text-white block">
                            {selectedStudent.attendancePct || 91.5}%
                          </span>
                      </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-indigo-400" />
                          <h4 className="text-xs font-bold text-slate-200">
                            Fee Status & Payments
                          </h4>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">
                              Current Standing:
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              selectedStudent.feeStatus === 'Pending' 
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {selectedStudent.feeStatus || 'Paid'}
                            </span>
                          </div>
                          <span className="text-lg font-black text-white block mt-1">
                            Total Due: ₹{selectedStudent.feeAmountDue !== undefined ? selectedStudent.feeAmountDue : 0}
                          </span>
                        </div>

                        {selectedStudent.feeStatus === 'Pending' ? (
                          <button
                            onClick={() => sendFeeReminder(selectedStudent)}
                            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all shrink-0 flex items-center gap-2"
                          >
                            <AlertCircle size={14} />
                            Send Fee Reminder
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Downloading payment receipt for ${selectedStudent.name}.`)}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-all shrink-0"
                          >
                            Download Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {studentSubTab === 'update' && selectedStudent && (
                <div className="max-w-xl mx-auto glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold text-white">⚙️ Update Target Student Records</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-300 font-medium">Set Attendance Percentage</span>
                        <span className="font-bold text-cyan-400">{editAttendanceVal}%</span>
                      </div>
                      <input 
                        type="range"
                        min="50"
                        max="100"
                        step="1"
                        value={editAttendanceVal}
                        onChange={(e) => setEditAttendanceVal(parseInt(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs text-slate-300 font-medium block">Set Fee Status</span>
                      <select
                        value={editFeeVal}
                        onChange={(e) => setEditFeeVal(e.target.value as 'Paid' | 'Pending')}
                        className="w-full bg-black/80 text-xs font-bold text-white border border-white/10 rounded-xl p-2.5 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Paid">✅ Fees Cleared (Paid)</option>
                        <option value="Pending">⚠️ Payment Pending</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleUpdateStudentStats(selectedStudent.id)}
                      className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all uppercase tracking-wider block mt-2"
                    >
                      Commit Information Changes
                    </button>
                  </div>

                  {infoNotice && (
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs text-center font-bold animate-fade-in">
                      {infoNotice}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setStaffSubTab('directory')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    staffSubTab === 'directory' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>👥 Staff Directory & Allotments</span>
                </button>
                <button
                  onClick={() => setStaffSubTab('add')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    staffSubTab === 'add' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus size={14} />
                  <span>➕ Add Staff / Faculty Account</span>
                </button>
              </div>

              {staffSubTab === 'directory' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                  <div className="lg:col-span-5 space-y-3">
                    <div className="glass p-5 rounded-3xl border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                          Staff Directory ({staffAndFacultyUsers.length})
                        </span>
                      </div>

                      <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text"
                          value={staffSearchQuery}
                          onChange={e => setStaffSearchQuery(e.target.value)}
                          placeholder="Search Staff by Name or Role..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                        />
                        {staffSearchQuery && (
                          <button onClick={() => setStaffSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                            ×
                          </button>
                        )}
                      </div>

                      {staffAndFacultyUsers.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-600 italic">
                          No staff accounts found matching filter.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                          {staffAndFacultyUsers.map(u => {
                            const isSelected = selectedStaffId === u.id;
                            return (
                              <div 
                                key={u.id}
                                onClick={() => setSelectedStaffId(u.id)}
                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                  isSelected 
                                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-cyan-500/40 shadow-md' 
                                    : 'bg-black/30 border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white truncate block">{u.name}</span>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded shrink-0 capitalize ${
                                      u.role === 'hod' ? 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20' :
                                      u.role === 'vicehod' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' :
                                      u.role === 'classteacher' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                                      'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                    }`}>
                                      {u.role === 'vicehod' ? 'Vice HOD' : u.role === 'classteacher' ? 'Class Teacher' : u.role === 'subjectteacher' ? 'Subject Teacher' : u.role}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                                    {u.department || 'General Base'} {u.section ? `• Section ${u.section}` : ''}
                                  </span>
                                </div>

                                <ChevronRight size={14} className={`shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANEL: Live preview panel for allotted capabilities */}
                  <div className="lg:col-span-7 space-y-6">
                    {selectedStaff ? (
                      <div className="glass p-6 rounded-3xl border-white/5 space-y-6 animate-fade-in sticky top-20">
                        <div className="flex items-start justify-between pb-4 border-b border-white/5 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-base shrink-0">
                              👨‍💼
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                                Staff Allotment Portfolio
                              </span>
                              <h3 className="text-base font-black text-white">{selectedStaff.name}</h3>
                              <span className="text-xs text-slate-400 block">{selectedStaff.email}</span>
                            </div>
                          </div>

                          <span className="px-3 py-1 rounded-xl bg-black text-xs font-bold text-white border border-white/5 shrink-0 capitalize">
                            {selectedStaff.role === 'vicehod' ? 'Vice HOD' : selectedStaff.role === 'classteacher' ? 'Class Teacher' : selectedStaff.role === 'subjectteacher' ? 'Subject Teacher' : selectedStaff.role}
                          </span>
                        </div>

                        {(selectedStaff.role === 'hod' || selectedStaff.role === 'vicehod') ? (
                          <div className="space-y-4 animate-fade-in">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-fuchsia-950/20 to-indigo-950/20 border border-fuchsia-500/20 space-y-3">
                              <span className="text-[10px] font-bold text-fuchsia-300 uppercase block tracking-wider font-mono">
                                🏛️ Allotted Department Responsibility
                              </span>

                              {(() => {
                                const mappedDept = departments.find(d => 
                                  d.hodId === selectedStaff.id || 
                                  d.viceHodId === selectedStaff.id || 
                                  d.name.toLowerCase() === selectedStaff.department?.toLowerCase()
                                );

                                if (!mappedDept) {
                                  return (
                                    <div className="text-xs text-slate-400">
                                      Currently linked to base domain: <strong className="text-white">{selectedStaff.department || 'Computer Science'}</strong>
                                    </div>
                                  );
                                }

                                const deptSubjects = subjects.filter(s => s.department.toLowerCase() === mappedDept.name.toLowerCase());
                                const avgDeptProgress = deptSubjects.length > 0 
                                  ? Math.round(deptSubjects.reduce((acc, curr) => acc + curr.syllabusCoveredPct, 0) / deptSubjects.length)
                                  : 75;

                                return (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <span className="text-lg font-black text-white block">{mappedDept.name}</span>
                                        {mappedDept.code && (
                                          <span className="text-xs font-bold text-slate-400">Code: {mappedDept.code}</span>
                                        )}
                                      </div>

                                      <span className="px-2.5 py-1 rounded bg-fuchsia-500/10 text-fuchsia-300 text-[10px] font-bold border border-fuchsia-500/20">
                                        {mappedDept.hodId === selectedStaff.id ? 'Primary HOD Account' : 'Vice HOD Delegate'}
                                      </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400">Department Syllabus Average</span>
                                        <span className="font-bold text-fuchsia-300">{avgDeptProgress}%</span>
                                      </div>
                                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-gradient-to-r from-fuchsia-400 to-indigo-500 h-full rounded-full" 
                                          style={{ width: `${avgDeptProgress}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] text-slate-500 block">
                                        Governing {deptSubjects.length} specific mapped subjects active across student clusters.
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="space-y-2 pt-2">
                              <span className="text-xs font-bold text-slate-300 block">Assigned Administrative Privileges:</span>
                              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">✅ View live staff delivery logs</div>
                                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">✅ Override lab grading buffers</div>
                                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">✅ Manage faculty syllabus modules</div>
                                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">✅ Dispatch real-time notices</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-5 animate-fade-in">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/20 to-teal-950/20 border border-cyan-500/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase block tracking-wider font-mono">
                                  🎓 Allotted Class Section Scope
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">Dynamic Binder</span>
                              </div>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                                <div>
                                  <span className="text-xs text-slate-400 block font-medium">Assigned Section:</span>
                                  <span className="text-base font-black text-white block mt-0.5">
                                    {selectedStaff.section ? `Section ${selectedStaff.section}` : 'No class section assigned'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <span className="text-[10px] text-slate-500 shrink-0 font-bold">Switch:</span>
                                  <select
                                    value={selectedStaff.section || ''}
                                    onChange={(e) => handleUpdateStaffSection(selectedStaff.id, e.target.value)}
                                    className="p-2 rounded-xl bg-black border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none w-full sm:w-auto cursor-pointer"
                                  >
                                    <option value="">None</option>
                                    <option value="CS-A">Section CS-A</option>
                                    <option value="CS-B">Section CS-B</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                                  <BookOpen size={14} className="text-indigo-400" />
                                  <span>Allotted Subjects Taught</span>
                                </span>

                                <select
                                  value=""
                                  onChange={(e) => {
                                    const subId = e.target.value;
                                    if (subId) {
                                      assignSubjectTeacher(subId, selectedStaff.id, selectedStaff.name);
                                      setSubjects(getSubjects());
                                    }
                                  }}
                                  className="bg-black/80 text-[10px] text-cyan-300 font-bold border border-white/10 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                                >
                                  <option value="">➕ Assign Subject</option>
                                  {subjects.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                      {sub.name} ({sub.code})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {(() => {
                                const allottedSubs = subjects.filter(s => s.teacherId === selectedStaff.id);

                                if (allottedSubs.length === 0) {
                                  return (
                                    <div className="p-6 text-center rounded-xl bg-black/30 border border-white/5 text-xs text-slate-500">
                                      No specific subjects mapped to this teacher's portfolio yet. Select an option from the "Assign Subject" dropdown above to link one instantly.
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-2.5">
                                    {allottedSubs.map(sub => (
                                      <div key={sub.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-white/10 transition-all">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="min-w-0">
                                            <span className="text-xs font-bold text-white block truncate">{sub.name}</span>
                                            <span className="text-[10px] text-slate-400 block font-mono">
                                              Code: {sub.code} • Dept: {sub.department} • Tier: <strong className="text-cyan-300 font-sans">{sub.academicYear || '1st Year'}</strong>
                                            </span>
                                          </div>

                                          <button
                                            onClick={() => {
                                              assignSubjectTeacher(sub.id, '', '');
                                              setSubjects(getSubjects());
                                            }}
                                            title="Remove Subject"
                                            className="text-slate-600 hover:text-red-400 text-xs px-1.5 py-0.5 rounded transition-colors"
                                          >
                                            Unassign
                                          </button>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-slate-500 font-medium">Syllabus Completion</span>
                                            <span className="font-bold text-cyan-400">{sub.syllabusCoveredPct}%</span>
                                          </div>
                                          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                            <div 
                                              className="bg-cyan-400 h-full rounded-full" 
                                              style={{ width: `${sub.syllabusCoveredPct}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-12 text-center rounded-3xl bg-black/20 border border-white/5 text-slate-500 text-xs">
                        Select a staff member from the directory to inspect their specific allotments.
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Sub-Feature View 2: Add Staff Account Form */}
              {staffSubTab === 'add' && (
                <div className="max-w-xl mx-auto glass p-6 rounded-3xl border-cyan-500/20 bg-gradient-to-b from-white/[0.02] to-transparent animate-fade-in space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                      <UserPlus size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Add Staff / Faculty Account</h3>
                      <p className="text-xs text-slate-400">Creates secure management profiles (Admins cannot create students here)</p>
                    </div>
                  </div>

                  {staffSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-tight animate-fade-in">
                      {staffSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleCreateStaffProfile} className="space-y-4 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                      <input 
                        type="text"
                        required
                        value={newStaffName}
                        onChange={e => setNewStaffName(e.target.value)}
                        placeholder="e.g. Prof. Rakesh V."
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                      <input 
                        type="email"
                        required
                        value={newStaffEmail}
                        onChange={e => setNewStaffEmail(e.target.value)}
                        placeholder="e.g. rakesh@campuscore.edu"
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Designated Role
                        </label>
                        <select
                          value={newStaffRole}
                          onChange={e => setNewStaffRole(e.target.value as UserRole)}
                          className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="teacher">Teacher / Staff</option>
                          <option value="classteacher">Class Teacher</option>
                          <option value="subjectteacher">Subject Teacher</option>
                          <option value="hod">Head of Dept (HOD)</option>
                          <option value="vicehod">Vice HOD</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Assigned Department
                        </label>
                        <select
                          value={newStaffDept}
                          onChange={e => setNewStaffDept(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none truncate cursor-pointer"
                        >
                          <option value="">General Base Domain</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Primary Academic Scope
                        </label>
                        <select
                          value={newStaffYear}
                          onChange={e => {
                            setNewStaffYear(e.target.value);
                            if (!newStaffMultiYears.includes(e.target.value)) {
                              setNewStaffMultiYears([...newStaffMultiYears, e.target.value]);
                            }
                          }}
                          className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>

                      {(newStaffRole === 'classteacher' || newStaffRole === 'teacher') ? (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Assigned Section Scope
                          </label>
                          <select
                            value={newStaffSection}
                            onChange={e => setNewStaffSection(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="">No specific section link</option>
                            <option value="CS-A">Section CS-A</option>
                            <option value="CS-B">Section CS-B</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Cross-Year Management Array
                          </label>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(yr => {
                              const checked = newStaffMultiYears.includes(yr);
                              return (
                                <button
                                  type="button"
                                  key={yr}
                                  onClick={() => {
                                    if (checked) {
                                      setNewStaffMultiYears(newStaffMultiYears.filter(y => y !== yr));
                                    } else {
                                      setNewStaffMultiYears([...newStaffMultiYears, yr]);
                                    }
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                    checked ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-500'
                                  }`}
                                >
                                  {yr}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider transition-all"
                      >
                        Provision Staff Profile
                      </button>
                      <span className="text-[10px] text-slate-500 block text-center mt-2">
                        Account defaults generated securely with starter password verification.
                      </span>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: ACADEMIC SUBJECTS & TEACHER ASSIGNMENT             */}
          {/* ========================================================= */}
          {activeTab === 'academics' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Top Horizontal Sub-Menu */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setAcademicSubTab('subjects')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    academicSubTab === 'subjects' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={14} />
                  <span>📚 Manage Subjects Taught</span>
                </button>
                <button
                  onClick={() => setAcademicSubTab('class_teachers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    academicSubTab === 'class_teachers' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>👨‍🏫 Assign Class Teachers</span>
                </button>
              </div>

              {/* Sub-Feature View 1: Manage Subjects */}
              {academicSubTab === 'subjects' && (
                <div className="glass p-8 rounded-3xl border-white/5 space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="text-cyan-400" size={18} />
                        <span>Manage Subject Master Ledgers</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedDeptFilter === 'all' 
                          ? 'Showing subjects offered across all departments.' 
                          : `Showing subjects in department: ${selectedDeptFilter}`}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-300 font-medium shrink-0">
                      Syllabus Overview
                    </span>
                  </div>

                  {filteredSubjects.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-black/30 border border-white/5">
                      No subjects found for the selected department.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredSubjects.map((s) => {
                        const selectableFaculty = users.filter(u => u.role === 'subjectteacher' || u.role === 'hod' || u.role === 'vicehod' || u.role === 'teacher');
                        return (
                          <div key={s.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between space-y-4">
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-white block">{s.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-cyan-400 shrink-0">
                                  {s.code}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 block mb-3">Department: {s.department}</span>

                              {/* Syllabus Completed Slider */}
                              <div className="space-y-1.5 mb-4">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-400 font-medium">Syllabus Covered</span>
                                  <span className="font-bold text-cyan-300">{s.syllabusCoveredPct}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                                  <div 
                                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all"
                                    style={{ width: `${s.syllabusCoveredPct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Sub Units list */}
                              <div className="space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                  Modules / Units
                               </span>
                                {s.modules.map((m, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.completed ? 'bg-cyan-400' : 'bg-white/10'}`} />
                                    <span className={`truncate ${m.completed ? 'line-through text-slate-500' : ''}`}>{m.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Teacher Linker Control */}
                            <div className="pt-3 border-t border-white/5 space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">
                                Assigned Teacher
                              </label>
                              <select
                                value={s.teacherId || ''}
                                onChange={(e) => {
                                  const tId = e.target.value;
                                  const selectedT = selectableFaculty.find(t => t.id === tId);
                                  if (selectedT) {
                                    assignSubjectTeacher(s.id, tId, selectedT.name);
                                    setSubjects(getSubjects());
                                  }
                                }}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-black border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-medium cursor-pointer"
                              >
                                <option value="">⚠️ Select Teacher</option>
                                {selectableFaculty.map(t => (
                                  <option key={t.id} value={t.id}>
                                    {t.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Feature View 2: Assign Class Teachers Container */}
              {academicSubTab === 'class_teachers' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-2xl mx-auto">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users size={16} className="text-cyan-400" />
                      <span>Assign Class Section Supervisors</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select which key faculty member assumes primary administrative charge of each student section.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {['CS-A', 'CS-B'].map(stream => {
                      const currentTeacher = users.find(u => (u.role === 'teacher' || u.role === 'classteacher') && u.section === stream);
                      const availableTeachers = users.filter(u => u.role === 'teacher' || u.role === 'classteacher' || u.role === 'subjectteacher');
                      return (
                        <div key={stream} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                          <div>
                            <span className="text-xs font-bold text-white block">Stream: {stream}</span>
                            <span className="text-[10px] text-slate-500">Core section mapping parameter</span>
                          </div>

                          <select
                            value={currentTeacher?.id || ''}
                            onChange={(e) => {
                              const tId = e.target.value;
                              if (tId) {
                                assignClassTeacher(tId, stream);
                                setUsers(getUsers());
                              }
                            }}
                            className="bg-black text-xs text-cyan-300 font-bold border border-white/10 rounded-lg p-2 focus:outline-none cursor-pointer w-48"
                          >
                            <option value="">⚠️ Not Assigned</option>
                            {availableTeachers.map(ct => (
                              <option key={ct.id} value={ct.id}>
                                {ct.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SYSTEM STATUS VIEW                                 */}
          {/* ========================================================= */}
          {activeTab === 'telemetry' && (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Cpu size={16} className="text-cyan-400" />
                  <span>System & Server Status</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center">
                    <span className="text-xs text-slate-400 block font-medium">Active Servers</span>
                    <span className="text-lg font-black text-emerald-400 block mt-1">4 Online</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center">
                    <span className="text-xs text-slate-400 block font-medium">Server Response Time</span>
                    <span className="text-lg font-black text-cyan-400 block mt-1">0.42 ms</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 text-center font-medium">
                  ✅ System running smoothly with no errors.
                </div>

                <div className="pt-2 text-xs text-slate-500 text-center">
                  All databases and local code evaluators are synced successfully.
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: WEB3 CERTIFICATES                                  */}
          {/* ========================================================= */}
          {activeTab === 'certificates' && (
            <div className="glass p-6 rounded-3xl border-cyan-500/20 space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Soulbound Certificate Distributor</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Mint permanent cryptographic credentials for students</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                        1. Target Recipients (Bulk Selection Available)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const studentList = users.filter(u => u.role === 'student').map(s => s.id);
                          if (certStudentIds.length === studentList.length) {
                            setCertStudentIds([]);
                          } else {
                            setCertStudentIds(studentList);
                          }
                        }}
                        className="text-[10px] text-cyan-400 font-bold underline hover:text-cyan-300 cursor-pointer"
                      >
                        {certStudentIds.length === users.filter(u => u.role === 'student').length ? 'Deselect All' : 'Select All Cohort'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
                      {users.filter(u => u.role === 'student').map(s => {
                        const isSelected = certStudentIds.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => {
                              if (isSelected) {
                                setCertStudentIds(certStudentIds.filter(id => id !== s.id));
                              } else {
                                setCertStudentIds([...certStudentIds, s.id]);
                              }
                            }}
                            className={`p-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all border ${
                              isSelected 
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-bold' 
                                : 'bg-black/60 border-white/5 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="rounded border-white/10 bg-black text-cyan-500 focus:ring-0 cursor-pointer"
                            />
                            <span className="truncate">{s.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Certificate Title</label>
                      <input
                        type="text"
                        value={certName}
                        onChange={(e) => setCertName(e.target.value)}
                        placeholder="e.g. Master of AST Parsers"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Signatory Body / Issuer Name</label>
                      <input
                        type="text"
                        value={certIssuerName}
                        onChange={(e) => setCertIssuerName(e.target.value)}
                        placeholder="e.g. Dean of Computing Labs"
                        className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Embedded Photographic Template URL</label>
                    <input
                      type="text"
                      value={certPhotoUrl}
                      onChange={(e) => setCertPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 truncate"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">Provide a high-fidelity graphic URL to embed onto the minted output block.</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Comprehensive Document Description</label>
                    <textarea
                      rows={2}
                      value={certDescription}
                      onChange={(e) => setCertDescription(e.target.value)}
                      placeholder="Document text verifying curriculum coverage..."
                      className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (certStudentIds.length === 0 || !certName) return;
                      setMintStatus('minting');
                      setTimeout(() => {
                        const hash = '0x' + Math.random().toString(16).substr(2, 40);
                        mintCertificate(certStudentIds, certName, hash, certPhotoUrl, certDescription, certIssuerName);
                        setMintTx(hash);
                        setMintStatus('success');
                        setUsers(getUsers());
                        setTimeout(() => {
                          setMintStatus('idle');
                          setCertName('');
                          setCertStudentIds([]);
                        }, 5000);
                      }, 2500);
                    }}
                    disabled={mintStatus !== 'idle' || certStudentIds.length === 0 || !certName}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                  >
                    <Sparkles size={16} />
                    <span>{mintStatus === 'idle' ? `Mint Soulbound Badges (${certStudentIds.length} Selected)` : 'Processing Array Mint...'}</span>
                  </button>
                </div>

                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  {/* Real-time Template Preview Card */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 relative overflow-hidden">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block border-b border-white/5 pb-2">
                      Live Photographic Template Display
                    </span>
                    {certPhotoUrl ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 shadow-inner group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={certPhotoUrl} 
                          alt="Certificate Template" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <span className="text-[10px] text-amber-400 font-bold font-mono uppercase tracking-wider block">
                            {certIssuerName || 'Issuer Body'}
                          </span>
                          <span className="text-xs font-black text-white truncate block">
                            {certName || 'Certificate Title'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-video rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-slate-600 text-xs">
                        No Background URL Provided
                      </div>
                    )}
                  </div>

                  {/* Transaction Terminal Logs */}
                  <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-[10px] text-green-400 relative overflow-hidden flex flex-col justify-end min-h-[140px]">
                    {mintStatus === 'idle' && <div className="text-slate-500">Waiting for bulk array distribution...</div>}
                    {mintStatus === 'minting' && (
                      <div className="space-y-1 animate-pulse">
                        <div>{'>'} Mapping {certStudentIds.length} targeted identity structures...</div>
                        <div>{'>'} Writing composite fields (PhotoUrl, Details)...</div>
                        <div>{'>'} Executing recursive Polygon transactions...</div>
                        <div>{'>'} Awaiting network confirmations...</div>
                      </div>
                    )}
                    {mintStatus === 'success' && (
                      <div className="space-y-1 text-cyan-400">
                        <div>{'>'} Bulk Issuance Confirmed!</div>
                        <div>{'>'} Distributed across {certStudentIds.length} viewports.</div>
                        <div className="break-all">{'>'} Base Hash: {mintTx}</div>
                        <div>{'>'} Custom metadata persistently cryptographically bound.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
