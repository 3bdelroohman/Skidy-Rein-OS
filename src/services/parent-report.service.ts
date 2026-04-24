import { getGroupDetails } from "@/services/group-operations.service";
import { getStudentNotes } from "@/services/student-progress-notes.service";
import { getTaskStats } from "@/services/group-tasks.service";
import type { StudentProgressNote } from "@/types/crm";

// ─── Parent Report Data Model ────────────────────────────────

export interface ParentReportData {
  // Student
  studentName: string;
  parentName: string;
  parentPhone: string;

  // Group
  groupName: string;
  courseName: string;
  teacherName: string;
  startDate: string;
  groupStatus: "active" | "planned" | "completed";

  // Attendance
  totalSessions: number;
  attendance: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    unmarked: number;
  };
  attendancePercent: number;

  // Progress notes
  progressNotes: StudentProgressNote[];

  // Tasks stats
  teacherTaskStats: { total: number; done: number; percent: number };
  studentTaskStats: { total: number; done: number; percent: number };

  // Meta
  generatedAt: string;
}

export async function generateParentReport(
  groupId: string,
  studentId: string,
): Promise<ParentReportData | null> {
  const group = await getGroupDetails(groupId);
  if (!group) return null;

  const student = group.linkedStudents.find((s) => s.id === studentId);
  if (!student) return null;

  // Attendance aggregation
  const att = { present: 0, absent: 0, late: 0, excused: 0, unmarked: 0 };
  let totalSessions = 0;

  for (const session of group.sessions) {
    const entry = session.attendanceEntries.find((e) => e.studentId === studentId);
    if (entry) {
      totalSessions++;
      if (entry.status === "present") att.present++;
      else if (entry.status === "absent") att.absent++;
      else if (entry.status === "late") att.late++;
      else if (entry.status === "excused") att.excused++;
      else att.unmarked++;
    }
  }

  const attendedCount = att.present + att.late;
  const attendancePercent = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 0;

  // Progress notes (localStorage)
  const progressNotes = getStudentNotes(groupId, studentId);

  // Task stats (localStorage)
  const teacherTaskStats = getTaskStats(groupId, "teacher");
  const studentTaskStats = getTaskStats(groupId, "student");

  return {
    studentName: student.fullName,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    groupName: group.name,
    courseName: group.course,
    teacherName: group.teacherName,
    startDate: group.startDate,
    groupStatus: group.groupStatus,
    totalSessions,
    attendance: att,
    attendancePercent,
    progressNotes,
    teacherTaskStats: { total: teacherTaskStats.total, done: teacherTaskStats.done, percent: teacherTaskStats.percent },
    studentTaskStats: { total: studentTaskStats.total, done: studentTaskStats.done, percent: studentTaskStats.percent },
    generatedAt: new Date().toISOString(),
  };
}
