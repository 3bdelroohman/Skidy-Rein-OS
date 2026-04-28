-- Migration 023: Allow sales to create/update parents and students
-- Purpose:
-- Fix /students/new for Account Managers after RLS cleanup.
-- Sales can create/update parents and students, but cannot delete them.

DROP POLICY IF EXISTS parents_sales_insert ON public.parents;
CREATE POLICY parents_sales_insert
ON public.parents
FOR INSERT
WITH CHECK (
  get_my_role() = 'sales'
);

DROP POLICY IF EXISTS parents_sales_update ON public.parents;
CREATE POLICY parents_sales_update
ON public.parents
FOR UPDATE
USING (
  get_my_role() = 'sales'
)
WITH CHECK (
  get_my_role() = 'sales'
);

DROP POLICY IF EXISTS students_sales_insert ON public.students;
CREATE POLICY students_sales_insert
ON public.students
FOR INSERT
WITH CHECK (
  get_my_role() = 'sales'
);

DROP POLICY IF EXISTS students_sales_update ON public.students;
CREATE POLICY students_sales_update
ON public.students
FOR UPDATE
USING (
  get_my_role() = 'sales'
)
WITH CHECK (
  get_my_role() = 'sales'
);
