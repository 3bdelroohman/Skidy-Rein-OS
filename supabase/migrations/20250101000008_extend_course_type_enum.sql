-- Migration 008: Extend course_type enum to match application course catalog
-- Run in Supabase SQL Editor before saving teacher specializations for advanced courses.

ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'app_inventor';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'robotics_basic';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'ai_intro';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'godot';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'robotics_iot';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'fastapi';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'html_css';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'javascript_tailwind';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'front_end';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'ai_ml';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'data_science';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'back_end';
ALTER TYPE course_type ADD VALUE IF NOT EXISTS 'raspberry_pi';
