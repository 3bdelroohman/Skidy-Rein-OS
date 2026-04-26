"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { StudentStatus } from "@/types/common.types";
import type { Database } from "@/types/database.types";

const VALID_STATUSES: StudentStatus[] = [
  "trial",
  "active",
  "paused",
  "at_risk",
  "completed",
  "churned",
];

export interface UpdateStudentBasicProfileInput {
  studentId: string;
  fullName: string;
  age: number;
  status: StudentStatus;
  enrollmentDate: string;
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || typeof window === "undefined") {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}

function normalizeDate(value: string): string {
  return value.trim().slice(0, 10);
}

export async function updateStudentBasicProfile(
  input: UpdateStudentBasicProfileInput,
): Promise<void> {
  const studentId = input.studentId.trim();
  const fullName = input.fullName.trim();
  const enrollmentDate = normalizeDate(input.enrollmentDate);

  if (!studentId) {
    throw new Error("Student id is required.");
  }

  if (!fullName) {
    throw new Error("اسم الطالب مطلوب.");
  }

  if (!Number.isFinite(input.age) || input.age < 4 || input.age > 18) {
    throw new Error("عمر الطالب يجب أن يكون بين 4 و18 سنة.");
  }

  if (!VALID_STATUSES.includes(input.status)) {
    throw new Error("حالة الطالب غير صحيحة.");
  }

  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(enrollmentDate)) {
    throw new Error("تاريخ الالتحاق غير صحيح.");
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("تعذر الاتصال بقاعدة البيانات.");
  }

  const { error } = await supabase
    .from("students")
    .update({
      full_name: fullName,
      age: input.age,
      status: input.status,
      enrollment_date: enrollmentDate,
    })
    .eq("id", studentId);

  if (error) {
    throw new Error(error.message || "تعذر تحديث بيانات الطالب.");
  }
}
