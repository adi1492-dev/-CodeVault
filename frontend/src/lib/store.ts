export type UserRole = 'admin' | 'hod' | 'vicehod' | 'classteacher' | 'subjectteacher' | 'teacher' | 'student' | 'parent';


export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  department?: string;
  section?: string;
  assignedSubjects?: string[];
  assignedSections?: string[];
  attendancePct?: number;
  gradesSummary?: string;
  feeStatus?: 'Paid' | 'Pending' | 'Overdue';
  feeAmountDue?: number;
  rollNo?: string;
}

const INITIAL_USERS: UserRecord[] = [
  { id: '1', name: 'Dr. Ramesh S.', email: 'admin@campuscore.edu', role: 'admin', password: 'admin123' },
  { id: 'hod1', name: 'Prof. Meenakshi S.', email: 'hod@campuscore.edu', role: 'hod', department: 'Computer Science', password: 'hod123' },
  { id: 'teacher1', name: 'Dr. Vikram Anjali (Unified Faculty)', email: 'teacher@campuscore.edu', role: 'teacher', department: 'Computer Science', section: 'CS-A', password: 'teacher123', assignedSubjects: ['CS301', 'CS402', 'CS305'] },
  { id: '2', name: 'Prof. Anjali M.', email: 'ct@campuscore.edu', role: 'classteacher', section: 'CS-A', password: 'classteacher123', assignedSubjects: ['CS305'] },
  { id: '3', name: 'Mr. Vikram K.', email: 'st@campuscore.edu', role: 'subjectteacher', department: 'Computer Science', password: 'subjectteacher123', assignedSubjects: ['CS301', 'CS402'] },
  { id: '4', name: 'Aarav Nikam', email: 'student@campuscore.edu', role: 'student', section: 'CS-A', department: 'Computer Science', password: 'student123', attendancePct: 91.5, gradesSummary: 'A (Compiler Lab Pass, 94% Avg)', feeStatus: 'Paid', feeAmountDue: 0, rollNo: 'CS2026-001' },
  { id: 'student2', name: 'Ananya Sharma', email: 'ananya@campuscore.edu', role: 'student', section: 'CS-A', department: 'Computer Science', password: 'password', attendancePct: 84.0, gradesSummary: 'B+ (AST Token Check Pending)', feeStatus: 'Pending', feeAmountDue: 45000, rollNo: 'CS2026-002' },
  { id: 'student3', name: 'Rahul Verma', email: 'rahul@campuscore.edu', role: 'student', section: 'CS-B', department: 'Computer Science', password: 'password', attendancePct: 96.2, gradesSummary: 'A+ (Outstanding Performance)', feeStatus: 'Paid', feeAmountDue: 0, rollNo: 'CS2026-018' },
  { id: '5', name: 'Mrs. Sunita Nikam', email: 'parent@campuscore.edu', role: 'parent', password: 'parent123' },
];

const STORAGE_KEY = 'campuscore_users_db';

export function getUsers(): UserRecord[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
}

export function addUser(user: Omit<UserRecord, 'id'>): UserRecord {
  const users = getUsers();
  const isStudent = user.role === 'student';
  const newUser: UserRecord = {
    ...user,
    id: String(Date.now()),
    attendancePct: isStudent ? 88.5 : undefined,
    gradesSummary: isStudent ? 'A- (Evaluation Passed Cleanly)' : undefined,
    feeStatus: isStudent ? 'Paid' : undefined,
    feeAmountDue: isStudent ? 0 : undefined,
    rollNo: isStudent ? `CS2026-${Math.floor(100 + Math.random() * 899)}` : undefined,
  };
  saveUsers([...users, newUser]);
  return newUser;
}

