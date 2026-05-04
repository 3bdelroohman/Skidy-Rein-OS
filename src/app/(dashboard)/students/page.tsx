"use client";





import Link from "next/link";


import { useEffect, useMemo, useState } from "react";


import { GraduationCap, Plus, Sparkles, UserCheck, UserX } from "lucide-react";


import { useUIStore } from "@/stores/ui-store";


import { t } from "@/lib/locale";


import { STUDENT_STATUS_META, getMetaLabel } from "@/config/status-meta";


import { formatCourseLabel } from "@/lib/formatters";


import { cn } from "@/lib/utils";


import {


  listParentsWithRelations,


  listStudentsWithRelations,


  extractLeadIdFromProjectionId,


} from "@/services/relations.service";


import type { ParentListItem, StudentListItem } from "@/types/crm";


import type { CourseType, StudentStatus } from "@/types/common.types";


import { LoadingState } from "@/components/shared/page-state";


import { PageHeader } from "@/components/ui/page-header";


import { StatCard } from "@/components/ui/stat-card";


import { EmptyState } from "@/components/ui/empty-state";


import { SearchBar } from "@/components/ui/search-bar";


import { Button } from "@/components/ui/button";


import { Badge } from "@/components/ui/badge";





function normalizePhone(value: string | null | undefined): string {


  return (value ?? "").replace(/\D/g, "").replace(/^20/, "");


}





type StatusTone = "success" | "warning" | "danger" | "info" | "default";





const STATUS_TONE: Record<StudentStatus, StatusTone> = {


  trial: "info",


  active: "success",


  paused: "warning",


  at_risk: "danger",


  completed: "default",


  churned: "default",


};





const COURSE_OPTIONS: CourseType[] = [


  "scratch",


  "app_inventor",


  "robotics_basic",


  "robotics_iot",


  "python",


  "fastapi",


  "javascript_tailwind",


  "front_end",


  "back_end",


  "ai_intro",


  "ai_ml",


  "data_science",


  "html_css",


  "godot",


  "raspberry_pi",


  "web",


  "ai",


];





