-- Migration 018: Remove temporary academic operations read policies safely
-- Preconditions:
-- - Migration 017 added SELECT policies for admin/owner/ops/sales.
-- - Browser testing confirmed sales/ops/admin academic flows still work.
--
-- Removed policies:
-- - temp_read_classes
-- - temp_read_class_enrollments
-- - temp_read_sessions
-- - temp_read_attendance

DROP POLICY IF EXISTS temp_read_classes ON public.classes;
DROP POLICY IF EXISTS temp_read_class_enrollments ON public.class_enrollments;
DROP POLICY IF EXISTS temp_read_sessions ON public.sessions;
DROP POLICY IF EXISTS temp_read_attendance ON public.attendance;
