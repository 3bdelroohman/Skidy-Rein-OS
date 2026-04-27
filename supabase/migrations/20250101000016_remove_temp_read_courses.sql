-- Migration 016: Remove temporary courses read policy safely
-- Preconditions:
-- - courses_select already allows public SELECT.
-- - Browser testing confirmed course dropdowns still work.
--
-- Removed policy:
-- - temp_read_courses

DROP POLICY IF EXISTS temp_read_courses ON public.courses;
