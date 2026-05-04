import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/common.types";

const VALID_ROLES: UserRole[] = ["admin", "sales", "ops", "owner"];

async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Can't set cookies in Server Components — expected
          }
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Query profile — depends on RLS SELECT policy
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Log errors without leaking PII (no email/role in logs)
  if (profileError) {
    console.error("[auth] Profile query error:", profileError.message);
    return null;
  }

  if (!profile) {
    console.warn("[auth] No profile found for authenticated user");
    return null;
  }

  // Validate role — must exist and be valid; no fallback to elevated roles
  const dbRole = profile.role as string | undefined;
  if (!dbRole || !VALID_ROLES.includes(dbRole as UserRole)) {
    console.error("[auth] Invalid or missing role on profile");
    return null;
  }

  const role: UserRole = dbRole as UserRole;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      profile?.full_name ??
      user.email?.split("@")[0] ??
      "User",
    fullNameAr:
      profile?.full_name_ar ??
      "مستخدم",
    role,
    avatarUrl: profile?.avatar_url ?? null,
    isActive: profile?.is_active !== false,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