export default function StudentsPage() {


  const locale = useUIStore((state) => state.locale);


  const [search, setSearch] = useState("");


  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">("all");


  const [courseFilter, setCourseFilter] = useState<CourseType | "all">("all");


  const [students, setStudents] = useState<StudentListItem[]>([]);


  const [parents, setParents] = useState<ParentListItem[]>([]);


  const [loading, setLoading] = useState(true);





  useEffect(() => {


    let isMounted = true;


    async function load() {


      setLoading(true);


      const [studentData, parentData] = await Promise.all([


        listStudentsWithRelations(),


        listParentsWithRelations(),


      ]);


      if (isMounted) {


        setStudents(studentData);


        setParents(parentData);


        setLoading(false);


      }


    }


    load();


    return () => {


      isMounted = false;


    };


  }, []);





  const parentMap = useMemo(() => {


    const map = new Map<string, ParentListItem>();


    students.forEach((student) => {


      const match = parents.find((parent) => {


        if (student.parentId && parent.id === student.parentId) return true;


        return (


          normalizePhone(parent.phone) === normalizePhone(student.parentPhone) ||


          parent.fullName === student.parentName


        );


      });


      if (match) map.set(student.id, match);


    });


    return map;


  }, [parents, students]);





  const filtered = useMemo(() => {


    const query = search.trim().toLowerCase();


    return students.filter((student) => {


      const matchSearch =


        !query ||


        student.fullName.toLowerCase().includes(query) ||


        student.parentName.toLowerCase().includes(query);


      const matchStatus = statusFilter === "all" || student.status === statusFilter;


      const matchCourse = courseFilter === "all" || student.currentCourse === courseFilter;


      return matchSearch && matchStatus && matchCourse;


    });


  }, [search, statusFilter, courseFilter, students]);





  const totals = useMemo(


    () => ({


      total: students.length,


      visible: filtered.length,


      projected: students.filter((s) => Boolean(extractLeadIdFromProjectionId(s.id))).length,


      active: students.filter((s) => s.status === "active").length,


      ownerless: students.filter((s) => !s.ownerName).length,


    }),


    [filtered.length, students],


  );





  if (loading) {


    return (


      <div className="space-y-6">


        <LoadingState


          titleAr="جارٍ تحميل الطلاب"


          titleEn="Loading students"


          descriptionAr="نقرأ بيانات الطلاب من قاعدة البيانات…"


          descriptionEn="Fetching students from the database…"


        />


      </div>


    );


  }





  const hasResults = filtered.length > 0;


  const hasFilters = search.trim() !== "" || statusFilter !== "all" || courseFilter !== "all";





  return (


    <div className="space-y-6">


      <PageHeader


        title={t(locale, "الطلاب", "Students")}


        subtitle={t(


          locale,


          totals.total + " طالب مسجَّل في النظام",


          totals.total + " students enrolled",


        )}


        actions={


          <Button asChild size="default">


            <Link href="/students/new" className="gap-2">


              <Plus className="size-4" />


              {t(locale, "إضافة طالب", "Add student")}


            </Link>


          </Button>


        }


      />





      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">


        <StatCard


          tone="brand"


          label={t(locale, "إجمالي الطلاب", "Total")}


          value={totals.total}


          icon={<GraduationCap className="size-4" />}


        />


        <StatCard


          tone="info"


          label={t(locale, "مهتمون", "Projected")}


          value={totals.projected}


          icon={<Sparkles className="size-4" />}


        />


        <StatCard


          tone="success"


          label={t(locale, "نشطون", "Active")}


          value={totals.active}


          icon={<UserCheck className="size-4" />}


        />


        <StatCard


          tone="warning"


          label={t(locale, "بلا مسؤول", "Unassigned")}


          value={totals.ownerless}


          icon={<UserX className="size-4" />}


        />


      </div>





      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">


        <SearchBar


          value={search}


          onChange={setSearch}


          placeholder={t(locale, "ابحث باسم الطالب أو ولي الأمر…", "Search by student or parent…")}


          className="w-full sm:max-w-md"


        />


        <div className="flex flex-wrap gap-2">


          <select


            value={statusFilter}


            onChange={(e) => setStatusFilter(e.target.value as StudentStatus | "all")}


            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-300)]"


          >


            <option value="all">{t(locale, "كل الحالات", "All statuses")}</option>


            {Object.entries(STUDENT_STATUS_META).map(([key, meta]) => (


              <option key={key} value={key}>


                {getMetaLabel(meta, locale)}


              </option>


            ))}


          </select>


          <select


            value={courseFilter}


            onChange={(e) => setCourseFilter(e.target.value as CourseType | "all")}


            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-300)]"


          >


            <option value="all">{t(locale, "كل الكورسات", "All courses")}</option>


            {COURSE_OPTIONS.map((c) => (


              <option key={c} value={c}>


                {formatCourseLabel(c, locale)}


              </option>


            ))}


          </select>


        </div>


        <div className="ms-auto text-xs text-muted-foreground" data-numeric>


          {totals.visible} / {totals.total}


        </div>


      </div>





      {!hasResults ? (


        <EmptyState


          icon={<GraduationCap className="size-6" />}


          title={


            hasFilters


              ? t(locale, "لا توجد نتائج مطابقة", "No matching results")


              : t(locale, "لا يوجد طلاب بعد", "No students yet")


          }


          description={


            hasFilters


              ? t(locale, "جرّب تخفيف الفلاتر أو البحث.", "Try easing the filters or search.")


              : t(locale, "ابدأ بإضافة أول طالب.", "Add your first student.")


          }


          action={


            !hasFilters ? (


              <Button asChild>


                <Link href="/students/new" className="gap-2">


                  <Plus className="size-4" />


                  {t(locale, "إضافة طالب", "Add student")}


                </Link>


              </Button>


            ) : undefined


          }


        />


      ) : (


        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">


          {filtered.map((student) => {


            const parent = parentMap.get(student.id);


            const tone = STATUS_TONE[student.status] ?? "default";


            const meta = STUDENT_STATUS_META[student.status];


            return (


              <li key={student.id}>


                <Link


                  href={"/students/" + student.id}


                  className="group block h-full rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-[var(--color-brand-300)] hover:-translate-y-0.5"


                >


                  <div className="flex items-start justify-between gap-2">


                    <div className="min-w-0 space-y-0.5">


                      <h3 className="truncate text-sm font-semibold text-foreground">


                        {student.fullName}


                      </h3>


                      <p className="text-xs text-muted-foreground">


                        <span data-numeric>{student.age}</span>{" "}


                        {t(locale, "سنة", "years")}


                      </p>


                    </div>


                    <Badge


                      variant={


                        tone === "success"


                          ? "default"


                          : tone === "danger"


                            ? "destructive"


                            : "secondary"


                      }


                      className={cn(


                        "shrink-0 text-[11px]",


                        tone === "warning" &&


                          "bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[var(--color-warning-200)]",


                        tone === "info" &&


                          "bg-[var(--color-info-50)] text-[var(--color-info-700)] border-[var(--color-info-200)]",


                      )}


                    >


                      {meta ? getMetaLabel(meta, locale) : student.status}


                    </Badge>


                  </div>





                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">


                    <div className="rounded-md bg-[var(--color-brand-50)] px-2 py-1.5 text-[var(--color-brand-700)]">


                      <div className="text-[10px] uppercase tracking-wide opacity-70">


                        {t(locale, "الكورس", "Course")}


                      </div>


                      <div className="truncate font-medium">


                        {formatCourseLabel(student.currentCourse, locale)}


                      </div>


                    </div>


                    <div className="rounded-md bg-muted px-2 py-1.5">


                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">


                        {t(locale, "المجموعة", "Group")}


                      </div>


                      <div className="truncate font-medium text-foreground">


                        {student.className ?? t(locale, "غير مسجل", "Not assigned")}


                      </div>


                    </div>


                  </div>





                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">


                    {student.ownerName ? (


                      <div className="rounded-md bg-muted px-2 py-1.5">


                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">


                          {t(locale, "المسؤول", "Owner")}


                        </div>


                        <div className="truncate font-medium text-foreground">


                          {student.ownerName}


                        </div>


                      </div>


                    ) : (


                      <div className="rounded-md border border-dashed border-[var(--color-warning-200)] bg-[var(--color-warning-50)] px-2 py-1.5 text-[var(--color-warning-700)]">


                        <div className="text-[10px] uppercase tracking-wide opacity-70">


                          {t(locale, "تنبيه", "Alert")}


                        </div>


                        <div className="font-medium">


                          {t(locale, "بلا مسؤول", "Unassigned")}


                        </div>


                      </div>


                    )}


                    <div className="rounded-md bg-muted px-2 py-1.5">


                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">


                        {t(locale, "الحضور", "Attended")}


                      </div>


                      <div className="font-medium text-foreground" data-numeric>


                        {student.sessionsAttended} {t(locale, "حصة", "sessions")}


                      </div>


                    </div>


                  </div>





                  {(parent || student.parentPhone) && (


                    <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">


                      <div className="flex items-center justify-between gap-2">


                        <span className="truncate">


                          {t(locale, "ولي الأمر:", "Parent:")}{" "}


                          <span className="font-medium text-foreground">


                            {student.parentName}


                          </span>


                        </span>


                        {student.parentPhone ? (


                          <span className="font-mono tabular-nums" data-numeric>


                            {student.parentPhone}


                          </span>


                        ) : null}


                      </div>


                    </div>


                  )}


                </Link>


              </li>


            );


          })}


        </ul>


      )}


    </div>


  );


}


