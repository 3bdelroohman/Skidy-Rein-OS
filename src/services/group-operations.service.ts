"use client";



import { createBrowserClient } from "@supabase/ssr";

import type { AttendanceStatus, Database } from "@/types/database.types";

import type {

  CourseType,

  GroupDetails,

  GroupListItem,

  GroupSessionAttendanceItem,

  GroupSessionItem,

  SessionOperationsChecklist,

  StudentListItem,

  TeacherListItem,

} from "@/types/crm";

import { listStudents } from "@/services/students.service";

import { listTeachers } from "@/services/teachers.service";



type ClassRow = Database["public"]["Tables"]["classes"]["Row"];

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];

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



type SupabaseBrowserClient = NonNullable<ReturnType<typeof getSupabaseClient>>;



function asCourse(value: string | null | undefined): CourseType {

  return (value ?? "scratch") as CourseType;

}





function addDaysToDate(dateValue: string, days: number): string {

  const [year, month, day] = dateValue.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);

}



function getWeekdayFromDate(dateValue: string): number {

  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();

}



function normalizeRecurrenceWeekdays(input: number[] | undefined, anchorDate: string): number[] {

  const fallback = getWeekdayFromDate(anchorDate);

  const normalized = [...new Set((input ?? [fallback]).map((value) => Math.trunc(value)).filter((value) => value >= 0 && value <= 6))].sort((a, b) => a - b);

  return normalized.length > 0 ? normalized : [fallback];

}



function timeToMinutes(value: string): number {

  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;

}



function timesOverlap(leftStart: string, leftEnd: string, rightStart: string, rightEnd: string): boolean {

  const aStart = timeToMinutes(leftStart);

  const aEnd = timeToMinutes(leftEnd);

  const bStart = timeToMinutes(rightStart);

  const bEnd = timeToMinutes(rightEnd);

  return aStart < bEnd && aEnd > bStart;

}

function sortSessions(items: GroupSessionItem[]): GroupSessionItem[] {

  return [...items].sort((a, b) => {

    const leftDate = a.sessionDate ?? "";

    const rightDate = b.sessionDate ?? "";

    return leftDate.localeCompare(rightDate) || a.startTime.localeCompare(b.startTime);

  });

}



function computeGroupStatus(isActive: boolean, startDate: string): "planned" | "active" | "completed" {

  if (!isActive) return "completed";

  const today = new Date().toISOString().slice(0, 10);

  return startDate > today ? "planned" : "active";

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



function buildAttendanceEntries(

  linkedStudents: StudentListItem[],

  attendanceRows: AttendanceRow[],

): GroupSessionAttendanceItem[] {

  const byStudentId = new Map(attendanceRows.map((row) => [row.student_id, row] as const));



  return linkedStudents.map((student) => {

    const row = byStudentId.get(student.id) ?? null;



    return {

      studentId: student.id,

      studentName: student.fullName,

      parentName: student.parentName,

      status: row ? (row.status as AttendanceStatus) : null,

      notes: row?.notes ?? null,

    };

  });

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

    attendanceEntries: buildAttendanceEntries(linkedStudents, attendanceRows),

    operations,

  };

}



async function resolveCourseRow(supabase: SupabaseBrowserClient, course: CourseType): Promise<CourseRow> {

  const { data, error } = await supabase

    .from("courses")

    .select("*")

    .eq("type", course)

    .order("created_at", { ascending: true })

    .limit(1);



  if (error || !data || data.length === 0) {

    throw new Error(error?.message || "Could not find a matching course for the selected group");

  }



  return data[0] as CourseRow;

}



async function syncGroupStudentCount(supabase: SupabaseBrowserClient, groupId: string): Promise<void> {

  const { count, error } = await supabase

    .from("class_enrollments")

    .select("id", { head: true, count: "exact" })

    .eq("class_id", groupId)

    .eq("is_active", true);



  if (error) {

    throw new Error(error.message || "Failed to recount group students");

  }



  const { error: updateError } = await supabase

    .from("classes")

    .update({ current_students: count ?? 0 })

    .eq("id", groupId);



  if (updateError) {

    throw new Error(updateError.message || "Failed to sync group student count");

  }

}



