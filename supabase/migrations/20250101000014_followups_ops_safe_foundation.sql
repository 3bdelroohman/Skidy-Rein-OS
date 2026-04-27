-- Migration 014: Follow-ups Ops Safe Foundation
-- Purpose:
-- Allow ops to officially read/create/update follow-ups before removing temp_read_follow_ups.
-- Do NOT remove temp_read_follow_ups in this migration.

DROP POLICY IF EXISTS follow_ups_all ON public.follow_ups;

CREATE POLICY follow_ups_all
ON public.follow_ups
FOR ALL
USING (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text, 'ops'::text])
)
WITH CHECK (
  get_my_role() = ANY (ARRAY['admin'::text, 'owner'::text, 'sales'::text, 'ops'::text])
);
