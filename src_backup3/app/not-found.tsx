"use client";

import { PageStateCard } from "@/components/shared/page-state";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
      <PageStateCard
        titleAr="Ø§Ù„ØµÙØ­Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©"
        titleEn="Page not found"
        descriptionAr="Ø§Ù„Ø±Ø§Ø¨Ø· Ø§Ù„Ø°ÙŠ ÙØªØ­ØªÙ‡ ØºÙŠØ± ØµØ­ÙŠØ­ Ø£Ùˆ Ø£Ù† Ø§Ù„ØµÙØ­Ø© ØªÙ… Ù†Ù‚Ù„Ù‡Ø§. Ø§Ø±Ø¬Ø¹ Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… Ø«Ù… ØªØ§Ø¨Ø¹ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©."
        descriptionEn="The page you opened does not exist or has been moved. Head back to the dashboard and continue from the main navigation."
        actionHref="/"
        actionLabelAr="Ø§Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…"
        actionLabelEn="Back to dashboard"
        variant="warning"
      />
    </main>
  );
}
