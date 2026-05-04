"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { CourseType } from "@/types/common.types";
import type { Database } from "@/types/database.types";

const VALID_COURSES: CourseType[] = [
  "scratch",
  "app_inventor",
  "robotics_basic",
  "ai_intro",
  "python",
  "godot",
  "robotics_iot",
  "fastapi",
  "html_css",
  "javascript_tailwind",
  "front_end",
  "ai_ml",
  "data_science",
  "back_end",
  "raspberry_pi",
  "web",
  "ai",
];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || typeof window === "undefined") {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}

export async function updateTeacherSpecialization(
  teacherId: string,
  specialization: CourseType[],
): Promise<void> {
  const cleanSpecialization = [
    ...new Set(
      specialization.filter((course): course is CourseType =>
        VALID_COURSES.includes(course as CourseType),
      ),
    ),
  ];

  if (!teacherId.trim()) {
    throw new Error("Teacher id is required.");
  }

  if (cleanSpecialization.length === 0) {
    throw new Error("اختر تخصصًا واحدًا على الأقل.");
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("تعذر الاتصال بقاعدة البيانات.");
  }

  const { error } = await supabase
    .from("teachers")
    .update({ specialization: cleanSpecialization })
    .eq("id", teacherId);

  if (error) {
    throw new Error(error.message || "تعذر تحديث تخصصات المدرس.");
  }
}
