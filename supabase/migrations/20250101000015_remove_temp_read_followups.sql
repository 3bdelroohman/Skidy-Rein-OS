-- Migration 015: Remove temporary follow-ups read policy safely
-- Preconditions:
-- - Migration 014 updated follow_ups_all to include ops.
-- - Browser testing confirmed sales/ops/admin follow-up flows still work.
--
-- Removed policy:
-- - temp_read_follow_ups

DROP POLICY IF EXISTS temp_read_follow_ups ON public.follow_ups;
