"use client";







import { useEffect, useMemo, useState } from "react";



import Link from "next/link";



import { Flame, LayoutGrid, List, Loader2, PlusCircle, TrendingUp, Users } from "lucide-react";



import { StageBadge } from "@/components/leads/stage-badge";



import { TemperatureBadge } from "@/components/leads/temperature-badge";



import { LeadsKanban } from "@/components/leads/leads-kanban";



import { TEMPERATURE_EN_LABELS, TEMPERATURE_LABELS } from "@/config/labels";



import { STAGE_CONFIGS } from "@/config/stages";



import { getStageLabel } from "@/lib/locale";



import { useUIStore } from "@/stores/ui-store";



import { cn } from "@/lib/utils";



import { listLeads } from "@/services/leads.service";



import type { LeadListItem } from "@/types/crm";



import type { LeadStage, LeadTemperature } from "@/types/common.types";



import { Button } from "@/components/ui/button";



import { PageHeader } from "@/components/ui/page-header";



import { StatCard } from "@/components/ui/stat-card";



import { SearchBar } from "@/components/ui/search-bar";



import { EmptyState } from "@/components/ui/empty-state";







export default function LeadsPage() {



  const locale = useUIStore((state) => state.locale);



  const isAr = locale === "ar";



  const [search, setSearch] = useState("جادون");



  const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all");



  const [tempFilter, setTempFilter] = useState<LeadTemperature | "all">("all");



  const [view, setView] = useState<"table" | "kanban">("table");



  const [leads, setLeads] = useState<LeadListItem[]>([]);



  const [loading, setLoading] = useState(true);







  useEffect(() => {



    let isMounted = true;



    listLeads()



      .then((data) => { if (isMounted) setLeads(data); })



      .finally(() => { if (isMounted) setLoading(false); });



    return () => { isMounted = false; };



  }, []);







  // ── Stats (على كل الـ leads بدون فلتر) ────────────────────────────────────



  const stats = useMemo(() => {



    const total = leads.length;



    const hot = leads.filter((l) => l.temperature === "hot").length;



    const pending = leads.filter(



      (l) => l.stage !== "won" && l.stage !== "lost"



    ).length;



    const converted = leads.filter((l) => l.stage === "won").length;



    const conversionRate =



      total > 0 ? Math.round((converted / total) * 100) : 0;



    return { total, hot, pending, conversionRate };



  }, [leads]);







  // ── Filtered list ──────────────────────────────────────────────────────────



  const filtered = useMemo(() => {



    const q = search.trim().toLowerCase();



    return leads.filter((lead) => {



      if (stageFilter !== "all" && lead.stage !== stageFilter) return false;



      if (tempFilter !== "all" && lead.temperature !== tempFilter) return false;



      if (!q) return true;



      return (



        lead.parentName.toLowerCase().includes(q) ||



        lead.parentPhone.includes(q) ||



        lead.childName.toLowerCase().includes(q) ||



        lead.assignedToName.toLowerCase().includes(q)



      );



    });



  }, [leads, search, stageFilter, tempFilter]);







  const hasResults = filtered.length > 0;



  const stageKeys = Object.keys(STAGE_CONFIGS) as LeadStage[];







  // ── Loading ────────────────────────────────────────────────────────────────



  if (loading) {



    return (



      <div className="flex min-h-[40vh] items-center justify-center">



        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-500)]" />



      </div>



    );



  }







  return (



    <div className="space-y-6 p-4 sm:p-6">



      {/* Header */}



      <PageHeader



        title={isAr ? "العملاء المحتملون" : "Leads"}



        subtitle={



          isAr



            ? `${stats.total} lead مسجّل`



            : `${stats.total} lead${stats.total !== 1 ? "s" : "جادون"} registered`



        }



        actions={



          <Link href="/leads/new">



            <Button size="sm" className="gap-1.5">



              <PlusCircle className="h-4 w-4" />



              {isAr ? "إضافة lead" : "Add Lead"}



            </Button>



          </Link>



        }



      />







      {/* Stats */}



      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">



        <StatCard



          tone="brand"



          label={isAr ? "إجمالي الـ Leads" : "Total Leads"}



          value={stats.total}



          icon={<Users className="h-5 w-5" />}



        />



        <StatCard



          tone="danger"



label={isAr ? "جادون" : "Hot Leads"}



          value={stats.hot}



          icon={<Flame className="h-5 w-5" />}



        />



        <StatCard



          tone="warning"



          label={isAr ? "قيد المتابعة" : "In Progress"}



          value={stats.pending}



          icon={<Users className="h-5 w-5" />}



        />



        <StatCard



          tone="success"



          label={isAr ? "نسبة التحويل" : "Conversion Rate"}



          value={`${stats.conversionRate}%`}



          icon={<TrendingUp className="h-5 w-5" />}



        />



      </div>







      {/* Filters + View toggle */}



      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">



        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">



          <SearchBar



            value={search}



            onChange={setSearch}



            placeholder={isAr ? "ابحث بالاسم أو التليفون أو الطالب…" : "Search by name, phone, or child…"}



            className="sm:max-w-xs"



          />



          <select



            value={stageFilter}



            onChange={(e) => setStageFilter(e.target.value as LeadStage | "all")}



            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"



          >



            <option value="all">{isAr ? "كل المراحل" : "All Stages"}</option>



            {stageKeys.map((s) => (



              <option key={s} value={s}>



                {getStageLabel(s, locale)}



              </option>



            ))}



          </select>



          <select



            value={tempFilter}



            onChange={(e) => setTempFilter(e.target.value as LeadTemperature | "all")}



            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"



          >



            <option value="all">{isAr ? "كل الدرجات" : "All Temps"}</option>



            <option value="hot">{isAr ? TEMPERATURE_LABELS.hot : TEMPERATURE_EN_LABELS.hot}</option>



            <option value="warm">{isAr ? TEMPERATURE_LABELS.warm : TEMPERATURE_EN_LABELS.warm}</option>



            <option value="cold">{isAr ? TEMPERATURE_LABELS.cold : TEMPERATURE_EN_LABELS.cold}</option>



          </select>



        </div>







        {/* View toggle */}



        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1 self-start sm:self-auto">



          <button



            onClick={() => setView("table")}



            className={cn(



              "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",



              view === "table"



                ? "bg-[var(--color-brand-500)] text-white"



                : "text-muted-foreground hover:text-foreground"



            )}



          >



            <List className="h-3.5 w-3.5" />



            {isAr ? "قائمة" : "List"}



          </button>



          <button



            onClick={() => setView("kanban")}



            className={cn(



              "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",



              view === "kanban"



                ? "bg-[var(--color-brand-500)] text-white"



                : "text-muted-foreground hover:text-foreground"



            )}



          >



            <LayoutGrid className="h-3.5 w-3.5" />



            {isAr ? "كانبان" : "Kanban"}



          </button>



        </div>



      </div>







      {/* Kanban view */}



      {view === "kanban" && (



        <LeadsKanban leads={filtered} />



      )}







      {/* List view */}



      {view === "table" && (



        <>



          {!hasResults ? (



            <EmptyState



              icon={<Users className="h-10 w-10" />}



              title={



                search || stageFilter !== "all" || tempFilter !== "all"



                  ? (isAr ? "لا توجد نتائج" : "No results found")



                  : (isAr ? "لا يوجد leads بعد" : "No leads yet")



              }



              description={



                search || stageFilter !== "all" || tempFilter !== "all"



                  ? (isAr ? "جرّب تغيير الفلاتر أو كلمة البحث" : "Try changing your filters or search")



                  : (isAr ? "ابدأ بإضافة أول lead في النظام" : "Start by adding the first lead")



              }



              action={



                !search && stageFilter === "all" && tempFilter === "all" ? (



                  <Link href="/leads/new">



                    <Button size="sm" className="gap-1.5">



                      <PlusCircle className="h-4 w-4" />



                      {isAr ? "إضافة lead" : "Add Lead"}



                    </Button>



                  </Link>



                ) : undefined



              }



            />



          ) : (



            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">



              {filtered.map((lead) => (



                <li key={lead.id}>



                  <Link



                    href={`/leads/${lead.id}`}



                    className="group block h-full rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-[var(--color-brand-300)] hover:-translate-y-0.5"



                  >



                    {/* Parent name + temperature */}



                    <div className="mb-2 flex items-start justify-between gap-2">



                      <h3 className="font-semibold text-foreground leading-tight">



                        {lead.parentName}



                      </h3>



                      <TemperatureBadge temperature={lead.temperature} />



                    </div>







                    {/* Child name + age */}



                    <p className="mb-3 text-sm text-muted-foreground">



                      {lead.childName}



                      {lead.childAge ? (



                        <span className="ms-1 text-xs">



                          ({lead.childAge} {isAr ? "سنة" : "y/o"})



                        </span>



                      ) : null}



                    </p>







                    {/* Stage badge */}



                    <div className="mb-3">



                      <StageBadge stage={lead.stage} />



                    </div>







                    {/* Assigned to */}



                    <p className="mb-3 text-xs text-muted-foreground">



                      {isAr ? "مسؤول: " : "Assigned: "}



                      <span className="font-medium text-foreground">



                        {lead.assignedToName}



                      </span>



                    </p>







                    {/* Last contact */}



                    {lead.lastContactAt && (



                      <p className="text-xs text-muted-foreground">



                        {isAr ? "آخر تواصل: " : "Last contact: "}



                        {new Date(lead.lastContactAt).toLocaleDateString(



                          isAr ? "ar-EG" : "en-GB",



                          { day: "numeric", month: "short", year: "numeric" }



                        )}



                      </p>



                    )}







                    {/* Contact */}



                    <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">



                      <p dir="ltr">{lead.parentPhone}</p>



                    </div>



                  </Link>



                </li>



              ))}



            </ul>



          )}



        </>



      )}



    </div>



  );



}