async function syncStudentCurrentClass(supabase: SupabaseBrowserClient, studentId: string): Promise<void> {

  const { data: activeEnrollments, error: enrollmentError } = await supabase

    .from("class_enrollments")

    .select("class_id, enrolled_at")

    .eq("student_id", studentId)

    .eq("is_active", true)

    .order("enrolled_at", { ascending: false })

    .limit(1);



  if (enrollmentError) {

    throw new Error(enrollmentError.message || "Failed to load active enrollments");

  }



  const latestEnrollment = activeEnrollments?.[0];



  if (!latestEnrollment) {

    const { error: clearError } = await supabase

      .from("students")

      .update({ current_class_id: null, current_course: null })

      .eq("id", studentId);



    if (clearError) {

      throw new Error(clearError.message || "Failed to clear student current class");

    }



    return;

  }



  const { data: classRow, error: classError } = await supabase

    .from("classes")

    .select("id, course_id")

    .eq("id", latestEnrollment.class_id)

    .maybeSingle();



  if (classError || !classRow) {

    throw new Error(classError?.message || "Failed to load latest class for student");

  }



  const { data: courseRow, error: courseError } = await supabase

    .from("courses")

    .select("type")

    .eq("id", classRow.course_id)

    .maybeSingle();



  if (courseError) {

    throw new Error(courseError.message || "Failed to load latest course for student");

  }



  const { error: updateError } = await supabase

    .from("students")

    .update({

      current_class_id: classRow.id,

      current_course: asCourse(courseRow?.type ?? null),

    })

    .eq("id", studentId);



  if (updateError) {

    throw new Error(updateError.message || "Failed to sync student current class");

  }

}



async function syncStudentAttendanceCount(supabase: SupabaseBrowserClient, studentId: string): Promise<void> {

  const { count, error } = await supabase

    .from("attendance")

    .select("id", { head: true, count: "exact" })

    .eq("student_id", studentId)

    .in("status", ["present", "late"]);



  if (error) {

    throw new Error(error.message || "Failed to recount student attendance");

  }



  const { error: updateError } = await supabase

    .from("students")

    .update({ sessions_attended: count ?? 0 })

    .eq("id", studentId);



  if (updateError) {

    throw new Error(updateError.message || "Failed to sync student attendance count");

  }

}



export async function createGroup(input: {

  name: string;

  startDate: string;

  teacherId: string;

  course: CourseType;

  isActive?: boolean;

  studentIds?: string[];

  maxStudents?: number;

  teacherSessionDurationMinutes?: number | null;

  teacherSessionRate?: number | null;

  teacherFinanceNotes?: string | null;

}): Promise<string> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const groupName = input.name.trim();

  if (!groupName) throw new Error("Group name is required");

  if (!input.startDate) throw new Error("Start date is required");

  if (!input.teacherId) throw new Error("Teacher is required");



  const courseRow = await resolveCourseRow(supabase, input.course);

  const uniqueStudentIds = [...new Set((input.studentIds ?? []).map((id) => id.trim()).filter(Boolean))];

  const maxStudents = Math.max(input.maxStudents ?? 8, uniqueStudentIds.length, 1);



  const { data, error } = await supabase

    .from("classes")

    .insert({

      name: groupName,

      course_id: courseRow.id,

      teacher_id: input.teacherId,

      max_students: maxStudents,

      current_students: 0,

      start_date: input.startDate,

      is_active: input.isActive ?? true,

      teacher_session_duration_minutes: input.teacherSessionDurationMinutes ?? null,

      teacher_session_rate: input.teacherSessionRate ?? null,

      teacher_finance_notes: input.teacherFinanceNotes?.trim() ? input.teacherFinanceNotes.trim() : null,

    })

    .select("*")

    .single();



  if (error || !data) {

    throw new Error(error?.message || "Failed to create group");

  }



  if (uniqueStudentIds.length > 0) {

    await addStudentsToGroup(data.id, input.course, uniqueStudentIds);

  } else {

    await syncGroupStudentCount(supabase, data.id);

  }



  return data.id;

}



