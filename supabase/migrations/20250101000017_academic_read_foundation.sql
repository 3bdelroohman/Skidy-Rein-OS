-- Migration 017: Academic Read Foundation
-- Purpose:
-- Add official SELECT policies for sales on academic operational tables before removing temp_read_* policies.
-- Writes remain restricted by existing *_all policies to admin/owner/ops.

DROP POLICY IF EXISTS classes_select ON public.classes;
CREATE POLICY classes_select
ON public.classes
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text, 'sales'::text])
);

DROP POLICY IF EXISTS class_enrollments_select ON public.class_enrollments;
CREATE POLICY class_enrollments_select
ON public.class_enrollments
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text, 'sales'::text])
);

DROP POLICY IF EXISTS sessions_select ON public.sessions;
CREATE POLICY sessions_select
ON public.sessions
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text, 'sales'::text])
);

DROP POLICY IF EXISTS attendance_select ON public.attendance;
CREATE POLICY attendance_select
ON public.attendance
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text, 'sales'::text])
);
