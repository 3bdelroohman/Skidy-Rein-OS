-- Sprint 5 Batch 5.1: Add missing FK indexes
-- Applied: 2026-05-12 on production (aws-1-eu-west-3)
-- Method: CREATE INDEX CONCURRENTLY IF NOT EXISTS (no table lock)

-- sessions.teacher_id — used in conflict detection queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_teacher
    ON sessions (teacher_id);

-- sessions.session_date — used in schedule range queries (already existed)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_date
    ON sessions (session_date);

-- payments.class_id — used in group payment queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_class
    ON payments (class_id);

-- class_enrollments.student_id — standalone lookup index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_class_enrollments_student
    ON class_enrollments (student_id);