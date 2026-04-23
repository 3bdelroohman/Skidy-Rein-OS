import type { GroupTask, CreateGroupTaskInput, TaskStatus } from "@/types/crm";

// ─── localStorage-based Group Tasks Service ──────────────────
const STORAGE_KEY = "skidy_group_tasks";

function readAll(): GroupTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GroupTask[]) : [];
  } catch {
    return [];
  }
}

function writeAll(tasks: GroupTask[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function genId(): string {
  return "gt_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

// ─── Public API ──────────────────────────────────────────────

export function getGroupTasks(
  groupId: string,
  targetType?: "teacher" | "student"
): GroupTask[] {
  const all = readAll();
  return all.filter(
    (t) => t.groupId === groupId && (!targetType || t.targetType === targetType)
  );
}

export function addGroupTask(input: CreateGroupTaskInput): GroupTask {
  const all = readAll();
  const task: GroupTask = {
    id: genId(),
    groupId: input.groupId,
    targetType: input.targetType,
    title: input.title.trim(),
    status: "pending",
    notes: input.notes?.trim() || "",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  all.push(task);
  writeAll(all);
  return task;
}

export function updateGroupTask(
  id: string,
  updates: Partial<Pick<GroupTask, "title" | "notes" | "status">>
): GroupTask | null {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  if (updates.title !== undefined) all[idx].title = updates.title.trim();
  if (updates.notes !== undefined) all[idx].notes = updates.notes.trim();
  if (updates.status !== undefined) {
    all[idx].status = updates.status;
    all[idx].completedAt =
      updates.status === "done" ? new Date().toISOString() : null;
  }

  writeAll(all);
  return all[idx];
}

export function toggleTaskStatus(id: string): GroupTask | null {
  const all = readAll();
  const task = all.find((t) => t.id === id);
  if (!task) return null;
  const newStatus: TaskStatus = task.status === "done" ? "pending" : "done";
  return updateGroupTask(id, { status: newStatus });
}

export function deleteGroupTask(id: string): boolean {
  const all = readAll();
  const filtered = all.filter((t) => t.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}

export function getTaskStats(groupId: string, targetType?: "teacher" | "student") {
  const tasks = getGroupTasks(groupId, targetType);
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pending = total - done;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pending, percent };
}
