import { createBrowserClient } from "@supabase/ssr";


import type { StudentStatus } from "@/types/common.types";


import type { Database } from "@/types/database.types";


import type { CreateStudentInput, StudentListItem } from "@/types/crm";


import { isBrowser, readStorage, sortByDateDesc, writeStorage } from "@/services/storage";





const STUDENTS_KEY = "skidy.crm.students";


const VALID_STATUSES: StudentStatus[] = ["trial", "active", "paused", "at_risk", "completed", "churned"];





function getSupabaseClient() {


  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;


  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


  if (!url || !key || !isBrowser()) return null;


  return createBrowserClient<Database>(url, key);


}





function asString(value: unknown, fallback = ""): string {


  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;


}





function asNumber(value: unknown, fallback = 0): number {


  if (typeof value === "number" && Number.isFinite(value)) return value;


  if (typeof value === "string") {


    const parsed = Number(value);


    return Number.isFinite(parsed) ? parsed : fallback;


  }


  return fallback;


}





function asStatus(value: unknown): StudentStatus {


  return VALID_STATUSES.includes(value as StudentStatus) ? (value as StudentStatus) : "trial";


}





function asNullableString(value: unknown): string | null {


  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;


}








function normalizeName(value: string | null | undefined): string {


  return (value ?? "")


    .toLowerCase()


    .replace(/[ً-ٟ]/g, "")


    .replace(/\s+/g, " ")


    .trim();


}





interface ParentLookup {


  full_name: string;


  phone: string;


}





interface ClassLookup {


  id: string;


  name: string;


}





function mapRow(


  row: Database["public"]["Tables"]["students"]["Row"] | Record<string, unknown>,


  parentLookup?: ParentLookup | null,


  classLookup?: ClassLookup | null,


): StudentListItem {


  const record = row as Record<string, unknown>;


  return {


    id: asString(record.id, crypto.randomUUID()),


    fullName: asString(record.full_name ?? record.fullName, "طالب غير محدد"),


    age: asNumber(record.age, 0),


    parentId: asNullableString(record.parent_id ?? record.parentId),


    parentName: asString(parentLookup?.full_name ?? record.parentName, "ولي أمر غير محدد"),


    parentPhone: asString(parentLookup?.phone ?? record.parentPhone, "–"),


    status: asStatus(record.status),


    currentCourse: (typeof (record.current_course ?? record.currentCourse) === "string"


      ? (record.current_course ?? record.currentCourse)


      : null) as StudentListItem["currentCourse"],


    className: classLookup?.name ?? asNullableString(record.class_name ?? record.className),


    enrollmentDate: asString(record.enrollment_date ?? record.enrollmentDate, new Date().toISOString()),


    sessionsAttended: asNumber(record.sessions_attended ?? record.sessionsAttended, 0),


    totalPaid: asNumber(record.total_paid ?? record.totalPaid, 0),


  };


}





function getLocalStudents(): StudentListItem[] {


  return sortByDateDesc(readStorage(STUDENTS_KEY, [] as StudentListItem[]), (student) => student.enrollmentDate);


}





function saveLocalStudents(students: StudentListItem[]): void {


  writeStorage(STUDENTS_KEY, sortByDateDesc(students, (student) => student.enrollmentDate));


}





function clearLocalStudents(): void {


  writeStorage(STUDENTS_KEY, []);


}





function findExistingStudent(items: StudentListItem[], input: CreateStudentInput): StudentListItem | null {


  const studentName = normalizeName(input.fullName);


  const parentId = input.parentId;





  return (


    items.find((student) => parentId && student.parentId === parentId && normalizeName(student.fullName) === studentName) ??


    items.find((student) => normalizeName(student.fullName) === studentName && student.parentId === parentId) ??


    null


  );


}





export async function listStudents(): Promise<StudentListItem[]> {


  const supabase = getSupabaseClient();


  if (!supabase) {


    clearLocalStudents();


    return [];


  }





  try {


    const [studentsRes, parentsRes, classesRes] = await Promise.all([


      supabase.from("students").select("*").order("enrollment_date", { ascending: false }),


      supabase.from("parents").select("id, full_name, phone"),


      supabase.from("classes").select("id, name"),


    ]);





    if (studentsRes.error) {


      console.error("[students] failed to load from Supabase", studentsRes.error);


      clearLocalStudents();


      return [];


    }





    if (!studentsRes.data || studentsRes.data.length === 0) {


      clearLocalStudents();


      return [];


    }





    const parentsMap = new Map<string, ParentLookup>();


    (parentsRes.data ?? []).forEach((p) => parentsMap.set(p.id, { full_name: p.full_name, phone: p.phone }));





    const classesMap = new Map<string, ClassLookup>();


    (classesRes.data ?? []).forEach((item) => classesMap.set(item.id, { id: item.id, name: item.name }));





    const mapped = studentsRes.data.map((row) => {


      const record = row as Record<string, unknown>;


      const parentInfo = row.parent_id ? parentsMap.get(row.parent_id) ?? null : null;


      const currentClassId = asNullableString(record.current_class_id);


      const classInfo = currentClassId ? classesMap.get(currentClassId) ?? null : null;


      return mapRow(row, parentInfo, classInfo);


    });





    saveLocalStudents(mapped);


    return mapped;


  } catch (error) {


    console.error("[students] unexpected load failure", error);


    clearLocalStudents();


    return [];


  }


}





