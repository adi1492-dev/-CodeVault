export type UserRole = 'admin' | 'hod' | 'vicehod' | 'classteacher' | 'subjectteacher' | 'teacher' | 'student' | 'parent' | 'studentsection' | 'warden' | 'canteenadmin';


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
  certificates?: { id: string; name: string; txHash: string; date: string; photoUrl?: string; description?: string; issuerName?: string }[];
  canteenTransactions?: { id: string; item: string; amount: number; type: 'debit' | 'credit'; date: string; orderNo?: string; pickupTime?: string }[];
}

export interface AlertRecord {
  id: string;
  targetUserId: string; // The user ID this alert is addressed to
  type: 'attendance' | 'fee' | 'general' | 'academic';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const INITIAL_USERS: UserRecord[] = [
  { id: '1', name: 'Dr. Ramesh S.', email: 'admin@campuscore.edu', role: 'admin', password: 'admin123' },
  { id: 'canteen-admin', name: 'Mr. Santosh P. (Canteen Fulfillment)', email: 'canteenadmin@campuscore.edu', role: 'canteenadmin', password: 'canteen123' },
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
      { id: 'tx_2', item: 'Cold Coffee', amount: 45, type: 'debit', date: '2026-05-12', orderNo: 'CC-1092', pickupTime: '12:30 PM' },
      { id: 'tx_3', item: 'Veg Biryani', amount: 60, type: 'debit', date: '2026-05-13', orderNo: 'CC-4482', pickupTime: '01:15 PM' }
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
    password: 'password', attendancePct: 72.0, gradesSummary: 'B+ (AST Token Check Pending)',
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
      { id: 'tx_5', item: 'Masala Dosa', amount: 50, type: 'debit', date: '2026-05-10', orderNo: 'CC-5512', pickupTime: '09:00 AM' }
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
    feeStatus: 'Paid', feeAmountDue: 0, rollNo: 'CS2026-003',
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
      { id: 'tx_7', item: 'Sandwich', amount: 40, type: 'debit', date: '2026-05-08', orderNo: 'CC-8812', pickupTime: '04:20 PM' }
    ],
    documentStatus: [
      { name: '10th Marksheet', submitted: true }, { name: '12th Marksheet', submitted: true },
      { name: 'Birth Certificate', submitted: true }, { name: 'Caste Certificate', submitted: false },
      { name: 'Migration Certificate', submitted: true }, { name: 'Medical Fitness', submitted: true }
    ]
  },
  // Auto-generate remaining 197 distinct students to hit exactly 200 volume spanning diverse departments
  ...Array.from({ length: 197 }).map((_, idx) => {
    const num = idx + 4;
    
    // Enterprise Multi-Department Mapping Setup
    const departments = [
      'Computer Science', 
      'Information Technology', 
      'Electronics & Telecommunication', 
      'Mechanical Engineering', 
      'Civil Engineering'
    ];
    const deptPrefixes = ['CS', 'IT', 'ENTC', 'MECH', 'CIVIL'];
    const deptIdx = num % departments.length;
    const department = departments[deptIdx];
    const prefix = deptPrefixes[deptIdx];
    
    const roll = `${prefix}2026-${String(num).padStart(3, '0')}`;
    const section = `${prefix}-${num % 3 === 0 ? 'C' : num % 2 === 0 ? 'B' : 'A'}`;
    
    const academicYearsList = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const academicYear = academicYearsList[num % academicYearsList.length];
    const baseSemester = (num % academicYearsList.length) * 2 + (num % 2 === 0 ? 2 : 1);
    
    const firstNames = ['Amit', 'Priya', 'Rohan', 'Sneha', 'Arjun', 'Kavita', 'Siddharth', 'Neha', 'Vikram', 'Pooja', 'Aditya', 'Divya', 'Karan', 'Riya', 'Manish', 'Tanvi', 'Kunal', 'Isha', 'Rajesh', 'Deepa', 'Sanjay', 'Preeti', 'Nikhil', 'Swati'];
    const lastNames = ['Patel', 'Deshmukh', 'Joshi', 'Kulkarni', 'Mehta', 'Choudhary', 'Gupta', 'Nair', 'Rao', 'Singh', 'Yadav', 'Bhat', 'Chatterjee', 'Sen', 'Bhosale', 'Sharma', 'Verma', 'Iyer'];
    const name = `${firstNames[num % firstNames.length]} ${lastNames[num % lastNames.length]}`;
    
    const attendancePct = 68 + (num * 11) % 33; // Guaranteed dispersion of attendance parameters
    const feeStatus = num % 7 === 0 ? 'Overdue' : num % 4 === 0 ? 'Pending' : 'Paid';
    const totalFee = department === 'Computer Science' || department === 'Information Technology' ? 95000 : 85000;
    const feeDue = feeStatus === 'Paid' ? 0 : 25000 + (num * 1400) % 35000;
    const feePaid = totalFee - feeDue;
    
    // Assign Rich Cryptographic Credentials selectively to populate portfolio views
    const hasCert = num % 4 === 0;
    const certTypes = ['Dean Merit Sovereign Award', 'Full-Stack Distributed Systems Credential', 'Advanced AST Analysis Stamp', 'Embedded Hardware Firmware Certificate'];
    const selectedCertType = certTypes[num % certTypes.length];
    
    const certificates = hasCert ? [
      {
        id: `cert_ent_${num}`,
        name: selectedCertType,
        txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        date: '2026-05-12',
        photoUrl: num % 2 === 0 
          ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop' 
          : 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
        description: `Cryptographically sealed and persistent credential issued by the ${department} board under strict zero-knowledge validation.`,
        issuerName: 'CampusCore Institutional Authority'
      }
    ] : [];

    // Pre-populate Canteen POS pre-orders selectively
    const hasCanteenOrder = num % 6 === 0;
    const canteenItems = ['Cold Coffee', 'Veg Burger', 'Masala Dosa', 'Paneer Tikka Roll', 'Special Thali'];
    const canteenTransactions = hasCanteenOrder ? [
      {
        id: `tx_gen_${num}`,
        item: canteenItems[num % canteenItems.length],
        amount: 45 + (num * 15) % 120,
        type: 'debit' as const,
        date: '2026-05-14',
        orderNo: `CC-${1000 + num}`,
        pickupTime: '01:30 PM'
      }
    ] : [];

    return {
      id: `std_${num}`,
      name,
      email: `${firstNames[num % firstNames.length].toLowerCase()}.${num}@campuscore.edu`,
      role: 'student' as const,
      password: 'password',
      section,
      department,
      academicYear,
      semesterNo: baseSemester,
      attendancePct,
      gradesSummary: attendancePct > 85 ? 'A (Excellent trajectory across assigned modules)' : 'B+ (Satisfactory execution)',
      feeStatus: feeStatus as any,
      feeAmountDue: feeDue,
      rollNo: roll,
      phone: `9822${String(num).padStart(6, '1')}`,
      dob: `2005-0${1 + (num % 9)}-1${num % 8}`,
      parentName: `Mr. Guardian of ${firstNames[num % firstNames.length]}`,
      parentPhone: `9123${String(num).padStart(6, '2')}`,
      bloodGroup: num % 2 === 0 ? 'B+' : 'O+',
      category: num % 4 === 0 ? 'OBC' : 'General',
      admissionDate: '2023-07-15',
      scholarshipStatus: num % 5 === 0 ? 'Merit' as const : num % 6 === 0 ? 'Need-Based' as const : 'None' as const,
      hostelStatus: num % 3 === 0 ? 'Hostel' as const : 'Day Scholar' as const,
      nationality: 'Indian',
      address: `Block ${prefix}-${num % 5}, University Campus Quarters, Pune`,
      feePaid,
      feeDue,
      totalFee,
      sgpa: [7.5 + (num % 3) * 0.4, 8.1 + (num % 2) * 0.5],
      cgpa: +(7.8 + (num % 4) * 0.4).toFixed(2),
      backlogCount: num % 9 === 0 ? 1 : 0,
      leaveBalance: 3 + (num % 6),
      canteenWalletBalance: 100 + (num * 35) % 900,
      githubScore: 150 + (num * 45) % 850,
      completedLabs: 5 + (num % 15),
      certificates,
      canteenTransactions,
      documentStatus: [
        { name: '10th Marksheet', submitted: true }, { name: '12th Marksheet', submitted: true },
        { name: 'Birth Certificate', submitted: true }, { name: 'Caste Certificate', submitted: num % 3 !== 0 },
        { name: 'Migration Certificate', submitted: true }, { name: 'Medical Fitness', submitted: true }
      ]
    };
  }),
  { id: '5', name: 'Mrs. Sunita Nikam', email: 'parent@campuscore.edu', role: 'parent', password: 'parent123' },
  { id: 'p_ananya', name: 'Mrs. Priya Sharma', email: 'priya.sharma@campuscore.edu', role: 'parent', password: 'parent123' },
  { id: 'p_rahul', name: 'Mr. Anil Verma', email: 'anil.verma@campuscore.edu', role: 'parent', password: 'parent123' },
];

