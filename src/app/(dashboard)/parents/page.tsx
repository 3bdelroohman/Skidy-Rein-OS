"use client";





import Link from "next/link";


import { useEffect, useMemo, useState } from "react";


import { Loader2, PlusCircle, Users, MessageCircle, Baby } from "lucide-react";


import { useUIStore } from "@/stores/ui-store";


import { listParentsWithRelations } from "@/services/relations.service";


import type { ParentListItem } from "@/types/crm";


import { Button } from "@/components/ui/button";


import { PageHeader } from "@/components/ui/page-header";


import { StatCard } from "@/components/ui/stat-card";


import { SearchBar } from "@/components/ui/search-bar";


import { EmptyState } from "@/components/ui/empty-state";





export default function ParentsPage() {


  const locale = useUIStore((state) => state.locale);


  const isAr = locale === "ar";


  const [search, setSearch] = useState("");


  const [parents, setParents] = useState<ParentListItem[]>([]);


  const [loading, setLoading] = useState(true);





  useEffect(() => {


    let isMounted = true;


    async function load() {


      setLoading(true);


      const data = await listParentsWithRelations();


      if (isMounted) {


        setParents(data);


        setLoading(false);


      }


    }


    load();


    return () => { isMounted = false; };


  }, []);





  // ── Stats ──────────────────────────────────────────────────────────────────


  const stats = useMemo(() => {


    const total = parents.length;


    const multiChildren = parents.filter((p) => p.childrenCount > 1).length;


    const hasWhatsapp = parents.filter((p) => !!p.whatsapp).length;


    const totalChildren = parents.reduce((acc, p) => acc + p.childrenCount, 0);


    return { total, multiChildren, hasWhatsapp, totalChildren };


  }, [parents]);





  // ── Filtered list ──────────────────────────────────────────────────────────


  const filtered = useMemo(() => {


    const q = search.trim().toLowerCase();


    if (!q) return parents;


    return parents.filter((parent) =>


      parent.fullName.toLowerCase().includes(q) ||


      parent.phone.includes(q) ||


      (parent.email ?? "").toLowerCase().includes(q) ||


      (parent.city ?? "").toLowerCase().includes(q) ||


      parent.children.some((c) => c.toLowerCase().includes(q))


    );


  }, [parents, search]);





  const hasResults = filtered.length > 0;





  // ── Loading state ──────────────────────────────────────────────────────────


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


        title={isAr ? "أولياء الأمور" : "Parents"}


        subtitle={


          isAr


            ? `${stats.total} ولي أمر مسجّل`


            : `${stats.total} parent${stats.total !== 1 ? "s" : ""} registered`


        }


        actions={


          <Link href="/parents/new">


            <Button size="sm" className="gap-1.5">


              <PlusCircle className="h-4 w-4" />


              {isAr ? "إضافة ولي أمر" : "Add Parent"}


            </Button>


          </Link>


        }


      />





      {/* Stats */}


      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">


        <StatCard


          tone="brand"


          label={isAr ? "إجمالي أولياء الأمور" : "Total Parents"}


          value={stats.total}


          icon={<Users className="h-5 w-5" />}


        />


        <StatCard


          tone="info"


          label={isAr ? "أكثر من طالب" : "Multiple Children"}


          value={stats.multiChildren}


          icon={<Baby className="h-5 w-5" />}


        />


        <StatCard


          tone="success"


          label={isAr ? "لديهم واتساب" : "On WhatsApp"}


          value={stats.hasWhatsapp}


          icon={<MessageCircle className="h-5 w-5" />}


        />


        <StatCard


          tone="neutral"


          label={isAr ? "إجمالي الأبناء" : "Total Children"}


          value={stats.totalChildren}


          icon={<Users className="h-5 w-5" />}


        />


      </div>





      {/* Search */}


      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">


        <SearchBar


          value={search}


          onChange={setSearch}


          placeholder={isAr ? "ابحث بالاسم أو التليفون أو اسم الطالب…" : "Search by name, phone, or child name…"}


          className="sm:max-w-xs"


        />


      </div>





      {/* List */}


      {!hasResults ? (


        <EmptyState


          icon={<Users className="h-10 w-10" />}


          title={


            search


              ? (isAr ? "لا توجد نتائج" : "No results found")


              : (isAr ? "لا يوجد أولياء أمور بعد" : "No parents yet")


          }


          description={


            search


              ? (isAr ? "جرّب تغيير كلمة البحث" : "Try changing your search")


              : (isAr ? "ابدأ بإضافة أول ولي أمر في النظام" : "Start by adding the first parent")


          }


          action={


            !search ? (


              <Link href="/parents/new">


                <Button size="sm" className="gap-1.5">


                  <PlusCircle className="h-4 w-4" />


                  {isAr ? "إضافة ولي أمر" : "Add Parent"}


                </Button>


              </Link>


            ) : undefined


          }


        />


      ) : (


        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">


          {filtered.map((parent) => (


            <li key={parent.id}>


              <Link


                href={`/parents/${parent.id}`}


                className="group block h-full rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-[var(--color-brand-300)] hover:-translate-y-0.5"


              >


                {/* Name + children count badge */}


                <div className="mb-3 flex items-start justify-between gap-2">


                  <h3 className="font-semibold text-foreground leading-tight">


                    {parent.fullName}


                  </h3>


                  <span className="shrink-0 rounded-full bg-[var(--color-brand-50)] px-2 py-0.5 text-xs font-medium text-[var(--color-brand-700)]">


                    {parent.childrenCount}{" "}


                    {isAr


                      ? parent.childrenCount === 1 ? "طالب" : "طلاب"


                      : parent.childrenCount === 1 ? "child" : "children"}


                  </span>


                </div>





                {/* City */}


                {parent.city && (


                  <p className="mb-3 text-xs text-muted-foreground">{parent.city}</p>


                )}





                {/* Children names */}


                {parent.children.length > 0 && (


                  <div className="mb-3 flex flex-wrap gap-1">


                    {parent.children.slice(0, 3).map((child, childIndex) => (


                      <span


                        key={`${parent.id}-${childIndex}`}


                        className="rounded-full bg-[var(--color-neutral-100)] px-2 py-0.5 text-xs text-[var(--color-neutral-700)]"


                      >


                        {child}


                      </span>


                    ))}


                    {parent.children.length > 3 && (


                      <span className="rounded-full bg-[var(--color-neutral-100)] px-2 py-0.5 text-xs text-[var(--color-neutral-600)]">


                        +{parent.children.length - 3}


                      </span>


                    )}


                  </div>


                )}





                {/* Owner */}


                {parent.ownerName && (


                  <p className="mb-3 text-xs text-muted-foreground">


                    {isAr ? "المسؤول: " : "Owner: "}


                    <span className="font-medium text-foreground">{parent.ownerName}</span>


                  </p>


                )}





                {/* Contact */}


                <div className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground space-y-1">


                  <p dir="ltr">{parent.phone}</p>


                  {parent.whatsapp && parent.whatsapp !== parent.phone && (


                    <p dir="ltr" className="flex items-center gap-1">


                      <MessageCircle className="h-3 w-3 shrink-0" />


                      {parent.whatsapp}


                    </p>


                  )}


                  {parent.email && (


                    <p className="truncate" dir="ltr">{parent.email}</p>


                  )}


                </div>


              </Link>


            </li>


          ))}


        </ul>


      )}


    </div>


  );


}


