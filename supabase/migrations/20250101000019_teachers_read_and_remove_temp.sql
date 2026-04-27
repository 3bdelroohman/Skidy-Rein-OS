-- Migration 019: Teachers read foundation and remove temporary teacher read policies
-- Purpose:
-- - Allow sales to read teacher basic data for operational context.
-- - Keep teacher finance restricted to admin/owner/ops.
-- - Remove temp_read_teachers and temp_read_teacher_finance_config.

DROP POLICY IF EXISTS teachers_select ON public.teachers;

CREATE POLICY teachers_select
ON public.teachers
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'ops'::text, 'sales'::text])
);

DROP POLICY IF EXISTS temp_read_teachers ON public.teachers;
DROP POLICY IF EXISTS temp_read_teacher_finance_config ON public.teacher_finance_config;
