export type CourseLike = string | { id?: string | null; name?: string | null; title?: string | null };

export type TeacherCourseLike = {
  id: string;
  fullName?: string | null;
  full_name?: string | null;
  name?: string | null;
  specialization?: string[] | null;
  specializations?: string[] | null;
  courses?: Array<string | { id?: string | null; name?: string | null; title?: string | null }> | null;
  courseIds?: string[] | null;
  course_ids?: string[] | null;
};

export function normalizeCourseText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function getCourseName(course: CourseLike | null | undefined): string {
  if (!course) return "";
  if (typeof course === "string") return course;
  return course.name || course.title || course.id || "";
}

export function getTeacherName(teacher: TeacherCourseLike | null | undefined): string {
  if (!teacher) return "";
  return teacher.fullName || teacher.full_name || teacher.name || "Ù…Ø¯Ø±Ø³ Ø¨Ø¯ÙˆÙ† Ø§Ø³Ù…";
}

export function teacherTeachesCourse(
  teacher: TeacherCourseLike | null | undefined,
  course: CourseLike | null | undefined,
): boolean {
  if (!teacher) return false;
  if (!course) return true;

  const courseId = typeof course === "string" ? null : course.id ?? null;
  const courseName = normalizeCourseText(getCourseName(course));

  const courseIds = [...(teacher.courseIds ?? []), ...(teacher.course_ids ?? [])];
  if (courseId && courseIds.includes(courseId)) return true;

  const specialization = [...(teacher.specialization ?? []), ...(teacher.specializations ?? [])];
  if (specialization.some((item) => normalizeCourseText(item) === courseName)) return true;

  for (const item of teacher.courses ?? []) {
    if (typeof item === "string") {
      if (normalizeCourseText(item) === courseName) return true;
      continue;
    }

    if (courseId && item.id === courseId) return true;

    const itemName = normalizeCourseText(getCourseName(item));
    if (itemName && itemName === courseName) return true;
  }

  return false;
}

export function filterTeachersByCourse<TTeacher extends TeacherCourseLike>(
  teachers: TTeacher[],
  course: CourseLike | null | undefined,
): TTeacher[] {
  if (!course) return teachers;
  return teachers.filter((teacher) => teacherTeachesCourse(teacher, course));
}

export function buildTeacherCourseWarning(input: {
  selectedTeacher: TeacherCourseLike | null | undefined;
  selectedCourse: CourseLike | null | undefined;
  availableTeachers: TeacherCourseLike[];
  locale: "ar" | "en";
}): string | null {
  const { selectedTeacher, selectedCourse, availableTeachers, locale } = input;

  if (!selectedCourse || !selectedTeacher) return null;
  if (teacherTeachesCourse(selectedTeacher, selectedCourse)) return null;

  const teacherName = getTeacherName(selectedTeacher);
  const courseName = getCourseName(selectedCourse);
  const availableNames = availableTeachers.map(getTeacherName).filter(Boolean).join("ØŒ ");

  if (locale === "ar") {
    return availableNames
      ? `Ø§Ù„Ù…Ø¯Ø±Ø³ ${teacherName} Ù„Ø§ ÙŠØ¯Ø±Ù‘Ø³ Ù…Ø§Ø¯Ø© ${courseName}. ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ø®ØªÙŠØ§Ø±: ${availableNames}ØŒ Ø£Ùˆ ØªØºÙŠÙŠØ± Ø§Ù„Ù…Ø§Ø¯Ø©.`
      : `Ø§Ù„Ù…Ø¯Ø±Ø³ ${teacherName} Ù„Ø§ ÙŠØ¯Ø±Ù‘Ø³ Ù…Ø§Ø¯Ø© ${courseName}. ØºÙŠÙ‘Ø± Ø§Ù„Ù…Ø§Ø¯Ø© Ø£Ùˆ Ø£Ø¶Ù Ù…Ø¯Ø±Ø³Ù‹Ø§ Ù„Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø§Ø¯Ø©.`;
  }

  return availableNames
    ? `${teacherName} does not teach ${courseName}. Choose one of: ${availableNames}, or change the course.`
    : `${teacherName} does not teach ${courseName}. Change the course or assign a teacher to this course.`;
}
