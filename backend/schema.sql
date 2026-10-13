-- ==============================================================================
-- UDAAN AI — PRODUCTION DATABASE SCHEMA & ACCESS CONTROL SPECIFICATION
-- Database Target: PostgreSQL 15+ / Supabase
-- Problem Statement: AI-Powered School Dropout Prediction & Retention Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USER ROLES & PROFILES
-- ------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
    'school_administrator',
    'teacher',
    'authorized_support_staff'
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'teacher',
    department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. STUDENTS TABLE (Pseudonymous identifiers enforced for privacy)
-- ------------------------------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pseudonymous_id VARCHAR(32) UNIQUE NOT NULL, -- e.g., 'ST-101', 'ST-102'
    grade_level VARCHAR(16) NOT NULL,            -- e.g., 'Grade 9', 'Grade 10'
    section VARCHAR(8),                          -- e.g., 'A', 'B'
    academic_year VARCHAR(16) NOT NULL DEFAULT '2025-2026',
    assigned_staff_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    current_status VARCHAR(32) NOT NULL DEFAULT 'enrolled', -- 'enrolled', 'graduated', 'transferred'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_grade ON students(grade_level);
CREATE INDEX idx_students_pseudo ON students(pseudonymous_id);

-- ------------------------------------------------------------------------------
-- 3. ATTENDANCE RECORDS (Weekly and reporting-period aggregates)
-- ------------------------------------------------------------------------------
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    reporting_period VARCHAR(32) NOT NULL, -- e.g., 'Week 1', 'Term 1'
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    total_school_days INT NOT NULL CHECK (total_school_days > 0),
    days_present INT NOT NULL CHECK (days_present >= 0),
    days_excused INT NOT NULL DEFAULT 0 CHECK (days_excused >= 0),
    days_unexcused INT NOT NULL DEFAULT 0 CHECK (days_unexcused >= 0),
    attendance_rate NUMERIC(5,2) GENERATED ALWAYS AS (
        ROUND((days_present::numeric / total_school_days::numeric) * 100, 2)
    ) STORED,
    consecutive_absences INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attendance_student_period ON attendance_records(student_id, period_start_date);

-- ------------------------------------------------------------------------------
-- 4. ASSESSMENT RECORDS (Academic performance over time)
-- ------------------------------------------------------------------------------
CREATE TABLE assessment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(64) NOT NULL,
    assessment_name VARCHAR(128) NOT NULL,
    assessment_type VARCHAR(32) NOT NULL, -- 'quiz', 'midterm', 'final', 'project'
    score_percentage NUMERIC(5,2) NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
    is_missed BOOLEAN NOT NULL DEFAULT FALSE,
    assessment_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_student_date ON assessment_records(student_id, assessment_date);

-- ------------------------------------------------------------------------------
-- 5. RISK ASSESSMENTS (ML Model Inference History & Explanations)
-- ------------------------------------------------------------------------------
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    risk_probability NUMERIC(4,3) NOT NULL CHECK (risk_probability >= 0 AND risk_probability <= 1.0),
    prediction_category VARCHAR(32) NOT NULL, -- 'on_track', 'review_recommended', 'urgent_review_recommended'
    model_version VARCHAR(32) NOT NULL,
    feature_snapshot JSONB NOT NULL,          -- Attendance, grade drop, trend vector
    contributing_factors JSONB NOT NULL,      -- Top weighted factors and directional impacts
    data_quality_warning TEXT,
    assessed_by VARCHAR(32) NOT NULL DEFAULT 'ml_engine', -- 'ml_engine' or staff identifier
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_student_created ON risk_assessments(student_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. SUPPORT PLANS (Actionable interventions designed in Intervention Lab)
-- ------------------------------------------------------------------------------
CREATE TABLE support_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    risk_assessment_id UUID REFERENCES risk_assessments(id) ON DELETE SET NULL,
    primary_warning_signal TEXT NOT NULL,
    intervention_type VARCHAR(64) NOT NULL, -- 'academic_tutoring', 'teacher_checkin', 'family_meeting', etc.
    intervention_details TEXT NOT NULL,
    assigned_staff_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    created_by_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    planned_follow_up_date DATE NOT NULL,
    current_status VARCHAR(32) NOT NULL DEFAULT 'planned', -- 'planned', 'in_progress', 'awaiting_follow_up', 'completed', 'reassessment_needed'
    resource_allocation_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_plans_status ON support_plans(current_status);
CREATE INDEX idx_support_plans_student ON support_plans(student_id);

-- ------------------------------------------------------------------------------
-- 7. FOLLOW-UP RECORDS & LEARNING LOOP (Progress notes & observed trajectories)
-- ------------------------------------------------------------------------------
CREATE TABLE follow_up_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    support_plan_id UUID NOT NULL REFERENCES support_plans(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    recorded_by_staff_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
    engagement_observation TEXT NOT NULL,
    observed_attendance_rate NUMERIC(5,2),
    observed_academic_score NUMERIC(5,2),
    status_update VARCHAR(32) NOT NULL,
    scientific_causality_disclaimer TEXT NOT NULL DEFAULT 'Observed progress represents correlated trend data, not proven causal intervention effects.',
    next_review_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_followup_plan ON follow_up_records(support_plan_id);

-- ------------------------------------------------------------------------------
-- 8. SCHOOL RESOURCE CAPACITY & ALLOCATION
-- ------------------------------------------------------------------------------
CREATE TABLE school_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(64) UNIQUE NOT NULL, -- 'math_tutoring', 'science_tutoring', 'mentoring_hours', etc.
    resource_label VARCHAR(128) NOT NULL,
    total_capacity INT NOT NULL CHECK (total_capacity >= 0),
    allocated_units INT NOT NULL DEFAULT 0 CHECK (allocated_units >= 0),
    unit_description VARCHAR(32) NOT NULL DEFAULT 'sessions/week',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_resources ENABLE ROW LEVEL SECURITY;

-- Administrators have full read and write access across all tables
CREATE POLICY admin_all_students ON students
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'role') = 'school_administrator')
    WITH CHECK ((auth.jwt() ->> 'role') = 'school_administrator');

-- Teachers have read access to enrolled students and can create support plans
CREATE POLICY teacher_read_students ON students
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() ->> 'role') IN ('teacher', 'authorized_support_staff', 'school_administrator')
    );

CREATE POLICY staff_support_plans ON support_plans
    FOR ALL TO authenticated
    USING (
        (auth.jwt() ->> 'role') IN ('authorized_support_staff', 'teacher', 'school_administrator')
    )
    WITH CHECK (
        (auth.jwt() ->> 'role') IN ('authorized_support_staff', 'teacher', 'school_administrator')
    );

-- ------------------------------------------------------------------------------
-- 10. DEMO SEED SCRIPT (Explicit demo-seed mechanism)
-- ------------------------------------------------------------------------------
INSERT INTO school_resources (resource_type, resource_label, total_capacity, allocated_units, unit_description)
VALUES
    ('math_tutoring', 'Math Peer & Faculty Tutoring Slots', 25, 18, 'weekly slots'),
    ('reading_tutoring', 'Language & Literacy Lab Slots', 20, 14, 'weekly slots'),
    ('counselor_hours', 'Staff Mentoring & Check-in Hours', 30, 22, 'hours/week'),
    ('financial_aid_reviews', 'Emergency Student Welfare Referrals', 10, 4, 'monthly cases'),
    ('peer_study_circles', 'Guided Peer Study Circles', 15, 9, 'cohorts')
ON CONFLICT (resource_type) DO NOTHING;