const STORAGE_KEY = 'campuscore_users_db';
const ALERTS_STORAGE_KEY = 'campuscore_alerts_db';
const SESSION_STORAGE_KEY = 'campuscore_current_session';

// Global In-Memory Fallback for Demo Persistence on IP Addresses
const memoryStore: Record<string, string> = {};

export function getUsers(): UserRecord[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  
  // Try memory first
  if (memoryStore[STORAGE_KEY]) {
    try {
      return JSON.parse(memoryStore[STORAGE_KEY]);
    } catch { /* fall through */ }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(stored);
    
    // Safety check: Ensure parsed is an array
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }

    // Enforce hot-patch reset if browser payload has fewer than 190 students stored
    if (parsed.filter((u: UserRecord) => u.role === 'student').length < 190) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }

    // Seamlessly hot-patch stale browser localStorage cache with new runtime accounts if absent
    let updatedParsed = [...parsed];
    let needsResave = false;

    const reqRoles: UserRole[] = ['canteenadmin', 'studentsection', 'warden'];
    for (const r of reqRoles) {
      if (!updatedParsed.some(u => u.role === r)) {
        const targetAcc = INITIAL_USERS.find(u => u.role === r);
        if (targetAcc) {
          updatedParsed.push(targetAcc);
          needsResave = true;
        }
      }
    }

    if (needsResave) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedParsed));
      return updatedParsed;
    }

    return updatedParsed;
  } catch (err) {
    console.error('Store access error:', err);
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserRecord[]) {
  const data = JSON.stringify(users);
  memoryStore[STORAGE_KEY] = data; // Always update memory
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      console.warn('LocalStorage blocked, using memory fallback');
    }
  }
}