export async function getStudentById(id: string): Promise<StudentListItem | null> {


  const supabase = getSupabaseClient();


  if (!supabase) return null;





  try {


    const { data, error } = await supabase


      .from("students")


      .select("*")


      .eq("id", id)


      .maybeSingle();





    if (error || !data) return null;





    let parentInfo: ParentLookup | null = null;


    if (data.parent_id) {


      const { data: parentData } = await supabase


        .from("parents")


        .select("full_name, phone")


        .eq("id", data.parent_id)


        .maybeSingle();





      parentInfo = parentData ?? null;


    }





    let classInfo: ClassLookup | null = null;


    const currentClassId = asNullableString((data as Record<string, unknown>).current_class_id);





    if (currentClassId) {


      const { data: classData } = await supabase


        .from("classes")


        .select("id, name")


        .eq("id", currentClassId)


        .maybeSingle();





      classInfo = classData ? { id: classData.id, name: classData.name } : null;


    }





    const mapped = mapRow(data, parentInfo, classInfo);


    saveLocalStudents([mapped, ...getLocalStudents().filter((student) => student.id !== mapped.id)]);


    return mapped;


  } catch (error) {


    console.error("[students] failed to load student by id", error);


    return null;


  }


}





async function findClassForStudent(


  supabase: NonNullable<ReturnType<typeof getSupabaseClient>>,


  className: string | null | undefined,


): Promise<ClassLookup | null> {


  const targetName = className?.trim();





  if (!targetName) return null;





  const query = supabase


    .from("classes")


    .select("id, name")


    .eq("name", targetName)


    .limit(1);








  const { data, error } = await query.maybeSingle();





  if (error) {


    console.error("[students] failed to resolve class by name", error);


    throw new Error("تعذر التحقق من الجروب المختار.");


  }





  if (!data) return null;





  return {


    id: data.id,


    name: data.name,


  };


}





async function activateClassEnrollment(


  supabase: NonNullable<ReturnType<typeof getSupabaseClient>>,


  studentId: string,


  classId: string,


  enrolledAt: string,


): Promise<void> {


  const { data: existingEnrollment, error: lookupError } = await supabase


    .from("class_enrollments")


    .select("student_id")


    .eq("student_id", studentId)


    .eq("class_id", classId)


    .maybeSingle();





  if (lookupError) {


    console.error("[students] failed to check class enrollment", lookupError);


    throw new Error("تعذر التحقق من ربط الطالب بالجروب.");


  }





  if (existingEnrollment) {


    const { error: updateEnrollmentError } = await supabase


      .from("class_enrollments")


      .update({


        is_active: true,


        enrolled_at: enrolledAt,


      })


      .eq("student_id", studentId)


      .eq("class_id", classId);





    if (updateEnrollmentError) {


      console.error("[students] failed to reactivate class enrollment", updateEnrollmentError);


      throw new Error("تعذر إعادة تفعيل ربط الطالب بالجروب.");


    }


  } else {


    const { error: insertEnrollmentError } = await supabase


      .from("class_enrollments")


      .insert({


        student_id: studentId,


        class_id: classId,


        is_active: true,


        enrolled_at: enrolledAt,


      });





    if (insertEnrollmentError) {


      console.error("[students] failed to create class enrollment", insertEnrollmentError);


      throw new Error("تم إنشاء الطالب لكن تعذر ربطه بالجروب.");


    }


  }





  const { error: updateStudentError } = await supabase


    .from("students")


    .update({ current_class_id: classId })


    .eq("id", studentId);





  if (updateStudentError) {


    console.error("[students] failed to update current_class_id", updateStudentError);


    throw new Error("تم ربط الطالب بالجروب لكن تعذر تحديث الجروب الحالي.");


  }


}


