"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";
import type { PaymentItem } from "@/types/crm";
import { listPaymentsByStudent } from "@/services/payments.service";

type AttendanceRow = Database["public"]["Tables"]["attendance"]["Row"];
type SessionRow = Database["public"]["Tables"]["sessions"]["Row"];

export interface StudentPaymentSessionsCounter {
  latestPayment: PaymentItem | null;
  startDate: string | null;
  sessionsCovered: number;
  usedSessions: number;
  remainingSessions: number;
  overusedSessions: number;
  status: "no_payment" | "ok" | "near_renewal" | "needs_renewal";
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || typeof window === "undefined") {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}

function toDateKey(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function getPaymentStartDate(payment: PaymentItem): string | null {
  return (
    toDateKey(payment.blockStartDate) ??
    toDateKey(payment.paidAt) ??
    toDateKey(payment.dueDate)
  );
}

function getPaymentSortDate(payment: PaymentItem): string {
  return (
    toDateKey(payment.paidAt) ??
    toDateKey(payment.blockStartDate) ??
    toDateKey(payment.dueDate) ??
    ""
  );
}

function resolveStatus(params: {
  latestPayment: PaymentItem | null;
  sessionsCovered: number;
  usedSessions: number;
  remainingSessions: number;
}): StudentPaymentSessionsCounter["status"] {
  const { latestPayment, sessionsCovered, usedSessions, remainingSessions } = params;

  if (!latestPayment) return "no_payment";
  if (sessionsCovered <= 0) return "needs_renewal";
  if (usedSessions >= sessionsCovered) return "needs_renewal";
  if (remainingSessions <= 1) return "near_renewal";
  return "ok";
}

export async function getStudentPaymentSessionsCounter(
  studentId: string,
): Promise<StudentPaymentSessionsCounter> {
  const payments = await listPaymentsByStudent(studentId);

  const paidPayments = payments
    .filter((payment) => payment.status === "paid" || payment.status === "partial")
    .sort((a, b) => getPaymentSortDate(b).localeCompare(getPaymentSortDate(a)));

  const latestPayment = paidPayments[0] ?? null;
  const startDate = latestPayment ? getPaymentStartDate(latestPayment) : null;
  const sessionsCovered = latestPayment?.sessionsCovered ?? 0;

  if (!latestPayment || !startDate) {
    return {
      latestPayment,
      startDate,
      sessionsCovered,
      usedSessions: 0,
      remainingSessions: sessionsCovered,
      overusedSessions: 0,
      status: "no_payment",
    };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      latestPayment,
      startDate,
      sessionsCovered,
      usedSessions: 0,
      remainingSessions: sessionsCovered,
      overusedSessions: 0,
      status: resolveStatus({
        latestPayment,
        sessionsCovered,
        usedSessions: 0,
        remainingSessions: sessionsCovered,
      }),
    };
  }

  const { data: attendanceRows, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId)
    .in("status", ["present", "late"]);

  if (attendanceError) {
    throw new Error(attendanceError.message || "Failed to load attendance rows.");
  }

  const attendance = (attendanceRows ?? []) as AttendanceRow[];
  const sessionIds = [...new Set(attendance.map((row) => row.session_id).filter(Boolean))];

  if (sessionIds.length === 0) {
    return {
      latestPayment,
      startDate,
      sessionsCovered,
      usedSessions: 0,
      remainingSessions: sessionsCovered,
      overusedSessions: 0,
      status: resolveStatus({
        latestPayment,
        sessionsCovered,
        usedSessions: 0,
        remainingSessions: sessionsCovered,
      }),
    };
  }

  const { data: sessionRows, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .in("id", sessionIds);

  if (sessionError) {
    throw new Error(sessionError.message || "Failed to load sessions.");
  }

  const sessionsById = new Map(
    ((sessionRows ?? []) as SessionRow[]).map((session) => [session.id, session] as const),
  );

  const usedSessions = attendance.filter((row) => {
    const session = sessionsById.get(row.session_id) ?? null;
    const sessionDate = toDateKey(session?.session_date ?? null);

    return Boolean(sessionDate && sessionDate >= startDate);
  }).length;

  const remainingSessions = Math.max(0, sessionsCovered - usedSessions);
  const overusedSessions = Math.max(0, usedSessions - sessionsCovered);

  return {
    latestPayment,
    startDate,
    sessionsCovered,
    usedSessions,
    remainingSessions,
    overusedSessions,
    status: resolveStatus({
      latestPayment,
      sessionsCovered,
      usedSessions,
      remainingSessions,
    }),
  };
}
