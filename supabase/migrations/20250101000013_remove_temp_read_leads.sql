-- Migration 013: Remove temporary leads read policies safely
-- Preconditions:
-- - leads_select allows admin/owner/sales to read leads.
-- - lead_activities_select allows admin/owner/sales to read lead activities.
-- - Browser testing confirmed sales/admin lead flows still work.
--
-- Removed policies:
-- - temp_read_leads
-- - temp_read_lead_activities

DROP POLICY IF EXISTS temp_read_leads ON public.leads;
DROP POLICY IF EXISTS temp_read_lead_activities ON public.lead_activities;
