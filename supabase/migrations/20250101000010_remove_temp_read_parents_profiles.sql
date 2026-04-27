-- Migration 010: Remove first temporary read policies safely
-- Preconditions:
-- - Migration 009 added parents_select for sales.
-- - Migration 009 added profiles_team_select for authenticated active profiles.
-- - Browser testing confirmed sales/ops/admin flows still work.
--
-- Removed policies:
-- - temp_read_parents
-- - temp_read_profiles

DROP POLICY IF EXISTS temp_read_parents ON public.parents;
DROP POLICY IF EXISTS temp_read_profiles ON public.profiles;
