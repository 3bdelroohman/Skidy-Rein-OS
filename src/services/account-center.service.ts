"use client";

import { listStudentsWithRelations } from "@/services/relations.service";
import { getStudentPaymentSessionsCounter } from "@/services/student-payment-sessions.service";
import type { PaymentItem, StudentListItem } from "@/types/crm";

export type AccountCenterStatus =
  | "no_payment"
  | "ok"
  | "near_renewal"
  | "needs_renewal"
  | "overused"
  | "pending_handoff";

export interface AccountCenterStudentItem {
  student: StudentListItem;
  latestPayment: PaymentItem | null;
  startDate: string | null;
  sessionsCovered: number;
  usedSessions: number;
  remainingSessions: number;
  overusedSessions: number;
  status: AccountCenterStatus;
  needsOperationsHandoff: boolean;
  paymentHref: string | null;
  studentHref: string;
  parentLabel: string;
  nextCollectionDueDate: string | null;
  collectionStatus: string | null;
  collectionNotes: string | null;
}

export interface AccountCenterMetric {
  key: AccountCenterStatus | "total";
  labelAr: string;
  labelEn: string;
  value: number;
  tone: "brand" | "success" | "warning" | "danger" | "info";
}

export interface AccountCenterData {
  metrics: AccountCenterMetric[];
  noPayment: AccountCenterStudentItem[];
  nearRenewal: AccountCenterStudentItem[];
  needsRenewal: AccountCenterStudentItem[];
  overused: AccountCenterStudentItem[];
  pendingHandoff: AccountCenterStudentItem[];
  healthy: AccountCenterStudentItem[];
  all: AccountCenterStudentItem[];
}

function isProjectedStudent(id: string): boolean {
  return id.startsWith("lead-projection-student:");
}

function resolveAccountStatus(params: {
  latestPayment: PaymentItem | null;
  remainingSessions: number;
  overusedSessions: number;
  needsOperationsHandoff: boolean;
}): AccountCenterStatus {
  const { latestPayment, remainingSessions, overusedSessions, needsOperationsHandoff } = params;

  if (!latestPayment) return "no_payment";
  if (needsOperationsHandoff) return "pending_handoff";
  if (overusedSessions > 0) return "overused";
  if (remainingSessions <= 0) return "needs_renewal";
  if (remainingSessions <= 2) return "near_renewal";
  return "ok";
}

function sortByUrgency(items: AccountCenterStudentItem[]): AccountCenterStudentItem[] {
  const rank: Record<AccountCenterStatus, number> = {
    overused: 0,
    needs_renewal: 1,
    near_renewal: 2,
    no_payment: 3,
    pending_handoff: 4,
    ok: 5,
  };

  return [...items].sort((a, b) => {
    const byRank = rank[a.status] - rank[b.status];
    if (byRank !== 0) return byRank;
    return a.student.fullName.localeCompare(b.student.fullName);
  });
}

export async function getAccountCenterData(): Promise<AccountCenterData> {
  const students = (await listStudentsWithRelations()).filter((student) => !isProjectedStudent(student.id));

  const rows = await Promise.all(
    students.map(async (student): Promise<AccountCenterStudentItem> => {
      const counter = await getStudentPaymentSessionsCounter(student.id);
      const hasActiveGroup = Boolean(student.className && student.className.trim().length > 0);
      const hasPaidPackage = Boolean(counter.latestPayment);
      const needsOperationsHandoff = hasPaidPackage && !hasActiveGroup;

      const status = resolveAccountStatus({
        latestPayment: counter.latestPayment,
        remainingSessions: counter.remainingSessions,
        overusedSessions: counter.overusedSessions,
        needsOperationsHandoff,
      });

      return {
        student,
        latestPayment: counter.latestPayment,
        startDate: counter.startDate,
        sessionsCovered: counter.sessionsCovered,
        usedSessions: counter.usedSessions,
        remainingSessions: counter.remainingSessions,        overusedSessions: counter.overusedSessions,
        nextCollectionDueDate: counter.latestPayment?.nextCollectionDueDate ?? null,
        collectionStatus: counter.latestPayment?.collectionStatus ?? null,
        collectionNotes: counter.latestPayment?.collectionNotes ?? null,
        status,
        needsOperationsHandoff,
        paymentHref: counter.latestPayment ? "/payments/" + counter.latestPayment.id : null,
        studentHref: "/students/" + student.id,
        parentLabel: student.parentName + " — " + student.parentPhone,
      };
    }),
  );

  const all = sortByUrgency(rows);
  const noPayment = all.filter((item) => item.status === "no_payment");
  const nearRenewal = all.filter((item) => item.status === "near_renewal");
  const needsRenewal = all.filter((item) => item.status === "needs_renewal");
  const overused = all.filter((item) => item.status === "overused");
  const pendingHandoff = all.filter((item) => item.status === "pending_handoff");
  const healthy = all.filter((item) => item.status === "ok");

  const metrics: AccountCenterMetric[] = [
    { key: "total", labelAr: "إجمالي الطلاب", labelEn: "Total students", value: all.length, tone: "brand" },
    { key: "near_renewal", labelAr: "قرب التجديد", labelEn: "Near renewal", value: nearRenewal.length, tone: "warning" },
    { key: "needs_renewal", labelAr: "يحتاج تجديد", labelEn: "Needs renewal", value: needsRenewal.length, tone: "danger" },
    { key: "overused", labelAr: "استخدام زائد", labelEn: "Overused", value: overused.length, tone: "danger" },
    { key: "pending_handoff", labelAr: "تسليم للأوبريشن", labelEn: "Pending ops handoff", value: pendingHandoff.length, tone: "info" },
    { key: "no_payment", labelAr: "بلا دفعة", labelEn: "No payment", value: noPayment.length, tone: "warning" },
  ];

  return { metrics, noPayment, nearRenewal, needsRenewal, overused, pendingHandoff, healthy, all };
}