export async function createStudent(input: CreateStudentInput): Promise<StudentListItem> {


  const fullName = input.fullName.trim();


  const enrollmentDate = input.enrollmentDate ?? new Date().toISOString().split("T")[0];





  if (!fullName) {


    throw new Error("اسم الطالب مطلوب.");


  }





  if (!input.parentId) {


    throw new Error("يجب ربط الطالب بولي أمر.");


  }





  if (!Number.isFinite(input.age) || input.age < 4 || input.age > 18) {


    throw new Error("عمر الطالب يجب أن يكون بين 4 و18 سنة.");


  }





  const supabase = getSupabaseClient();


  if (!supabase) {


    throw new Error("تعذر الاتصال بقاعدة البيانات.");


  }





  const selectedClass = await findClassForStudent(


    supabase,


    input.className,


  );





  if (input.className?.trim() && !selectedClass) {


    throw new Error("الجروب المختار غير موجود.");


  }





  const existing = findExistingStudent(await listStudents(), input);


  if (existing) {


    if (selectedClass) {


      await activateClassEnrollment(supabase, existing.id, selectedClass.id, enrollmentDate);


      const refreshed = await getStudentById(existing.id);


      return refreshed ?? { ...existing, className: selectedClass.name };


    }





    return existing;


  }





  const payload: Database["public"]["Tables"]["students"]["Insert"] = {


    full_name: fullName,


    age: input.age,


    parent_id: input.parentId,


    status: input.status ?? "active",


    current_course: input.currentCourse ?? null,


    current_class_id: selectedClass?.id ?? null,


    enrollment_date: enrollmentDate,


    sessions_attended: input.sessionsAttended ?? 0,


    total_paid: input.totalPaid ?? 0,


  };





  const { data, error } = await supabase


    .from("students")


    .insert(payload)


    .select("*")


    .single();





  if (error || !data) {


    console.error("[students] create failed", error);


    throw new Error(error?.message || "تعذر إنشاء سجل الطالب.");


  }





  if (selectedClass) {


    await activateClassEnrollment(supabase, data.id, selectedClass.id, enrollmentDate);


  }





  const { data: parentData } = await supabase


    .from("parents")


    .select("full_name, phone")


    .eq("id", input.parentId)


    .maybeSingle();





  const created = mapRow(


    {


      ...data,


      current_class_id: selectedClass?.id ?? (data as Record<string, unknown>).current_class_id,


    },


    parentData,


    selectedClass,


  );





  saveLocalStudents([created, ...getLocalStudents().filter((item) => item.id !== created.id)]);


  return created;


}








/** Delete a student and all related records atomically via DB transaction */
export async function deleteStudent(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client not available");

  const { error } = await supabase.rpc("delete_student_cascade", { p_student_id: id });

  if (error) {
    console.error("[students] delete cascade failed", error);
    throw new Error(error.message || "تعذر حذف الطالب");
  }

  saveLocalStudents(getLocalStudents().filter((s) => s.id !== id));
  return true;
}







/** Update basic profile fields for an existing student */
export async function updateStudent(
  id: string,
  input: {
    fullName: string;
    age: number;
    parentName: string;
    parentPhone: string;
    currentCourse: import("@/types/common.types").CourseType | null;
    status: import("@/types/common.types").StudentStatus;
  },
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("تعذر الاتصال بقاعدة البيانات.");

  const fullName = input.fullName.trim();
  if (!fullName) throw new Error("اسم الطالب مطلوب.");
  if (!Number.isFinite(input.age) || input.age < 4 || input.age > 18)
    throw new Error("عمر الطالب يجب أن يكون بين 4 و18 سنة.");

  const { error: studentError } = await supabase
    .from("students")
    .update({
      full_name: fullName,
      age: input.age,
      current_course: input.currentCourse ?? null,
      status: input.status,
    })
    .eq("id", id);

  if (studentError) throw new Error(studentError.message || "تعذر تحديث بيانات الطالب.");

  // update parent name + phone via parent_id
  const { data: studentRow } = await supabase
    .from("students")
    .select("parent_id")
    .eq("id", id)
    .maybeSingle();

  if (studentRow?.parent_id) {
    const { error: parentError } = await supabase
      .from("parents")
      .update({
        full_name: input.parentName.trim(),
        phone: input.parentPhone.trim(),
        whatsapp: input.parentPhone.trim(),
      })
      .eq("id", studentRow.parent_id);

    if (parentError) throw new Error(parentError.message || "تعذر تحديث بيانات ولي الأمر.");
  }

  // invalidate local cache
  saveLocalStudents(getLocalStudents().filter((s) => s.id !== id));
}
