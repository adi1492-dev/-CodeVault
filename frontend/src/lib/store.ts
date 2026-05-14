export type UserRole = 'admin' | 'hod' | 'vicehod' | 'classteacher' | 'subjectteacher' | 'teacher' | 'student' | 'parent' | 'studentsection' | 'warden';


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
  academicYear?: string;
  academicYears?: string[];
  // ERP Extended Fields
  phone?: string;
  dob?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  bloodGroup?: string;
  category?: string;
  admissionDate?: string;
  scholarshipStatus?: 'None' | 'Merit' | 'Need-Based' | 'Govt';
  hostelStatus?: 'Day Scholar' | 'Hostel';
  nationality?: string;
  feePaid?: number;
  feeDue?: number;
  totalFee?: number;
  sgpa?: number[];
  cgpa?: number;
  backlogCount?: number;
  documentStatus?: { name: string; submitted: boolean }[];
  leaveBalance?: number;
  semesterNo?: number;
  canteenWalletBalance?: number;
  githubScore?: number;
  completedLabs?: number;
  certificates?: { id: string; name: string; txHash: string; date: string }[];
  canteenTransactions?: { id: string; item: string; amount: number; type: 'debit' | 'credit'; date: string }[];
}

const INITIAL_USERS: UserRecord[] = [
  { id: '1', name: 'Dr. Ramesh S.', email: 'admin@campuscore.edu', role: 'admin', password: 'admin123' },
  { id: 'sec-admin', name: 'Mr. Satish K. (Students Section)', email: 'section@campuscore.edu', role: 'studentsection', password: 'section123' },
  { id: 'warden-1', name: 'Capt. R. K. Dogra (Hostel Warden)', email: 'warden@campuscore.edu', role: 'warden', password: 'warden123' },
  { id: 'hod1', name: 'Prof. Meenakshi S.', email: 'hod@campuscore.edu', role: 'hod', department: 'Computer Science', academicYear: '1st Year', password: 'hod123' },
  { id: 'teacher1', name: 'Dr. Vikram Anjali (Unified Faculty)', email: 'teacher@campuscore.edu', role: 'teacher', department: 'Computer Science', section: 'CS-A', academicYear: '1st Year', academicYears: ['1st Year', '2nd Year'], password: 'teacher123', assignedSubjects: ['CS301', 'CS402', 'CS305'] },
  { id: '2', name: 'Prof. Anjali M.', email: 'ct@campuscore.edu', role: 'classteacher', section: 'CS-A', academicYear: '1st Year', password: 'classteacher123', assignedSubjects: ['CS305'] },
  { id: '3', name: 'Mr. Vikram K.', email: 'st@campuscore.edu', role: 'subjectteacher', department: 'Computer Science', academicYear: '2nd Year', password: 'subjectteacher123', assignedSubjects: ['CS301', 'CS402'] },
  {
    id: '4', name: 'Aarav Nikam', email: 'student@campuscore.edu', role: 'student',
    section: 'CS-A', department: 'Computer Science', academicYear: '1st Year', semesterNo: 2,
    password: 'student123', attendancePct: 91.5, gradesSummary: 'A (Compiler Lab Pass, 94% Avg)',
    feeStatus: 'Paid', feeAmountDue: 0, rollNo: 'CS2026-001',
    phone: '9876543210', dob: '2006-03-15', parentName: 'Mr. Suresh Nikam', parentPhone: '9123456780',
    bloodGroup: 'B+', category: 'General', admissionDate: '2024-07-15', scholarshipStatus: 'Merit',
    hostelStatus: 'Day Scholar', nationality: 'Indian', address: '12, Shivaji Nagar, Pune - 411005',
    feePaid: 85000, feeDue: 0, totalFee: 85000,
    sgpa: [8.6, 9.1], cgpa: 8.85, backlogCount: 0, leaveBalance: 8,
    canteenWalletBalance: 1200,
    githubScore: 450,
    completedLabs: 14,
    certificates: [
      { id: 'cert_1', name: 'AST Syntax Mastery', txHash: '0x1a2b...3c4d', date: '2026-05-10' }
    ],
    canteenTransactions: [
      { id: 'tx_1', item: 'Wallet Recharge', amount: 1500, type: 'credit', date: '2026-05-01' },
      { id: 'tx_2', item: 'Cold Coffee', amount: 45, type: 'debit', date: '2026-05-12' },
      { id: 'tx_3', item: 'Veg Biryani', amount: 60, type: 'debit', date: '2026-05-13' }
    ],
    documentStatus: [
      { name: '10th Marksheet', submitted: true }, { name: '12th Marksheet', submitted: true },
      { name: 'Birth Certificate', submitted: true }, { name: 'Caste Certificate', submitted: false },
      { name: 'Migration Certificate', submitted: true }, { name: 'Medical Fitness', submitted: true }
    ]
  },
  {
    id: 'student2', name: 'Ananya Sharma', email: 'ananya@campuscore.edu', role: 'student',
    section: 'CS-A', department: 'Computer Science', academicYear: '1st Year', semesterNo: 2,
    password: 'password', attendancePct: 84.0, gradesSummary: 'B+ (AST Token Check Pending)',
    feeStatus: 'Pending', feeAmountDue: 45000, rollNo: 'CS2026-002',
    phone: '9988776655', dob: '2006-07-22', parentName: 'Mrs. Priya Sharma', parentPhone: '9012345678',
    bloodGroup: 'A+', category: 'OBC', admissionDate: '2024-07-15', scholarshipStatus: 'Need-Based',
    hostelStatus: 'Hostel', nationality: 'Indian', address: '45, Gandhi Road, Nashik - 422001',
    feePaid: 40000, feeDue: 45000, totalFee: 85000,
    sgpa: [7.4, 7.8], cgpa: 7.6, backlogCount: 1, leaveBalance: 3,
    canteenWalletBalance: 150,
    githubScore: 120,
    completedLabs: 4,
    certificates: [],
    canteenTransactions: [
      { id: 'tx_4', item: 'Wallet Recharge', amount: 500, type: 'credit', date: '2026-05-05' },
      { id: 'tx_5', item: 'Masala Dosa', amount: 50, type: 'debit', date: '2026-05-10' }
    ],
    documentStatus: [
      { name: '10th Marksheet', submitted: true }, { name: '12th Marksheet', submitted: true },
      { name: 'Birth Certificate', submitted: false }, { name: 'Caste Certificate', submitted: true },
      { name: 'Migration Certificate', submitted: false }, { name: 'Medical Fitness', submitted: true }
    ]
  },
  {
    id: 'student3', name: 'Rahul Verma', email: 'rahul@campuscore.edu', role: 'student',
    section: 'CS-B', department: 'Computer Science', academicYear: '2nd Year', semesterNo: 4,
    password: 'password', attendancePct: 96.2, gradesSummary: 'A+ (Outstanding Performance)',
    feeStatus: 'Paid', feeAmountDue: 0, rollNo: 'CS2026-018',
    phone: '9765432100', dob: '2005-11-10', parentName: 'Mr. Anil Verma', parentPhone: '9234567890',
    bloodGroup: 'O+', category: 'General', admissionDate: '2023-07-12', scholarshipStatus: 'Govt',
    hostelStatus: 'Hostel', nationality: 'Indian', address: '8, MG Road, Nagpur - 440010',
    feePaid: 170000, feeDue: 0, totalFee: 170000,
    sgpa: [9.2, 9.5, 9.8, 9.6], cgpa: 9.53, backlogCount: 0, leaveBalance: 12,
    canteenWalletBalance: 850,
    githubScore: 980,
    completedLabs: 25,
    certificates: [
      { id: 'cert_2', name: 'Advanced Pointer Operations', txHash: '0x9f8e...7d6c', date: '2026-04-15' },
      { id: 'cert_3', name: 'Memory Safe Rust Lab', txHash: '0x5b4a...3d2c', date: '2026-05-01' }
    ],
    canteenTransactions: [
      { id: 'tx_6', item: 'Wallet Recharge', amount: 1000, type: 'credit', date: '2026-05-01' },
      { id: 'tx_7', item: 'Sandwich', amount: 40, type: 'debit', date: '2026-05-08' }
    ],
    documentStatus: [
      { name: '10th Marksheet', submitted: true }, { name: '12th Marksheet', submitted: true },
      { name: 'Birth Certificate', submitted: true }, { name: 'Caste Certificate', submitted: false },
      { name: 'Migration Certificate', submitted: true }, { name: 'Medical Fitness', submitted: true }
    ]
  },
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
    studentsection: 'section123',
    warden: 'warden123',
  };

  const cleanStr = emailOrRole.toLowerCase().trim();
  const roleMap: Record<string, UserRole> = {
    'admin': 'admin',
    'hod': 'hod',
    'vicehod': 'vicehod',
    'teacher': 'teacher',
    'classteacher': 'classteacher',
    'subjectteacher': 'subjectteacher',
    'student': 'student',
    'parent': 'parent',
    'studentsection': 'studentsection',
    'warden': 'warden'
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
  academicYear?: string;
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
    academicYear: '1st Year',
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
    academicYear: '1st Year',
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
    academicYear: '2nd Year',
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
  academicYear?: string;
}

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'dept-1', name: 'Computer Science', code: 'CS', hodId: 'hod1', viceHodId: 'teacher1', academicYear: '1st Year' },
  { id: 'dept-2', name: 'Electronics & Telecommunication', code: 'EXTC', academicYear: '2nd Year' },
  { id: 'dept-3', name: 'Mechanical Engineering', code: 'MECH', academicYear: '3rd Year' },
  { id: 'dept-4', name: 'Information Technology', code: 'IT', academicYear: '4th Year' },
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

