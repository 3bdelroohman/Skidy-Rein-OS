"use client";

import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { createLead } from "@/services/leads.service";
import type { CreateLeadInput } from "@/types/crm";

export default function NewLeadPage() {
  const router = useRouter();

  const handleSubmit = async (payload: CreateLeadInput) => {
    await createLead(payload);
    router.push("/leads");
  };

  return (
    <LeadForm
      title="Ø¥Ø¶Ø§ÙØ© Ø¹Ù…ÙŠÙ„ Ø¬Ø¯ÙŠØ¯"
      description="Ø§Ø¨Ø¯Ø£ Ù…Ù† Ø¨ÙŠØ§Ù†Ø§Øª ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± ÙˆØ§Ù„Ø·ÙÙ„ Ø«Ù… ÙˆØ²Ù‘Ø¹ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨"
      submitLabel="Ø­ÙØ¸ Ø§Ù„Ø¹Ù…ÙŠÙ„"
      successMessage="ØªÙ… Ø­ÙØ¸ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø¨Ù†Ø¬Ø§Ø­"
      onSubmit={handleSubmit}
      cancelHref="/leads"
    />
  );
}
