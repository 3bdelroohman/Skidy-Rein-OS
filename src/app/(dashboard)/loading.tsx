"use client";

import { LoadingState } from "@/components/shared/page-state";

export default function DashboardLoading() {
  return (
    <LoadingState
      titleAr="جارٍ تحميل لوحة التحكم"
      titleEn="Loading dashboard"
      descriptionAr="يتم الآن تجهيز البيانات والواجهة التشغيلية للأكاديمية."
      descriptionEn="The academy operating workspace is being prepared."
    />
  );
}
