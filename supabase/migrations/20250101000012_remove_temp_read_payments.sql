-- Migration 012: Remove temporary payments read policy safely
-- Preconditions:
-- - payments_select allows admin/owner/sales/ops to read payments.
-- - Browser testing confirmed sales/ops/admin payment flows still work.
--
-- Removed policy:
-- - temp_read_payments

DROP POLICY IF EXISTS temp_read_payments ON public.payments;
