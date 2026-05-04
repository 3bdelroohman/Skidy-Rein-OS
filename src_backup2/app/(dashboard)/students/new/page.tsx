"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { StudentForm } from "@/components/students/student-form";
import { createParent, listParents } from "@/services/parents.service";
import { createStudent, listStudents } from "@/services/students.service";
import type { CreateStudentInput } from "@/types/crm";

function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").replace(/^20/, "");
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[Ù‹-ÙŸ]/g, "").replace(/\s+/g, " ").trim();
}

export default function NewStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parentName = searchParams.get("parentName") ?? "";
  const parentPhone = searchParams.get("parentPhone") ?? "";
  const childName = searchParams.get("childName") ?? "";
  const childAge = searchParams.get("childAge");
  const currentCourse = searchParams.get("currentCourse");
  const className = searchParams.get("className") ?? "";

  const handleSubmit = async (payload: CreateStudentInput) => {
    const parents = await listParents();
    const existingParent = parents.find((parent) =>
      normalizePhone(parent.phone) === normalizePhone(payload.parentPhone) ||
      normalizeName(parent.fullName) === normalizeName(payload.parentName),
    );

    const parent = existingParent ?? await createParent({
      fullName: payload.parentName,
      phone: payload.parentPhone,
      whatsapp: payload.parentPhone,
      childrenCount: 1,
    });

    const students = await listStudents();
    const duplicateStudent = students.find((student) =>
      normalizeName(student.fullName) === normalizeName(payload.fullName) &&
      (student.parentId === parent.id || normalizePhone(student.parentPhone) === normalizePhone(parent.phone)),
    );

    if (duplicateStudent) {
      throw new Error("ÙŠÙˆØ¬Ø¯ Ø·Ø§Ù„Ø¨ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø§Ø³Ù… ÙˆØªØ­Øª Ù†ÙØ³ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±. Ø§ÙØªØ­ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø­Ø§Ù„ÙŠ Ø¨Ø¯Ù„ ØªÙƒØ±Ø§Ø±Ù‡.");
    }

    const created = await createStudent({
      ...payload,
      parentId: parent.id,
      parentName: parent.fullName,
      parentPhone: parent.phone,
    });

    router.push(`/students/${created.id}`);
  };

  return (
    <StudentForm
      title="Ø¥Ø¶Ø§ÙØ© Ø·Ø§Ù„Ø¨"
      description="Ø£Ù†Ø´Ø¦ Ø·Ø§Ù„Ø¨Ù‹Ø§ Ø­Ù‚ÙŠÙ‚ÙŠÙ‹Ø§ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù†Ø¸Ø§Ù… ÙˆØ§Ø±Ø¨Ø·Ù‡ Ø¨ÙˆÙ„ÙŠ Ø£Ù…Ø±Ù‡ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¨Ø¯ÙˆÙ† ØªÙƒØ±Ø§Ø± ØºÙŠØ± Ù…Ù‚ØµÙˆØ¯"
      submitLabel="Ø­ÙØ¸ Ø§Ù„Ø·Ø§Ù„Ø¨"
      successMessage="ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„ Ø§Ù„Ø·Ø§Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­"
      onSubmit={handleSubmit}
      cancelHref="/students"
      initialValues={{
        fullName: childName || undefined,
        age: childAge ? Number(childAge) : undefined,
        parentName: parentName || undefined,
        parentPhone: parentPhone || undefined,
        currentCourse: (currentCourse as CreateStudentInput["currentCourse"]) ?? undefined,
        className: className || undefined,
      }}
    />
  );
}
