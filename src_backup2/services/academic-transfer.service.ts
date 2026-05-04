"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";
import type { CourseType } from "@/types/crm";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || typeof window === "undefined") {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}

type SupabaseBrowserClient = NonNullable<ReturnType<typeof getSupabaseClient>>;

async function syncGroupStudentCount(
  supabase: SupabaseBrowserClient,
  groupId: string,
): Promise<void> {
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

export interface TransferStudentInput {
  studentId: string;
  targetGroupId: string;
}

export interface TransferStudentResult {
  studentId: string;
  targetGroupId: string;
  targetCourse: CourseType;
  previousGroupIds: string[];
}

export async function transferStudentToGroup(
  input: TransferStudentInput,
): Promise<TransferStudentResult> {
  const studentId = input.studentId.trim();
  const targetGroupId = input.targetGroupId.trim();

  if (!studentId) {
    throw new Error("Student id is required.");
  }

  if (!targetGroupId) {
    throw new Error("Target group is required.");
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase client is not available in the current browser session.");
  }

  const { data: targetGroup, error: targetError } = await supabase
    .from("classes")
    .select("id, course_id, is_active")
    .eq("id", targetGroupId)
    .maybeSingle();

  if (targetError || !targetGroup) {
    throw new Error(targetError?.message || "Target group was not found.");
  }

  if (targetGroup.is_active === false) {
    throw new Error("Cannot transfer the student to an inactive group.");
  }

  const { data: courseRow, error: courseError } = await supabase
    .from("courses")
    .select("type")
    .eq("id", targetGroup.course_id)
    .maybeSingle();

  if (courseError || !courseRow?.type) {
    throw new Error(courseError?.message || "Could not resolve target group course.");
  }

  const targetCourse = courseRow.type as CourseType;

  const { data: activeEnrollments, error: activeError } = await supabase
    .from("class_enrollments")
    .select("class_id")
    .eq("student_id", studentId)
    .eq("is_active", true);

  if (activeError) {
    throw new Error(activeError.message || "Failed to load current student enrollments.");
  }

  const previousGroupIds = [
    ...new Set(
      (activeEnrollments ?? [])
        .map((row) => row.class_id)
        .filter((classId): classId is string => Boolean(classId)),
    ),
  ];

  const alreadyInTarget = previousGroupIds.includes(targetGroupId);
  const groupsToDeactivate = previousGroupIds.filter((groupId) => groupId !== targetGroupId);

  if (groupsToDeactivate.length > 0) {
    const { error: deactivateError } = await supabase
      .from("class_enrollments")
      .update({
        is_active: false,
        dropped_at: new Date().toISOString(),
      })
      .eq("student_id", studentId)
      .eq("is_active", true)
      .in("class_id", groupsToDeactivate);

    if (deactivateError) {
      throw new Error(deactivateError.message || "Failed to deactivate old enrollments.");
    }
  }

  if (!alreadyInTarget) {
    const { error: insertError } = await supabase
      .from("class_enrollments")
      .insert({
        student_id: studentId,
        class_id: targetGroupId,
        is_active: true,
        enrolled_at: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error(insertError.message || "Failed to create the new enrollment.");
    }
  }

  const { error: updateStudentError } = await supabase
    .from("students")
    .update({
      current_class_id: targetGroupId,
      current_course: targetCourse,
    })
    .eq("id", studentId);

  if (updateStudentError) {
    throw new Error(updateStudentError.message || "Failed to update student academic status.");
  }

  await Promise.all(
    [...new Set([...previousGroupIds, targetGroupId])].map((groupId) =>
      syncGroupStudentCount(supabase, groupId),
    ),
  );

  return {
    studentId,
    targetGroupId,
    targetCourse,
    previousGroupIds,
  };
}
