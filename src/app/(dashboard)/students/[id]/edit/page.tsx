"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentForm } from "@/components/students/student-form";
import { getStudentById, updateStudent } from "@/services/students.service";
import type { CreateStudentInput } from "@/types/crm";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [student, setStudent] = useState<Awaited<ReturnType<typeof getStudentById>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getStudentById(id).then((data) => {
      if (mounted) {
        setStudent(data);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col gap-4 px-6 py-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">الطالب غير موجود</h1>
        <p className="text-sm text-muted-foreground">تعذر تحميل بيانات الطالب</p>
        <Link
          href="/students"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          العودة للطلاب
        </Link>
      </div>
    );
  }

  const handleSubmit = async (payload: CreateStudentInput) => {
    await updateStudent(id, {
      fullName: payload.fullName,
      age: payload.age,
      parentName: payload.parentName,
      parentPhone: payload.parentPhone,
      currentCourse: payload.currentCourse ?? null,
      status: payload.status ?? "active",
    });

    router.push(`/students/${id}`);
  };

  return (
    <StudentForm
      title="تعديل بيانات الطالب"
      description="عدّل المعلومات الأساسية للطالب — التغييرات تُحفظ فوراً في قاعدة البيانات"
      submitLabel="حفظ التعديلات"
      successMessage="تم تحديث بيانات الطالب بنجاح"
      onSubmit={handleSubmit}
      cancelHref={`/students/${id}`}
      initialValues={{
        fullName: student.fullName,
        age: student.age,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        currentCourse: student.currentCourse ?? undefined,
        status: student.status,
      }}
    />
  );
}