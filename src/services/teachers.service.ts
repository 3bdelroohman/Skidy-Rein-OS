import { createBrowserClient } from "@supabase/ssr";
import type { CourseType, EmploymentType } from "@/types/common.types";
import type { CreateTeacherInput, TeacherListItem } from "@/types/crm";
import type { Database } from "@/types/database.types";
import { MOCK_TEACHERS } from "@/lib/mock-data";
import { isBrowser, readStorage, writeStorage } from "@/services/storage";

const TEACHERS_KEY = "skidy.crm.teachers";
const ALLOW_DEMO = process.env.NEXT_PUBLIC_ALLOW_DEMO_FALLBACK === "true";
const VALID_EMPLOYMENTS: EmploymentType[] = ["full_time", "part_time", "freelance"];
const VALID_COURSES: CourseType[] = ["scratch", "app_inventor", "robotics_basic", "ai_intro", "python", "godot", "robotics_iot", "fastapi", "html_css", "javascript_tailwind", "front_end", "ai_ml", "data_science", "back_end", "raspberry_pi", "web", "ai"];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isBrowser()) return null;
  return createBrowserClient<Database>(url, key);
}

function sortTeachers(items: TeacherListItem[]): TeacherListItem[] {
  return [...items].sort((a, b) => a.fullName.localeCompare(b.fullName, "ar"));
}

function mockTeachers(): TeacherListItem[] {
  return MOCK_TEACHERS.map((teacher) => ({ ...teacher }));
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}


function asEmployment(value: unknown): EmploymentType {
  return VALID_EMPLOYMENTS.includes(value as EmploymentType) ? (value as EmploymentType) : "part_time";
}

function asSpecialization(value: unknown, fallback: CourseType[] = []): CourseType[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is CourseType => VALID_COURSES.includes(item as CourseType));
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item): item is CourseType => VALID_COURSES.includes(item as CourseType));
  }
  return fallback;
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[?-?]/g, "").replace(/\s+/g, " ").trim();
}

function normalizePhone(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length > 11) return digits.slice(2);
  if (digits.startsWith("2") && digits.length === 12) return digits.slice(1);
  return digits;
}

function mapRow(row: Record<string, unknown>): TeacherListItem {
  return {
    id: asString(row.id, crypto.randomUUID()),
    fullName: asString(row.full_name ?? row.fullName, "مدرس غير محدد"),
    phone: asString(row.phone, "—"),
    email: asString(row.email, "") || null,
    specialization: asSpecialization(row.specialization, []),
    employment: asEmployment(row.employment),
    classesCount: 0,
    studentsCount: 0,
    isActive: Boolean(row.is_active ?? row.isActive ?? true),
  };
}

function getLocalTeachers(): TeacherListItem[] {
  return sortTeachers(
    readStorage(TEACHERS_KEY, ALLOW_DEMO ? mockTeachers() : ([] as TeacherListItem[])),
  );
}

function saveLocalTeachers(items: TeacherListItem[]): void {
  writeStorage(TEACHERS_KEY, sortTeachers(items));
}

function clearLocalTeachers(): void {
  writeStorage(TEACHERS_KEY, []);
}

export async function listTeachers(): Promise<TeacherListItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return ALLOW_DEMO ? getLocalTeachers() : [];
  }

  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[teachers] failed to load from Supabase", error);
      clearLocalTeachers();
      return ALLOW_DEMO ? mockTeachers() : [];
    }

    if (!data || data.length === 0) {
      clearLocalTeachers();
      return ALLOW_DEMO ? mockTeachers() : [];
    }

    const mapped = data.map((row) => mapRow(row as Record<string, unknown>));
    saveLocalTeachers(mapped);
    return mapped;
  } catch (error) {
    console.error("[teachers] unexpected load failure", error);
    clearLocalTeachers();
    return ALLOW_DEMO ? mockTeachers() : [];
  }
}

export async function getTeacherById(id: string): Promise<TeacherListItem | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return ALLOW_DEMO ? getLocalTeachers().find((teacher) => teacher.id === id) ?? null : null;
  }

  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    const mapped = mapRow(data as Record<string, unknown>);
    saveLocalTeachers([mapped, ...getLocalTeachers().filter((teacher) => teacher.id !== mapped.id)]);
    return mapped;
  } catch (error) {
    console.error("[teachers] failed to load teacher by id", error);
    return null;
  }
}

export async function createTeacher(input: CreateTeacherInput): Promise<TeacherListItem> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("تعذر الاتصال بقاعدة البيانات. أعد المحاولة بعد تسجيل الدخول أو التحقق من الإعدادات.");
  }

  const existing = await listTeachers();
  const duplicate = existing.find((teacher) => {
    const samePhone = normalizePhone(teacher.phone) === normalizePhone(input.phone);
    const inputEmail = (input.email ?? "").trim().toLowerCase();
    const teacherEmail = (teacher.email ?? "").trim().toLowerCase();
    const sameEmail = teacherEmail.length > 0 && inputEmail.length > 0 && teacherEmail === inputEmail;
    const sameName = normalizeName(teacher.fullName) === normalizeName(input.fullName);
    return samePhone || sameEmail || (sameName && samePhone);
  });

  if (duplicate) {
    throw new Error("يوجد مدرس مسجل بالفعل بنفس الاسم أو الهاتف أو البريد الإلكتروني.");
  }

  const payload: Database["public"]["Tables"]["teachers"]["Insert"] = {
    full_name: input.fullName,
    phone: input.phone,
    email: input.email?.trim() || null,
    employment: input.employment,
    specialization: input.specialization,
    is_active: input.isActive ?? true,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("teachers").insert(payload).select("*").single();
  if (error || !data) {
    throw new Error(error?.message || "تعذر إنشاء سجل المدرس");
  }

  const created = mapRow(data as Record<string, unknown>);
  saveLocalTeachers([created, ...getLocalTeachers().filter((teacher) => teacher.id !== created.id)]);
  return created;
}



export async function deleteTeacher(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("???? ??????? ?????? ????????.");
  }

  // Check for linked classes first
  const { data: linkedClasses } = await supabase
    .from("classes")
    .select("id")
    .eq("teacher_id", id)
    .eq("is_active", true)
    .limit(1);

  if (linkedClasses && linkedClasses.length > 0) {
    throw new Error("?? ???? ??? ?????? ??? ???? ???? ????. ???? ?????? ?????.");
  }

  // Verify teacher exists before delete
  const { data: before } = await supabase
    .from("teachers")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (!before) {
    // Teacher only in local/demo data - remove locally
    saveLocalTeachers(getLocalTeachers().filter((t) => t.id !== id));
    return true;
  }

  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "???? ??? ??????.");
  }

  // Verify deletion actually happened
  const { data: after } = await supabase
    .from("teachers")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (after) {
    throw new Error("??? ?????: ?????? ?? ???? ???????. ???? ?? ??????? RLS.");
  }

  saveLocalTeachers(getLocalTeachers().filter((teacher) => teacher.id !== id));
  return true;
}
