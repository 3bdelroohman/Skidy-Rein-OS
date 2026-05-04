"use client";

import { LoadingState } from "@/components/shared/page-state";

export default function DashboardLoading() {
  return (
    <LoadingState
      titleAr="جارِ تحميل لوحة التشغيل"
      titleEn="Loading dashboard"
      descriptionAr="يتم الآن تجهيز مساحة تشغيل الأكاديمية والبيانات الأساسية."
      descriptionEn="The academy operating workspace is being prepared."
    />
  );
}
