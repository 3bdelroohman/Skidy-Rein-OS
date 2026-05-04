"use client";

import { useRouter } from "next/navigation";
import { TeacherForm } from "@/components/teachers/teacher-form";
import { createTeacher } from "@/services/teachers.service";

export default function NewTeacherPage() {
  const router = useRouter();

  return (
    <TeacherForm
      title="Ø¥Ø¶Ø§ÙØ© Ù…Ø¯Ø±Ø³"
      description="Ø£Ù†Ø´Ø¦ Ù…Ù„Ù Ù…Ø¯Ø±Ø³ Ø­Ù‚ÙŠÙ‚ÙŠ ÙˆØ§Ø±Ø¨Ø·Ù‡ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¨Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø§Ù„ØªÙŠ ÙŠØ¯Ø±Ù‘Ø³Ù‡Ø§ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù†Ø¸Ø§Ù…"
      submitLabel="Ø­ÙØ¸ Ø§Ù„Ù…Ø¯Ø±Ø³"
      successMessage="ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ù…Ù„Ù Ø§Ù„Ù…Ø¯Ø±Ø³ Ø¨Ù†Ø¬Ø§Ø­"
      onSubmit={async (payload) => {
        const created = await createTeacher(payload);
        router.push(`/teachers/${created.id}`);
      }}
      cancelHref="/teachers"
    />
  );
}
