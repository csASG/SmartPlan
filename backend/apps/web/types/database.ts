export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface DbUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  displayName: string | null;
  role: UserRole;
}

export interface DbTeacher {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
  name: string;
}

export interface DbStudent {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
  firstName: string;
  lastName: string;
  classId: number | null;
}

export interface DbClass {
  id: number;
  name: string;
  year: number | null;
}

export interface DbRoom {
  id: number;
  name: string;
  capacity: number | null;
}

export interface DbSubject {
  id: number;
  name: string;
  code: string | null;
}

export interface DbTimetableEntry {
  id: number;
  createdAt: string;
  updatedAt: string;
  classId: number | null;
  subjectId: number;
  teacherId: number | null;
  roomId: number | null;
  start: string;
  end: string;
  note: string | null;

  // Joined relations (from Supabase or Prisma include)
  class?: DbClass | null;
  subject?: DbSubject;
  teacher?: DbTeacher | null;
  room?: DbRoom | null;
}

export interface DbSubstitution {
  id: number;
  createdAt: string;
  date: string;
  originalId: number;
  substituteTeacherId: number | null;
  substituteRoomId: number | null;
  note: string | null;
}

export interface DbAttendance {
  id: number;
  createdAt: string;
  timetableEntryId: number;
  studentId: number;
  status: AttendanceStatus;
  recordedAt: string;
}
