import { listLeads } from "@/services/leads.service";
import { listParents } from "@/services/parents.service";
import { listStudents } from "@/services/students.service";

function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[Ù‹-ÙŸ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePhone(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length > 11) return digits.slice(2);
  if (digits.startsWith("2") && digits.length === 12) return digits.slice(1);
  return digits;
}

function sameName(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizeName(a);
  const right = normalizeName(b);
  return left.length > 0 && left === right;
}

function samePhone(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normalizePhone(a);
  const right = normalizePhone(b);
  return left.length > 0 && left === right;
}

export interface DuplicateCheckResult {
  blocking: boolean;
  messageAr: string;
  messageEn: string;
}

export async function guardLeadDuplicate(input: {
  childName: string;
  parentName: string;
  parentPhone: string;
  parentWhatsapp?: string | null;
}): Promise<DuplicateCheckResult | null> {
  const [leads, parents, students] = await Promise.all([listLeads(), listParents(), listStudents()]);

  const sameLeadPhone = leads.find((lead) => samePhone(lead.parentPhone, input.parentPhone) || samePhone(lead.parentPhone, input.parentWhatsapp));
  if (sameLeadPhone) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ Ø¹Ù…ÙŠÙ„ Ù…Ø­ØªÙ…Ù„ Ø¨Ù†ÙØ³ Ø±Ù‚Ù… ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø± Ø¨Ø§Ù„ÙØ¹Ù„: ${sameLeadPhone.parentName} / ${sameLeadPhone.childName}`,
      messageEn: `A lead with the same parent phone already exists: ${sameLeadPhone.parentName} / ${sameLeadPhone.childName}`,
    };
  }

  const sameParent = parents.find((parent) => samePhone(parent.phone, input.parentPhone) || samePhone(parent.whatsapp, input.parentWhatsapp));
  if (sameParent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø±Ù‚Ù…: ${sameParent.fullName}`,
      messageEn: `A parent with the same phone is already registered: ${sameParent.fullName}`,
    };
  }

  const sameStudent = students.find((student) => sameName(student.fullName, input.childName) && (samePhone(student.parentPhone, input.parentPhone) || sameName(student.parentName, input.parentName)));
  if (sameStudent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ Ø·Ø§Ù„Ø¨ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø§Ø³Ù… ÙˆØ¨ÙŠØ§Ù†Ø§Øª ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±: ${sameStudent.fullName}`,
      messageEn: `A student with the same name and parent details already exists: ${sameStudent.fullName}`,
    };
  }

  return null;
}

export async function guardParentDuplicate(input: {
  fullName: string;
  phone: string;
  whatsapp?: string | null;
}): Promise<DuplicateCheckResult | null> {
  const [parents, leads] = await Promise.all([listParents(), listLeads()]);

  const sameParent = parents.find((parent) => samePhone(parent.phone, input.phone) || samePhone(parent.whatsapp, input.whatsapp));
  if (sameParent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ø¨Ù†ÙØ³ Ø§Ù„Ø±Ù‚Ù… Ø¨Ø§Ù„ÙØ¹Ù„: ${sameParent.fullName}`,
      messageEn: `A parent with the same phone already exists: ${sameParent.fullName}`,
    };
  }

  const sameLead = leads.find((lead) => samePhone(lead.parentPhone, input.phone) || sameName(lead.parentName, input.fullName));
  if (sameLead) {
    return {
      blocking: true,
      messageAr: `Ù‡Ø°Ø§ ÙˆÙ„ÙŠ Ø£Ù…Ø± Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¯Ø§Ø®Ù„ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙŠÙ†: ${sameLead.parentName}`,
      messageEn: `This parent already exists in leads: ${sameLead.parentName}`,
    };
  }

  return null;
}

export async function guardStudentDuplicate(input: {
  fullName: string;
  parentName: string;
  parentPhone: string;
  parentId?: string | null;
}): Promise<DuplicateCheckResult | null> {
  const [students, leads] = await Promise.all([listStudents(), listLeads()]);

  const sameStudent = students.find((student) => {
    if (input.parentId && student.parentId && student.parentId === input.parentId && sameName(student.fullName, input.fullName)) return true;
    if (sameName(student.fullName, input.fullName) && samePhone(student.parentPhone, input.parentPhone)) return true;
    return sameName(student.fullName, input.fullName) && sameName(student.parentName, input.parentName);
  });

  if (sameStudent) {
    return {
      blocking: true,
      messageAr: `ÙŠÙˆØ¬Ø¯ Ø·Ø§Ù„Ø¨ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù†ÙØ³ Ø§Ù„Ø§Ø³Ù… ØªØ­Øª Ù†ÙØ³ ÙˆÙ„ÙŠ Ø§Ù„Ø£Ù…Ø±: ${sameStudent.fullName}`,
      messageEn: `A student with the same name already exists under the same parent: ${sameStudent.fullName}`,
    };
  }

  const sameLead = leads.find((lead) => sameName(lead.childName, input.fullName) && (samePhone(lead.parentPhone, input.parentPhone) || sameName(lead.parentName, input.parentName)));
  if (sameLead) {
    return {
      blocking: true,
      messageAr: `Ù‡Ø°Ø§ Ø§Ù„Ø·Ø§Ù„Ø¨ Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø§Ù„ÙØ¹Ù„ ÙÙŠ Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙŠÙ†: ${sameLead.childName}`,
      messageEn: `This student already exists in leads: ${sameLead.childName}`,
    };
  }

  return null;
}
