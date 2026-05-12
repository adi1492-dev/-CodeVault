export type UserRole = 'admin' | 'classteacher' | 'subjectteacher' | 'student' | 'parent';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  department?: string;
  section?: string;
}

const INITIAL_USERS: UserRecord[] = [
  { id: '1', name: 'Dr. Ramesh S.', email: 'admin@campuscore.edu', role: 'admin', password: 'admin123' },
  { id: '2', name: 'Prof. Anjali M.', email: 'ct@campuscore.edu', role: 'classteacher', section: 'CS-A', password: 'classteacher123' },
  { id: '3', name: 'Mr. Vikram K.', email: 'st@campuscore.edu', role: 'subjectteacher', department: 'Computer Science', password: 'subjectteacher123' },
  { id: '4', name: 'Aarav Nikam', email: 'student@campuscore.edu', role: 'student', section: 'CS-A', password: 'student123' },
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
  const newUser: UserRecord = {
    ...user,
    id: String(Date.now()),
  };
  saveUsers([...users, newUser]);
  return newUser;
}

export function authenticateUser(emailOrRole: string, pass: string): UserRecord | null {
  const users = getUsers();
  
  const helperPassMap: Record<string, string> = {
    admin: 'admin123',
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
