import type { StudentProgressNote, CreateStudentProgressNoteInput } from "@/types/crm";

const STORAGE_KEY = "skidy_student_progress_notes";

function readAll(): StudentProgressNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentProgressNote[]) : [];
  } catch {
    return [];
  }
}

function writeAll(notes: StudentProgressNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function genId(): string {
  return "spn_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// â”€â”€â”€ Public API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Get all notes for a student in a specific group (newest first) */
export function getStudentNotes(groupId: string, studentId: string): StudentProgressNote[] {
  return readAll()
    .filter((n) => n.groupId === groupId && n.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Get all notes for all students in a group (keyed by studentId) */
export function getGroupStudentNotes(groupId: string): Record<string, StudentProgressNote[]> {
  const all = readAll().filter((n) => n.groupId === groupId);
  const map: Record<string, StudentProgressNote[]> = {};
  for (const note of all) {
    if (!map[note.studentId]) map[note.studentId] = [];
    map[note.studentId].push(note);
  }
  // sort each array newest first
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return map;
}

/** Add a new note */
export function addStudentNote(input: CreateStudentProgressNoteInput): StudentProgressNote {
  const all = readAll();
  const note: StudentProgressNote = {
    id: genId(),
    groupId: input.groupId,
    studentId: input.studentId,
    note: input.note.trim(),
    createdAt: new Date().toISOString(),
  };
  all.push(note);
  writeAll(all);
  return note;
}

/** Delete a note by id */
export function deleteStudentNote(id: string): boolean {
  const all = readAll();
  const filtered = all.filter((n) => n.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}

/** Get note count per student in a group */
export function getStudentNoteCount(groupId: string, studentId: string): number {
  return readAll().filter((n) => n.groupId === groupId && n.studentId === studentId).length;
}
