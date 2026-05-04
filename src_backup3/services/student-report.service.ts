import { getCourseFormLabel } from "@/config/course-roadmap";
import type { CourseType, ScheduleSessionItem, TeacherListItem } from "@/types/crm";

export interface StudentReportSnapshot {
  ready: boolean;
  currentCheckpoint: number;
  nextCheckpoint: number;
  sessionsInCurrentCycle: number;
  sessionsUntilNext: number;
  progressPercent: number;
  teacherName: string | null;
  className: string | null;
  cycleLabelAr: string;
  cycleLabelEn: string;
}

export interface StudentMonthlyReportDraft {
  summaryAr: string;
  summaryEn: string;
  strengthsAr: string[];
  strengthsEn: string[];
  focusAreasAr: string[];
  focusAreasEn: string[];
  nextGoalAr: string;
  nextGoalEn: string;
}

function ceilToCheckpoint(value: number, checkpoint = 4): number {
  if (value <= 0) return checkpoint;
  return Math.ceil(value / checkpoint) * checkpoint;
}

export interface StudentReportSubject {
  fullName: string;
  sessionsAttended: number;
  currentCourse: CourseType | null;
  className: string | null;
  teachers?: Pick<TeacherListItem, "fullName">[];
  relatedSessions?: Pick<ScheduleSessionItem, "className">[];
}

export function buildStudentReportSnapshot(student: StudentReportSubject): StudentReportSnapshot {
  const totalSessions = Math.max(0, student.sessionsAttended);
  const nextCheckpoint = ceilToCheckpoint(totalSessions + (totalSessions % 4 === 0 ? 4 : 0));
  const currentCheckpoint = totalSessions >= 4 ? Math.floor(totalSessions / 4) * 4 : 0;
  const sessionsInCurrentCycle = totalSessions % 4;
  const sessionsUntilNext = totalSessions === 0 ? 4 : (4 - sessionsInCurrentCycle) % 4 || 4;
  const progressPercent = Math.min(100, Math.max(0, Math.round((sessionsInCurrentCycle / 4) * 100)));

  return {
    ready: totalSessions >= 4,
    currentCheckpoint,
    nextCheckpoint,
    sessionsInCurrentCycle,
    sessionsUntilNext,
    progressPercent,
    teacherName: student.teachers?.[0]?.fullName ?? null,
    className: student.className ?? student.relatedSessions?.[0]?.className ?? null,
    cycleLabelAr: currentCheckpoint > 0 ? `ØªÙ‚Ø±ÙŠØ± Ø­ØªÙ‰ Ø§Ù„Ø­ØµØ© ${currentCheckpoint}` : "Ù‚Ø¨Ù„ Ø£ÙˆÙ„ ØªÙ‚Ø±ÙŠØ± Ø´Ù‡Ø±ÙŠ",
    cycleLabelEn: currentCheckpoint > 0 ? `Report through session ${currentCheckpoint}` : "Before the first monthly report",
  };
}

