import { createBrowserClient } from "@supabase/ssr";
import type { AttendanceStatus, Database } from "@/types/database.types";
import type {
  CourseType,
  GroupDetails,
  GroupListItem,
  GroupSessionItem,
  SessionOperationsChecklist,
  StudentListItem,
  TeacherListItem,
} from "@/types/crm";
import { listStudents } from "@/services/students.service";
import { listTeachers } from "@/services/teachers.service";

type ClassRow = Database["public"]["Tables"]["classes"]["Row"];
type SessionRow = Database["public"]["Tables"]["sessions"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["class_enrollments"]["Row"];
type AttendanceRow = Database["public"]["Tables"]["attendance"]["Row"];
type SessionOperationRow = Database["public"]["Tables"]["session_operation_logs"]["Row"];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || typeof window === "undefined") return null;
  return createBrowserClient<Database>(url, key);
}

function asCourse(value: string | null | undefined): CourseType {
  return (value ?? "scratch") as CourseType;
}

function sortSessions(items: GroupSessionItem[]): GroupSessionItem[] {
  return [...items].sort((a, b) => {
    const leftDate = a.sessionDate ?? "";
    const rightDate = b.sessionDate ?? "";
    return leftDate.localeCompare(rightDate) || a.startTime.localeCompare(b.startTime);
  });
}

function mapOperationRow(row: SessionOperationRow): SessionOperationsChecklist {
  return {
    id: row.id,
    sessionId: row.session_id,
    classId: row.class_id,
    teacherId: row.teacher_id,
    attendanceTaken: row.attendance_taken,
    materialsUploaded: row.materials_uploaded,
    recordingUploaded: row.recording_uploaded,
    telegramPosted: row.telegram_posted,
    homeworkShared: row.homework_shared,
    operationsNotes: row.operations_notes,
    updatedAt: row.updated_at ?? null,
  };
}

function buildAttendanceSummary(rows: AttendanceRow[]): GroupSessionItem["attendanceSummary"] {
  const summary: GroupSessionItem["attendanceSummary"] = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  };

  rows.forEach((row) => {
    const status = row.status as AttendanceStatus;
    if (status === "present") summary.present += 1;
    else if (status === "absent") summary.absent += 1;
    else if (status === "late") summary.late += 1;
    else if (status === "excused") summary.excused += 1;
  });

  return summary;
}

function mapSessionToGroupSession(params: {
  row: SessionRow;
  classRow: ClassRow;
  course: CourseType;
  teacher: TeacherListItem | null;
  linkedStudents: StudentListItem[];
  attendanceRows: AttendanceRow[];
  operations: SessionOperationsChecklist | null;
}): GroupSessionItem {
  const { row, classRow, course, teacher, linkedStudents, attendanceRows, operations } = params;

  return {
    id: row.id,
    classId: row.class_id,
    teacherId: row.teacher_id,
    day: row.session_date ? new Date(row.session_date).getDay() : 0,
    startTime: row.start_time,
    endTime: row.end_time,
    className: classRow.name,
    teacher: teacher?.fullName ?? "Teacher",
    students: linkedStudents.length,
    course,
    sessionDate: row.session_date,
    linkedStudents,
    attendanceSummary: buildAttendanceSummary(attendanceRows),
    operations,
  };
}

export async function listGroups(): Promise<GroupListItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const [teachers, students, classesRes, coursesRes, enrollmentsRes, sessionsRes] = await Promise.all([
    listTeachers(),
    listStudents(),
    supabase.from("classes").select("*").order("created_at", { ascending: false }),
    supabase.from("courses").select("id, type"),
    supabase.from("class_enrollments").select("*").eq("is_active", true),
    supabase.from("sessions").select("*").order("session_date", { ascending: true }),
  ]);

  if (classesRes.error) throw new Error(classesRes.error.message || "Failed to load classes");
  if (coursesRes.error) throw new Error(coursesRes.error.message || "Failed to load courses");
  if (enrollmentsRes.error) throw new Error(enrollmentsRes.error.message || "Failed to load enrollments");
  if (sessionsRes.error) throw new Error(sessionsRes.error.message || "Failed to load sessions");

  const courseMap = new Map((coursesRes.data ?? []).map((row) => [row.id, asCourse(row.type)]));
  const teacherMap = new Map(teachers.map((teacher) => [teacher.id, teacher]));
  const studentMap = new Map(students.map((student) => [student.id, student]));
  const activeEnrollments = (enrollmentsRes.data ?? []) as EnrollmentRow[];
  const sessions = (sessionsRes.data ?? []) as SessionRow[];

  return ((classesRes.data ?? []) as ClassRow[]).map((classRow) => {
    const linkedStudentIds = activeEnrollments
      .filter((row) => row.class_id === classRow.id)
      .map((row) => row.student_id);

    const linkedStudents = linkedStudentIds
      .map((id) => studentMap.get(id) ?? null)
      .filter((item): item is StudentListItem => item !== null);

    const classSessions = sessions.filter((session) => session.class_id === classRow.id);
    const nextSession =
      [...classSessions]
        .filter((session) => Boolean(session.session_date))
        .sort((a, b) => (a.session_date ?? "").localeCompare(b.session_date ?? "") || a.start_time.localeCompare(b.start_time))[0] ??
      null;

    return {
      id: classRow.id,
      name: classRow.name,
      course: courseMap.get(classRow.course_id) ?? "scratch",
      teacherId: classRow.teacher_id ?? null,
      teacherName: teacherMap.get(classRow.teacher_id)?.fullName ?? "Teacher",
      isActive: classRow.is_active ?? true,
      studentsCount: linkedStudents.length,
      sessionsCount: classSessions.length,
      nextSessionDate: nextSession?.session_date ?? null,
      nextSessionStartTime: nextSession?.start_time ?? null,
    } satisfies GroupListItem;
  });
}

