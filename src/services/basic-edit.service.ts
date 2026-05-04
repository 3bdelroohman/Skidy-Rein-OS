"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { EmploymentType, PaymentMethod, PaymentStatus } from "@/types/common.types";
import type { Database } from "@/types/database.types";
import { getPaymentById } from "@/services/payments.service";

const VALID_EMPLOYMENTS: EmploymentType[] = ["full_time", "part_time", "freelance"];
const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["paid", "pending", "overdue", "refunded", "partial"];
const VALID_PAYMENT_METHODS: PaymentMethod[] = ["bank_transfer", "card", "wallet", "cash", "instapay"];
const PAYMENT_META_PREFIX = "__SKIDY_PAYMENT_META__:";
const DEFAULT_SESSION_BLOCK = 8;

interface PaymentMeta {
  sessionsCovered?: number;
  blockStartDate?: string | null;
  blockEndDate?: string | null;
  deferredUntil?: string | null;
  invoiceNumber?: string | null;
  invoiceIssuedAt?: string | null;
  publicNote?: string | null;
  archivedAt?: string | null;
  archivedBy?: string | null;
}

export interface UpdateTeacherBasicInput {
  teacherId: string;
  fullName: string;
  phone: string;
  email: string | null;
  employment: EmploymentType;
  isActive: boolean;
}

export interface UpdateParentBasicInput {
  parentId: string;
  fullName: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
}

export interface UpdatePaymentBasicInput {
  paymentId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod | null;
  dueDate: string;
  paidAt: string | null;
  sessionsCovered: number;
  blockStartDate: string | null;
  blockEndDate: string | null;
  deferredUntil: string | null;
  publicNote: string | null;
}

export interface UpdateGroupBasicInput {
  groupId: string;
  name: string;
  startDate: string;
  notes: string | null;
  isActive: boolean;
  teacherSessionDurationMinutes: number | null;
  teacherSessionRate: number | null;
  teacherFinanceNotes: string | null;
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || typeof window === "undefined") {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}

function assertSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("تعذر الاتصال بقاعدة البيانات.");
  }
  return supabase;
}

function normalizeDate(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 10);
}

function requiredDate(value: string, label: string): string {
  const normalized = normalizeDate(value);
  if (!normalized || !/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error(label + " غير صحيح.");
  }
  return normalized;
}

function nullableText(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function nullableNumber(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) return null;
  return value;
}

function normalizeSessionBlock(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_SESSION_BLOCK;
  return Math.max(DEFAULT_SESSION_BLOCK, Math.ceil(value / DEFAULT_SESSION_BLOCK) * DEFAULT_SESSION_BLOCK);
}

function parsePaymentMeta(raw: string | null | undefined): { publicNote: string | null; meta: PaymentMeta } {
  const value = typeof raw === "string" ? raw : "";

  if (!value.startsWith(PAYMENT_META_PREFIX)) {
    return { publicNote: value || null, meta: {} };
  }

  const [header, ...rest] = value.split("\n");
  let meta: PaymentMeta = {};

  try {
    meta = JSON.parse(header.slice(PAYMENT_META_PREFIX.length)) as PaymentMeta;
  } catch {
    meta = {};
  }

  const publicNote = rest.join("\n").trim();

  return {
    publicNote: publicNote || meta.publicNote || null,
    meta,
  };
}

function buildPaymentNotes(publicNote: string | null | undefined, meta: PaymentMeta): string {
  const compactMeta: PaymentMeta = {
    sessionsCovered: normalizeSessionBlock(meta.sessionsCovered ?? DEFAULT_SESSION_BLOCK),
    blockStartDate: meta.blockStartDate ?? null,
    blockEndDate: meta.blockEndDate ?? null,
    deferredUntil: meta.deferredUntil ?? null,
    invoiceNumber: meta.invoiceNumber ?? null,
    invoiceIssuedAt: meta.invoiceIssuedAt ?? null,
    publicNote: publicNote?.trim() ? publicNote.trim() : null,
    archivedAt: meta.archivedAt ?? null,
    archivedBy: meta.archivedBy ?? null,
  };

  const parts = [PAYMENT_META_PREFIX + JSON.stringify(compactMeta)];
  if (publicNote?.trim()) parts.push(publicNote.trim());
  return parts.join("\n");
}

