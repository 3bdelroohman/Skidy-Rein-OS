"use client";

interface InvoiceToolbarProps {
  whatsappUrl?: string;
  mailtoUrl?: string;
}

export function InvoiceToolbar({ whatsappUrl, mailtoUrl }: InvoiceToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
      >
        Ø­ÙØ¸ PDF / Ø·Ø¨Ø§Ø¹Ø©
      </button>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
        >
          Ø¥Ø±Ø³Ø§Ù„ ÙˆØ§ØªØ³Ø§Ø¨
        </a>
      ) : null}

      {mailtoUrl ? (
        <a
          href={mailtoUrl}
          className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
        >
          Ø¥Ø±Ø³Ø§Ù„ Ø¨Ø±ÙŠØ¯
        </a>
      ) : null}
    </div>
  );
}