export async function addStudentsToGroup(groupId: string, course: CourseType, studentIds: string[]): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const uniqueIds = [...new Set(studentIds.map((id) => id.trim()).filter(Boolean))];

  if (uniqueIds.length === 0) return;



  const { data: existingRows, error: existingError } = await supabase

    .from("class_enrollments")

    .select("student_id")

    .eq("class_id", groupId)

    .eq("is_active", true)

    .in("student_id", uniqueIds);



  if (existingError) {

    throw new Error(existingError.message || "Failed to verify existing group students");

  }



  const existingIds = new Set((existingRows ?? []).map((row) => row.student_id));

  const missingIds = uniqueIds.filter((id) => !existingIds.has(id));



  if (missingIds.length > 0) {

    const { error: insertError } = await supabase.from("class_enrollments").insert(

      missingIds.map((studentId) => ({

        student_id: studentId,

        class_id: groupId,

        is_active: true,

        enrolled_at: new Date().toISOString(),

      })),

    );



    if (insertError) {

      throw new Error(insertError.message || "Failed to add students to group");

    }



    const { error: updateStudentsError } = await supabase

      .from("students")

      .update({

        current_class_id: groupId,

        current_course: course,

      })

      .in("id", missingIds);



    if (updateStudentsError) {

      throw new Error(updateStudentsError.message || "Failed to update students current class");

    }

  }



  await syncGroupStudentCount(supabase, groupId);

}



export async function moveStudentToGroup(input: {

  sourceGroupId: string;

  targetGroupId: string;

  studentId: string;

  targetCourse: CourseType;

}): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  if (input.sourceGroupId === input.targetGroupId) {

    throw new Error("Student is already in this group.");

  }



  const { data: existingTargetRows, error: existingTargetError } = await supabase

    .from("class_enrollments")

    .select("id")

    .eq("class_id", input.targetGroupId)

    .eq("student_id", input.studentId)

    .eq("is_active", true)

    .limit(1);



  if (existingTargetError) {

    throw new Error(existingTargetError.message || "Failed to check target group enrollment");

  }



  if ((existingTargetRows ?? []).length > 0) {

    throw new Error("Student is already active in the target group.");

  }



  const now = new Date().toISOString();



  const { error: deactivateError } = await supabase

    .from("class_enrollments")

    .update({

      is_active: false,

      dropped_at: now,

    })

    .eq("class_id", input.sourceGroupId)

    .eq("student_id", input.studentId)

    .eq("is_active", true);



  if (deactivateError) {

    throw new Error(deactivateError.message || "Failed to deactivate source group enrollment");

  }



  const { error: insertError } = await supabase.from("class_enrollments").insert({

    student_id: input.studentId,

    class_id: input.targetGroupId,

    is_active: true,

    enrolled_at: now,

  });



  if (insertError) {

    throw new Error(insertError.message || "Failed to add student to target group");

  }



  const { error: updateStudentError } = await supabase

    .from("students")

    .update({

      current_class_id: input.targetGroupId,

      current_course: input.targetCourse,

    })

    .eq("id", input.studentId);



  if (updateStudentError) {

    throw new Error(updateStudentError.message || "Failed to update student current group");

  }



  await syncGroupStudentCount(supabase, input.sourceGroupId);

  await syncGroupStudentCount(supabase, input.targetGroupId);

  await syncStudentCurrentClass(supabase, input.studentId);

}

export async function removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const { error } = await supabase

    .from("class_enrollments")

    .update({

      is_active: false,

      dropped_at: new Date().toISOString(),

    })

    .eq("class_id", groupId)

    .eq("student_id", studentId)

    .eq("is_active", true);



  if (error) {

    throw new Error(error.message || "Failed to remove student from group");

  }



  await syncGroupStudentCount(supabase, groupId);

  await syncStudentCurrentClass(supabase, studentId);

}









