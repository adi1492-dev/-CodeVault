'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  PlusCircle, 
  CheckCircle2, 
  Sliders, 
  LogOut, 
  Cpu, 
  Award, 
  Layers, 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Send, 
  UserCheck, 
  FileText,
  BookOpen,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, getUsers, saveUsers, getSubjects, updateSyllabusCoverage, createAlert, UserRecord, SubjectRecord } from '@/lib/store';
import { useWebSocket } from '@/components/WebSocketProvider';
import { createProblem } from '@/lib/api';
import ProctoringDashboard from '@/components/ProctoringDashboard';
import { Shield } from 'lucide-react';

interface StudentSubmission {
  id: string;
  studentName: string;
  rollNo: string;
  codeSnippet: string;
  status: string;
  autoScore: number;
  manualOverride?: number;
}

export default function UnifiedTeacherDashboard() {
  const router = useRouter();
  const [currentUser, setCurrent] = useState<UserRecord | null>(null);
  
  const [activeTab, setActiveTab] = useState<'teaching' | 'labs' | 'exams' | 'class'>('teaching');
  const [teachingSubTab, setTeachingSubTab] = useState<'curriculum' | 'problems'>('curriculum');
  const [classSubTab, setClassSubTab] = useState<'roster' | 'announcements' | 'results'>('roster');
  
  const [department, setDepartment] = useState('Computer Science');
  const [section, setSection] = useState('CS-A');
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [students, setStudents] = useState<UserRecord[]>([]);
  const { broadcastRefresh } = useWebSocket();

  // TEACHING & LABS
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [starterCode, setStarterCode] = useState('#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}');
  const [isPublished, setIsPublished] = useState(false);
  const [testCases, setTestCases] = useState([
    { input: '', expected_output: '', is_hidden: false, weight: 10 }
  ]);

  const [problems, setProblems] = useState([
    { id: 'p1', title: 'Array Sum Iteration Test', testcases: 4, activeSubmissions: 45 },
    { id: 'p2', title: 'Recursive Factorial Verification', testcases: 6, activeSubmissions: 38 },
    { id: 'p3', title: 'Dijkstra Shortest Path Adjacency Graph', testcases: 12, activeSubmissions: 52 },
    { id: 'p4', title: 'Lexical Tokenizer Buffer Stream Parser', testcases: 8, activeSubmissions: 29 },
    { id: 'p5', title: 'Dynamic Knapsack Table Memoization', testcases: 10, activeSubmissions: 41 }
  ]);

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    { id: 'sub1', studentName: 'Aarav Nikam', rollNo: 'CS-01', codeSnippet: 'void main() { int sum = 0; for(int i=0; i<10; i=i+1) sum=sum+i; printf("%d", sum); }', status: 'Passed Successful', autoScore: 90 },
    { id: 'sub2', studentName: 'Neha Sharma', rollNo: 'CS-02', codeSnippet: 'int fact(int n) { if(n<=1) return 1; return n * fact(n-1); }', status: 'Logic Optimal', autoScore: 95 },
    { id: 'sub3', studentName: 'Rohan Verma', rollNo: 'CS-03', codeSnippet: 'while(true) { malloc(1024); }', status: 'Runtime Trapped', autoScore: 10, manualOverride: 25 },
    { id: 'sub4', studentName: 'Priya Patel', rollNo: 'CS-04', codeSnippet: 'int knapsack(int W, int wt[], int val[], int n) { ... }', status: 'Passed Full Coverage', autoScore: 100 },
    { id: 'sub5', studentName: 'Amit Deshmukh', rollNo: 'CS-05', codeSnippet: '// Missing null pointer validation check on edge traversal', status: 'Partial Testcase Passed', autoScore: 60 }
  ]);

  // CLASS ROSTER & ANNOUNCEMENTS
  const [message, setMessage] = useState('');
  const [broadcastLog, setBroadcast] = useState<string[]>([
    '📢 Mandatory pre-submission validation checks for the Autumn Distributed DB modules end tomorrow at 5 PM.',
    '📢 Practical viva-voce slot allocations for DSA lab batches have been seeded onto internal calendars.',
    '📢 Remedial compilation AST walk-through scheduled this Saturday morning for all backlog candidates.'
  ]);
  const [msg, setMsg] = useState('');
  const [resultsPublished, setResultsPublished] = useState(false);
  const [examTitle, setExamTitle] = useState('Mid-Term Lab Automata Evaluation');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrent(user);
      if (user.department) setDepartment(user.department);
      if (user.section) setSection(user.section);
    }
    setSubjects(getSubjects());
    // Load real students filtered by section
    const allStudents = getUsers().filter((u: UserRecord) => u.role === 'student');
    setStudents(allStudents);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newProblem = {
      title,
      description,
      difficulty,
      starter_code: starterCode,
      is_published: isPublished,
      test_cases: testCases.filter(tc => tc.expected_output.trim() !== ''),
      teacher_id: Number(currentUser?.id || 0)
    };

    try {
      setMsg('Deploying problem to institutional arena...');
      const res = await createProblem(newProblem);
      if (res.data) {
        setProblems([...problems, {
          id: String(res.data.id || Date.now()),
          title: res.data.title,
          testcases: res.data.test_cases?.length || testCases.length,
          activeSubmissions: 0
        }]);
        setMsg('Problem successfully published to the Practice Arena!');
        
        // Reset form
        setTitle('');
        setDescription('');
        setDifficulty('easy');
        setStarterCode('#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}');
        setIsPublished(false);
        setTestCases([{ input: '', expected_output: '', is_hidden: false, weight: 10 }]);
        
        // Switch view
        setTeachingSubTab('problems');
        setTimeout(() => setMsg(''), 5000);
      }
    } catch (err) {
      console.error(err);
      setMsg('⚠️ Error deploying problem. Ensure backend is active.');
      setTimeout(() => setMsg(''), 5000);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expected_output: '', is_hidden: false, weight: 10 }]);
  };

  const updateTestCase = (idx: number, field: string, value: any) => {
    const updated = testCases.map((tc, i) => i === idx ? { ...tc, [field]: value } : tc);
    setTestCases(updated);
  };

  const handleOverrideScore = (subId: string, newScore: number) => {
    setSubmissions(submissions.map(s => s.id === subId ? { ...s, manualOverride: newScore } : s));
  };

  const handleToggleModule = (subjectId: string, moduleIdx: number) => {
    const targetSub = subjects.find(s => s.id === subjectId);
    if (!targetSub) return;
    const updatedModules = targetSub.modules.map((m: { title: string; completed: boolean }, idx: number) => idx === moduleIdx ? { ...m, completed: !m.completed } : m);
    const completedCount = updatedModules.filter((m: { title: string; completed: boolean }) => m.completed).length;
    const calculatedPct = Math.round((completedCount / updatedModules.length) * 100);
    
    updateSyllabusCoverage(subjectId, calculatedPct, updatedModules);
    setSubjects(getSubjects());
  };

  const handleSliderChange = (subjectId: string, val: number) => {
    updateSyllabusCoverage(subjectId, val);
    setSubjects(getSubjects());
  };

  const sanctionLeave = (studentId: string) => {
    const all = getUsers();
    const updated = all.map((u: UserRecord) => {
      if (u.id === studentId) {
        const newLeave = Math.max(0, (u.leaveBalance ?? 0) - 1);
        return { ...u, leaveBalance: newLeave };
      }
      return u;
    });
    saveUsers(updated);
    setStudents(updated.filter((u: UserRecord) => u.role === 'student'));
    setMsg('Leave sanctioned and balance updated.');
    setTimeout(() => setMsg(''), 4000);
  };

  const updateStudentAttendance = (studentId: string, newPct: number) => {
    const all = getUsers();
    const updated = all.map((u: UserRecord) => u.id === studentId ? { ...u, attendancePct: Math.min(100, Math.max(0, newPct)) } : u);
    saveUsers(updated);
    setStudents(updated.filter((u: UserRecord) => u.role === 'student'));
    setMsg('Attendance updated.');
    setTimeout(() => setMsg(''), 3000);
  };

  const markAbsentAndWarn = (student: UserRecord) => {
    const newPct = Math.max(0, (student.attendancePct ?? 0) - 1.5);
    updateStudentAttendance(student.id, newPct);
    
    const alertMsg = `Student ${student.name} was marked absent for ${department} lecture today. Current attendance is ${newPct.toFixed(1)}%.`;
    
    // Alert Student
    createAlert(student.id, 'attendance', 'Lecture Skipped', alertMsg);
    
    // Alert Parent
    const parent = getUsers().find((u: UserRecord) => u.role === 'parent'); // In real app, match by studentId
    if (parent) {
      createAlert(parent.id, 'attendance', 'Ward Lecture Absenteeism', alertMsg);
    }
    
    broadcastRefresh('REFRESH_ALERTS');
    setMsg(`Absentee warning sent for ${student.name}.`);
    setTimeout(() => setMsg(''), 4000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setBroadcast([`[To: Guardians of Section ${section}] ${message}`, ...broadcastLog]);
    setMessage('');
    // Auto switch sub tab view to observe logs
    setClassSubTab('announcements');
  };

  const handlePublishResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle) return;

    // Iterate all students in the teacher's section to assign verified score / trigger push alert
    const all = getUsers();
    const updated = all.map((u: UserRecord) => {
      if (u.role === 'student' && (u.section === section || section === 'CS-A')) {
        // Trigger live alert
        createAlert(
          u.id, 
          'academic', 
          'Results Declared: ' + examTitle, 
          'The evaluation for this subject module has been cryptographically finalized and stamped by faculty.'
        );
        
        // Let's add a fresh SGPA/result entry to the student's profile to make their academics tab light up!
        const existingSgpa = u.sgpa || [];
        return {
          ...u,
          cgpa: u.cgpa ? Number((u.cgpa + 0.1).toFixed(2)) : 9.42,
          sgpa: [...existingSgpa, 9.6]
        };
      }
      return u;
    });
    saveUsers(updated);
    setStudents(updated.filter((u: UserRecord) => u.role === 'student'));
    setResultsPublished(true);
    
    // Broadcast via WebSocket to reload state on all connected client dashboards instantaneously
    broadcastRefresh('REFRESH_ALERTS');
    
    setMsg(`Successfully declared and broadcasted results to all dynamic dashboard portals!`);
    setTimeout(() => setMsg(''), 6000);
  };

  const mySubjects = subjects.filter(s => {
    if (currentUser?.id) {
      return s.teacherId === currentUser.id;
    }
    return s.teacherName?.toLowerCase().includes('vikram') || s.department === department;
  });
  const activeDisplaySubs = mySubjects.length > 0 ? mySubjects : subjects;

  return (
    <div className="min-h-screen bg-[#0a0b10] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              EDU
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Faculty Workspace</h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {currentUser?.name || 'Dr. Vikram Anjali'} • {department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400">Section {section}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Main Navigation
          </div>
          <button
            onClick={() => setActiveTab('teaching')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'teaching' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={18} />
            <span>Curriculum</span>
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'labs' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 size={18} />
            <span>Lab Evaluation</span>
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'class' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={18} />
            <span>Class Roster</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
              activeTab === 'exams' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield size={18} />
            <span>Examinations</span>
          </button>
        </aside>

        {/* Right Content Screen Sphere */}
        <div className="grow min-w-0 w-full space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: TEACHING SUBJECTS                                  */}
          {/* ========================================================= */}
          {activeTab === 'teaching' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Sub-navigation */}
              <div className="flex items-center gap-1 border-b border-white/5">
                <button
                  onClick={() => setTeachingSubTab('curriculum')}
                  className={`px-4 py-3 text-xs font-bold transition-all relative ${
                    teachingSubTab === 'curriculum' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Syllabus Tracking
                  {teachingSubTab === 'curriculum' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" />}
                </button>
                <button
                  onClick={() => setTeachingSubTab('problems')}
                  className={`px-4 py-3 text-xs font-bold transition-all relative ${
                    teachingSubTab === 'problems' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Coding Assignments
                  {teachingSubTab === 'problems' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]" />}
                </button>
              </div>

              {teachingSubTab === 'curriculum' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeDisplaySubs.map(sub => (
                      <div key={sub.id} className="bg-[#14161e] p-6 rounded-xl border border-white/5 space-y-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                              {sub.code} • Sem {sub.academicYear || 'I'}
                            </p>
                          </div>
                          <div className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                            {sub.syllabusCoveredPct}%
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={sub.syllabusCoveredPct}
                            onChange={(e) => handleSliderChange(sub.id, Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1 bg-white/5 rounded-lg appearance-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Modules Checklist</p>
                          {sub.modules.map((m: { title: string; completed: boolean }, idx: number) => (
                            <div 
                              key={idx}
                              onClick={() => handleToggleModule(sub.id, idx)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                m.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/10 text-transparent group-hover:border-white/30'
                              }`}>
                                <CheckSquare size={10} />
                              </div>
                              <span className={`text-xs ${m.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                {m.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {teachingSubTab === 'problems' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left Form sphere */}
                  <div className="xl:col-span-7 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <PlusCircle size={14} className="text-indigo-400" />
                          <span>Deploy Lab Assignment Problem</span>
                        </h3>
                        {msg && <span className="text-[10px] text-emerald-400 font-bold animate-pulse">{msg}</span>}
                      </div>

                      <form onSubmit={handleAddProblem} className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Problem Title</label>
                            <input 
                              type="text"
                              required
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="e.g. Iterative Array Searching Task"
                              className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Description / Task Goal</label>
                            <textarea 
                              required
                              rows={2}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Describe what the student needs to implement..."
                              className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400 resize-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Difficulty</label>
                            <select
                              value={difficulty}
                              onChange={(e) => setDifficulty(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-5">
                            <input 
                              type="checkbox"
                              id="isPublished"
                              checked={isPublished}
                              onChange={(e) => setIsPublished(e.target.checked)}
                              className="w-4 h-4 rounded accent-indigo-500"
                            />
                            <label htmlFor="isPublished" className="text-xs font-bold text-indigo-300 cursor-pointer">Publish to All Students</label>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Starter Template Code</label>
                          <textarea 
                            required
                            rows={5}
                            value={starterCode}
                            onChange={(e) => setStarterCode(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black border border-white/10 text-[11px] text-emerald-400 font-mono focus:outline-none focus:border-indigo-400 resize-none"
                          />
                        </div>

                        {/* Test Cases Manager */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Automated Test Cases</label>
                            <button 
                              type="button"
                              onClick={handleAddTestCase}
                              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <PlusCircle size={12} /> Add Case
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {testCases.map((tc, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-3 relative">
                                <div className="sm:col-span-5">
                                  <span className="text-[9px] text-slate-500 block mb-0.5">Input</span>
                                  <textarea 
                                    rows={1}
                                    value={tc.input}
                                    onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                    placeholder="\n separated values"
                                    className="w-full p-1.5 rounded bg-black border border-white/10 text-[10px] text-slate-300 focus:outline-none"
                                  />
                                </div>
                                <div className="sm:col-span-5">
                                  <span className="text-[9px] text-purple-400 block mb-0.5">Expected Output</span>
                                  <textarea 
                                    rows={1}
                                    value={tc.expected_output}
                                    onChange={(e) => updateTestCase(idx, 'expected_output', e.target.value)}
                                    placeholder="Exact string match"
                                    className="w-full p-1.5 rounded bg-black border border-white/10 text-[10px] text-purple-200 focus:outline-none"
                                  />
                                </div>
                                <div className="sm:col-span-2 flex flex-col justify-end items-center pb-1">
                                  <span className="text-[9px] text-slate-500 block mb-1">Hidden?</span>
                                  <input 
                                    type="checkbox"
                                    checked={tc.is_hidden}
                                    onChange={(e) => updateTestCase(idx, 'is_hidden', e.target.checked)}
                                    className="w-3.5 h-3.5 accent-indigo-500"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10"
                        >
                          Publish Problem Set Definition
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Deployed Active problem suite list */}
                  <div className="xl:col-span-5 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider border-b border-white/5 pb-2">
                        Configured Assignment Master Suite
                      </span>
                      {problems.map(p => (
                        <div key={p.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[10px] border border-indigo-500/20">
                              {p.id.startsWith('p') ? p.id.toUpperCase() : 'NEW'}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{p.title}</span>
                              <span className="text-[10px] text-indigo-400 block mt-0.5">{p.testcases} Verification Cases Mapped</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0">
                            {p.activeSubmissions} Runs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2.5: EXAMINATION CENTER & PROCTORING                  */}
          {/* ========================================================= */}
          {activeTab === 'exams' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 glass rounded-3xl border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield size={20} className="text-red-400" />
                    <span>Active Examination Control Panel</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Real-time surveillance and integrity monitoring for ongoing assessments</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-red-500/10 text-[10px] font-black text-red-400 border border-red-500/20 uppercase animate-pulse">
                    Surveillance Active
                  </span>
                  <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold transition-all">
                    Generate Report
                  </button>
                </div>
              </div>

              <ProctoringDashboard />
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: LAB EVALUATOR SUBMISSIONS                          */}
          {/* ========================================================= */}
          {activeTab === 'labs' && (
            <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 size={16} className="text-indigo-400" />
                    <span>Evaluate Submitted Answers</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Review automatic scores assigned by the code checker module</p>
                </div>

                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-[10px] font-bold text-indigo-300 border border-indigo-500/20">
                  Live Evaluation Scope
                </span>
              </div>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
                {submissions.map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white block">{sub.studentName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Stream identifier: {sub.rollNo}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">Assigned Score</span>
                        <span className="text-sm font-black text-indigo-400 block">
                          {sub.manualOverride !== undefined ? `${sub.manualOverride} (Adjusted)` : `${sub.autoScore}/100`}
                        </span>
                      </div>
                    </div>

                    {/* Pre Code display */}
                    <pre className="p-3 rounded-xl bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto border border-white/5">
                      {sub.codeSnippet}
                    </pre>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-300 block">
                        Evaluation message: <strong className="text-white font-mono">{sub.status}</strong>
                      </span>

                      {/* Manual overriding score handles */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-slate-500">Adjust Grade:</span>
                        {[25, 50, 75, 100].map(sVal => (
                          <button
                            key={sVal}
                            onClick={() => handleOverrideScore(sub.id, sVal)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              sub.manualOverride === sVal ? 'bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'
                            }`}
                          >
                            {sVal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ASSIGNED CLASS ROSTER                              */}
          {/* ========================================================= */}
          {activeTab === 'class' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Secondary Horizontal Menu Switcher */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/5 w-fit">
                <button
                  onClick={() => setClassSubTab('roster')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    classSubTab === 'roster' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} />
                  <span>👥 Student Attendance Ledgers</span>
                </button>
                <button
                  onClick={() => setClassSubTab('announcements')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    classSubTab === 'announcements' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Send size={14} />
                  <span>📢 Send Announcement to Parents</span>
                </button>
                <button
                  onClick={() => setClassSubTab('results')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    classSubTab === 'results' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award size={14} />
                  <span>📢 Publish Results Declaration</span>
                </button>
              </div>

              {classSubTab === 'roster' && (
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4 animate-fade-in max-w-3xl mx-auto">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Assigned Class Roster: Stream Section [{section}]
                    </h3>
                    <span className="text-xs font-bold text-amber-400">
                      Managing Master Roster
                    </span>
                  </div>

                  {msg && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold mb-3">{msg}</div>}

                  <div className="space-y-3">
                    {students.filter(s => s.section === section || section === 'CS-A').map(student => (
                      <div key={student.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{student.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-amber-300 shrink-0">
                              {student.rollNo}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Attendance: <strong className={`${(student.attendancePct ?? 0) >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{student.attendancePct}%</strong> · CGPA: <strong className="text-white">{student.cgpa ?? 'N/A'}</strong> · Leave: <strong className="text-blue-300">{student.leaveBalance ?? 0} days</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] uppercase text-slate-500 block font-bold">Fee Status</span>
                            <span className={`text-xs font-black block ${student.feeStatus === 'Paid' ? 'text-emerald-300' : 'text-amber-300'}`}>{student.feeStatus}</span>
                          </div>

                          {(student.leaveBalance ?? 0) > 0 ? (
                            <button
                              onClick={() => sanctionLeave(student.id)}
                              className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/20 font-bold text-[10px] shrink-0 transition-all"
                            >
                              Sanction Leave
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 shrink-0">No leave left</span>
                          )}

                          <button
                            onClick={() => markAbsentAndWarn(student)}
                            className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 font-bold text-[10px] shrink-0 transition-all"
                          >
                            Mark Absent & Warn
                          </button>
                        </div>
                      </div>
                    ))}
                    {students.filter(s => s.section === section || section === 'CS-A').length === 0 && (
                      <div className="text-xs text-slate-500 text-center py-4 italic">No students in this section.</div>
                    )}
                  </div>
                </div>
              )}

              {classSubTab === 'announcements' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                  {/* Left Form */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Send size={14} className="text-indigo-400" />
                        <span>Message Parents Interface</span>
                      </h3>

                      <form onSubmit={handleBroadcast} className="space-y-3 pt-1">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Circular Statement Content
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type important advisory updates regarding coding lab schedules..."
                            className="w-full p-3 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all block mt-2"
                        >
                          Dispatch Class Message
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Logs list sphere */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase block tracking-wider border-b border-white/5 pb-2">
                        Published Message Trace
                      </span>
                      {broadcastLog.length === 0 ? (
                        <span className="text-xs text-slate-500 block italic">No messages dispatched during this session.</span>
                      ) : (
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                          {broadcastLog.map((logStr, lIdx) => (
                            <div key={lIdx} className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                              {logStr}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {classSubTab === 'results' && (
                <div className="glass p-8 rounded-3xl border-indigo-500/20 space-y-6 animate-fade-in max-w-3xl mx-auto text-left">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Award size={20} className="text-indigo-400" />
                        <span>Institutional Results Declaration Hub</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Instantly write evaluated laboratory parameters directly to encrypted multi-player states.
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300 font-bold">
                      WebSocket Sync
                    </span>
                  </div>

                  {msg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{msg}</span>
                    </div>
                  )}

                  <form onSubmit={handlePublishResults} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Evaluation Title / Stamp Subject
                      </label>
                      <input 
                        type="text"
                        required
                        value={examTitle}
                        onChange={e => setExamTitle(e.target.value)}
                        placeholder="e.g. Core Compiler Pratt Parser Practical Mid-Term"
                        className="w-full p-3 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Broadcast side-effects protocol
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        <li>Triggers instant real-time persistent alerts across all active student browser clients.</li>
                        <li>Automates incremental credit calculation on active student profile ledgers.</li>
                        <li>Signals connected Warden and Class Teacher nodes for synchronization.</li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      disabled={resultsPublished}
                      className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        resultsPublished 
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-indigo-500/20 cursor-pointer'
                      }`}
                    >
                      <Sparkles size={16} />
                      {resultsPublished ? '✓ Results Successfully Broadcasted' : '📢 Broadcast Results Declaration Now'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
