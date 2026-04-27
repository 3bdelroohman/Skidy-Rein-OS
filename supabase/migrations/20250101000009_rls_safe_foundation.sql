-- Migration 009: RLS Safe Foundation
-- Purpose:
-- 1) Add safe parent read access for sales so Account Center / Students ownership views keep working.
-- 2) Add safe team profile read access for authenticated users so assigned_to UUID can resolve to employee names.
-- 3) Do NOT remove temp_read_* policies yet. They will be removed only after role-based browser testing.

-- ------------------------------------------------------------
-- Parents
-- Sales needs parent read access because students and account queues
-- show parent name/phone and ownership context.
-- ------------------------------------------------------------

DROP POLICY IF EXISTS parents_select ON public.parents;

CREATE POLICY parents_select
ON public.parents
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text, 'sales'::text])
);

-- Keep modify restricted to admin/owner/ops only.
DROP POLICY IF EXISTS parents_modify ON public.parents;

CREATE POLICY parents_modify
ON public.parents
FOR ALL
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text])
)
WITH CHECK (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text])
);

-- ------------------------------------------------------------
-- Profiles
-- Authenticated team members need to read basic profile rows
-- to resolve assigned_to UUID values into names in the UI.
--
-- This keeps admin/owner full management policy as-is,
-- and adds a SELECT policy for authenticated active team profiles.
-- ------------------------------------------------------------

DROP POLICY IF EXISTS profiles_team_select ON public.profiles;

CREATE POLICY profiles_team_select
ON public.profiles
FOR SELECT
TO authenticated
USING (
  is_active = true
);

-- Preserve own profile update.
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;

CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Preserve admin/owner full profile management.
DROP POLICY IF EXISTS profiles_admin_all ON public.profiles;

CREATE POLICY profiles_admin_all
ON public.profiles
FOR ALL
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
)
WITH CHECK (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
);