export async function deleteGroupPermanently(groupId: string): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  if (!groupId) {

    throw new Error("Group id is required.");

  }



  const { data: classRow, error: classError } = await supabase

    .from("classes")

    .select("id")

    .eq("id", groupId)

    .maybeSingle();



  if (classError) {

    throw new Error(classError.message || "Failed to load group before deleting");

  }



  if (!classRow) {

    throw new Error("Group was not found.");

  }



  const { data: sessionRows, error: sessionsError } = await supabase

    .from("sessions")

    .select("id")

    .eq("class_id", groupId);



  if (sessionsError) {

    throw new Error(sessionsError.message || "Failed to load group sessions before deleting");

  }



  const sessionIds = ((sessionRows ?? []) as Array<{ id: string | null }>)

    .map((row) => row.id)

    .filter((id): id is string => Boolean(id));



  const { data: enrollmentRows, error: enrollmentsLoadError } = await supabase

    .from("class_enrollments")

    .select("student_id")

    .eq("class_id", groupId);



  if (enrollmentsLoadError) {

    throw new Error(enrollmentsLoadError.message || "Failed to load group enrollments before deleting");

  }



  const enrollmentStudentIds = ((enrollmentRows ?? []) as Array<{ student_id: string | null }>)

    .map((row) => row.student_id)

    .filter((id): id is string => Boolean(id));



  const { data: currentClassStudentRows, error: currentClassStudentsError } = await supabase

    .from("students")

    .select("id")

    .eq("current_class_id", groupId);



  if (currentClassStudentsError) {

    throw new Error(currentClassStudentsError.message || "Failed to load students currently assigned to this group");

  }



  const currentClassStudentIds = ((currentClassStudentRows ?? []) as Array<{ id: string | null }>)

    .map((row) => row.id)

    .filter((id): id is string => Boolean(id));



  const affectedStudentIds = [...new Set([...enrollmentStudentIds, ...currentClassStudentIds])];



  if (currentClassStudentIds.length > 0) {

    const { error: clearCurrentClassError } = await supabase

      .from("students")

      .update({ current_class_id: null })

      .eq("current_class_id", groupId);



    if (clearCurrentClassError) {

      throw new Error(clearCurrentClassError.message || "Failed to clear student current group before deleting");

    }

  }



  if (sessionIds.length > 0) {

    const { error: attendanceDeleteError } = await supabase

      .from("attendance")

      .delete()

      .in("session_id", sessionIds);



    if (attendanceDeleteError) {

      throw new Error(attendanceDeleteError.message || "Failed to delete group attendance records");

    }



    const { error: operationLogsDeleteError } = await supabase

      .from("session_operation_logs")

      .delete()

      .in("session_id", sessionIds);



    if (operationLogsDeleteError) {

      throw new Error(operationLogsDeleteError.message || "Failed to delete group operation logs");

    }

  }



  const { error: sessionsDeleteError } = await supabase

    .from("sessions")

    .delete()

    .eq("class_id", groupId);



  if (sessionsDeleteError) {

    throw new Error(sessionsDeleteError.message || "Failed to delete group sessions");

  }



  const { error: enrollmentsDeleteError } = await supabase

    .from("class_enrollments")

    .delete()

    .eq("class_id", groupId);



  if (enrollmentsDeleteError) {

    throw new Error(enrollmentsDeleteError.message || "Failed to delete group enrollments");

  }



  const { error: classDeleteError } = await supabase

    .from("classes")

    .delete()

    .eq("id", groupId);



  if (classDeleteError) {

    throw new Error(classDeleteError.message || "Failed to delete group");

  }



  for (const studentId of affectedStudentIds) {

    await syncStudentCurrentClass(supabase, studentId);

  }

}

