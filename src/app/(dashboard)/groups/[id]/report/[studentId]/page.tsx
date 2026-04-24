"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";

export default function ParentReportPage({
  params,
}: {
  params: Promise<{ id: string; studentId: string }>;
}) {
  const { id, studentId } = use(params);

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      <div className="no-print mb-4 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <Link
          href={"/groups/" + id}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          <ArrowRight size={16} />
          العودة للجروب
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <Printer size={16} />
          طباعة / حفظ PDF
        </button>
      </div>

      <main
        dir="rtl"
        className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-white p-8 text-sm text-gray-800 shadow-sm dark:bg-card dark:text-foreground print:border-0 print:shadow-none"
      >
        <header className="border-b border-gray-200 pb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
            Skidy Rein Academy
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-950 dark:text-foreground">
            تقرير أداء الطالب
          </h1>

          <p className="mt-2 text-xs text-gray-500">
            نسخة أولية من تقرير ولي الأمر
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              بيانات الطالب
            </h2>

            <div className="space-y-2">
              <InfoLine label="Student ID" value={studentId} />
              <InfoLine label="Group ID" value={id} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              حالة التقرير
            </h2>

            <p className="leading-7 text-gray-600 dark:text-muted-foreground">
              تم إنشاء صفحة التقرير بنجاح. الخطوة التالية هي ربطها ببيانات الحضور والجروب والطالب.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-950 dark:text-foreground">
            ملخص الحضور والغياب
          </h2>

          <p className="mt-2 leading-7 text-gray-600 dark:text-muted-foreground">
            سيتم عرض إجمالي الحصص، الحضور، الغياب، التأخير، ونسبة الالتزام هنا بعد ربط الصفحة بالـ service.
          </p>
        </section>

        <footer className="border-t border-gray-200 pt-4 text-center text-[11px] text-gray-400">
          هذا التقرير تم إنشاؤه تلقائيًا من نظام Skidy Rein OS.
        </footer>
      </main>
    </>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-end font-semibold text-gray-900 dark:text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}