export function addDepartment(name: string, code: string, hodId?: string, viceHodId?: string, academicYear?: string): DepartmentRecord {
  const depts = getDepartments();
  const newDept: DepartmentRecord = {
    id: 'dept-' + Date.now(),
    name,
    code,
    hodId,
    viceHodId,
    academicYear: academicYear || '1st Year'
  };
  saveDepartments([...depts, newDept]);
  return newDept;
}

// ==========================================
// ANTI-RAGGING ANONYMOUS GRIEVANCES
// ==========================================

export interface GrievanceRecord {
  id: string;
  encryptedMessage: string;
  decryptedMessage?: string;
  mockPhotoUrl?: string; // Optional photo
  timestamp: string;
  status: 'Encrypted' | 'Decrypted' | 'Resolved';
}

const STORAGE_KEY_GRIEVANCES = 'campuscore_grievances';

export function getGrievances(): GrievanceRecord[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_GRIEVANCES);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveGrievances(grievances: GrievanceRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(grievances));
  }
}

export function submitAnonymousGrievance(message: string, photoUrl?: string) {
  const grievances = getGrievances();
  const encryptedHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
  
  grievances.push({
    id: `sec_inc_${Date.now()}`,
    encryptedMessage: encryptedHash,
    decryptedMessage: message,
    mockPhotoUrl: photoUrl,
    timestamp: new Date().toISOString(),
    status: 'Encrypted'
  });
  
  saveGrievances(grievances);
}

