-- Migration 020: Trials / Referrals / Notifications Safe Foundation
-- Purpose:
-- - Add official RLS policies before removing temp_read_notifications, temp_read_referrals, temp_read_trials.
-- - Do NOT remove temp_read_* policies in this migration.

DROP POLICY IF EXISTS notifications_select_own ON public.notifications;
CREATE POLICY notifications_select_own
ON public.notifications
FOR SELECT
USING (
  user_id = auth.uid()
  OR get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
);

DROP POLICY IF EXISTS notifications_update_own ON public.notifications;
CREATE POLICY notifications_update_own
ON public.notifications
FOR UPDATE
USING (
  user_id = auth.uid()
  OR get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
)
WITH CHECK (
  user_id = auth.uid()
  OR get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
);

DROP POLICY IF EXISTS notifications_admin_all ON public.notifications;
CREATE POLICY notifications_admin_all
ON public.notifications
FOR ALL
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
)
WITH CHECK (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text])
);

DROP POLICY IF EXISTS trials_all ON public.trials;
CREATE POLICY trials_all
ON public.trials
FOR ALL
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text, 'ops'::text])
)
WITH CHECK (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text, 'ops'::text])
);

DROP POLICY IF EXISTS referrals_select ON public.referrals;
CREATE POLICY referrals_select
ON public.referrals
FOR SELECT
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text, 'ops'::text])
);

DROP POLICY IF EXISTS referrals_modify ON public.referrals;
CREATE POLICY referrals_modify
ON public.referrals
FOR ALL
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text])
)
WITH CHECK (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text])
);
