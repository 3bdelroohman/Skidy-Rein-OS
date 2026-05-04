"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ParentForm } from "@/components/parents/parent-form";
import { createParent, listParents } from "@/services/parents.service";
import { createStudent, listStudents } from "@/services/students.service";
import type { CreateParentInput } from "@/types/crm";

function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "").replace(/^20/, "");
}

function normalizeName(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/[Ù‹-ÙŸ]/g, "").replace(/\s+/g, " ").trim();
}

export default function NewParentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (payload: CreateParentInput) => {
    const parents = await listParents();
    const duplicateParent = parents.find((parent) =>
      normalizePhone(parent.phone) === normalizePhone(payload.phone) ||
      (payload.whatsapp && normalizePhone(parent.whatsapp) === normalizePhone(payload.whatsapp)) ||
      (normalizeName(parent.fullName) === normalizeName(payload.fullName) && normalizePhone(parent.phone) === normalizePhone(payload.phone)),
    );

    if (duplicateParent) {
      throw new Error("ÙŠÙˆØ¬Ø¯ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø±Ù‚Ù… Ø£Ùˆ Ø§Ù„Ø§Ø³Ù…. Ø§ÙØªØ­ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„Ø­Ø§Ù„ÙŠ Ø¨Ø¯Ù„ Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„ Ø¬Ø¯ÙŠØ¯.");
    }

    const createdParent = await createParent(payload);

    if (payload.firstStudentName && payload.firstStudentAge) {
      const students = await listStudents();
      const duplicateStudent = students.find((student) =>
        normalizeName(student.fullName) === normalizeName(payload.firstStudentName) &&
        (student.parentId === createdParent.id || normalizePhone(student.parentPhone) === normalizePhone(createdParent.phone)),
      );

      if (duplicateStudent) {
        throw new Error("Ø§Ù„Ø·Ø§Ù„Ø¨ Ø§Ù„Ø£ÙˆÙ„ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ù„Ù‡Ø°Ø§ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±. Ù„Ù† ÙŠØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ø³Ù… Ù…ÙƒØ±Ø±.");
      }

      await createStudent({
        fullName: payload.firstStudentName,
        age: payload.firstStudentAge,
        parentId: createdParent.id,
        parentName: createdParent.fullName,
        parentPhone: createdParent.phone,
        currentCourse: payload.firstStudentCourse ?? null,
        className: payload.firstStudentClassName ?? null,
        status: "active",
      });
    }

    router.push(`/parents/${createdParent.id}`);
  };

  return (
    <ParentForm
      title="Ø¥Ø¶Ø§ÙØ© ÙˆÙ„ÙŠ Ø£Ù…Ø±"
      description="Ø£Ù†Ø´Ø¦ Ø³Ø¬Ù„ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ø­Ù‚ÙŠÙ‚ÙŠ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù†Ø¸Ø§Ù… ÙˆÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø¶Ø§ÙØ© Ø£ÙˆÙ„ Ø·Ø§Ù„Ø¨ Ù…Ø¹Ù‡ Ù…Ù† Ù†ÙØ³ Ø§Ù„ÙÙˆØ±Ù…"
      submitLabel="Ø­ÙØ¸ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±"
      successMessage="ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø³Ø¬Ù„ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø¨Ù†Ø¬Ø§Ø­"
      onSubmit={handleSubmit}
      cancelHref="/parents"
      initialValues={{
        fullName: searchParams.get("parentName") ?? undefined,
        phone: searchParams.get("parentPhone") ?? undefined,
        whatsapp: searchParams.get("parentWhatsapp") ?? undefined,
        firstStudentName: searchParams.get("firstStudentName") ?? undefined,
        firstStudentAge: searchParams.get("firstStudentAge") ? Number(searchParams.get("firstStudentAge")) : undefined,
        firstStudentCourse: (searchParams.get("currentCourse") as CreateParentInput["firstStudentCourse"] | null) ?? undefined,
        firstStudentClassName: searchParams.get("className") ?? undefined,
      }}
    />
  );
}