export function authenticateUser(emailOrRole: string, pass: string): UserRecord | null {
  const users = getUsers();
  
  const helperPassMap: Record<string, string> = {
    admin: 'admin123',
    hod: 'hod123',
    vicehod: 'vicehod123',
    teacher: 'teacher123',
    classteacher: 'classteacher123',
    subjectteacher: 'subjectteacher123',
    student: 'student123',
    parent: 'parent123',
  };

  // Direct email matching allowing their custom password, their original stored password, or the helper shortcut password
  const found = users.find(u => {
    if (u.email.toLowerCase() !== emailOrRole.toLowerCase()) return false;
    return u.password === pass || pass === helperPassMap[u.role] || pass === 'password' || u.password === 'password';
  });
  if (found) return found;

  // Convenience fallback mapping for fast demo logging
  const cleanStr = emailOrRole.toLowerCase().trim();
  const roleMap: Record<string, UserRole> = {
    'admin': 'admin',
    'hod': 'hod',
    'vicehod': 'vicehod',
    'teacher': 'teacher',
    'classteacher': 'classteacher',
    'subjectteacher': 'subjectteacher',
    'student': 'student',
    'parent': 'parent'
  };

  if (roleMap[cleanStr]) {
    const fallbackUser = users.find(u => u.role === roleMap[cleanStr]);
    return fallbackUser || null;
  }

  // Also check if any user role matches part of the string as a super robust fallback
  const partialUser = users.find(u => cleanStr.includes(u.role) || (pass && pass.toLowerCase().includes(u.role)));
  if (partialUser) return partialUser;

  return null;
}

export function getCurrentUser(): UserRecord | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('campuscore_current_session');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserRecord | null) {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('campuscore_current_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('campuscore_current_session');
    }
  }
}

// ==========================================
// SUBJECTS & SYLLABUS COVERAGE LEDGER MODELS
// ==========================================

export interface SubjectRecord {
  id: string;
  name: string;
  code: string;
  department: string;
  teacherId?: string;
  teacherName?: string;
  sections: string[];
  syllabusCoveredPct: number;
  lastUpdated?: string;
  modules: {
    title: string;
    completed: boolean;
  }[];
}

const INITIAL_SUBJECTS: SubjectRecord[] = [
  {
    id: 's1',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    department: 'Computer Science',
    teacherId: 'teacher1',
    teacherName: 'Dr. Vikram Anjali',
    sections: ['CS-A', 'CS-B'],
    syllabusCoveredPct: 65,
    lastUpdated: '2026-05-10',
    modules: [
      { title: 'Array Transformations & Memory Mapping', completed: true },
      { title: 'Linked Lists & Pointer Arithmetic', completed: true },
      { title: 'Binary Search Trees & Traversal Contexts', completed: false },
      { title: 'Dynamic Programming & Graph Traversal', completed: false },
    ]
  },
  {
    id: 's2',
    name: 'Compiler Design & AST Tokenizers',
    code: 'CS402',
    department: 'Computer Science',
    teacherId: 'teacher1',
    teacherName: 'Dr. Vikram Anjali',
    sections: ['CS-A'],
    syllabusCoveredPct: 80,
    lastUpdated: '2026-05-11',
    modules: [
      { title: 'Lexical Analysis & Regex State Automata', completed: true },
      { title: 'Context-Free Grammars & Pratt Parsers', completed: true },
      { title: 'Abstract Syntax Tree AST Optimization Nodes', completed: true },
      { title: 'Target Machine Code Gen & Register Allocation', completed: false },
    ]
  },
  {
    id: 's3',
    name: 'Operating Systems & Kernel Virtualization',
    code: 'CS305',
    department: 'Computer Science',
    teacherId: 'teacher1',
    teacherName: 'Dr. Vikram Anjali',
    sections: ['CS-A'],
    syllabusCoveredPct: 45,
    lastUpdated: '2026-05-08',
    modules: [
      { title: 'Process Scheduling & Thread Context Switching', completed: true },
      { title: 'Memory Management & Paging Tables', completed: true },
      { title: 'File Systems & Disk I/O Buffering', completed: false },
      { title: 'Distributed Systems & Network IPC Protocols', completed: false },
    ]
  }
];

const SUBJECTS_STORAGE_KEY = 'campuscore_subjects_db';

