import {
  Layers3,
  LayoutDashboard,
  Zap,
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  Wallet,
  CircleDollarSign,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/common.types";

/**
 * Sidebar navigation â€” single source of truth
 * Owner = same access as Admin
 * @author Abdelrahman
 */

export interface NavigationItem {
  titleAr: string;
  titleEn: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  badge?: number;
}

export interface NavigationGroup {
  labelAr: string;
  labelEn: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    labelAr: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
    labelEn: "Overview",
    items: [
      {
        titleAr: "Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…",
        titleEn: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        roles: ["admin", "owner", "sales", "ops"],
      },
    ],
  },
  {
    labelAr: "Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª",
    labelEn: "Sales",
    items: [
      {
        titleAr: "Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ù…Ø­ØªÙ…Ù„ÙŠÙ†",
        titleEn: "Leads",
        href: "/leads",
        icon: Users,
        roles: ["admin", "owner", "sales"],
      },
      {
        titleAr: "Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø§Øª",
        titleEn: "Follow-ups",
        href: "/follow-ups",
        icon: ClipboardCheck,
        roles: ["admin", "owner", "sales", "ops"],
      },
      {
        titleAr: "Ù…Ø±ÙƒØ² Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª",
        titleEn: "Action Center",
        href: "/action-center",
        icon: Zap,
        roles: ["admin", "owner", "sales", "ops"],
      },
    ],
  },
  {
    labelAr: "Ø§Ù„Ø£ÙƒØ§Ø¯ÙŠÙ…ÙŠØ©",
    labelEn: "Academy",
    items: [
      {
        titleAr: "Ø§Ù„Ø·Ù„Ø§Ø¨",
        titleEn: "Students",
        href: "/students",
        icon: GraduationCap,
        roles: ["admin", "owner", "sales", "ops"],
      },
      {
        titleAr: "Ø£ÙˆÙ„ÙŠØ§Ø¡ Ø§Ù„Ø£Ù…ÙˆØ±",
        titleEn: "Parents",
        href: "/parents",
        icon: UserCircle,
        roles: ["admin", "owner", "ops"],
      },
      {
        titleAr: "Ø§Ù„Ù…Ø¯Ø±Ø³ÙŠÙ†",
        titleEn: "Teachers",
        href: "/teachers",
        icon: BookOpen,
        roles: ["admin", "owner", "ops"],
      },
      {
        titleAr: "Ø§Ù„Ø¬Ø¯ÙˆÙ„",
        titleEn: "Schedule",
        href: "/schedule",
        icon: CalendarDays,
        roles: ["admin", "owner", "ops"],
      },
      {
        titleAr: "Ù…Ø±ÙƒØ² Ø§Ù„Ø£ÙˆØ¨Ø±ÙŠØ´Ù†",
        titleEn: "Operations Center",
        href: "/operations-center",
        icon: ClipboardList,
        roles: ["admin", "owner", "ops"],
      },

      {
        titleAr: "Ø§Ù„Ø¬Ø±ÙˆØ¨Ø§Øª",
        titleEn: "Groups",
        href: "/groups",
        icon: Layers3,
        roles: ["admin", "owner", "ops"],
      },
    ],
  },
  {
    labelAr: "Ø§Ù„Ù…Ø§Ù„ÙŠØ©",
    labelEn: "Finance",
    items: [
      {
        titleAr: "Ù…Ø±ÙƒØ² Ø§Ù„Ø£ÙƒØ§ÙˆÙ†Øª",
        titleEn: "Account Center",
        href: "/account-center",
        icon: CircleDollarSign,
        roles: ["admin", "owner", "sales"],
      },

      {
        titleAr: "Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª",
        titleEn: "Payments",
        href: "/payments",
        icon: Wallet,
        roles: ["admin", "owner", "sales", "ops"],
      },
    ],
  },
  {
    labelAr: "Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª",
    labelEn: "Analytics",
    items: [
      {
        titleAr: "Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ±",
        titleEn: "Reports",
        href: "/reports",
        icon: BarChart3,
        roles: ["admin", "owner"],
      },
      {
        titleAr: "Ù…Ø±ÙƒØ² Ø§Ù„Ù…Ù„ÙƒÙŠØ©",
        titleEn: "Ownership Center",
        href: "/ownership-center",
        icon: ShieldCheck,
        roles: ["admin", "owner"],
      },
    ],
  },
  {
    labelAr: "Ø§Ù„Ù†Ø¸Ø§Ù…",
    labelEn: "System",
    items: [
      {
        titleAr: "Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª",
        titleEn: "Settings",
        href: "/settings",
        icon: Settings,
        roles: ["admin", "owner"],
      },
    ],
  },
];
