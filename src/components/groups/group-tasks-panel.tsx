"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, ListTodo, PlusCircle, Trash2 } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { t } from "@/lib/locale";
import {
  addGroupTask,
  deleteGroupTask,
  getGroupTasks,
  getTaskStats,
  toggleTaskStatus,
} from "@/services/group-tasks.service";
import type { GroupTask, TaskTargetType } from "@/types/crm";

interface Props {
  groupId: string;
}

export default function GroupTasksPanel({ groupId }: Props) {
  const locale = useUIStore((s) => s.locale);

  const [activeTab, setActiveTab] = useState<TaskTargetType>("teacher");
  const [tasks, setTasks] = useState<GroupTask[]>(() => getGroupTasks(groupId, activeTab));
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [, setTick] = useState(0);

  // Re-read tasks whenever tab changes
  useEffect(() => {
    setTasks(getGroupTasks(groupId, activeTab));
  }, [groupId, activeTab]);

  function reload() {
    setTasks(getGroupTasks(groupId, activeTab));
    setTick((n) => n + 1);
  }

  const stats = getTaskStats(groupId, activeTab);

  function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    addGroupTask({ groupId, targetType: activeTab, title: trimmed, notes: notes.trim() || undefined });
    setTitle("");
    setNotes("");
    reload();
    toast.success(t(locale, "تمت إضافة المهمة", "Task added"));
  }

  function handleToggle(id: string) {
    toggleTaskStatus(id);
    reload();
  }

  function handleDelete(id: string) {
    const ok = window.confirm(t(locale, "هل تريد حذف هذه المهمة؟", "Delete this task?"));
    if (!ok) return;
    deleteGroupTask(id);
    reload();
    toast.success(t(locale, "تم حذف المهمة", "Task deleted"));
  }

  const tabs: { key: TaskTargetType; labelAr: string; labelEn: string }[] = [
    { key: "teacher", labelAr: "مهام المدرس", labelEn: "Teacher tasks" },
    { key: "student", labelAr: "مهام الطلاب", labelEn: "Student tasks" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
        <ListTodo size={18} className="text-brand-600" />
        {t(locale, "المهام", "Tasks")}
      </h2>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={
              "rounded-xl px-4 py-2 text-sm font-semibold transition-colors " +
              (activeTab === tab.key
                ? "bg-brand-700 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70")
            }
          >
            {t(locale, tab.labelAr, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {stats.done} / {stats.total} {t(locale, "مكتمل", "done")}
            </span>
            <span>{stats.percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: stats.percent + "%" }}
            />
          </div>
        </div>
      )}

      {/* Add form */}
      <div className="mb-4 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t(
                locale,
                activeTab === "teacher" ? "عنوان المهمة للمدرس..." : "عنوان المهمة للطلاب...",
                activeTab === "teacher" ? "Teacher task title..." : "Student task title...",
              )}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(locale, "ملاحظة اختيارية...", "Optional note...")}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              className="w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!title.trim()}
            className="inline-flex h-fit items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            <PlusCircle size={16} />
            {t(locale, "إضافة", "Add")}
          </button>
        </div>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t(
            locale,
            activeTab === "teacher"
              ? "لا توجد مهام للمدرس بعد"
              : "لا توجد مهام للطلاب بعد",
            activeTab === "teacher"
              ? "No teacher tasks yet"
              : "No student tasks yet",
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={
                "flex items-start gap-3 rounded-2xl border p-4 transition-colors " +
                (task.status === "done"
                  ? "border-success-200 bg-success-50/50 dark:border-success-900 dark:bg-success-950/20"
                  : "border-border bg-background")
              }
            >
              <button
                type="button"
                onClick={() => handleToggle(task.id)}
                className="mt-0.5 shrink-0"
                title={task.status === "done" ? "Mark pending" : "Mark done"}
              >
                {task.status === "done" ? (
                  <CheckCircle2 size={20} className="text-success-600" />
                ) : (
                  <Circle size={20} className="text-muted-foreground" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={
                    "text-sm font-semibold " +
                    (task.status === "done"
                      ? "text-muted-foreground line-through"
                      : "text-foreground")
                  }
                >
                  {task.title}
                </p>
                {task.notes && (
                  <p className="mt-1 text-xs text-muted-foreground">{task.notes}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950/30"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