export async function createGroupSessionSeries(input: {

  groupId: string;

  firstSessionDate: string;

  startTime: string;

  endTime: string;

  targetCount?: number;

  recurrenceWeekdays?: number[];

}): Promise<{ createdCount: number; totalCount: number }> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const targetCount = Math.min(48, Math.max(1, input.targetCount ?? 8));



  if (!input.firstSessionDate) {

    throw new Error("First session date is required.");

  }



  if (!input.startTime || !input.endTime) {

    throw new Error("Start time and end time are required.");

  }



  if (timeToMinutes(input.startTime) >= timeToMinutes(input.endTime)) {

    throw new Error("End time must be after start time.");

  }



  const { data: classRows, error: classError } = await supabase

    .from("classes")

    .select("*")

    .eq("id", input.groupId)

    .limit(1);



  if (classError) {

    throw new Error(classError.message || "Failed to load group");

  }



  const classRow = (classRows?.[0] ?? null) as ClassRow | null;

  if (!classRow) {

    throw new Error("Group was not found.");

  }



  const teacherId = classRow.teacher_id;

  if (!teacherId) {

    throw new Error("Cannot create sessions because the group teacher is missing.");

  }



  const { data: existingSessionRows, error: existingSessionsError } = await supabase

    .from("sessions")

    .select("*")

    .eq("class_id", input.groupId);



  if (existingSessionsError) {

    throw new Error(existingSessionsError.message || "Failed to load existing group sessions");

  }



  const existingSessions = ((existingSessionRows ?? []) as SessionRow[]).filter((row) => row.is_cancelled !== true);



  if (existingSessions.length >= targetCount) {

    return { createdCount: 0, totalCount: existingSessions.length };

  }



  const recurrenceWeekdays = normalizeRecurrenceWeekdays(input.recurrenceWeekdays, input.firstSessionDate);

  const recurrenceWeekdaySet = new Set(recurrenceWeekdays);



  const existingKeys = new Set(

    existingSessions.map((session) => `${session.session_date ?? ""}|${session.start_time}|${session.end_time}`),

  );



  const rowsToInsert: Array<{

    class_id: string;

    teacher_id: string;

    session_date: string;

    start_time: string;

    end_time: string;

    topic: string | null;

    notes: string | null;

    meeting_link: string | null;

    is_cancelled: boolean;

  }> = [];



  let cursorDate = input.firstSessionDate;

  let guard = 0;

  const maxGuard = Math.max(120, targetCount * 35);



  while (existingSessions.length + rowsToInsert.length < targetCount && guard < maxGuard) {

    if (recurrenceWeekdaySet.has(getWeekdayFromDate(cursorDate))) {

      const key = `${cursorDate}|${input.startTime}|${input.endTime}`;



      if (!existingKeys.has(key)) {

        rowsToInsert.push({

          class_id: input.groupId,

          teacher_id: teacherId,

          session_date: cursorDate,

          start_time: input.startTime,

          end_time: input.endTime,

          topic: null,

          notes: `Generated from existing group using a ${recurrenceWeekdays.length}-day weekly recurrence pattern.`,

          meeting_link: null,

          is_cancelled: false,

        });



        existingKeys.add(key);

      }

    }



    cursorDate = addDaysToDate(cursorDate, 1);

    guard += 1;

  }



  if (existingSessions.length + rowsToInsert.length < targetCount) {

    throw new Error("Could not generate enough sessions for the selected recurrence pattern.");

  }



  if (rowsToInsert.length > 0) {

    const candidateDates = [...new Set(rowsToInsert.map((row) => row.session_date))];



    const { data: conflictRows, error: conflictError } = await supabase

      .from("sessions")

      .select("id, class_id, session_date, start_time, end_time, is_cancelled")

      .eq("teacher_id", teacherId)

      .in("session_date", candidateDates);



    if (conflictError) {

      throw new Error(conflictError.message || "Failed to validate teacher schedule conflicts");

    }



    const conflicts = ((conflictRows ?? []) as Array<{

      id: string;

      class_id: string | null;

      session_date: string | null;

      start_time: string;

      end_time: string;

      is_cancelled?: boolean | null;

    }>).filter((existing) =>

      existing.is_cancelled !== true &&

      existing.class_id !== input.groupId &&

      rowsToInsert.some((candidate) =>

        candidate.session_date === existing.session_date &&

        timesOverlap(candidate.start_time, candidate.end_time, existing.start_time, existing.end_time),

      ),

    );



    if (conflicts.length > 0) {

      const first = conflicts[0];

      throw new Error(`Teacher conflict on ${first.session_date} at ${first.start_time}. Choose another recurrence day or time.`);

    }

  }



  if (rowsToInsert.length === 0) {

    return { createdCount: 0, totalCount: existingSessions.length };

  }



  const { error: insertError } = await supabase.from("sessions").insert(rowsToInsert);



  if (insertError) {

    throw new Error(insertError.message || "Failed to create group sessions");

  }



  return {

    createdCount: rowsToInsert.length,

    totalCount: existingSessions.length + rowsToInsert.length,

  };

}