const INITIAL_ALERTS: AlertRecord[] = [
  { id: 'al_1', targetUserId: '4', type: 'academic', title: '🎓 Dean of Academics Commendation', message: 'Outstanding cumulative performance recorded for the Spring Evaluation. Sovereign academic badging has been pinned to your core profile.', timestamp: '2026-05-10T09:30:00Z', read: false },
  { id: 'al_2', targetUserId: '4', type: 'general', title: '🍔 Canteen Wallet Promotional Offer', message: 'Recharge your student wallet with ₹1,000 or more this week to receive instant VIP fulfillment lane prioritization.', timestamp: '2026-05-02T14:15:00Z', read: true },
  { id: 'al_3', targetUserId: '4', type: 'attendance', title: '📅 Biometric Attendance Verification Complete', message: 'Your practical lab attestation percentage sits comfortably at 91.5%. You are fully cleared for final capstone submittals.', timestamp: '2026-04-20T11:00:00Z', read: true },
  { id: 'al_4', targetUserId: '4', type: 'fee', title: '💳 Semester Tuition Ledger Stamped', message: 'Acknowledgment receipt generated for primary tuition deposit (₹85,000). Current outstanding fee liability stands at absolute zero.', timestamp: '2026-01-15T10:05:00Z', read: true },
  { id: 'al_5', targetUserId: '4', type: 'academic', title: '⚡ Practice Arena Capstone Unlocked', message: 'New algorithmic modules targeting multi-pointer optimization have been pushed directly to your IDE workspace.', timestamp: '2025-11-12T16:20:00Z', read: true },
  { id: 'al_6', targetUserId: '4', type: 'general', title: '🛡️ Annual Hostel Anti-Ragging Affirmation', message: 'Zero-Knowledge cryptographic signatures recorded successfully on the institutional peer validation ledger.', timestamp: '2025-08-25T08:45:00Z', read: true }
];

