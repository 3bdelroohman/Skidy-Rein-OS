"use client";

import { listLeads } from "@/services/leads.service";
import { listParentsWithRelations, listStudentsWithRelations } from "@/services/relations.service";

export interface OwnershipBucket {
  ownerName: string;
  leadsCount: number;
  parentsCount: number;
  studentsCount: number;
  total: number;
}

export interface OwnershipUnassignedItem {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  type: "lead" | "parent" | "student";
}

export interface OwnershipCenterData {
  buckets: OwnershipBucket[];
  unassignedLeads: OwnershipUnassignedItem[];
  unassignedParents: OwnershipUnassignedItem[];
  unassignedStudents: OwnershipUnassignedItem[];
  totals: {
    owners: number;
    leads: number;
    parents: number;
    students: number;
    unassigned: number;
  };
}

function normalizeOwnerName(value: string | null | undefined): string | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  if (trimmed === "غير مخصص" || trimmed.toLowerCase() === "unassigned") return null;
  return trimmed;
}

function ensureBucket(map: Map<string, OwnershipBucket>, ownerName: string): OwnershipBucket {
  const existing = map.get(ownerName);
  if (existing) return existing;

  const bucket: OwnershipBucket = {
    ownerName,
    leadsCount: 0,
    parentsCount: 0,
    studentsCount: 0,
    total: 0,
  };

  map.set(ownerName, bucket);
  return bucket;
}

export async function getOwnershipCenterData(): Promise<OwnershipCenterData> {
  const [leads, parents, students] = await Promise.all([
    listLeads(),
    listParentsWithRelations(),
    listStudentsWithRelations(),
  ]);

  const bucketsMap = new Map<string, OwnershipBucket>();
  const unassignedLeads: OwnershipUnassignedItem[] = [];
  const unassignedParents: OwnershipUnassignedItem[] = [];
  const unassignedStudents: OwnershipUnassignedItem[] = [];

  for (const lead of leads) {
    const ownerName = normalizeOwnerName(lead.assignedToName);

    if (!ownerName) {
      unassignedLeads.push({
        id: lead.id,
        label: lead.childName,
        subtitle: [lead.parentName, lead.parentPhone, lead.stage].filter(Boolean).join(" — "),
        href: "/leads/" + lead.id,
        type: "lead",
      });
      continue;
    }

    const bucket = ensureBucket(bucketsMap, ownerName);
    bucket.leadsCount += 1;
    bucket.total += 1;
  }

  for (const parent of parents) {
    const ownerName = normalizeOwnerName(parent.ownerName);

    if (!ownerName) {
      unassignedParents.push({
        id: parent.id,
        label: parent.fullName,
        subtitle: [parent.phone, String(parent.childrenCount) + " children"].filter(Boolean).join(" — "),
        href: "/parents/" + parent.id,
        type: "parent",
      });
      continue;
    }

    const bucket = ensureBucket(bucketsMap, ownerName);
    bucket.parentsCount += 1;
    bucket.total += 1;
  }

  for (const student of students) {
    if (student.id.startsWith("lead-projection-student:")) continue;

    const ownerName = normalizeOwnerName(student.ownerName);

    if (!ownerName) {
      unassignedStudents.push({
        id: student.id,
        label: student.fullName,
        subtitle: [student.parentName, student.parentPhone, student.currentCourse ?? ""].filter(Boolean).join(" — "),
        href: "/students/" + student.id,
        type: "student",
      });
      continue;
    }

    const bucket = ensureBucket(bucketsMap, ownerName);
    bucket.studentsCount += 1;
    bucket.total += 1;
  }

  const realStudents = students.filter((student) => !student.id.startsWith("lead-projection-student:"));
  const buckets = Array.from(bucketsMap.values()).sort((a, b) => b.total - a.total || a.ownerName.localeCompare(b.ownerName));

  return {
    buckets,
    unassignedLeads,
    unassignedParents,
    unassignedStudents,
    totals: {
      owners: buckets.length,
      leads: leads.length,
      parents: parents.length,
      students: realStudents.length,
      unassigned: unassignedLeads.length + unassignedParents.length + unassignedStudents.length,
    },
  };
}