export async function completeGroupSessionSeries(input: {

  groupId: string;

  targetCount?: number;

  recurrenceWeekdays?: number[];

}): Promise<{ createdCount: number; totalCount: number }> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const targetCount = Math.min(24, Math.max(1, input.targetCount ?? 8));



  const { data: classRows, error: classError } = await supabase

    .from("classes")

    .select("*")

    .eq("id", input.groupId)

    .limit(1);



  if (classError) {

    throw new Error(classError.message || "Failed to load group");

  }



  const classRow = (classRows?.[0] ?? null) as ClassRow | null;

  if (!classRow) {

    throw new Error("Group was not found.");

  }



  const { data: sessionRows, error: sessionsError } = await supabase

    .from("sessions")

    .select("*")

    .eq("class_id", input.groupId);



  if (sessionsError) {

    throw new Error(sessionsError.message || "Failed to load group sessions");

  }



  const existingSessions = sortSessions(

    ((sessionRows ?? []) as SessionRow[]).filter((row) => row.is_cancelled !== true).map((row) => ({

      id: row.id,

      classId: row.class_id,

      teacherId: row.teacher_id,

      day: row.session_date ? new Date(row.session_date).getDay() : 0,

      startTime: row.start_time,

      endTime: row.end_time,

      className: classRow.name,

      teacher: "Teacher",

      students: 0,

      course: asCourse(null),

      sessionDate: row.session_date,

      linkedStudents: [],

      attendanceSummary: { present: 0, absent: 0, late: 0, excused: 0 },

      attendanceEntries: [],

      operations: null,

    })),

  );



  if (existingSessions.length === 0) {

    throw new Error("Create the first session first, then complete the series from the group page.");

  }



  if (existingSessions.length >= targetCount) {

    return { createdCount: 0, totalCount: existingSessions.length };

  }



  const anchor = existingSessions.find((session) => session.sessionDate) ?? existingSessions[0];

  if (!anchor.sessionDate) {

    throw new Error("The first session must have a date before completing the series.");

  }



  const teacherId = anchor.teacherId ?? classRow.teacher_id;

  if (!teacherId) {

    throw new Error("Cannot complete the series because the group teacher is missing.");

  }



  const startTime = anchor.startTime;

  const endTime = anchor.endTime;

  const recurrenceWeekdays = normalizeRecurrenceWeekdays(input.recurrenceWeekdays, anchor.sessionDate);

  const recurrenceWeekdaySet = new Set(recurrenceWeekdays);

  const existingKeys = new Set(

    existingSessions.map((session) => `${session.sessionDate ?? ""}|${session.startTime}|${session.endTime}`),

  );



  const rowsToInsert: Array<{

    class_id: string;

    teacher_id: string;

    session_date: string;

    start_time: string;

    end_time: string;

    topic: string | null;

    notes: string | null;

    meeting_link: string | null;

    is_cancelled: boolean;

  }> = [];



  let cursorDate = anchor.sessionDate;

  let guard = 0;

  const maxGuard = Math.max(90, targetCount * 28);



  while (existingSessions.length + rowsToInsert.length < targetCount && guard < maxGuard) {

    if (recurrenceWeekdaySet.has(getWeekdayFromDate(cursorDate))) {

      const key = `${cursorDate}|${startTime}|${endTime}`;



      if (!existingKeys.has(key)) {

        rowsToInsert.push({

          class_id: input.groupId,

          teacher_id: teacherId,

          session_date: cursorDate,

          start_time: startTime,

          end_time: endTime,

          topic: null,

          notes: `Generated as part of a ${recurrenceWeekdays.length}-day weekly recurrence pattern.`,

          meeting_link: null,

          is_cancelled: false,

        });



        existingKeys.add(key);

      }

    }



    cursorDate = addDaysToDate(cursorDate, 1);

    guard += 1;

  }



  if (existingSessions.length + rowsToInsert.length < targetCount) {

    throw new Error("Could not generate enough sessions for the selected recurrence pattern.");

  }



  if (rowsToInsert.length > 0) {

    const candidateDates = [...new Set(rowsToInsert.map((row) => row.session_date))];



    const { data: conflictRows, error: conflictError } = await supabase

      .from("sessions")

      .select("id, class_id, session_date, start_time, end_time")

      .eq("teacher_id", teacherId)

      .in("session_date", candidateDates)

      .neq("is_cancelled", true);



    if (conflictError) {

      throw new Error(conflictError.message || "Failed to validate teacher schedule conflicts");

    }



    const conflicts = ((conflictRows ?? []) as Array<{

      id: string;

      class_id: string | null;

      session_date: string | null;

      start_time: string;

      end_time: string;

    }>).filter((existing) =>

      existing.class_id !== input.groupId &&

      rowsToInsert.some((candidate) =>

        candidate.session_date === existing.session_date &&

        timesOverlap(candidate.start_time, candidate.end_time, existing.start_time, existing.end_time),

      ),

    );



    if (conflicts.length > 0) {

      const first = conflicts[0];

      throw new Error(`Teacher conflict on ${first.session_date} at ${first.start_time}. Choose another recurrence day or time.`);

    }

  }

  if (rowsToInsert.length === 0) {

    return { createdCount: 0, totalCount: existingSessions.length };

  }



  const { error: insertError } = await supabase.from("sessions").insert(rowsToInsert);



  if (insertError) {

    throw new Error(insertError.message || "Failed to create missing group sessions");

  }



  return {

    createdCount: rowsToInsert.length,

    totalCount: existingSessions.length + rowsToInsert.length,

  };

}

