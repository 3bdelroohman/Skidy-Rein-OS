"use client";

import { listGroups } from "@/services/group-operations.service";
import { listPayments } from "@/services/payments.service";
import { listStudentsWithRelations } from "@/services/relations.service";
import type { GroupListItem, PaymentItem, StudentListItem } from "@/types/crm";

export type OperationsHandoffStatus =
  | "paid_without_group"
  | "paid_without_active_group"
  | "needs_first_session_check"
  | "ready";

export interface OperationsHandoffItem {
  student: StudentListItem;
  latestPayment: PaymentItem;
  status: OperationsHandoffStatus;
  studentHref: string;
  groupsHref: string;
  paymentHref: string;
  parentLabel: string;
  courseLabel: string;
  currentGroupName: string | null;
  suggestedGroups: GroupListItem[];
}

export interface OperationsCenterMetric {
  key: OperationsHandoffStatus | "total";
  labelAr: string;
  labelEn: string;
  value: number;
  tone: "brand" | "success" | "warning" | "danger" | "info";
}

export interface OperationsCenterData {
  metrics: OperationsCenterMetric[];
  paidWithoutGroup: OperationsHandoffItem[];
  paidWithoutActiveGroup: OperationsHandoffItem[];
  needsFirstSessionCheck: OperationsHandoffItem[];
  ready: OperationsHandoffItem[];
  all: OperationsHandoffItem[];
}

function isProjectedStudent(id: string): boolean {
  return id.startsWith("lead-projection-student:");
}

function getPaymentSortDate(payment: PaymentItem): string {
  return payment.paidAt?.slice(0, 10) ?? payment.blockStartDate?.slice(0, 10) ?? payment.dueDate?.slice(0, 10) ?? "";
}

function getLatestPaidPayment(payments: PaymentItem[]): PaymentItem | null {
  const paid = payments
    .filter((payment) => payment.status === "paid" || payment.status === "partial")
    .sort((a, b) => getPaymentSortDate(b).localeCompare(getPaymentSortDate(a)));

  return paid[0] ?? null;
}

function resolveStatus(student: StudentListItem, activeGroups: GroupListItem[]): OperationsHandoffStatus {
  const hasVisibleGroup = Boolean(student.className && student.className.trim().length > 0);
  const matchingActiveGroup = student.currentCourse
    ? activeGroups.find((group) => group.course === student.currentCourse && group.isActive)
    : null;

  if (!hasVisibleGroup) return "paid_without_group";
  if (!matchingActiveGroup) return "paid_without_active_group";
  if (student.sessionsAttended <= 0) return "needs_first_session_check";
  return "ready";
}

function sortByOperationsUrgency(items: OperationsHandoffItem[]): OperationsHandoffItem[] {
  const rank: Record<OperationsHandoffStatus, number> = {
    paid_without_group: 0,
    paid_without_active_group: 1,
    needs_first_session_check: 2,
    ready: 3,
  };

  return [...items].sort((a, b) => {
    const byRank = rank[a.status] - rank[b.status];
    if (byRank !== 0) return byRank;
    return a.student.fullName.localeCompare(b.student.fullName);
  });
}

export async function getOperationsCenterData(): Promise<OperationsCenterData> {
  const [students, payments, groups] = await Promise.all([
    listStudentsWithRelations(),
    listPayments(),
    listGroups(),
  ]);

  const realStudents = students.filter((student) => !isProjectedStudent(student.id));
  const activeGroups = groups.filter((group) => group.isActive);

  const paymentsByStudent = new Map<string, PaymentItem[]>();
  for (const payment of payments) {
    if (!payment.studentId) continue;
    const current = paymentsByStudent.get(payment.studentId) ?? [];
    current.push(payment);
    paymentsByStudent.set(payment.studentId, current);
  }

  const items: OperationsHandoffItem[] = [];

  for (const student of realStudents) {
    const latestPayment = getLatestPaidPayment(paymentsByStudent.get(student.id) ?? []);
    if (!latestPayment) continue;

    const status = resolveStatus(student, activeGroups);
    const suggestedGroups = student.currentCourse
      ? activeGroups
          .filter((group) => group.course === student.currentCourse)
          .sort((a, b) => a.studentsCount - b.studentsCount || a.name.localeCompare(b.name))
      : [];

    items.push({
      student,
      latestPayment,
      status,
      studentHref: "/students/" + student.id,
      groupsHref: student.currentCourse ? "/groups?course=" + student.currentCourse : "/groups",
      paymentHref: "/payments/" + latestPayment.id,
      parentLabel: student.parentName + " — " + student.parentPhone,
      courseLabel: student.currentCourse ?? "—",
      currentGroupName: student.className,
      suggestedGroups: suggestedGroups.slice(0, 3),
    });
  }

  const all = sortByOperationsUrgency(items);
  const paidWithoutGroup = all.filter((item) => item.status === "paid_without_group");
  const paidWithoutActiveGroup = all.filter((item) => item.status === "paid_without_active_group");
  const needsFirstSessionCheck = all.filter((item) => item.status === "needs_first_session_check");
  const ready = all.filter((item) => item.status === "ready");

  const metrics: OperationsCenterMetric[] = [
    { key: "total", labelAr: "طلاب مدفوعين", labelEn: "Paid students", value: all.length, tone: "brand" },
    { key: "paid_without_group", labelAr: "دفعوا بلا جروب", labelEn: "Paid without group", value: paidWithoutGroup.length, tone: "danger" },
    { key: "paid_without_active_group", labelAr: "بلا جروب نشط مطابق", labelEn: "No matching active group", value: paidWithoutActiveGroup.length, tone: "warning" },
    { key: "needs_first_session_check", labelAr: "يحتاج تأكيد أول حصة", labelEn: "Needs first-session check", value: needsFirstSessionCheck.length, tone: "info" },
    { key: "ready", labelAr: "تشغيل مستقر", labelEn: "Operationally ready", value: ready.length, tone: "success" },
  ];

  return { metrics, paidWithoutGroup, paidWithoutActiveGroup, needsFirstSessionCheck, ready, all };
}
