"use client";

import { RefreshCcw } from "lucide-react";
import { PageStateCard } from "@/components/shared/page-state";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
      <PageStateCard
        variant="danger"
        titleAr="Ø­Ø¯Ø« Ø®Ø·Ø£ ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹"
        titleEn="Something went wrong"
        descriptionAr="Ø§Ù„Ù†Ø¸Ø§Ù… ÙˆØ§Ø¬Ù‡ Ù…Ø´ÙƒÙ„Ø© Ø£Ø«Ù†Ø§Ø¡ ØªØ­Ù…ÙŠÙ„ Ù‡Ø°Ù‡ Ø§Ù„ØµÙØ­Ø©. ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ø§Ù„Ø¢Ù†ØŒ ÙˆØ¥Ø°Ø§ ØªÙƒØ±Ø± Ø§Ù„Ø®Ø·Ø£ ÙØ§Ø±Ø¬Ø¹ Ù„Ù„ØµÙØ­Ø© Ø§Ù„Ø³Ø§Ø¨Ù‚Ø© Ø£Ùˆ Ø£Ø¹Ø¯ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…ØªØµÙØ­."
        descriptionEn="The app hit an unexpected issue while loading this page. Try again now, and if it persists, go back or refresh the browser."
        secondaryAction={
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <RefreshCcw size={16} />
            Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© / Try again
          </button>
        }
      />
    </main>
  );
}