export async function updateGroupSessionSchedule(input: {

  sessionId: string;

  sessionDate: string;

  startTime: string;

  endTime: string;

}): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const { error } = await supabase

    .from("sessions")

    .update({

      session_date: input.sessionDate,

      start_time: input.startTime,

      end_time: input.endTime,

    })

    .eq("id", input.sessionId);



  if (error) {

    throw new Error(error.message || "Failed to update session schedule");

  }

}

export async function saveSessionAttendanceBulk(input: {

  sessionId: string;

  entries: Array<{

    studentId: string;

    status: AttendanceStatus | null;

    notes?: string | null;

  }>;

}): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) {

    throw new Error("Supabase client is not available in the current browser session.");

  }



  const studentIds = [...new Set(input.entries.map((entry) => entry.studentId).filter(Boolean))];

  if (studentIds.length === 0) return;



  const { data: existingRows, error: existingError } = await supabase

    .from("attendance")

    .select("id, student_id")

    .eq("session_id", input.sessionId)

    .in("student_id", studentIds);



  if (existingError) {

    throw new Error(existingError.message || "Failed to load existing attendance rows");

  }



  const existingByStudent = new Map((existingRows ?? []).map((row) => [row.student_id, row] as const));



  for (const entry of input.entries) {

    const existing = existingByStudent.get(entry.studentId) ?? null;

    const trimmedNotes = entry.notes?.trim() || null;



    if (!entry.status) {

      if (existing) {

        const { error: deleteError } = await supabase.from("attendance").delete().eq("id", existing.id);

        if (deleteError) {

          throw new Error(deleteError.message || "Failed to clear attendance row");

        }

      }

      continue;

    }



    if (existing) {

      const { error: updateError } = await supabase

        .from("attendance")

        .update({

          status: entry.status,

          notes: trimmedNotes,

        })

        .eq("id", existing.id);



      if (updateError) {

        throw new Error(updateError.message || "Failed to update attendance");

      }

    } else {

      const { error: insertError } = await supabase.from("attendance").insert({

        session_id: input.sessionId,

        student_id: entry.studentId,

        status: entry.status,

        notes: trimmedNotes,

      });



      if (insertError) {

        throw new Error(insertError.message || "Failed to create attendance");

      }

    }

  }



  for (const studentId of studentIds) {

    await syncStudentAttendanceCount(supabase, studentId);

  }

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

      .map((studentId) => studentMap.get(studentId) ?? null)

      .filter((item): item is StudentListItem => item !== null);



    const classSessions = sessions.filter((session) => session.class_id === classRow.id);



    const nextSession =

      [...classSessions]

        .filter((session) => !!session.session_date && new Date(session.session_date as string) >= new Date())

        .sort(

          (a, b) =>

            (a.session_date ?? "").localeCompare(b.session_date ?? "") ||

            a.start_time.localeCompare(b.start_time),

        )[0] ?? null;



    return {

      id: classRow.id,

      name: classRow.name,

      course: courseMap.get(classRow.course_id) ?? "scratch",

      teacherId: classRow.teacher_id ?? null,

      teacherName: teacherMap.get(classRow.teacher_id)?.fullName ?? "Teacher",

      isActive: classRow.is_active ?? true,

      studentsCount: linkedStudents.length,

      sessionsCount: classSessions.length,

      teacherSessionDurationMinutes: classRow.teacher_session_duration_minutes ?? null,

      teacherSessionRate: classRow.teacher_session_rate ?? null,

      teacherFinanceNotes: classRow.teacher_finance_notes ?? null,

      nextSessionDate: nextSession?.session_date ?? null,

      nextSessionStartTime: nextSession?.start_time ?? null,

      startDate: classRow.start_date,

      endDate: classRow.end_date ?? null,

      groupNotes: classRow.schedule_notes ?? null,

      groupStatus: computeGroupStatus(classRow.is_active ?? true, classRow.start_date),

    } satisfies GroupListItem;

  });

}



