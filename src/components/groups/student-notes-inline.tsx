"use client";





import { useEffect, useState } from "react";


import { toast } from "sonner";


import { MessageSquarePlus, Trash2, StickyNote } from "lucide-react";


import { useUIStore } from "@/stores/ui-store";


import { t } from "@/lib/locale";


import {


  addStudentNote,


  deleteStudentNote,


  getStudentNotes,


} from "@/services/student-progress-notes.service";


import type { StudentProgressNote } from "@/types/crm";





interface Props {


  groupId: string;


  studentId: string;


}





export default function StudentNotesInline({ groupId, studentId }: Props) {


  const locale = useUIStore((s) => s.locale);





  const [notes, setNotes] = useState<StudentProgressNote[]>([]);


  const [open, setOpen] = useState(false);


  const [draft, setDraft] = useState("");





  function reload() {


    setNotes(getStudentNotes(groupId, studentId));


  }





  useEffect(() => {


    reload();


    // eslint-disable-next-line react-hooks/exhaustive-deps


  }, [groupId, studentId]);





  function handleAdd() {


    const trimmed = draft.trim();


    if (!trimmed) return;


    addStudentNote({ groupId, studentId, note: trimmed });


    setDraft("");


    reload();


    toast.success(t(locale, "تمت إضافة الملاحظة", "Note added"));


  }





  function handleDelete(id: string) {


    const ok = window.confirm(t(locale, "حذف هذه الملاحظة؟", "Delete this note?"));


    if (!ok) return;


    deleteStudentNote(id);


    reload();


    toast.success(t(locale, "تم حذف الملاحظة", "Note deleted"));


  }





  function formatDate(iso: string): string {


    try {


      return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {


        month: "short",


        day: "numeric",


        hour: "2-digit",


        minute: "2-digit",


      });


    } catch {


      return iso;


    }


  }





  return (


    <div className="mt-2 w-full">


      <button


        type="button"


        onClick={() => setOpen(!open)}


        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950/30"


      >


        <StickyNote size={13} />


        {t(locale, "ملاحظات الأداء", "Progress notes")}


        {notes.length > 0 && (


          <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">


            {notes.length}


          </span>


        )}


      </button>





      {open && (


        <div className="mt-2 rounded-xl border border-border bg-muted/30 p-3">


          {/* Add form */}


          <div className="mb-3 flex gap-2">


            <input


              value={draft}


              onChange={(e) => setDraft(e.target.value)}


              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}


              placeholder={t(locale, "أضف ملاحظة على أداء الطالب...", "Add a note about student performance...")}


              className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:border-transparent focus:ring-2 focus:ring-ring"


            />


            <button


              type="button"


              onClick={handleAdd}


              disabled={!draft.trim()}


              className="inline-flex items-center gap-1 rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"


            >


              <MessageSquarePlus size={13} />


              {t(locale, "أضف", "Add")}


            </button>


          </div>





          {/* Notes list */}


          {notes.length === 0 ? (


            <p className="py-3 text-center text-xs text-muted-foreground">


              {t(locale, "لا توجد ملاحظات بعد", "No notes yet")}


            </p>


          ) : (


            <div className="space-y-2">


              {notes.map((n) => (


                <div


                  key={n.id}


                  className="flex items-start gap-2 rounded-lg border border-border bg-card p-2.5"


                >


                  <div className="min-w-0 flex-1">


                    <p className="text-xs text-foreground">{n.note}</p>


                    <p className="mt-1 text-[10px] text-muted-foreground">{formatDate(n.createdAt)}</p>


                  </div>


                  <button


                    type="button"


                    onClick={() => handleDelete(n.id)}


                    className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950/30"


                  >


                    <Trash2 size={13} />


                  </button>


                </div>


              ))}


            </div>


          )}


        </div>


      )}


    </div>


  );


}