export function buildStudentMonthlyReportDraft(student: StudentReportSubject): StudentMonthlyReportDraft {
  const snapshot = buildStudentReportSnapshot(student);
  const courseLabelAr = student.currentCourse ? getCourseFormLabel(student.currentCourse, "ar") : "Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø­Ø§Ù„ÙŠ";
  const courseLabelEn = student.currentCourse ? getCourseFormLabel(student.currentCourse, "en") : "current track";
  const teacherName = snapshot.teacherName ?? "Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„Ø­Ø§Ù„ÙŠ";
  const teacherNameEn = snapshot.teacherName ?? "current teacher";
  const className = snapshot.className ?? "Ø§Ù„ÙƒÙ„Ø§Ø³ Ø§Ù„Ø­Ø§Ù„ÙŠ";
  const classNameEn = snapshot.className ?? "current class";

  return {
    summaryAr: `Ø§Ù„Ø·Ø§Ù„Ø¨ Ù…Ø³ØªÙ…Ø± ÙÙŠ ${courseLabelAr} Ø¯Ø§Ø®Ù„ ${className} Ù…Ø¹ ${teacherName}. Ø£Ù†Ø¬Ø² ${student.sessionsAttended} Ø­ØµØ© Ø­ØªÙ‰ Ø§Ù„Ø¢Ù† ÙˆÙ†Ø³Ø¨Ø© Ø§Ù„ØªÙ‚Ø¯Ù… Ø§Ù„Ø­Ø§Ù„ÙŠØ© ${snapshot.progressPercent}%.`,
    summaryEn: `The student is progressing in ${courseLabelEn} within ${classNameEn} with ${teacherNameEn}. ${student.sessionsAttended} sessions are completed so far with ${snapshot.progressPercent}% progress in the current cycle.`,
    strengthsAr: [
      `Ø§Ù„Ø§Ù„ØªØ²Ø§Ù… Ø¨Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØµÙ„ Ø¥Ù„Ù‰ ${student.sessionsAttended} Ø­ØµØ©`,
      snapshot.teacherName ? `ÙŠÙˆØ¬Ø¯ Ù…Ø¯Ø±Ø³ Ù…Ø±ØªØ¨Ø· Ø¨ÙˆØ¶ÙˆØ­: ${teacherName}` : "ØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø¹Ø§Ù… Ù„Ù„Ø·Ø§Ù„Ø¨",
      student.currentCourse ? `Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø­Ø§Ù„ÙŠ Ù…Ø­Ø¯Ø¯: ${courseLabelAr}` : "Ù‡Ù†Ø§Ùƒ Ø­Ø§Ø¬Ø© Ù„ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø± Ø¨Ø¯Ù‚Ø© Ø£ÙƒØ¨Ø±",
    ],
    strengthsEn: [
      `Attendance has reached ${student.sessionsAttended} sessions`,
      snapshot.teacherName ? `A clear teacher link exists: ${teacherNameEn}` : "The general learning path is identified",
      student.currentCourse ? `The current track is defined: ${courseLabelEn}` : "The track still needs sharper definition",
    ],
    focusAreasAr: [
      snapshot.sessionsUntilNext > 0 ? `Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ ${snapshot.sessionsUntilNext} Ø­ØµØµ Ù„Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ù†Ù‚Ø·Ø© Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„ØªØ§Ù„ÙŠØ©` : "Ø¬Ø§Ù‡Ø² Ù„Ù†Ù‚Ø·Ø© Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„ØªØ§Ù„ÙŠØ©",
      snapshot.className ? `Ø§Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ø§Ù„Ø§ØªØ³Ø§Ù‚ Ø¯Ø§Ø®Ù„ ${className}` : "ØªØ«Ø¨ÙŠØª Ø§Ù„ÙƒÙ„Ø§Ø³ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ø·Ø§Ù„Ø¨",
      snapshot.teacherName ? `Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø®Ø·Ø© Ù…Ø¹ ${teacherName}` : "ØªØ¹ÙŠÙŠÙ† Ù…Ø¯Ø±Ø³ Ø£Ø³Ø§Ø³ÙŠ ÙˆÙ…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø®Ø·Ø© Ù…Ø¹Ù‡",
    ],
    focusAreasEn: [
      snapshot.sessionsUntilNext > 0 ? `${snapshot.sessionsUntilNext} sessions remain before the next checkpoint` : "Ready for the next checkpoint",
      snapshot.className ? `Maintain consistency inside ${classNameEn}` : "Stabilize the student inside the right class",
      snapshot.teacherName ? `Continue the plan with ${teacherNameEn}` : "Assign a primary teacher and continue the plan",
    ],
    nextGoalAr: snapshot.sessionsUntilNext > 0 ? `Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø­ØµØ© ${snapshot.nextCheckpoint} Ù„Ø§Ø³ØªØ®Ø±Ø§Ø¬ Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø´Ù‡Ø±ÙŠ Ø§Ù„ØªØ§Ù„ÙŠ.` : "Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø´Ù‡Ø±ÙŠ Ø§Ù„Ø­Ø§Ù„ÙŠ ÙˆØªØ­Ø¯ÙŠØ« Ø§Ù„Ù‡Ø¯Ù Ø§Ù„ØªØ§Ù„ÙŠ.",
    nextGoalEn: snapshot.sessionsUntilNext > 0 ? `Reach session ${snapshot.nextCheckpoint} to unlock the next monthly report.` : "Review the current monthly report and define the next goal.",
  };
}
