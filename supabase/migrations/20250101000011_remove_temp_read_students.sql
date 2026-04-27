-- Migration 011: Remove temporary students read policy safely
-- Preconditions:
-- - students_select already allows admin/owner/ops/sales to read students.
-- - Browser testing confirmed sales/ops/admin student flows still work.
--
-- Removed policy:
-- - temp_read_students

DROP POLICY IF EXISTS temp_read_students ON public.students;