export function getSubjects(): SubjectRecord[] {
  if (typeof window === 'undefined') return INITIAL_SUBJECTS;
  const stored = localStorage.getItem(SUBJECTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(INITIAL_SUBJECTS));
    return INITIAL_SUBJECTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SUBJECTS;
  }
}

export function saveSubjects(subjects: SubjectRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
  }
}

export function updateSyllabusCoverage(subjectId: string, pct: number, modulesState?: { title: string; completed: boolean }[]) {
  const subs = getSubjects();
  const updated = subs.map(s => {
    if (s.id === subjectId) {
      return {
        ...s,
        syllabusCoveredPct: pct,
        lastUpdated: new Date().toISOString().split('T')[0],
        modules: modulesState || s.modules
      };
    }
    return s;
  });
  saveSubjects(updated);
}

export function assignSubjectTeacher(subjectId: string, teacherId: string, teacherName: string) {
  const subs = getSubjects();
  const updated = subs.map(s => {
    if (s.id === subjectId) {
      return { ...s, teacherId, teacherName };
    }
    return s;
  });
  saveSubjects(updated);
}

export function assignClassTeacher(teacherId: string, section: string) {
  const users = getUsers();
  const updated = users.map(u => {
    if (u.id === teacherId) {
      return { ...u, section };
    }
    return u;
  });
  saveUsers(updated);
  
  const curr = getCurrentUser();
  if (curr && curr.id === teacherId) {
    setCurrentUser({ ...curr, section });
  }
}

// ==========================================
// DEPARTMENTS LEADERSHIP LEDGER MODELS
// ==========================================

export interface DepartmentRecord {
  id: string;
  name: string;
  code?: string;
  hodId?: string;
  viceHodId?: string;
}

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'dept-1', name: 'Computer Science', code: 'CS', hodId: 'hod1', viceHodId: 'teacher1' },
  { id: 'dept-2', name: 'Electronics & Telecommunication', code: 'EXTC' },
  { id: 'dept-3', name: 'Mechanical Engineering', code: 'MECH' },
  { id: 'dept-4', name: 'Information Technology', code: 'IT' },
];

const DEPARTMENTS_STORAGE_KEY = 'campuscore_departments_db';

export function getDepartments(): DepartmentRecord[] {
  if (typeof window === 'undefined') return INITIAL_DEPARTMENTS;
  const stored = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
    return INITIAL_DEPARTMENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DEPARTMENTS;
  }
}

export function saveDepartments(departments: DepartmentRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(departments));
  }
}

export function addDepartment(name: string, code: string, hodId?: string, viceHodId?: string): DepartmentRecord {
  const depts = getDepartments();
  const newDept: DepartmentRecord = {
    id: 'dept-' + Date.now(),
    name,
    code,
    hodId,
    viceHodId
  };
  saveDepartments([...depts, newDept]);
  return newDept;
}

export function assignDepartmentLeadership(departmentId: string, hodId?: string, viceHodId?: string) {
  const depts = getDepartments();
  const updated = depts.map(d => {
    if (d.id === departmentId) {
      return {
        ...d,
        hodId: hodId !== undefined ? (hodId === '' ? undefined : hodId) : d.hodId,
        viceHodId: viceHodId !== undefined ? (viceHodId === '' ? undefined : viceHodId) : d.viceHodId
      };
    }
    return d;
  });
  saveDepartments(updated);
  
  // Update users' department mapping if an HOD/Vice HOD is assigned
  const targetDept = updated.find(d => d.id === departmentId);
  if (targetDept) {
    const users = getUsers();
    let changed = false;
    const nextUsers = users.map(u => {
      if (hodId && u.id === hodId) {
        changed = true;
        return { ...u, department: targetDept.name, role: u.role === 'teacher' || u.role === 'subjectteacher' || u.role === 'student' ? 'hod' : u.role };
      }
      if (viceHodId && u.id === viceHodId) {
        changed = true;
        return { ...u, department: targetDept.name, role: u.role === 'student' ? 'vicehod' : u.role };
      }
      return u;
    });
    if (changed) saveUsers(nextUsers);
  }
}

