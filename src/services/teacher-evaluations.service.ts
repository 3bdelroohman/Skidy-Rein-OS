import { readStorage, writeStorage } from "@/services/storage";

const KEY = "skidy.crm.teacher-evaluations";

/** Operational evaluation axes — each 1-5 or null */
export interface EvaluationAxes {
  punctuality: number | null;
  materialPrep: number | null;
  communication: number | null;
  studentEngagement: number | null;
  reportReadiness: number | null;
}

export interface TeacherEvaluationRecord {
  teacherId: string;
  rating: number | null;
  notes: string | null;
  updatedAt: string;
  /** Operational axes — added incrementally, may be missing in old records */
  axes?: EvaluationAxes | null;
}

const EMPTY_AXES: EvaluationAxes = {
  punctuality: null,
  materialPrep: null,
  communication: null,
  studentEngagement: null,
  reportReadiness: null,
};

function readAll(): Record<string, TeacherEvaluationRecord> {
  return readStorage<Record<string, TeacherEvaluationRecord>>(KEY, {});
}

function writeAll(data: Record<string, TeacherEvaluationRecord>) {
  writeStorage(KEY, data);
}

export function getTeacherEvaluation(teacherId: string): TeacherEvaluationRecord | null {
  const all = readAll();
  const record = all[teacherId] ?? null;
  if (record && !record.axes) {
    record.axes = { ...EMPTY_AXES };
  }
  return record;
}

/** Compute the average of all non-null axes values */
export function computeAverageRating(axes: EvaluationAxes | null | undefined): number | null {
  if (!axes) return null;
  const values = Object.values(axes).filter((v): v is number => typeof v === "number" && v >= 1 && v <= 5);
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10;
}

export function saveTeacherEvaluation(input: {
  teacherId: string;
  rating: number | null;
  notes?: string | null;
  axes?: EvaluationAxes | null;
}) {
  const all = readAll();
  const computedAvg = computeAverageRating(input.axes);
  const record: TeacherEvaluationRecord = {
    teacherId: input.teacherId,
    rating: computedAvg ?? input.rating,
    notes: input.notes?.trim() || null,
    updatedAt: new Date().toISOString(),
    axes: input.axes ?? { ...EMPTY_AXES },
  };
  all[input.teacherId] = record;
  writeAll(all);
  return record;
}
