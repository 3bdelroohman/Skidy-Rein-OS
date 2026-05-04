import type { StudentDetails } from "@/types/crm";
import { getCourseTrackMeta } from "@/config/course-roadmap";
import { buildStudentReportSnapshot } from "@/services/student-report.service";

export interface StudentJourneyMilestone {
  id: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
  tone: "brand" | "success" | "warning" | "info";
}

export interface StudentJourneySummary {
  stageAr: string;
  stageEn: string;
  reportReady: boolean;
  milestones: StudentJourneyMilestone[];
}

export function buildStudentJourney(student: StudentDetails): StudentJourneySummary {
  const report = buildStudentReportSnapshot(student);
  const trackMeta = getCourseTrackMeta(student.currentCourse);

  const milestones: StudentJourneyMilestone[] = [
    {
      id: "enrollment",
      titleAr: "Ø¨Ø¯Ø§ÙŠØ© Ø§Ù„Ø±Ø­Ù„Ø©",
      titleEn: "Journey started",
      detailAr: `Ø§Ù„ØªØ­Ù‚ Ø¨ØªØ§Ø±ÙŠØ® ${student.enrollmentDate}`,
      detailEn: `Joined on ${student.enrollmentDate}`,
      tone: "brand",
    },
    {
      id: "class",
      titleAr: "Ø§Ù„ÙƒÙ„Ø§Ø³ Ø§Ù„Ø­Ø§Ù„ÙŠ",
      titleEn: "Current class",
      detailAr: report.className ? `Ø§Ù„Ø·Ø§Ù„Ø¨ Ù…Ø±ØªØ¨Ø· Ø§Ù„Ø¢Ù† Ø¨Ù€ ${report.className}` : "Ù„Ù… ÙŠØªÙ… Ø±Ø¨Ø· ÙƒÙ„Ø§Ø³ Ø¨Ø¹Ø¯",
      detailEn: report.className ? `Currently linked to ${report.className}` : "No class linked yet",
      tone: report.className ? "info" : "warning",
    },
    {
      id: "course",
      titleAr: "Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø­Ø§Ù„ÙŠ",
      titleEn: "Current track",
      detailAr: trackMeta ? `ÙŠØ¹Ù…Ù„ Ø§Ù„Ø¢Ù† Ø¯Ø§Ø®Ù„ ${trackMeta.labelAr}` : (student.currentCourse ? `ÙŠØ¹Ù…Ù„ Ø§Ù„Ø¢Ù† Ø¯Ø§Ø®Ù„ Ù…Ø³Ø§Ø± ${student.currentCourse}` : "Ù„Ù… ÙŠØªÙ… ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø³Ø§Ø± Ø¨Ø¹Ø¯"),
      detailEn: trackMeta ? `Currently progressing in ${trackMeta.labelEn}` : (student.currentCourse ? `Currently progressing in ${student.currentCourse}` : "No track assigned yet"),
      tone: student.currentCourse ? "info" : "warning",
    },
    {
      id: "teacher",
      titleAr: "Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„Ù…Ø±ØªØ¨Ø·",
      titleEn: "Assigned teacher",
      detailAr: report.teacherName ? `Ø§Ù„Ù…Ø¯Ø±Ø³ Ø§Ù„Ø­Ø§Ù„ÙŠ: ${report.teacherName}` : "Ù„Ù… ÙŠØªÙ… Ø±Ø¨Ø· Ù…Ø¯Ø±Ø³ Ø¨Ø¹Ø¯",
      detailEn: report.teacherName ? `Current teacher: ${report.teacherName}` : "No teacher linked yet",
      tone: report.teacherName ? "success" : "warning",
    },
    {
      id: "sessions",
      titleAr: "Ø§Ù„Ø¥Ù†Ø¬Ø§Ø² Ø¯Ø§Ø®Ù„ Ø§Ù„Ø­ØµØµ",
      titleEn: "Session progress",
      detailAr: `Ø£Ù†Ø¬Ø² ${student.sessionsAttended} Ø­ØµØ© Ø­ØªÙ‰ Ø§Ù„Ø¢Ù† â€” ${report.cycleLabelAr}`,
      detailEn: `Completed ${student.sessionsAttended} sessions so far â€” ${report.cycleLabelEn}`,
      tone: student.sessionsAttended >= 4 ? "success" : "info",
    },
    {
      id: "report",
      titleAr: "Ù†Ù‚Ø·Ø© Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©",
      titleEn: "Next report checkpoint",
      detailAr: report.ready
        ? `Ø¢Ø®Ø± Ù†Ù‚Ø·Ø© ØªÙ‚Ø±ÙŠØ± Ù…ÙƒØªÙ…Ù„Ø© Ø¹Ù†Ø¯ ${report.currentCheckpoint} Ø­ØµØµØŒ ÙˆØ§Ù„Ù†Ù‚Ø·Ø© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© Ø¹Ù†Ø¯ ${report.nextCheckpoint}`
        : `Ø£ÙˆÙ„ ØªÙ‚Ø±ÙŠØ± ÙŠØµØ¨Ø­ Ø¬Ø§Ù‡Ø²Ù‹Ø§ Ø¨Ø¹Ø¯ ${report.sessionsUntilNext} Ø­ØµØµ Ø¥Ø¶Ø§ÙÙŠØ©`,
      detailEn: report.ready
        ? `Last completed checkpoint at ${report.currentCheckpoint} sessions, next one at ${report.nextCheckpoint}`
        : `First report becomes ready after ${report.sessionsUntilNext} more sessions`,
      tone: report.ready ? "success" : "info",
    },
    {
      id: "payments",
      titleAr: "Ø§Ù„Ø§Ù„ØªØ²Ø§Ù… Ø§Ù„Ù…Ø§Ù„ÙŠ",
      titleEn: "Payment progress",
      detailAr: `Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¯ÙÙˆØ¹ ${student.totalPaid} Ø¬Ù†ÙŠÙ‡`,
      detailEn: `Total paid ${student.totalPaid} EGP`,
      tone: student.totalPaid > 0 ? "success" : "warning",
    },
  ];

  const reportReady = student.sessionsAttended >= 4;
  const stageAr = reportReady ? "Ø¬Ø§Ù‡Ø² Ù„Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø­Ø§Ù„ÙŠ" : "Ù…Ø§ Ø²Ø§Ù„ Ù‚Ø¨Ù„ Ø£ÙˆÙ„ Ù†Ù‚Ø·Ø© ØªÙ‚Ø±ÙŠØ±";
  const stageEn = reportReady ? "Ready for the current report checkpoint" : "Still before the first report checkpoint";

  return { stageAr, stageEn, reportReady, milestones };
}