export async function getGroupDetails(groupId: string): Promise<GroupDetails | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const [teachers, students, classRes, coursesRes, enrollmentsRes, sessionsRes, attendanceRes, operationsRes] = await Promise.all([
    listTeachers(),
    listStudents(),
    supabase.from("classes").select("*").eq("id", groupId).maybeSingle(),
    supabase.from("courses").select("id, type"),
    supabase.from("class_enrollments").select("*").eq("class_id", groupId).eq("is_active", true),
    supabase.from("sessions").select("*").eq("class_id", groupId).order("session_date", { ascending: true }),
    supabase.from("attendance").select("*"),
    supabase.from("session_operation_logs").select("*").eq("class_id", groupId),
  ]);

  if (classRes.error) throw new Error(classRes.error.message || "Failed to load class");
  if (!classRes.data) return null;
  if (coursesRes.error) throw new Error(coursesRes.error.message || "Failed to load courses");
  if (enrollmentsRes.error) throw new Error(enrollmentsRes.error.message || "Failed to load enrollments");
  if (sessionsRes.error) throw new Error(sessionsRes.error.message || "Failed to load sessions");
  if (attendanceRes.error) throw new Error(attendanceRes.error.message || "Failed to load attendance");
  if (operationsRes.error) throw new Error(operationsRes.error.message || "Failed to load session operations");

  const classRow = classRes.data as ClassRow;
  const courseMap = new Map((coursesRes.data ?? []).map((row) => [row.id, asCourse(row.type)]));
  const teacherMap = new Map(teachers.map((teacher) => [teacher.id, teacher]));
  const studentMap = new Map(students.map((student) => [student.id, student]));
  const operationsMap = new Map(
    ((operationsRes.data ?? []) as SessionOperationRow[]).map((row) => [row.session_id, mapOperationRow(row)]),
  );

  const linkedStudentIds = ((enrollmentsRes.data ?? []) as EnrollmentRow[]).map((row) => row.student_id);
  const linkedStudents = linkedStudentIds
    .map((id) => studentMap.get(id) ?? null)
    .filter((item): item is StudentListItem => item !== null);

  const sessions = ((sessionsRes.data ?? []) as SessionRow[]).map((row) => {
    const attendanceRows = ((attendanceRes.data ?? []) as AttendanceRow[]).filter((item) => item.session_id === row.id);
    return mapSessionToGroupSession({
      row,
      classRow,
      course: courseMap.get(classRow.course_id) ?? "scratch",
      teacher: teacherMap.get(classRow.teacher_id) ?? null,
      linkedStudents,
      attendanceRows,
      operations: operationsMap.get(row.id) ?? null,
    });
  });

  const nextSession =
    [...sessions]
      .filter((session) => Boolean(session.sessionDate))
      .sort((a, b) => (a.sessionDate ?? "").localeCompare(b.sessionDate ?? "") || a.startTime.localeCompare(b.startTime))[0] ??
    null;

  return {
    id: classRow.id,
    name: classRow.name,
    course: courseMap.get(classRow.course_id) ?? "scratch",
    teacherId: classRow.teacher_id ?? null,
    teacherName: teacherMap.get(classRow.teacher_id)?.fullName ?? "Teacher",
    isActive: classRow.is_active ?? true,
    studentsCount: linkedStudents.length,
    sessionsCount: sessions.length,
    nextSessionDate: nextSession?.sessionDate ?? null,
    nextSessionStartTime: nextSession?.startTime ?? null,
    teacherRecord: teacherMap.get(classRow.teacher_id) ?? null,
    linkedStudents,
    sessions: sortSessions(sessions),
  } satisfies GroupDetails;
}

export async function saveSessionOperationsChecklist(input: {
  sessionId: string;
  classId: string;
  teacherId: string;
  attendanceTaken: boolean;
  materialsUploaded: boolean;
  recordingUploaded: boolean;
  telegramPosted: boolean;
  homeworkShared: boolean;
  operationsNotes?: string | null;
}): Promise<SessionOperationsChecklist> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase client is not available in the current browser session.");
  }

  const { data, error } = await supabase
    .from("session_operation_logs")
    .upsert(
      {
        session_id: input.sessionId,
        class_id: input.classId,
        teacher_id: input.teacherId,
        attendance_taken: input.attendanceTaken,
        materials_uploaded: input.materialsUploaded,
        recording_uploaded: input.recordingUploaded,
        telegram_posted: input.telegramPosted,
        homework_shared: input.homeworkShared,
        operations_notes: input.operationsNotes?.trim() || null,
      },
      { onConflict: "session_id" },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to save session operations checklist");
  }

  return mapOperationRow(data as SessionOperationRow);
}
