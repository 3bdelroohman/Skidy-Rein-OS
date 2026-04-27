-- Migration 022: Remove final temporary read policies
-- Preconditions:
-- - app_settings_select already restricts reads to admin/owner.
-- - audit_log_select already restricts reads to admin/owner.
-- - audit_log_insert remains available for audit triggers.
--
-- Removed policies:
-- - temp_read_app_settings
-- - temp_read_audit_log

DROP POLICY IF EXISTS temp_read_app_settings ON public.app_settings;
DROP POLICY IF EXISTS temp_read_audit_log ON public.audit_log;