export async function updateTeacherBasic(input: UpdateTeacherBasicInput): Promise<void> {
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();

  if (!input.teacherId.trim()) throw new Error("Teacher id is required.");
  if (!fullName) throw new Error("اسم المدرس مطلوب.");
  if (!phone) throw new Error("رقم الهاتف مطلوب.");
  if (!VALID_EMPLOYMENTS.includes(input.employment)) throw new Error("نوع التوظيف غير صحيح.");

  const supabase = assertSupabase();

  const { error } = await supabase
    .from("teachers")
    .update({
      full_name: fullName,
      phone,
      email: nullableText(input.email),
      employment: input.employment,
      is_active: input.isActive,
    })
    .eq("id", input.teacherId);

  if (error) throw new Error(error.message || "تعذر تحديث بيانات المدرس.");
}

export async function updateParentBasic(input: UpdateParentBasicInput): Promise<void> {
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();

  if (!input.parentId.trim()) throw new Error("Parent id is required.");
  if (!fullName) throw new Error("اسم ولي الأمر مطلوب.");
  if (!phone) throw new Error("رقم الهاتف مطلوب.");

  const supabase = assertSupabase();

  const { error } = await supabase
    .from("parents")
    .update({
      full_name: fullName,
      phone,
      whatsapp: nullableText(input.whatsapp) ?? phone,
      email: nullableText(input.email),
      city: nullableText(input.city),
    })
    .eq("id", input.parentId);

  if (error) throw new Error(error.message || "تعذر تحديث بيانات ولي الأمر.");
}

export async function updatePaymentBasic(input: UpdatePaymentBasicInput): Promise<void> {
  if (!input.paymentId.trim()) throw new Error("Payment id is required.");
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("المبلغ يجب أن يكون أكبر من صفر.");
  if (!VALID_PAYMENT_STATUSES.includes(input.status)) throw new Error("حالة الدفع غير صحيحة.");
  if (input.method && !VALID_PAYMENT_METHODS.includes(input.method)) throw new Error("طريقة الدفع غير صحيحة.");

  const dueDate = requiredDate(input.dueDate, "تاريخ الاستحقاق");
  const paidAt = normalizeDate(input.paidAt);
  const blockStartDate = normalizeDate(input.blockStartDate);
  const blockEndDate = normalizeDate(input.blockEndDate);
  const deferredUntil = normalizeDate(input.deferredUntil);

  if (blockStartDate && blockEndDate && blockEndDate < blockStartDate) {
    throw new Error("نهاية الباقة لا يمكن أن تكون قبل بدايتها.");
  }

  if (deferredUntil && deferredUntil < dueDate) {
    throw new Error("تاريخ التأجيل لا يمكن أن يكون قبل تاريخ الاستحقاق.");
  }

  const current = await getPaymentById(input.paymentId, { includeArchived: true });
  if (!current) throw new Error("الدفعة غير موجودة.");

  const { meta } = parsePaymentMeta(current.notes);
  const notes = buildPaymentNotes(input.publicNote, {
    ...meta,
    sessionsCovered: input.sessionsCovered,
    blockStartDate,
    blockEndDate,
    deferredUntil,
  });

  const supabase = assertSupabase();

  const { error } = await supabase
    .from("payments")
    .update({
      amount: input.amount,
      status: input.status,
      method: input.method,
      due_date: dueDate,
      paid_at: paidAt,
      notes,
    })
    .eq("id", input.paymentId);

  if (error) throw new Error(error.message || "تعذر تحديث بيانات الدفعة.");
}

export async function updateGroupBasic(input: UpdateGroupBasicInput): Promise<void> {
  const name = input.name.trim();
  const startDate = requiredDate(input.startDate, "تاريخ البداية");

  if (!input.groupId.trim()) throw new Error("Group id is required.");
  if (!name) throw new Error("اسم الجروب مطلوب.");

  const updatePayload: Database["public"]["Tables"]["classes"]["Update"] = {
    name,
    start_date: startDate,
    schedule_notes: nullableText(input.notes),
    is_active: input.isActive,
    teacher_session_duration_minutes: nullableNumber(input.teacherSessionDurationMinutes),
    teacher_session_rate: nullableNumber(input.teacherSessionRate),
    teacher_finance_notes: nullableText(input.teacherFinanceNotes),
  };

  if (!input.isActive) {
    updatePayload.end_date = new Date().toISOString().slice(0, 10);
  }

  const supabase = assertSupabase();

  const { error } = await supabase
    .from("classes")
    .update(updatePayload)
    .eq("id", input.groupId);

  if (error) throw new Error(error.message || "تعذر تحديث بيانات الجروب.");
}