export async function getGroupDetails(groupId: string): Promise<GroupDetails | null> {

  const supabase = getSupabaseClient();

  if (!supabase) return null;



  const [teachers, students, classRes, coursesRes, enrollmentsRes, sessionsRes, attendanceRes, operationsRes] =

    await Promise.all([

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

    .map((studentId) => studentMap.get(studentId) ?? null)

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

      .filter((session): session is typeof session & { sessionDate: string } => !!session.sessionDate && new Date(session.sessionDate as string) >= new Date())

      .sort(

        (a, b) =>

          (a.sessionDate ?? "").localeCompare(b.sessionDate ?? "") ||

          a.startTime.localeCompare(b.startTime),

      )[0] ?? null;



  return {

    id: classRow.id,

    name: classRow.name,

    course: courseMap.get(classRow.course_id) ?? "scratch",

    teacherId: classRow.teacher_id ?? null,

    teacherName: teacherMap.get(classRow.teacher_id)?.fullName ?? "Teacher",

    isActive: classRow.is_active ?? true,

    studentsCount: linkedStudents.length,

    sessionsCount: sessions.length,

    teacherSessionDurationMinutes: classRow.teacher_session_duration_minutes ?? null,

    teacherSessionRate: classRow.teacher_session_rate ?? null,

    teacherFinanceNotes: classRow.teacher_finance_notes ?? null,

    nextSessionDate: nextSession?.sessionDate ?? null,

    nextSessionStartTime: nextSession?.startTime ?? null,

    startDate: classRow.start_date,

    endDate: classRow.end_date ?? null,

    groupNotes: classRow.schedule_notes ?? null,

    groupStatus: computeGroupStatus(classRow.is_active ?? true, classRow.start_date),

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





export async function saveGroupNotes(groupId: string, notes: string): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) throw new Error("Supabase client is not available.");



  const { error } = await supabase

    .from("classes")

    .update({ schedule_notes: notes.trim() || null })

    .eq("id", groupId);



  if (error) throw new Error(error.message || "Failed to save group notes");

}



export async function updateGroupStatus(groupId: string, isActive: boolean): Promise<void> {

  const supabase = getSupabaseClient();

  if (!supabase) throw new Error("Supabase client is not available.");



  const updatePayload: Record<string, unknown> = { is_active: isActive };

  if (!isActive) updatePayload.end_date = new Date().toISOString().slice(0, 10);



  const { error } = await supabase

    .from("classes")

    .update(updatePayload)

    .eq("id", groupId);



  if (error) throw new Error(error.message || "Failed to update group status");

}

