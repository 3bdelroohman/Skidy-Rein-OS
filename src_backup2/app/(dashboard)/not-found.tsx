"use client";

import { PageStateCard } from "@/components/shared/page-state";

export default function DashboardNotFound() {
  return (
    <PageStateCard
      titleAr="Ø§Ù„Ø¹Ù†ØµØ± Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯"
      titleEn="Requested item was not found"
      descriptionAr="Ù‚Ø¯ ÙŠÙƒÙˆÙ† Ø§Ù„Ø¹Ù†ØµØ± Ù…Ø­Ø°ÙˆÙÙ‹Ø§ Ø£Ùˆ Ø£Ù† Ø§Ù„Ø±Ø§Ø¨Ø· ØºÙŠØ± ØµØ­ÙŠØ­. Ø§Ø±Ø¬Ø¹ Ø¥Ù„Ù‰ Ø§Ù„Ù‚Ø³Ù… Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ ÙˆØ£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©."
      descriptionEn="The requested item may have been removed or the link is incorrect. Go back to the main section and try again."
      actionHref="/"
      actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…"
      actionLabelEn="Back to dashboard"
      variant="warning"
    />
  );
}