export function decryptGrievance(id: string) {
  const grievances = getGrievances();
  const updated = grievances.map(g => {
    if (g.id === id) {
      return { ...g, status: 'Decrypted' as const };
    }
    return g;
  });
  saveGrievances(updated);
}

// ==========================================
// ERP State Mutators (Hackathon Mock Logic)
// ==========================================

export function rechargeCanteenWallet(studentId: string, amount: number) {
  const users = getUsers();
  const updated = users.map(u => {
    if (u.id === studentId) {
      const bal = (u.canteenWalletBalance || 0) + amount;
      const tx = [...(u.canteenTransactions || []), {
        id: `tx_${Date.now()}`,
        item: 'Wallet Recharge',
        amount,
        type: 'credit' as const,
        date: new Date().toISOString().split('T')[0]
      }];
      return { ...u, canteenWalletBalance: bal, canteenTransactions: tx };
    }
    return u;
  });
  saveUsers(updated);
}

export function placeCanteenOrder(studentId: string, item: string, amount: number): boolean {
  const users = getUsers();
  let success = false;
  const updated = users.map(u => {
    if (u.id === studentId) {
      const bal = u.canteenWalletBalance || 0;
      if (bal >= amount) {
        success = true;
        const tx = [...(u.canteenTransactions || []), {
          id: `tx_${Date.now()}`,
          item,
          amount,
          type: 'debit' as const,
          date: new Date().toISOString().split('T')[0]
        }];
        return { ...u, canteenWalletBalance: bal - amount, canteenTransactions: tx };
      }
    }
    return u;
  });
  if (success) saveUsers(updated);
  return success;
}

export function mintCertificate(studentId: string, certName: string, txHash: string) {
  const users = getUsers();
  const updated = users.map(u => {
    if (u.id === studentId) {
      const certs = [...(u.certificates || []), {
        id: `cert_${Date.now()}`,
        name: certName,
        txHash,
        date: new Date().toISOString().split('T')[0]
      }];
      return { ...u, certificates: certs };
    }
    return u;
  });
  saveUsers(updated);
}

export function assignDepartmentLeadership(departmentId: string, hodId?: string, viceHodId?: string, academicYear?: string) {
  const depts = getDepartments();
  let assignedYear = academicYear;
  
  const updated = depts.map(d => {
    if (d.id === departmentId) {
      if (!assignedYear) assignedYear = d.academicYear || '1st Year';
      return {
        ...d,
        hodId: hodId !== undefined ? (hodId === '' ? undefined : hodId) : d.hodId,
        viceHodId: viceHodId !== undefined ? (viceHodId === '' ? undefined : viceHodId) : d.viceHodId,
        academicYear: assignedYear
      };
    }
    return d;
  });
  saveDepartments(updated);
  
  // Update users' department and academicYear mapping if an HOD/Vice HOD is assigned
  const targetDept = updated.find(d => d.id === departmentId);
  if (targetDept) {
    const users = getUsers();
    let changed = false;
    const nextUsers = users.map(u => {
      if (hodId && u.id === hodId) {
        changed = true;
        return { 
          ...u, 
          department: targetDept.name, 
          academicYear: targetDept.academicYear || assignedYear || '1st Year',
          role: u.role === 'teacher' || u.role === 'subjectteacher' || u.role === 'student' ? 'hod' : u.role 
        };
      }
      if (viceHodId && u.id === viceHodId) {
        changed = true;
        return { 
          ...u, 
          department: targetDept.name, 
          academicYear: targetDept.academicYear || assignedYear || '1st Year',
          role: u.role === 'student' ? 'vicehod' : u.role 
        };
      }
      return u;
    });
    if (changed) saveUsers(nextUsers);
  }
}

