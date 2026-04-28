-- Migration 024: Manual group finance and manual collection fields
-- Purpose:
-- - Move teacher session finance to the group/class level.
-- - Add manual collection checkpoints to payments.
-- - No automatic pricing or automatic collection logic is introduced here.

ALTER TABLE public.classes
  ADD COLUMN IF NOT EXISTS teacher_session_duration_minutes integer,
  ADD COLUMN IF NOT EXISTS teacher_session_rate numeric(10,2),
  ADD COLUMN IF NOT EXISTS teacher_finance_notes text;

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS collection_start_session integer,
  ADD COLUMN IF NOT EXISTS collection_end_session integer,
  ADD COLUMN IF NOT EXISTS next_collection_session integer,
  ADD COLUMN IF NOT EXISTS next_collection_due_date date,
  ADD COLUMN IF NOT EXISTS collection_status text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS collection_notes text;