export function getAlerts(userId?: string): AlertRecord[] {
  if (typeof window === 'undefined') return INITIAL_ALERTS;
  const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
    return userId ? INITIAL_ALERTS.filter(a => a.targetUserId === userId) : INITIAL_ALERTS;
  }
  try {
    const alerts: AlertRecord[] = JSON.parse(stored);
    // Auto reset if empty cache
    if (!alerts || alerts.length === 0) {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
      return userId ? INITIAL_ALERTS.filter(a => a.targetUserId === userId) : INITIAL_ALERTS;
    }
    if (userId) {
      return alerts.filter(a => a.targetUserId === userId);
    }
    return alerts;
  } catch {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
    return userId ? INITIAL_ALERTS.filter(a => a.targetUserId === userId) : INITIAL_ALERTS;
  }
}

export function saveAlerts(alerts: AlertRecord[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  }
}

export function createAlert(targetUserId: string, type: AlertRecord['type'], title: string, message: string) {
  const alerts = getAlerts();
  const newAlert: AlertRecord = {
    id: String(Date.now() + Math.floor(Math.random() * 1000)),
    targetUserId,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

export function markAlertRead(alertId: string) {
  const alerts = getAlerts();
  const updated = alerts.map(a => a.id === alertId ? { ...a, read: true } : a);
  saveAlerts(updated);
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
  
  // First check exact email match
  const exactUser = users.find(u => u.email.toLowerCase() === emailOrRole.toLowerCase().trim());
  if (exactUser) return exactUser;

  const helperPassMap: Record<string, string> = {
    admin: 'admin123',
    canteenadmin: 'canteen123',
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
    'canteenadmin': 'canteenadmin',
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

  // Sort users by role length descending to prevent substring shadowing (e.g. 'canteenadmin' containing 'admin')
  const sortedUsers = [...users].sort((a, b) => b.role.length - a.role.length);
  const partialUser = sortedUsers.find(u => cleanStr.includes(u.role) || (pass && pass.toLowerCase().includes(u.role)));
  if (partialUser) return partialUser;

  return null;
}

export function getCurrentUser(): UserRecord | null {
  if (typeof window === 'undefined') return JSON.parse(memoryStore[SESSION_STORAGE_KEY] || 'null');
  
  // Try memory first for speed and fallback
  if (memoryStore[SESSION_STORAGE_KEY]) {
    return JSON.parse(memoryStore[SESSION_STORAGE_KEY]);
  }

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserRecord | null) {
  const data = user ? JSON.stringify(user) : null;
  if (data) memoryStore[SESSION_STORAGE_KEY] = data;
  else delete memoryStore[SESSION_STORAGE_KEY];

  if (typeof window !== 'undefined') {
    try {
      if (user && data) {
        localStorage.setItem(SESSION_STORAGE_KEY, data);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Session storage error:', err);
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
  // Computer Science Stream
  {
    id: 's1', name: 'Data Structures & Algorithms', code: 'CS301', department: 'Computer Science',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['CS-A', 'CS-B'], syllabusCoveredPct: 65,
    lastUpdated: '2026-05-10', academicYear: '1st Year',
    modules: [
      { title: 'Array Transformations & Memory Mapping', completed: true },
      { title: 'Linked Lists & Pointer Arithmetic', completed: true },
      { title: 'Binary Search Trees & Traversal Contexts', completed: false },
      { title: 'Dynamic Programming & Graph Traversal', completed: false },
    ]
  },
  {
    id: 's2', name: 'Compiler Design & AST Tokenizers', code: 'CS402', department: 'Computer Science',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['CS-A'], syllabusCoveredPct: 80,
    lastUpdated: '2026-05-11', academicYear: '1st Year',
    modules: [
      { title: 'Lexical Analysis & Regex State Automata', completed: true },
      { title: 'Context-Free Grammars & Pratt Parsers', completed: true },
      { title: 'Abstract Syntax Tree AST Optimization Nodes', completed: true },
      { title: 'Target Machine Code Gen & Register Allocation', completed: false },
    ]
  },
  {
    id: 's3', name: 'Operating Systems & Kernel Virtualization', code: 'CS305', department: 'Computer Science',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['CS-A'], syllabusCoveredPct: 100,
    lastUpdated: '2026-05-08', academicYear: '2nd Year',
    modules: [
      { title: 'Process Scheduling & Thread Context Switching', completed: true },
      { title: 'Memory Management & Paging Tables', completed: true },
      { title: 'File Systems & Disk I/O Buffering', completed: true },
      { title: 'Distributed Systems & Network IPC Protocols', completed: true },
    ]
  },
  // Information Technology Stream
  {
    id: 's4', name: 'Cloud Infrastructure & Microservices', code: 'IT401', department: 'Information Technology',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['IT-A'], syllabusCoveredPct: 90,
    lastUpdated: '2026-05-12', academicYear: '3rd Year',
    modules: [
      { title: 'Docker Container Orchestration & Namespaces', completed: true },
      { title: 'Kubernetes Pod Scaling & Service Meshes', completed: true },
      { title: 'Serverless Functions & AWS Lambda Integration', completed: true },
      { title: 'Zero-Trust Cloud IAM Security Policies', completed: false },
    ]
  },
  // Electronics & Telecommunication Stream
  {
    id: 's5', name: 'Embedded Systems & Firmware Engineering', code: 'ENTC302', department: 'Electronics & Telecommunication',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['ENTC-A'], syllabusCoveredPct: 50,
    lastUpdated: '2026-05-05', academicYear: '2nd Year',
    modules: [
      { title: 'ARM Cortex-M Architecture & Bus Matrix', completed: true },
      { title: 'Interrupt Service Routines & RTOS Semaphores', completed: true },
      { title: 'SPI, I2C, and UART Peripheral Interfacing', completed: false },
      { title: 'Low-Power Sleep Modes & Watchdog Timers', completed: false },
    ]
  },
  // Mechanical Engineering Stream
  {
    id: 's6', name: 'Computational Fluid Dynamics CFD', code: 'MECH405', department: 'Mechanical Engineering',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['MECH-A'], syllabusCoveredPct: 75,
    lastUpdated: '2026-05-09', academicYear: '3rd Year',
    modules: [
      { title: 'Navier-Stokes Governing Partial Differentials', completed: true },
      { title: 'Finite Volume Meshing & Boundary Discretization', completed: true },
      { title: 'Turbulence Modeling k-epsilon Simulation', completed: true },
      { title: 'Supersonic Shockwave Airfoil Aerodynamics', completed: false },
    ]
  },
  // Civil Engineering Stream
  {
    id: 's7', name: 'Structural Analysis & Finite Element Method', code: 'CIVIL301', department: 'Civil Engineering',
    teacherId: 'teacher1', teacherName: 'Dr. Vikram Anjali', sections: ['CIVIL-A'], syllabusCoveredPct: 100,
    lastUpdated: '2026-04-28', academicYear: '2nd Year',
    modules: [
      { title: 'Matrix Stiffness Formulations for Truss Beams', completed: true },
      { title: 'Plates and Shells Bending Stress Tensors', completed: true },
      { title: 'Earthquake Response Spectrum Seismic Loading', completed: true },
      { title: 'Bridge Pier Pre-stressed Foundation Design', completed: true },
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
    const parsed: SubjectRecord[] = JSON.parse(stored);
    if (!parsed || parsed.length < 7) {
      localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    }
    return parsed;
  } catch {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(INITIAL_SUBJECTS));
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
  { id: 'dept-2', name: 'Electronics & Telecommunication', code: 'ENTC', hodId: 'hod1', academicYear: '2nd Year' },
  { id: 'dept-3', name: 'Mechanical Engineering', code: 'MECH', hodId: 'hod1', academicYear: '3rd Year' },
  { id: 'dept-4', name: 'Information Technology', code: 'IT', hodId: 'hod1', academicYear: '4th Year' },
  { id: 'dept-5', name: 'Civil Engineering', code: 'CIVIL', hodId: 'hod1', academicYear: '2nd Year' }
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
    const parsed: DepartmentRecord[] = JSON.parse(stored);
    if (!parsed || parsed.length < 5) {
      localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
      return INITIAL_DEPARTMENTS;
    }
    return parsed;
  } catch {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
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

const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'inc_1',
    encryptedMessage: '0x3f8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
    decryptedMessage: 'Library reading room Wi-Fi routers frequently drop packets during late evening evaluation sessions. Requesting immediate bandwidth scaling.',
    timestamp: '2026-05-08T21:14:00Z',
    status: 'Decrypted'
  },
  {
    id: 'inc_2',
    encryptedMessage: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    decryptedMessage: 'Block B hostel corridor lighting triggers intermittent electrical flickering post-midnight. Maintenace ticket raised previously.',
    timestamp: '2026-04-12T03:45:00Z',
    status: 'Resolved'
  },
  {
    id: 'inc_3',
    encryptedMessage: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    decryptedMessage: 'Canteen token validation queues exceed 15 minutes during peak recess periods. Suggesting integrated RFID auto-debit turnstiles.',
    timestamp: '2026-02-18T13:20:00Z',
    status: 'Decrypted'
  },
  {
    id: 'inc_4',
    encryptedMessage: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    decryptedMessage: 'Anonymous peer recommendation: Extend sandbox micro-compiler server timeout caps to support deep nested recursive tree validation algorithms.',
    timestamp: '2025-10-05T16:10:00Z',
    status: 'Resolved'
  }
];

const STORAGE_KEY_GRIEVANCES = 'campuscore_grievances';

export function getGrievances(): GrievanceRecord[] {
  if (typeof window === 'undefined') return INITIAL_GRIEVANCES;
  const stored = localStorage.getItem(STORAGE_KEY_GRIEVANCES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(INITIAL_GRIEVANCES));
    return INITIAL_GRIEVANCES;
  }
  try {
    const parsed: GrievanceRecord[] = JSON.parse(stored);
    if (!parsed || parsed.length < 4) {
      localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(INITIAL_GRIEVANCES));
      return INITIAL_GRIEVANCES;
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(INITIAL_GRIEVANCES));
    return INITIAL_GRIEVANCES;
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

export function placeCanteenOrder(studentId: string, item: string, amount: number): { success: boolean; orderNo?: string; pickupTime?: string } {
  const users = getUsers();
  let result: { success: boolean; orderNo?: string; pickupTime?: string } = { success: false };
  const updated = users.map(u => {
    if (u.id === studentId) {
      const bal = u.canteenWalletBalance || 0;
      if (bal >= amount) {
        const orderNo = 'CC-' + Math.floor(1000 + Math.random() * 9000);
        // Simulate pickup time 20 minutes from now
        const pt = new Date(Date.now() + 20 * 60000);
        const pickupTime = pt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        result = { success: true, orderNo, pickupTime };
        
        const tx = [...(u.canteenTransactions || []), {
          id: `tx_${Date.now()}`,
          item,
          amount,
          type: 'debit' as const,
          date: new Date().toISOString().split('T')[0],
          orderNo,
          pickupTime
        }];
        return { ...u, canteenWalletBalance: bal - amount, canteenTransactions: tx };
      }
    }
    return u;
  });
  if (result.success) saveUsers(updated);
  return result;
}

export function mintCertificate(
  studentIds: string | string[],
  certName: string,
  txHash: string,
  photoUrl?: string,
  description?: string,
  issuerName?: string
) {
  const users = getUsers();
  const targetIds = Array.isArray(studentIds) ? studentIds : [studentIds];
  
  const updated = users.map(u => {
    if (targetIds.includes(u.id)) {
      const certs = [...(u.certificates || []), {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: certName,
        txHash,
        date: new Date().toISOString().split('T')[0],
        photoUrl,
        description,
        issuerName
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

