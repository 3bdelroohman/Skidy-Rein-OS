-- Migration 021: Remove temporary trials/referrals/notifications read policies safely
-- Preconditions:
-- - Migration 020 added official policies for notifications, referrals, and trials.
-- - Browser testing confirmed relevant sales/ops/admin flows still work.
--
-- Removed policies:
-- - temp_read_notifications
-- - temp_read_referrals
-- - temp_read_trials

DROP POLICY IF EXISTS temp_read_notifications ON public.notifications;
DROP POLICY IF EXISTS temp_read_referrals ON public.referrals;
DROP POLICY IF EXISTS temp_read_trials ON public.trials;
