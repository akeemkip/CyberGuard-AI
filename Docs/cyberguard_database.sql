--
-- PostgreSQL database dump
--

\restrict SDz05RccPAunGHrEsa5gWw0h0QqoLutks7C98cZL1HXGkYK3I0naXzbHXJ1qRcD

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.quizzes DROP CONSTRAINT IF EXISTS "quizzes_lessonId_fkey";
ALTER TABLE IF EXISTS ONLY public.quiz_attempts DROP CONSTRAINT IF EXISTS "quiz_attempts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.quiz_attempts DROP CONSTRAINT IF EXISTS "quiz_attempts_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public.questions DROP CONSTRAINT IF EXISTS "questions_quizId_fkey";
ALTER TABLE IF EXISTS ONLY public.progress DROP CONSTRAINT IF EXISTS "progress_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.progress DROP CONSTRAINT IF EXISTS "progress_lessonId_fkey";
ALTER TABLE IF EXISTS ONLY public.phishing_attempts DROP CONSTRAINT IF EXISTS "phishing_attempts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.phishing_attempts DROP CONSTRAINT IF EXISTS "phishing_attempts_scenarioId_fkey";
ALTER TABLE IF EXISTS ONLY public.modules DROP CONSTRAINT IF EXISTS "modules_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public.lessons DROP CONSTRAINT IF EXISTS "lessons_moduleId_fkey";
ALTER TABLE IF EXISTS ONLY public.lessons DROP CONSTRAINT IF EXISTS "lessons_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public.labs DROP CONSTRAINT IF EXISTS "labs_moduleId_fkey";
ALTER TABLE IF EXISTS ONLY public.labs DROP CONSTRAINT IF EXISTS "labs_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public.lab_progress DROP CONSTRAINT IF EXISTS "lab_progress_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.lab_progress DROP CONSTRAINT IF EXISTS "lab_progress_labId_fkey";
ALTER TABLE IF EXISTS ONLY public.intro_questions DROP CONSTRAINT IF EXISTS "intro_questions_introAssessmentId_fkey";
ALTER TABLE IF EXISTS ONLY public.intro_questions DROP CONSTRAINT IF EXISTS "intro_questions_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public.intro_assessment_attempts DROP CONSTRAINT IF EXISTS "intro_assessment_attempts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.intro_assessment_attempts DROP CONSTRAINT IF EXISTS "intro_assessment_attempts_introAssessmentId_fkey";
ALTER TABLE IF EXISTS ONLY public.full_assessment_attempts DROP CONSTRAINT IF EXISTS "full_assessment_attempts_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS "enrollments_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS "enrollments_courseId_fkey";
ALTER TABLE IF EXISTS ONLY public.certificates DROP CONSTRAINT IF EXISTS "certificates_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.certificates DROP CONSTRAINT IF EXISTS "certificates_courseId_fkey";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public."quizzes_lessonId_key";
DROP INDEX IF EXISTS public."progress_userId_lessonId_key";
DROP INDEX IF EXISTS public."lab_progress_userId_labId_key";
DROP INDEX IF EXISTS public."enrollments_userId_courseId_key";
DROP INDEX IF EXISTS public."certificates_userId_courseId_key";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.settings_audit_log DROP CONSTRAINT IF EXISTS settings_audit_log_pkey;
ALTER TABLE IF EXISTS ONLY public.quizzes DROP CONSTRAINT IF EXISTS quizzes_pkey;
ALTER TABLE IF EXISTS ONLY public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_pkey;
ALTER TABLE IF EXISTS ONLY public.questions DROP CONSTRAINT IF EXISTS questions_pkey;
ALTER TABLE IF EXISTS ONLY public.progress DROP CONSTRAINT IF EXISTS progress_pkey;
ALTER TABLE IF EXISTS ONLY public.platform_settings DROP CONSTRAINT IF EXISTS platform_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.phishing_scenarios DROP CONSTRAINT IF EXISTS phishing_scenarios_pkey;
ALTER TABLE IF EXISTS ONLY public.phishing_attempts DROP CONSTRAINT IF EXISTS phishing_attempts_pkey;
ALTER TABLE IF EXISTS ONLY public.modules DROP CONSTRAINT IF EXISTS modules_pkey;
ALTER TABLE IF EXISTS ONLY public.lessons DROP CONSTRAINT IF EXISTS lessons_pkey;
ALTER TABLE IF EXISTS ONLY public.labs DROP CONSTRAINT IF EXISTS labs_pkey;
ALTER TABLE IF EXISTS ONLY public.lab_progress DROP CONSTRAINT IF EXISTS lab_progress_pkey;
ALTER TABLE IF EXISTS ONLY public.intro_questions DROP CONSTRAINT IF EXISTS intro_questions_pkey;
ALTER TABLE IF EXISTS ONLY public.intro_assessments DROP CONSTRAINT IF EXISTS intro_assessments_pkey;
ALTER TABLE IF EXISTS ONLY public.intro_assessment_attempts DROP CONSTRAINT IF EXISTS intro_assessment_attempts_pkey;
ALTER TABLE IF EXISTS ONLY public.full_assessment_attempts DROP CONSTRAINT IF EXISTS full_assessment_attempts_pkey;
ALTER TABLE IF EXISTS ONLY public.enrollments DROP CONSTRAINT IF EXISTS enrollments_pkey;
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS courses_pkey;
ALTER TABLE IF EXISTS ONLY public.certificates DROP CONSTRAINT IF EXISTS certificates_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.settings_audit_log;
DROP TABLE IF EXISTS public.quizzes;
DROP TABLE IF EXISTS public.quiz_attempts;
DROP TABLE IF EXISTS public.questions;
DROP TABLE IF EXISTS public.progress;
DROP TABLE IF EXISTS public.platform_settings;
DROP TABLE IF EXISTS public.phishing_scenarios;
DROP TABLE IF EXISTS public.phishing_attempts;
DROP TABLE IF EXISTS public.modules;
DROP TABLE IF EXISTS public.lessons;
DROP TABLE IF EXISTS public.labs;
DROP TABLE IF EXISTS public.lab_progress;
DROP TABLE IF EXISTS public.intro_questions;
DROP TABLE IF EXISTS public.intro_assessments;
DROP TABLE IF EXISTS public.intro_assessment_attempts;
DROP TABLE IF EXISTS public.full_assessment_attempts;
DROP TABLE IF EXISTS public.enrollments;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.certificates;
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."PhishingAction";
DROP TYPE IF EXISTS public."LabType";
DROP TYPE IF EXISTS public."LabStatus";
--
-- Name: LabStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LabStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
);


--
-- Name: LabType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LabType" AS ENUM (
    'CONTENT',
    'PHISHING_EMAIL',
    'SUSPICIOUS_LINKS',
    'PASSWORD_STRENGTH',
    'SOCIAL_ENGINEERING',
    'SECURITY_ALERTS',
    'WIFI_SAFETY',
    'INCIDENT_RESPONSE'
);


--
-- Name: PhishingAction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PhishingAction" AS ENUM (
    'REPORTED',
    'MARKED_SAFE',
    'CLICKED_LINK',
    'DELETED',
    'IGNORED'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'STUDENT',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificates (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "issuedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    thumbnail text,
    difficulty text DEFAULT 'Beginner'::text NOT NULL,
    duration text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


--
-- Name: full_assessment_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.full_assessment_attempts (
    id text NOT NULL,
    "userId" text NOT NULL,
    score integer NOT NULL,
    "totalQuestions" integer NOT NULL,
    percentage integer NOT NULL,
    passed boolean NOT NULL,
    "timeSpent" integer,
    "timerExpired" boolean DEFAULT false NOT NULL,
    answers jsonb NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: intro_assessment_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intro_assessment_attempts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "introAssessmentId" text NOT NULL,
    score integer NOT NULL,
    "totalQuestions" integer NOT NULL,
    percentage integer NOT NULL,
    passed boolean NOT NULL,
    answers jsonb NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: intro_assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intro_assessments (
    id text NOT NULL,
    title text DEFAULT 'Intro Skills Assessment'::text NOT NULL,
    description text,
    "passingScore" integer DEFAULT 50 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: intro_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intro_questions (
    id text NOT NULL,
    "introAssessmentId" text NOT NULL,
    question text NOT NULL,
    options text[],
    "correctAnswer" integer NOT NULL,
    explanation text,
    "courseId" text NOT NULL,
    "order" integer NOT NULL
);


--
-- Name: lab_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lab_progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "labId" text NOT NULL,
    status public."LabStatus" DEFAULT 'NOT_STARTED'::public."LabStatus" NOT NULL,
    "timeSpent" integer DEFAULT 0 NOT NULL,
    notes text,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    answers jsonb,
    attempts integer DEFAULT 0 NOT NULL,
    passed boolean,
    score integer
);


--
-- Name: labs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.labs (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    instructions text,
    scenario text,
    objectives text[],
    resources text,
    hints text,
    difficulty text DEFAULT 'Beginner'::text NOT NULL,
    "estimatedTime" integer,
    "order" integer NOT NULL,
    "courseId" text NOT NULL,
    "moduleId" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "labType" public."LabType" DEFAULT 'CONTENT'::public."LabType" NOT NULL,
    "passingScore" integer DEFAULT 70 NOT NULL,
    "simulationConfig" jsonb
);


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "videoUrl" text,
    "order" integer NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "moduleId" text
);


--
-- Name: modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modules (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: phishing_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.phishing_attempts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "scenarioId" text NOT NULL,
    "userAction" public."PhishingAction" NOT NULL,
    "isCorrect" boolean NOT NULL,
    "responseTimeMs" integer NOT NULL,
    "attemptedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: phishing_scenarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.phishing_scenarios (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    difficulty text DEFAULT 'Beginner'::text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "senderName" text NOT NULL,
    "senderEmail" text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    attachments text[],
    "isPhishing" boolean NOT NULL,
    "redFlags" text[],
    "legitimateReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_settings (
    id text DEFAULT 'singleton'::text NOT NULL,
    "platformName" text DEFAULT 'CyberGuard AI'::text NOT NULL,
    "platformDescription" text DEFAULT 'Advanced cybersecurity training platform'::text NOT NULL,
    "supportEmail" text DEFAULT 'support@cyberguard.com'::text NOT NULL,
    "contactEmail" text DEFAULT 'contact@cyberguard.com'::text NOT NULL,
    "requireEmailVerification" boolean DEFAULT false NOT NULL,
    "minPasswordLength" integer DEFAULT 6 NOT NULL,
    "sessionTimeout" integer DEFAULT 7 NOT NULL,
    "enableTwoFactor" boolean DEFAULT false NOT NULL,
    "maxLoginAttempts" integer DEFAULT 5 NOT NULL,
    "autoEnrollNewUsers" boolean DEFAULT false NOT NULL,
    "defaultCourseVisibility" text DEFAULT 'public'::text NOT NULL,
    "defaultQuizPassingScore" integer DEFAULT 70 NOT NULL,
    "enableCertificates" boolean DEFAULT true NOT NULL,
    "allowCourseReviews" boolean DEFAULT true NOT NULL,
    "defaultUserRole" text DEFAULT 'STUDENT'::text NOT NULL,
    "allowSelfRegistration" boolean DEFAULT true NOT NULL,
    "requireProfileCompletion" boolean DEFAULT false NOT NULL,
    "enablePublicProfiles" boolean DEFAULT false NOT NULL,
    "enableEmailNotifications" boolean DEFAULT false NOT NULL,
    "enableEnrollmentEmails" boolean DEFAULT true NOT NULL,
    "enableCompletionEmails" boolean DEFAULT true NOT NULL,
    "enableWeeklyDigest" boolean DEFAULT false NOT NULL,
    "smtpHost" text DEFAULT ''::text NOT NULL,
    "smtpPort" text DEFAULT '587'::text NOT NULL,
    "smtpUser" text DEFAULT ''::text NOT NULL,
    "smtpPassword" text DEFAULT ''::text NOT NULL,
    "primaryColor" text DEFAULT '#3b82f6'::text NOT NULL,
    "logoUrl" text DEFAULT ''::text NOT NULL,
    favicon text DEFAULT ''::text NOT NULL,
    "customCss" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accentColor" text DEFAULT '#f59e0b'::text NOT NULL,
    "borderRadius" text DEFAULT 'medium'::text NOT NULL,
    "darkModeDefault" boolean DEFAULT false NOT NULL,
    "fontFamily" text DEFAULT 'Inter'::text NOT NULL,
    "fontSize" text DEFAULT 'normal'::text NOT NULL,
    "secondaryColor" text DEFAULT '#10b981'::text NOT NULL
);


--
-- Name: progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone
);


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id text NOT NULL,
    "quizId" text NOT NULL,
    question text NOT NULL,
    options text[],
    "correctAnswer" integer NOT NULL,
    "order" integer NOT NULL
);


--
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_attempts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "quizId" text NOT NULL,
    score integer NOT NULL,
    passed boolean NOT NULL,
    "attemptedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quizzes (
    id text NOT NULL,
    "lessonId" text NOT NULL,
    title text NOT NULL,
    "passingScore" integer DEFAULT 70 NOT NULL
);


--
-- Name: settings_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings_audit_log (
    id text NOT NULL,
    "adminId" text NOT NULL,
    "adminEmail" text NOT NULL,
    action text DEFAULT 'UPDATE'::text NOT NULL,
    "fieldName" text NOT NULL,
    "oldValue" text,
    "newValue" text,
    "ipAddress" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."Role" DEFAULT 'STUDENT'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "autoPlayVideos" boolean DEFAULT true NOT NULL,
    "courseReminders" boolean DEFAULT true NOT NULL,
    "emailNotifications" boolean DEFAULT true NOT NULL,
    "marketingEmails" boolean DEFAULT false NOT NULL,
    "showProgress" boolean DEFAULT true NOT NULL,
    "accountLockedUntil" timestamp(3) without time zone,
    "lastFailedLogin" timestamp(3) without time zone,
    "loginAttempts" integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('765c9b59-0494-4eb7-98c6-48a6715e4d37', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-10 02:55:55.984');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('34b58d0b-28a3-49b1-bba0-f2e458df1f36', 'ba73a499-6830-4485-bfc3-969bab02117a', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-12-12 02:24:48.415');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('c3666263-47c0-4405-84ad-ca32dde76ee9', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-24 00:18:32.92');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('47a79f38-ac17-4661-b665-b15913ce435b', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-12-26 16:54:42.119');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('15a29032-5ebe-44d6-be13-5482cc8608b7', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-12-28 08:58:01.853');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('51ce0491-a73a-4fca-812f-43a8e36cdfbd', 'c5b92394-9515-497a-8158-8098dd0ca649', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-12 02:51:20.153');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('8e5b418e-bb3c-4e47-9229-94d629f97d51', 'c5b92394-9515-497a-8158-8098dd0ca649', '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-02-09 22:45:27.993');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('31f233e1-a371-4fde-a2be-344d42e26bd1', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-02-24 14:01:36.882');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('9a49a992-9463-4b10-b996-90a44057be1a', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-28 10:59:39.772');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('ec5c2713-5b7e-4318-b8c3-dfba188d8a11', '789b254a-b66a-4843-b510-213e338def77', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-12-08 05:18:26.596');
INSERT INTO public.certificates (id, "userId", "courseId", "issuedAt") VALUES ('2a1cab4e-174d-4eca-a3f4-4c9c6609278e', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-02 00:15:25.753');


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('12006027-81dc-4000-b38e-4b262bf65ccd', 'Test Course', 'This is a test', 'data:image/jpeg;base64,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', 'Beginner', '2 hours', false, '2026-02-01 23:11:50.42', '2026-02-01 23:11:50.42');
INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('7a0f1b41-a422-419a-8f8d-988c85d785b2', 'Secure Web Browsing', 'Learn how to browse the internet safely. Understand browser security, recognize malicious websites, and protect your privacy online.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', 'Beginner', '4 hours', true, '2026-01-19 00:50:42.523', '2026-01-19 00:52:15.814');
INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('d7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', 'Phishing Detection Fundamentals', 'Learn to identify and protect yourself from phishing attacks. This course covers email phishing, spear phishing, and social engineering tactics used by attackers.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400', 'Beginner', '4 hours', true, '2026-01-19 00:50:42.523', '2026-01-19 00:52:15.815');
INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('46919028-1fe7-4e40-b96f-bb5d825f7139', 'Password Security Best Practices', 'Master the art of creating and managing secure passwords. Learn about password managers, multi-factor authentication, and common password attacks.', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400', 'Beginner', '3.5 hours', true, '2026-01-19 00:50:42.523', '2026-01-19 00:52:15.816');
INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('46ca4918-f919-4f00-812d-bd5df57b3b10', 'Personal Data Protection', 'Protect your personal and sensitive data from theft and exposure. Learn about data classification, encryption, and secure data handling.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', 'Intermediate', '3 hours', true, '2026-01-19 00:50:42.523', '2026-01-19 00:52:15.817');
INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('12769777-25e1-4cd4-82a9-990bda9b97de', 'Advanced Threat Analysis & Incident Response', 'Master advanced cybersecurity techniques including threat hunting, incident response, and forensic analysis. Learn to identify, analyze, and respond to sophisticated cyber attacks.', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400', 'Advanced', '5 hours', true, '2026-01-19 00:50:42.524', '2026-01-19 00:52:15.819');
INSERT INTO public.courses (id, title, description, thumbnail, difficulty, duration, "isPublished", "createdAt", "updatedAt") VALUES ('60832135-1fbc-4397-af53-5e1e029e1e0e', 'Social Engineering Awareness', 'Understand how attackers manipulate human psychology to bypass security. Learn to recognize and defend against social engineering tactics.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', 'Intermediate', '3.5 hours', true, '2026-01-19 00:50:42.523', '2026-01-19 00:52:15.818');


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('e1b272b2-c689-44a9-b92e-2d865bcc0e1d', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-12-14 02:55:55.984', '2026-01-10 02:55:55.984');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('89c113aa-4302-49ed-aeee-2dc1e035e9b4', '789b254a-b66a-4843-b510-213e338def77', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-03-02 14:31:02.839', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('bc4016bc-dc1f-42a6-8225-85e4067ea75b', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '60832135-1fbc-4397-af53-5e1e029e1e0e', '2025-11-30 12:32:56.674', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('660b733a-66cc-4277-9c72-9048b3cbe5c1', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-02-17 23:21:01.016', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('08a8e5f3-c168-4057-82e6-ed94ff7ad4a5', '5376ee99-3223-49c9-b10f-31f5fba93eff', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2025-11-06 06:36:45.614', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('900ece8a-118e-40cf-949f-741d0a0f6189', '8d61bf58-7695-4641-8deb-713c95a2f662', '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-02-23 17:45:22.489', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('bace3df2-277c-4b1a-939a-76cdc0d3eb41', 'ba73a499-6830-4485-bfc3-969bab02117a', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-17 02:24:48.415', '2025-12-12 02:24:48.415');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('97d332cc-f841-42e6-9431-b67e4b43f9ec', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-05 00:18:32.92', '2025-11-24 00:18:32.92');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('52a3e7e8-8dfe-4698-9039-449181268ee0', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-26 16:54:42.119', '2025-12-26 16:54:42.119');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('4793492c-6cf5-4a23-9af7-e1a30c45570f', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-28 08:58:01.853', '2025-12-28 08:58:01.853');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('a8488efa-268b-40e4-93cd-39151b287c3f', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-02-28 18:50:54.799', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('b87a17c4-5e3c-46c9-9c2c-088819e06018', '528d4643-aea9-4c57-85fb-05f435c98ef0', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-03-20 11:43:29.434', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('f3d20b1e-d883-4f0a-a61e-1cb53d285c90', '528d4643-aea9-4c57-85fb-05f435c98ef0', '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-02-11 10:30:41.705', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('5feca673-d129-466a-8a09-6d3027bff7ef', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-03-03 04:30:22.258', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('f86b4c6a-8599-4801-899e-683064a506e2', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '46ca4918-f919-4f00-812d-bd5df57b3b10', '2025-12-22 09:47:48.651', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('3ecc8a6a-02f7-4734-8cd6-16ed0d6514bd', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '12769777-25e1-4cd4-82a9-990bda9b97de', '2025-11-28 17:59:26.86', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('10502cda-6944-46e3-962b-c3fcc28c4e0a', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2025-12-31 09:28:59.792', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('d19765f2-30af-4167-8e94-1061fabe4b9f', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-02-06 21:28:18.03', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('6d10de9e-0f47-40d4-93e9-a3fce5f3b491', '8d61bf58-7695-4641-8deb-713c95a2f662', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2025-11-26 17:58:02.911', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('cd7a51be-5015-4d16-88a0-bcc2e99f469a', '8d61bf58-7695-4641-8deb-713c95a2f662', '60832135-1fbc-4397-af53-5e1e029e1e0e', '2025-12-07 20:31:41.203', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('725a3ace-7926-42d6-b00d-5cd9ce4687af', '8d61bf58-7695-4641-8deb-713c95a2f662', '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-03-12 01:52:25.478', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('bca9037a-1b84-48ff-9f3a-58d44a65283e', '894e4aee-1905-4890-8262-253709d1047b', '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-27 23:43:46.443', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('c865b18c-35b3-4387-b216-f9e315c50208', 'c5b92394-9515-497a-8158-8098dd0ca649', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2025-11-15 02:51:20.153', '2026-01-12 02:51:20.153');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('96997202-b981-4188-a6ab-56ae2481b39a', 'c5b92394-9515-497a-8158-8098dd0ca649', '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-01 22:45:27.993', '2026-02-09 22:45:27.993');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('1052183c-95ce-44c0-b377-3063e5659b2e', 'c5b92394-9515-497a-8158-8098dd0ca649', '46ca4918-f919-4f00-812d-bd5df57b3b10', '2025-12-28 21:11:58.819', NULL);
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('51c502c3-9773-4c20-a4b7-0edbf5439832', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-13 14:01:36.882', '2026-02-24 14:01:36.882');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('b1a64be5-3422-4602-aedc-224dee8a124e', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-04 10:59:39.772', '2025-11-28 10:59:39.772');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('fb6f7b02-381e-4a70-817c-a6b5dfdb977f', '789b254a-b66a-4843-b510-213e338def77', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-11-11 05:18:26.596', '2025-12-08 05:18:26.596');
INSERT INTO public.enrollments (id, "userId", "courseId", "enrolledAt", "completedAt") VALUES ('cec86eb2-1f57-446d-905f-3052b68b2fb8', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2025-12-05 00:15:25.753', '2026-01-02 00:15:25.753');


--
-- Data for Name: full_assessment_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('0d65e02e-d4fa-488a-a98b-154d81ffe40e', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 29, 30, 95, true, 1374, false, '{"simulated": true}', '2025-12-03 09:09:01.918');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('d23106c8-593d-40cd-a0a5-4e4433467788', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 29, 30, 95, true, 1257, false, '{"simulated": true}', '2025-11-25 14:35:36.599');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('515dec6b-3468-4598-ad78-04ee6532f362', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', 29, 30, 95, true, 1276, false, '{"simulated": true}', '2025-12-30 18:11:39.805');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('c67845f0-46ac-4c6e-b66e-fcc226f927f4', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 29, 30, 95, true, 1095, false, '{"simulated": true}', '2025-12-29 12:46:56.87');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('646091a9-c819-43ef-bc00-c8f3b8b8a80b', 'c5b92394-9515-497a-8158-8098dd0ca649', 29, 30, 95, true, 1418, false, '{"simulated": true}', '2026-02-14 00:36:53.739');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('77975bb6-1255-40f6-aa76-03cbb1fbbef3', 'ba73a499-6830-4485-bfc3-969bab02117a', 29, 30, 95, true, 1417, false, '{"simulated": true}', '2025-12-14 12:21:43.872');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('d55c729b-2df7-4656-8477-c9da30cf759e', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 29, 30, 95, true, 949, false, '{"simulated": true}', '2026-02-25 22:23:36.276');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('72a566b8-f0ff-4b22-9593-fa56fea36487', '5376ee99-3223-49c9-b10f-31f5fba93eff', 29, 30, 95, true, 1327, false, '{"simulated": true}', '2026-01-15 04:00:43.386');
INSERT INTO public.full_assessment_attempts (id, "userId", score, "totalQuestions", percentage, passed, "timeSpent", "timerExpired", answers, "completedAt") VALUES ('b2d0048e-e8f3-43ed-a3e7-c611e1fe9b96', '789b254a-b66a-4843-b510-213e338def77', 29, 30, 95, true, 1070, false, '{"simulated": true}', '2025-12-12 10:47:14.861');


--
-- Data for Name: intro_assessment_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('8c7bccb8-cd36-4bd6-b187-edc6f600e5c6', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 94, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-30 21:46:29.363');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('449c840a-685f-4667-b60a-ea056fe5cd6a', '894e4aee-1905-4890-8262-253709d1047b', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 93, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-20 21:39:28.65');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('38284d72-99c1-4f13-b081-aba1cac65f3d', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 95, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-24 07:54:24.304');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('355087ce-4472-4871-ab77-1e587555a991', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 95, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-04 09:34:14.322');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('3b7ff66d-45b6-4bc4-be0d-2d9a3e58c268', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 100, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-30 05:28:53.048');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('44981861-3e66-4382-8676-1c48b5ed3280', 'c5b92394-9515-497a-8158-8098dd0ca649', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 100, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-06 06:01:57.392');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('e6a87865-8a67-4787-9b80-29ac006156a4', 'ba73a499-6830-4485-bfc3-969bab02117a', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 100, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-07 23:18:55.884');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('5e58dbe5-9ba0-4007-b4c4-a00041b6036f', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 99, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-02 20:13:50.367');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('88ad2206-5fb3-4c10-8836-b94f5aa29b98', '5376ee99-3223-49c9-b10f-31f5fba93eff', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 93, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-17 07:40:12.719');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('b334cbfd-103a-42e9-9d54-e99217063c59', '8d61bf58-7695-4641-8deb-713c95a2f662', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 100, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-19 23:29:47.394');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('458d5715-9af8-421a-bd1f-87029f24ee1d', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 93, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-09 10:24:52.984');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('40939844-a071-4bac-a86f-dce6bce8d752', '789b254a-b66a-4843-b510-213e338def77', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 100, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-30 04:46:45.822');
INSERT INTO public.intro_assessment_attempts (id, "userId", "introAssessmentId", score, "totalQuestions", percentage, passed, answers, "completedAt") VALUES ('5de46c7b-27cd-4fe1-a792-0c842b3afa03', '528d4643-aea9-4c57-85fb-05f435c98ef0', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 6, 6, 94, true, '[{"isCorrect": true, "questionId": "question-0", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-1", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-2", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-3", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-4", "correctAnswer": 1, "selectedAnswer": 1}, {"isCorrect": true, "questionId": "question-5", "correctAnswer": 1, "selectedAnswer": 1}]', '2026-01-31 00:56:58.283');


--
-- Data for Name: intro_assessments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.intro_assessments (id, title, description, "passingScore", "isActive", "createdAt") VALUES ('96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'Intro Skills Assessment', 'A quick 6-question assessment to establish your baseline cybersecurity knowledge', 50, true, '2026-02-01 18:20:57.664');


--
-- Data for Name: intro_questions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.intro_questions (id, "introAssessmentId", question, options, "correctAnswer", explanation, "courseId", "order") VALUES ('e5e14fd3-3930-4a0d-b2dd-70efa46a0e91', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'Which of the following is a common red flag in a phishing email?', '{"Professional company logo","Urgent request to verify account information","Email sent during business hours","Proper grammar and spelling"}', 1, 'Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking. Urgent requests to verify account information are a major red flag.', 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', 0);
INSERT INTO public.intro_questions (id, "introAssessmentId", question, options, "correctAnswer", explanation, "courseId", "order") VALUES ('c43e24bf-d4f4-49b3-a161-7c3c80e8b584', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'What is the primary purpose of multi-factor authentication (MFA)?', '{"To make login faster","To add an extra layer of security beyond passwords","To eliminate the need for passwords","To track user login locations"}', 1, 'MFA adds an additional layer of security by requiring two or more verification factors, making it much harder for attackers to gain unauthorized access even if they have your password.', '46919028-1fe7-4e40-b96f-bb5d825f7139', 1);
INSERT INTO public.intro_questions (id, "introAssessmentId", question, options, "correctAnswer", explanation, "courseId", "order") VALUES ('d91ffc8d-408e-4138-bae1-51cfaf1f55d1', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'You receive a phone call from someone claiming to be from IT support asking for your password. What should you do?', '{"Provide your password since they are from IT","Give them a fake password to test them","Refuse to provide credentials and verify through official channels","Ask them to call back later"}', 2, 'Legitimate IT departments never ask for passwords over the phone. Always verify requests through official channels like calling the IT helpdesk directly using a known phone number.', '60832135-1fbc-4397-af53-5e1e029e1e0e', 2);
INSERT INTO public.intro_questions (id, "introAssessmentId", question, options, "correctAnswer", explanation, "courseId", "order") VALUES ('bc7375c2-f85f-4617-a236-03c81e3dc28c', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'What does "HTTPS" in a website URL indicate?', '{"The website is government-owned","The connection is encrypted and secure","The website has no advertisements","The website is mobile-friendly"}', 1, 'HTTPS indicates that the connection between your browser and the website is encrypted, protecting your data from interception. Always look for HTTPS when entering sensitive information.', '7a0f1b41-a422-419a-8f8d-988c85d785b2', 3);
INSERT INTO public.intro_questions (id, "introAssessmentId", question, options, "correctAnswer", explanation, "courseId", "order") VALUES ('fa2fa51a-06ef-44fe-9bb3-82f6dc186e63', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'Which of the following is considered Personally Identifiable Information (PII)?', '{"Your favorite color","Your social security number","The weather in your city","Your favorite sports team"}', 1, 'PII includes any information that can be used to identify an individual, such as social security numbers, full names, addresses, or financial account numbers. This information must be protected carefully.', '46ca4918-f919-4f00-812d-bd5df57b3b10', 4);
INSERT INTO public.intro_questions (id, "introAssessmentId", question, options, "correctAnswer", explanation, "courseId", "order") VALUES ('482c1443-0f3b-4bd2-883b-79ddfd226ecb', '96ef81b2-5de7-44d0-aeab-e3cf8aeae7ad', 'What is ransomware?', '{"A type of antivirus software","Malware that encrypts files and demands payment for decryption","A secure backup solution","A password manager"}', 1, 'Ransomware is malicious software that encrypts your files and demands a ransom payment (usually in cryptocurrency) to restore access. Prevention through backups and security awareness is crucial.', '12769777-25e1-4cd4-82a9-990bda9b97de', 5);


--
-- Data for Name: lab_progress; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: labs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('a079a47d-fce0-4fad-955c-3cb5c323649d', 'Phishing Email Analysis Exercise', 'Practice identifying phishing emails by analyzing real-world examples and documenting red flags.', '# Lab Overview
You will analyze a collection of emails to determine which are legitimate and which are phishing attempts.

## Setup Instructions
1. Download the sample email collection from the resources section
2. Review each email carefully
3. Document your findings in the analysis template

## Tasks
### Task 1: Email Header Analysis
- Examine the sender''s email address
- Check for domain spoofing
- Verify reply-to addresses

### Task 2: Content Red Flags
- Identify urgency tactics
- Check for grammar/spelling errors
- Analyze link destinations (hover, don''t click!)

### Task 3: Link Analysis
- Use URL analysis tools to check suspicious links
- Document any shortened URLs
- Identify typosquatting domains

### Task 4: Attachment Review
- Note file types of any attachments
- Identify potentially dangerous file extensions
- Check for macro-enabled documents

### Task 5: Documentation
- Complete the analysis worksheet
- Rate each email''s threat level (Low/Medium/High/Critical)
- Provide reasoning for your assessments

## Submission
Upload your completed analysis worksheet showing:
- Email classification (Legitimate/Phishing)
- Red flags identified
- Threat assessment
- Recommended actions', 'You are a security analyst at a mid-sized company. The IT department has forwarded you a collection of suspicious emails reported by employees. Your task is to analyze each email and provide a detailed assessment to help train the staff on phishing recognition.', '{"Correctly identify at least 8 out of 10 phishing emails","Document at least 3 red flags for each phishing email","Analyze email headers for spoofing indicators","Use URL analysis tools to verify link destinations","Provide actionable recommendations for each email"}', 'Sample Email Collection: https://example.com/phishing-samples
URL Analysis Tools: VirusTotal, URLVoid, URLScan
Email Header Analyzer: MXToolbox
Phishing Red Flags Checklist: Included in lab files', 'Start with obvious red flags like misspelled domains and urgent language. Use "View Source" to see raw email headers. Remember that even professional-looking emails can be phishing. When in doubt, verify through official channels.', 'Beginner', 45, 1, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', NULL, true, '2026-01-19 00:50:42.561', '2026-01-19 00:50:42.561', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('824198fe-1aea-462f-8259-5e1614e594df', 'Password Strength Testing Lab', 'Test various password types against simulated attacks to understand what makes passwords strong or weak.', '# Lab Overview
Use password cracking simulations to understand how different password strategies stand up to attacks.

## Setup Instructions
1. Access the password testing VM provided
2. Review the pre-loaded password lists
3. Familiarize yourself with the cracking tools

## Tasks
### Task 1: Baseline Testing
Test these password types and record time to crack:
- Dictionary words: "password", "football", "welcome"
- Dictionary + numbers: "password123", "football2024"
- Common patterns: "qwerty123", "abc123"

### Task 2: Complexity Testing
Test passwords with various complexity levels:
- 8 characters mixed: "P@ssw0rd"
- 12 characters mixed: "MyP@ssw0rd12"
- 16 characters mixed: "MyP@ssw0rd123456"

### Task 3: Passphrase Testing
Test passphrase effectiveness:
- Short phrase: "ilovecats"
- Long phrase: "ILoveMyThreeCatsVeryMuch"
- Random words: "correct-horse-battery-staple"

### Task 4: Real-World Comparison
- Test 5 passwords you currently use (or similar strength)
- Document vulnerabilities discovered
- Calculate estimated crack time for each

### Task 5: Best Practices
- Create 3 strong passwords using different methods
- Test them against cracking tools
- Document which method you prefer and why

## Analysis Questions
1. How does password length affect crack time?
2. Which is more effective: complexity or length?
3. Why are dictionary words dangerous even with substitutions?
4. What makes passphrases effective?
5. How do password managers help security?

## Deliverables
- Completed testing matrix with crack times
- Analysis document answering all questions
- Three strong passwords you created (for testing only)
- Recommendations document', 'As a security consultant, you need to demonstrate to a client why their current password policy (8 characters minimum with 1 number) is insufficient. Use this lab to gather evidence showing the difference between weak and strong passwords.', '{"Test at least 15 different passwords across various categories","Document crack time differences between weak and strong passwords","Understand the relationship between password length and security","Create three strong passwords using different methodologies","Provide evidence-based password policy recommendations"}', 'Password Testing VM: Access via lab portal
Hashcat Tutorial: Included
Password Lists: RockYou, Common Passwords
Crack Time Calculator: https://howsecureismypassword.net
Password Policy Templates: NIST Guidelines', 'Focus on comparing apples-to-apples - test similar passwords with one variable changed. Note that even "complex" short passwords crack quickly. Passphrases are your friend. Hardware matters - results will vary.', 'Intermediate', 60, 1, '46919028-1fe7-4e40-b96f-bb5d825f7139', NULL, true, '2026-01-19 00:50:42.565', '2026-01-19 00:50:42.565', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('d8935bb8-8ce8-4b36-91ac-9465bd972b52', 'Password Manager Setup & Migration', 'Set up and configure a password manager, then migrate existing passwords and generate strong new ones.', '# Lab Overview
Learn to properly configure and use a password manager for maximum security.

## Setup Instructions
1. Choose a password manager (Bitwarden recommended for this lab)
2. Create an account with a STRONG master password
3. Install browser extensions and mobile apps

## Tasks
### Task 1: Master Password Creation
- Create a master password using the passphrase method
- Aim for 20+ characters
- Test strength using multiple tools
- Document your password creation strategy

### Task 2: Two-Factor Authentication
- Enable 2FA on your password manager
- Use an authenticator app (not SMS)
- Save recovery codes securely
- Test 2FA login

### Task 3: Password Audit
- Conduct an audit of your current passwords:
  * Count reused passwords
  * Identify weak passwords
  * List passwords written down or in plaintext
- Document findings

### Task 4: Password Migration
- Add 10 existing accounts to password manager
- For each account:
  * Save current credentials
  * Generate strong new password (16+ chars)
  * Update the account
  * Test login
  * Delete old password record

### Task 5: Secure Notes & Emergency Access
- Set up secure notes for:
  * WiFi password
  * Security questions
  * Software licenses
- Configure emergency access for trusted person
- Document emergency access procedures

### Task 6: Browser Integration
- Install and test autofill
- Practice using password generator
- Set up automatic capture of new logins
- Test across different websites

## Security Checklist
✅ Master password 20+ characters
✅ 2FA enabled with authenticator app
✅ Recovery codes backed up securely
✅ Browser extension installed
✅ At least 10 accounts migrated
✅ All new passwords are unique and strong
✅ Emergency access configured
✅ Autofill tested and working

## Deliverables
- Configuration screenshot showing 2FA enabled
- Password audit report (anonymized)
- Migration log for 10 accounts
- Emergency access procedure document', 'Your company is implementing a password manager requirement for all employees. You need to not only set up your own account but also create a guide for colleagues. Complete this lab to become proficient and help others migrate safely.', '{"Create a secure master password of 20+ characters","Enable 2FA using an authenticator app","Successfully migrate at least 10 accounts","Generate and test strong unique passwords for each account","Document the process for training others"}', 'Bitwarden: https://bitwarden.com
Authenticator Apps: Authy, Google Authenticator
Password Strength Tester: https://bitwarden.com/password-strength
Migration Guide: Included in lab files
Best Practices Checklist: Included', 'Take your time with the master password - you can''t change it easily later. Start with less critical accounts for migration practice. Use the password generator for all new passwords. Keep recovery codes in a physical safe place.', 'Beginner', 50, 2, '46919028-1fe7-4e40-b96f-bb5d825f7139', NULL, true, '2026-01-19 00:50:42.565', '2026-01-19 00:50:42.565', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('b6aaceb8-3e52-4036-8d2d-ebc5d0e93a47', 'Social Engineering Attack Simulation', 'Participate in simulated social engineering scenarios to recognize manipulation tactics and practice appropriate responses.', '# Lab Overview
Experience common social engineering attacks in a safe environment and learn to recognize and respond to them.

## Setup Instructions
1. Access the social engineering simulation portal
2. Review the company background document
3. Familiarize yourself with the reporting procedures

## Scenarios
You will face 6 different scenarios. For each:
- Read the scenario carefully
- Identify red flags
- Choose your response
- Document your reasoning

### Scenario 1: The Urgent IT Request
You receive a call from someone claiming to be from IT support saying your account will be locked unless you verify your password immediately.

**Your Tasks:**
- Identify red flags in the approach
- Determine appropriate response
- Document what you would do instead

### Scenario 2: The Helpful Stranger
Someone in the parking lot with arms full of boxes asks you to badge them into the building.

**Your Tasks:**
- Assess the security risk
- Decide how to handle the situation
- Consider alternative ways to help

### Scenario 3: The Executive Email
You receive an email appearing to be from the CEO requesting an urgent wire transfer to a new vendor.

**Your Tasks:**
- Analyze email indicators
- Identify verification steps needed
- Document proper escalation procedure

### Scenario 4: The Survey Scam
A caller says you''ve been selected for a customer satisfaction survey with a prize, but needs to verify your employee ID.

**Your Tasks:**
- Recognize the scam indicators
- Determine what information is safe to share
- Plan appropriate response

### Scenario 5: The Vendor Visit
Someone arrives claiming to be from a maintenance company to inspect fire safety equipment but has no appointment on record.

**Your Tasks:**
- Assess credibility indicators
- Determine verification requirements
- Follow proper protocol

### Scenario 6: The LinkedIn Connection
You receive a LinkedIn message from a recruiter for an amazing opportunity who wants your personal email and phone number right away.

**Your Tasks:**
- Identify potential risks
- Determine safe information sharing
- Recognize professional vs. suspicious behavior

## For Each Scenario Document:
1. Red flags identified (minimum 3)
2. Psychological tactics being used
3. Your chosen response
4. Correct company policy to follow
5. How to verify legitimacy

## Analysis Questions
1. What psychological principles were attackers using?
2. Which scenario was hardest to identify? Why?
3. What policies would help prevent these attacks?
4. How would you train others on these scenarios?

## Deliverables
- Completed scenario response forms (all 6)
- Red flag identification sheet
- Analysis document
- Training recommendations', 'Your company is conducting security awareness training. These simulated scenarios test your ability to recognize and respond to social engineering attempts. Your performance will help improve company security policies.', '{"Successfully identify red flags in all 6 scenarios","Choose appropriate responses that prioritize security","Demonstrate understanding of verification procedures","Document at least 3 red flags per scenario","Provide practical recommendations for policy improvements"}', 'Social Engineering Simulation Portal: Access via lab link
Company Security Policy: Included
Incident Reporting Procedures: Included
Psychological Tactics Guide: Course materials
Verification Checklist: Provided', 'Remember: it''s okay to seem rude if security is at stake. Legitimate requests can wait for verification. Trust your instincts - if something feels off, it probably is. Always use official channels to verify.', 'Intermediate', 40, 1, '60832135-1fbc-4397-af53-5e1e029e1e0e', NULL, true, '2026-01-19 00:50:42.567', '2026-01-19 00:50:42.567', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('9656c532-189a-4075-8593-4874a1981317', 'Malicious Website Identification Lab', 'Analyze various websites to identify security risks, spoofed pages, and malicious indicators.', '# Lab Overview
Practice identifying malicious and spoofed websites using safe examples in an isolated environment.

## Setup Instructions
1. Access the isolated browser environment
2. Review the website analysis checklist
3. Familiarize yourself with browser security tools

## Tasks
### Task 1: URL Analysis (10 websites)
For each URL provided, analyze:
- Domain legitimacy
- TLD (top-level domain) red flags
- Typosquatting indicators
- Subdomain tricks
- HTTPS presence and certificate validity

### Task 2: Certificate Inspection
Examine SSL/TLS certificates for:
- Valid certificate authority
- Domain match
- Expiration date
- Certificate warnings
- Self-signed certificates

### Task 3: Content Analysis
Review website content for:
- Poor design quality
- Grammar and spelling errors
- Mismatched branding
- Missing contact information
- Unrealistic offers
- Suspicious payment methods

### Task 4: Technical Indicators
Use browser tools to check:
- Page source for hidden redirects
- JavaScript behavior
- Cookie policies
- External resources loaded
- Pop-up behavior

### Task 5: Comparison Testing
Compare legitimate vs. spoofed sites:
- amazon.com vs. amaz0n.com
- paypal.com vs. paypa1.com
- Your bank vs. a spoofed version
- Document differences found

## Website Categories to Analyze
1. E-commerce sites (3 examples)
2. Banking/Financial (2 examples)
3. Social media login pages (2 examples)
4. Software download sites (2 examples)
5. Tech support pages (1 example)

## Documentation Requirements
For each website:
✅ Screenshot
✅ URL analysis
✅ Certificate status
✅ Red flags identified
✅ Legitimacy rating (1-5 scale)
✅ Risk assessment
✅ Safe browsing recommendation

## Deliverables
- Complete analysis for 10 websites
- Comparison document (legitimate vs. fake)
- Red flag summary sheet
- Best practices guide you would give to family members', 'You are creating a training module for non-technical users. Use this lab to document real examples of malicious websites and create a simple guide that anyone can understand.', '{"Successfully analyze at least 10 different websites","Correctly identify all spoofed/malicious sites provided","Document minimum 3 red flags per suspicious site","Demonstrate proper certificate inspection techniques","Create a practical guide for identifying malicious websites"}', 'Isolated Browser Environment: Provided
Website Analysis Checklist: Included
SSL Checker: SSL Labs, Why No Padlock
URL Scanner: VirusTotal, URLScan.io
Phishing Examples Database: Included
Legitimate Site References: Provided', 'Always check the full URL, not just what you see. Look for HTTPS, but remember HTTPS doesn''t guarantee legitimacy. Check certificate details, not just the padlock icon. Compare suspicious sites side-by-side with legitimate ones.', 'Beginner', 55, 1, '7a0f1b41-a422-419a-8f8d-988c85d785b2', NULL, true, '2026-01-19 00:50:42.569', '2026-01-19 00:50:42.569', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('74bc3ce8-2c46-408f-b5a9-ba27f3cfe2ed', 'Data Classification & Protection Exercise', 'Practice classifying different types of data and implementing appropriate protection measures.', '# Lab Overview
Learn to properly classify data and apply appropriate security controls for each classification level.

## Setup Instructions
1. Review the data classification framework
2. Access the sample data repository
3. Review available protection tools

## Tasks
### Task 1: Data Classification
Classify the following data types according to the framework (Public, Internal, Confidential, Restricted):

**Personal Information:**
- Your name
- Social Security Number
- Home address
- Email address
- Date of birth
- Medical records
- Phone number
- Employment history

**Business Information:**
- Company marketing materials
- Internal memos
- Customer database
- Financial reports
- Trade secrets
- Employee handbook
- Salary information
- Strategic plans

Document your classification decisions and reasoning.

### Task 2: Risk Assessment
For each data type classified as Confidential or Restricted:
- Identify potential risks if exposed
- Estimate impact severity (Low/Medium/High/Critical)
- List threat actors who might target it
- Document regulatory implications

### Task 3: Protection Implementation
Implement appropriate controls for sample files:

**File 1: Personal Tax Returns (Restricted)**
- Encrypt the file
- Set up password protection
- Configure secure storage location
- Document access procedures

**File 2: Medical Records (Restricted)**
- Apply encryption
- Set up access logging
- Configure backup procedures
- Document retention policy

**File 3: Financial Statements (Confidential)**
- Apply appropriate encryption
- Set sharing restrictions
- Configure audit trail
- Document handling procedures

**File 4: Internal Project Notes (Internal)**
- Basic access control
- Storage location
- Sharing guidelines

### Task 4: Secure Sharing
Practice secure file sharing:
- Share File 1 securely with authorized party
- Set expiration date
- Require authentication
- Enable download tracking
- Document the process

### Task 5: Data Lifecycle
Create a data lifecycle plan for:
- Creation/Collection controls
- Storage requirements
- Access management
- Retention period
- Secure deletion procedures

## Documentation Checklist
✅ All data types classified with justification
✅ Risk assessments completed
✅ Encryption applied to restricted data
✅ Secure sharing tested and documented
✅ Access logs configured
✅ Backup procedures documented
✅ Retention policies defined
✅ Secure deletion procedures tested

## Analysis Questions
1. What happens if data is misclassified?
2. How does classification affect business operations?
3. What are the costs of over-classifying data?
4. How often should classifications be reviewed?
5. Who should be responsible for classification decisions?

## Deliverables
- Completed data classification matrix
- Risk assessment report
- Protection implementation guide
- Secure sharing procedure document
- Data lifecycle management plan', 'You are implementing a data protection program at your organization. This lab helps you understand how to classify different types of data and apply appropriate security controls based on sensitivity levels.', '{"Correctly classify at least 16 different data types","Implement encryption for all Restricted data","Configure secure sharing with expiration and tracking","Document complete data lifecycle procedures","Create practical protection guidelines for each classification level"}', 'Data Classification Framework: NIST guidelines included
Encryption Tools: VeraCrypt, 7-Zip, GPG
Secure Sharing: Dropbox, Google Drive with security settings
Access Control Guide: Included
Retention Policy Templates: Provided
Secure Deletion Tools: Eraser, BleachBit', 'When in doubt, classify higher rather than lower. Consider cumulative risk - multiple low-sensitivity items can become high-sensitivity together. Encryption is cheap, data breaches are expensive. Document everything - you''ll need to prove compliance.', 'Intermediate', 65, 1, '46ca4918-f919-4f00-812d-bd5df57b3b10', NULL, true, '2026-01-19 00:50:42.57', '2026-01-19 00:50:42.57', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('e61141fc-5103-426f-ac6f-6d53bb4b7666', 'Incident Response Tabletop Exercise', 'Participate in a simulated ransomware incident response scenario following the NIST framework.', '# Lab Overview
Experience a realistic incident response scenario as part of the incident response team responding to a ransomware attack.

## Setup Instructions
1. Review your role assignment (Security Analyst)
2. Read the company background and infrastructure
3. Familiarize yourself with IR tools and playbooks
4. Review NIST Incident Response framework

## Scenario Timeline
You will work through a ransomware incident from detection to resolution.

### Hour 0 - Detection (08:00 AM)
**Situation:** Multiple users report they cannot access files. Desktop backgrounds changed to ransom notes.

**Your Tasks:**
- Assess initial indicators
- Determine incident severity
- Activate incident response team
- Begin documentation
- Establish communication channels

### Hour 1 - Analysis (09:00 AM)
**New Information:**
- 50+ workstations affected
- Ransomware identified as REvil variant
- Network shares encrypted
- Ransom demand: 50 Bitcoin

**Your Tasks:**
- Map affected systems
- Identify patient zero
- Determine ransomware variant
- Check backup status
- Preserve evidence
- Update stakeholders

### Hour 2 - Containment (10:00 AM)
**Actions Required:**
- Isolate affected systems
- Block C2 communication
- Prevent lateral movement
- Secure backups
- Document all actions

**Your Tasks:**
- Create isolation plan
- Identify IOCs for blocking
- Check for persistence mechanisms
- Verify backup integrity
- Update containment status

### Hour 4 - Eradication (12:00 PM)
**Status:** Threat contained, moving to eradication

**Your Tasks:**
- Remove ransomware from all systems
- Patch vulnerabilities exploited
- Reset compromised credentials
- Rebuild infected systems
- Verify complete removal
- Document all changes

### Hour 8 - Recovery (04:00 PM)
**Status:** Clean systems ready for restoration

**Your Tasks:**
- Restore from backups
- Verify data integrity
- Test critical systems
- Bring systems online progressively
- Monitor for re-infection
- Document recovery steps

### Day 3 - Post-Incident
**Status:** Operations restored, lessons learned phase

**Your Tasks:**
- Complete incident report
- Timeline reconstruction
- Root cause analysis
- Identify security gaps
- Recommend improvements
- Update playbooks

## Documentation Requirements

### Incident Report Sections:
1. **Executive Summary**
   - Incident overview
   - Impact assessment
   - Response summary
   - Recommendations

2. **Timeline**
   - Chronological event log
   - All actions taken
   - Decisions made
   - Key findings

3. **Technical Analysis**
   - Attack vector identification
   - Ransomware variant analysis
   - Affected systems inventory
   - IOCs documented

4. **Response Actions**
   - Containment measures
   - Eradication procedures
   - Recovery steps
   - Verification activities

5. **Lessons Learned**
   - What worked well
   - What needs improvement
   - Security gaps identified
   - Recommended changes

6. **Appendices**
   - IOC list
   - Communications log
   - Evidence inventory
   - Tool outputs

## Decision Points
You will face critical decisions:
- Pay ransom or restore from backups?
- Notify law enforcement?
- Public disclosure timing?
- Business continuity priorities?

Document your decisions and rationale.

## Metrics to Track
- Time to detect
- Time to contain
- Systems affected
- Data lost/recovered
- Downtime duration
- Response costs

## Deliverables
- Complete incident report (all sections)
- Detailed timeline of events
- IOC list with blocking rules
- Lessons learned document
- Updated incident response playbook
- Executive presentation (5 slides)', 'It''s Monday morning at FinTech Corp, a financial services company with 500 employees. You are the security analyst on duty when the help desk starts receiving unusual calls about encrypted files. This is your first major incident.', '{"Follow NIST IR framework through all phases","Complete comprehensive incident documentation","Make and justify critical incident response decisions","Identify and document at least 10 IOCs","Provide actionable recommendations for prevention"}', 'NIST IR Guide: SP 800-61 Rev 2
Ransomware Playbook: Included
IR Tools: Volatility, FTK Imager, Wireshark
IOC Databases: AlienVault OTX, MISP
Forensic Analysis VMs: Provided
Communication Templates: Included
Decision Trees: Included', 'Act quickly but document everything. Don''t make unilateral decisions on critical issues. Communication is as important as technical response. Focus on containment before eradication. Verify backups before you need them. Every incident teaches something.', 'Advanced', 120, 1, '12769777-25e1-4cd4-82a9-990bda9b97de', NULL, true, '2026-01-19 00:50:42.572', '2026-01-19 00:50:42.572', 'CONTENT', 70, NULL);
INSERT INTO public.labs (id, title, description, instructions, scenario, objectives, resources, hints, difficulty, "estimatedTime", "order", "courseId", "moduleId", "isPublished", "createdAt", "updatedAt", "labType", "passingScore", "simulationConfig") VALUES ('adfa91aa-d9a9-4ee8-b4d7-aaf1d49a8f8d', 'Threat Hunting with MITRE ATT&CK', 'Conduct proactive threat hunting using the MITRE ATT&CK framework to discover hidden threats in a simulated environment.', '# Lab Overview
Use threat intelligence and the MITRE ATT&CK framework to hunt for sophisticated threats in a corporate network.

## Setup Instructions
1. Access the threat hunting VM environment
2. Review the ATT&CK Navigator
3. Familiarize yourself with hunting tools (Splunk, Sysmon, Wireshark)
4. Review the network baseline documentation

## Threat Hunting Missions

### Mission 1: Credential Access Hunt
**Hypothesis:** Attackers may be dumping credentials using LSASS memory access.

**ATT&CK Techniques:** T1003.001 (LSASS Memory)

**Hunt Steps:**
1. Review Sysmon logs for process access to LSASS
2. Identify unusual tools (Mimikatz, ProcDump)
3. Check for credential dumping indicators
4. Analyze memory dumps if found
5. Document findings

**Data Sources:**
- Sysmon Event ID 10 (Process Access)
- Security Event ID 4656 (Handle to Object)
- PowerShell logs

**Queries to Run:**

Sysmon: EventID=10 TargetImage="*lsass.exe"
Security: EventID=4656 ObjectName="*lsass.exe"
PowerShell: Look for Invoke-Mimikatz

### Mission 2: Persistence Mechanism Hunt
**Hypothesis:** APT may have established persistence through scheduled tasks or registry run keys.

**ATT&CK Techniques:** T1053.005 (Scheduled Task), T1547.001 (Registry Run Keys)

**Hunt Steps:**
1. Enumerate all scheduled tasks
2. Check registry run key locations
3. Identify suspicious entries
4. Validate task/binary legitimacy
5. Check creation timestamps

**Registry Locations:**
- HKLM\Software\Microsoft\Windows\CurrentVersion\Run
- HKCU\Software\Microsoft\Windows\CurrentVersion\Run
- Startup folders

**PowerShell Commands:**

Get-ScheduledTask | Where Author -notlike "*Microsoft*"
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"

### Mission 3: Lateral Movement Hunt
**Hypothesis:** Attackers using RDP or WMI for lateral movement.

**ATT&CK Techniques:** T1021.001 (RDP), T1047 (WMI)

**Hunt Steps:**
1. Analyze RDP connections
2. Check for unusual WMI activity
3. Look for admin share access
4. Identify service creation events
5. Map movement timeline

**Data Sources:**
- Security Event ID 4624 (Logon) Type 10
- Security Event ID 4672 (Special Logon)
- Security Event ID 4697 (Service Creation)
- WMI Event Logs

### Mission 4: Command & Control Hunt
**Hypothesis:** Malware communicating with C2 servers using encoded or encrypted channels.

**ATT&CK Techniques:** T1071 (Application Layer Protocol), T1573 (Encrypted Channel)

**Hunt Steps:**
1. Analyze network traffic patterns
2. Identify beaconing behavior
3. Check for unusual DNS requests
4. Look for data encoding
5. Investigate suspicious connections

**Analysis:**
- Long connection duration analysis
- Periodic/beaconing traffic patterns
- Unusual ports or protocols
- High-entropy data transfers
- Domain generation algorithms (DGA)

### Mission 5: Data Exfiltration Hunt
**Hypothesis:** Large data transfers to external locations.

**ATT&CK Techniques:** T1041 (Exfiltration Over C2), T1048 (Exfiltration Over Alternative Protocol)

**Hunt Steps:**
1. Analyze outbound data volumes
2. Identify unusual destinations
3. Check for data compression
4. Look for unusual protocols
5. Correlate with user activity

**Metrics:**
- Baseline outbound traffic per user
- Anomalous upload volumes
- Off-hours transfers
- Unusual destinations

## For Each Mission Document:

### Hunt Log:
- Hypothesis tested
- Data sources used
- Queries executed
- Findings discovered
- False positives noted
- True positives confirmed

### Technical Analysis:
- IOCs identified
- Attack timeline
- Affected systems
- Techniques observed
- Recommendations

### ATT&CK Mapping:
- Tactics identified
- Techniques used
- Sub-techniques observed
- Coverage gaps

## Advanced Analysis

### Correlation Analysis:
- Look for relationships between hunts
- Build attack chain timeline
- Identify campaign indicators
- Group IOCs by threat actor

### Detection Engineering:
For each finding:
- Create detection rule
- Test for false positives
- Document trigger criteria
- Implement in SIEM

## Deliverables
- Hunt log for all 5 missions
- IOC list (minimum 15 IOCs)
- ATT&CK Navigator heat map
- Detection rules created (min 5)
- Threat hunting report
- Recommendations for security improvements
- Hunting playbook updates', 'Your organization suspects an Advanced Persistent Threat (APT) may have gained access to the network. No alerts have fired, but threat intelligence suggests your industry is being targeted. Conduct proactive hunting to find evidence of compromise.', '{"Complete all 5 threat hunting missions","Identify at least 15 unique IOCs","Map findings to MITRE ATT&CK framework","Create at least 5 detection rules","Document a complete attack chain if found"}', 'Threat Hunting VM: Windows Server with Sysmon
SIEM: Splunk with sample logs
ATT&CK Navigator: https://mitre-attack.github.io/attack-navigator
Network Baseline: Provided
Threat Intel Feeds: Included
Hunting Queries Library: Included
Wireshark: For network analysis', 'Start with high-confidence hypotheses based on threat intel. Look for anomalies compared to baseline. Not every hunt finds threats - that''s okay. Document everything including dead ends. Correlation is key - isolated events may be part of larger campaign.', 'Advanced', 150, 2, '12769777-25e1-4cd4-82a9-990bda9b97de', NULL, true, '2026-01-19 00:50:42.572', '2026-01-19 00:50:42.572', 'CONTENT', 70, NULL);


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('749d81b6-48d2-41d3-95b1-a9075e6aebc4', 'MITRE ATT&CK', '# Understanding the MITRE ATT&CK Framework

## What is MITRE ATT&CK?

MITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques based on real-world observations.

Created by: MITRE Corporation
Purpose: Standardized framework for understanding cyber adversary behavior

Think of ATT&CK as a dictionary of hacker techniques and a common language for threat intelligence.

## The 14 Enterprise Tactics

1. Reconnaissance - Gathering information
2. Resource Development - Establishing resources
3. Initial Access - Getting into network
4. Execution - Running malicious code
5. Persistence - Maintaining foothold
6. Privilege Escalation - Gaining higher permissions
7. Defense Evasion - Avoiding detection
8. Credential Access - Stealing credentials
9. Discovery - Learning about environment
10. Lateral Movement - Moving through network
11. Collection - Gathering data
12. Command and Control - Communicating with systems
13. Exfiltration - Stealing data out
14. Impact - Disrupting availability

## Example Techniques

T1566: Phishing (Initial Access)
T1003: Credential Dumping (Credential Access)
T1059: Command and Scripting (Execution)
T1078: Valid Accounts (Multiple tactics)

## How Organizations Use ATT&CK

- Threat intelligence and tracking
- Detection engineering
- Red team planning
- Gap analysis
- Security product evaluation

## Key Takeaways

- Common language across cybersecurity industry
- 200+ techniques based on real attacks
- Used for detection, threat intelligence, testing
- Free and openly accessible
- Continuously updated by MITRE', 'https://www.youtube.com/watch?v=bkfwMADar0M', 4, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.808', '2026-01-19 11:42:54.655', '6e75217d-f103-4414-a4ac-a0f2b2dec9fa');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('77dba85c-3f16-4a27-b13b-d9952e28efe1', 'Cyber Kill Chain', '# Understanding the Cyber Kill Chain

## What is the Cyber Kill Chain?

Framework for understanding the stages of a cyberattack, developed by Lockheed Martin in 2011.

Key Insight: If you break the chain at any point, you stop the attack.

## The 7 Stages

1. Reconnaissance - Research and identify targets
2. Weaponization - Create malicious payload
3. Delivery - Transmit weapon to target
4. Exploitation - Exploit vulnerability to execute
5. Installation - Install malware on system
6. Command and Control - Establish communication channel
7. Actions on Objectives - Achieve attacker''s goal

## Defense Strategy

**Left of Boom (Proactive):**
- Stop early stages (Recon, Delivery, Exploitation)
- More cost-effective, less damage

**Right of Boom (Reactive):**
- Later stages (Installation, C2, Actions)
- Attack succeeded, focus on containment

## Breaking the Kill Chain

Each stage offers opportunities to disrupt:
- Delivery: Email filtering, web filtering
- Exploitation: Patch management, EDR
- C2: Network monitoring, firewall rules
- Actions: Backups, segmentation

## Key Takeaways

- 7-stage framework for understanding attacks
- Breaking any stage stops the attack
- Focus on early stages for prevention
- Use with MITRE ATT&CK for comprehensive defense
- Map security controls to each stage', 'https://www.youtube.com/watch?v=bZqaGd-b4lM', 5, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.809', '2026-01-19 11:42:54.657', '6e75217d-f103-4414-a4ac-a0f2b2dec9fa');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('955ae131-a163-4295-bc59-dab72046ed3f', 'Indicators of Compromise', '# Indicators of Compromise (IOCs)

## What are IOCs?

Forensic artifacts or observable evidence indicating a potential security breach.

Think of IOCs as digital fingerprints left by attackers.

## Types of IOCs

**Network-Based:**
- IP addresses (C2 servers)
- Domain names
- URLs
- Email addresses
- Network traffic patterns

**Host-Based:**
- File hashes (MD5, SHA-256)
- File names and paths
- Registry keys
- Mutex names
- Processes

**Behavioral:**
- User behavior anomalies
- System behavior changes
- Application behavior

## IOC Pyramid of Pain

**Easy to Change (Low Value):**
- Hash values - change one byte
- IP addresses - cheap to change
- Domain names - easy to register

**Hard to Change (High Value):**
- Tools - requires development
- TTPs (Tactics, Techniques, Procedures) - fundamental methodology

Focus on detecting behaviors (TTPs) over signatures.

## Using IOCs

**Threat Hunting:**
- Search environment for known IOCs
- Proactive detection
- Find compromised systems

**Incident Response:**
- Extract IOCs from compromised systems
- Search historical data
- Identify other affected systems

## Key Takeaways

- IOCs are evidence of security breaches
- TTPs more valuable than IPs/hashes
- IOCs have short shelf life - update regularly
- Use for threat hunting and incident response
- Share via standardized formats (STIX/TAXII)
- Automate IOC collection and distribution', 'https://www.youtube.com/watch?v=SjMBxJDVgJ8', 6, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.81', '2026-01-19 11:42:54.659', 'd9861794-240a-48f7-a6e2-c4c0afad6e5f');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('3b22f6a9-3ffb-4a11-970c-9dda18d210dd', 'Passkey Technology', '# Passkey Technology: The Future of Authentication

## What are Passkeys?

Passkeys are a modern, passwordless authentication method using public-key cryptography.

Standard: FIDO2 / WebAuthn
Supported by: Apple, Google, Microsoft

## Why Passkeys Matter

Passwords are fundamentally broken:
- 80% of data breaches involve weak or stolen passwords
- Password reuse is rampant
- Phishing steals passwords easily

Passkeys fix these issues:
- No phishing possible
- No password reuse
- Private key never leaves device
- Easy biometric authentication

## How Passkeys Work

Two Keys:
- Private Key: Stored securely on device, never shared
- Public Key: Given to website

Process:
1. Create passkey for website
2. Device generates key pair
3. Public key sent to website
4. Private key stays on device encrypted
5. Login uses biometric to unlock private key

## Key Takeaways

- Passkeys use cryptography to replace passwords
- Cannot be phished - tied to domain
- Faster than passwords - one biometric scan
- Sync across devices via cloud
- Major sites adding support (Google, PayPal, GitHub)
- Try passkeys today on supported sites', 'https://www.youtube.com/watch?v=5Yp36kx4dsY', 7, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:53:03.805', '2026-01-19 11:42:54.654', '96406223-7051-43d7-901a-55878daeba07');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('559a2965-d990-4577-88fb-27783d94926b', 'Phishing Simulation Training', '# Phishing Simulation Training

## What is Phishing Simulation Training?

Phishing simulation training involves sending realistic (but fake) phishing emails to employees to test their ability to recognize phishing attempts and create a security-conscious culture.

It''s a controlled, safe environment where mistakes become learning opportunities rather than data breaches.

## Why Simulations Work

Organizations using phishing simulations see:
- 30-40% reduction in click rates within 6 months
- 50-70% reduction within 12 months
- Increased reporting of suspicious emails

## Key Metrics

**Click Rate:**
- Percentage who clicked the link
- Target: < 5% after training

**Data Entry Rate:**
- Percentage who entered credentials
- Target: < 2%

**Reporting Rate:**
- Percentage who reported suspicious email
- Target: > 60%

## Best Practices

Do:
- Provide immediate feedback
- Focus on education, not punishment
- Vary difficulty over time
- Celebrate those who report

Don''t:
- Shame or discipline those who click
- Over-simulate (causes fatigue)
- Use unrealistic scenarios

## Key Takeaways

- Simulations reduce click rates by 30-70% within 12 months
- Focus on education, not punishment
- Monthly or quarterly frequency is ideal
- Immediate feedback is critical
- Celebrate and reward reporting', 'https://www.youtube.com/watch?v=sxsaBwHLlA0', 8, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:53:03.801', '2026-01-19 11:42:54.651', '04626f01-23f6-4bf7-965b-1a82fa96a064');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('c472dce0-5357-4b1a-a041-b370123b9e99', 'Browser Security Basics', '# Understanding Browser Security

## Your Browser is a Gateway

Your web browser is your primary interface with the internet. It''s also a primary target for attackers.

## Essential Browser Security Settings

### Keep Your Browser Updated
- Updates patch security vulnerabilities
- Enable automatic updates
- Restart your browser regularly to apply updates

### Use HTTPS Everywhere
- Look for the padlock icon
- Avoid sites without HTTPS for sensitive activities
- Consider browser extensions that enforce HTTPS

### Manage Cookies and Tracking
- Clear cookies regularly
- Use private/incognito mode for sensitive browsing
- Consider cookie management extensions

### Control Pop-ups and Redirects
- Enable pop-up blocking
- Be wary of unexpected redirects
- Don''t allow notifications from untrusted sites

## Browser Extensions

### Helpful Security Extensions
- **uBlock Origin**: Ad and tracker blocking
- **HTTPS Everywhere**: Force secure connections
- **Privacy Badger**: Block invisible trackers

### Extension Safety
- Only install from official stores
- Check permissions requested
- Fewer extensions = smaller attack surface
- Remove extensions you don''t use', 'https://www.youtube.com/watch?v=_p-LNLv49Ug', 1, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('7556a409-840a-44ce-a573-28ce879ac7c1', 'Recognizing Malicious Websites', '# How to Identify Dangerous Websites

## URL Red Flags

### Check the Domain Carefully
- **Typosquatting**: amaz0n.com, goggle.com
- **Subdomain tricks**: amazon.fakesite.com
- **Similar characters**: arnazon.com (rn looks like m)

### Verify HTTPS
- Padlock icon should be present
- Click the padlock to verify certificate
- "Not Secure" warning = proceed with caution

### Watch for Suspicious TLDs
- Be cautious with unusual extensions
- .xyz, .top, .click are often used by scammers
- Legitimate companies usually use .com, .org, .net

## Website Content Red Flags

### Poor Design Quality
- Broken images or layouts
- Spelling and grammar errors
- Mismatched branding

### Too Good to Be True
- Unrealistic prices or offers
- Countdown timers creating urgency
- Pop-ups that won''t close

### Missing Information
- No contact information
- No privacy policy
- No physical address

## Before You Enter Information

1. Verify the URL matches the expected site
2. Check for HTTPS and valid certificate
3. Look for trust signals (reviews, security badges)
4. When in doubt, navigate directly to the site instead of clicking links', NULL, 2, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('dc54630b-7cb0-4593-9fe4-a1b2f4c0c1c4', 'Safe Downloading Practices', '# Downloading Files Safely

## Before You Download

### Verify the Source
- Download from official websites only
- Check URL carefully for legitimacy
- Avoid "download" sites that aggregate software

### Check File Reputation
- Search for reviews and reports
- Use VirusTotal to scan files
- Be wary of newly created software

## During Download

### Watch for Bundled Software
- Use custom/advanced installation options
- Uncheck pre-selected additional software
- Read each installation screen carefully

### File Type Awareness
- Be cautious with executable files (.exe, .msi, .dmg)
- Documents can contain macros (.docm, .xlsm)
- Archives can hide dangerous files (.zip, .rar)

## After Download

### Scan Before Opening
- Use antivirus to scan downloaded files
- Don''t disable security warnings
- Quarantine suspicious files

### Verify Integrity
- Check file hashes when provided
- Compare file size to expected size
- Be suspicious of files that are much smaller/larger

## Safe Download Checklist

✅ Official website or trusted source
✅ HTTPS connection
✅ File type is expected
✅ Scanned by antivirus
✅ No bundled software accepted
✅ Permissions make sense for the software', NULL, 3, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('868def8f-2659-4b41-873e-44d23fc0a9b7', 'Introduction to Phishing', '# What is Phishing?

Phishing is a type of social engineering attack where attackers attempt to trick you into revealing sensitive information such as passwords, credit card numbers, or personal data.

## How Phishing Works

1. **Bait**: Attackers create convincing fake emails, websites, or messages
2. **Hook**: They use urgency, fear, or curiosity to get you to act
3. **Catch**: You unknowingly provide sensitive information

## Common Types of Phishing

- **Email Phishing**: Mass emails pretending to be from legitimate companies
- **Spear Phishing**: Targeted attacks on specific individuals
- **Whaling**: Attacks targeting executives and high-profile individuals
- **Smishing**: Phishing via SMS text messages
- **Vishing**: Voice phishing via phone calls

## Why It Matters

Phishing is responsible for over 90% of data breaches. Understanding how to identify these attacks is crucial for personal and organizational security.', 'https://www.youtube.com/watch?v=XBkzBrXlle0', 1, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('651d1978-db00-4f46-8948-dd9bd47efb11', 'Recognizing Phishing Emails', '# How to Spot a Phishing Email

## Red Flags to Watch For

### 1. Suspicious Sender Address
- Check the actual email address, not just the display name
- Look for misspellings: "support@amaz0n.com" vs "support@amazon.com"
- Be wary of public email domains for business communications

### 2. Generic Greetings
- "Dear Customer" instead of your actual name
- "Dear User" or "Dear Account Holder"

### 3. Urgency and Threats
- "Your account will be suspended in 24 hours!"
- "Immediate action required!"
- "You''ve been compromised!"

### 4. Suspicious Links
- Hover over links before clicking
- Check if the URL matches the supposed sender
- Look for HTTPS and valid certificates

### 5. Poor Grammar and Spelling
- Professional companies proofread their communications
- Multiple errors suggest a scam

### 6. Unexpected Attachments
- Never open attachments you weren''t expecting
- Be especially wary of .exe, .zip, or macro-enabled documents

## What To Do

1. Don''t click any links or download attachments
2. Report the email to your IT department
3. Delete the email
4. If unsure, contact the company directly through official channels', 'https://www.youtube.com/watch?v=Y7zNlEMDmI4', 2, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('9aa8493a-86ba-47b7-a8b1-c15da9661c9e', 'Protecting Yourself from Phishing', '# Best Practices for Phishing Prevention

## Technical Safeguards

### Enable Multi-Factor Authentication (MFA)
- Adds an extra layer of security
- Even if passwords are stolen, attackers can''t access accounts
- Use authenticator apps over SMS when possible

### Keep Software Updated
- Install security patches promptly
- Use automatic updates when available
- Keep browsers and email clients current

### Use Email Filtering
- Enable spam filters
- Use email authentication (SPF, DKIM, DMARC)
- Consider advanced threat protection

## Behavioral Safeguards

### Verify Before You Trust
- When in doubt, contact the sender through official channels
- Don''t use contact info from suspicious emails
- Look up official phone numbers independently

### Think Before You Click
- Hover over links to preview URLs
- Type URLs directly into your browser
- Be suspicious of shortened URLs

### Protect Your Information
- Never share passwords via email
- Legitimate companies won''t ask for sensitive data via email
- Use unique passwords for each account

## If You''ve Been Phished

1. **Change your passwords immediately**
2. **Enable MFA on all accounts**
3. **Monitor your accounts for suspicious activity**
4. **Report the incident to your IT department**
5. **Consider a credit freeze if financial data was exposed**', NULL, 3, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('1c9f650a-57ba-48a0-9c13-feb285d42d46', 'Why Password Security Matters', '# The Importance of Strong Passwords

## The Current Threat Landscape

- **81%** of data breaches involve weak or stolen passwords
- The average person has **100+** online accounts
- Password attacks are automated and run 24/7

## Common Password Attacks

### Brute Force Attacks
- Systematically trying every possible combination
- Modern computers can try billions of combinations per second
- Short passwords can be cracked in seconds

### Dictionary Attacks
- Using lists of common words and passwords
- "password123" is tried within milliseconds
- Includes common substitutions (p@ssw0rd)

### Credential Stuffing
- Using stolen username/password pairs from data breaches
- Automated testing across multiple sites
- Why password reuse is dangerous

### Social Engineering
- Tricking users into revealing passwords
- Fake password reset pages
- Shoulder surfing

## The Cost of Weak Passwords

- Financial loss
- Identity theft
- Reputation damage
- Loss of personal data
- Business disruption', 'https://www.youtube.com/watch?v=3NjQ9b3pgIg', 1, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('81209361-16e1-452b-8c91-fb7617a4a158', 'Creating Strong Passwords', '# How to Create Unbreakable Passwords

## Password Strength Factors

### Length is King
- **Minimum 12 characters**, 16+ is better
- Each additional character exponentially increases security
- "correcthorsebatterystaple" > "Tr0ub4dor&3"

### Complexity Matters (But Less Than You Think)
- Mix uppercase, lowercase, numbers, symbols
- Avoid predictable patterns (Password1!, Qwerty123)
- Don''t just add numbers/symbols at the end

## Password Creation Methods

### Passphrase Method
Create a sentence only you would know:
- "MyDogAte3BluePancakesIn2024!"
- "IMetMyWife@CoffeeShop#7"
- Easy to remember, hard to crack

### Random Generator Method
Use a password manager to generate:
- "xK9#mP2$vL5@nQ8"
- Maximum entropy
- Requires a password manager

### Diceware Method
- Roll dice to select random words
- "correct-horse-battery-staple"
- Highly secure and memorable

## What NOT to Do

❌ Personal information (birthdays, names, pets)
❌ Dictionary words alone
❌ Keyboard patterns (qwerty, 12345)
❌ Common substitutions everyone knows (@ for a, 0 for o)
❌ The same password everywhere
❌ Passwords shorter than 12 characters', NULL, 2, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('565e71ee-82bc-4bcd-8774-a35793a011c0', 'Password Managers & MFA', '# Tools for Password Security

## Password Managers

### What They Do
- Generate strong, unique passwords
- Securely store all your passwords
- Auto-fill login forms
- Sync across devices

### Recommended Password Managers
- **Bitwarden** (Free, open-source)
- **1Password** (Paid, excellent features)
- **Dashlane** (Paid, user-friendly)
- **KeePass** (Free, local storage)

### Best Practices
- Use a very strong master password
- Enable MFA on your password manager
- Regular backups
- Never share your master password

## Multi-Factor Authentication (MFA)

### What is MFA?
Something you:
1. **Know** (password)
2. **Have** (phone, security key)
3. **Are** (fingerprint, face)

### Types of MFA

#### Authenticator Apps (Recommended)
- Google Authenticator
- Microsoft Authenticator
- Authy

#### Hardware Security Keys (Most Secure)
- YubiKey
- Google Titan
- Feitian

#### SMS Codes (Better Than Nothing)
- Vulnerable to SIM swapping
- Use only if no other option

### Enable MFA Everywhere
Priority accounts:
1. Email (gateway to all other accounts)
2. Banking and financial
3. Social media
4. Work accounts
5. Password manager', NULL, 3, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('b154ffa6-048a-49e4-b085-d5d94e85c120', 'Understanding Data Classification', '# What Data Needs Protection?

## Types of Sensitive Data

### Personal Identifiable Information (PII)
- Full name
- Social Security Number
- Date of birth
- Address
- Phone number
- Email address

### Financial Information
- Credit card numbers
- Bank account details
- Tax information
- Investment records

### Health Information
- Medical records
- Insurance information
- Prescription data
- Health conditions

### Authentication Data
- Passwords
- Security questions
- Biometric data
- PINs

## Data Classification Levels

### Public
- Information that can be freely shared
- Marketing materials, public announcements

### Internal
- Not for public distribution
- Internal memos, policies

### Confidential
- Limited access required
- Customer data, financial reports

### Restricted
- Highest protection needed
- Trade secrets, PII, credentials

## Why Classification Matters

- Helps prioritize protection efforts
- Guides appropriate handling procedures
- Ensures compliance with regulations
- Reduces risk of data breaches', 'https://www.youtube.com/watch?v=wt1HwxaCx3U', 1, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('12204a28-93e8-4508-b219-b0ea422e1168', 'Data Protection Best Practices', '# Protecting Your Data

## Physical Security

### Secure Your Devices
- Never leave devices unattended
- Use cable locks for laptops
- Enable auto-lock with short timeout
- Encrypt device storage

### Document Handling
- Shred sensitive documents
- Use secure disposal bins
- Don''t leave papers on desks
- Lock filing cabinets

## Digital Security

### Encryption
- Encrypt sensitive files before sharing
- Use full-disk encryption
- Encrypt cloud storage
- Use encrypted messaging apps

### Access Control
- Use strong, unique passwords
- Enable multi-factor authentication
- Review app permissions regularly
- Revoke access when no longer needed

### Secure Sharing
- Use secure file sharing services
- Set expiration dates on shared links
- Use password protection for sensitive files
- Verify recipient before sending

## Data Minimization

### Collect Only What You Need
- Question data collection requests
- Provide minimum required information
- Use aliases when possible

### Delete What You Don''t Need
- Regularly review stored data
- Securely delete old files
- Clear browser history and cache
- Empty trash/recycle bin securely', NULL, 2, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('6f7ea8ba-c0cf-4571-813c-e605b6e51adb', 'Responding to Data Breaches', '# What to Do When Data is Compromised

## Recognizing a Breach

### Warning Signs
- Unexpected password reset emails
- Unfamiliar account activity
- Credit card charges you didn''t make
- Notifications from breach monitoring services
- Strange emails from your accounts

## Immediate Response

### Step 1: Contain the Damage
- Change passwords immediately
- Enable MFA if not already active
- Log out of all sessions
- Revoke suspicious app access

### Step 2: Assess the Impact
- What data was exposed?
- Which accounts are affected?
- Is financial information at risk?
- Was it personal or work-related?

### Step 3: Notify Relevant Parties
- Report to IT/security team (for work)
- Contact financial institutions
- File reports with authorities if needed
- Notify affected individuals

## Recovery Actions

### Financial Protection
- Place fraud alerts on credit reports
- Consider credit freeze
- Monitor accounts closely
- Report fraudulent charges

### Identity Protection
- Monitor for identity theft signs
- Consider identity monitoring services
- Keep records of all incidents
- File FTC identity theft report if needed

### Future Prevention
- Review how the breach occurred
- Implement stronger security measures
- Update passwords across accounts
- Enable additional security features

## Document Everything
- Keep a timeline of events
- Save all correspondence
- Document financial losses
- Record time spent on recovery', NULL, 3, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('0d81f2f7-cfee-4de3-b143-a0be638743d0', 'Understanding Social Engineering', '# The Human Element of Security

## What is Social Engineering?

Social engineering is the art of manipulating people into giving up confidential information or taking actions that compromise security. It exploits human psychology rather than technical vulnerabilities.

## Why It Works

### Psychological Principles Exploited

**Authority**
- People tend to comply with authority figures
- Attackers impersonate IT staff, executives, or officials

**Urgency**
- Creating time pressure prevents careful thinking
- "Act now or face consequences!"

**Fear**
- Threatening job loss, legal action, or account suspension
- Panic leads to poor decisions

**Trust**
- Building rapport before the attack
- Exploiting existing relationships

**Reciprocity**
- Doing a small favor first
- "I helped you, now help me"

**Social Proof**
- "Everyone else has done this"
- Using fake testimonials or references

## The Attack Lifecycle

1. **Research**: Gathering information about the target
2. **Develop Trust**: Building a relationship or credible story
3. **Exploit**: Making the request or launching the attack
4. **Exit**: Covering tracks and avoiding detection', 'https://www.youtube.com/watch?v=lc7scxvKQOo', 1, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('94cd37ff-425b-4f64-a64b-7caad74eab20', 'Common Social Engineering Attacks', '# Types of Social Engineering Attacks

## Pretexting

Creating a fabricated scenario to extract information.

**Examples:**
- IT support calling to "fix" your computer
- Bank representative verifying your account
- Recruiter requesting personal details

**Defense:** Always verify identity through official channels

## Baiting

Offering something enticing to deliver malware.

**Examples:**
- USB drives left in parking lots
- Free software downloads
- "You''ve won!" pop-ups

**Defense:** Never plug in unknown devices or download from untrusted sources

## Quid Pro Quo

Offering a service in exchange for information.

**Examples:**
- Free security audit that installs malware
- Technical support in exchange for credentials
- Survey with a prize requiring personal data

**Defense:** Be skeptical of unsolicited offers

## Tailgating/Piggybacking

Physically following authorized personnel into restricted areas.

**Examples:**
- Holding the door for someone with "full hands"
- Wearing a fake badge or uniform
- Claiming to be a vendor or delivery person

**Defense:** Always verify and badge everyone, even if awkward

## Vishing (Voice Phishing)

Phone-based social engineering.

**Examples:**
- IRS scam calls
- Tech support scams
- Bank fraud department impersonation

**Defense:** Hang up and call back on official numbers', NULL, 2, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('a55c8b10-ee57-4abd-ac81-0f6189ceea27', 'Defending Against Social Engineering', '# How to Protect Yourself

## Personal Defense Strategies

### Verify, Verify, Verify
- Always confirm identities through official channels
- Don''t use contact info provided by the requester
- When in doubt, hang up and call back

### Slow Down
- Urgency is a red flag
- Take time to think before acting
- It''s okay to say "let me get back to you"

### Limit Information Sharing
- Be cautious on social media
- Don''t overshare at work or in public
- Shred sensitive documents

### Trust Your Instincts
- If something feels wrong, it probably is
- It''s better to be rude than compromised
- Report suspicious interactions

## Organizational Defense

### Security Awareness Training
- Regular training for all employees
- Simulated phishing exercises
- Clear reporting procedures

### Policies and Procedures
- Verification protocols for sensitive requests
- Clean desk policy
- Visitor management

### Technical Controls
- Email filtering
- Multi-factor authentication
- Access controls

## When You Suspect an Attack

1. **Stop** - Don''t provide any more information
2. **Document** - Note details of the interaction
3. **Report** - Contact security/IT immediately
4. **Learn** - Share the experience to help others

Remember: There''s no shame in being targeted. Attackers are professionals. The shame is in not reporting it.', NULL, 3, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:50:42.523', '2026-01-19 00:50:42.523', NULL);
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('0053045f-cff4-46f7-8455-5a7e0c81831d', 'Threat Intelligence & Attack Frameworks', '# Understanding Advanced Threats

## The Evolving Threat Landscape

Modern cyber threats have evolved far beyond simple malware. Today''s attackers use sophisticated techniques that require equally sophisticated defenses.

## Advanced Persistent Threats (APTs)

### Characteristics of APTs
- **Persistence**: Attackers maintain long-term access to networks
- **Stealth**: Use of advanced evasion techniques
- **Targeted**: Focus on specific organizations or sectors
- **Resourced**: Often state-sponsored or well-funded criminal groups

### APT Attack Phases
1. **Reconnaissance**: Gathering information about targets
2. **Initial Compromise**: Gaining first foothold
3. **Establish Foothold**: Installing backdoors
4. **Escalate Privileges**: Gaining admin access
5. **Internal Reconnaissance**: Mapping the network
6. **Lateral Movement**: Moving to other systems
7. **Data Exfiltration**: Stealing valuable data
8. **Maintain Presence**: Ensuring continued access

## MITRE ATT&CK Framework

### What is ATT&CK?
A globally accessible knowledge base of adversary tactics and techniques based on real-world observations.

### Key Components

**Tactics** (The "Why")
- Initial Access
- Execution
- Persistence
- Privilege Escalation
- Defense Evasion
- Credential Access
- Discovery
- Lateral Movement
- Collection
- Exfiltration
- Impact

**Techniques** (The "How")
- Specific methods attackers use
- Sub-techniques for detailed categorization
- Mapped to real threat groups

### Using ATT&CK for Defense
- Map your security controls to the framework
- Identify gaps in coverage
- Prioritize security investments
- Develop detection strategies

## Indicators of Compromise (IOCs)

### Types of IOCs
- **Hash Values**: MD5, SHA1, SHA256 of malicious files
- **IP Addresses**: Known malicious IPs
- **Domain Names**: C2 servers, phishing domains
- **URLs**: Specific malicious URLs
- **Email Addresses**: Attacker email addresses
- **File Paths**: Common malware locations
- **Registry Keys**: Persistence mechanisms

### IOC Lifecycle
1. Discovery through analysis
2. Validation and correlation
3. Sharing with threat intel community
4. Aging and eventual retirement', 'https://www.youtube.com/watch?v=pcclNdwG8Vs', 1, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:50:42.524', '2026-01-19 00:52:15.8', '6e75217d-f103-4414-a4ac-a0f2b2dec9fa');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('407f37a3-03fe-4f4c-b8ca-ad98ff4988f5', 'Incident Response Methodology', '# Professional Incident Response

## The Incident Response Lifecycle

### NIST Incident Response Framework

**Phase 1: Preparation**
- Establish incident response team
- Define roles and responsibilities
- Develop playbooks and procedures
- Acquire and maintain tools
- Conduct training and exercises

**Phase 2: Detection & Analysis**
- Monitor security events
- Analyze alerts and anomalies
- Determine incident scope
- Document findings
- Prioritize response efforts

**Phase 3: Containment, Eradication & Recovery**
- Short-term containment (stop bleeding)
- Evidence preservation
- Long-term containment (sustainable fix)
- Eradication of threat
- System recovery and validation
- Return to normal operations

**Phase 4: Post-Incident Activity**
- Lessons learned meeting
- Update procedures and controls
- Report to stakeholders
- Improve detection capabilities

## Incident Severity Classification

### Severity Levels

**Critical (P1)**
- Active data breach in progress
- Ransomware spreading across network
- Complete system compromise
- Regulatory notification required
- Response: Immediate, all-hands

**High (P2)**
- Confirmed malware infection
- Unauthorized access detected
- Sensitive data at risk
- Response: Within 1 hour

**Medium (P3)**
- Suspicious activity detected
- Policy violation
- Potential security incident
- Response: Within 4 hours

**Low (P4)**
- Security alerts requiring investigation
- Minor policy violations
- Response: Within 24 hours

## Evidence Collection & Handling

### Order of Volatility
Collect in this order (most to least volatile):
1. Registers and cache
2. RAM/Memory
3. Network state
4. Running processes
5. Disk/storage
6. Remote logging data
7. Physical configuration
8. Backup media

### Chain of Custody
- Document who collected what
- Record timestamps
- Use write blockers
- Calculate and record hashes
- Secure storage
- Limit access to authorized personnel

## Communication During Incidents

### Internal Communication
- Establish secure communication channels
- Regular status updates
- Clear escalation paths
- Decision documentation

### External Communication
- Legal and PR involvement
- Regulatory notifications
- Customer/stakeholder communication
- Law enforcement coordination', NULL, 2, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:50:42.524', '2026-01-19 00:52:15.805', 'd9861794-240a-48f7-a6e2-c4c0afad6e5f');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('17a82222-e737-4a48-b3e9-3395b8cc55db', 'Forensic Analysis & Threat Hunting', '# Advanced Analysis Techniques

## Digital Forensics Fundamentals

### Forensic Principles
- **Integrity**: Never modify original evidence
- **Chain of Custody**: Document everything
- **Reproducibility**: Others can verify findings
- **Documentation**: Detailed notes and reports

### Key Forensic Artifacts

**Windows Systems**
- Event Logs (Security, System, Application)
- Registry hives
- Prefetch files
- NTFS artifacts ($MFT, $UsnJrnl)
- Browser artifacts
- Memory dumps

**Linux Systems**
- Auth logs (/var/log/auth.log)
- Syslog (/var/log/syslog)
- Bash history
- Cron jobs
- Process information

**Network Forensics**
- Packet captures (PCAP)
- NetFlow data
- DNS logs
- Proxy logs
- Firewall logs

## Threat Hunting

### What is Threat Hunting?
Proactively searching for threats that have evaded existing security controls.

### Hunting Methodologies

**Hypothesis-Driven Hunting**
1. Develop hypothesis based on threat intel
2. Determine data sources needed
3. Create detection queries
4. Analyze results
5. Refine and iterate

**IOC-Based Hunting**
- Search for known bad indicators
- Hash values
- IP addresses
- Domain names
- File paths

**Anomaly-Based Hunting**
- Establish baselines
- Look for deviations
- Investigate outliers
- Statistical analysis

### Essential Hunting Queries

**Unusual Process Execution**
- Processes running from temp folders
- Unsigned executables
- Processes with network connections

**Persistence Mechanisms**
- New scheduled tasks
- Registry run keys
- New services
- Startup folder additions

**Lateral Movement Indicators**
- Remote execution tools (PsExec, WMI)
- RDP connections
- Admin share access
- Pass-the-hash patterns

## Building a Threat Hunting Program

### Key Elements
1. **People**: Skilled analysts with diverse backgrounds
2. **Process**: Documented methodologies and playbooks
3. **Technology**: SIEM, EDR, network visibility tools
4. **Intelligence**: Threat feeds, industry reports

### Metrics for Success
- Number of hunts conducted
- Threats discovered
- Mean time to detect (MTTD)
- Mean time to respond (MTTR)
- Coverage of ATT&CK techniques

## Advanced Detection Engineering

### Detection-as-Code
- Version control for detection rules
- Testing and validation pipelines
- Automated deployment
- Performance monitoring

### SIGMA Rules
- Vendor-agnostic detection format
- Community-driven rule sharing
- Converts to platform-specific queries

### Reducing False Positives
- Baseline normal behavior
- Contextual enrichment
- Tuning thresholds
- Whitelisting known-good', NULL, 3, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:50:42.524', '2026-01-19 00:52:15.806', '922e8060-e5bc-423b-b208-e2edf1425cbe');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('67b80ac6-701e-4933-9810-8a5b903fe53d', 'Enterprise Password Security', '# Enterprise Password Security

## The Enterprise Password Challenge

Organizations face unique password security challenges:
- Hundreds to thousands of employees
- Complex systems and applications
- Regulatory compliance requirements
- Insider threats
- Privileged access management
- Remote workers and contractors
- Legacy systems with weak security

A single compromised password can expose entire organization.

## Enterprise Password Policies

### Password Policy Requirements

NIST Guidelines (Current Best Practices):
- Minimum 8 characters (12+ recommended)
- No complexity requirements (they backfire)
- No periodic password changes (unless compromise suspected)
- Screen passwords against breach databases
- Allow all printable characters (including spaces)
- No password hints or knowledge-based authentication

What Changed:
- Old policy: "Change password every 90 days, must include uppercase, lowercase, number, symbol"
- Problem: Users make predictable changes (Summer2023! becomes Fall2023!)
- New policy: Long passwords/passphrases, only change when compromised

### Policy Components

1. Password Length
- Minimum: 12-14 characters
- Passphrases encouraged
- No maximum length restriction

2. Password Complexity
- Encourage length over complexity
- Don''t mandate specific character types
- Allow (and encourage) passphrases

3. Password Expiration
- Only require change when:
  - Breach detected
  - Employee departure
  - System compromise
  - Suspicious activity
- Avoid arbitrary expiration

4. Password Reuse
- Prevent reusing last 10-24 passwords
- Applies to password changes
- Prevents cycling through same passwords

5. Account Lockout
- Lock after 5-10 failed attempts
- Lockout duration: 15-30 minutes or admin unlock
- Balance security with usability

## Multi-Factor Authentication (MFA) Enterprise Deployment

### MFA Strategy

Critical Systems (Require MFA):
- Email access
- VPN/remote access
- Administrative accounts
- Financial systems
- Customer data systems
- Cloud platforms (AWS, Azure, GCP)

MFA Methods for Enterprise:
1. Hardware security keys (highest security)
   - YubiKeys for admins and high-risk users
   - FIDO2 compliance

2. Authenticator apps (standard users)
   - Microsoft/Google Authenticator
   - Duo Mobile
   - Okta Verify

3. Push notifications (with fraud detection)
   - Easy for users
   - Implement number matching to prevent MFA fatigue attacks

4. SMS (only as fallback)
   - Not recommended as primary
   - For account recovery only

## Privileged Access Management (PAM)

### What is Privileged Access?

Privileged accounts:
- System administrators
- Database administrators
- Network administrators
- Domain admins
- Service accounts
- Root/superuser accounts

Why PAM is Critical:
- Privileged accounts can access everything
- Target of sophisticated attacks
- Insider threat risk
- Compliance requirements

### PAM Best Practices

1. Principle of Least Privilege
- Grant minimum necessary permissions
- Just-in-time access (temporary elevation)
- Regular access reviews
- Separate accounts for admin tasks

2. Privileged Password Vaulting
- Store privileged passwords in secure vault
- Automatic password rotation
- Check-out/check-in process
- Session recording and monitoring

3. Eliminate Shared Accounts
- Individual accounts for all users
- Shared account usage tracked and logged
- Regular rotation of shared credentials

4. Session Monitoring
- Record privileged sessions
- Real-time monitoring
- Automated alerts for suspicious activity
- Forensic analysis capability

## Password Security Monitoring

### What to Monitor

1. Breach Detection
- Check passwords against breach databases
- HaveIBeenPwned Enterprise API
- Alert users with compromised credentials
- Force password changes

2. Weak Password Detection
- Scan for common passwords
- Check password strength
- Identify reused passwords
- Flag policy violations

3. Authentication Anomalies
- Impossible travel (login from two distant locations)
- Unusual access times
- Failed login patterns
- Privilege escalation

4. Compliance
- Password age
- MFA enrollment status
- Policy compliance
- Access certifications

## Employee Offboarding

Critical Security Process:

Immediate Actions (Day of Departure):
1. Disable all accounts
2. Revoke MFA devices
3. Terminate VPN/remote access
4. Collect hardware (laptops, phones, security keys)
5. Remove from groups and distribution lists

Within 24 Hours:
6. Change shared passwords they had access to
7. Rotate service account credentials
8. Review data access logs
9. Transfer data ownership
10. Update emergency contacts

## Key Takeaways

- Enterprise password security requires comprehensive policies and tools
- Modern standards emphasize length over complexity
- MFA is non-negotiable for critical systems
- Privileged access management prevents catastrophic breaches
- Password managers improve security and user experience
- Service accounts and API keys need special handling
- Monitoring and compliance are ongoing requirements
- Offboarding is a critical security process
- Incident response plans must include password compromise scenarios', 'https://www.youtube.com/watch?v=hhUb5iknVJs', 5, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.752', '2026-01-19 11:42:54.612', '04626f01-23f6-4bf7-965b-1a82fa96a064');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('b2122207-ae2b-4462-8142-9a6522193112', 'Verification Habits', '# Building Verification Habits

## Why Verification Matters

Verification is the single most effective defense against social engineering. Before acting on any sensitive request, verify it''s legitimate through an independent channel.

### The Cost of Not Verifying

One moment of trust without verification can lead to:
- Financial fraud (wire transfers, payment scams)
- Data breaches (credentials stolen, malware installed)
- Insider threats (unauthorized access granted)
- Reputational damage
- Regulatory penalties
- Legal liability

### The Power of Verification

Simple verification prevents:
- CEO fraud (fake executive requests)
- Vendor invoice scams
- Phishing attacks
- Pretexting
- Physical access attacks
- Most social engineering

## What is Out-of-Band Verification?

Out-of-band verification means verifying through a different communication channel than the one used for the request.

### Why It''s Critical

If request comes via email:
- Don''t reply to that email
- Don''t click links in the email
- Don''t call numbers in the email

Instead:
- Call using known phone number
- Visit website directly (type URL)
- Use company directory
- Walk to person''s office
- Use internal messaging system

This prevents attacker from continuing deception through same compromised channel.

## Verification Techniques

### 1. Phone Verification

Best Practices:
- Use phone number from corporate directory
- Look up number independently (don''t use one provided)
- Call main number and ask to be transferred
- Save verified numbers in contacts
- Video call if possible for high-value requests

Example:
- Receive email from CFO requesting wire transfer
- Don''t reply to email
- Look up CFO''s number in directory
- Call and verify request verbally
- If can''t reach, escalate to supervisor

### 2. In-Person Verification

Most Secure:
- Walk to person''s office
- Face-to-face confirmation
- Verify identity visually
- Can''t be spoofed (yet - beware deepfakes)

When to Use:
- Very high-value requests
- Unusual or suspicious requests
- First-time sensitive actions
- When other channels unavailable

### 3. Multi-Channel Verification

Using Multiple Channels:
- Email request → Phone verification
- Phone call → Email confirmation
- Chat message → In-person verification
- Increases confidence in legitimacy

Example:
- Receive email about urgent wire transfer
- Call using known number to verify
- Request email confirmation from verified address
- Both channels confirm = higher confidence

### 4. Callback Verification

For Incoming Calls:
- Don''t trust caller ID (can be spoofed)
- Thank caller and hang up
- Look up official number independently
- Call back to verify
- Ask for reference number or ticket

Example:
- Receive call from "bank fraud department"
- Thank them for calling
- Hang up
- Google bank''s official number
- Call back and ask about the issue

## Building Verification Into Workflows

### For Sensitive Requests

Always Verify When:
- Wire transfers or payments
- Credential changes
- Access grants
- Confidential information requests
- Unusual requests from executives
- First-time actions
- Requests that bypass normal procedures

Verification Checklist:
1. Pause - Don''t act immediately
2. Identify - Who is requesting?
3. Verify - Use independent channel
4. Confirm - Get explicit confirmation
5. Document - Record verification
6. Proceed - Only after verification

### Financial Transactions

Multi-Step Verification:
1. Initial request received
2. Verify requestor via phone
3. Confirm recipient details
4. Second person approval
5. Final executive sign-off
6. Transaction processing

Prevents:
- Business Email Compromise (BEC)
- CEO fraud
- Vendor invoice scams
- Payment redirection

### Credential Requests

Never Provide Without Verification:
- Passwords
- Security questions
- Account numbers
- Personal information
- Multi-factor codes

Legitimate Organizations:
- Will never ask for passwords
- Use official portals for credentials
- Don''t request via email or phone
- Have documented processes

If Asked:
- Verify through official channels
- Report to security team
- Don''t provide any credentials
- Change passwords if suspicious

## Overcoming Barriers to Verification

### "But It''s Urgent!"

Response:
- Urgency is a red flag, not a reason to skip verification
- Real emergencies can wait 2 minutes for verification
- If it''s truly urgent, verification will confirm that
- Better 2-minute delay than costly mistake

Practice Saying:
- "Let me verify this quickly"
- "I need to confirm through official channels"
- "Our policy requires verification"
- "I''ll call you back in 2 minutes"

### "But It''s the CEO!"

Response:
- Executives are targets of impersonation
- Real executives appreciate security-conscious behavior
- One phone call confirms legitimacy
- Better to verify than to enable fraud

Practice Saying:
- "I''ll call to confirm before processing"
- "Standard procedure is verification"
- "Let me reach out to confirm this is you"

### "But It Seems Rude!"

Response:
- Professional verification isn''t rude
- Security is everyone''s responsibility
- Legitimate people understand
- Better polite verification than apologizing for compromise

Practice Saying:
- "Just following our security procedures"
- "I need to verify before processing"
- "Let me confirm this is legitimate"
- Frame it as policy, not personal distrust

### "But I''m Too Busy!"

Response:
- 2 minutes verification vs. hours recovering from breach
- Verification is part of the job
- Saves time in long run
- Prevents being even busier fixing problems

Time Investment:
- Verification: 2-5 minutes
- Recovery from successful attack: Days to weeks
- Cost comparison: Minimal vs. Catastrophic

## Organizational Support for Verification

### Policies That Help

Clear Requirements:
- Mandatory verification for sensitive actions
- Documented procedures
- Multiple-person approval
- Time buffers for verification
- No "emergency bypass" without specific authorization

Empowerment:
- Employees can''t be punished for verifying
- Praised for following procedures
- Time for verification is built into processes
- Clear escalation paths

### Technical Controls

Supporting Verification:
- Directory of verified contact information
- Secure internal communication channels
- Transaction holds for new recipients
- Out-of-band authorization systems
- Audit trails

### Cultural Support

Leadership Must:
- Model verification behavior
- Praise employees who verify
- Never pressure to skip verification
- Accept delays for security
- Respond positively to verification requests

## Creating Verification Habits

### Start Small

Begin With:
- Verify one type of request consistently
- Financial transactions
- Password changes
- Access grants
- Build habit gradually

### Practice Scenarios

Regular Training:
- Simulated requests requiring verification
- Practice verification conversations
- Role-play challenging situations
- Learn verification phrases

### Make It Routine

Habit Building:
- Same verification method each time
- Checklist approach
- Visual reminders
- Team accountability
- Celebrate successes

## Verification Success Stories

Example 1: Prevented Wire Fraud
- Finance employee receives urgent email from CEO
- Requests $50,000 wire transfer
- Employee follows procedure: calls CEO
- CEO knows nothing about it
- Phishing attempt prevented
- Employee praised for following policy
- Company saved $50,000

Example 2: Caught Impersonation
- IT receives urgent request for remote access
- Caller claims to be executive traveling
- Help desk follows verification procedure
- Calls executive''s known number
- Executive not traveling, knows nothing about it
- Attempted breach prevented
- Procedure works as designed

## Key Takeaways

- Verification is the single most effective defense against social engineering
- Always verify through independent channel (out-of-band)
- Urgency is a red flag, not a reason to skip verification
- It''s professional, not rude, to verify requests
- Organizations must support verification with policy and culture
- Practice verification until it becomes automatic habit
- Never provide credentials without verification
- When in doubt, verify
- Two minutes verification prevents days of recovery
- Real executives and colleagues will appreciate your diligence', 'https://www.youtube.com/watch?v=lc7scxvKQOo', 4, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.764', '2026-01-19 11:42:54.622', '96406223-7051-43d7-901a-55878daeba07');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('7f343ee1-3360-42f2-ad9c-aba93ee2db1d', 'HTTPS and Certificates', '# Understanding HTTPS and Certificates

## What is HTTPS?

HTTPS (Hypertext Transfer Protocol Secure) is the encrypted version of HTTP. It protects the data transmitted between your browser and a website.

### HTTP vs HTTPS

HTTP (Not Secure):
- Data transmitted in plain text
- Anyone on the network can intercept and read
- Passwords, credit cards, personal info exposed
- No verification of website identity
- Modern browsers flag as "Not Secure"

HTTPS (Secure):
- Data encrypted using TLS/SSL
- Intercepted data appears as gibberish
- Protects against eavesdropping
- Verifies website identity
- Shows padlock icon in browser

## Why HTTPS Matters

### Protection Against Threats

Man-in-the-Middle Attacks:
- Attacker intercepts communication
- Without HTTPS: Can read and modify data
- With HTTPS: Only sees encrypted data

Session Hijacking:
- Attacker steals session cookies
- Without HTTPS: Cookies transmitted in clear text
- With HTTPS: Cookies encrypted in transit

Data Theft:
- Credentials and sensitive data exposed
- Public WiFi especially vulnerable
- HTTPS encrypts all communication

### Trust and Verification

HTTPS Provides:
- Encryption: Data privacy during transmission
- Authentication: Confirms website identity
- Integrity: Ensures data isn''t tampered with

## SSL/TLS Certificates

### What Are Certificates?

Digital certificates issued by trusted Certificate Authorities (CAs) that verify website ownership and enable HTTPS.

Certificate Contains:
- Domain name
- Organization details
- Certificate Authority
- Expiration date
- Public key for encryption

### Types of Certificates

Domain Validation (DV):
- Verifies domain ownership only
- Quickest and cheapest
- Shows padlock, no organization name
- Good for blogs, personal sites

Organization Validation (OV):
- Verifies organization identity
- Shows organization name in certificate
- More trust than DV
- Good for business sites

Extended Validation (EV):
- Strictest verification process
- Previously showed green bar with company name
- Now shows company name in certificate details
- Highest trust level
- Used by banks, e-commerce

Wildcard Certificates:
- Covers main domain and all subdomains
- Example: *.example.com covers blog.example.com, shop.example.com
- Convenient for multiple subdomains

## Checking HTTPS and Certificates

### Browser Indicators

Padlock Icon:
- Closed padlock: Connection is secure
- Padlock with warning: Mixed content (some insecure elements)
- No padlock or "Not Secure": No HTTPS

Green Indicators (older browsers):
- Green padlock
- Green address bar (EV certificates)
- Company name displayed

Red Warnings:
- Invalid certificate
- Expired certificate
- Self-signed certificate
- Certificate name mismatch

### Viewing Certificate Details

Chrome/Edge:
1. Click padlock icon
2. Click "Connection is secure"
3. Click "Certificate is valid"
4. View certificate details

Firefox:
1. Click padlock icon
2. Click "Connection secure"
3. Click "More information"
4. Click "View Certificate"

What to Check:
- Issued to: Matches the domain you''re visiting
- Issued by: Recognized Certificate Authority
- Valid from/to: Certificate not expired
- Fingerprint: Unique identifier

## Certificate Warnings

### Common Certificate Errors

Certificate Expired:
- Certificate validity period ended
- Needs renewal
- Could indicate abandoned site
- Don''t proceed unless you trust the site

Name Mismatch:
- Certificate issued for different domain
- Visiting example.com but cert is for different-site.com
- Could indicate phishing attempt
- Do not proceed

Self-Signed Certificate:
- Not issued by trusted CA
- Common for internal corporate sites
- Can''t verify identity
- Only proceed if you absolutely trust the organization

Revoked Certificate:
- Certificate was canceled by CA
- Could indicate compromise
- Do not proceed

### When to Ignore Warnings

Generally Never:
- On public internet sites
- E-commerce or banking
- Sites requesting personal information
- Unknown or suspicious sites

Possibly Acceptable:
- Corporate intranet with known self-signed certs
- Local development environment
- After verifying with IT department
- When you set it up yourself

## Certificate Authorities

### Trusted CAs

Major Certificate Authorities:
- Let''s Encrypt (free, automated)
- DigiCert
- GlobalSign
- Sectigo (formerly Comodo)
- GoDaddy

Browser Trust:
- Browsers maintain list of trusted CAs
- Certificates from trusted CAs automatically accepted
- Unknown CAs trigger warnings

### Let''s Encrypt Revolution

Free Certificates:
- Automated issuance and renewal
- Domain validated
- 90-day validity
- Renewable indefinitely
- Made HTTPS accessible to everyone

Impact:
- Majority of web now uses HTTPS
- Free removes cost barrier
- Automated reduces complexity

## HTTPS Best Practices

### For Users

Always Use HTTPS:
- Check for padlock before entering sensitive data
- Never enter passwords on HTTP sites
- Look for HTTPS on login pages
- Bookmark HTTPS versions of sites

Be Cautious Of:
- Certificate warnings
- Mixed content warnings
- Sites that don''t offer HTTPS
- HTTP sites requesting sensitive info

Use HTTPS Everywhere:
- Browser extension
- Forces HTTPS when available
- Protects against downgrade attacks
- Available for Chrome, Firefox, Edge

### Red Flags

Warning Signs:
- Login page without HTTPS
- Certificate errors on banking sites
- HTTP in checkout process
- Recently created certificates on unfamiliar sites
- Certificate issued to different domain

## HTTPS Limitations

### What HTTPS Doesn''t Do

Does NOT Protect Against:
- Malware on the site
- Phishing (fake sites can have HTTPS)
- Poor website security practices
- Server-side breaches
- Social engineering

Does NOT Mean:
- Website is trustworthy
- Website is safe
- Website is legitimate
- Content is accurate

Phishers Use HTTPS Too:
- Free certificates from Let''s Encrypt
- HTTPS only means encrypted connection
- Fake PayPal site can have valid HTTPS
- Must still verify domain name

### Mixed Content

Problem:
- HTTPS page loading HTTP resources
- Images, scripts, stylesheets over HTTP
- Weakens security

Browser Behavior:
- May block mixed content
- Shows warning icon
- Degrades security indicator

## Certificate Pinning

Advanced Security:
- App or browser expects specific certificate
- Rejects valid but unexpected certificates
- Prevents some man-in-the-middle attacks
- Used by banking apps and browsers

How It Works:
- App stores expected certificate or public key
- Verifies match on connection
- Refuses connection if mismatch
- Adds extra layer beyond CA validation

## Future of HTTPS

### Industry Trends

HTTPS by Default:
- Modern browsers require HTTPS for new features
- HTTP being phased out
- Search engines rank HTTPS higher
- "Not Secure" warnings for HTTP

TLS 1.3:
- Latest version
- Faster handshake
- More secure
- Removes outdated algorithms

## Key Takeaways

- HTTPS encrypts data between browser and website
- Padlock icon indicates HTTPS connection
- Certificate verifies website identity
- Always check for HTTPS before entering sensitive data
- HTTPS doesn''t guarantee site is safe or legitimate
- Verify domain name even with valid HTTPS
- Never ignore certificate warnings on sensitive sites
- Phishing sites can have valid HTTPS certificates
- Use HTTPS Everywhere browser extension
- Certificate details viewable by clicking padlock', 'https://www.youtube.com/watch?v=hExRDVZHhig', 1, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.776', '2026-01-19 11:42:54.624', '04aea607-352a-4cf7-b377-f3b3d97ce585');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('27b07d70-58b9-41f7-9ba2-5153139dab0b', 'Browser Extensions', '# Browser Extensions: Risks and Benefits

## What Are Browser Extensions?

Browser extensions (also called add-ons or plugins) are small software programs that customize and enhance browser functionality.

### Common Types

Productivity Extensions:
- Ad blockers (uBlock Origin, AdBlock Plus)
- Password managers (LastPass, 1Password)
- Tab managers
- Screenshot tools
- Note-taking apps

Privacy Extensions:
- Privacy Badger
- HTTPS Everywhere
- DuckDuckGo Privacy Essentials
- Cookie managers

Security Extensions:
- Web of Trust (WOT)
- Malware scanners
- Phishing protection

Shopping Extensions:
- Price comparison
- Coupon finders
- Cashback tools

## Benefits of Extensions

### Legitimate Uses

Enhanced Security:
- Ad blockers prevent malvertising
- Password managers improve security
- HTTPS enforcement
- Anti-tracking protection

Improved Productivity:
- Automate repetitive tasks
- Better tab management
- Quick access to tools
- Custom workflows

Better Privacy:
- Block trackers
- Delete cookies
- Mask browsing activity
- Control data sharing

## Risks of Browser Extensions

### Security Threats

Malicious Extensions:
- Steal passwords and personal data
- Inject malware
- Redirect to phishing sites
- Cryptocurrency mining
- Click fraud

Privacy Violations:
- Track browsing history
- Collect personal information
- Sell data to third parties
- Monitor keystrokes
- Access sensitive site data

Account Takeover:
- Read and modify data on websites
- Submit forms on your behalf
- Access online banking
- Make unauthorized purchases

### How Extensions Can Harm You

Data Collection:
- Browsing history
- Search queries
- Form inputs
- Passwords (if granted permission)
- Credit card numbers
- Personal messages

Permissions Abuse:
- Read and change all data on visited websites
- Access tabs and browsing activity
- Manage downloads
- Modify cookies
- Capture screenshots

Example Attack Scenarios:

Fake Ad Blocker:
- Promises to block ads
- Actually injects ads
- Redirects affiliate links
- Tracks all browsing
- Sells data to advertisers

Compromised Extension:
- Legitimate extension sold to malicious actor
- Update adds malicious code
- Existing users compromised
- Trust exploited

## Understanding Extension Permissions

### Critical Permissions

High Risk:
- "Read and change all your data on the websites you visit"
- "Read and change all your data on all websites"
- "Access your data for all websites"

What This Means:
- Can see everything you do on web
- Can modify pages before you see them
- Can inject scripts
- Can steal credentials
- Full access to web activity

Medium Risk:
- "Read and change your bookmarks"
- "Access your tabs and browsing activity"
- "Manage your downloads"
- "Access your data for specific sites"

Lower Risk:
- "Display notifications"
- "Change your browser settings"
- "Open links in new tabs"

### Evaluating Permissions

Questions to Ask:
- Does extension need this permission for its function?
- Is ad blocker asking to manage downloads? (Red flag)
- Why does calculator need access to all websites? (Red flag)
- Does the permission match the purpose?

Red Flags:
- Excessive permissions for simple tasks
- All-site access for single-site tools
- Broad permissions with vague descriptions
- Permissions that don''t match stated purpose

## Choosing Safe Extensions

### Vetting Process

Before Installing:

Check Source:
- Install from official browser stores only
- Chrome Web Store for Chrome/Edge
- Firefox Add-ons for Firefox
- Never download from random websites

Verify Developer:
- Known, reputable developer
- Company website exists
- Contact information available
- History of other extensions

Read Reviews:
- Many reviews (thousands+)
- Recent reviews
- Check negative reviews carefully
- Watch for fake reviews (all 5-star with generic text)

Check Permissions:
- Minimal permissions needed
- Match extension purpose
- Nothing excessive or unusual
- Clearly explained

Research History:
- Google extension name + "malware" or "privacy"
- Check security blogs
- Look for news articles
- Search for controversies

### Warning Signs

Avoid If:
- Few downloads/users (< 1000)
- No reviews or only generic 5-star reviews
- Vague description
- Requests excessive permissions
- Poor grammar in description
- No developer information
- Clones of popular extensions
- Promises too good to be true
- Free version of paid extension

## Safe Extension Practices

### Installation

Best Practices:
- Only install when needed
- Read all permissions carefully
- Question each permission
- Start with well-known extensions
- Prefer open-source when possible
- Verify developer identity

During Installation:
- Read permission dialog completely
- Understand what you''re granting
- Cancel if anything seems off
- Don''t rush through prompts

### Ongoing Management

Regular Maintenance:
- Review installed extensions monthly
- Remove unused extensions
- Update regularly (but read update notes)
- Check for permission changes
- Monitor for suspicious behavior

Permission Reviews:
- Extensions can request new permissions in updates
- Browser notifies of permission changes
- Review why new permissions needed
- Remove extension if suspicious

Signs of Compromise:
- Unexpected popups or ads
- New toolbars appeared
- Browser settings changed
- Homepage or search engine changed
- Redirects to unfamiliar sites
- Slow browser performance
- Unexpected CPU usage

## Specific Extension Recommendations

### Generally Safe Categories

Password Managers:
- 1Password
- Bitwarden
- LastPass (official)
- KeePass extensions

Privacy/Security:
- uBlock Origin (not just "uBlock")
- Privacy Badger (EFF)
- HTTPS Everywhere (EFF)
- DuckDuckGo Privacy Essentials

Productivity:
- Grammarly
- LastPass
- OneTab
- Pocket

### Extensions to Avoid

Categories to Question:
- Free VPNs (often malicious)
- Coupon finders (data collection)
- Download managers (unnecessary)
- Weather extensions (excessive permissions)
- Games (unnecessary access)

Specific Warnings:
- Avoid extensions with names similar to popular ones
- Beware "lite" or "free" versions of paid tools
- Question why simple tool needs broad permissions

## Browser-Specific Considerations

### Chrome/Edge

Chrome Web Store:
- Google reviews extensions
- Not perfect - malicious ones slip through
- More extensions = more risk
- Can sync across devices (including malicious ones)

Manifest V3:
- New extension format
- More restrictions on extensions
- Better privacy and security
- Ad blockers affected but adapting

### Firefox

Firefox Add-ons:
- More stringent review process
- Open source friendly
- Better privacy defaults
- Recommended Extensions badge (vetted by Mozilla)

### Safari

Safari Extensions:
- Smaller selection
- App Store review process
- More restrictions
- Generally safer but fewer options

## Mobile Browser Extensions

### Limited but Safer

Mobile Limitations:
- Fewer extensions available
- More restrictions
- Less risk but less functionality
- Different security model

Firefox Mobile:
- Supports extensions
- Limited selection
- Similar risks to desktop

Chrome Mobile:
- No extension support (Android)
- More secure but less customizable

Safari Mobile:
- Content blockers only
- More restricted
- Safer model

## Removing Malicious Extensions

### If You Suspect Compromise

Immediate Actions:

1. Remove Suspicious Extension:
   - Chrome: three dots > More tools > Extensions
   - Firefox: three lines > Add-ons > Extensions
   - Remove/Uninstall the extension

2. Check for Other Compromises:
   - Review all installed extensions
   - Remove anything unfamiliar
   - Check for permission changes

3. Reset Browser Settings:
   - Homepage
   - Search engine
   - New tab page
   - Check for unexpected changes

4. Change Passwords:
   - Change passwords for sensitive accounts
   - Assume extension saw everything
   - Enable MFA if not already

5. Run Security Scans:
   - Full antivirus scan
   - Malware removal tool
   - Check for other infections

6. Monitor Accounts:
   - Watch for suspicious activity
   - Check login history
   - Review account changes

## Key Takeaways

- Browser extensions can significantly enhance functionality
- Extensions have broad permissions and access to data
- Install only from official browser stores
- Verify developer identity and reputation
- Read and understand all permissions
- Question why extensions need specific permissions
- Regularly review and remove unused extensions
- Be especially careful with free VPNs and download managers
- Update extensions but watch for permission changes
- Remove immediately if suspicious behavior occurs
- Minimal extensions = better security', NULL, 2, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.777', '2026-01-19 11:42:54.626', '0b906317-2666-4041-83fd-dea327795ee1');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('0d49e3fa-194d-4770-9b0b-3d2a8913c119', 'Browser Settings', '# Configuring Browser Security Settings

## Why Browser Settings Matter

Your browser is the gateway to the internet. Proper security settings protect against malware, tracking, phishing, and data theft.

### Default Settings Problem

Out-of-the-Box Issues:
- Prioritize convenience over security
- Allow tracking
- Save passwords insecurely
- Permit potentially harmful content
- Share data with browser vendor

## Essential Security Settings

### Privacy Settings

Block Third-Party Cookies:
- Prevents cross-site tracking
- Breaks some websites (rare)
- Significantly improves privacy

Chrome/Edge:
- Settings > Privacy and security > Cookies
- Select "Block third-party cookies"

Firefox:
- Settings > Privacy & Security
- Enhanced Tracking Protection: Strict

Clear Cookies on Exit:
- Deletes tracking data when browser closes
- Requires re-login to sites
- Maximum privacy

### Search Engine

Privacy-Focused Options:
- DuckDuckGo (no tracking)
- Startpage (Google results, no tracking)
- Brave Search

Avoid:
- Google Search (extensive tracking)
- Bing (Microsoft tracking)
- Unless privacy isn''t concern

### HTTPS and Security

HTTPS-Only Mode:
- Forces encrypted connections
- Warns on HTTP sites
- Prevents downgrade attacks

Firefox:
- Settings > Privacy & Security
- HTTPS-Only Mode: Enable in all windows

Chrome/Edge:
- Enabled by default for most sites
- Built into browser

Safe Browsing:
- Checks sites against malware/phishing database
- Warns before visiting dangerous sites
- Small privacy tradeoff worth the security

Chrome/Edge:
- Settings > Privacy and security > Security
- Enhanced protection (recommended)

Firefox:
- Settings > Privacy & Security
- Block dangerous and deceptive content: Check all boxes

### Password Management

Built-In Password Managers:
- Convenient but less secure than dedicated tools
- Encrypted on device
- Synced via browser account

Best Practice:
- Use dedicated password manager (1Password, Bitwarden)
- Disable browser password saving
- More secure encryption
- Better features

Disable Browser Password Saving:
- Chrome/Edge: Settings > Passwords > Offer to save passwords: OFF
- Firefox: Settings > Privacy & Security > Logins and Passwords > Ask to save logins: OFF

### Autofill Settings

Payment Methods:
- Saving credit cards in browser is convenient
- Encrypted but less secure than dedicated tools
- Anyone with device access can use

Recommendation:
- Don''t save payment methods in browser
- Use password manager or enter manually
- Enable device lock (PIN, fingerprint, face)

Addresses:
- Generally safe to save
- Convenience vs privacy tradeoff
- Consider for non-sensitive uses

### Download Settings

Ask Where to Save Files:
- Prevents automatic downloads to hidden folders
- Lets you verify each download
- Organize files better

Scan Downloads:
- Built-in malware scanning
- Windows Defender integration (Edge)
- Safe Browsing checks (Chrome, Firefox)

Settings:
- Chrome: Settings > Downloads > Ask where to save each file: ON
- Firefox: Settings > General > Downloads > Always ask where to save files

Dangerous File Types:
- Browsers block some file types (.exe on some)
- Don''t override these blocks without verification
- Check file before opening

## Advanced Security Settings

### Site Settings

Location:
- Don''t allow by default
- Grant per-site as needed
- Review granted permissions

Camera and Microphone:
- Block by default
- Grant only for video calls
- Revoke after use

Notifications:
- Block by default
- Too many sites request notifications
- Annoying and privacy concern

Popups:
- Block by default
- Allow for specific trusted sites
- Most popups are ads or malicious

JavaScript:
- Required for most websites
- Blocking breaks functionality
- Only block on high-security browser profile

### Sync Settings

Browser Sync:
- Syncs bookmarks, passwords, history
- Encrypted with account password
- Convenient but risky if account compromised

What to Sync:
- Bookmarks: Safe
- Extensions: Careful (malicious extensions sync too)
- Passwords: Use password manager instead
- History: Privacy concern
- Open tabs: Convenience vs privacy

Recommendations:
- Use strong password for browser account
- Enable MFA on browser account
- Limit what you sync
- Consider not syncing on work devices

### DNS Settings

DNS over HTTPS (DoH):
- Encrypts DNS queries
- ISP can''t see what sites you visit
- Privacy improvement

Enable DoH:
- Chrome: Settings > Privacy and security > Security > Use secure DNS
- Firefox: Settings > General > Network Settings > Enable DNS over HTTPS

Providers:
- Cloudflare (1.1.1.1): Privacy-focused
- Google (8.8.8.8): Fast but Google tracks
- Quad9: Security and privacy

## Browser-Specific Settings

### Chrome/Edge

Privacy Sandbox:
- Google''s cookie alternative
- Topics API for ad targeting
- FLoC replacement
- Privacy improvement over cookies
- Still tracks (less granularly)

Settings:
- Settings > Privacy and security > Privacy Sandbox
- Consider disabling for maximum privacy

Send "Do Not Track":
- Requests sites don''t track
- Widely ignored
- Enable anyway (Settings > Privacy and security)

### Firefox

Enhanced Tracking Protection:
- Standard, Strict, or Custom
- Strict recommended for security
- May break some sites

Content Blocking:
- Trackers
- Cookies
- Cryptominers
- Fingerprinters
- Social media trackers

Settings > Privacy & Security > Enhanced Tracking Protection: Strict

Firefox Suggest:
- Search suggestions from Firefox
- Privacy-respecting
- Can disable for offline searches only

### Safari

Intelligent Tracking Prevention:
- Blocks cross-site tracking
- Deletes cookies from trackers
- On by default (keep it)

Privacy Report:
- Shows blocked trackers
- Per-site breakdown
- Privacy insights

Settings: Safari > Privacy > Prevent cross-site tracking: ON

### Brave

Built-In Privacy:
- Blocks ads and trackers by default
- Fingerprinting protection
- HTTPS Everywhere built-in
- No configuration needed

Shields:
- Per-site privacy controls
- Adjust blocking levels
- View blocked items

Additional Settings:
- Settings > Shields > Aggressive blocking
- Settings > Privacy > Private windows with Tor

## Extension Security Settings

Review Extensions:
- Settings > Extensions
- Remove unused
- Check permissions
- Update regularly

Extension Recommendations:
- Only from official stores
- Well-known developers
- Many positive reviews
- Minimal necessary permissions

## Profile and User Management

Multiple Profiles:
- Separate work and personal
- Different security levels
- Isolated cookies and data

Use Cases:
- Work profile: More strict security
- Personal profile: Balance security and convenience
- Banking profile: Maximum security
- Guest profile: No saved data

Creating Profiles:
- Chrome/Edge: Profile icon > Add profile
- Firefox: about:profiles

## Privacy vs Convenience

### Finding Balance

Maximum Privacy:
- Strict tracking protection
- Block all cookies
- No sync
- Private browsing only
- Breaks many websites

Maximum Convenience:
- Allow all cookies
- Save all passwords
- Sync everything
- No protection
- Significant privacy loss

Recommended Balance:
- Block third-party cookies
- Use password manager
- Sync bookmarks only
- Safe Browsing enabled
- Privacy extensions installed
- Per-site permissions

### Site Allowlisting

Trusted Sites:
- Add to allowlist
- Enable cookies
- Allow notifications
- More permissions

Untrusted Sites:
- Strict blocking
- No permissions
- Private browsing

## Regular Maintenance

### Monthly Tasks

Clear Data:
- Browsing history
- Download history
- Cached files
- Cookies (except trusted sites)

Review:
- Saved passwords
- Site permissions
- Installed extensions
- Sync settings

### Security Checkups

Browser Updates:
- Check for updates weekly
- Auto-update enabled
- Restart to apply updates
- Critical for security

Permission Audit:
- Review site permissions
- Remove unnecessary grants
- Check location, camera, notifications

Extension Audit:
- Remove unused extensions
- Check for permission changes
- Verify still from legitimate developer

## Testing Your Settings

### Privacy Tests

Browser Fingerprinting:
- Visit: coveryourtracks.eff.org
- Check how unique you are
- Test fingerprinting protection

Cookie Test:
- Visit sites with trackers
- Use Privacy Badger to see what''s blocked
- Verify third-party cookies blocked

DNS Leak Test:
- Visit: dnsleaktest.com
- Verify DNS over HTTPS working
- Check for leaks if using VPN

## Key Takeaways

- Default browser settings prioritize convenience over security
- Block third-party cookies for significant privacy improvement
- Enable HTTPS-Only mode to force encrypted connections
- Use dedicated password manager instead of browser
- Enable Safe Browsing for malware and phishing protection
- Configure per-site permissions conservatively
- Regular review and cleanup of extensions
- Balance privacy and convenience based on needs
- Use multiple profiles for different security requirements
- Keep browser updated for security patches
- Test your privacy settings with online tools', NULL, 4, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.78', '2026-01-19 11:42:54.631', '210e5ba8-c870-47ae-986f-c43c06367e9b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('9330d54d-5dd5-4239-80ea-abf686da1647', 'VPNs and Private Browsing', '# Using VPNs and Private Browsing

## Understanding Private Browsing

Private browsing (Incognito, Private Window) is a browser mode that limits local data storage.

### What Private Browsing Does

Prevents Local Storage:
- No browsing history saved
- Cookies deleted after session
- Search history not saved
- Form data not remembered
- Temporary downloads not tracked

Use Cases:
- Searching for sensitive topics
- Using shared computer
- Accessing account on someone else''s device
- Testing website without cookies
- Shopping for surprise gifts

### What Private Browsing Doesn''t Do

Does NOT Hide From:
- Websites you visit (they still see your IP)
- Internet Service Provider (ISP)
- Network administrator (at work/school)
- Government surveillance
- Your employer

Does NOT Prevent:
- Tracking by websites
- Targeted advertising
- IP address logging
- Fingerprinting
- Malware or phishing

### Common Misconceptions

Myth: Private browsing makes you anonymous
Reality: Only prevents local data storage

Myth: Websites can''t track you
Reality: They still can via IP, fingerprinting, accounts

Myth: Safe from malware
Reality: No additional malware protection

Myth: ISP can''t see activity
Reality: ISP sees everything

## Virtual Private Networks (VPNs)

### What is a VPN?

A VPN creates an encrypted tunnel between your device and a VPN server, hiding your activity from your ISP and local network.

How It Works:
1. Connect to VPN server
2. All internet traffic encrypted
3. Traffic exits VPN server
4. Websites see VPN server''s IP, not yours

### What VPNs DO

Hide From ISP:
- ISP can''t see which sites you visit
- Can only see you''re connected to VPN
- Encrypted traffic unreadable
- Protects on public WiFi

Hide Your IP From Websites:
- Websites see VPN server IP
- Can''t determine real location
- Harder to track across sessions
- Bypass geographic restrictions

Protect on Public WiFi:
- Encrypt all traffic
- Prevent man-in-the-middle attacks
- Safe on coffee shop, airport, hotel WiFi
- Protection from malicious hotspots

### What VPNs DON''T Do

Does NOT Provide Anonymity:
- VPN provider knows your IP and activity
- If logged in to accounts, you''re still identifiable
- Browser fingerprinting still works
- Cookies still track you

Does NOT Protect From:
- Malware or phishing
- Scams or fraud
- Social engineering
- Account compromises
- Bad security practices

Does NOT Guarantee Privacy:
- VPN provider can see traffic (if not HTTPS)
- Logs may be kept (despite claims)
- Could be compelled to hand over data
- Some VPNs are malicious

## Choosing a VPN

### Trustworthy VPN Services

Reputable Providers:
- Mullvad: Strong privacy, anonymous payment
- ProtonVPN: Swiss privacy, transparency
- IVPN: No-logs audited
- NordVPN: Large network, audited
- ExpressVPN: Fast, no logs

Avoid:
- Free VPNs (often malicious or sell data)
- VPNs from unknown companies
- VPNs with no privacy policy
- VPNs requiring excessive permissions
- Fly-by-night operations

### Evaluating VPN Providers

Key Factors:

No-Logs Policy:
- Claims not to log activity
- Independently audited
- Proven in court (Mullvad, ExpressVPN)
- Jurisdiction matters (avoid 5/9/14 Eyes)

Jurisdiction:
- Country determines legal requirements
- Switzerland, Iceland: Strong privacy
- US, UK, Australia: Data sharing agreements
- China, Russia: Government control

Payment Options:
- Anonymous payment (cash, crypto)
- No personal info required
- Prevents linking VPN to identity

Encryption:
- WireGuard or OpenVPN protocols
- Strong encryption (AES-256)
- No leaks (DNS, IPv6, WebRTC)

### Red Flags

Avoid VPNs That:
- Are completely free (how do they pay for servers?)
- Have unclear ownership
- Make exaggerated claims (military-grade, 100% anonymous)
- Are from unknown countries
- Have no audits or transparency reports
- Require excessive device permissions
- Have poor reviews or controversies

## Using VPNs Effectively

### When to Use VPN

High Priority:
- Public WiFi (coffee shops, airports, hotels)
- Traveling abroad
- Accessing geo-restricted content
- Protecting sensitive research
- Whistleblowing or journalism

Optional:
- Home internet (depends on threat model)
- General browsing for privacy
- Avoiding ISP tracking
- Bypassing network restrictions

### VPN Limitations

Still Trackable If:
- Logged into accounts (Google, Facebook, etc.)
- Using same browser fingerprint
- Cookies identify you
- Website uses other tracking methods

Performance Impact:
- Slower speeds (encryption overhead)
- Increased latency
- Some services block VPN IPs
- May not work with streaming services

## Combining VPN and Private Browsing

### Maximum Privacy Setup

Layer 1: VPN
- Hides traffic from ISP
- Hides real IP from websites
- Encrypts connection

Layer 2: Private Browsing
- No local history
- No persistent cookies
- Clean slate each session

Layer 3: Privacy Extensions
- Block trackers (uBlock Origin)
- Delete cookies (Cookie AutoDelete)
- HTTPS enforcement

Layer 4: Privacy Browser
- Firefox or Brave
- Strict tracking protection
- Fingerprinting resistance

### Use Case Examples

Sensitive Research:
- Enable VPN
- Use private browsing
- Don''t log into accounts
- Use privacy-focused search (DuckDuckGo)

Public WiFi:
- Always use VPN
- Private browsing optional
- Avoid sensitive transactions
- Check for HTTPS

## VPN on Mobile Devices

### Mobile VPN Apps

Official Apps:
- Download from provider website
- Verify on App Store/Play Store
- Check developer identity
- Read permissions carefully

Always-On VPN:
- Android: Settings > VPN > Always-on VPN
- iOS: On-Demand VPN in Settings
- Reconnects automatically
- Prevents leaks

Battery Impact:
- VPNs use more battery
- Encrypted traffic processing
- Constant connection
- Trade-off for security

## Advanced: Tor Browser

### Maximum Anonymity

What is Tor:
- Routes through multiple volunteer nodes
- Layers of encryption
- Very difficult to trace
- Slow but extremely private

When to Use:
- Maximum anonymity needed
- Whistleblowing
- Sensitive journalism
- Avoiding censorship
- Accessing .onion sites

Limitations:
- Very slow
- Some sites block Tor
- Can draw attention
- Not needed for most users

Tor vs VPN:
- Tor: Maximum anonymity, very slow
- VPN: Good privacy, faster
- Can combine both for maximum protection

## Common Mistakes

### VPN Misuse

False Sense of Security:
- Thinking VPN makes you invincible
- Ignoring other security practices
- Logging into accounts defeats anonymity
- Not using HTTPS still risky

Free VPN Danger:
- Often malicious
- Inject ads
- Sell browsing data
- Log everything
- Worse than no VPN

### Private Browsing Misunderstanding

Relying on Private Mode:
- Thinking it provides full privacy
- Not realizing ISP can still see
- Believing websites can''t track
- Assuming it prevents malware

## Best Practices

### Daily Use

General Browsing:
- Use privacy-focused browser
- Enable tracking protection
- Consider VPN at home
- Private browsing for sensitive searches

Public WiFi:
- Always use VPN
- Avoid sensitive transactions
- Private browsing recommended
- Verify HTTPS

Sensitive Activities:
- VPN + Private Browsing
- Privacy-focused browser
- No account logins
- Dedicated device if possible

### VPN Checklist

Before Connecting:
- Verify you''re connecting to correct VPN
- Check encryption settings
- Enable kill switch (blocks internet if VPN drops)
- Verify no DNS leaks

While Connected:
- Check IP address (whatismyip.com)
- Verify VPN location
- Monitor for disconnections
- Don''t login to accounts if anonymity needed

### Testing Your Setup

Privacy Checks:
- IP leak test: ipleak.net
- DNS leak test: dnsleaktest.com
- WebRTC leak: browserleaks.com
- Fingerprint test: coveryourtracks.eff.org

## Key Takeaways

- Private browsing only prevents local data storage
- Private browsing doesn''t hide from ISP or websites
- VPNs hide traffic from ISP and mask IP address
- VPNs don''t provide complete anonymity
- Avoid free VPNs - they often sell your data
- Use reputable VPN providers with no-logs policies
- VPN + private browsing + privacy tools = best protection
- Always use VPN on public WiFi
- Test for leaks after connecting to VPN
- Combine privacy tools for layered protection
- Understand limitations - no tool provides perfect privacy
- Most people don''t need Tor, but it''s available for extreme cases', 'https://www.youtube.com/watch?v=WVDQEoe6ZWY', 5, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.781', '2026-01-19 11:42:54.633', '210e5ba8-c870-47ae-986f-c43c06367e9b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', 'Setting Up MFA', '# Setting Up Multi-Factor Authentication (MFA)

## What is Multi-Factor Authentication?

Multi-Factor Authentication (MFA), also called Two-Factor Authentication (2FA), requires two or more methods to verify your identity:

1. Something you know: Password, PIN
2. Something you have: Phone, security key, smart card
3. Something you are: Fingerprint, face, voice

Why MFA is Critical:
- Even if password is stolen, attackers can''t access account
- Prevents 99.9% of account compromise attacks (Microsoft study)
- Protects against phishing, breaches, and password reuse
- Required by many compliance standards

## Types of MFA

### 1. SMS Text Messages (Least Secure)

How It Works:
- Enter password
- Receive 6-digit code via text
- Enter code to complete login

Pros:
- Easy to set up
- Works on any phone
- Better than no MFA

Cons:
- Vulnerable to SIM swapping attacks
- SMS can be intercepted
- Requires cell signal
- Not recommended for high-security accounts

### 2. Authenticator Apps (Recommended)

How It Works:
- App generates 6-digit codes that change every 30 seconds
- Based on shared secret and current time (TOTP)
- Works offline, no internet required

Popular Authenticator Apps:
- Google Authenticator (iOS, Android)
- Microsoft Authenticator (iOS, Android)
- Authy (iOS, Android, Desktop)
- 1Password (if you use this password manager)
- Bitwarden Authenticator (if you use this password manager)

Pros:
- More secure than SMS
- Works offline
- Free and easy to use
- Not vulnerable to SIM swapping
- Supports multiple accounts

When to Use: Most accounts - best balance of security and convenience

### 3. Hardware Security Keys (Most Secure)

How It Works:
- Physical device (USB, NFC, or Bluetooth)
- Insert key or tap to authenticate
- Uses cryptographic proof, not codes

Popular Hardware Keys:
- YubiKey (USB-A, USB-C, NFC)
- Titan Security Key (Google)
- Thetis FIDO2

Pros:
- Highest security - virtually unphishable
- No codes to type
- Fast authentication
- Resists phishing (only works on correct domain)
- One key can serve multiple accounts

When to Use: High-value accounts (email, banking, crypto), corporate environments

## Step-by-Step: Setting Up MFA

### Setting Up Authenticator App

Example: Gmail with Google Authenticator

1. Open Account Security Settings
   - Go to myaccount.google.com
   - Click "Security"
   - Find "2-Step Verification"

2. Choose Authenticator App
   - Select "Authenticator app"
   - Choose your phone type (iPhone/Android)

3. Scan QR Code
   - Open Google Authenticator app
   - Tap "+" to add account
   - Scan QR code displayed on screen

4. Enter Verification Code
   - App displays 6-digit code
   - Enter code to verify setup
   - Code changes every 30 seconds

5. Save Backup Codes
   - Download backup codes
   - Store securely (password manager or safe place)
   - Use if you lose phone

6. Test It
   - Log out and log back in
   - Verify MFA works

## MFA Best Practices

### Setup Strategy

Priority Order:
1. Email account (most critical - controls password resets)
2. Password manager
3. Banking and financial
4. Work accounts
5. Social media
6. Cloud storage
7. Everything else

### Backup and Recovery

Always Have Backups:
- Save backup codes when setting up MFA
- Register multiple devices/keys
- Keep backup security key in safe place
- Print backup codes and store securely

## Key Takeaways

- MFA prevents 99.9% of account compromises
- Authenticator apps are the best balance of security and convenience
- Hardware security keys are most secure for high-value accounts
- SMS is better than nothing but vulnerable to SIM swapping
- Always save backup codes securely
- Set up MFA on email first - it controls everything else
- Register multiple MFA methods for redundancy
- Test your MFA and backup codes after setup
- Enable MFA everywhere it''s available', 'https://www.youtube.com/watch?v=0mvCeNsTa1g', 4, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.751', '2026-01-19 11:42:54.636', '04626f01-23f6-4bf7-965b-1a82fa96a064');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('56e2d70f-f97a-4fac-a8d0-f534b1f31707', 'Social Media Privacy', '# Social Media Privacy Settings

## The Social Media Privacy Problem

Social media platforms collect vast amounts of personal data:
- Everything you post (text, photos, videos, location)
- People you interact with and how often
- Pages you like and follow
- Messages you send
- Your browsing history (via tracking pixels)
- Time spent on each post
- When you''re active
- Your contacts (if you allow access)
- Your location history

This data is used to:
- Target advertising (primary business model)
- Build detailed psychological profiles
- Sell to data brokers
- Train AI algorithms
- Share with third parties

Without proper privacy settings:
- Posts visible to strangers
- Location data reveals where you live/work
- Scammers can impersonate you or loved ones
- Employers/schools see things you didn''t intend
- Your data is sold and shared widely

## General Privacy Principles

### Think Before You Post

Cannot be unsaid:
- Once posted, can be screenshot/saved
- "Delete" doesn''t remove all copies
- Internet archive and cached versions persist
- Others may have shared your post

Red Flags to Avoid Posting:
- Full date of birth (identity theft risk)
- Home address or exact location
- Vacation plans (broadcasting empty home)
- Financial information
- Children''s schools/routines
- Boarding passes/tickets with barcodes
- Photos of credit cards, IDs, or keys

Safe Sharing:
- Share experiences after they happen
- Be vague about locations ("the beach" not "Malibu Beach")
- Avoid tagging exact addresses
- Review photos before posting (reflections, backgrounds)

### Audience Awareness

Who can see your posts?
- Public: Anyone on the internet
- Friends: People you''ve accepted
- Friends of friends: Extended network
- Custom: Specific people/lists
- Only me: Private (but platform still sees it)

Default to "Friends Only":
- Prevents strangers from seeing personal info
- Reduces phishing/scam risks
- Limits employer/school visibility
- You can still make specific posts public

### Regular Privacy Checkups

Quarterly Review:
- Go through privacy settings
- Review third-party app access
- Check who can see old posts
- Update friend lists
- Remove/untag unwanted photos

## Platform-Specific Privacy Settings

### Facebook Privacy Settings

Access: Settings & Privacy → Settings → Privacy

**Who can see your posts:**
- Settings → Privacy → "Who can see your future posts?"
- Set to "Friends" (not Public)

**Profile Information:**
- Settings → Privacy → "Who can see your friends list?"
- Limit to "Only me" or "Friends"
- Review "About" section visibility
- Hide email, phone, birthday details

**Past Posts:**
- Settings → Privacy → "Limit past posts"
- Makes all old public posts "Friends only"

**Search and Contact:**
- "Who can look you up using email/phone?" → Friends or "Only me"
- "Do you want search engines to link to your profile?" → No

**Timeline and Tagging:**
- "Review posts you''re tagged in before they appear?" → Enable
- "Who can see posts you''re tagged in?" → Friends
- "Who can see what others post on your timeline?" → Friends

**Face Recognition:**
- Settings → Face Recognition → "No" (disable)

**Location Services:**
- Settings → Location → Review apps with location access
- Disable for Facebook app if not needed

**Off-Facebook Activity:**
- Settings → Your Facebook Information → Off-Facebook Activity
- Disconnect external websites and apps
- Turn off future activity

**Third-Party Apps:**
- Settings → Apps and Websites
- Remove apps you don''t use
- Check what data apps can access

### Instagram Privacy Settings

Access: Profile → Menu → Settings → Privacy

**Private Account:**
- Account Privacy → Private Account (ON)
- Only approved followers see posts
- Prevents strangers from following

**Story Sharing:**
- Story → Hide story from [specific people]
- Close Friends list for selective sharing

**Activity Status:**
- Show Activity Status → OFF
- Hides when you''re online

**Tags and Mentions:**
- Tags → "Allow tags from" → "People you follow"
- Mentions → "Allow mentions from" → "People you follow"

**Comments:**
- Comments → "Allow comments from" → "People you follow"
- Filter offensive comments → ON

**Guides, Posts, and Messaging:**
- Review who can see your posts
- Control who can message you

**Location:**
- Before posting, tap "Add location" and remove it
- Don''t create location-based stories

### Twitter/X Privacy Settings

Access: Settings and Privacy → Privacy and Safety

**Audience and Tagging:**
- Protect your Tweets (makes account private)
- Photo tagging → "Allow anyone to tag you" → OFF
- Remove yourself from tagged photos

**Your Activity:**
- Discoverability → "Let people find you by email" → OFF
- Discoverability → "Let people find you by phone number" → OFF

**Direct Messages:**
- Receive messages from anyone → Consider disabling
- Show read receipts → OFF

**Spaces:**
- "Allow people to find my Spaces" → Consider disabling

**Off-Twitter Activity:**
- Settings → Privacy and safety → Off-Twitter activity
- Disable tracking

**Personalization:**
- Ads preferences → Less personalized ads
- Disable data sharing with business partners

### LinkedIn Privacy Settings

Access: Me icon → Settings & Privacy → Privacy

**How others see your profile:**
- "Who can see your email address" → Connections
- "Who can see your connections" → Only you
- Profile viewing options → Private mode

**How others see your LinkedIn activity:**
- Share profile changes → OFF (prevents notifications)
- Mentions or tags → Control who can tag/mention you

**Blocking and hiding:**
- Block members as needed
- Hide connections from specific people

**Job seeking preferences:**
- Manage "Let recruiters know you''re open" carefully
- Can be visible to people at your current company

**Advertising:**
- Ad preferences → Control data for ad personalization
- Opt out of ads on partner websites

### TikTok Privacy Settings

Access: Profile → Menu → Settings and Privacy → Privacy

**Suggest your account to others:**
- Turn OFF (prevents recommendations)

**Private Account:**
- Enable to approve followers

**Who can see your content:**
- Liked videos → "Only me"
- Downloads → Friends or OFF

**Comments:**
- Who can comment → Friends or Following

**Duet and Stitch:**
- Allow Duet → Friends or OFF
- Allow Stitch → Friends or OFF

**Data and Personalization:**
- Settings → Privacy → Personalization and data
- Personalized ads → OFF
- Off-TikTok activity → Disable

### Snapchat Privacy Settings

Access: Profile icon → Settings icon → Privacy Control

**Contact Me:**
- Contact me → My Friends (not Everyone)

**View My Story:**
- Everyone → Change to "My Friends"
- Custom lists for close friends

**See My Location:**
- Ghost Mode → ON (hides location)
- Or limit to close friends

**See Me in Quick Add:**
- OFF (prevents Snap suggesting you to strangers)

### YouTube Privacy Settings

Access: Profile → Settings → Privacy

**Subscriptions:**
- Keep subscriptions private → ON

**Saved Playlists:**
- Make playlists private or unlisted

**Watch History:**
- Pause watch history if sharing account
- Clear watch history regularly

**Liked Videos:**
- Make liked videos playlist private

## Mobile App Privacy

App Permissions Review:

iOS:
- Settings → Privacy → Review each permission type
- Check which apps have Camera, Microphone, Location access
- Revoke unnecessary permissions

Android:
- Settings → Privacy → Permission Manager
- Review apps by permission type
- Set location to "Only while using app" not "All the time"

Social Media Apps Often Request:
- Contacts (to "find friends")
- Camera and microphone
- Location (to tag posts)
- Photos (to upload)
- Calendar

Best Practice:
- Deny by default
- Grant only when needed
- Revoke after use if possible

## Additional Privacy Measures

### Two-Factor Authentication

Enable MFA on all accounts:
- Prevents unauthorized access even if password leaks
- Use authenticator app (not SMS)

### Email Address Management

Use separate email for social media:
- Prevents primary email exposure
- Limits spam if email is leaked
- Easier to abandon if needed

### Linked Accounts

Be cautious with "Sign in with Facebook/Google":
- Creates data sharing between platforms
- Review what linked accounts can access
- Unlink accounts you don''t need

### Photo Metadata

Photos contain metadata (EXIF):
- GPS coordinates (where photo taken)
- Date and time
- Camera/phone model

Remove metadata before posting:
- iOS: Screenshots automatically remove metadata
- Android: Use metadata removal apps
- Desktop: ExifTool or similar software

### Facial Recognition Opt-Out

Many platforms use facial recognition:
- Disable in settings when available
- Consider how your face data is stored
- European GDPR gives you more control

## Teaching Kids Social Media Privacy

Age Limits:
- Most platforms require age 13+ (COPPA law)
- Monitor younger kids'' device usage

Rules for Kids:
- Never share full name, age, school, address
- Never meet online friends in person
- Tell parents if anything makes them uncomfortable
- Think before posting (will this embarrass me later?)
- Privacy settings to Friends only

Parent Monitoring:
- Follow/friend your kids on social media
- Regular check-ins about online activity
- Open conversation about online risks
- Lead by example with your own privacy practices

## Key Takeaways

- Default all accounts to "Friends only" not Public
- Review privacy settings quarterly (platforms change them)
- Enable two-factor authentication on all social media accounts
- Limit third-party app access and review regularly
- Turn off location services and remove geotags from posts
- Make your profile unsearchable by email/phone
- Use private/incognito mode when researching sensitive topics
- Think before posting - permanent internet footprint
- Review and limit app permissions on mobile devices
- Disable ad personalization and off-platform tracking
- Never post your full birth date, address, or real-time location
- Remove metadata from photos before posting
- Make accounts private and approve followers manually
- Regularly review tagged photos and remove unwanted tags', 'https://www.youtube.com/watch?v=tpvkFC2U_EY', 3, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.79', '2026-01-19 11:42:54.639', 'e8dddf00-c067-44b9-b2b9-42e203bcf7fe');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('8b8b2120-e985-465e-9cf8-723f71b11f92', 'PII Explained', '# What is Personal Identifiable Information (PII)?

## Definition of PII

Personal Identifiable Information (PII) is any data that can identify, contact, or locate a specific individual, either alone or when combined with other information.

## Types of PII

### Direct Identifiers (Explicit PII)

Information that directly identifies an individual:

- Full name
- Social Security Number (SSN)
- Driver''s license number
- Passport number
- Biometric data (fingerprints, facial recognition, retina scans)
- Full address (street address + name)
- Email address (when combined with name)
- Phone number (when linked to identity)
- Bank account numbers
- Credit/debit card numbers
- Medical records with identifiers
- Vehicle identification number (VIN) + owner info

### Indirect Identifiers (Quasi-Identifiers)

Data that can identify someone when combined:

- Date of birth
- Place of birth
- ZIP code
- Gender
- Race/ethnicity
- Job title and employer
- Education records
- IP addresses
- Device identifiers (MAC address, IMEI)
- Geolocation data
- Usernames (if tied to real identity)

### Sensitive PII

Especially private information that poses higher risk:

- Medical records and health information
- Financial information
- Genetic information
- Biometric data
- Criminal history
- Sexual orientation
- Religious affiliation
- Union membership
- Mental health records

## Why PII Protection Matters

### Identity Theft

Stolen PII enables criminals to:
- Open accounts in your name
- File fraudulent tax returns
- Access medical care
- Obtain credit cards/loans
- Commit crimes under your identity

Real Impact:
- Average victim spends 200+ hours resolving identity theft
- Financial losses average $1,100 per victim
- Credit damage can last years
- Emotional stress and anxiety

### Financial Fraud

With PII, attackers can:
- Access bank accounts
- Make unauthorized purchases
- Transfer money
- Apply for loans
- Drain retirement accounts

### Privacy Violations

Your PII reveals:
- Where you live and work
- Your habits and routines
- Health conditions
- Financial status
- Personal relationships
- Political views and activities

## PII in the Digital Age

### Data You Share

Consciously Shared:
- Social media profiles
- Online shopping accounts
- Email newsletters
- Loyalty programs
- Mobile apps
- Smart home devices

Unknowingly Shared:
- Browsing history
- Location data from phones
- Metadata in photos
- Public records (property, voting, court)
- Data broker compilations

### The Data Economy

Companies collect and trade PII:
- Data brokers sell consumer profiles
- Advertisers track across websites
- Apps harvest and monetize user data
- "Free" services trade access for data

One data broker can have:
- 3,000+ data points per person
- Your shopping habits
- Health conditions
- Financial status
- Personal interests
- Political leanings

## Protecting Your PII

### Minimize Sharing

Share Only What''s Necessary:
- Question every form field
- Use "prefer not to say" when available
- Provide minimal info for loyalty programs
- Skip optional fields

Think Before Posting:
- Avoid sharing full birthday (use month/day only)
- Don''t post travel plans publicly
- Review social media privacy settings
- Remove location data from photos

### Secure What You Share

Online Accounts:
- Strong, unique passwords
- Enable multi-factor authentication
- Review app permissions regularly
- Delete unused accounts

Documents:
- Shred financial documents
- Store sensitive docs securely
- Use encrypted cloud storage
- Never carry SSN card

### Monitor Your Information

Regular Checks:
- Review credit reports (free annually at annualcreditreport.com)
- Check bank/card statements weekly
- Monitor medical benefits statements
- Google yourself periodically
- Check data broker sites (opt out when possible)

### When You Must Share PII

Verify Legitimacy:
- Confirm who''s asking and why they need it
- Use official channels only (not email links)
- Check website security (HTTPS, valid certificate)
- Be skeptical of unexpected requests

Ask Questions:
- "Why do you need this information?"
- "How will it be protected?"
- "Who will have access?"
- "How long will you keep it?"
- "Can I provide less information?"

## Key Takeaways

- PII is any information that can identify you personally
- Direct identifiers alone can identify you; indirect identifiers work in combination
- Sensitive PII requires extra protection due to higher risk
- Your PII has significant value to criminals and companies
- Minimize PII sharing, secure what you do share, and monitor regularly
- Always verify requests for PII before providing information
- Think of PII protection as a lifelong practice, not a one-time task', 'https://www.youtube.com/watch?v=Fb_5TubCDPs', 1, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.787', '2026-01-19 11:42:54.642', '00a5afc1-3c46-4fca-9fcb-ff0603f95f82');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('c8cc85f7-c8ba-4cfb-8b9d-0d2d585addb3', 'Secure File Sharing', '# Secure File Sharing Best Practices

## Why File Sharing Security Matters

Organizations and individuals share files constantly:
- Collaborating on projects
- Sending documents to clients
- Sharing photos with family
- Submitting work deliverables
- Distributing sensitive information

Insecure file sharing leads to:
- Data breaches and leaks
- Unauthorized access to confidential information
- Malware distribution
- Loss of intellectual property
- Compliance violations
- Reputational damage

## Common File Sharing Methods (Ranked by Security)

### Email Attachments (Least Secure)

Problems:
- Not encrypted end-to-end (usually)
- Files stored on multiple mail servers
- Recipients can forward easily
- No control after sending
- Size limits (usually 25MB)
- Attachment gets copied to every server in the chain

When to Use:
- Non-sensitive files only
- Public information
- When no alternative exists

Best Practices If You Must:
- Password-protect sensitive attachments (7-Zip, Office encryption)
- Send password through different channel (phone, text)
- Use encrypted email service (ProtonMail, Tutanota)
- Keep file sizes reasonable
- Don''t email: SSNs, credit cards, passwords, medical records, financial data

### Cloud Storage Links (Moderate Security)

Services: Google Drive, Dropbox, OneDrive, Box

Pros:
- Large file support
- Can revoke access anytime
- Version control
- Expiring links available

Cons:
- Provider has encryption keys (can access your files)
- Links can be intercepted
- Accidental public sharing common
- Provider may scan files

Best Practices:
- Use expiring links (24 hours, 7 days)
- Set download limits
- Require password for sensitive files
- Use "view only" not "edit" when possible
- Review who has access regularly
- Revoke access when no longer needed
- Don''t make folders publicly accessible

### Secure File Transfer Services (Better Security)

Services:
- Bitwarden Send (encrypted, temporary)
- Tresorit Send (end-to-end encrypted)
- Firefox Send alternatives
- WeTransfer (with password)

Features:
- End-to-end encryption (some)
- Automatic expiration
- Download limits
- Password protection
- No account required for recipients

Best Practices:
- Set shortest reasonable expiration (hours, not days)
- Limit downloads to 1-2
- Always use password protection
- Send password separately
- Use for sensitive one-time transfers

### Enterprise File Sharing (Highest Security)

Services: Box, SharePoint, Egnyte, Citrix ShareFile

Features:
- Granular access controls
- Audit logs (who accessed what, when)
- Data Loss Prevention (DLP)
- Integration with corporate SSO
- Compliance certifications (HIPAA, FINRA, etc.)
- Data residency controls
- Remote wipe capabilities

When to Use:
- Business-critical files
- Client deliverables
- Regulated data (healthcare, finance, legal)
- Large organizations

## Secure File Sharing Best Practices

### Before Sharing

Classify the Data:
- Public: Anyone can see (marketing materials, public docs)
- Internal: Company employees only
- Confidential: Limited business need-to-know
- Restricted: Highly sensitive (legal, HR, financial)

Ask Yourself:
- Who really needs access?
- What level of access (view, edit, download)?
- How long should they have access?
- What happens if this file leaks?

### Setting Permissions

Principle of Least Privilege:
- Grant minimum access required
- View-only unless editing needed
- Specific people, not "anyone with link"
- Expiration dates by default

Permission Levels:
- View Only: Can see but not download or edit
- Comment: Can view and add comments
- Edit: Can modify the file
- Owner: Full control including sharing

Red Flags to Avoid:
- "Anyone with the link can edit"
- "Public on the web"
- No expiration date
- Excessive permissions

### Encryption

Three Types:

1. In Transit (HTTPS/TLS):
   - Protects while file is being sent
   - Standard for modern services
   - Still vulnerable at endpoints

2. At Rest:
   - Protects stored files on servers
   - Provider has keys (can decrypt)
   - Better than nothing

3. End-to-End:
   - Only sender and recipient can decrypt
   - Provider cannot access
   - Best security
   - Use for sensitive data

How to Ensure End-to-End Encryption:
- Use zero-knowledge services (Tresorit, Sync.com, ProtonDrive)
- Or encrypt locally before uploading (7-Zip, VeraCrypt)
- Send decryption key separately (phone, secure messaging)

### Access Management

Regular Audits:
- Monthly review of shared files
- Remove people who no longer need access
- Check for public links
- Verify expiration dates are set

Revoking Access:
- Immediately when person leaves company/project
- After file purpose is complete
- If unauthorized sharing suspected
- Regularly scheduled cleanups

Activity Monitoring:
- Enable activity tracking when available
- Review who downloads files
- Unusual access patterns (off-hours, excessive downloads)
- Forwarding/re-sharing alerts

### Special Considerations for Sensitive Data

Medical Records (HIPAA):
- Use HIPAA-compliant file sharing (Box, ShareFile)
- Business Associate Agreements (BAAs) required
- Audit logs mandatory
- Encryption required
- Patient consent for sharing

Financial Data (PCI-DSS, SOX):
- Never share credit card numbers via email
- Use secure file transfer with encryption
- Access logs required
- Time-limited access

Legal Documents (Attorney-Client Privilege):
- Client portals (NetDocuments, iManage)
- End-to-end encryption
- Watermarks to track leaks
- Non-disclosure agreements

Personal Data (GDPR):
- EU resident data has special protections
- Document why sharing is necessary
- Delete after purpose fulfilled
- Data Processing Agreements (DPAs) with recipients

## Mobile File Sharing

Extra Risks:
- Devices lost/stolen more often
- Public Wi-Fi usage
- App permissions overly broad
- Smaller screens = harder to verify recipients

Mobile Best Practices:
- Enable device encryption (iOS default, Android: Settings → Security)
- Use biometric/PIN for file apps
- Don''t share over public Wi-Fi (use VPN or cellular)
- Verify recipients carefully
- Use mobile app permissions (restrict to specific files)
- Remote wipe capability enabled

## Avoiding Common Mistakes

### Mistake 1: "Reply All" Disasters

Problem: Accidentally sharing confidential info with whole email chain

Prevention:
- Check recipients before hitting send
- Use BCC for large groups
- Remove unnecessary recipients
- Use "External" email warnings
- Think before forwarding

### Mistake 2: Public Links

Problem: "Anyone with link" shared on social media, indexed by Google

Prevention:
- Default to "specific people" not "anyone with link"
- Use "restricted" not "anyone in organization" for sensitive files
- Search your company domain on Google: site:drive.google.com "confidential"
- Regular audits of public links

### Mistake 3: Expired Email Addresses

Problem: Sharing files with outdated email addresses or former employees

Prevention:
- Verify recipient email before sharing
- Regularly review access list
- Auto-revoke access for terminated accounts
- Use group/role-based permissions instead of individual emails

### Mistake 4: No Expiration Dates

Problem: Files accessible forever even after need ends

Prevention:
- Set expiration for every share
- Default to shortest reasonable time
- Calendar reminders to review long-term shares
- Automatic cleanup policies

### Mistake 5: Trusting the Recipient

Problem: Recipient''s account gets compromised or they share further

Prevention:
- Watermark sensitive documents
- Disable download/print when possible
- Use NDAs for highly sensitive information
- Accept some information will be shared - adjust sensitivity accordingly

## Key Takeaways

- Email attachments are least secure - avoid for sensitive data
- Use cloud storage links with expiration and passwords
- End-to-end encryption for highly sensitive files (Tresorit, ProtonDrive)
- Set shortest reasonable expiration dates
- Grant minimum permissions needed (view-only when possible)
- Regularly audit who has access to shared files
- Revoke access immediately when no longer needed
- Encrypt locally before uploading to standard cloud services
- Verify recipients carefully before sharing
- Use enterprise solutions for business-critical data
- Mobile sharing requires extra caution (encryption, VPN)
- Follow compliance requirements (HIPAA, PCI-DSS, GDPR)', 'https://www.youtube.com/watch?v=0BRx_nL-7co', 2, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.788', '2026-01-19 11:42:54.644', 'e8dddf00-c067-44b9-b2b9-42e203bcf7fe');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('823ef274-aa37-4ee0-8b08-26798858f405', 'Identity Theft', '# Identity Theft Prevention and Recovery

## What is Identity Theft?

Identity theft occurs when someone uses your personal information without permission to:
- Open accounts in your name
- Access your bank accounts
- File fraudulent tax returns
- Obtain medical care
- Commit crimes
- Apply for credit cards/loans
- Get a job using your identity

The impact can be devastating:
- Average victim spends 200+ hours recovering
- Financial losses average $1,100 (can be much higher)
- Credit score damage lasting years
- Emotional stress and anxiety
- Difficulty getting loans, jobs, or housing
- Risk of being arrested for crimes you didn''t commit

## How Identity Theft Happens

### Data Breaches

Massive corporate breaches expose millions:
- Equifax breach (2017): 147 million SSNs, DOBs, addresses
- Yahoo breach: 3 billion accounts
- Capital One breach: 100 million accounts
- T-Mobile breach: 54 million customers

Your data is in databases you don''t control:
- Credit bureaus
- Healthcare providers
- Retailers
- Banks
- Government agencies
- Employers

### Phishing and Social Engineering

Criminals trick you into revealing information:
- Fake emails from "banks" asking for account verification
- Phone calls from "IRS" demanding immediate payment
- Text messages about "suspicious activity"
- Fake websites that look legitimate

### Physical Theft

Old-school but still effective:
- Stolen mail (credit card offers, bank statements)
- Dumpster diving for discarded documents
- Stolen wallets/purses
- Skimming devices on ATMs
- Shoulder surfing for PINs

### Online Exposure

Information you share enables theft:
- Social media profiles with DOB, hometown, mother''s maiden name
- Public records (property ownership, court documents)
- Data brokers selling your information
- Unsecured Wi-Fi usage
- Malware on your devices

## Warning Signs of Identity Theft

Early Detection is Critical:

Financial Red Flags:
- Unexplained withdrawals from bank accounts
- Credit cards you didn''t apply for
- Bills for services you didn''t use
- Calls from debt collectors about unknown debts
- Credit report shows accounts you didn''t open
- Medical bills for care you didn''t receive
- IRS notification about duplicate tax return

Account Access Issues:
- Can''t log into accounts (password changed)
- Missing mail (especially financial statements)
- Unexpected password reset emails
- Two-factor authentication codes you didn''t request

Government/Legal:
- Notice about unemployment benefits you didn''t file
- Court summons for cases you''re not involved in
- Arrest warrant for crimes you didn''t commit
- Driver''s license suspension for reasons unknown

## Prevention Strategies

### Protect Your Social Security Number

Your SSN is the master key to your identity:

Never Carry SSN Card:
- Store in safe place at home
- Only bring when absolutely required (new job, Social Security office)

Limit Sharing:
- Ask "Do you really need my SSN?"
- Can I use alternate identifier?
- How will you protect it?
- Who will have access?

Medicare Cards:
- New cards no longer show full SSN
- Old cards should be destroyed

### Monitor Your Credit

Free Credit Reports:
- AnnualCreditReport.com (official site)
- One free report per year from each bureau (Equifax, Experian, TransUnion)
- Stagger requests (one every 4 months for year-round monitoring)

What to Check:
- Accounts you don''t recognize
- Incorrect personal information
- Inquiries you didn''t authorize
- Addresses you''ve never lived at

Credit Monitoring Services:
- Credit Karma (free, real-time alerts)
- Bank/credit card free monitoring
- Paid services (IdentityGuard, LifeLock, etc.)

### Freeze Your Credit

Credit Freeze is the strongest protection:

What it Does:
- Prevents new accounts from being opened
- Creditors can''t access your report
- Identity thieves can''t get credit in your name
- Free by law

How to Freeze:
1. Contact all three credit bureaus:
   - Equifax: equifax.com/personal/credit-report-services
   - Experian: experian.com/freeze
   - TransUnion: transunion.com/credit-freeze

2. Provide personal information to verify identity

3. Receive PIN/password to manage freeze

4. Freeze remains until you lift it

When to Temporarily Lift:
- Applying for credit card, loan, mortgage
- Renting apartment (some landlords check credit)
- Opening utility account

Credit Freeze vs. Credit Lock:
- Freeze: Free, legally regulated, more secure
- Lock: Often paid service, less regulation, convenience features

Also Freeze:
- ChexSystems (banking)
- Innovis (4th credit bureau)
- National Consumer Telecom & Utilities Exchange (NCTUE)

### Secure Your Mail

Physical Mail Security:
- Use locking mailbox
- Retrieve mail promptly
- USPS Hold Mail when traveling
- Shred financial documents, credit card offers
- Opt out of pre-screened credit offers (optoutprescreen.com)

Go Paperless:
- Electronic bank statements
- Online bill payment
- Reduces mail theft risk
- Faster fraud detection

### Secure Your Accounts

Password Strategy:
- Unique password for every account
- Use password manager (LastPass, 1Password, Bitwarden)
- 16+ character passwords
- Never reuse passwords

Multi-Factor Authentication:
- Enable on all accounts that support it
- Use authenticator app (not SMS when possible)
- Prevents access even if password is stolen

## If You Become a Victim

### Immediate Steps (First 24 Hours)

1. Place Fraud Alert
   - Call one credit bureau
   - Automatically applied to all three
   - Equifax: 1-800-525-6285
   - Experian: 1-888-397-3742
   - TransUnion: 1-800-680-7289

2. Order Credit Reports
   - Review for fraudulent accounts
   - AnnualCreditReport.com

3. Report to FTC
   - IdentityTheft.gov
   - Create recovery plan
   - Get Identity Theft Report (affidavit)

4. File Police Report
   - Bring to local police
   - Request copy of report
   - Needed for legal proceedings

### Close Compromised Accounts

For Each Fraudulent Account:
- Call fraud department
- Explain you''re identity theft victim
- Send identity theft report
- Close account in writing
- Request fraudulent charges removed

### Monitor and Follow Up

First Year After Theft:
- Check credit reports monthly
- Review bank/card statements weekly
- File taxes early (before fraudster can)
- Keep detailed records of everything

Long-Term:
- Credit freeze on all bureaus
- Continue monitoring indefinitely
- Save all documentation

## Recovery Resources

Federal Trade Commission (FTC):
- IdentityTheft.gov (comprehensive recovery guide)
- File complaint
- Create recovery plan
- Get Identity Theft Report

IRS Identity Theft:
- Identity Protection PIN (IP PIN)
- Form 14039 (Identity Theft Affidavit)
- 1-800-908-4490

Social Security Administration:
- Report SSN misuse
- 1-800-772-1213
- SSA.gov/myaccount

## Key Takeaways

- Never carry your Social Security card - store it securely
- Freeze your credit with all three bureaus (free and effective)
- Check credit reports regularly (annualcreditreport.com every 4 months)
- Enable two-factor authentication on all important accounts
- Use unique passwords for every account with a password manager
- Shred financial documents and opt out of prescreened credit offers
- Be skeptical of unsolicited requests for personal information
- Monitor accounts weekly for unauthorized activity
- If victimized, act immediately: fraud alert, credit freeze, FTC report
- Recovery takes time but is possible with persistence and documentation
- Prevention is far easier than recovery - stay vigilant', 'https://www.youtube.com/watch?v=SH5ZCrwq5yw', 4, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.791', '2026-01-19 11:42:54.647', 'baf30430-fd72-4ef1-b8dd-7e9ee003353b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('8181a6af-9de3-4cee-b543-4d7f43f55e76', 'Data Regulations', '# Data Protection Regulations (GDPR, CCPA)

## Why Data Protection Laws Matter

For decades, companies collected personal data with few restrictions:
- Sold data to third parties without consent
- Suffered breaches with minimal consequences
- Buried privacy policies in legalese
- Made opting out nearly impossible

Modern data protection laws give power back to individuals:
- Control over your personal data
- Right to know what''s collected
- Right to delete your data
- Right to opt out of selling
- Heavy penalties for violations

## General Data Protection Regulation (GDPR)

### Overview

Implemented: May 25, 2018
Jurisdiction: European Union + European Economic Area
Applies to: Any organization processing EU residents'' data (even if based outside EU)

Strictest privacy law globally:
- Gold standard for data protection
- Inspired similar laws worldwide
- Penalties up to €20 million or 4% of global revenue (whichever is higher)

### Core Principles

1. Lawfulness, Fairness, Transparency
   - Must have legal basis for processing data
   - Clear, understandable privacy notices
   - No hidden data collection

2. Purpose Limitation
   - Data collected for specific, explicit purposes
   - Can''t repurpose data without consent
   - "We''ll use this for X" means only X

3. Data Minimization
   - Collect only what''s necessary
   - "Need to know" principle
   - Can''t demand excessive information

4. Accuracy
   - Keep data accurate and up to date
   - Allow corrections
   - Delete inaccurate information

5. Storage Limitation
   - Keep data only as long as needed
   - Define retention periods
   - Delete when purpose is fulfilled

6. Integrity and Confidentiality
   - Protect data with appropriate security
   - Prevent unauthorized access
   - Encryption, access controls

7. Accountability
   - Organizations must demonstrate compliance
   - Document data practices
   - Regular audits and assessments

### Your Rights Under GDPR

Right to Be Informed:
- Clear privacy notices
- What data is collected
- Why it''s collected
- How it''s used
- Who it''s shared with
- How long it''s kept

Right of Access:
- Request copy of your data
- Free of charge
- Within one month
- "Show me everything you have about me"

Right to Rectification:
- Correct inaccurate data
- Complete incomplete data
- Organization must comply within one month

Right to Erasure ("Right to Be Forgotten"):
- Request deletion of your data
- Applies when:
  - Data no longer needed
  - You withdraw consent
  - You object to processing
  - Data was unlawfully processed

Right to Restrict Processing:
- Limit how data is used
- "Keep it but don''t use it"
- While verifying accuracy or assessing objection

Right to Data Portability:
- Receive your data in machine-readable format
- Transfer data between services
- "Give me my data so I can move to competitor"

Right to Object:
- Object to processing for direct marketing
- Object to automated decision-making
- Organization must stop unless compelling reason

Rights Related to Automated Decision-Making:
- Not subject to decisions based solely on automated processing
- Right to human review
- Important for: credit decisions, hiring, insurance

### GDPR Consent Requirements

Valid Consent Must Be:
- Freely given (not coerced)
- Specific (separate for each purpose)
- Informed (clear what you''re consenting to)
- Unambiguous (clear affirmative action)

Prohibited Practices:
- Pre-checked boxes (must actively opt-in)
- Bundled consent ("agree or can''t use service" for non-essential features)
- Making service conditional on unrelated consent

Withdrawal:
- Must be as easy to withdraw as to give
- One-click unsubscribe
- Organizations must honor immediately

### Enforcement and Penalties

Major GDPR Fines:
- Amazon: €746 million (2021) - consent violations
- Meta/Facebook: €1.2 billion (2023) - data transfers
- Google: €90 million (2020) - cookie consent violations

Data Protection Authorities (DPAs):
- Each EU country has DPA
- Investigates complaints
- Issues fines
- Provides guidance

How to File Complaint:
- Contact your country''s DPA
- File online (most have web forms)
- No cost to file
- DPA investigates on your behalf

## California Consumer Privacy Act (CCPA)

### Overview

Implemented: January 1, 2020
Amended by: California Privacy Rights Act (CPRA, 2023)
Jurisdiction: California residents
Applies to: Businesses meeting thresholds (revenue $25M+, 50K+ consumers, 50%+ revenue from data sales)

Most comprehensive US privacy law:
- Modeled after GDPR
- Gives California residents significant rights
- Other states following with similar laws

### Your Rights Under CCPA/CPRA

Right to Know:
- What personal information is collected
- Sources of information
- Purpose for collection
- Third parties data is shared with
- Specific pieces of data held about you

Right to Delete:
- Request deletion of personal information
- Exceptions: complete transaction, comply with legal obligations

Right to Opt Out:
- Opt out of sale/sharing of personal information
- "Do Not Sell or Share My Personal Information" link required
- Applies to businesses selling data

Right to Correct:
- Correct inaccurate personal information
- Added by CPRA

Right to Limit Use of Sensitive Personal Information:
- Sensitive data: SSN, financial accounts, precise geolocation, health, race, religion
- Right to limit use to necessary business purposes only
- Added by CPRA

Right to Non-Discrimination:
- Can''t be denied service for exercising rights
- Can''t be charged different prices
- Can''t receive different quality of service
- Exception: Can offer financial incentive for data collection if reasonably related to value

### CCPA vs GDPR Differences

Scope:
- GDPR: All EU residents
- CCPA: California residents + qualifying businesses

Opt-In vs Opt-Out:
- GDPR: Opt-in (must get consent before collecting)
- CCPA: Opt-out (can collect but must allow opt-out of selling)

Enforcement:
- GDPR: Government agencies
- CCPA: Attorney General + private right of action for breaches

Penalties:
- GDPR: Up to 4% global revenue
- CCPA: $2,500 per violation, $7,500 for intentional

### How to Exercise CCPA Rights

Look for Links on Websites:
- "Do Not Sell My Personal Information"
- "Your Privacy Choices"
- Usually in footer

Submission Methods:
- Web forms
- Email
- Toll-free phone number
- Businesses must provide at least 2 methods

Response Timeline:
- 45 days to respond
- Can extend another 45 days if complex

Verification:
- Business may verify your identity
- Must match info they already have
- Can''t require new account creation

## Other US State Privacy Laws

Virginia Consumer Data Protection Act (VCDPA):
- Effective: January 1, 2023
- Similar to CCPA
- Rights: access, correct, delete, opt-out

Colorado Privacy Act (CPA):
- Effective: July 1, 2023
- Similar to CCPA/VCDPA
- Universal opt-out mechanism

Connecticut Data Privacy Act:
- Effective: July 1, 2023

Utah Consumer Privacy Act:
- Effective: December 31, 2023

Trend: More states passing similar laws

## Other International Laws

### Brazil: Lei Geral de Proteção de Dados (LGPD)
- Similar to GDPR
- Effective: 2020
- Applies to Brazilian residents

### Canada: Personal Information Protection and Electronic Documents Act (PIPEDA)
- National privacy law
- Consent-based
- Right to access and correct

### Australia: Privacy Act 1988
- Australian Privacy Principles
- Right to access
- Complaint mechanism

### Japan: Act on Protection of Personal Information (APPI)
- Reformed 2017, 2020
- Aligns with GDPR principles

### China: Personal Information Protection Law (PIPL)
- Effective: 2021
- Similar to GDPR
- Strict cross-border data transfer rules

## How to Exercise Your Rights

### GDPR Rights (EU Residents)

1. Data Access Request:
   - Contact company''s Data Protection Officer (DPO)
   - Email or web form
   - Template: "I request a copy of all personal data you hold about me under Article 15 of the GDPR"

2. Data Deletion Request:
   - Contact DPO
   - Template: "I request deletion of all my personal data under Article 17 of the GDPR"

3. If No Response:
   - Complaint to national Data Protection Authority
   - EU residents: Find your DPA at edpb.europa.eu

### CCPA Rights (California Residents)

1. Find Privacy Link:
   - Footer: "Do Not Sell My Personal Information"
   - Privacy Policy page

2. Submit Request:
   - Fill out web form
   - Email: privacy@company.com
   - Call toll-free number

3. Verify Identity:
   - Provide matching information
   - May need to confirm email

4. If No Response:
   - File complaint with California Attorney General
   - cal.ag/privacy

## Privacy Tools and Resources

### Browser Extensions

Privacy Badger (EFF):
- Blocks invisible trackers
- Learns over time

uBlock Origin:
- Ad blocker
- Reduces tracking

### Opt-Out Services

Privacy Rights Clearinghouse:
- privacyrights.org
- Comprehensive guides

Data Broker Opt-Outs:
- Manual process
- Opt out from major brokers:
  - Spokeo, Whitepages, Intelius, BeenVerified, MyLife, PeopleFinder

JustDeleteMe:
- justdelete.me
- Instructions to delete accounts from hundreds of sites

### Legal Resources

Electronic Frontier Foundation (EFF):
- eff.org
- Digital rights advocacy
- Privacy guides

Your Rights Organizations:
- Access Now (accessnow.org)
- Privacy International (privacyinternational.org)
- Electronic Privacy Information Center (EPIC.org)

## Key Takeaways

- GDPR (EU) and CCPA (California) give you significant control over your data
- You have the right to know what data companies collect about you
- You can request deletion of your personal data
- You can opt out of data selling (CCPA/CPRA)
- Companies must respond to requests within 30-45 days
- Consent must be freely given and easy to withdraw (GDPR)
- Heavy fines encourage company compliance (GDPR up to 4% global revenue)
- Other states and countries are passing similar laws
- To exercise rights, look for privacy links on websites or contact privacy/DPO email
- File complaints with regulators if companies don''t respond
- Use privacy tools (Privacy Badger, uBlock Origin) to reduce tracking
- Opt out of data brokers (tedious but worthwhile for high-risk individuals)
- These laws apply even if you''re not in EU/California (if company operates there)
- Read privacy policies to understand your rights under each law
- More comprehensive federal US privacy law may come in the future', 'https://www.youtube.com/watch?v=HXREU0xHlgI', 5, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.793', '2026-01-19 11:42:54.649', 'baf30430-fd72-4ef1-b8dd-7e9ee003353b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('d3d238c3-0ed1-4842-a3c4-3c03126ea321', 'Containment', '# Incident Response: Containment

## What is Containment?

Containment is the phase of incident response focused on limiting the scope and impact of a security incident.

Goal: Stop the bleeding before fixing the wound.

## Why Containment Matters

Quick containment prevents:
- Further data exfiltration
- Lateral movement to other systems
- Additional system compromises
- Escalating damage and costs

**Speed is critical:** Every minute counts during an active incident.

## Types of Containment

### Short-Term Containment

Immediate actions to stop active attack:

**Network Isolation:**
- Disconnect compromised systems
- Block attacker C2 communications
- Segment affected network areas

**Account Lockdown:**
- Disable compromised accounts
- Reset passwords
- Revoke access tokens
- Force MFA re-enrollment

**Process Termination:**
- Kill malicious processes
- Stop malware execution
- Disable scheduled tasks

### Long-Term Containment

Temporary fixes while planning recovery:

**System Patching:**
- Apply critical security updates
- Close exploited vulnerabilities
- Harden configurations

**Monitoring Enhancement:**
- Increase logging
- Deploy additional sensors
- Watch for attacker return

**Backup Systems:**
- Deploy temporary replacements
- Restore critical services
- Maintain business operations

## Containment Strategies

### Complete Isolation

**When to Use:**
- Active data exfiltration
- Ransomware spreading
- Critical system compromise

**Actions:**
- Physically disconnect network cable
- Disable wireless
- Isolate VLAN
- Shutdown system (last resort)

**Caution:** May alert attacker, lose volatile evidence

### Network Segmentation

**When to Use:**
- Limiting lateral movement
- Protecting critical assets
- Partial compromise

**Actions:**
- ACL changes on firewall
- VLAN reconfiguration
- Micro-segmentation
- Block specific traffic flows

### Monitoring Without Disruption

**When to Use:**
- Gathering intelligence
- Observing attacker TTPs
- Building legal case

**Actions:**
- Enhanced logging
- Network taps
- Silent observation
- Coordinated takedown later

**Risk:** Allows continued damage

## Containment Decision Matrix

Consider these factors:

**Business Impact:**
- Revenue loss from downtime
- Customer trust damage
- Regulatory penalties

**Technical Impact:**
- Data sensitivity
- Number of systems affected
- Attacker capabilities

**Evidence Preservation:**
- Legal requirements
- Forensic needs
- Attribution goals

**Resource Availability:**
- Incident response team size
- Time of day/week
- Vendor support

## Containment Actions by Incident Type

### Ransomware

1. Isolate infected systems immediately
2. Identify patient zero
3. Block C2 communication
4. Disable backups access
5. Prevent lateral spread
6. DO NOT pay ransom immediately

### Data Breach

1. Block data exfiltration paths
2. Identify compromised data
3. Revoke attacker access
4. Preserve evidence
5. Notify stakeholders
6. Engage legal/PR teams

### Phishing Campaign

1. Block sender domains
2. Delete malicious emails
3. Disable compromised accounts
4. Reset credentials
5. Scan for malware
6. User awareness alert

### DDoS Attack

1. Activate DDoS mitigation
2. Rate limiting
3. ISP coordination
4. Cloud scrubbing service
5. Identify attack vector
6. Block source IPs (if feasible)

## Common Containment Mistakes

**Mistake 1: Acting Too Slowly**
- Hesitation allows spread
- Every minute matters
- Have playbooks ready

**Mistake 2: Alerting the Attacker**
- Obvious containment tips off attacker
- May trigger data destruction
- Coordinate simultaneous actions

**Mistake 3: Inadequate Containment**
- Partial containment allows resumption
- Attacker finds alternate path
- Must be thorough

**Mistake 4: Destroying Evidence**
- Hasty shutdown loses volatile data
- Needed for forensics and legal
- Image before containment when possible

**Mistake 5: Poor Communication**
- Team not coordinated
- Actions conflict
- Stakeholders uninformed

## Containment Tools

**Network:**
- Firewall rules
- IDS/IPS blocking
- DNS sinkholing
- Network access control (NAC)

**Endpoint:**
- EDR isolation features
- Process termination
- Account disablement
- Host firewall

**Cloud:**
- Security group changes
- Identity and Access Management
- API throttling
- Account suspension

## Documentation During Containment

Record everything:
- Actions taken and time
- Who authorized decisions
- Systems affected
- Evidence preserved
- Containment effectiveness

This is critical for:
- Post-incident review
- Legal proceedings
- Regulatory compliance
- Future improvements

## After Containment

Next Steps:

1. **Eradication:** Remove attacker presence completely
2. **Recovery:** Restore systems to normal
3. **Lessons Learned:** Document and improve

But first ensure:
- Containment is complete
- No attacker access remains
- Monitoring in place

## Key Takeaways

- Containment limits damage and prevents spread
- Speed is critical - every minute counts
- Short-term: stop active attack (isolation, account lockdown)
- Long-term: temporary fixes during recovery planning
- Consider business impact, technical impact, evidence preservation
- Complete isolation for active threats (ransomware, exfiltration)
- Network segmentation to limit lateral movement
- Document all actions taken during containment
- Don''t alert attacker - coordinate simultaneous actions
- Have pre-approved playbooks for common scenarios
- Containment must be thorough - partial containment fails', 'https://www.youtube.com/watch?v=VJ1s3fXVJ3g', 7, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.811', '2026-01-19 11:42:54.662', '922e8060-e5bc-423b-b208-e2edf1425cbe');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('1c2194eb-d475-4500-97d3-3cbc78732072', 'Tracking and Privacy', '# Website Tracking, Cookies, and Privacy

## How Websites Track You

Websites use multiple methods to track your online behavior, build profiles, and serve targeted advertising.

### Tracking Methods

Cookies:
- Small text files stored by browser
- Remember login status, preferences, cart items
- Track browsing across sites
- Can persist for years

Third-Party Cookies:
- Set by domains other than site you''re visiting
- Ad networks and analytics
- Track across multiple websites
- Building comprehensive profile

First-Party Cookies:
- Set by website you''re visiting
- Necessary for functionality
- Less privacy concern
- Still track behavior on that site

Tracking Pixels:
- Invisible 1x1 images
- Load from tracking server
- Record page views
- Work even with cookies disabled

Browser Fingerprinting:
- Unique configuration identification
- Screen resolution, fonts, plugins
- No cookies needed
- Difficult to prevent
- Nearly unique identifier

Session Replay:
- Records mouse movements, clicks, scrolling
- Replays your session
- Sees everything you see
- May capture sensitive data

## What Data is Collected

### Basic Tracking

Every Page Load Records:
- URL visited
- Time and date
- IP address (location)
- Referrer (previous page)
- User agent (browser, OS, device)
- Screen resolution
- Language settings

### Behavioral Data

Activity Tracking:
- Pages visited
- Time on each page
- Links clicked
- Videos watched
- Forms filled (sometimes even unsubmitted)
- Mouse movements
- Scroll depth
- Purchases and cart abandonment

### Personal Data

Information Gathered:
- Name, email, phone
- Physical address
- Purchase history
- Search queries
- Interests and preferences
- Social connections
- Financial information

## Who is Tracking You

### Advertising Networks

Major Players:
- Google Ads / DoubleClick
- Facebook Pixel
- Amazon Advertising
- Microsoft Advertising

How They Work:
- Track across thousands of sites
- Build detailed profiles
- Match browsing to identity
- Target ads based on behavior
- Share data with partners

### Analytics Services

Google Analytics:
- On 85% of websites
- Tracks visitor behavior
- Records page views, time, paths
- Builds aggregate data
- Identifies individual users

Other Analytics:
- Adobe Analytics
- Matomo
- Mixpanel
- Custom analytics

### Social Media Trackers

Facebook Pixel:
- Embedded on millions of sites
- Tracks non-Facebook users
- Records browsing behavior
- Targets ads on Facebook
- Builds shadow profiles

Social Login Buttons:
- "Login with Google/Facebook"
- Track even if you don''t click
- Know you visited the page
- Associate with social profile

Share Buttons:
- "Share on Twitter/Facebook"
- Tracking beacon even unused
- Reports page visits
- Links to social identity

### Data Brokers

Commercial Data Collection:
- Buy data from multiple sources
- Combine online and offline data
- Create comprehensive profiles
- Sell to advertisers and others
- Little transparency or control

Information They Have:
- Shopping history
- Location history
- Financial information
- Health interests
- Political views
- Family composition
- Education and employment

## How Tracking Affects You

### Privacy Invasion

Loss of Anonymity:
- Browsing history recorded
- Associated with identity
- Shared with third parties
- Permanent records
- No statute of limitations

Profile Building:
- Interests and preferences
- Political views
- Health concerns
- Financial status
- Personal relationships
- Used for targeting

### Targeted Advertising

How It Works:
- Visit product page
- Ad network records interest
- Follow you across internet
- Show ads for that product everywhere
- Continue for weeks or months

Micro-Targeting:
- Demographic targeting
- Behavioral targeting
- Contextual targeting
- Retargeting
- Lookalike audiences

### Price Discrimination

Dynamic Pricing:
- Different prices for different users
- Based on browsing history
- Location affects pricing
- Device affects pricing (Mac vs PC)
- Time of day variations

### Filter Bubbles

Personalization Effects:
- See content matching your views
- Reinforces existing beliefs
- Limits exposure to diverse perspectives
- Creates echo chambers
- Affects news and information access

### Security Risks

Data Breach Exposure:
- Tracking data in breaches
- Browsing history revealed
- Personal profiles exposed
- Identity theft risk
- Embarrassing revelations

## Cookies in Detail

### Types of Cookies

Session Cookies:
- Temporary
- Deleted when browser closes
- Essential for functionality
- Less privacy concern

Persistent Cookies:
- Remain after closing browser
- Last days, months, or years
- Track over long periods
- Greater privacy impact

Essential Cookies:
- Required for site function
- Login status
- Shopping cart
- User preferences
- Can''t opt out

Non-Essential Cookies:
- Analytics
- Advertising
- Social media
- Can opt out (GDPR)

### Cookie Consent

GDPR Requirements (Europe):
- Must request consent
- Opt-in for non-essential
- Easy to refuse
- Clear information
- Withdraw consent anytime

Reality:
- "Cookie walls" blocking access
- Dark patterns to encourage acceptance
- "Accept all" more prominent than "Reject"
- Deceptive language
- Difficult to refuse

### Supercookies

Zombie Cookies:
- Respawn when deleted
- Stored in multiple locations
- Flash cookies, ETags
- Difficult to remove

Browser Fingerprinting:
- Doesn''t use cookies at all
- Based on browser configuration
- Nearly unique identifier
- Can''t be deleted
- Difficult to prevent

## Privacy Protection Strategies

### Browser Settings

Cookie Settings:
- Block third-party cookies
- Clear cookies on exit
- Limit cookie lifespan
- Whitelist trusted sites

Do Not Track:
- Browser setting
- Requests sites don''t track
- Widely ignored
- Not legally binding
- Better than nothing

### Private Browsing Mode

Incognito/Private Mode:
- Doesn''t save history
- Deletes cookies after closing
- Doesn''t save passwords
- Still trackable by websites
- IP address still visible
- Not truly anonymous

What It Doesn''t Do:
- Hide browsing from ISP
- Hide from websites
- Prevent tracking
- Make you anonymous
- Protect on public WiFi

### Browser Extensions

Privacy Tools:
- uBlock Origin: Blocks trackers and ads
- Privacy Badger: Learns and blocks trackers
- DuckDuckGo Privacy Essentials
- HTTPS Everywhere
- Cookie AutoDelete

How They Help:
- Block tracking scripts
- Delete cookies automatically
- Enforce HTTPS
- Show who''s tracking
- Easy on/off control

### VPN Services

What VPNs Do:
- Hide IP address from websites
- Encrypt traffic from ISP
- Appear to browse from different location
- Protect on public WiFi

What VPNs Don''t Do:
- Stop cookie tracking
- Prevent fingerprinting
- Make you anonymous online
- Hide from websites with account login

### Alternative Browsers

Privacy-Focused Browsers:
- Brave: Built-in ad/tracker blocking
- Firefox: Strong privacy features
- Tor Browser: Maximum anonymity (but slow)
- DuckDuckGo Browser (mobile)

Privacy vs Convenience:
- More privacy = more effort
- May break some websites
- Fewer features
- Slower performance
- Worth it for many users

## Best Practices

### Daily Habits

Limit Tracking:
- Block third-party cookies
- Use privacy extensions
- Clear cookies regularly
- Use private browsing for sensitive topics
- Log out of accounts when not needed

### Account Management

Reduce Data Collection:
- Review privacy settings
- Opt out of personalization
- Limit ad targeting
- Don''t link accounts
- Use separate email for online accounts

### Search Engines

Private Search:
- DuckDuckGo: No tracking
- Startpage: Google results, no tracking
- Brave Search
- Avoid Google for sensitive searches

### Social Media

Limit Social Tracking:
- Log out when not using
- Don''t stay logged in constantly
- Limit app permissions
- Don''t use social login
- Consider separate browser for social media

## Your Rights

### GDPR (Europe)

Rights Include:
- Right to know what data collected
- Right to access your data
- Right to delete data
- Right to data portability
- Right to opt out

### CCPA (California)

Consumer Rights:
- Know what data collected
- Know if data sold
- Opt out of sale
- Request deletion
- Non-discrimination

### Exercising Rights

How to Request:
- Website privacy pages
- "Do Not Sell My Information" links
- Data access requests
- Deletion requests
- May require identity verification

## Key Takeaways

- Websites track your behavior across the internet
- Cookies, pixels, and fingerprinting enable tracking
- Data used for advertising, pricing, and profiling
- Third-party trackers follow you across sites
- Browser settings and extensions provide protection
- Private browsing limits but doesn''t eliminate tracking
- VPNs hide IP but don''t stop all tracking
- Regular cookie clearing helps privacy
- Privacy-focused browsers offer better protection
- You have rights under GDPR and CCPA to control data', 'https://www.youtube.com/watch?v=KMtrY6lbjcY', 3, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.779', '2026-01-19 11:42:54.628', '0b906317-2666-4041-83fd-dea327795ee1');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('d270d6a8-2e09-4202-a254-d1e34034014d', 'Post-Incident Review', '# Post-Incident Review and Lessons Learned

## What is a Post-Incident Review?

A structured meeting held after resolving a security incident to analyze what happened, what went well, what didn''t, and how to improve.

Also called: Lessons Learned, After Action Review, Retrospective

## Why Post-Incident Reviews Matter

Benefits:
- Prevent future incidents
- Improve incident response process
- Identify security gaps
- Document institutional knowledge
- Meet compliance requirements
- Build team cohesion

**Most important:** Organizations that skip this step repeat the same mistakes.

## When to Conduct Review

Timing:
- Schedule within 1-2 weeks of incident resolution
- Soon enough that details are fresh
- Late enough that emotions have cooled
- After immediate crisis is over

All Incidents:
- Major incidents (definitely)
- Medium incidents (recommended)
- Minor incidents (if patterns emerge)

## Who Should Attend

Required Participants:
- Incident response team
- Security operations
- IT operations
- System owners
- Management (appropriate level)

Optional:
- Legal counsel
- PR/Communications
- External consultants
- Third-party vendors

## Review Agenda

### 1. Incident Summary (5-10 min)

Brief overview:
- What happened?
- When was it detected?
- What systems were affected?
- What data was impacted?

Keep factual, not judgmental.

### 2. Timeline Review (15-20 min)

Walk through chronologically:
- Initial compromise
- Dwell time (time before detection)
- Detection point
- Response actions
- Containment achieved
- Recovery completed

Identify key decision points.

### 3. What Went Well (10-15 min)

Positive aspects:
- What processes worked?
- Which tools were effective?
- Who performed excellently?
- What decisions were correct?

Important: Recognize successes, not just failures.

### 4. What Went Wrong (15-20 min)

Problems encountered:
- Detection delays
- Communication breakdowns
- Tool failures
- Knowledge gaps
- Process issues

Blameless: Focus on systems, not individuals.

### 5. Root Cause Analysis (10-15 min)

**5 Whys Technique:**
- Why did the incident occur?
  - Phishing email was successful
- Why was it successful?
  - User clicked and entered credentials
- Why did user fall for it?
  - Email looked legitimate, no training
- Why no training?
  - No security awareness program
- Why no program?
  - No budget allocated

**Root cause:** Lack of security awareness investment

### 6. Action Items (15-20 min)

Specific, actionable improvements:
- Technical fixes
- Process changes
- Training needs
- Tool purchases
- Policy updates

Each action item needs:
- Clear description
- Owner assigned
- Due date
- Success criteria

### 7. Follow-up Plan (5 min)

- Who will track action items?
- When to review progress?
- How to measure success?

## Blameless Culture

Critical Principle: Focus on systems, not people.

**Bad Approach:**
- "Bob clicked the phishing email"
- "Sarah failed to detect the intrusion"
- "IT didn''t patch the server"

**Good Approach:**
- "Our email filtering didn''t catch this attack"
- "Detection tools lack visibility into this technique"
- "Patch management process needs improvement"

Why Blameless:
- Encourages honesty
- Surfaces real problems
- Retains talented staff
- Fosters learning culture

## Sample Action Items

**Technical Controls:**
- Implement EDR on all endpoints (Owner: IT, Due: 60 days)
- Enable MFA for all accounts (Owner: Security, Due: 30 days)
- Deploy email sandbox (Owner: Email Admin, Due: 90 days)

**Process Improvements:**
- Create incident response playbook (Owner: IR Team, Due: 45 days)
- Establish on-call rotation (Owner: Manager, Due: 30 days)
- Document escalation procedures (Owner: Security, Due: 30 days)

**Training:**
- Conduct phishing simulation (Owner: Security Awareness, Due: 60 days)
- IR team tabletop exercise (Owner: IR Lead, Due: 90 days)
- Executive cyber crisis simulation (Owner: CISO, Due: 120 days)

## Metrics to Track

**Detection Metrics:**
- Dwell time (time from compromise to detection)
- Mean time to detect (MTTD)
- Detection source (tool, user report, vendor)

**Response Metrics:**
- Mean time to respond (MTTR)
- Mean time to contain (MTTC)
- Mean time to recover (MTTR)

**Impact Metrics:**
- Systems affected
- Data compromised
- Downtime duration
- Financial cost

Track over time: Are we improving?

## Documentation

Create Written Report:

**Executive Summary:**
- High-level overview
- Business impact
- Key findings
- Critical actions

**Technical Details:**
- Complete timeline
- Indicators of compromise
- Attack methodology
- Affected systems

**Lessons Learned:**
- What worked
- What didn''t
- Root causes
- Action items with owners and dates

**Appendices:**
- Logs and evidence
- IOCs
- Communications
- External reports

Distribute to:
- Incident response team
- Management
- Compliance (if required)
- Board (for major incidents)

Protect as privileged: Legal/attorney-client privilege

## Tracking Action Items

**Dashboard:**
- List all action items
- Current status (not started, in progress, complete)
- Owner, due date, priority

**Regular Review:**
- Weekly check-ins for critical items
- Monthly review of all items
- Escalate overdue items

**Measure Success:**
- Track completion rate
- Verify effectiveness (did it solve the problem?)
- Adjust approach if needed

## Common Pitfalls

**Pitfall 1: Skipping the Review**
- "Too busy"
- "Everyone knows what happened"
- Result: Repeat incidents

**Pitfall 2: Blame Game**
- Focuses on person, not system
- Discourages honesty
- People hide problems

**Pitfall 3: No Follow-Through**
- Create action items
- Never implement them
- Same problems recur

**Pitfall 4: Too High-Level**
- "We need better security"
- Not actionable
- No one takes ownership

**Pitfall 5: Analysis Paralysis**
- Endless discussion
- No conclusions
- No action items

## Key Takeaways

- Conduct post-incident review within 1-2 weeks of resolution
- Blameless culture - focus on systems, not people
- Review what went well AND what went wrong
- Use 5 Whys technique for root cause analysis
- Create specific, actionable improvements with owners and due dates
- Track action items to completion
- Document findings in written report
- Measure key metrics (MTTD, MTTR, MTTC) to track improvement
- Include technical, process, and training action items
- Review is required for major incidents, recommended for all
- Don''t skip this step - organizations that don''t learn from incidents repeat them', 'https://www.youtube.com/watch?v=cUrjcCxWoIc', 8, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.813', '2026-01-19 11:42:54.664', '922e8060-e5bc-423b-b208-e2edf1425cbe');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('fe0399bb-e87d-4b82-aad5-7e7edebd4ae8', 'Security-Aware Culture', '# Building a Security-Aware Culture

## What is Security-Aware Culture?

A security-aware culture is an organizational environment where cybersecurity is everyone''s responsibility, security best practices are ingrained in daily operations, and employees naturally consider security implications in their decisions.

Not just: Compliance with policies
Instead: Internalized security mindset

## Why Culture Matters

### Technical Controls Alone Aren''t Enough

Best firewall in the world can''t stop:
- Employee clicking phishing link
- Insider using weak passwords
- Staff ignoring security warnings
- Users bypassing security controls

**Human element** is the weakest link.

### Culture Creates Resilience

Strong security culture results in:
- Fewer successful attacks
- Faster incident detection
- Better incident response
- Reduced business risk
- Improved compliance

**Study finding:** Organizations with strong security culture experience 50% fewer security incidents.

### Security is Everyone''s Job

Traditional view:
- Security = IT security team''s job
- Others just follow rules

Modern reality:
- Every employee is a potential target
- Every action has security implications
- Collective responsibility for protection

## Elements of Security-Aware Culture

### 1. Leadership Commitment

**Tone from the Top:**
Security culture starts with executives:
- CEO discusses security publicly
- Board oversight of cybersecurity
- Security included in strategic planning
- Budget allocated appropriately

**Executive Actions:**
- Follow same security policies as employees
- Participate in security training
- No exemptions for C-suite
- Model secure behaviors

**Visible Support:**
- Security team reports to executive level
- CISO has board access
- Security failures addressed seriously
- Security successes celebrated

### 2. Clear Policies and Expectations

**Well-Defined Policies:**
- Written, accessible, understandable
- Regularly updated
- Explains "why" not just "what"
- Available in multiple languages

**Reasonable Requirements:**
- Balance security with usability
- Consider employee workflow
- Provide necessary tools
- Explain business rationale

**Consistent Enforcement:**
- Same rules for everyone
- Violations addressed fairly
- No special exemptions
- Regular compliance audits

### 3. Continuous Education

**Beyond Annual Training:**
- Ongoing awareness campaigns
- Monthly security tips
- Real-time alerts about current threats
- Lunch-and-learn sessions

**Engaging Content:**
- Interactive, not boring slideshows
- Real-world examples
- Relevant to job roles
- Gamification elements

**Role-Specific Training:**
- Finance: BEC, invoice fraud
- HR: PII protection, social engineering
- Developers: Secure coding
- Executives: Whaling attacks

### 4. Open Communication

**Report Without Fear:**
- Blameless incident reporting
- "See something, say something"
- Mistakes are learning opportunities
- No punishment for falling for phishing simulation

**Two-Way Dialogue:**
- Employees can question policies
- Feedback improves security
- Security team accessible
- Regular town halls on security

**Transparency:**
- Share threat intelligence
- Explain why policies exist
- Communicate incidents appropriately
- Celebrate security wins

### 5. Positive Reinforcement

**Reward Secure Behavior:**
- Recognize employees who report phishing
- Certificates for training completion
- Gamification (security champions)
- Public acknowledgment

**Make Security Easy:**
- Provide password managers
- Single sign-on reduces password fatigue
- Security tools that don''t hinder productivity
- Clear processes for secure actions

**Celebrate Success:**
- Share blocked attack stories
- Highlight employee vigilance
- Team recognition for improvements
- Security awareness month events

## Building Security Culture: Step-by-Step

### Phase 1: Assessment (Month 1-2)

**Understand Current State:**
- Employee surveys on security awareness
- Phishing simulation baseline
- Policy compliance audit
- Incident analysis (root causes)

**Identify Gaps:**
- Knowledge gaps (what employees don''t know)
- Behavioral gaps (what they know but don''t do)
- Tool gaps (missing security tools)
- Policy gaps (outdated or missing policies)

**Benchmark:**
- Industry standards
- Peer organizations
- Best practices frameworks

### Phase 2: Foundation (Month 3-6)

**Leadership Buy-In:**
- Present business case to executives
- Demonstrate ROI of security culture
- Get budget commitment
- Establish governance

**Policy Refresh:**
- Update outdated policies
- Simplify language
- Add "why" explanations
- Ensure accessibility

**Initial Training:**
- Mandatory security awareness for all
- Role-specific training
- Phishing simulations begin
- Baseline metrics established

### Phase 3: Engagement (Month 7-12)

**Awareness Campaigns:**
- Monthly security themes
- Posters, emails, intranet articles
- Contests and challenges
- Security champions program

**Regular Communication:**
- Weekly security tips
- Threat alerts
- Success stories
- Lessons learned from incidents

**Make It Personal:**
- Home cybersecurity tips
- Protect families online
- Personal device security
- Build security habit at home and work

### Phase 4: Reinforcement (Ongoing)

**Continuous Improvement:**
- Quarterly assessments
- Refine based on metrics
- Update for new threats
- Evolve policies as needed

**Recognition Programs:**
- Monthly security champion
- Team competitions
- Peer recognition
- Executive acknowledgment

**Measure Progress:**
- Phishing click rates declining
- Increased incident reporting
- Faster threat detection
- Reduced policy violations

## Common Challenges and Solutions

### Challenge 1: "Security is Inconvenient"

**Problem:** Employees bypass security because it slows them down.

**Solutions:**
- Make security tools easy to use
- Single sign-on reduces password burden
- Password managers provided
- Streamline approval processes
- Explain trade-offs honestly

### Challenge 2: "It Won''t Happen to Us"

**Problem:** Employees don''t believe they''re at risk.

**Solutions:**
- Share real attack attempts on your organization
- Industry-specific examples
- Local news stories
- Personalized threat modeling
- Demonstrate how easy attacks are

### Challenge 3: "I''m Too Busy"

**Problem:** Security training seen as waste of time.

**Solutions:**
- Short, bite-sized training (5-10 minutes)
- Just-in-time learning
- Integrate into existing workflows
- Demonstrate time saved preventing incidents
- Make training engaging, not tedious

### Challenge 4: "IT''s Job, Not Mine"

**Problem:** Employees don''t feel responsible.

**Solutions:**
- "Everyone is a security professional"
- Share stories of employee-caught threats
- Explain individual impact
- Personal stake (protect own data too)
- Empower with simple actions

### Challenge 5: "Policies Are Unclear"

**Problem:** Employees don''t understand requirements.

**Solutions:**
- Plain language policies
- Visual guides and infographics
- FAQs and examples
- Easily accessible
- Help desk support

## Measuring Security Culture

### Quantitative Metrics

**Phishing Simulations:**
- Click rate trending down
- Reporting rate trending up
- Time to report decreasing

**Incident Metrics:**
- User-reported incidents increasing (good)
- Successful attacks decreasing (good)
- Time to detect decreasing
- Dwell time decreasing

**Training Metrics:**
- Completion rates
- Assessment scores
- Time to complete
- Engagement (clicks, questions)

**Policy Compliance:**
- MFA adoption rate
- Password manager usage
- Timely software updates
- Policy acknowledgment rates

### Qualitative Metrics

**Surveys:**
- "Do you know how to report suspicious emails?"
- "Do you feel security is important to leadership?"
- "Do you have the tools you need to work securely?"

**Interviews:**
- Focus groups with employees
- Exit interviews (security mentioned?)
- Security champion feedback

**Observations:**
- Clean desk policy compliance
- Locked screens when away
- Secure disposal practices
- Visitor escort compliance

## Security Champions Program

### What Are Security Champions?

Volunteers from business units who:
- Advocate for security in their teams
- Act as liaison to security team
- Provide feedback on policies
- Help with awareness campaigns

**Not:** Additional IT security staff
**Instead:** Culturally embedded advocates

### Benefits

**For Organization:**
- Security representation in every team
- Faster policy rollout
- Better policy design (real-world input)
- Increased awareness

**For Champions:**
- Career development
- Security knowledge
- Leadership opportunity
- Resume builder

### Implementing Champions Program

**Selection:**
- Volunteers from each department
- Mix of roles and seniority
- Passionate about security
- Good communicators

**Training:**
- Extended security training
- Regular briefings on threats
- Policy development input
- Incident response basics

**Support:**
- Regular meetings
- Direct line to security team
- Resources for awareness
- Recognition from leadership

**Activities:**
- Run team training sessions
- Share security tips
- Review policies for usability
- Participate in incident response
- Plan Security Awareness Month

## Making Security Part of Daily Life

### Integration Points

**New Employee Onboarding:**
- Day 1: Security training
- Week 1: MFA setup, password manager
- Month 1: Role-specific training
- Ongoing: Security champion introduction

**Regular Touchpoints:**
- Monday: Security tip in company newsletter
- Monthly: All-hands security update
- Quarterly: Executive security briefing
- Annually: Security Awareness Month

**Process Integration:**
- Code reviews include security checks
- Product launches include security review
- Vendor onboarding includes security assessment
- Change management includes security impact

### Physical Environment

**Visible Reminders:**
- Posters in common areas
- Screensavers with security tips
- Badge holders with tips
- Conference room reminders
- Bathroom stall posters (captive audience!)

**Secure Design:**
- Visitor badges clearly marked
- Locked doors where appropriate
- Clean desk policy visual cues
- Shred bins conveniently located
- Password manager shortcuts on desktops

## Key Takeaways

- Security culture means everyone naturally considers security, not just follows rules
- Culture starts from top - executives must visibly support and follow security policies
- Technical controls alone fail without strong security culture
- Organizations with strong security culture have 50% fewer incidents
- No punishment for mistakes - blameless reporting encourages vigilance
- Make security easy - provide tools like password managers, SSO
- Continuous education better than annual training - monthly tips and updates
- Security champions in each team embed security throughout organization
- Measure culture with phishing click rates, incident reporting, and surveys
- Positive reinforcement - recognize and reward secure behavior
- Balance security with usability - unreasonable policies get bypassed
- Takes 12-18 months to establish strong security culture
- Security is everyone''s job, not just IT security team', 'https://www.youtube.com/watch?v=qwFnVqQfkQI', 5, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.765', '2026-01-19 11:42:54.676', '96406223-7051-43d7-901a-55878daeba07');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('75638a90-c2f1-4c3e-8b06-75fc0f2b2990', 'Building Phishing Resistance', '# Building Phishing Resistance

## What is Phishing Resistance?

**Definition**: The ability to consistently recognize and avoid phishing attacks through a combination of knowledge, habits, technical controls, and organizational culture.

**Not just one skill**: A layered approach combining:
- Technical knowledge
- Critical thinking habits
- Security tools
- Organizational support
- Continuous awareness

**Goal**: Make phishing attacks fail even when sophisticated or targeted

## The Psychology of Phishing Resistance

### Why Humans Fall for Phishing

**Psychological triggers exploited**:

1. **Authority**: We''re trained to obey authority figures
2. **Urgency**: Time pressure bypasses critical thinking
3. **Fear**: Threat of negative consequences impairs judgment
4. **Curiosity**: We want to know what the message says
5. **Greed**: Offers that seem too good to pass up
6. **Trust**: We trust familiar brands and people
7. **Helpfulness**: We want to help others
8. **Social proof**: "Everyone else is doing this"

**Reality**: Phishing succeeds by exploiting normal human psychology

### Building Mental Resistance

**Cognitive strategies**:

1. **Default skepticism**
   - Question unexpected communications
   - "Why am I receiving this now?"
   - "Does this make sense?"

2. **Slow down**
   - Urgency is manufactured
   - Legitimate situations allow verification time
   - Take 30 seconds to think

3. **Recognize emotional manipulation**
   - Notice when you feel fear, urgency, or excitement
   - Pause when emotions triggered
   - Emotion = potential manipulation

4. **Pattern recognition**
   - Learn common phishing patterns
   - Notice what doesn''t fit
   - Trust your instincts

## Technical Foundation

### Email Security

**Email filtering**:

1. **Strong spam filter**
   - Gmail, Outlook have good filtering
   - Enterprise solutions (Proofpoint, Mimecast)
   - Regularly update filter rules

2. **Authentication checks**
   - SPF (Sender Policy Framework)
   - DKIM (DomainKeys Identified Mail)
   - DMARC (Domain-based Message Authentication)
   - These verify sender legitimacy

3. **Banner warnings**
   - "External email" warnings
   - "Unusual sender" alerts
   - Color-coded indicators

**Email client settings**:

1. **Display full headers**
   - See actual sender address
   - Check routing information
   - Verify source

2. **Disable automatic image loading**
   - Prevents tracking pixels
   - Blocks malicious images
   - Manual load when safe

3. **Plain text option**
   - View email as plain text
   - Reveals hidden links
   - Easier to spot anomalies

### Browser Protection

**Essential tools**:

1. **Modern, updated browser**
   - Chrome, Firefox, Edge, Safari
   - Automatic updates enabled
   - Latest security patches

2. **Phishing protection**
   - Safe Browsing (Chrome)
   - SmartScreen (Edge)
   - Fraudulent site warnings (Firefox, Safari)

3. **Password manager with phishing protection**
   - Won''t autofill on fake sites
   - Only fills on legitimate domains
   - Strong indicator of legitimate vs. fake site

**Browser extensions**:

1. **Link checker**
   - Shows link destinations on hover
   - Expands shortened URLs
   - Warns about suspicious destinations

2. **Ad blocker**
   - Blocks malvertising
   - Reduces phishing ad exposure

### Multi-Factor Authentication (MFA)

**Critical defense**:

**Why it matters**:
- Even if phished, attacker can''t access account
- Requires second factor (phone, app, hardware key)
- Dramatically reduces successful phishing impact

**MFA types** (from most to least secure):

1. **Hardware security keys (BEST)**
   - YubiKey, Google Titan
   - Phishing-resistant (won''t work on fake sites)
   - Physical device required

2. **Authenticator apps**
   - Google Authenticator, Authy, Microsoft Authenticator
   - Time-based codes
   - Better than SMS

3. **Push notifications**
   - Approve on phone
   - Convenient
   - Risk: approval fatigue

4. **SMS codes** (WEAKEST)
   - Better than nothing
   - Vulnerable to SIM swapping
   - Use only if nothing else available

**Enable MFA on**:
- Email accounts (CRITICAL)
- Financial accounts
- Work accounts
- Social media
- Any account with sensitive data

### Additional Technical Tools

1. **Virtual Private Network (VPN)**
   - Encrypts traffic
   - Hides IP address
   - Protects on public Wi-Fi

2. **DNS filtering**
   - Blocks known malicious domains
   - Stops phishing sites at DNS level
   - OpenDNS, Quad9, Cloudflare

3. **Antivirus with web protection**
   - Blocks malicious sites
   - Scans downloads
   - Real-time protection

## Behavioral Habits

### Email Verification Routine

**Before clicking any link or downloading attachment**:

1. **Check sender address**
   - Hover over name to see actual address
   - Look for typosquatting
   - Verify domain matches claimed organization

2. **Inspect links before clicking**
   - Hover to see destination
   - Look for mismatched URLs
   - Check for suspicious domains

3. **Question unexpected emails**
   - Did you expect this?
   - Is the request normal?
   - Does tone/format match usual communications?

4. **Verify through independent channel**
   - Call using known phone number
   - Log into account directly (don''t click link)
   - Contact sender through different method

### Safe Link Practices

**Golden rule**: When in doubt, type it yourself

**Instead of clicking email links**:
1. Open browser
2. Type known URL directly (or use bookmark)
3. Navigate to relevant section
4. Verify information there

**For unknown links**:
1. Use link checker (urlscan.io, VirusTotal)
2. Check where it goes
3. Look up organization directly

**Never click**:
- Links in unexpected emails
- Shortened URLs from unknown sources
- Links requesting password or payment info
- Links in emails claiming account problems

### Attachment Safety

**Default stance**: Don''t open unexpected attachments

**Before opening any attachment**:

1. **Verify sender legitimacy**
   - Confirm they actually sent it
   - Call or message through known channel

2. **Check file type**
   - Be extra cautious: .exe, .zip, .scr, .js, .vbs
   - Office files can have malicious macros
   - PDFs can have malicious scripts

3. **Scan with antivirus**
   - Save to disk first
   - Scan before opening

4. **Use sandbox if available**
   - Open in isolated environment
   - Virtual machine
   - Cloud-based sandbox

**Red flag attachments**:
- Unexpected invoices
- "You have to see this!" attachments
- Attachments claiming to be from shipping companies
- Password-protected archives (to evade scanning)

### Password Practices

**Supporting phishing resistance**:

1. **Unique passwords per site**
   - Password manager essential
   - Breach doesn''t affect other accounts

2. **Long, strong passwords**
   - 16+ characters
   - Mix of character types
   - Use password manager to generate

3. **Never reuse passwords**
   - Especially email and banking
   - Reuse = single phishing attack compromises everything

4. **Change compromised passwords immediately**
   - All accounts with same password
   - Enable MFA if not already active

### Mobile-Specific Habits

**Unique mobile risks**:
- Smaller screens (harder to inspect)
- Touch interface (easier to misclick)
- More urgent feel
- Less security visibility

**Mobile best practices**:

1. **Be extra cautious**
   - Can''t hover to see link destinations
   - Harder to verify sender addresses

2. **Don''t click links on mobile**
   - Open browser separately
   - Type URL or use app

3. **Use official apps**
   - Bank app vs. mobile browser
   - Apps harder to phish

4. **Long-press links**
   - Shows destination on mobile
   - Check before opening

## Organizational Phishing Resistance

### Company-Level Defenses

**Technical controls**:

1. **Email authentication**
   - SPF, DKIM, DMARC implemented
   - Reject unauthenticated email
   - Display warnings on external email

2. **Advanced filtering**
   - AI-based phishing detection
   - Link sandboxing
   - Attachment scanning
   - Impersonation protection

3. **Web filtering**
   - Block known phishing sites
   - Category-based filtering
   - Real-time threat intelligence

4. **Endpoint protection**
   - Antivirus on all devices
   - Exploit protection
   - Application control

**Policy controls**:

1. **Clear security policies**
   - What to do with suspicious emails
   - How to report incidents
   - No blame for reporting
   - Consequences for ignoring policy

2. **Verification procedures**
   - Financial transactions require callback
   - Password resets follow strict process
   - Vendor changes verified through known contacts

3. **Incident response plan**
   - Clear steps if phished
   - Rapid containment procedures
   - Communication protocols

### Training and Awareness

**Effective training elements**:

1. **Regular, ongoing training**
   - Not just annual
   - Monthly or quarterly
   - Fresh examples and techniques

2. **Realistic simulations**
   - Simulated phishing tests
   - No punishment for falling for tests
   - Immediate learning opportunity

3. **Positive reinforcement**
   - Recognize employees who report phishing
   - Celebrate security awareness wins
   - Make security positive, not punitive

4. **Varied content**
   - Different phishing types
   - Various difficulty levels
   - Department-specific scenarios

5. **Measurement and improvement**
   - Track click rates over time
   - Identify high-risk groups
   - Tailored additional training

**Training mistakes to avoid**:
- "Gotcha" approach (breeds resentment)
- Only annual training (people forget)
- Punishment for failures (discourages reporting)
- Boring, generic content (people tune out)

### Security Culture

**Building resistance organization-wide**:

1. **Make security everyone''s job**
   - Not just IT''s responsibility
   - Each person is part of defense
   - Collective responsibility

2. **Encourage reporting**
   - Easy reporting mechanism
   - Praise those who report
   - No blame for clicking (if reported)

3. **Share information**
   - Alert everyone to new campaigns
   - Discuss real attempts
   - Learn collectively

4. **Leadership modeling**
   - Executives follow security practices
   - No special exemptions
   - Visible commitment to security

## Continuous Improvement

### Staying Current

**Phishing evolves constantly**:

1. **Follow security news**
   - Krebs on Security
   - The Hacker News
   - Bleeping Computer
   - Security company blogs

2. **Subscribe to alerts**
   - US-CERT
   - Industry-specific ISACs
   - Security vendor bulletins

3. **Participate in community**
   - Security forums
   - Professional groups
   - Share experiences

4. **Review real attempts**
   - Analyze phishing you receive
   - Learn new techniques
   - Share with colleagues

### Measuring Your Resistance

**Personal assessment**:

**Questions to ask**:
- Do I verify unexpected requests?
- Do I use MFA on critical accounts?
- Do I check sender addresses?
- Do I hover before clicking?
- Do I use unique passwords?
- Do I report suspicious emails?
- Do I stay informed about threats?

**Track your progress**:
- How many phishing emails do you catch?
- How often do you verify?
- Are you creating better habits?

### Learning from Mistakes

**If you click a phishing link or provide information**:

1. **Don''t panic**
   - Mistakes happen
   - Rapid response limits damage

2. **Act immediately**
   - Report to IT security
   - Change passwords
   - Monitor accounts

3. **Learn from experience**
   - What made it convincing?
   - What signs did you miss?
   - How can you avoid next time?

4. **Share learnings**
   - Help others avoid same mistake
   - Contribute to collective knowledge

## Advanced Phishing Types

### Spear Phishing

**Characteristics**:
- Targeted at specific individual
- Uses personal information
- Highly convincing
- Often work-related

**Resistance strategies**:
- Limit public information
- Be extra cautious with personalized emails
- Always verify through known channels
- Question even plausible scenarios

### Whaling

**Definition**: Phishing targeting executives

**Why dangerous**:
- Executives have high-value access
- Busy, less likely to scrutinize
- Authority makes it hard to question

**Resistance**:
- Executive assistants trained to verify
- Callback procedures for financial requests
- Extra layers for sensitive actions

### Business Email Compromise (BEC)

**Scenario**: Email appears from CEO requesting wire transfer

**Resistance**:
- Always verify financial requests
- Callback on known number
- Multi-person approval for transfers
- Out-of-band verification

### Clone Phishing

**Attack**: Legitimate email resent with malicious link/attachment

**Resistance**:
- Verify resent messages
- Check if slight differences from original
- Question "resend" requests

## Emergency Response

### If You''ve Been Phished

**Immediate actions (first 15 minutes)**:

1. **Disconnect from network** (if malware suspected)

2. **Report to IT security immediately**
   - Time is critical
   - IT can contain spread
   - Alert others

3. **Change passwords** (from clean device)
   - Compromised account
   - Email account
   - Accounts with same password

4. **Document everything**
   - Screenshots of phishing email
   - What information was provided
   - What links were clicked
   - Timeline of events

**Next steps (first hour)**:

5. **Monitor accounts**
   - Check for unauthorized access
   - Review recent activity
   - Look for changes to settings

6. **Enable/check MFA**
   - Activate if not enabled
   - Check for added devices/apps
   - Remove unauthorized access

7. **Run security scans**
   - Full antivirus scan
   - Anti-malware scan
   - Check for persistence

**Following days/weeks**:

8. **Monitor for fraud**
   - Bank statements
   - Credit reports
   - Account activities

9. **Consider credit freeze** (if sensitive info exposed)

10. **Stay alert for follow-up attacks**
    - Attackers may try again
    - May use stolen information for further phishing

## Key Takeaways

- Phishing resistance requires layered approach: knowledge + habits + tools + culture
- Enable MFA everywhere possible, especially email - stops most phishing even if credentials stolen
- Use password manager with autofill - won''t fill credentials on fake sites (strong phishing indicator)
- Verify unexpected requests through independent channel - never use contact info from suspicious message
- Slow down when urgent requests arrive - urgency is manufactured to bypass critical thinking
- Hover before clicking - inspect link destinations before clicking any link in email
- Default to skepticism - question unexpected emails even if they look legitimate
- Train regularly with realistic scenarios - annual training insufficient, need continuous exposure
- Report suspicious emails immediately - helps protect others and tracks attack patterns
- No blame culture essential - punishment discourages reporting and learning
- Stay current on phishing techniques - attackers constantly evolve tactics
- Learn from mistakes - if phished, report immediately and use experience to improve defenses', 'https://www.youtube.com/watch?v=OB5L8pVvCZs', 5, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.743', '2026-01-19 11:42:54.693', '8b832b1a-510f-4c2e-9b41-e33e45b0b6fd');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('e6e1a649-e858-4e52-9461-c92fac1da365', 'Spear Phishing Attacks', '# Understanding Spear Phishing and Targeted Attacks

## What is Spear Phishing?

Unlike mass phishing emails sent to thousands, spear phishing is a targeted attack on specific individuals or organizations. These attacks use personalized information to appear highly credible.

## How Spear Phishing Differs from Regular Phishing

### Mass Phishing
- Generic messages sent to thousands
- "Dear Customer"
- Low success rate but high volume
- Easy to spot with generic content

### Spear Phishing
- Customized for specific targets
- Uses your name, job title, colleagues'' names
- High success rate due to personalization
- Much harder to detect

## Common Spear Phishing Tactics

### 1. Research Phase
Attackers gather information from:
- LinkedIn profiles (job title, colleagues, projects)
- Facebook and social media (interests, travel, family)
- Company websites (org structure, recent news)
- Data breaches (leaked emails, passwords)
- Public records

### 2. Personalization Techniques
- Referencing real colleagues or projects
- Mentioning recent company news or events
- Using internal terminology and acronyms
- Timing attacks around known events (performance reviews, tax season)

### 3. Impersonation Strategies
- CEO or executive impersonation (whaling)
- IT department requesting password resets
- HR about payroll or benefits
- Vendors with fake invoices
- Partners requesting urgent wire transfers

## Real-World Examples

### Example 1: The CEO Email Scam

From: CEO John Smith <john.smith@company-mail.com>
To: Finance Manager
Subject: Urgent Wire Transfer Needed

Hi Sarah,

I''m in a meeting with potential investors and need you to
process an urgent wire transfer. We''re acquiring a competitor
and this needs to stay confidential. Can you send $50,000 to
this account immediately? I''ll send the paperwork later.

This is time-sensitive. Please confirm when done.

Thanks,
John

Red Flags:
- Urgency and confidentiality pressure
- Unusual request outside normal procedures
- Request to bypass normal processes
- Slightly off domain name

## How to Defend Against Spear Phishing

### 1. Limit Public Information
- Review social media privacy settings
- Be cautious about posting work details
- Limit information on professional profiles
- Think before sharing location, travel, or project details

### 2. Verify Unusual Requests
- Call the person using a known phone number
- Don''t use contact info from the suspicious email
- Use alternative communication channel
- Verify through official company directory

### 3. Question Everything
- Is this request normal for this person?
- Does the email address match exactly?
- Is the tone and language typical?
- Are they asking me to bypass procedures?

### 4. Look for Subtle Signs
- Slight variations in email addresses
- Unusual phrasing or grammar
- Requests outside normal workflow
- Urgency or pressure tactics

## Key Takeaways

- Spear phishing uses personalized information to appear legitimate
- Attackers do their homework on targets
- Verify unusual requests through independent channels
- Limit the personal and professional information you share publicly
- When in doubt, verify through a phone call using a known number
- Organizations need clear procedures for sensitive requests', NULL, 3, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.74', '2026-01-19 11:42:54.603', '2a41640e-0fca-4c13-8990-41c941c87a9e');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('a39ce021-2c88-41ea-a902-98a53894dde4', 'The Psychology of Phishing', '# Understanding the Psychology Behind Phishing Attacks

## Why Phishing Works

Phishing attacks succeed not because of technical sophistication, but because they exploit fundamental human psychology. Attackers are experts at manipulating emotions and cognitive biases.

## Key Psychological Triggers

### 1. Urgency and Time Pressure
- "Your account will be locked in 2 hours!"
- "Immediate action required to avoid suspension"
- Creates panic that bypasses rational thinking
- Victims act quickly without verifying authenticity

### 2. Authority and Trust
- Impersonating banks, government agencies, or executives
- Using official-looking logos and branding
- Leveraging our tendency to obey authority figures
- "This is from your CEO" or "IRS notice"

### 3. Fear and Consequences
- Threats of account closure or legal action
- "Your account has been compromised"
- "Suspicious activity detected"
- Triggers survival instincts that override caution

### 4. Curiosity and Greed
- "You''ve won a prize!"
- "Click to see who viewed your profile"
- "Exclusive offer just for you"
- Exploits our desire for rewards and information

### 5. Social Proof
- "Everyone in your department has already updated their credentials"
- Fake testimonials and reviews
- Leverages our tendency to follow the crowd

## Cognitive Biases Exploited

### Confirmation Bias
- If you''re expecting a package, shipping notifications seem legitimate
- Attackers time attacks around common events (tax season, holidays)

### Anchoring
- First piece of information sets expectations
- Official-looking header makes everything else seem legitimate

### Scarcity
- "Limited time offer"
- "Only 3 spots remaining"
- Creates sense of urgency and FOMO (fear of missing out)

## How to Resist Psychological Manipulation

### 1. Slow Down
- Take a breath before responding to urgent requests
- If it''s truly urgent, official channels will reach you multiple ways

### 2. Verify Independently
- Don''t use contact info from suspicious messages
- Look up official numbers and call directly
- Check URLs carefully before clicking

### 3. Question Authority
- Even if it looks official, verify through known channels
- Real organizations won''t ask for sensitive info via email

### 4. Trust Your Instincts
- If something feels off, it probably is
- It''s better to verify and be wrong than to ignore and be compromised

## Key Takeaways

- Phishing exploits psychology, not just technology
- Awareness of these tactics makes you more resistant
- Slow, deliberate thinking defeats rushed emotional responses
- When in doubt, verify through independent channels', 'https://www.youtube.com/watch?v=F7pYHN9iC9I', 1, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.735', '2026-01-19 11:42:54.59', 'e4fdd7d8-4f95-48eb-bf78-5f09f2278979');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('435091d1-3b46-4d20-99c7-b145890c2ff9', 'The Human Element', '# The Human Element in Security

## Why Humans Are Often the Weakest Link

Technology can create strong defenses, but humans remain the most vulnerable point in any security system. Understanding this is the first step to strengthening security.

### The Reality
- 95% of cybersecurity breaches are caused by human error
- Social engineering attacks exploit psychology, not technology
- Even security-conscious people make mistakes under pressure
- Awareness alone doesn''t prevent compromise
- Humans have cognitive biases that attackers exploit

## Cognitive Biases Attackers Exploit

### 1. Authority Bias
- We tend to obey authority figures without question
- Attacker impersonates CEO, IT admin, or government official
- Creates pressure to comply quickly
- Example: "This is your CEO, I need this done immediately"

### 2. Urgency and Scarcity
- "Act now or lose access!"
- "Limited time offer - only 3 spots left"
- Creates panic that bypasses rational thinking
- Victims act first, think later

### 3. Social Proof
- "Everyone else has already updated their credentials"
- We follow the crowd, assuming others know what''s right
- Fake testimonials and reviews
- Mass behavior influences individual decisions

### 4. Reciprocity
- When someone does us a favor, we feel obligated to return it
- Attacker offers help or free service
- Victim feels compelled to comply with requests
- Example: "I helped you with IT issue, can you help me access this file?"

### 5. Trust and Familiarity
- We trust people and things that seem familiar
- Official-looking emails, logos, and websites
- Using names of colleagues or familiar services
- Leveraging existing relationships

### 6. Confirmation Bias
- We see what we expect to see
- If expecting a package, delivery notification seems legitimate
- Attackers time attacks around events (tax season, holidays)
- We unconsciously ignore warning signs

## Why Smart People Fall for Attacks

### It''s Not About Intelligence

**Common Misconceptions:**
- "I''m too smart to fall for phishing"
- "Only careless people get hacked"
- "I would never click that"

**Reality:**
- Everyone has cognitive biases
- One distracted moment is all it takes
- Sophisticated attacks fool experts
- Fatigue and stress impair judgment
- Multitasking reduces attention

### Contributing Factors

**Busy Environments:**
- Processing hundreds of emails daily
- Constant interruptions and distractions
- Pressure to respond quickly
- Working outside normal hours

**Workplace Culture:**
- Pressure to be helpful and cooperative
- Fear of questioning authority
- Emphasis on speed over security
- Blame culture discourages reporting

**Technology Overload:**
- Too many systems and passwords
- Alert fatigue from constant notifications
- Complex security procedures
- Conflicting requirements

## Building Human-Centered Security

### 1. Security Awareness Training

Effective Training Characteristics:
- Short, frequent sessions (not annual marathons)
- Relevant, real-world examples
- Interactive and engaging
- Role-specific content
- Continuous reinforcement

What Doesn''t Work:
- Long, boring presentations
- Generic content not relevant to role
- Fear-based messaging
- One-time training
- Compliance checkbox mentality

### 2. Positive Security Culture

Creating the Right Environment:
- Security as shared responsibility
- No blame for honest mistakes
- Encourage questioning and verification
- Celebrate security-conscious behavior
- Make security heroes, not shame failures

Toxic Security Culture:
- Blame and punishment
- "Security vs. productivity" mentality
- Complex, unusable security
- Lack of leadership support
- Ignoring user feedback

### 3. Usable Security

Security Must Be:
- Easy to do the right thing
- Hard to do the wrong thing
- Not significantly slower than insecure alternative
- Well-integrated into workflows
- Designed with users in mind

Examples:
- Password managers > complex password requirements
- Single sign-on > multiple passwords
- Hardware keys > typing codes
- Automatic updates > manual patching

### 4. Just-in-Time Guidance

Provide Help When Needed:
- Contextual security tips
- In-app guidance and warnings
- Clear explanations of why
- Easy way to report suspicious activity
- Fast response to questions

### 5. Psychological Safety

Encourage Reporting:
- No punishment for clicking phishing link
- Quick, non-judgmental response
- Focus on learning, not blame
- Confidential reporting options
- Thank people for reporting

## Stress and Decision-Making

### How Stress Affects Security

Under Stress We:
- Revert to familiar patterns
- Skip verification steps
- Trust authority without question
- Miss warning signs
- Make impulsive decisions

Common Stress Triggers:
- Tight deadlines
- After-hours requests
- Financial pressure
- Fear of consequences
- Personal problems

### Defending Under Stress

Strategies:
- Slow down and breathe
- Follow checklists and procedures
- Verify through alternate channel
- Escalate unusual requests
- It''s okay to say "let me check on that"

## Social Engineering Red Flags

### Communication Red Flags
- Unsolicited contact
- Urgency and pressure
- Too good to be true
- Requests for sensitive information
- Unusual requests from known contacts
- Confidentiality demands
- Bypassing normal procedures

### Behavioral Red Flags
- Reluctance to provide contact details
- Defensiveness when questioned
- Name dropping and authority claims
- Creating emotional responses
- Offering unsolicited help
- Flattery and charm

## Building Resilience

### Individual Level

Develop These Habits:
- Slow down for sensitive requests
- Verify through known channels
- Question unusual requests (even from authority)
- Use strong authentication (MFA)
- Keep systems updated
- Report suspicious activity
- Learn from incidents (yours and others)

### Organizational Level

Essential Elements:
- Regular security training
- Simulated attacks (phishing, vishing)
- Clear reporting procedures
- Fast incident response
- Transparent communication about threats
- User feedback integration
- Continuous improvement

## The Psychology of Reporting

### Why People Don''t Report

Common Reasons:
- Fear of blame or punishment
- Embarrassment at being fooled
- Don''t want to bother IT
- Unsure if it''s really suspicious
- Think they handled it themselves
- Previous negative experiences

### Encouraging Reporting

Make It:
- Easy (one-click reporting)
- Safe (no punishment)
- Fast (quick acknowledgment)
- Valued (thank reporters)
- Educational (feedback on what happened)

## Key Takeaways

- Humans are often the weakest link, but this is fixable
- Everyone has cognitive biases that attackers exploit
- Intelligence doesn''t protect against social engineering
- Security must be usable and integrated into workflows
- Positive culture encourages reporting without fear
- Stress impairs judgment - slow down for important decisions
- Training works best when frequent, relevant, and practical
- Organizations must create psychological safety for security
- Learn from mistakes - they''re opportunities, not failures
- Security is everyone''s responsibility, not just IT''s job', NULL, 1, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.759', '2026-01-19 11:42:54.615', '5f2a3709-93e0-4664-81d3-aa45525276a7');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('7212ab3d-6fc2-4500-b8c9-742514fe9bab', 'How Passwords Get Compromised', '# How Passwords Get Compromised

## The Password Problem

Despite being the primary method of authentication for decades, passwords remain one of the weakest links in cybersecurity. Understanding how they get compromised is the first step to better protection.

## Common Methods of Password Compromise

### 1. Data Breaches

What Happens:
- Hackers breach company databases
- Steal millions of username/password combinations
- Sell or publish the data on dark web

Notable Breaches:
- LinkedIn (2012): 165 million passwords
- Yahoo (2013): 3 billion accounts
- Adobe (2013): 153 million accounts
- Equifax (2017): 147 million records

Why This Matters:
- Leaked passwords are used to try other accounts
- People reuse passwords across sites
- Attackers use credential stuffing attacks

Check if You''ve Been Breached:
- Visit: haveibeenpwned.com
- Enter your email to see known breaches
- Update passwords for compromised accounts

### 2. Phishing and Social Engineering

How It Works:
- Fake login pages that look legitimate
- Emails claiming "verify your account"
- You enter credentials on malicious site
- Attackers now have your password

Defense:
- Never click links in emails
- Type URLs directly into browser
- Check URL carefully before entering credentials
- Look for HTTPS and valid certificates

### 3. Brute Force Attacks

Dictionary Attacks:
- Try common words from dictionary
- Common passwords: password123, qwerty, admin
- Takes seconds for simple passwords

Pure Brute Force:
- Try every possible combination
- Length and complexity matter enormously
- 8-character password: minutes to hours
- 16-character password: millions of years

Modern Capabilities:
- High-end GPU: billions of attempts per second
- Cloud computing makes this cheaper
- Distributed botnets multiply power

### 4. Credential Stuffing

The Process:
1. Attackers get username/password lists from breaches
2. Use automated tools to try these credentials
3. Test across thousands of websites
4. Exploit password reuse

Why It Works:
- 65% of people reuse passwords
- If Netflix password leaks, attackers try it on banking sites
- Automated at massive scale

Defense:
- Unique password for every account
- Use password manager to track
- Enable breach notifications

### 5. Keyloggers and Malware

How Keyloggers Work:
- Malicious software records every keystroke
- Captures passwords as you type them
- Sends data to attackers

Defense:
- Keep antivirus updated
- Don''t open suspicious attachments
- Download software from official sources only
- Use password manager (types passwords for you)
- Enable MFA (even if password is captured, they can''t login)

## Key Takeaways

- Passwords are compromised through breaches, phishing, brute force, and reuse
- Weak passwords can be cracked in seconds
- Password reuse is extremely dangerous
- Use strong, unique passwords for every account
- Enable MFA everywhere
- Use a password manager
- No legitimate service will ever ask for your password
- Check if your passwords have been breached at haveibeenpwned.com', NULL, 1, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.749', '2026-01-19 11:42:54.597', '30b0f01a-f00e-4a0f-8ce9-16425e35cbe9');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('fa4f4656-09fd-4f5d-923b-18d6d9e8f444', 'Reporting Phishing', '# How to Report and Respond to Phishing Attacks

## Immediate Actions When You Receive a Phishing Email

### DO NOT:
- Click any links or buttons
- Download attachments
- Reply to the sender
- Forward to personal email
- Delete immediately (report first)

### DO:
- Keep the email as evidence
- Report it to appropriate parties
- Alert colleagues if it''s widespread
- Document details for reporting

## Reporting Phishing Emails

### 1. Internal Reporting (Within Your Organization)

Report to IT Security/Help Desk:
- Use your organization''s phishing report button
- Forward the email to security@yourcompany.com
- Include full headers (View > Show Original in Gmail)
- Note any actions you took

Most organizations have:
- Dedicated security email
- Phishing report button in email client
- Internal incident reporting system
- Security hotline

### 2. Email Provider Reporting
- Gmail: Click three dots > Report phishing
- Outlook: Select message > Report > Phishing
- Yahoo: Select message > More > Report phishing
- Apple Mail: Forward to abuse@icloud.com

### 3. External Reporting

Anti-Phishing Working Group (APWG):
- Email: reportphishing@apwg.org
- International coalition fighting phishing

Federal Trade Commission (FTC):
- Forward to: spam@uce.gov
- File complaint at: ReportFraud.ftc.gov

Internet Crime Complaint Center (IC3):
- Website: ic3.gov
- For phishing resulting in financial loss

Company Being Impersonated:
- Most major companies have abuse@company.com
- Examples: abuse@paypal.com, phish@amazon.com

## If You Clicked a Phishing Link

### Immediate Steps (First 15 Minutes)

1. Disconnect from Network
   - Unplug ethernet or disable WiFi
   - Prevents malware from spreading
   - Stops data exfiltration

2. Document Everything
   - Screenshot the phishing page
   - Note time you clicked
   - Record any information entered
   - Save the URL

3. Alert IT Security
   - Call (don''t email if compromised)
   - Provide all details
   - Follow their instructions

### Short-term Response (First 24 Hours)

4. Change Passwords Immediately
   - Start with email account
   - Then financial accounts
   - Any account using the same password
   - Use a different device if possible

5. Enable MFA Everywhere
   - Email, banking, social media
   - Use authenticator apps, not SMS
   - This prevents access even with stolen password

6. Run Security Scans
   - Full antivirus scan
   - Anti-malware tools
   - Check for unauthorized software

7. Monitor Accounts
   - Check for unauthorized access
   - Review recent login history
   - Look for unusual activity

## If You Provided Sensitive Information

### Personal Information (SSN, Date of Birth)
- File identity theft report with FTC
- Place fraud alert on credit reports
- Consider credit freeze
- Monitor credit reports regularly

### Financial Information (Credit Card, Bank Account)
- Contact financial institution immediately
- Request new cards/account numbers
- Review recent transactions
- Set up fraud alerts and monitoring

### Login Credentials (Username/Password)
- Change password immediately on all sites using it
- Enable MFA everywhere
- Check for unauthorized access
- Update security questions

### Work Credentials
- Notify IT security immediately
- Change password
- Review access logs
- Check for data exfiltration

## Key Takeaways

- Report phishing emails before deleting them
- If you clicked, act immediately—disconnect and alert IT
- Change passwords and enable MFA as soon as possible
- Report to multiple parties: IT, email provider, authorities
- Monitor accounts closely after an incident
- Quick reporting helps protect others', NULL, 4, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.742', '2026-01-19 11:42:54.605', '8b832b1a-510f-4c2e-9b41-e33e45b0b6fd');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('c4790102-5ca1-4104-ad76-5a694b333682', 'Passphrases', '# Passphrases: The Better Alternative to Passwords

## What is a Passphrase?

A passphrase is a sequence of random words that creates a long, memorable, and highly secure password alternative.

Example:
- Traditional password: P@ssw0rd123! (12 characters)
- Passphrase: correct-horse-battery-staple (28 characters)

The passphrase is longer, easier to remember, and exponentially more secure.

## Why Passphrases are Superior

### The Math of Password Strength

Password Entropy = Length × Character Set Diversity

8-Character Complex Password:
- Uppercase, lowercase, numbers, symbols
- 95 possible characters per position
- Total combinations: 95^8 = 6.6 quadrillion
- Crack time with modern GPU: Hours to days

20-Character Passphrase (4 random words):
- 10,000 common words in English
- 4-word passphrase: 10,000^4 = 10 quadrillion combinations
- Crack time: Thousands of years

### Length Beats Complexity

NIST (National Institute of Standards and Technology) Guidelines:
- Length is the primary factor in password strength
- Complexity requirements (symbols, numbers) provide minimal benefit
- Long passphrases > short complex passwords

Why:
- Each additional character increases combinations exponentially
- 20 lowercase letters > 10 mixed case + symbols
- Easier to remember means less likely to write down or reuse

## How to Create Strong Passphrases

### Method 1: Random Word Generation (Most Secure)

Use a Password Manager or Diceware:
1. Use random word generator (many password managers offer this)
2. Or use Diceware: roll dice to select words from Diceware word list
3. Combine 4-6 random words
4. Add numbers or symbols if required (but length is more important)

Example Process:
- Roll dice or use generator
- Get words: "bicycle", "meadow", "thunder", "penguin"
- Create passphrase: bicycle-meadow-thunder-penguin
- 33 characters, easy to remember, extremely secure

### Method 2: Mental Image Story

Create memorable phrases using random words:
1. Generate 4-6 random, unrelated words
2. Create a vivid mental image connecting them
3. The absurdity makes it memorable

Example:
- Words: "purple", "elephant", "coffee", "bicycle"
- Passphrase: purple-elephant-drinks-coffee-on-bicycle
- Mental image: A purple elephant riding a bicycle while drinking coffee
- Easy to remember, hard to crack

## Passphrase Best Practices

### DO:
- Use 4-6 random words
- Make them truly random (use tools, don''t pick yourself)
- Use separator characters (-, _, space if allowed)
- Aim for 20+ characters minimum
- Different passphrase for each account
- Store in password manager

### DON''T:
- Use common phrases or song lyrics
- Use words related to you (pet names, birthday, hobbies)
- Pick predictable word combinations
- Reuse passphrases across accounts
- Write on sticky notes

## Passphrase vs Password: Real Examples

### Weak Password: Summer2024!
- Length: 11 characters
- Crack time: Minutes
- Contains predictable pattern (season + year)
- Commonly used format

### Strong Password: xK9#mP2$qL5&nR8
- Length: 15 characters
- Crack time: Years
- Extremely hard to remember
- Likely to be written down or forgotten
- High chance of password reset requests

### Strong Passphrase: velvet-lunar-triumph-cascade-whisper
- Length: 37 characters
- Crack time: Trillions of years
- Easy to remember
- No need to write down
- Can be typed quickly once memorized

## Tools for Generating Passphrases

### Password Managers with Passphrase Generators
- 1Password: Built-in passphrase generator
- Bitwarden: Random word generator
- KeePass: Passphrase mode
- LastPass: Passphrase option

### Standalone Tools
- Diceware: https://diceware.rempe.us/
- EFF Wordlist: https://www.eff.org/dice

## When to Use Passphrases

### Ideal Use Cases:
- Master password for password manager (most critical)
- Primary email account
- Banking and financial accounts
- Encryption keys
- Any account you must remember

## Key Takeaways

- Passphrases use random words for length and memorability
- Length > complexity for password strength
- 4-6 random words create extremely strong passwords
- Easier to remember than complex short passwords
- Use password managers or Diceware for truly random words
- Perfect for master passwords and critical accounts
- Each additional word exponentially increases security', 'https://www.youtube.com/watch?v=3NjQ9b3pgIg', 2, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.75', '2026-01-19 11:42:54.608', 'b4adbb5f-05cd-4931-a360-adf0d0516bf7');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('fab9c765-0456-4e82-ae96-b86c9ef703a9', 'Pretexting', '# Pretexting and Impersonation Attacks

## What is Pretexting?

Pretexting is creating a fabricated scenario (the "pretext") to manipulate a target into divulging information or performing actions they normally wouldn''t.

Unlike simple lies, pretexting involves:
- Creating elaborate backstory
- Assuming false identity
- Building trust over time
- Multiple interactions
- Exploiting specific context

## How Pretexting Works

### The Pretext Creation

Attacker Develops:
1. Believable identity (IT support, vendor, executive)
2. Plausible scenario (system upgrade, audit, emergency)
3. Legitimate-sounding reasons for requests
4. Supporting details and evidence
5. Answers to likely questions

### Common Pretexts

IT Support Impersonation:
- "This is the help desk calling about your computer"
- "We''re doing a security audit, need to verify your credentials"
- "System upgrade requires your password"
- Why it works: People trust IT, want tech problems fixed

Vendor/Partner Impersonation:
- "This is your payroll provider, need to verify account details"
- "Supplier calling about outstanding invoice"
- "Partner needs access to shared system"
- Why it works: Business relationships require cooperation

Executive Impersonation:
- "This is the CEO''s office, need urgent report"
- "CFO needs wire transfer processed immediately"
- "Board member requesting sensitive information"
- Why it works: Authority and fear of refusing executives

Government/Law Enforcement:
- "IRS calling about unpaid taxes"
- "FBI investigating your account"
- "Social Security Administration - your number has been suspended"
- Why it works: Fear of legal consequences

Third-Party Services:
- "Bank fraud department calling about suspicious charges"
- "Email provider doing security verification"
- "Cloud storage provider - account compromised"
- Why it works: Sounds like they''re helping you

## Real-World Pretexting Examples

### Example 1: The IT Help Desk Call

Scenario:
- Employee receives call: "This is John from IT. We detected malware on your computer. I need to remote in to clean it."
- Shows caller ID from company''s IT department (spoofed)
- Knows employee''s name, department, some system details (from reconnaissance)
- Sounds professional and helpful
- Uses technical jargon to sound credible

What Happens:
- Employee allows remote access
- Attacker installs malware or steals data
- Employee thinks they were helped

Red Flags:
- Unsolicited IT call
- IT doesn''t usually call about individual machines
- Request for remote access
- Pressure to act immediately

Proper Response:
- Thank them and hang up
- Call IT help desk using known number
- Verify if call was legitimate

### Example 2: The New Employee

Scenario:
- Person shows up claiming to be new employee starting today
- Has some legitimate-looking paperwork
- Says HR must have forgotten to notify security
- Asks to be let in, claims to be nervous about first day
- Very friendly and personable

What Happens:
- Employee feels bad for "new hire" and holds door open (tailgating)
- Attacker gains physical access to building
- Can plug in USB devices, access files, steal equipment

Red Flags:
- No badge or temporary badge
- Not in security system
- Appealing to emotions
- Pressure to bypass security procedures

Proper Response:
- Be polite but firm
- Direct them to reception/HR
- Don''t hold secure doors open
- Report to security

### Example 3: The Fake Audit

Scenario:
- Phone call or email: "Annual compliance audit requires verification of all employee accounts"
- Sounds official, references real regulations (SOX, HIPAA, etc.)
- Requests usernames, last password change dates, security questions
- Creates urgency: "Audit report due Friday or company faces fines"

What Happens:
- Employee provides information to "help compliance"
- Attacker uses info for password reset attacks
- Company data compromised

Red Flags:
- Audit wasn''t announced
- Real audits don''t ask for passwords or security answers
- Unusual contact method
- Urgency and threats

Proper Response:
- Verify through official compliance/legal department
- Don''t provide any credentials
- Report to security team

## Pretexting Tactics and Techniques

### Building Trust

Reciprocity:
- Offer help or information first
- Create sense of obligation
- "I helped you, now you help me"

Time Investment:
- Multiple interactions over time
- Build relationship gradually
- Harder to doubt someone you''ve "known" for weeks

Shared Identity:
- "I''m also in IT/sales/finance"
- "I went to same college"
- Creates in-group mentality

### Creating Urgency

Time Pressure:
- "Need this in 10 minutes"
- "System going down soon"
- "Deadline is today"

Consequences:
- "You''ll be in trouble if..."
- "Company will lose money if..."
- "Audit will fail if..."

Emergency:
- "CEO stuck at airport"
- "Critical system failure"
- "Security incident"

### Bypassing Verification

Confidentiality:
- "This is confidential, don''t tell anyone"
- "Direct order from CEO"
- Prevents victim from verifying

Complexity:
- Overwhelming with technical details
- Making victim feel inadequate
- "You wouldn''t understand the technical side"

Authority:
- Name dropping executives
- Using confident tone
- Expecting compliance

## Defending Against Pretexting

### Individual Defense

Verification is Key:
- Verify identity through independent channel
- Use known phone numbers (not ones provided)
- Check employee directory
- Confirm with supervisor
- When in doubt, verify again

Challenge Requests:
- Ask questions to verify legitimacy
- Request callback number (look it up yourself)
- Ask for ticket number or reference
- Verify through official channels

Trust But Verify:
- Politeness doesn''t require compliance
- It''s okay to say "let me call you back"
- Don''t feel bad about following procedures
- Better to double-check than be sorry

### Organizational Defense

Clear Procedures:
- Verification process for sensitive requests
- Multiple-person approval for critical actions
- Out-of-band verification requirements
- Documented escalation paths

Training:
- Regular awareness training
- Simulated pretexting attacks
- Role-specific scenarios
- Share real examples

Technical Controls:
- Caller ID can''t be trusted alone
- Require multiple forms of verification
- Audit trails for access requests
- Alert on unusual requests

Cultural Elements:
- Encourage verification without fear
- No punishment for following procedures
- Praise people who catch pretexting
- "Security stops here" mentality

## Special Considerations

### Remote Work

Increased Risk:
- Harder to verify identity remotely
- Video can be deepfaked
- Less casual verification
- Isolated workers more vulnerable

Additional Protections:
- Video verification for sensitive requests
- Use corporate communication channels
- Regular team check-ins
- Clear remote work security procedures

### Physical Pretexting

Tailgating:
- Following authorized person through secure door
- "Forgot my badge"
- "Hands are full"
- Very common and effective

Uniform/Badge:
- Fake delivery uniform
- Printed fake badge
- "Here to fix the copier"
- People trust uniforms

Dumpster Diving:
- Searching trash for information
- Finding documents, notes, USB drives
- Used to build convincing pretext
- Prevention: shred sensitive documents

## Warning Signs of Pretexting

Combined Red Flags:
- Story doesn''t quite add up
- Pushy or defensive when questioned
- Won''t provide verifiable details
- Creates time pressure
- Appeals to emotion
- Requests unusual actions
- Bypassing normal procedures
- Too much knowledge or too little
- Story changes when challenged

## Key Takeaways

- Pretexting uses elaborate fabricated scenarios to manipulate targets
- Attackers research and prepare detailed backstories
- Common pretexts: IT support, vendors, executives, authorities
- Building trust and urgency are key tactics
- Always verify identity through independent channels
- It''s okay (and necessary) to say "let me verify that"
- Organizations need clear verification procedures
- Train employees to recognize and resist pretexting
- Trust your instincts - if something feels off, verify
- No legitimate organization will punish you for following security procedures', NULL, 2, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.761', '2026-01-19 11:42:54.617', 'f133ab15-018b-4b84-b17e-e078e8081ce0');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('ea24c493-5687-4306-a5b0-225092aaf5ef', 'Physical Social Engineering', '# Physical Social Engineering Tactics

## What is Physical Social Engineering?

Physical social engineering involves in-person manipulation to gain unauthorized access to buildings, computer systems, or sensitive information. It bypasses technical security by exploiting human behavior.

### Why It Matters

Even with strong digital security:
- Physical access often defeats all technical controls
- Most attacks combine physical and digital techniques
- Physical security is often the weakest link
- One person''s mistake can compromise entire organization

## Common Physical Social Engineering Tactics

### 1. Tailgating (Piggybacking)

What It Is:
- Following authorized person through secure door
- Bypassing badge readers and access controls
- One of the most common attacks

How It Works:
- Wait near secure entrance
- Follow closely behind authorized employee
- Take advantage of politeness (people hold doors)
- May carry boxes or food to appear legitimate

Common Scenarios:
- "My badge isn''t working, can you let me in?"
- "I''m late for a meeting"
- "I''m here for delivery"
- Simply walking confidently behind someone

Prevention:
- Never hold secure doors for others
- Require everyone to badge individually
- Install mantrap doors (only one person at a time)
- Challenge unfamiliar faces politely
- Report tailgating attempts

### 2. Shoulder Surfing

What It Is:
- Observing someone entering sensitive information
- Watching over shoulder or from distance
- Capturing passwords, PINs, access codes

How It Works:
Direct Observation:
- Standing nearby while victim types password
- In cafes, airports, offices, public spaces
- May use excuse to stand close

Technical Observation:
- Hidden cameras
- Binoculars or telephoto lenses
- Reflection in windows or glasses
- Thermal imaging (heat from keypress)

What They Capture:
- Passwords and PINs
- Badge codes
- Confidential documents
- Screen contents
- Keyboard patterns

Prevention:
- Be aware of surroundings
- Shield screen and keyboard
- Use privacy screens on laptops
- Avoid sensitive tasks in public
- Change passwords after public entry
- Use biometric or hardware keys when possible

### 3. Dumpster Diving

What It Is:
- Searching through trash for valuable information
- Legal in many jurisdictions
- Provides information for further attacks

What Attackers Find:
- Documents with passwords written down
- Internal phone directories
- Org charts and employee lists
- Financial records
- Hardware (USB drives, old hard drives)
- Sticky notes with credentials
- Network diagrams
- Vendor information
- Project details

How It''s Used:
- Build convincing pretexts
- Find initial access credentials
- Learn about org structure
- Identify targets for attacks
- Gather intelligence for social engineering

Prevention:
- Shred all sensitive documents
- Secure disposal bins
- Wipe or destroy storage media
- Never throw credentials away
- Clean desk policy
- Regular security reminders
- Consider locked trash receptacles

### 4. Impersonation with Props

What It Is:
- Using physical props to appear legitimate
- Exploiting trust in uniforms and badges

Common Impersonations:

Delivery Person:
- Uniform and clipboard
- Real or fake packages
- "Need signature for delivery"
- Gains entry to secure areas

Maintenance/Repair:
- "Here to fix the copier/AC/internet"
- Tool belt and equipment
- People hesitate to question workers
- Can access server rooms, offices

Interviewer/Visitor:
- Professional attire
- Scheduled "appointment"
- "I''m here for interview with HR"
- Receptionist may grant access

Contractor/Consultant:
- Laptop and professional appearance
- "Working on project with [real employee]"
- May have fake business cards
- Blends in with legitimate workers

Inspector/Auditor:
- Official-looking credentials
- "Annual safety inspection"
- "Compliance audit"
- Authority commands cooperation

Prevention:
- Verify all visitors against scheduled appointments
- Issue temporary badges for all visitors
- Escort visitors at all times
- Challenge anyone without proper badge
- Call to verify unexpected service calls
- Train reception and security staff
- Regular contractor verification

### 5. Badge Cloning

What It Is:
- Copying RFID access badges
- Using cloned badge to gain access
- Often combined with other tactics

How It Works:
- Portable RFID readers (pocket-sized)
- Can read badge from close proximity
- Clone badge to blank card
- Use cloned badge for access

Attack Scenarios:
- Bump into victim to get close
- Read badge through clothing/bag
- In elevator or crowded spaces
- From several feet away with good equipment

Prevention:
- RFID-blocking badge holders
- Keep badge not visible when not in use
- Use badges with encryption
- Implement additional authentication
- Alert on badge cloning attempts (if supported)
- Regular badge audits

### 6. USB Drop Attacks

What It Is:
- Leaving infected USB drives for victims to find
- Exploits curiosity and helpfulness
- Very effective attack vector

How It Works:
Preparation:
- Load USB with malware
- Label attractively ("Employee Salaries", "Confidential")
- Drop in parking lot, lobby, break room
- Sometimes mailed to targets

Attack Execution:
- Victim finds USB
- Curiosity or helpfulness prompts them to plug it in
- "Let me see what this is"
- "Someone lost this, let me find the owner"
- Malware auto-executes or tricks user
- Network compromised

Prevention:
- Never plug in found USB drives
- Report found devices to security
- Disable USB autorun
- Use endpoint protection
- Regular security awareness training
- Controlled USB port policies

## Advanced Physical Social Engineering

### Baiting

What It Is:
- Leaving something enticing to lure victims
- Physical or digital bait
- Exploits greed, curiosity, or helpfulness

Examples:
- Free USB drive with logo: "Conference 2024 - Presentations"
- CD labeled "Executive Salary Information - Confidential"
- QR codes: "Scan for free WiFi" (goes to malicious site)
- Infected charging cables left in public

### Quid Pro Quo

What It Is:
- Offering service in exchange for information
- "I''ll help you if you help me"
- Creates sense of obligation

Examples:
- "I''m from IT doing system upgrades. Can I remote into your computer?"
- "I''ll fix your printer if you let me use your login"
- "Free technical support - just need to verify your credentials"

### Water Cooler / Break Room Reconnaissance

What It Is:
- Casual eavesdropping
- Gathering information from overheard conversations
- People talk freely in "safe" areas

What Attackers Learn:
- Passwords discussed verbally
- Project names and details
- Employee names and roles
- System names and structure
- Upcoming events or changes
- Vacation schedules

Prevention:
- Assume public spaces aren''t private
- Don''t discuss sensitive information casually
- Meeting rooms for confidential discussions
- Awareness that anyone could be listening

## Defending Against Physical Social Engineering

### Individual Actions

Be Vigilant:
- Challenge unfamiliar faces politely
- Don''t hold doors for others
- Shield sensitive information
- Secure documents and devices
- Report suspicious behavior

Trust Your Instincts:
- If something feels off, it probably is
- Better to offend than compromise security
- It''s okay to ask questions
- Security is everyone''s responsibility

### Organizational Measures

Physical Security:
- Badge access to sensitive areas
- Reception desk for all visitors
- Visitor badges and escorts
- Security cameras
- Mantrap doors
- Secure disposal
- Clean desk policy

Policies and Procedures:
- Clear visitor management process
- Challenge strangers policy
- Verification procedures
- Incident reporting
- Regular security audits
- Contractor verification

Training and Awareness:
- Regular security training
- Physical security scenarios
- Simulated attacks
- Incident examples
- Clear communication channels
- Positive reinforcement

### Reception and Security Staff

Critical First Line:
- Verify all visitors
- Issue proper badges
- Log visitor information
- Require escort for sensitive areas
- Challenge suspicious behavior
- Trained to recognize social engineering

## Red Flags for Physical Social Engineering

Warning Signs:
- No badge or improper badge
- Unfamiliar face in secure area
- Carrying unusual items for role
- Resistant to following procedures
- Overly friendly or pushy
- Creating urgency
- Doesn''t know basic information
- Story doesn''t add up
- Appealing to emotions
- Name dropping without verification

## Key Takeaways

- Physical access often defeats all technical security
- Tailgating and shoulder surfing are extremely common
- Never plug in found USB drives
- Always challenge unfamiliar people politely
- Physical security is everyone''s responsibility
- Trust your instincts - if something feels off, verify
- Proper disposal prevents information leakage
- Reception and security staff need specialized training
- Combine physical and technical security measures
- Regular awareness training prevents physical attacks', NULL, 3, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.762', '2026-01-19 11:42:54.619', 'f133ab15-018b-4b84-b17e-e078e8081ce0');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('108e9850-d634-46a2-8c03-5272f0cbc96b', 'Identifying Phishing URLs', '# How to Identify Phishing URLs and Websites

## Understanding URLs

A URL (Uniform Resource Locator) is the web address you see in your browser. Understanding URL structure is critical for identifying phishing attempts.

### URL Anatomy

https://www.example.com/path/page.html?query=value
[1]    [2] [3]      [4]  [5]

1. Protocol (https:// or http://)
2. Subdomain (www)
3. Domain name (example.com)
4. Path (/path/page.html)
5. Query parameters (?query=value)

## Red Flags in URLs

### 1. Misspelled Domains
- amaz0n.com (zero instead of ''o'')
- paypa1.com (number 1 instead of ''l'')
- microsoftonline.com vs microsoft-online.com
- Always check the actual domain, not just what looks familiar

### 2. Suspicious Subdomains
- paypal.secure-login.com (domain is "secure-login.com", NOT PayPal)
- amazon.account-verify.net (domain is "account-verify.net")
- The domain is what comes RIGHT BEFORE the first single slash (/)

### 3. Extra Characters or Domains
- paypal.com.secure.ru (actual domain is ".ru")
- www.paypal-login.tk (domain is ".tk", a common free domain)
- Look for the last two parts before the path

### 4. IP Addresses Instead of Domain Names
- http://192.168.1.1/paypal (legitimate sites don''t use raw IPs)
- http://203.0.113.0/login

### 5. No HTTPS
- Missing padlock icon in browser
- http:// instead of https://
- Never enter sensitive info on non-HTTPS sites

## Advanced Phishing Techniques

### Homograph Attacks (IDN Spoofing)
- Using similar-looking characters from different alphabets
- Cyrillic ''а'' looks identical to Latin ''a'' but is different
- Modern browsers now flag these

### URL Shorteners
- bit.ly, tinyurl.com, etc. hide the real destination
- Hover over shortened links if possible
- Use URL expander tools before clicking
- Many phishers use these to hide malicious URLs

### Typosquatting
- Registering common misspellings
- gooogle.com, faceboook.com
- Banking on users making typos

## How to Safely Check URLs

### 1. Hover Before You Click
- Desktop: Hover mouse over link to preview URL
- Mobile: Long-press to see destination
- Check if displayed text matches actual URL

### 2. Check the Certificate
- Click the padlock icon in browser
- View certificate details
- Verify it''s issued to the correct organization

### 3. Use Browser Security Features
- Modern browsers warn about known phishing sites
- Don''t ignore these warnings
- Keep browser updated for latest protections

### 4. Type URLs Directly
- For sensitive sites (banking, email), type URL yourself
- Use bookmarks for frequently visited sites
- Don''t rely on links from emails

## Practice Exercise

Which of these URLs is legitimate for PayPal?
1. https://www.paypal.com/signin
2. https://paypal.com.secure-login.net
3. https://www.paypa1.com
4. http://paypal.support.verify.tk

Answer: Only #1 is legitimate!

## Key Takeaways

- The domain name is the most critical part to verify
- Always check for HTTPS on sensitive sites
- When in doubt, type the URL yourself
- Use bookmarks for important sites
- Modern browsers help, but stay vigilant', 'https://www.youtube.com/watch?v=qBN7JfV_FvI', 2, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.739', '2026-01-19 11:42:54.6', '2a41640e-0fca-4c13-8990-41c941c87a9e');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('9650bd7e-441e-4c15-adfa-9707aebb8372', 'Password Hashing', '# Understanding Password Hashing and Encryption

## Why Hashing Matters

When you create a password on a website, that site should never store your actual password. Instead, they should store a hash - a one-way mathematical transformation of your password.

Why This Matters:
- If the database is breached, attackers don''t get actual passwords
- Even system administrators shouldn''t see your password
- Prevents insider threats
- Required by security regulations and best practices

## What is Hashing?

### The Basics

Hashing is a one-way mathematical function that converts any input into a fixed-length string of characters.

Key Properties:
1. One-way: Can''t reverse the hash to get original password
2. Deterministic: Same password always produces same hash
3. Fixed length: "a" and a 1000-character password produce same-length hash
4. Avalanche effect: Tiny input change completely changes hash

Example (simplified MD5 hash):
Password: "password123"
Hash: "482c811da5d5b4bc6d497ffa98491e38"

Password: "password124" (changed one character)
Hash: "7c6a180b36896a0a8c02787eeafb0e4c" (completely different)

### How Login Works with Hashing

Creating Account:
1. You enter password: "MySecurePassword123"
2. Website hashes it: "a4f8b392c..."
3. Website stores: username + hash (NOT password)

Logging In:
1. You enter password: "MySecurePassword123"
2. Website hashes what you entered
3. Compares hash to stored hash
4. If they match, you''re in

The website never stores or knows your actual password!

## Common Hashing Algorithms

### Cryptographic Hash Functions

MD5 (Message Digest 5):
- Status: BROKEN - Do not use
- 128-bit hash
- Extremely fast (which is bad for passwords)
- Vulnerable to collisions

SHA-1 (Secure Hash Algorithm 1):
- Status: BROKEN - Do not use
- 160-bit hash
- Vulnerable to collisions

SHA-256/SHA-512:
- Status: Not ideal for passwords (too fast)
- Part of SHA-2 family
- Good for file integrity, digital signatures
- Too fast for password hashing (enables faster cracking)

### Password-Specific Hashing (Recommended)

bcrypt:
- Status: Recommended
- Deliberately slow (adjustable)
- Includes automatic salting
- Widely supported
- Battle-tested since 1999

Argon2:
- Status: Best modern choice
- Winner of Password Hashing Competition (2015)
- Resistant to GPU and ASIC attacks
- Configurable memory usage

PBKDF2:
- Status: Acceptable
- NIST recommended
- Widely supported
- Slower than raw SHA but not as good as bcrypt/Argon2

scrypt:
- Status: Recommended
- Memory-intensive
- Resistant to hardware attacks

## The Problem: Fast Hashing

Why being "fast" is bad for passwords:
- Hashing should be fast for legitimate use (checking password once)
- But slow enough to prevent brute force attacks
- Modern GPUs can compute billions of MD5 hashes per second
- With fast algorithms, attackers can try passwords very quickly

Attack Speed Comparison:
- MD5: ~50 billion hashes/second (high-end GPU)
- bcrypt: ~10,000 hashes/second
- Difference: bcrypt is ~5 million times slower = 5 million times more secure

## Salting: The Critical Protection

### What is a Salt?

A salt is random data added to your password before hashing.

Without Salt:
Password: "password123"
Hash: "482c811da5d5b4bc6d497ffa98491e38"

With Salt:
Password: "password123"
Salt: "xK9mP2qL" (random, different for each user)
Combined: "password123xK9mP2qL"
Hash: "7a8f3d9e1c2b4a5f6e8d9c0b1a2d3e4f"

### Why Salting is Critical

1. Prevents Rainbow Table Attacks
- Rainbow tables: pre-computed hashes of common passwords
- With salt, attacker must compute hash for each user individually
- Makes pre-computation impossible

2. Prevents Duplicate Hash Detection
- Without salt: same password = same hash
- Attacker sees many users with same hash
- Knows they all use same password
- Crack once, get many accounts

- With salt: same password = different hash
- Each user has unique salt
- No way to tell who uses same password

## How Attackers Crack Hashed Passwords

### 1. Dictionary Attacks
- Try common passwords from lists
- "password", "123456", "qwerty"
- Hash each and compare to stolen hashes

### 2. Brute Force
- Try every possible combination
- Very slow but guaranteed to work eventually
- Why length matters

### 3. Rainbow Tables
- Pre-computed hash tables
- Instant lookup
- Defeated by salting

### 4. Hybrid Attacks
- Dictionary words + common variations
- "password" becomes "password123", "P@ssword", "Password2024"

## Real-World Examples

### LinkedIn Breach (2012)
- Problem: Used unsalted SHA-1 hashes
- Result: 6.5 million passwords cracked in days
- Lesson: Even "secure" algorithms fail without salting

### Adobe Breach (2013)
- Problem: Used encrypted passwords with poor key management
- Result: 153 million passwords exposed
- Lesson: Encryption is not equal to hashing

## How to Check if a Site Uses Proper Hashing

### Red Flags (Site is Doing It Wrong):
- Password reset sends you your actual password
- Customer service can tell you your password
- Password displayed in account settings
- Password visible in URL or email

### Green Flags (Site is Doing It Right):
- Password reset requires creating new password
- Support says "I can reset it but can''t tell you what it is"
- Password is never displayed anywhere
- Can only change password by entering old one

## Hashing vs Encryption

Many people confuse these:

Hashing:
- One-way: can''t get original back
- Always same output for same input
- Used for passwords, file integrity

Encryption:
- Two-way: can decrypt to get original
- Different output each time (with proper IV)
- Used for data at rest, data in transit
- Requires keys to decrypt

For passwords, always use hashing, never encryption!

## Key Takeaways

- Hashing converts passwords to irreversible fixed-length strings
- Good sites never store your actual password
- Salting prevents rainbow tables and duplicate detection
- Modern algorithms (bcrypt, Argon2) are deliberately slow
- Old algorithms (MD5, SHA-1) are broken for passwords
- If a site can tell you your password, they''re doing it wrong
- Proper hashing protects users even when databases are breached
- Each password should have unique random salt
- Length matters more than complexity for resisting brute force', NULL, 3, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.751', '2026-01-19 11:42:54.61', 'b4adbb5f-05cd-4931-a360-adf0d0516bf7');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('9af1a942-aea7-49d0-8c24-282803c58b0a', 'Whaling Attacks', '# Whaling Attacks: Targeting the C-Suite

## What is Whaling?

Whaling is a highly targeted phishing attack aimed at senior executives, C-level leaders, and high-profile individuals.

Also called: CEO Fraud, Business Email Compromise (BEC)

Target: "Big fish" in the organization
- CEOs, CFOs, COOs
- Board members
- High net worth individuals
- Politicians, celebrities

## Why Executives are Targeted

### High-Value Targets

Executives have:
- Access to sensitive data
- Financial authority
- Strategic information
- Ability to approve large transactions
- Influence over others

### Unique Vulnerabilities

Executives are often:
- Less tech-savvy than IT staff
- Exempt from security policies ("too busy")
- Trusting of apparent authority
- Publicly visible (LinkedIn, press releases)
- Have assistants who manage email

### Public Information

Attackers research extensively:
- LinkedIn profiles (role, connections)
- Press releases (travel, announcements)
- Social media (personal interests)
- Conference attendance
- Business relationships

## Common Whaling Tactics

### CEO Fraud (BEC)

Attacker impersonates CEO to CFO:
- "I''m in a meeting, need urgent wire transfer"
- "Confidential acquisition, send $500K to this account"
- "Call my personal cell, not office"

Pressure tactics:
- Urgency
- Confidentiality
- Authority

### Tax Form Phishing

Targeting HR/Finance:
- "Please send W-2 forms for all employees"
- Appears from CEO email
- Used for identity theft, tax fraud

### Fake Legal Subpoena

- Email appearing from law firm
- Attached "subpoena" (malware)
- Pressures quick action
- Targets general counsel

### Vendor Invoice Scam

- Spoofed vendor email
- "Updated payment information"
- Redirects payments to attacker account
- Targets accounts payable

## How Whaling Attacks Work

### Step 1: Research

Attacker gathers intelligence:
- Company structure
- Executive names and roles
- Relationships and hierarchies
- Email formats
- Recent company news

Sources:
- LinkedIn
- Company website
- Press releases
- Social media
- Business directories

### Step 2: Craft Attack

Create highly personalized email:
- Correct names, titles, relationships
- Company-specific terminology
- Recent events or projects
- Executive communication style
- Appropriate urgency level

### Step 3: Spoof or Compromise

**Email Spoofing:**
- Display name: "John Smith, CEO"
- From address: john.smith@company.co (note: .co not .com)
- Or: john.smith@cornpany.com (typosquatting)

**Account Compromise:**
- Compromise assistant''s email
- Hack actual executive account
- More convincing

### Step 4: Execute

Send email at optimal time:
- Executive traveling (common excuse for unusual request)
- End of quarter (financial pressure)
- Late afternoon (less scrutiny)
- When target is busy

### Step 5: Pressure Response

Create urgency:
- "Confidential - don''t discuss with anyone"
- "Board needs this immediately"
- "Compliance deadline today"
- "I''m in important meeting, can''t talk"

## Red Flags of Whaling

**Email Indicators:**
- Unusual requests from executives
- Urgency and confidentiality
- Requests to bypass normal procedures
- "Reply to my personal email"
- Slight domain misspellings

**Behavioral Indicators:**
- Executive asking for gift cards
- Unusual financial transactions
- Requests outside normal business processes
- Pressure not to verify

**Verify:**
- Call known phone number (not in email)
- Walk to office in person
- Use different communication channel
- Follow normal approval processes

## Real-World Examples

### Example 1: Tech Company - $100M Loss

- Attackers spoofed emails from CEO
- Targeted accounting department
- Multiple wire transfers over 2 years
- Accountants thought they were following CEO orders
- $100 million stolen

### Example 2: Healthcare CEO

- Phishing email to CEO
- Appeared from board member
- Malware attachment ("confidential board materials")
- CEO opened attachment
- Ransomware encrypted entire network

### Example 3: University President

- Email to HR appearing from president
- "Send W-2 forms for all employees"
- HR complied
- 10,000 employee tax records stolen
- Used for identity theft and tax fraud

## Defending Against Whaling

### Technical Controls

**Email Authentication:**
- SPF, DKIM, DMARC
- Detect spoofed emails
- External email warnings

**Advanced Threat Protection:**
- Sandbox suspicious attachments
- URL rewriting and scanning
- Impersonation detection

**Domain Monitoring:**
- Register typosquatting domains
- Monitor for fake domains
- Trademark protection

### Process Controls

**Verification Procedures:**
- Verbal confirmation for financial transactions
- Multi-person approval for large transfers
- Callback to known numbers
- Out-of-band verification

**Separation of Duties:**
- No single person can complete transaction
- Multiple approvals required
- Audit trail

### Training for Executives

**Executive-Specific Training:**
- Tailored to their risk level
- Real examples targeting executives
- Simulations (test executives too)
- Brief, respectful of their time

**Key Messages:**
- You are a high-value target
- Attackers research you specifically
- Verify unusual requests
- No one is "too important" for security policies

## If You''re Targeted

### For Executives

If you receive suspicious email:
1. Don''t click links or attachments
2. Don''t reply
3. Report to IT security immediately
4. Don''t feel embarrassed - it happens

If you think your account is compromised:
1. Alert IT security immediately
2. Change passwords
3. Check sent folder for unauthorized emails
4. Review recent approvals/transactions
5. Notify key staff to be vigilant

### For Employees

If you receive request from executive:
1. Verify through alternate channel
2. Call known phone number
3. Walk to their office
4. Don''t be intimidated by authority
5. Follow verification procedures
6. Document and report if suspicious

## Key Takeaways

- Whaling targets senior executives and high-value individuals
- Highly personalized using public information research
- Common tactics: CEO fraud, tax form phishing, fake subpoenas
- Financial impact can be massive ($100M+ losses)
- Executives are often exempt from security policies - bad practice
- Verification is critical - call back on known number
- Never bypass approval processes due to urgency
- Technical controls: email authentication, external warnings
- Process controls: multi-person approval, out-of-band verification
- Train executives on their unique risks
- Attackers research extensively using LinkedIn, press releases, social media
- No one is too important for security policies', 'https://www.youtube.com/watch?v=lm6tTEcqR1c', 7, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:53:03.799', '2026-01-19 11:42:54.666', '04626f01-23f6-4bf7-965b-1a82fa96a064');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('65a9c1b3-e772-40d5-8c59-e248f0564fab', 'Secure Data Disposal', '# Secure Data Disposal

## What is Secure Data Disposal?

**Definition**: The process of permanently destroying data so it cannot be recovered, reconstructed, or accessed by unauthorized parties.

**Why it matters**:
- Deleted ≠ Gone
- Standard deletion leaves data recoverable
- Improper disposal causes data breaches
- Regulatory requirements (GDPR, HIPAA, etc.)

**Key principle**: Data should be as hard to recover as it is valuable to protect

## The Problem with "Delete"

### What "Delete" Actually Does

**When you delete a file**:
1. Operating system removes pointer to file
2. File marked as "available space"
3. Actual data remains on disk
4. Data persists until overwritten

**Analogy**: Like removing a book from library catalog but leaving book on shelf - anyone can find and read it

### Real Recovery Risks

**Data can be recovered**:
- With free recovery software (Recuva, PhotoRec)
- From "formatted" drives
- Even after "empty trash"
- Years after deletion in some cases

**Who recovers improperly deleted data**:
- Criminals purchasing used equipment
- Corporate espionage
- Identity thieves
- Unauthorized employees
- Malicious insiders

## Types of Data Disposal

### 1. Software-Based Overwriting

**How it works**:
- Writes random data over existing data
- Multiple passes increase security
- Makes original data unrecoverable

**Methods**:

**Single Pass (DoD 5220.22-M)**:
- Overwrite with zeros
- Overwrite with ones
- Overwrite with random data
- Sufficient for most purposes

**Multiple Passes**:
- 3 passes: Generally adequate
- 7 passes (Schneier method): Extra security
- 35 passes (Gutmann method): Overkill for modern drives

**Modern consensus**: 1-3 passes sufficient for modern hard drives

**Tools**:
- **Windows**: Cipher.exe, SDelete (Sysinternals)
- **Mac**: Disk Utility (secure erase)
- **Linux**: shred, dd, wipe
- **Cross-platform**: DBAN (Darik''s Boot and Nuke), Eraser, BleachBit

**Pros**:
- Free or low cost
- Can be done remotely
- Works for partial data deletion

**Cons**:
- Time-consuming for large drives
- Cannot verify complete overwrite
- Won''t reach bad sectors
- Ineffective for SSDs (see below)

### 2. Degaussing

**How it works**:
- Powerful magnetic field disrupts magnetic domains
- Makes data unreadable
- Renders drive unusable

**Applies to**:
- Hard disk drives (HDDs)
- Magnetic tapes
- Floppy disks

**Does NOT work on**:
- SSDs
- Flash drives
- CDs/DVDs

**Pros**:
- Very fast (seconds)
- Highly effective for HDDs
- No software needed

**Cons**:
- Expensive equipment ($500-$5000+)
- Destroys drive (not reusable)
- Doesn''t work on SSDs
- Must use appropriate strength degausser

**When to use**: High-security environments with magnetic media

### 3. Physical Destruction

**Methods**:

**Shredding**:
- Industrial shredders
- Reduces drives to small particles
- Shred size matters (smaller = more secure)
- NSA standard: particles < 2mm

**Crushing/Bending**:
- Physical deformation
- Platters must be destroyed
- May not be sufficient alone

**Drilling**:
- Multiple holes through platters
- Quick but may leave data recoverable
- Better than nothing, not ideal

**Incineration**:
- High-temperature burning
- Complete destruction
- Environmental concerns
- Expensive

**Disintegration**:
- Reduces to powder
- Most secure method
- Very expensive
- Military/high-security use

**Pros**:
- Works on all media types
- Visual confirmation of destruction
- No possibility of recovery

**Cons**:
- Cannot reuse drives
- Can be expensive
- Requires proper disposal of remnants
- Environmental considerations

### 4. Cryptographic Erasure

**How it works**:
- Destroy encryption keys
- Encrypted data becomes unrecoverable
- Instant and effective

**Requirements**:
- Full disk encryption already in place
- Strong encryption (AES-256)
- Secure key management

**Process**:
1. Encrypt drive with strong encryption
2. When ready to dispose, destroy keys
3. Data unrecoverable without keys

**Pros**:
- Nearly instant
- Works on SSDs
- Very effective
- Can be done remotely

**Cons**:
- Requires planning ahead (encryption must be in place)
- Must trust encryption implementation
- Keys must be truly destroyed

**Best for**: Organizations with full disk encryption policies

## Special Considerations for Different Media

### Solid State Drives (SSDs)

**Why SSDs are different**:
- Wear leveling spreads data across chips
- TRIM command handles cleanup
- Overwriting doesn''t reach all cells
- Bad blocks not accessible
- Data can persist in over-provisioned space

**Secure disposal for SSDs**:

**1. Built-in Secure Erase** (BEST for SSDs):
- ATA Secure Erase command
- Manufacturer implementation
- Resets all cells
- Takes minutes
- Tools: hdparm (Linux), Secure Erase utilities

**2. Cryptographic erase**:
- If encrypted, destroy keys
- Effective and fast

**3. Physical destruction**:
- Shredding or crushing
- Only reliable non-electronic method

**What DOESN''T work well**:
- Standard file deletion
- Software overwriting (incomplete)
- Degaussing (SSDs aren''t magnetic)

### Mobile Devices (Phones, Tablets)

**Special risks**:
- Personal data (contacts, messages, photos)
- Saved passwords and accounts
- Financial information
- Location history

**Secure disposal process**:

**Before disposal**:

1. **Backup data** (if keeping device data)

2. **Sign out of accounts**:
   - iCloud/Google account
   - Email accounts
   - Social media
   - Banking apps
   - All other accounts

3. **Remove SIM card and SD card**:
   - Physically remove
   - Dispose separately or keep

4. **Factory reset**:
   - Settings → Reset
   - Choose "Erase all data"
   - May need to enter password

5. **Encrypt before reset** (Android):
   - Settings → Security → Encrypt
   - Then factory reset
   - Makes data unrecoverable

6. **Remove locks**:
   - Remove device from Find My iPhone/Android Device Manager
   - Disable activation lock

**After reset**:
- Verify all data removed
- Check accounts are signed out
- Consider physical destruction if highly sensitive

### Optical Media (CDs, DVDs, Blu-ray)

**Disposal methods**:

1. **Shredding** (BEST):
   - Specialized CD/DVD shredders
   - Reduces to small pieces
   - Least expensive secure option

2. **Incineration**:
   - Burns completely
   - No data recovery possible

3. **Physical destruction**:
   - Cut into pieces (scissors for some)
   - Scratch surface thoroughly
   - Break into multiple pieces

**What doesn''t work**:
- Snapping in half (data still readable)
- Scratching lightly (often still readable)
- Microwaving (dangerous, incomplete)

### Paper Documents

**Methods**:

1. **Cross-cut shredding** (BEST for most):
   - Particles 4mm or smaller
   - Adequate for most documents
   - Affordable

2. **Micro-cut shredding**:
   - Particles ~1mm
   - High security
   - More expensive

3. **Pulping**:
   - Industrial process
   - Breaks down to pulp
   - Very secure

4. **Incineration**:
   - Complete destruction
   - Environmental concerns

**What to shred**:
- Financial statements
- Medical records
- Tax documents (after retention period)
- Any documents with PII
- Credit card offers
- Documents with signatures

**Retention before disposal**: Check legal requirements (7 years for tax docs in US, varies by type)

### Cloud Data

**Challenges**:
- Data may be replicated
- Backups may exist
- Truly deleting is difficult
- No physical access to media

**Secure cloud disposal**:

1. **Delete from service**:
   - Use service''s deletion feature
   - Empty "trash" or "recycle bin"

2. **Request data deletion**:
   - Contact provider
   - Request permanent deletion
   - GDPR/CCPA give you this right

3. **Verify deletion**:
   - Request confirmation
   - Check data access

4. **Close account**:
   - Delete account entirely if leaving service

5. **For highly sensitive**:
   - Encrypt before uploading
   - Destroy keys when done
   - Don''t rely solely on provider deletion

## Data Disposal Policy

### For Organizations

**Essential elements**:

1. **Data classification**:
   - Public
   - Internal
   - Confidential
   - Restricted/Highly Confidential

2. **Disposal methods by classification**:
   - Public: Standard deletion
   - Internal: Secure deletion
   - Confidential: Overwriting or degaussing
   - Restricted: Physical destruction

3. **Retention schedules**:
   - Legal requirements
   - Business needs
   - Automatic disposal after period

4. **Disposal procedures**:
   - Who authorizes disposal
   - How disposal is performed
   - Documentation requirements
   - Verification methods

5. **Chain of custody**:
   - Track media from use to disposal
   - Documented transfers
   - Authorized handlers only

6. **Certificate of destruction**:
   - Proof of disposal
   - Date, method, person responsible
   - Asset identifiers
   - Retention of certificates

7. **Third-party disposal**:
   - Vetted vendors
   - Contractual requirements
   - Audit rights
   - Certificates of destruction
   - NAID AAA certification preferred

### For Individuals

**Personal data disposal policy**:

1. **Before selling/donating devices**:
   - Backup data if needed
   - Sign out of all accounts
   - Factory reset (encrypt first if possible)
   - Remove SIM/SD cards
   - Verify data removed

2. **Old hard drives**:
   - Software wipe (multiple passes)
   - Or physical destruction if sensitive
   - Remove from computers before disposal

3. **Paper documents**:
   - Shred anything with personal info
   - Cross-cut minimum
   - Keep shredder accessible

4. **Cloud accounts**:
   - Delete data before closing
   - Download needed data first
   - Confirm deletion

5. **Old media**:
   - CDs/DVDs: shred or break
   - USB drives: overwrite then destroy
   - Memory cards: overwrite or destroy

## Common Mistakes

### Mistake 1: Assuming "format" is enough

**Reality**: Quick format only erases file table, data remains

**Fix**: Use full format, then secure erase

### Mistake 2: Only deleting files

**Reality**: File remnants, temp files, swap files, hibernation files remain

**Fix**: Secure erase entire drive or partition

### Mistake 3: Using wrong method for SSD

**Reality**: Overwriting doesn''t fully erase SSDs

**Fix**: Use ATA Secure Erase or physical destruction

### Mistake 4: Forgetting about backups

**Reality**: Data copied to backups, cloud, other devices

**Fix**: Include all copies in disposal plan

### Mistake 5: Trusting third parties without verification

**Reality**: Some disposal services don''t actually destroy data

**Fix**: Use certified vendors, require certificates of destruction, audit if possible

### Mistake 6: Not considering data on network drives

**Reality**: Network shares, file servers contain copies

**Fix**: Include network storage in disposal procedures

### Mistake 7: Physical damage without verification

**Reality**: Smashed drive may still have readable platters

**Fix**: Thorough destruction (shredding) or verify with professional service

## Tools and Services

### Free Software Tools

**Windows**:
- Eraser (open source)
- SDelete (Microsoft Sysinternals)
- Cipher.exe (built-in)

**Mac**:
- Disk Utility (built-in secure erase)
- Permanent Eraser

**Linux**:
- shred (built-in)
- wipe
- dd

**Cross-platform**:
- DBAN (Darik''s Boot and Nuke) - bootable disk wiper
- BleachBit

### Commercial Tools

**Software**:
- Blancco Drive Eraser (enterprise-grade)
- KillDisk
- WipeDrive

**Hardware**:
- Degaussers ($500-$5000+)
- Physical destruction devices

### Professional Services

**Look for**:
- NAID AAA certification
- On-site vs. off-site options
- Certificates of destruction
- Chain of custody
- Insurance coverage
- References and reviews

**Services provided**:
- Hard drive shredding
- Mobile device destruction
- Document shredding
- E-waste recycling (after destruction)

**Costs**:
- Per-drive: $5-$20
- Bulk rates available
- On-site services more expensive

## Legal and Regulatory Requirements

### GDPR (Europe)

**Requirements**:
- Right to erasure ("right to be forgotten")
- Secure disposal of personal data
- Documentation of disposal
- Processors must also comply

### HIPAA (Healthcare - US)

**Requirements**:
- Secure disposal of ePHI (electronic protected health information)
- Documented procedures
- Training for staff
- Business associate agreements include disposal

### FACTA (Financial - US)

**Requirements**:
- Proper disposal of consumer information
- Implement policies and procedures
- Train staff
- Due diligence on service providers

### SOX (Financial Reporting - US)

**Requirements**:
- Retention and disposal of financial records
- Documented procedures
- Audit trails

### Industry-Specific

**PCI DSS** (payment cards): Secure disposal of cardholder data
**FERPA** (education): Secure disposal of student records
**Various state laws**: Additional requirements

## Best Practices Summary

### For Organizations

1. **Implement comprehensive policy**:
   - Cover all media types
   - Define disposal methods
   - Assign responsibilities

2. **Use certified methods**:
   - NIST guidelines
   - DoD 5220.22-M standard
   - Industry best practices

3. **Document everything**:
   - What was disposed
   - When and how
   - Who performed disposal
   - Certificates retained

4. **Train staff**:
   - Proper procedures
   - Security importance
   - Their role in disposal

5. **Audit compliance**:
   - Regular reviews
   - Test procedures
   - Verify vendor performance

### For Individuals

1. **Encrypt from the start**:
   - Full disk encryption
   - Easier disposal later

2. **Plan before disposal**:
   - Backup needed data
   - Sign out of accounts
   - Document what''s on device

3. **Use appropriate method**:
   - Match method to sensitivity
   - SSD = secure erase or destruction
   - HDD = overwrite or destruction

4. **Verify disposal**:
   - Check data is gone
   - Test with recovery tools

5. **Don''t forget other copies**:
   - Cloud backups
   - Other devices
   - Network shares

## Emergency Data Disposal

### When Immediate Disposal Needed

**Scenarios**:
- Device lost or stolen (remote wipe)
- Imminent seizure
- Security breach in progress

**Methods**:

**Remote wipe** (phones, tablets, some laptops):
- Find My iPhone / Android Device Manager
- Mobile device management (MDM) tools
- Immediately wipes device

**Physical immediate destruction**:
- Drilling through platters
- Smashing with hammer (platters specifically)
- Incineration
- Note: Prevents recovery but not ideal

**Cryptographic**:
- Destroy encryption keys (if already encrypted)
- Instant data inaccessibility

## Key Takeaways

- "Delete" does not actually erase data - it only removes the pointer, leaving data recoverable
- Different disposal methods for different media: SSDs need Secure Erase, not overwriting
- For SSDs, use built-in ATA Secure Erase command - most effective and fast
- For HDDs, 1-3 pass overwrite sufficient for most purposes, physical destruction for high security
- Factory reset mobile devices AFTER encrypting - prevents data recovery
- Encrypt drives from the start - makes disposal easier via cryptographic erasure
- Organizations need documented disposal policies with certificates of destruction
- Use NAID AAA certified services for third-party disposal
- Don''t forget backups, cloud copies, and network storage in disposal plan
- GDPR gives users right to erasure - must have procedures to comply
- Remove SIM cards and SD cards before disposing mobile devices
- Cross-cut shred all paper documents with personal information
- Physical destruction (shredding) is most secure but makes drives unusable', 'https://www.youtube.com/watch?v=0ecoGqVHFIg', 7, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:53:03.811', '2026-01-19 11:42:54.698', '210e5ba8-c870-47ae-986f-c43c06367e9b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('299ed454-dd8f-4087-ac79-62f061f61231', 'Data Backup Strategies', '# Data Backup Strategies

## Why Backups Matter

Backups are your last line of defense against:
- Ransomware attacks
- Hardware failures
- Accidental deletion
- Natural disasters
- Theft

## The 3-2-1 Rule

**3** copies of your data
**2** different storage types (external drive + cloud)
**1** off-site backup

This ensures you can recover from any disaster.

## Backup Types

**Full Backup:**
- Complete copy of all data
- Slowest but simplest recovery
- Run weekly or monthly

**Incremental Backup:**
- Only changes since last backup
- Fastest, smallest
- Run daily

**Differential Backup:**
- Changes since last full backup
- Balance of speed and simplicity

## Backup Storage Options

**Local Backup:**
- External hard drive
- NAS (Network Attached Storage)
- Pros: Fast, you control it
- Cons: Vulnerable to physical damage

**Cloud Backup:**
- Backblaze, Carbonite, iDrive
- Pros: Off-site, disaster protection
- Cons: Slow restore, ongoing cost

**Hybrid Approach:**
- Local for speed
- Cloud for disaster recovery

## Backup Best Practices

**Test Regularly:**
- Verify backups work
- Practice restore procedures
- Test at least quarterly

**Automate:**
- Scheduled automatic backups
- No manual intervention
- Verify completion

**Encrypt:**
- Encrypt before upload
- Protect sensitive data
- Store encryption key separately

**Version Control:**
- Keep multiple versions
- Protect against gradual corruption
- 30-90 days of versions

**Ransomware Protection:**
- Air-gapped backups (offline)
- Immutable backups (can''t be modified)
- Separate credentials from production

## Key Takeaways

- Follow 3-2-1 rule: 3 copies, 2 media types, 1 off-site
- Automate backups - don''t rely on memory
- Test restores regularly - backups are useless if they don''t work
- Encrypt sensitive data before backing up
- Keep offline backup for ransomware protection
- Multiple versions protect against corruption
- Cloud + local provides best of both worlds', 'https://www.youtube.com/watch?v=WuqmXaCNw7M', 6, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:53:03.809', '2026-01-19 11:42:54.66', '210e5ba8-c870-47ae-986f-c43c06367e9b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('14cf2f60-cd10-4568-81a6-701eaaf3ec30', 'SMS and Voice Phishing', '# SMS and Voice Phishing (Smishing & Vishing)

## What is Smishing?

Smishing (SMS + Phishing) is phishing via text message.

Attackers send fraudulent SMS messages to:
- Steal credentials
- Install malware
- Trick victims into calling scammers
- Steal money directly

## What is Vishing?

Vishing (Voice + Phishing) is phishing via phone call.

Attackers call victims pretending to be:
- Bank representatives
- Tech support
- Government agencies
- Company executives

## Why SMS/Voice Phishing Works

### People Trust Phone Channels

Psychology:
- Phone calls seem more legitimate than emails
- Text messages feel personal
- Voice creates urgency and pressure
- Hard to verify caller identity

### Less Security Awareness

- Most training focuses on email phishing
- People less suspicious of texts/calls
- No spam filters for phone
- Caller ID can be spoofed

### Mobile Device Vulnerabilities

- Smaller screens = harder to spot red flags
- Typing on phone = less careful scrutiny
- Mix of personal and work on same device
- Using phone while distracted

## Common Smishing Tactics

### Package Delivery Scam

Text message:
- "Your package delivery failed"
- "Click here to reschedule"
- Link goes to fake website
- Steals credit card info or installs malware

### Banking Alert

- "Your account has been locked"
- "Suspicious activity detected"
- "Click to verify your identity"
- Link harvests banking credentials

### Prize/Sweepstakes

- "You''ve won a $1000 gift card!"
- "Claim your prize now"
- Requires payment of "taxes" or "fees"
- Or phishes personal information

### Two-Factor Authentication Bypass

- "Enter this code to verify your account"
- Attacker simultaneously trying to log into your account
- Your MFA code goes to them
- They use it to access your account

### COVID-19 / Current Events

- "Free COVID test kit - click to order"
- "Vaccine appointment available"
- "Stimulus payment - verify eligibility"
- Exploits current events and fear

## Common Vishing Tactics

### Tech Support Scam

Call claiming:
- "We detected virus on your computer"
- "Your Windows license has expired"
- "Your IP address has been compromised"
- Pressure to install remote access software
- Steal money or data

### IRS/Tax Scam

Caller claims:
- "You owe back taxes"
- "Warrant for your arrest"
- "Pay immediately or police will come"
- Demands gift cards or wire transfers

### Bank Fraud Alert

- "Suspicious charges on your account"
- "Need to verify recent transactions"
- Ask for account number, PIN, passwords
- Transfer money to "safe account"

### CEO Fraud (Over Phone)

- Attacker impersonates executive
- Calls finance/accounting
- "Urgent wire transfer needed"
- "Confidential acquisition"
- Bypasses normal approval process

### Social Security Scam

- "Your Social Security number has been suspended"
- "Fraudulent activity detected"
- "Verify your SSN to avoid arrest"
- Steals SSN and identity

## Red Flags - Smishing

**Message Content:**
- Urgent action required
- Threat of consequences
- Too good to be true offers
- Generic greetings ("Dear customer")
- Spelling/grammar errors

**Links:**
- Shortened URLs (bit.ly, tinyurl)
- Suspicious domains
- HTTP instead of HTTPS
- Misspelled company names

**Sender:**
- Unknown numbers
- International area codes
- Alphanumeric sender names
- Doesn''t match official company number

## Red Flags - Vishing

**Call Tactics:**
- Unsolicited call
- High pressure and urgency
- Threats of arrest or legal action
- Requests for immediate payment
- Asks you to buy gift cards
- Requests remote access to computer
- Won''t let you call back on official number

**Requests:**
- Social Security number
- Bank account details
- Credit card numbers
- Passwords or PINs
- One-time codes (MFA codes)

## Defending Against Smishing

### Don''t Click Links

- Never click links in unexpected texts
- Manually type website URL
- Use official app instead

### Verify Independently

- Call company using official number
- Check account via official website/app
- Don''t use contact info from suspicious text

### Report and Delete

- Forward to 7726 (SPAM) - carrier fraud reporting
- Report to FTC at ReportFraud.ftc.gov
- Delete the message
- Block the number

### Enable Spam Filtering

- Carrier spam blocking (AT&T, Verizon, T-Mobile)
- iPhone: Filter Unknown Senders
- Android: Enable spam protection

## Defending Against Vishing

### Verify Caller Identity

**Never trust caller ID** - easily spoofed

- Hang up
- Call back using official number
- Look up number independently
- Don''t use callback number they provide

### Remember: Legitimate Organizations Won''t...

- Call and ask for passwords
- Demand immediate payment
- Threaten arrest
- Request gift cards as payment
- Ask for remote access to computer
- Pressure you to act immediately

### Use Call Screening

- Let unknown calls go to voicemail
- Carrier call screening (Verizon Call Filter, AT&T Call Protect)
- Google Pixel Call Screen
- Don''t answer unknown international numbers

### Establish Verbal Passwords

For high-risk targets:
- Family password for emergencies
- Executive authentication phrase
- Verify identity before discussing sensitive topics

## If You Fall Victim

### Smishing Victim

1. Don''t click any more links
2. Change passwords immediately
3. Enable MFA if not already active
4. Run antivirus scan
5. Monitor accounts for unauthorized activity
6. Report to carrier and FTC
7. Consider credit freeze

### Vishing Victim

If you gave information:

**Gave SSN:**
- Place fraud alert with credit bureaus
- Consider credit freeze
- File identity theft report at IdentityTheft.gov
- Monitor credit reports

**Gave Bank Info:**
- Call bank immediately
- Freeze accounts
- Dispute unauthorized charges
- Open new accounts

**Gave Password:**
- Change immediately
- Check for unauthorized access
- Enable MFA

**Gave Remote Access:**
- Disconnect from internet
- Run full antivirus scan
- Change all passwords
- Check for unauthorized transactions

## Special Considerations

### Deepfake Voice Calls

Emerging threat:
- AI-generated voice mimics executive
- Sounds exactly like CEO/family member
- Difficult to detect

Defense:
- Verbal passwords
- Out-of-band verification
- Trust but verify
- Call back on known number

### Port-Out Scams (SIM Swapping)

Attacker ports your number:
- Transfers your phone number to their SIM
- Receives your calls and texts
- Intercepts MFA codes

Defense:
- Carrier PIN/password on account
- Port freeze
- Use authenticator app instead of SMS for MFA

## Enterprise Protections

**Phone System Security:**
- Call authentication
- Recording high-risk calls
- Verification procedures
- Training staff

**Verification Protocols:**
- Callback procedures
- Multi-person approval
- Out-of-band confirmation
- Authentication phrases

## Key Takeaways

- Smishing (SMS phishing) and vishing (voice phishing) are growing threats
- People less suspicious of phone-based attacks than email
- Never click links in unexpected text messages
- Verify independently - hang up and call official number back
- Caller ID can be spoofed - don''t trust it
- Legitimate organizations won''t ask for passwords, threaten arrest, or demand gift cards
- Use carrier spam blocking and call screening
- If victimized, act immediately - change passwords, freeze accounts, report fraud
- Enable MFA but use authenticator apps not SMS when possible
- Establish verbal passwords for high-risk scenarios
- Report smishing to 7726 (SPAM) and vishing to FTC', 'https://www.youtube.com/watch?v=QmJn4C2ZMKU', 6, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:53:03.796', '2026-01-19 11:42:54.668', '04626f01-23f6-4bf7-965b-1a82fa96a064');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('ac164df2-61d1-4330-a6dd-fdfe2faad2bb', 'Password Recovery and Reset', '# Password Recovery and Reset Best Practices

## The Password Reset Challenge

Password resets are necessary but create security vulnerabilities. Attackers frequently target password reset mechanisms to gain unauthorized access.

Balance needed: Easy enough for legitimate users, secure enough to prevent abuse.

## Common Password Reset Methods

### Security Questions

**How It Works:**
- Answer pre-defined questions
- If correct, reset password

**Security Problems:**
- Answers often public (mother''s maiden name on Facebook)
- Easily guessable (favorite color, pet name)
- Don''t change over time
- Can be socially engineered

**If You Must Use:**
- Lie in your answers (document fake answers in password manager)
- Use nonsense answers
- Treat answers like passwords

### Email-Based Reset

**How It Works:**
- Click "Forgot Password"
- Reset link sent to email
- Click link, create new password

**Security Considerations:**
- Only as secure as your email account
- Email compromise = account compromise
- Reset links should expire quickly (15-30 minutes)
- Links should be single-use

**Best Practices:**
- Secure email with strong password + MFA
- Use separate email for important accounts
- Monitor email for unexpected reset requests

### SMS/Phone Verification

**How It Works:**
- Enter phone number
- Receive verification code via SMS
- Enter code to reset password

**Security Issues:**
- SIM swapping attacks
- SMS interception
- Phone number portability
- Not all countries supported

**Better Alternative:**
- Authenticator app codes
- Hardware security keys
- Email verification

### Account Recovery Codes

**How It Works:**
- Generate recovery codes during account setup
- Store codes securely
- Use code to regain access if locked out

**Implementation:**
- One-time use codes
- 8-10 codes provided
- Download and store securely
- Print and keep in safe place

**Best Practice:**
- Generate codes immediately after enabling MFA
- Store in password manager
- Keep paper backup in secure location
- Never share recovery codes

### Trusted Contacts / Social Recovery

**How It Works:**
- Designate trusted friends/family
- If locked out, contacts receive codes
- Combine codes to regain access

**Used By:**
- Facebook (Trusted Contacts)
- Some cryptocurrency wallets

**Considerations:**
- Choose trustworthy contacts
- Contacts must keep codes secure
- Coordination required for recovery

## Account Takeover via Password Reset

### Common Attack Vectors

**Email Compromise:**
- Attacker gains access to email
- Requests password resets for all accounts
- Changes passwords before victim notices

**SIM Swapping:**
- Attacker convinces carrier to port number
- Receives SMS verification codes
- Resets passwords using SMS

**Social Engineering:**
- Call support pretending to be account holder
- Provide "proof" (publicly available info)
- Convince support to reset password

**Security Question Guessing:**
- Research victim on social media
- Answer security questions correctly
- Reset password

### Indicators of Account Takeover Attempt

Watch for:
- Password reset emails you didn''t request
- SMS codes you didn''t request
- Account lockout notifications
- "Your password was changed" confirmations
- Unusual login locations

**If You See These:**
1. Don''t ignore them
2. Check account immediately
3. Change password if compromised
4. Enable MFA if not already active
5. Review recent account activity
6. Alert support if unauthorized changes

## Secure Password Reset Process Design

### For Organizations Implementing Resets

**Multi-Factor Verification:**
- Require more than one verification method
- Email + SMS
- Security questions + email
- Authenticator app + recovery code

**Identity Verification:**
- Recent transaction details
- Account-specific information
- Previous password (sometimes)
- Customer service callback

**Rate Limiting:**
- Limit reset attempts (3-5 per hour)
- Increasing delays between attempts
- Account lockout after excessive attempts
- Prevents brute force attacks

**Notifications:**
- Email notification when password changed
- Include details: time, IP address, device
- Provide "This wasn''t me" button
- Allow reverting unauthorized changes

**Secure Link Design:**
- Long, random tokens (128+ bits)
- Short expiration (15-30 minutes)
- Single-use only
- Invalidate after use or expiration

### What NOT to Do

**Bad Practices:**
- Emailing passwords in plaintext
- Permanent reset links
- No rate limiting
- Only security questions
- Sending password over SMS
- Allowing reset without verification

## User Best Practices

### Preventing Need for Resets

**Use Password Manager:**
- Store all passwords securely
- Never forget passwords
- Reduces reset frequency
- Enable cloud sync for access everywhere

**Enable Biometric Unlock:**
- Fingerprint for password manager
- Face ID unlock
- Reduces need to remember master password

**Write Down Master Password:**
- Paper copy in secure location
- Not on computer
- Safe, safety deposit box
- Only for password manager master password

### Preparing for Account Recovery

**Before You Need It:**
1. Enable MFA on all accounts
2. Generate and save recovery codes
3. Add recovery email address
4. Add recovery phone number
5. Document accounts in password manager
6. Keep recovery info updated

**Recovery Information Storage:**
- Password manager (recovery codes)
- Secure notes (account details)
- Encrypted file backup
- Physical safe (paper backup)

### If You''re Locked Out

**Step-by-Step Recovery:**

1. **Try All Known Passwords:**
   - Recent passwords
   - Common variations
   - Check password manager

2. **Use Recovery Codes:**
   - Locate saved codes
   - Enter one-time code
   - Generate new codes after recovery

3. **Password Reset:**
   - Use official website only
   - Never through email links
   - Verify you''re on legitimate site

4. **Contact Support:**
   - Use official support channels
   - Provide verification information
   - Be patient - security takes time

5. **After Recovery:**
   - Change password immediately
   - Enable MFA if not active
   - Review account activity
   - Update recovery info

## Protecting Against Reset Attacks

### Email Security

Your Email is the Keys to the Kingdom:
- Strongest password + MFA
- Separate email for important accounts
- Monitor for unauthorized access
- Enable login notifications

### Phone Security

**Prevent SIM Swapping:**
- Carrier PIN/password on account
- Port freeze request
- Don''t use SMS for MFA (use authenticator app)
- Monitor for unexpected carrier messages

**Secure Phone Number:**
- Don''t post phone publicly
- Opt out of data brokers
- Google Voice for public-facing number

### Monitor Your Accounts

**Regular Checks:**
- Weekly login to important accounts
- Review recent activity
- Check connected devices
- Verify contact information hasn''t changed

**Set Up Alerts:**
- Login notifications
- Password change alerts
- Account settings changes
- Unusual activity alerts

## Enterprise Password Reset Security

### Help Desk Procedures

**Identity Verification:**
- Never reset based on email alone
- Verify through multiple factors
- Employee ID + manager confirmation
- Recent payroll/HR information
- Call back to known number

**Documentation:**
- Log all reset requests
- Record verification steps
- Unusual requests flagged
- Audit trail for security reviews

### Self-Service Password Reset

**Security Requirements:**
- Multiple verification factors
- Rate limiting
- IP reputation checking
- Device fingerprinting
- Risk-based authentication

**User Enrollment:**
- Register recovery methods during onboarding
- Periodic re-verification
- Multiple recovery options
- Backup authentication methods

## Password Reset vs Account Recovery

**Password Reset:**
- You know your username/email
- Forgot password only
- Relatively quick
- Standard security questions/email

**Account Recovery:**
- Locked out completely
- Lost MFA device
- Email compromised
- More intensive verification
- May require ID verification
- Longer process (days/weeks)

## Key Takeaways

- Password resets are necessary but create security vulnerabilities
- Email-based reset is most common - secure your email with strong password + MFA
- Security questions are weak - use fake answers if required
- Generate and store recovery codes immediately after enabling MFA
- SMS verification is vulnerable to SIM swapping - prefer authenticator apps
- Never ignore unexpected password reset emails - they indicate attack attempt
- Reset links should expire quickly (15-30 minutes) and be single-use
- Use password manager to prevent need for frequent resets
- Monitor accounts regularly for unauthorized access
- For organizations: multi-factor verification, rate limiting, and notifications required
- Your email is the keys to the kingdom - protect it above all else', 'https://www.youtube.com/watch?v=aHaBH4LqGsw', 6, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:53:03.804', '2026-01-19 11:42:54.67', '96406223-7051-43d7-901a-55878daeba07');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('b68e58fd-e2fd-467f-a235-60b6c491cb86', 'Security Questions Best Practices', '# Security Questions Best Practices

## What Are Security Questions?

Security questions are fallback authentication method asking personal questions to verify identity during account recovery or high-risk transactions.

Common examples:
- "What is your mother''s maiden name?"
- "What city were you born in?"
- "What was your first pet''s name?"
- "What is your favorite color?"

## The Fundamental Problem

Security questions are inherently insecure because:
- Answers are often public information
- Answers don''t change over time
- Answers are easy to guess or research
- Social engineering can extract answers
- Multiple people may know the answers

## Why Security Questions Exist

### Historical Context

Created before modern authentication methods:
- Pre-MFA era
- Alternative to password reset via support call
- Seemed personal and secure at the time

### Current Usage

Still used by:
- Legacy systems
- Financial institutions
- Government websites
- Banks (regulatory requirements)
- Password recovery flows

### Regulatory Requirements

Some industries required to use them:
- Financial services (FFIEC guidance)
- Healthcare (HIPAA interpretations)
- Government systems

## Common Security Questions and Their Weaknesses

### Easily Researched Questions

**"What is your mother''s maiden name?"**
- Public records (birth certificates, genealogy sites)
- Facebook, LinkedIn profiles
- Wedding announcements
- Ancestry.com, FamilySearch

**"What city were you born in?"**
- Public records
- LinkedIn profiles
- Social media check-ins
- Resumes, bios

**"What high school did you attend?"**
- Facebook profiles
- LinkedIn education
- Yearbooks online
- Alumni directories

**"What was your first car?"**
- DMV records (in some states)
- Social media posts
- Car enthusiast forums
- Insurance records

### Easily Guessable Questions

**"What is your favorite color?"**
- Limited options
- Can be brute-forced
- May be mentioned on social media

**"What is your favorite food?"**
- Common answers
- Limited variations
- Cultural patterns

**"What is your favorite movie/book?"**
- Often shared publicly
- Popular culture limits options
- Social media, reading lists

### Questions with Changing Answers

**"What is the name of your best friend?"**
- Changes over time
- Multiple people could qualify
- Ambiguous

**"What is your favorite sports team?"**
- Can change
- Bandwagon effect
- May have multiple favorites

## Attack Vectors

### Social Media Mining

Attackers use Facebook, LinkedIn, Twitter to find:
- Birthplace
- High school/college
- Family names
- Pet names
- Favorite teams
- Personal interests

**One study:** 97% of security question answers found on social media.

### Data Breaches

Leaked databases contain:
- Historical security questions
- Answers from other sites
- Cross-referenced with email

Once your answers leak, they''re compromised forever.

### Social Engineering

Attackers call pretending to be:
- Old friend
- Surveyor
- HR representative
- IT support

Casual conversation extracts answers.

### Public Records

Easily accessible:
- Birth certificates (city, parents'' names)
- Marriage licenses (maiden names)
- Property records (addresses)
- Court documents
- Voter registration

## Best Practices for Users

### Strategy 1: Lie Systematically

**Treat Security Answers Like Passwords:**
- Create fake answers
- Store in password manager
- Never use real information

**Example:**
- Question: "Mother''s maiden name?"
- Real answer: Smith
- Your answer: "PurpleElephant47!"

**Benefits:**
- Can''t be researched
- Can''t be guessed
- Unique to each site

**Requirement:**
- Must document fake answers
- Store in password manager
- Without documentation, you''ll forget

### Strategy 2: Use Password-Like Answers

**Create Strong, Random Answers:**
- Question: "First pet''s name?"
- Answer: "8jK#mP2$vN9q"

**Benefits:**
- Maximum security
- Impossible to guess or research
- Strong as passwords

**Downsides:**
- May not work with validation
- Some sites enforce answer format
- Support agents can''t verify by phone

### Strategy 3: Consistent Fake Formula

**Create System for Fake Answers:**
- First pet: "Purple" + question number + "Elephant"
- Mother''s maiden: "Blue" + account name + "Dragon"
- City born: "Green" + service type + "Phoenix"

**Example:**
- Bank asks city born: "GreenFinancePhoenix"
- Email asks city born: "GreenEmailPhoenix"

**Benefits:**
- Don''t need to store if formula is memorized
- Unique per site
- Impossible to research

**Risks:**
- Formula must be truly memorable
- If one leaks, pattern might be guessed

### Strategy 4: Use Password Manager

**Modern Password Managers Support Security Questions:**
- Store questions and answers
- Generate random answers
- Auto-fill when needed
- Sync across devices

**Best Practice:**
- Create secure note for each account
- Document all security questions
- Use generated random answers
- Never reuse answers across sites

## Best Practices for Organizations

### Avoid Security Questions

**Better Alternatives:**
- Multi-factor authentication
- Email-based verification
- SMS codes (though also flawed)
- Authenticator apps
- Hardware security keys
- Account recovery codes

**If You Must Use Questions:**
- Make them optional, not required
- Use as additional factor, not sole factor
- Allow users to write custom questions

### Improved Question Design

**Better Question Characteristics:**
- Not easily researched
- Not easily guessed
- Consistent answer over time
- Memorable for user
- Specific enough to be unique

**Poor Questions:**
- Mother''s maiden name
- City you were born
- First pet''s name

**Better Questions:**
- "What is the last name of your 3rd grade teacher?"
- "What was the street name of your childhood home?"
- "What was the model of your second car?"

**Best: Custom Questions**
- Allow users to write their own questions
- Reduces guessability
- More memorable for legitimate user

### Security Measures

**Rate Limiting:**
- Limit incorrect answer attempts
- 3-5 attempts before lockout
- Exponential backoff

**Multi-Factor Recovery:**
- Security question + email verification
- Security question + SMS code
- Never rely on questions alone

**Monitoring:**
- Alert on failed attempts
- Track IP addresses
- Flag suspicious patterns

## When You Have No Choice

### Forced to Use Security Questions

Some situations you can''t avoid them:
- Bank requires them
- Government website mandate
- Legacy system

**Minimum Security:**
1. Never use real answers
2. Create and store fake answers
3. Use unique answers per site
4. Enable all other security options available
5. Monitor account for unauthorized access

### Phone-Based Verification Risks

**Support Agent Can See Answers:**
- Some systems show answers to support
- Fake answers may confuse legitimate support
- Consider believable fake answers for this scenario

**Balance:**
- "Mother''s maiden name: Johansson" (fake but believable)
- Better than real but worse than random string

## Alternatives to Security Questions

### Knowledge-Based Authentication (KBA)

**Out-of-Wallet Questions:**
- Based on credit report data
- Previous addresses
- Loan amounts
- Account opening dates

**Better because:**
- Not public information
- Harder to research
- Changes over time

**Still flawed:**
- Credit bureau data breaches
- Social engineering
- Not available to young people

### Risk-Based Authentication

**Contextual Verification:**
- Device fingerprinting
- Location patterns
- Behavior analysis
- Time of access

**Example:**
- Login from new location → additional verification
- Unusual transaction amount → step-up authentication

### Biometrics

**Fingerprint, Face ID:**
- Difficult to fake
- Convenient for users
- Hardware-backed security

**Limitations:**
- Requires specific hardware
- Can''t be changed if compromised
- Privacy concerns

### Hardware Security Keys

**YubiKey, Titan Key:**
- Physical device required
- Phishing-resistant
- Most secure option

**Considerations:**
- Costs money
- Can be lost (need backup)
- Not universally supported

## Security Questions in 2024 and Beyond

### Industry Movement

**Declining Usage:**
- Major tech companies eliminating them
- MFA becoming standard
- Better alternatives available

**Remaining Usage:**
- Financial institutions (regulations)
- Government systems (slow to change)
- Legacy platforms

### Future Outlook

**Expected Trajectory:**
- Gradual phase-out over 5-10 years
- Replaced by MFA and passwordless
- May persist in regulated industries
- Historical artifact like floppy disk icon

## Key Takeaways

- Security questions are fundamentally insecure - answers often public or guessable
- Never use real answers - treat security questions like passwords with fake answers
- Store fake answers in password manager - you will forget them otherwise
- Best practice: generate random, password-like answers for each question
- Social media makes traditional questions easy to research
- Attackers can find 97% of security question answers online
- Organizations should avoid security questions - use MFA instead
- If forced to use: create believable fake answers, store securely, never reuse
- Multi-factor recovery combines questions with email/SMS verification
- Future: security questions declining as MFA and passwordless auth become standard
- Password managers can store and generate security question answers', 'https://www.youtube.com/watch?v=_cHbL2lsUHU', 8, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:53:03.807', '2026-01-19 11:42:54.673', '96406223-7051-43d7-901a-55878daeba07');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('b1c931cd-4aa5-415e-a7e4-e2d9a4183aad', 'Quid Pro Quo Attacks', '# Quid Pro Quo Attacks

## What is a Quid Pro Quo Attack?

**Definition**: A social engineering attack where the attacker offers a service or benefit in exchange for information or access.

**Latin meaning**: "Something for something" or "this for that"

**Key characteristic**: Creates sense of fair exchange to lower victim''s defenses

## How Quid Pro Quo Attacks Work

### The Basic Mechanism

1. **Offer something valuable**
   - Technical support
   - Free software/service
   - Access to exclusive content
   - Research participation payment

2. **Request something in return**
   - Login credentials
   - System access
   - Sensitive information
   - Installation of software

3. **Victim perceives fair trade**
   - Feels like legitimate exchange
   - Lower suspicion than direct request

## Common Quid Pro Quo Scenarios

### Fake Tech Support

**Scenario**: Attacker calls claiming to be from IT support:
- "We''re conducting system upgrades today"
- "I can help speed up your computer"
- "Just need your password to complete the update"

**Why it works**:
- Tech support requests aren''t unusual
- Users want their problems fixed
- Seems like a fair exchange: help for credentials

### Survey or Research Scams

**Scenario**: Email or call offering payment for survey participation:
- "Complete this 5-minute survey for $50 gift card"
- "Academic research - compensation provided"
- Survey asks for personal information or requires software installation

**Red flags**:
- Unsolicited research invitations
- Requires more information than relevant
- Payment requires unusual verification

### Free Software or Services

**Scenario**: Offer of free premium software:
- "Free antivirus installation"
- "Complimentary system optimization"
- Software contains malware or requires sensitive information

**Attack vector**:
- Trojan horses in "free" software
- Keyloggers in "security" tools
- Remote access trojans (RATs)

### Wi-Fi or Network Access

**Scenario**: In public spaces:
- Free Wi-Fi hotspots (actually attacker-controlled)
- "Free charging station" USB ports
- "Network upgrade" that requires credentials

**Dangers**:
- Man-in-the-middle attacks
- Credential harvesting
- Device compromise via USB

## Real-World Examples

### Case Study 1: The Fake IT Helpdesk (2019)

**Attack**: Scammers called employees claiming to be IT support
- Offered to "fix slow computer issues"
- Requested login credentials to "run diagnostics"
- Gained access to 40+ accounts

**Result**: Data breach affecting 10,000+ customers

**Lesson**: Always verify IT support identity through known channels

### Case Study 2: The Research Survey Scam (2021)

**Attack**: Emails from "university researchers" offering Amazon gift cards
- Professional-looking survey about workplace technology
- Asked for company email credentials to "verify employment"
- Harvested credentials from 200+ victims across multiple companies

**Result**: Compromised corporate email accounts used for BEC attacks

**Lesson**: Legitimate research never asks for passwords

### Case Study 3: The Free Antivirus Trap (2020)

**Attack**: Pop-up ads offering free antivirus scans
- "Your computer is infected! Download free scanner"
- Software actually installed ransomware
- Demanded payment to "fix" the problems

**Result**: Thousands of computers encrypted, millions in ransom payments

**Lesson**: Only download security software from official sources

## Distinguishing Quid Pro Quo from Similar Attacks

### vs. Phishing
- **Phishing**: Impersonation without explicit exchange offer
- **Quid Pro Quo**: Explicit service/benefit offered in exchange

### vs. Baiting
- **Baiting**: Temptation with no explicit exchange (infected USB left in parking lot)
- **Quid Pro Quo**: Clear exchange proposition ("I''ll help if you provide...")

### vs. Pretexting
- **Pretexting**: Fabricated scenario to extract information
- **Quid Pro Quo**: Exchange-based with service offer

## Detection Strategies

### Red Flags to Watch For

1. **Unsolicited offers**
   - Unexpected tech support
   - Random survey invitations
   - Free services you didn''t request

2. **Pressure or urgency**
   - "Limited time offer"
   - "Must act now to receive benefit"
   - "Offer expires today"

3. **Requests for sensitive information**
   - Passwords or credentials
   - Social Security numbers
   - Financial information
   - System access

4. **Too good to be true**
   - Excessive compensation for minimal effort
   - Free premium services
   - Unusual generosity from unknown parties

5. **Communication inconsistencies**
   - Generic email addresses
   - Poor grammar or spelling
   - Unofficial phone numbers
   - Mismatched sender information

## Protection Best Practices

### For Individuals

1. **Verify independently**
   - Never trust unsolicited offers
   - Look up official contact information
   - Call back on known, verified numbers

2. **Question the exchange**
   - Why is this being offered?
   - What''s really being requested?
   - Is this a normal process?

3. **Never share credentials**
   - IT never needs your password
   - Legitimate surveys don''t ask for passwords
   - No service is worth compromising security

4. **Use official channels**
   - Download software from official websites only
   - Contact support through verified channels
   - Verify offers directly with companies

5. **Report suspicious offers**
   - Alert IT security team
   - Report to manager
   - Warn colleagues

### For Organizations

1. **Establish verification protocols**
   - IT support uses ticket systems
   - No unsolicited password requests
   - Clear process for legitimate support

2. **Education and awareness**
   - Train employees on quid pro quo tactics
   - Share examples and scenarios
   - Regular security reminders

3. **Technical controls**
   - Monitor for unauthorized software installations
   - Restrict download permissions
   - Network segmentation
   - Endpoint detection and response (EDR)

4. **Clear support procedures**
   - Documented IT support processes
   - Official contact information widely published
   - Ticket system for all support requests

5. **Incident response**
   - Clear reporting process
   - No blame culture
   - Quick investigation of reports

## Testing and Simulation

### Red Team Exercises

Organizations can test defenses with authorized quid pro quo simulations:

**Scenario 1: Fake Tech Support Call**
- Security team calls employees offering "system upgrades"
- Measures how many provide credentials
- Provides training to those who fall for it

**Scenario 2: Survey Emails**
- Send simulated research survey emails
- Track who clicks and provides information
- Follow up with targeted training

**Results typically show**:
- 15-30% of untrained employees fall for quid pro quo attacks
- Training reduces success rate to 5-10%
- Regular testing maintains awareness

## If You''ve Been Targeted

### Immediate Actions

1. **Don''t comply**
   - Refuse the exchange
   - End the communication
   - Don''t provide any information

2. **Verify independently**
   - Contact the supposed organization directly
   - Use official phone numbers/websites
   - Ask if the offer is legitimate

3. **Report the attempt**
   - IT security team
   - Manager or supervisor
   - Appropriate authorities if financial fraud

### If You Already Complied

1. **Immediate notification**
   - Alert IT security IMMEDIATELY
   - Time is critical for containment

2. **Change credentials**
   - Reset all passwords
   - Enable MFA if not already active
   - Log out all active sessions

3. **Monitor for abuse**
   - Watch for unauthorized access
   - Check account activity
   - Monitor financial accounts

4. **Document everything**
   - Save all communications
   - Note what information was shared
   - Provide details to security team

## The Psychology Behind Quid Pro Quo

### Why It Works

1. **Reciprocity principle**
   - Humans feel obligated to return favors
   - "They''re helping me, I should help them"

2. **Authority bias**
   - Tech support = authority figures
   - We trust claimed expertise

3. **Perceived fairness**
   - Feels like legitimate exchange
   - Lowers suspicion

4. **Desire for benefits**
   - Everyone wants free stuff
   - Gift cards and compensation are tempting

5. **Helpfulness**
   - People want to be helpful
   - Saying "no" feels rude

## Emerging Trends

### Modern Quid Pro Quo Tactics

1. **Cryptocurrency offers**
   - "Free crypto for account verification"
   - Requires wallet credentials or seed phrases

2. **Remote work support**
   - "VPN setup assistance"
   - "Home network security check"
   - Exploits distributed workforce

3. **AI-powered personalization**
   - Offers tailored to individual interests
   - More convincing exchanges
   - Harder to recognize as generic scam

4. **Social media exchanges**
   - "Verify account for blue checkmark"
   - "Get more followers with our tool"
   - "Free social media audit"

## Key Takeaways

- Quid pro quo attacks offer services in exchange for information or access
- Real IT support NEVER asks for your password - no exceptions
- Unsolicited offers of help or benefits are red flags - always verify independently
- If an offer seems too good to be true, it probably is
- Legitimate surveys and research never require passwords or system access
- Only download software from official, verified sources
- When in doubt, contact the organization directly through known channels
- Report all suspicious offers to your security team - helps protect others
- Think twice before accepting any unsolicited offer, no matter how helpful it seems
- The exchange may seem fair, but you''re trading security for temporary convenience', 'https://www.youtube.com/watch?v=NB8OceGZGjA', 6, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:53:03.815', '2026-01-19 11:42:54.678', 'baf30430-fd72-4ef1-b8dd-7e9ee003353b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('ac23ee90-ab93-4bd2-9268-8a1e64bf1381', 'Watering Hole Attacks', '# Watering Hole Attacks

## What is a Watering Hole Attack?

**Definition**: A targeted cyberattack where attackers compromise websites frequently visited by their intended victims, then use these sites to deliver malware or steal credentials.

**Name origin**: Like predators waiting at watering holes where prey gather, attackers compromise sites where targets congregate.

**Target**: Specific groups (industry, organization, profession) rather than individual users

## How Watering Hole Attacks Work

### The Attack Chain

1. **Target Identification**
   - Attacker identifies target group (e.g., defense contractors)
   - Researches websites frequently visited by targets

2. **Website Compromise**
   - Attacker compromises one or more frequently visited sites
   - Common targets: industry news sites, professional forums, supplier websites

3. **Malware Deployment**
   - Infected website serves malware to visitors
   - Often uses zero-day exploits
   - May target specific browser/OS combinations

4. **Victim Infection**
   - Target employees visit compromised site in normal course of work
   - Malware automatically downloads (drive-by download)
   - Attackers gain foothold in target organization

5. **Lateral Movement**
   - From initial foothold, attackers move through network
   - Escalate privileges
   - Exfiltrate data

## Why Watering Hole Attacks Are Effective

### Bypassing Traditional Security

1. **Trusted websites**
   - Sites are legitimate and normally safe
   - Not blocked by web filters
   - Users have no reason to suspect danger

2. **No direct targeting**
   - No phishing email to detect
   - No suspicious download request
   - Happens through normal browsing

3. **Supply chain exploitation**
   - Compromises trusted third parties
   - Leverages existing relationships
   - Hard to defend against

4. **Advanced techniques**
   - Often uses zero-day exploits
   - Targets specific vulnerabilities
   - Difficult to detect immediately

## Real-World Examples

### Case Study 1: Operation Aurora (2010)

**Target**: Google and 30+ major tech companies

**Method**:
- Attackers compromised Chinese-language websites
- Sites visited by Chinese employees at target companies
- Deployed zero-day Internet Explorer exploit

**Impact**:
- Successful intrusion into Google''s networks
- Theft of intellectual property
- Led to Google''s exit from China

**Lessons**: Even tech giants vulnerable; need defense-in-depth

### Case Study 2: Department of Labor Website (2011)

**Target**: Nuclear industry and defense contractors

**Method**:
- Compromised legitimate U.S. Department of Labor website
- Added malicious code targeting nuclear energy sector
- Exploited Internet Explorer vulnerability

**Impact**:
- Multiple organizations in nuclear industry compromised
- Demonstrated government sites can be watering holes

**Lessons**: Even government websites can be compromised; verify security of all sites

### Case Study 3: Forbes.com Compromise (2014)

**Target**: Financial sector and government entities

**Method**:
- Forbes.com compromised to serve malware
- Used "Lightsout" exploit kit
- Targeted specific companies and agencies

**Impact**:
- Major media site served malware for days
- Thousands of visitors potentially exposed

**Lessons**: High-profile sites aren''t immune; assume all sites could be compromised

### Case Study 4: Ukrainian Power Grid Attack (2015-2016)

**Target**: Ukrainian critical infrastructure

**Method**:
- Compromised popular Ukrainian news sites
- Delivered malware to industrial control system operators
- Part of broader BlackEnergy campaign

**Impact**:
- Contributed to power grid attacks
- First confirmed cyberattack to cause power outage

**Lessons**: Watering holes can target critical infrastructure; geopolitical attacks use this technique

### Case Study 5: TEMP.Periscope Campaign (2018)

**Target**: Maritime and defense industries

**Method**:
- Compromised specialized engineering and maritime industry sites
- Targeted companies in Southeast Asian shipping sector
- Used browser exploits for malware delivery

**Impact**:
- Multiple defense and engineering firms compromised
- Intellectual property theft

**Lessons**: Niche industry sites are targets; attackers research target browsing habits

## Attack Variations

### Strategic Web Compromise (SWC)

**Broader version** of watering hole:
- Compromise many websites
- Wait for interesting targets to visit
- Opportunistic rather than targeted

### Supply Chain Watering Hole

**Compromise supplier/vendor sites**:
- Target companies that serve your actual target
- Software update mechanisms
- Third-party service portals

### Mobile Watering Holes

**Target mobile users**:
- Compromise mobile-optimized sites
- Target mobile OS vulnerabilities
- Exploit mobile browser weaknesses

## Detection Strategies

### For Organizations

1. **Network monitoring**
   - Monitor for unusual traffic patterns
   - Detect command-and-control communications
   - Analyze DNS queries for suspicious domains

2. **Endpoint detection**
   - Endpoint Detection and Response (EDR) tools
   - Monitor for exploitation attempts
   - Detect unusual process behavior

3. **Threat intelligence**
   - Subscribe to threat intelligence feeds
   - Monitor for compromised sites in your industry
   - Share intelligence with industry peers

4. **Log analysis**
   - Correlate web proxy logs with endpoint alerts
   - Identify patterns across multiple users
   - Detect exploitation attempts

### Warning Signs

1. **Technical indicators**
   - Unusual JavaScript on legitimate sites
   - Redirects to unexpected domains
   - Browser crashes or slowness
   - Unexpected pop-ups on trusted sites

2. **Behavioral indicators**
   - Multiple users reporting similar issues with same site
   - Endpoint security alerts when visiting specific sites
   - Network traffic to unusual destinations

## Protection Best Practices

### For Organizations

1. **Defense-in-depth strategy**
   - Multiple layers of security controls
   - Assume any site could be compromised
   - Don''t rely solely on web filtering

2. **Patch management**
   - Keep all software updated
   - Prioritize browser and plugin updates
   - Test and deploy patches quickly

3. **Browser security**
   - Use modern browsers with automatic updates
   - Disable unnecessary plugins (Flash, Java)
   - Implement browser isolation technology

4. **Application whitelisting**
   - Only allow approved applications to run
   - Prevents drive-by malware execution
   - Requires management overhead but very effective

5. **Network segmentation**
   - Limit lateral movement opportunities
   - Separate critical systems from general network
   - Implement zero-trust architecture

6. **Threat intelligence**
   - Monitor for compromised industry sites
   - Subscribe to security bulletins
   - Participate in industry ISACs (Information Sharing and Analysis Centers)

7. **User awareness**
   - Train users to report suspicious behavior
   - Encourage reporting even on trusted sites
   - No blame for false positives

### For Individuals

1. **Keep software updated**
   - Enable automatic updates for OS and browsers
   - Update plugins promptly
   - Consider uninstalling Flash and Java

2. **Use security software**
   - Endpoint protection with behavior monitoring
   - Keep security software updated
   - Don''t disable security warnings

3. **Be cautious even on trusted sites**
   - Report unusual behavior even on familiar sites
   - Don''t ignore browser security warnings
   - Be suspicious of unexpected pop-ups or downloads

4. **Use different devices for different purposes**
   - Separate work and personal browsing
   - Use dedicated devices for high-value transactions
   - Consider using virtual machines for risky browsing

## Advanced Protection Techniques

### Browser Isolation

**How it works**:
- Web browsing occurs in isolated container or cloud
- Malicious code can''t reach actual endpoint
- User sees rendered page, not active code

**Benefits**:
- Protection even from zero-day exploits
- Works against drive-by downloads
- No impact on user experience

**Implementations**:
- Remote browser isolation (RBI)
- Virtual desktop infrastructure (VDI)
- Containerized browsing

### Threat Intelligence Integration

**Proactive defense**:
- Automatically block known compromised sites
- Feed threat intel to security tools
- Update defenses based on emerging campaigns

**Sources**:
- Commercial threat intelligence feeds
- Open source intelligence (OSINT)
- Industry ISACs
- Government advisories

## If Your Organization Is Targeted

### Incident Response Steps

1. **Identification**
   - Determine extent of compromise
   - Identify patient zero
   - Map attack timeline

2. **Containment**
   - Isolate affected systems
   - Block malicious domains/IPs
   - Prevent lateral movement

3. **Investigation**
   - Conduct forensic analysis
   - Identify what was accessed/stolen
   - Determine attack vector and tools

4. **Eradication**
   - Remove malware and backdoors
   - Patch exploited vulnerabilities
   - Eliminate attacker access

5. **Recovery**
   - Restore systems from clean backups
   - Verify systems are clean
   - Monitor for reinfection attempts

6. **Lessons learned**
   - Document incident
   - Identify security gaps
   - Update defenses and procedures

## The Bigger Picture

### Why Attackers Use Watering Holes

1. **High success rate**
   - Targets trust the websites
   - Normal business activity triggers infection
   - Hard to prevent entirely

2. **Scalability**
   - Compromise one site, reach many targets
   - Passive attack - no per-target effort
   - Can run for extended periods

3. **Attribution difficulty**
   - Attack infrastructure is legitimate site
   - Harder to trace back to attacker
   - Site owner may be unaware of compromise

4. **Bypass security awareness**
   - Users trained to avoid suspicious links
   - But not trained to distrust legitimate sites
   - Social engineering protection ineffective

## Industry-Specific Considerations

### High-Risk Industries

**More likely to be targeted**:
- Defense contractors
- Critical infrastructure
- Financial services
- Healthcare
- Technology companies
- Government agencies

**Mitigation strategies**:
- Enhanced monitoring
- Stricter access controls
- Air-gapped networks for critical systems
- Mandatory browser isolation

## Emerging Trends

### Modern Watering Hole Tactics

1. **Supply chain focus**
   - Targeting smaller suppliers
   - Compromise update mechanisms
   - Exploit trusted relationships

2. **Mobile targeting**
   - iOS and Android browser exploits
   - Mobile-specific sites
   - BYOD vulnerabilities

3. **Cloud service watering holes**
   - Compromise cloud SaaS platforms
   - Target popular collaboration tools
   - Exploit OAuth flows

4. **AI-powered selection**
   - Machine learning to identify optimal targets
   - Automated compromise of multiple sites
   - Dynamic payload selection

## Key Takeaways

- Watering hole attacks compromise legitimate websites to reach specific target groups
- Even trusted, regularly visited sites can be compromised and serve malware
- No amount of user training fully prevents watering holes - need technical controls
- Keep all software updated, especially browsers and operating systems
- Organizations should use threat intelligence to monitor for compromised industry sites
- Browser isolation provides strong protection against drive-by downloads
- Defense-in-depth is essential - multiple security layers needed
- Network segmentation limits damage if initial compromise succeeds
- Endpoint Detection and Response (EDR) tools help detect exploitation attempts
- Report unusual behavior even on trusted sites - helps catch attacks early
- High-value targets should consider dedicated devices for sensitive work
- Assume any website could be compromised - trust but verify', 'https://www.youtube.com/watch?v=8jq5eWKw39I', 7, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:53:03.817', '2026-01-19 11:42:54.68', 'baf30430-fd72-4ef1-b8dd-7e9ee003353b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('0ca548a6-3c3c-478d-9d9a-2b87cfff6032', 'Social Engineering Red Flags', '# Social Engineering Red Flags

## What Are Social Engineering Red Flags?

**Definition**: Warning signs that indicate someone may be attempting to manipulate you into revealing sensitive information, granting access, or taking unsafe actions.

**Why they matter**: Recognizing red flags is your first line of defense against social engineering attacks.

## Universal Red Flags (Apply to All Scenarios)

### 1. Urgency and Time Pressure

**Common phrases**:
- "This is urgent and needs immediate attention"
- "You must act now or your account will be locked"
- "We need this information within the hour"
- "Limited time offer expires today"

**Why it works**: Urgency bypasses critical thinking

**Your response**: Slow down. Legitimate urgent situations allow time for verification.

### 2. Creating Fear or Anxiety

**Tactics**:
- "Your account has been compromised"
- "Legal action will be taken"
- "System failure imminent"
- "You''re in violation of policy"

**Why it works**: Fear triggers fight-or-flight response, impairs judgment

**Your response**: Stay calm. Verify independently. Real emergencies use official channels.

### 3. Unusual Requests

**Red flags**:
- Request for information normally not needed
- Asking for credentials or passwords
- Request to bypass normal procedures
- Unusual payment methods (gift cards, cryptocurrency)

**Why it works**: Novel situations catch us off-guard

**Your response**: Question why this is needed. Verify through normal channels.

### 4. Too Good to Be True

**Examples**:
- "You''ve won a prize you didn''t enter"
- "Free expensive software or services"
- "Guaranteed high returns with no risk"
- "Special access to exclusive opportunities"

**Why it works**: Greed and curiosity override caution

**Your response**: If it sounds too good to be true, it is.

### 5. Authority Claims

**Tactics**:
- "I''m calling from IT/HR/Legal"
- "This is on behalf of the CEO"
- "As your account manager..."
- "Federal agent/law enforcement"

**Why it works**: We''re conditioned to obey authority

**Your response**: Verify identity through known, official channels.

### 6. Requests for Secrecy

**Phrases**:
- "Don''t tell anyone about this"
- "This is confidential between us"
- "Don''t contact your IT department"
- "Keep this conversation private"

**Why it works**: Prevents verification and warning others

**Your response**: Legitimate requests don''t require secrecy. Always verify.

## Email-Specific Red Flags

### Technical Indicators

1. **Suspicious sender address**
   \`\`\`
   ✅ support@company.com
   ❌ support@company-security.com
   ❌ support@cornpany.com (letter substitution)
   ❌ noreply@34.123.45.67
   \`\`\`

2. **Generic greetings**
   - "Dear Customer" instead of your name
   - "Valued User"
   - No personalization

3. **Poor grammar and spelling**
   - Typos in professional communications
   - Awkward phrasing
   - Wrong terminology

4. **Mismatched URLs**
   - Hover before clicking
   - Link text says one thing, actual URL different
   - URLs with many subdomains or odd characters

5. **Unexpected attachments**
   - Especially .exe, .zip, .scr files
   - Renamed file extensions
   - Macros in Office documents

### Content Red Flags

1. **Unexpected communications**
   - Password reset you didn''t request
   - Package delivery for order you didn''t place
   - Account verification for service you don''t use

2. **Requests to verify information**
   - "Confirm your password"
   - "Update your payment information"
   - "Verify your SSN"

3. **Threats or consequences**
   - "Account will be closed"
   - "Legal action pending"
   - "Access will be suspended"

## Phone Call Red Flags

### Verbal Cues

1. **Background noise inconsistencies**
   - Claims to be from your bank but sounds like call center in different country
   - No ambient noise (spoofed number, VoIP)
   - Background voices speaking different language

2. **Scripted speech patterns**
   - Overly formal or stiff language
   - Robotic delivery
   - Reading from script verbatim

3. **Evasive about identity**
   - Won''t provide direct callback number
   - Vague about which department they''re from
   - Can''t provide employee ID or verification

### Situational Red Flags

1. **Caller ID spoofing**
   - Number looks legitimate but behavior suspicious
   - Matches organization''s main number exactly
   - Local area code for international company

2. **Requests to stay on line**
   - "Don''t hang up"
   - "I''ll transfer you" (stays on to overhear)
   - "Let me walk you through this"

3. **Remote access requests**
   - "I need to remote into your computer"
   - "Download this software so I can help"
   - "Install TeamViewer/AnyDesk"

## In-Person Red Flags

### Physical Security

1. **Tailgating attempts**
   - Following you through secure door
   - "Forgot my badge"
   - Carrying heavy items to solicit door-holding

2. **Unfamiliar faces in secure areas**
   - No visible badge
   - Badge that doesn''t match area access
   - Wandering without clear purpose

3. **Uniform or credential inconsistencies**
   - Wrong company logo or colors
   - Generic "technician" uniform
   - Fake or altered ID badges

### Behavioral Red Flags

1. **Name dropping**
   - "I''m here to see [executive name]"
   - "Your manager sent me"
   - "I work with [colleague]"

2. **Overfamiliarity**
   - Pretending to know you
   - Acting like you''ve met before
   - Using internal jargon imperfectly

3. **Observing over shoulders**
   - Watching you type passwords
   - Looking at sensitive documents
   - Photographing workspaces

## Message-Specific Red Flags (SMS, Chat, Social Media)

### Text Message (SMS) Red Flags

1. **Unexpected verification codes**
   - Codes you didn''t request
   - From services you don''t use
   - Multiple codes in short period

2. **Short URLs in texts**
   - bit.ly, tinyurl links
   - Can''t see destination
   - Often used to hide malicious sites

3. **Prize or delivery notifications**
   - Package delivery with tracking link
   - "You''ve won" messages
   - Refund or overpayment claims

### Social Media Red Flags

1. **Friend requests from strangers**
   - No mutual connections
   - Attractive profile picture (fake)
   - Minimal profile information

2. **Cloned accounts**
   - Second account from friend who already has one
   - Slightly different username
   - Immediately asking for help/money

3. **Direct messages from "companies"**
   - Offering to resolve complaint
   - Asking you to DM credentials
   - Moving conversation off-platform

## Context-Specific Red Flags

### Remote Work Scenarios

1. **VPN or access issues**
   - "Update your VPN immediately"
   - "Reconfigure your home network"
   - "Install new security certificate"

2. **Video conference attacks**
   - Meeting links from unknown senders
   - "Your Zoom account needs verification"
   - Calendar invites with suspicious links

### Financial Red Flags

1. **Payment requests**
   - Wire transfers or gift cards
   - Cryptocurrency payments
   - Unusual payment platforms
   - "Pay this invoice immediately"

2. **Account verification**
   - "Confirm your bank account"
   - "Update payment information"
   - "Re-enter credit card"

### HR/Payroll Red Flags

1. **Direct deposit changes**
   - Email requesting bank account change
   - Forms sent outside normal HR portal
   - Urgent deposit update requests

2. **W-2 or tax form requests**
   - Email from "CEO" requesting W-2s
   - Tax form requests before tax season
   - Urgent requests outside normal process

## Advanced Red Flags (Targeted Attacks)

### Signs of Research/Reconnaissance

1. **Personalized information**
   - References to recent events (from social media)
   - Knowledge of your role or projects
   - Mentions of colleagues or clients

2. **Timing**
   - Attacks coinciding with major events
   - Contact when key person is away
   - After public announcement or news

3. **Multi-channel attacks**
   - Email followed by phone call
   - Social media DM then email
   - Coordinated approach from "different" people

## Red Flag Combinations (High Alert)

### Critical Warning: Multiple Red Flags

**If you see 2+ of these together, stop immediately**:

1. Urgency + authority claim + unusual request
   - "CEO needs this immediately, don''t verify"

2. Fear + secrecy + unusual payment
   - "Legal issue, don''t tell anyone, pay with gift cards"

3. Too good to be true + time pressure + request for info
   - "Win prize, claim now, verify with SSN"

4. Authority + remote access + urgency
   - "IT here, urgent virus, let me remote in now"

## How to Respond to Red Flags

### Immediate Actions

1. **Pause**
   - Don''t act immediately
   - Take time to think
   - Urgency is often manufactured

2. **Verify independently**
   - Look up official contact information yourself
   - Don''t use contact info from suspicious message
   - Call back on known numbers

3. **Refuse inappropriate requests**
   - Never share passwords
   - Don''t grant remote access without verification
   - Don''t make payments without confirming through official channels

4. **Report**
   - Alert IT security
   - Inform manager
   - Warn colleagues

### Verification Methods

1. **Out-of-band verification**
   - If contacted via email, call to verify
   - If contacted via phone, hang up and call back
   - Use different communication channel

2. **Challenge questions**
   - Ask questions only legitimate party would know
   - Reference specific projects or communications
   - Request employee ID or ticket number

3. **Check official channels**
   - Company intranet announcements
   - Official social media accounts
   - Known phone numbers and websites

## Building Your Red Flag Detector

### Practice and Training

1. **Regular phishing tests**
   - Participate in organizational tests
   - Review results and learn
   - Practice identifying red flags

2. **Stay informed**
   - Read security bulletins
   - Learn about new tactics
   - Review real-world examples

3. **Share experiences**
   - Discuss attempts with colleagues
   - Contribute to organizational awareness
   - Learn from others'' experiences

### Developing Intuition

**Trust your gut**: If something feels off, it probably is

**Key questions to ask yourself**:
- Why am I receiving this now?
- Is this how this organization normally communicates?
- Am I being pressured to act quickly?
- Does this request make sense?
- What''s the worst that happens if I verify first?

## Key Takeaways

- Urgency is the #1 red flag - legitimate situations allow time for verification
- Authority claims must always be verified through independent, known channels
- Requests for passwords, credentials, or unusual payments are always suspicious
- Combine multiple verification methods - use different communication channels
- If 2+ red flags present, stop immediately and verify
- Real emergencies use official channels - never via unexpected email or call
- "Too good to be true" always is - no exceptions
- Requests for secrecy indicate scam - legitimate business doesn''t hide from IT/security
- Trust your instincts - if something feels wrong, it probably is
- Report all suspicious contacts - helps protect others and tracks attack patterns
- No legitimate organization asks for passwords or credentials via email/phone
- When in doubt, verify independently through official channels before taking any action', 'https://www.youtube.com/watch?v=oMzZK3YoYLc', 8, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:53:03.818', '2026-01-19 11:42:54.682', 'baf30430-fd72-4ef1-b8dd-7e9ee003353b');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('60fd24e6-c366-41ac-a497-5a3c140f0253', 'Understanding Web Trackers', '# Understanding Web Trackers

## What Are Web Trackers?

**Definition**: Technologies used by websites and third parties to monitor, collect, and analyze user behavior across the internet.

**Purpose**:
- Advertising and marketing
- Analytics and improvement
- Personalization
- User authentication
- Security

**Reality**: Most websites use multiple trackers - average site has 20-40 active trackers.

## Types of Web Trackers

### 1. Cookies

**First-Party Cookies**:
- Set by the website you''re visiting
- Store login state, preferences, shopping cart
- Generally necessary for site functionality
- Less privacy-concerning

**Third-Party Cookies**:
- Set by domains other than the one you''re visiting
- Track you across multiple websites
- Used for advertising and analytics
- Major privacy concern

**Example**:
You visit shop.com which loads ads from adnetwork.com
- shop.com sets first-party cookie
- adnetwork.com sets third-party cookie
- adnetwork.com now tracks you across all sites using their ads

### 2. Tracking Pixels (Web Beacons)

**What they are**:
- Tiny 1x1 pixel images embedded in web pages or emails
- Invisible to user
- Load from tracking server

**What they track**:
- Whether you visited a page
- Whether you opened an email
- How long you viewed content
- Your IP address
- Device information

**Example**:
Email contains: \`<img src="tracker.com/pixel.gif?user=12345">\`
When you open email, your email client loads this image, notifying tracker.com

### 3. Browser Fingerprinting

**How it works**:
Collects information about your browser and system:
- Screen resolution
- Installed fonts
- Browser plugins
- Operating system
- Language settings
- Time zone
- Canvas rendering

**Combined**, these create unique "fingerprint" identifying you even without cookies

**Why it''s concerning**:
- Can''t be cleared like cookies
- Works across private browsing
- Very difficult to prevent

**Example**:
Your combination of:
- Windows 11
- 1920x1080 screen
- Chrome 120
- Specific set of fonts
- Eastern Time Zone
- Specific graphics card
...uniquely identifies you among millions

### 4. JavaScript Tracking

**What it does**:
- Records mouse movements
- Tracks scrolling behavior
- Monitors form interactions
- Records keystrokes (keystroke logging)
- Captures clicks and navigation

**Common libraries**:
- Google Analytics
- Facebook Pixel
- Hotjar
- FullStory

**Privacy concern**: Can record everything you do on page, sometimes before you submit

### 5. ETags and Cache Tracking

**How it works**:
- Servers assign unique identifier to cached resources
- Your browser stores it
- Server recognizes you when you return
- Works even if cookies deleted

**Difficult to clear**: Requires clearing full browser cache

### 6. Social Media Tracking

**Like and Share Buttons**:
- Facebook, Twitter, LinkedIn buttons on websites
- Track you even if you don''t click
- Report back to social network

**Effect**: Facebook knows most websites you visit, even if you''re not on Facebook at the time

### 7. Cross-Device Tracking

**How it works**:
- Connects your phone, laptop, tablet as same person
- Uses login information
- Analyzes behavior patterns
- Location correlation

**Example**:
Search for product on phone → see ads for it on laptop

## What Do Trackers Collect?

### Basic Information
- IP address (location)
- Browser type and version
- Operating system
- Device type (mobile, desktop, tablet)
- Screen resolution
- Language preferences
- Time zone

### Behavioral Data
- Pages visited
- Time spent on each page
- Click patterns
- Mouse movements
- Scroll depth
- Form interactions
- Search queries
- Video watch time

### Personal Information
- Email addresses (from forms or login)
- Names
- Phone numbers
- Purchase history
- Interests and preferences
- Social connections
- Location history

### Cross-Site Data
- Browsing history across sites
- Shopping behavior
- Content preferences
- Social media activity
- Search history

## How Trackers Are Used

### Advertising

**Behavioral Advertising**:
1. You visit website about cameras
2. Tracker records your interest
3. You visit news site
4. Same tracker shows you camera ads

**Retargeting**:
- You view product but don''t buy
- Product "follows you" with ads across web
- Meant to bring you back to purchase

### Analytics

**Website owners track**:
- Which pages are popular
- Where users come from
- Where users drop off
- How users navigate site
- Which features are used

**Purpose**: Improve website, understand audience

### Personalization

**Content customization**:
- Recommend products
- Suggest articles
- Customize homepage
- Tailor search results

**Can be beneficial** but raises privacy questions

### Authentication

**Legitimate uses**:
- Keep you logged in
- Remember preferences
- Shopping cart persistence
- Security (detect unusual logins)

## Privacy Concerns

### Data Collection Scale

**Reality check**:
- Google tracks 80%+ of web traffic
- Facebook tracks users across 30%+ of top websites
- Data brokers aggregate info from hundreds of sources
- Your profile includes thousands of data points

### What They Know About You

**Ad networks can infer**:
- Your age, gender, ethnicity
- Income level
- Education
- Political views
- Health conditions
- Relationship status
- Life events (pregnancy, job loss, etc.)
- Psychological profile

**All without you explicitly providing this information**

### Data Selling and Sharing

**Your data is valuable**:
- Sold to data brokers
- Shared with partners
- Aggregated and resold
- Used for credit decisions
- Influences insurance rates
- Affects job prospects

### Security Risks

**Tracking data can be**:
- Stolen in data breaches
- Subpoenaed by law enforcement
- Accessed by malicious insiders
- Used for identity theft
- Exploited by stalkers

### Discrimination Concerns

**Tracked data used for**:
- Price discrimination (different prices for different people)
- Housing discrimination
- Employment discrimination
- Credit decisions
- Insurance rates

## Protecting Yourself from Trackers

### Browser Settings

**Basic protections**:

**Firefox**:
- Enhanced Tracking Protection (Standard or Strict)
- Blocks third-party cookies by default
- Fingerprint protection

**Safari**:
- Intelligent Tracking Prevention
- Blocks most third-party cookies
- Prevents cross-site tracking

**Chrome**:
- Settings → Privacy → "Block third-party cookies"
- Note: Google may weaken protections due to business model

**Brave**:
- Aggressive blocking by default
- Built-in fingerprint protection
- Blocks ads and trackers

### Browser Extensions

**Privacy-focused extensions**:

1. **uBlock Origin**
   - Blocks ads and trackers
   - Very effective and lightweight
   - Customizable block lists

2. **Privacy Badger** (EFF)
   - Learns trackers as you browse
   - Blocks third-party tracking
   - Doesn''t break sites as often

3. **Decentraleyes**
   - Blocks CDN tracking
   - Serves libraries locally
   - Improves speed and privacy

4. **Cookie AutoDelete**
   - Deletes cookies when you close tab
   - Whitelist for sites you want to stay logged into

5. **ClearURLs**
   - Removes tracking parameters from URLs
   - Cleans up links you share

### Private Browsing Modes

**What it does**:
- Doesn''t save history
- Deletes cookies after session
- Doesn''t save form data

**What it DOESN''T do**:
- Doesn''t hide from ISP
- Doesn''t prevent fingerprinting
- Doesn''t make you anonymous
- Websites still see your IP

**Use for**: Preventing local tracking on shared computers

### VPN Services

**What VPNs do**:
- Hide your IP address from websites
- Encrypt traffic from ISP
- Can appear to be in different location

**What VPNs don''t do**:
- Don''t prevent cookie tracking
- Don''t stop fingerprinting
- Don''t make you anonymous (VPN can see your traffic)

**Choose carefully**: Many free VPNs sell your data

### Search Engines

**Privacy-respecting alternatives**:

**DuckDuckGo**:
- Doesn''t track searches
- Doesn''t create filter bubble
- Blocks hidden trackers

**StartPage**:
- Uses Google results
- Strips tracking
- Doesn''t log IP

**Searx**:
- Metasearch engine
- Open source
- Can self-host

### Alternative Services

**Privacy-focused alternatives**:
- Email: ProtonMail, Tutanota
- Cloud storage: Tresorit, Sync.com
- Messaging: Signal, Matrix
- Video: PeerTube
- Social: Mastodon, Diaspora

## Tracker Detection and Analysis

### Browser Developer Tools

**See trackers yourself**:
1. Open Developer Tools (F12)
2. Go to Network tab
3. Visit website
4. Look for third-party requests

**You''ll see**: Dozens of requests to tracking domains

### Online Tools

**Analyze websites**:

1. **Blacklight (The Markup)**
   - Scans sites for trackers
   - Shows cookies, session recordings, fingerprinting
   - Free and easy to use

2. **Privacy Badger Dashboard**
   - See what it''s blocking
   - Learn tracker prevalence

3. **Built-in browser tools**
   - Firefox: about:protections
   - Safari: Privacy Report

## Legal Landscape

### GDPR (Europe)

**Key provisions**:
- Opt-in required for tracking
- Must explain what data collected
- Right to access your data
- Right to deletion
- Large fines for violations

**Effect**: Cookie consent banners everywhere

### CCPA (California)

**Your rights**:
- Know what data is collected
- Delete your data
- Opt out of data sales
- No discrimination for exercising rights

### Other Regions

**Growing privacy laws**:
- Brazil: LGPD
- Canada: PIPEDA updates
- Various US states passing laws

## The Tracking Arms Race

### Tracking Evolution

**As protections improve, trackers adapt**:
- Third-party cookies → Fingerprinting
- Cookies → LocalStorage
- Direct tracking → CNAME cloaking
- Browser protections → Server-side tracking

### CNAME Cloaking

**New evasion technique**:
- Third-party tracker appears as first-party
- Uses DNS CNAME records
- Bypasses cookie protections
- Harder to detect and block

### Server-Side Tracking

**Latest trend**:
- Tracking happens on website''s server
- Appears as first-party
- Very difficult to block
- Requires trust in website

## Balancing Privacy and Functionality

### Trade-offs

**Some tracking is beneficial**:
- Staying logged in (cookies)
- Shopping cart persistence
- Content recommendations
- Fraud prevention

**The question**: How much tracking is reasonable?

### Making Informed Choices

**Consider**:
1. What data is being collected?
2. Who has access to it?
3. How is it being used?
4. How long is it retained?
5. Is this worth the functionality?

## Best Practices Summary

### Essential Steps

1. **Use tracker-blocking browser or extensions**
   - uBlock Origin at minimum
   - Consider Firefox or Brave

2. **Limit third-party cookies**
   - Block in browser settings
   - Use Cookie AutoDelete

3. **Be selective with services**
   - Use privacy-respecting alternatives when possible
   - Minimize Google/Facebook services

4. **Review privacy settings**
   - Check social media privacy settings
   - Opt out of ad personalization
   - Review app permissions

5. **Regular cleanup**
   - Clear cookies periodically
   - Review browser extensions
   - Check what''s tracking you

### Advanced Steps

6. **Use VPN when needed**
   - Public Wi-Fi
   - Sensitive browsing
   - Choose reputable provider

7. **Consider compartmentalization**
   - Different browsers for different purposes
   - Multiple browser profiles
   - Virtual machines for high-risk activities

8. **Educate yourself**
   - Read privacy policies (key sections)
   - Stay informed about new tracking techniques
   - Participate in privacy advocacy

## Key Takeaways

- Average website has 20-40 active trackers monitoring your every move
- Third-party cookies are main tracking mechanism - block them in browser settings
- Browser fingerprinting tracks you even without cookies and across private browsing
- Ad networks build detailed psychological profiles from your browsing behavior
- Use uBlock Origin and Privacy Badger extensions to block most tracking
- Private browsing mode only prevents local tracking - doesn''t hide from websites or ISP
- Firefox and Brave have strongest built-in anti-tracking protections
- Cookie consent banners exist due to GDPR - companies must ask before tracking
- Your tracked data is bought, sold, and used for decisions about pricing, insurance, employment
- VPNs hide your IP but don''t prevent cookie tracking or fingerprinting
- Check what''s tracking you with browser developer tools or Blacklight scanner
- Some tracking enables useful functionality - find your own privacy/convenience balance', 'https://www.youtube.com/watch?v=OQOsrsUXNEk', 6, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:53:03.786', '2026-01-19 11:42:54.685', '8b832b1a-510f-4c2e-9b41-e33e45b0b6fd');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('0ebdbfb3-4464-4931-bca4-0269de18e6f7', 'Safe Online Shopping', '# Safe Online Shopping

## The Online Shopping Security Landscape

**E-commerce is massive**: Global online retail exceeds $5 trillion annually

**But also risky**:
- Payment fraud
- Fake websites
- Data breaches
- Scam sellers
- Counterfeit products

**The goal**: Shop confidently while protecting your financial and personal data

## Before You Shop: Preparation

### Secure Your Devices

1. **Keep software updated**
   - Operating system
   - Web browser
   - Security software
   - All applications

2. **Use antivirus/antimalware**
   - Real-time protection enabled
   - Regular scans
   - Up-to-date definitions

3. **Strong device security**
   - Screen lock enabled
   - Strong password/PIN
   - Full disk encryption
   - Firewall enabled

### Secure Payment Methods

**Best options ranked**:

1. **Credit cards** (BEST)
   - Strong fraud protection
   - Disputed charges held in review
   - Zero liability policies
   - Virtual card numbers available

2. **PayPal/Payment services**
   - Buyer protection
   - Merchant doesn''t see card details
   - Dispute resolution process

3. **Debit cards** (USE CAUTIOUSLY)
   - Weaker fraud protection
   - Direct access to bank account
   - Money gone immediately if compromised

4. **Bank transfers/Wire transfers** (AVOID)
   - No fraud protection
   - Irreversible
   - Common in scams

5. **Gift cards/Cryptocurrency** (RED FLAG)
   - No legitimate retailer requires these
   - Untraceable
   - Classic scam indicator

**Recommendation**: Use credit card with virtual numbers for online shopping

### Virtual Credit Card Numbers

**What they are**:
- Temporary card number linked to real card
- Set spending limits
- Can be used once or for single merchant
- Can be canceled without affecting real card

**Providers**:
- Many credit card issuers offer this
- Privacy.com
- Citi Virtual Account Numbers
- Capital One Eno

**Benefits**:
- Breach doesn''t compromise real card
- No worry about recurring charges
- Easy to cancel if needed

## Identifying Legitimate Shopping Sites

### Website Security Indicators

1. **HTTPS everywhere**
   - Look for padlock icon in address bar
   - URL starts with https://
   - Certificate valid and matches site name
   - Click padlock to verify

**WARNING**: HTTPS only means connection is encrypted, NOT that site is trustworthy

2. **Domain verification**
   \`\`\`
   ✅ www.amazon.com
   ❌ www.amazon-deals.com
   ❌ www.arnazon.com (letter substitution)
   ❌ www.amazon.discount-offers.biz
   \`\`\`

   **Check carefully**:
   - Exact domain spelling
   - Correct top-level domain (.com, not .biz)
   - No extra words or subdomains

3. **Professional design and functionality**
   - High-quality images
   - Proper grammar and spelling
   - Working links
   - Professional layout
   - Consistent branding

**Red flags**:
- Pixelated images
- Broken English
- Excessive pop-ups
- Glaring typos

### Contact and Company Information

**Legitimate sites provide**:
- Physical address
- Phone number
- Customer service email
- Company registration information

**Verify company**:
- Search company name + "scam" or "reviews"
- Check Better Business Bureau
- Look for business registration
- Verify address on Google Maps

**Red flags**:
- No contact information
- Only contact form, no phone/email
- PO Box only
- Fake address

### Reviews and Reputation

**Check multiple sources**:

1. **Independent review sites**
   - Trustpilot
   - Better Business Bureau
   - ResellerRatings
   - SiteJabber

2. **Search for complaints**
   - "[Store name] scam"
   - "[Store name] reviews"
   - "[Store name] complaints"
   - "[Store name] BBB"

3. **Social media**
   - Look for official pages
   - Check customer comments
   - Verify follower counts
   - Check post engagement

**Red flags**:
- Only 5-star or only 1-star reviews
- Reviews all posted same day
- Generic review text
- Poorly written English
- No negative reviews at all (suspicious)

### Pricing Reality Checks

**Too good to be true = scam**

**Comparison examples**:
- iPhone 15 Pro normally $999
- Site offering $299 → SCAM
- 20% discount might be legit
- 70%+ discount on high-demand items → Likely scam

**Verify with**:
- Manufacturer''s website
- Authorized retailers
- Price comparison sites
- Historical price data

## During the Shopping Process

### Creating Accounts

**Best practices**:

1. **Use unique password**
   - Different for every site
   - Use password manager
   - Long and complex

2. **Provide minimum information**
   - Only give required fields
   - Avoid optional marketing info
   - Be cautious with SSN requests

3. **Use email aliases**
   - Separate email for shopping
   - Helps identify breach sources
   - Reduces main email spam

4. **Enable 2FA if available**
   - Especially for frequently used sites
   - Protects account from takeover

### Checkout Security

**Information to verify**:

1. **HTTPS on checkout pages**
   - MUST be https:// especially at checkout
   - Padlock icon present
   - Certificate valid

2. **Payment page legitimacy**
   - Is it the same site you''ve been browsing?
   - Check URL carefully
   - Beware of redirects to unknown domains

3. **Payment information**
   - Never send via email
   - Only enter on secure forms
   - Watch for card skimmers (on public computers)

### Red Flags During Purchase

**Stop and reconsider if**:

1. **Redirected to unfamiliar payment processor**
   - Should stay on merchant site or go to known payment gateway (PayPal, Stripe)

2. **Asked for unnecessary information**
   - Social Security Number (rarely needed)
   - Driver''s license number
   - Excessive personal details

3. **Only unusual payment methods accepted**
   - Wire transfer
   - Gift cards
   - Cryptocurrency only
   - Western Union, MoneyGram

4. **Pressure tactics**
   - "Buy now or price increases"
   - Countdown timers (fake urgency)
   - "Last one in stock" (manufactured scarcity)

5. **Unsecure checkout**
   - No HTTPS
   - HTTP warning from browser
   - Certificate errors

## Network Security While Shopping

### Safe Networks

**Use**:
- Home Wi-Fi (secured with WPA3/WPA2)
- Mobile data (your cellular connection)
- Trusted network with VPN

**Avoid**:
- Public Wi-Fi (coffee shops, airports, hotels)
- Unknown networks
- Open/unsecured Wi-Fi

### If You Must Use Public Wi-Fi

**Precautions**:

1. **Use VPN**
   - Encrypts all traffic
   - Prevents snooping
   - Hides activity from network

2. **Stick to well-known sites**
   - Major retailers only
   - Sites with strong HTTPS

3. **Avoid sensitive transactions**
   - Save purchases for secure network
   - Don''t enter banking info

4. **Check for VPN kill switch**
   - Stops traffic if VPN drops
   - Prevents unencrypted exposure

## After Purchase: Protection

### Save Documentation

**Keep records of**:
- Order confirmation emails
- Screenshots of product listings
- Purchase receipts
- Tracking information
- Seller contact information

**Why**: Essential for disputes or fraud claims

### Monitor Accounts

**Regular checks**:

1. **Credit/debit card statements**
   - Review all charges
   - Look for small test charges (fraud indicator)
   - Check for recurring charges

2. **Email confirmations**
   - Verify all orders
   - Check shipping notifications
   - Confirm delivery

3. **Account activity**
   - Login history on shopping accounts
   - Check for unauthorized changes
   - Review saved payment methods

### Set Up Alerts

**Enable notifications for**:
- Every card transaction
- Charges over certain amount
- International transactions
- Card not present transactions

**Benefits**: Immediate fraud detection

## Specific Platform Considerations

### Major Retailers (Amazon, eBay, Walmart, etc.)

**Generally safe but**:
- Use official apps or type URL directly
- Beware of third-party sellers
- Check seller ratings and reviews
- Verify Amazon seller is "Fulfilled by Amazon" or direct from Amazon
- eBay: Check seller feedback score

### Social Media Shopping

**Facebook Marketplace, Instagram Shopping**:

**Higher risk**:
- Less buyer protection
- Easier for scammers
- Harder to verify sellers

**Precautions**:
- Meet in public for local sales
- Use platform payment systems (more protection)
- Never wire money or use gift cards
- Check seller''s profile thoroughly
- Be wary of brand new accounts

### International Shopping

**Additional risks**:
- Harder to get refunds
- Language barriers
- Different consumer protection laws
- Longer shipping = more time for fraud

**Precautions**:
- Research international seller reputation
- Understand customs/duties
- Check return policies carefully
- Use credit card (better international fraud protection)
- Be prepared for longer resolution times

## Common Online Shopping Scams

### Fake E-commerce Websites

**How it works**:
- Professional-looking fake website
- Offers incredible deals
- Takes your money, sends nothing
- Or sends counterfeit products

**Prevention**:
- Check domain carefully
- Search for reviews
- Verify company exists
- Too-good-to-be-true prices

### Phishing Emails

**Scenarios**:
- "Order confirmation" for order you didn''t place
- "Delivery failed" notifications
- "Account suspended" warnings
- "Payment problem" alerts

**Red flags**:
- Unexpected emails
- Urgent action required
- Poor grammar/spelling
- Suspicious links
- Asks for password or payment info

**Response**: Go directly to site (type URL), don''t click email links

### Fake Tracking Numbers

**How it works**:
- Scammer provides tracking number
- Number is real (for different package)
- Shows "delivered"
- You never receive your item

**Prevention**:
- Verify tracking on carrier site directly
- Check delivery address on tracking
- Report if delivered elsewhere

### Non-Delivery or Misrepresentation

**Scenarios**:
- Item never arrives
- Arrives broken
- Counterfeit/fake item
- Completely different product

**Response**:
1. Contact seller first
2. File dispute with payment processor
3. Report to platform
4. File chargeback with credit card

## Handling Fraud and Disputes

### If You Suspect Fraud

**Immediate actions**:

1. **Contact payment provider**
   - Credit card company
   - PayPal
   - Bank
   - Report fraudulent charge

2. **Change passwords**
   - Shopping account
   - Email account
   - Any account with same password

3. **Document everything**
   - Screenshots
   - Emails
   - Transactions
   - Communications

4. **Report to authorities**
   - FTC: reportfraud.ftc.gov
   - IC3.gov (if cybercrime)
   - Local police (if significant amount)

### Chargeback Process

**Credit card disputes**:

1. **Timeline matters**
   - Report within 60 days of statement
   - Sooner is better

2. **Provide documentation**
   - Order details
   - Product listing
   - Communications with seller
   - Proof of return (if applicable)

3. **Dispute process**
   - Card issuer investigates
   - Charge held pending investigation
   - Decision typically within 60-90 days

4. **Strong chargeback reasons**:
   - Item not received
   - Item not as described
   - Duplicate charge
   - Unauthorized charge

### Platform Dispute Resolution

**eBay, Amazon, etc.**:

1. **Use platform''s resolution center**
   - File through official process
   - Follow platform procedures
   - Provide requested evidence

2. **Timelines**
   - Act quickly
   - Each platform has specific deadlines
   - Miss deadline = lose buyer protection

## Safe Online Shopping Checklist

### Before Shopping
- [ ] Device is updated and secured
- [ ] Using secure network (not public Wi-Fi)
- [ ] Have secure payment method ready (credit card)
- [ ] Know what you''re looking for (reduces impulse)

### Evaluating Site
- [ ] HTTPS present and valid
- [ ] Domain name correct
- [ ] Contact information provided
- [ ] Reviews checked (multiple sources)
- [ ] Price reasonable (not too good to be true)
- [ ] Company has legitimate presence

### During Purchase
- [ ] Provided minimum necessary information
- [ ] Using strong, unique password
- [ ] Payment page is HTTPS
- [ ] Payment method is secure
- [ ] No red flags present
- [ ] Saved confirmation and documentation

### After Purchase
- [ ] Monitoring accounts for charges
- [ ] Watching for confirmation emails
- [ ] Tracking shipment
- [ ] Prepared to report problems quickly

## Key Takeaways

- Always use credit cards for online shopping - best fraud protection and zero liability
- HTTPS (padlock icon) is required but doesn''t guarantee site is legitimate - also check domain carefully
- Virtual credit card numbers protect your real card from breaches
- If price is too good to be true, it''s a scam - verify pricing with multiple sources
- Never pay with wire transfer, gift cards, or cryptocurrency - these are scam payment methods
- Check multiple review sources before buying from unknown sellers
- Save all documentation - order confirmations, screenshots, receipts
- Set up card alerts for every transaction to catch fraud immediately
- Avoid shopping on public Wi-Fi - wait for secure network or use VPN
- Watch for fake tracking numbers that show delivered to wrong address
- Contact credit card company immediately if you suspect fraud - have 60 days to dispute
- Trust your instincts - if something feels off, shop elsewhere', 'https://www.youtube.com/watch?v=HobRgR5PkCg', 7, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:53:03.791', '2026-01-19 11:42:54.687', '8b832b1a-510f-4c2e-9b41-e33e45b0b6fd');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('8c639bdc-fdb9-4a89-b532-355bcfe907e4', 'Protecting Against Malvertising', '# Protecting Against Malvertising

## What is Malvertising?

**Definition**: Malicious advertising - the use of online advertising networks to distribute malware or conduct scams.

**Key characteristic**: Uses legitimate advertising networks, appearing on trusted websites

**Not the same as**:
- Ad fraud (fake clicks, impressions)
- Annoying ads
- Misleading ads (those are just unethical, not malware)

## How Malvertising Works

### The Attack Chain

1. **Attacker creates malicious ad**
   - Often looks like legitimate ad
   - Contains malicious code or link
   - May target specific browser/OS vulnerabilities

2. **Ad submitted to advertising network**
   - Passes initial vetting (using techniques to evade detection)
   - May start legitimate then switch to malicious
   - Placed in ad rotation

3. **Legitimate website displays ad**
   - Site owner often unaware
   - Ad served through ad network
   - Appears alongside legitimate ads

4. **User exposed**
   - May not even need to click (drive-by download)
   - Or user clicks ad thinking it''s legitimate
   - Malware delivered or credentials stolen

### Why It''s Effective

1. **Appears on trusted sites**
   - Major news sites
   - Popular entertainment sites
   - Even government websites

2. **Bypasses user caution**
   - "I''m on New York Times, must be safe"
   - Users don''t expect malware on legitimate sites

3. **Wide reach, fast spread**
   - Single malicious ad can be seen by millions
   - Spread across many sites simultaneously
   - Can be turned on/off quickly (evade detection)

## Types of Malvertising

### 1. Drive-By Downloads

**Most dangerous type**:
- Infects without any user action
- Simply viewing the ad triggers exploit
- Exploits browser or plugin vulnerabilities

**How it works**:
- Ad contains exploit code
- Targets browser vulnerability
- Downloads and executes malware automatically

**No click required** - just loading the page is enough

### 2. Malicious Redirects

**Process**:
1. User clicks what appears to be legitimate ad
2. Redirected through several sites
3. Lands on malicious site
4. Site attempts exploit or scam

**Common destinations**:
- Fake antivirus scans
- Tech support scams
- Phishing pages
- Malware download sites

### 3. Forced Downloads

**Behavior**:
- Clicking ad triggers immediate download
- Often disguised as:
  - Flash Player update
  - Video codec
  - Security software
  - System cleaner

**File types**:
- .exe, .msi (Windows executables)
- .dmg, .pkg (Mac installers)
- .apk (Android apps)

### 4. Scareware

**Tactics**:
- Fake virus scan
- "Your computer is infected!"
- Fake error messages
- System warnings

**Goal**: Trick you into:
- Downloading fake "antivirus"
- Calling fake tech support
- Paying for unnecessary "fix"

**Example**:
Ad displays: "Warning! 5 viruses detected! Click to scan and remove"

### 5. Cryptocurrency Mining

**Stealthy approach**:
- Ad contains cryptocurrency mining script
- Uses your CPU/GPU to mine crypto
- Slows down your device
- Drains battery (mobile devices)

**Often unnoticed**: Just causes slowness while ad is visible

### 6. Polyglot Images

**Advanced technique**:
- Image file that is also executable code
- Appears as innocent ad image
- Contains hidden malicious payload
- Exploits file parsing vulnerabilities

**Dangerous**: Bypasses many security checks

## Real-World Examples

### Case Study 1: New York Times Malvertising (2009)

**Attack**:
- Malicious ads on NYTimes.com
- Drive-by download attack
- Targeted Internet Explorer vulnerability

**Impact**:
- Thousands of visitors infected
- Delivered ransomware
- High-profile embarrassment

**Lesson**: Even prestigious sites can serve malicious ads

### Case Study 2: Yahoo Malvertising Campaign (2014)

**Attack**:
- Malicious ads served through Yahoo network
- Affected multiple Yahoo properties
- Used exploit kit (Magnitude)
- Targeted Flash and IE vulnerabilities

**Scale**:
- Ran for week before detection
- Potentially millions of exposures
- 27,000+ infections per hour at peak

**Lesson**: Even largest ad networks can be compromised; scale can be massive

### Case Study 3: Spotify & London Underground (2011)

**Attack**:
- Malicious ads through web ads on Spotify
- Also appeared on Transport for London site
- Scareware campaign
- Fake antivirus

**Delivery**:
- Redirected to fake scan
- Claimed computer infected
- Pushed fake security software

**Lesson**: Malvertising targets users across diverse platforms

### Case Study 4: RoughTed Campaign (2017)

**Sophistication**:
- Massive malvertising operation
- Used sophisticated cloaking
- Evaded detection for months
- Reached billions of ad impressions

**Techniques**:
- Fingerprinted users
- Avoided security researchers
- Rotated infrastructure
- Used multiple exploit kits

**Lesson**: Modern malvertising is highly sophisticated and evasive

### Case Study 5: Google DoubleClick Malvertising (2016)

**Attack**:
- Malicious ads through Google''s DoubleClick
- Major sites affected (MSN, AOL, BBC, NYT, etc.)
- Targeted users in US, Canada, UK, Australia
- Ransomware delivery

**Method**:
- Passed Google''s vetting
- Used encryption to hide payload
- Served selectively to evade detection

**Lesson**: No ad network is immune, even Google''s

## Detection and Warning Signs

### Technical Indicators

1. **Browser warnings**
   - Blocked pop-ups
   - Security warnings
   - Download prompts for unexpected files

2. **Performance issues**
   - Sudden slowdown
   - High CPU usage
   - Excessive network activity
   - Battery drain (mobile)

3. **Unexpected behavior**
   - Automatic downloads
   - Redirects to unfamiliar sites
   - Multiple new browser tabs opening
   - Browser crashes

### Visual Red Flags

1. **Suspicious ad content**
   - Fake system warnings
   - "Your computer is infected"
   - "Flash Player out of date"
   - Too-good-to-be-true offers
   - Provocative/clickbait images

2. **Low-quality ads**
   - Poor graphics
   - Spelling errors
   - Unprofessional design
   - Inconsistent branding

3. **Unusual ad placement**
   - Overlays blocking content
   - Can''t be closed
   - Covering entire page
   - Mimicking site content

## Protection Strategies

### Browser-Level Protection

1. **Keep browser updated**
   - Auto-updates enabled
   - Latest version always
   - Security patches applied

2. **Modern browser choice**
   **Safest browsers**:
   - Chrome (strong sandboxing)
   - Firefox (good security updates)
   - Edge (Chromium-based, Microsoft security)
   - Safari (Apple security)

   **Avoid**: Internet Explorer (no longer supported, highly vulnerable)

3. **Browser security settings**
   - Block pop-ups
   - Warn about dangerous sites
   - Enable Enhanced Safe Browsing (Chrome)
   - Enable Enhanced Tracking Protection (Firefox)

### Ad Blocking

**Most effective protection**: Block ads entirely

**Recommended tools**:

1. **uBlock Origin** (BEST)
   - Open source
   - Highly effective
   - Lightweight
   - Customizable

2. **AdBlock Plus**
   - Popular
   - Allows "acceptable ads" by default (disable this)

3. **Brave Browser**
   - Built-in ad blocking
   - No extensions needed

**How it works**:
- Blocks requests to ad servers
- No ad loaded = no malvertising risk
- Stops tracking as bonus

**But consider**:
- Many sites rely on ad revenue
- Consider supporting sites you value (direct donations, subscriptions)
- Whitelist trusted sites if desired

### Script Blocking

**Tools**: NoScript (Firefox), uMatrix

**How it works**:
- Blocks JavaScript by default
- You whitelist trusted sites
- Prevents execution of malicious scripts

**Effectiveness**: Very high - stops drive-by downloads

**Downside**: Breaks many sites; requires manual whitelisting

**Recommendation**: For high-security needs or when visiting unknown sites

### Security Software

**Layered defense**:

1. **Antivirus/antimalware**
   - Real-time protection
   - Web protection features
   - Exploit protection

2. **Anti-exploit software**
   - Examples: Malwarebytes, HitmanPro.Alert
   - Specifically blocks exploit techniques
   - Complements antivirus

3. **Keep security software updated**
   - Daily definition updates
   - Latest version

### Plugin Management

**High-risk plugins** (uninstall if possible):

1. **Adobe Flash**
   - Extremely vulnerable
   - Being phased out (ended 2020)
   - Uninstall completely

2. **Java browser plugin**
   - Frequent exploit target
   - Rarely needed for browsing
   - Uninstall unless specifically required

3. **Old PDF readers**
   - Update to latest version
   - Or use browser''s built-in PDF viewer

**Keep remaining plugins updated**

### Operating System Security

1. **Keep OS updated**
   - Automatic updates enabled
   - Security patches priority
   - Latest version when possible

2. **User Account Control (Windows)**
   - Keep enabled
   - Prompts for privilege escalation
   - Limits malware impact

3. **Gatekeeper (Mac)**
   - Prevents unsigned apps
   - Keep enabled

4. **Firewall**
   - OS firewall enabled
   - Monitors outbound connections

## Safe Browsing Practices

### General Guidelines

1. **Avoid clicking ads**
   - Search for product/site instead
   - Type URLs directly
   - Use bookmarks for frequented sites

2. **Be skeptical of**:
   - "Congratulations! You''ve won..."
   - Fake virus warnings
   - Flash/software update prompts
   - Surveys offering prizes

3. **Never download from ad prompts**
   - Get software from official sources only
   - Ignore "your Flash is outdated" messages
   - Don''t trust "your computer is slow" claims

4. **Close suspicious content immediately**
   - Use Task Manager if browser frozen
   - Force quit if necessary
   - Don''t click anything in suspicious pop-ups (including "X" to close)

### Specific Scenarios

**If you see "Your computer is infected" message**:
1. Don''t click anything
2. Close browser tab
3. Run real security scan if concerned
4. It''s almost certainly fake

**If download starts unexpectedly**:
1. Cancel download
2. Don''t open the file
3. Delete downloaded file
4. Run malware scan

**If redirected to unfamiliar site**:
1. Close tab immediately
2. Don''t enter any information
3. Clear browser cache
4. Run security scan

## Mobile Malvertising

### Unique Risks

**Mobile-specific threats**:
- In-app ads (games, free apps)
- Mobile browser vulnerabilities
- Auto-redirect to App Store
- Subscription scams

**Higher risk factors**:
- Smaller screens (harder to spot fakes)
- Touch interface (easier to misclick)
- More apps = more ad surface area

### Mobile Protection

1. **Install apps from official stores only**
   - Apple App Store
   - Google Play Store
   - Avoid third-party app stores

2. **Review app permissions**
   - Be suspicious of excessive permissions
   - Game doesn''t need contacts access

3. **Use mobile security software**
   - Malwarebytes Mobile
   - Lookout
   - Built-in Play Protect (Android)

4. **Mobile ad blocking**
   - AdGuard DNS
   - Blokada (Android)
   - 1Blocker (iOS)
   - Content blockers in Safari (iOS)

5. **Avoid free apps with excessive ads**
   - Pay for app if possible
   - Reduce ad exposure

## If You''ve Been Compromised

### Immediate Actions

1. **Disconnect from internet**
   - Prevents further data theft
   - Stops command & control communication
   - Limits spread if ransomware

2. **Don''t restart**
   - Some malware activates on restart
   - Easier to remove while running

3. **Boot into Safe Mode** (then reconnect if needed)
   - Prevents many malware types from running
   - Easier to remove

4. **Run malware scan**
   - Use reputable security software
   - Full system scan
   - Remove detected threats

### Cleanup and Recovery

1. **Change passwords** (from clean device)
   - All important accounts
   - Start with email and banking
   - Use different device if possible

2. **Monitor accounts**
   - Bank statements
   - Credit reports
   - Account activities

3. **Consider full system restore**
   - If infection serious
   - Restore from clean backup
   - Or reinstall OS

4. **Document for authorities**
   - If financial loss
   - If identity theft
   - File reports with FTC, IC3, local police

## Organizational Protection

### For IT Administrators

1. **Network-level ad blocking**
   - Pi-hole
   - pfBlockerNG
   - Enterprise solutions

2. **Application whitelisting**
   - Only approved software can run
   - Blocks drive-by downloads

3. **Web filtering**
   - Block malicious sites
   - Category filtering
   - Real-time threat intelligence

4. **Endpoint protection**
   - Exploit protection
   - Behavioral analysis
   - Application control

5. **User education**
   - Security awareness training
   - Report suspicious ads
   - Don''t click ads for sensitive actions

## The Bigger Picture

### Ad Industry Response

**Efforts to combat malvertising**:
- Improved vetting processes
- Malware scanning of ads
- Ads.txt standard (verifies authorized sellers)
- Real-time monitoring

**Challenges**:
- Scale (billions of ads)
- Sophisticated evasion
- Economic incentives
- Polymorphic malware

### Your Role

**Balance considerations**:
- Ad blocking vs. supporting content creators
- Security vs. convenience
- Individual protection vs. systemic solutions

**Informed choices**:
- Support sites directly if you block ads
- Report malicious ads
- Use security tools
- Stay educated

## Key Takeaways

- Malvertising delivers malware through legitimate advertising on trusted websites
- Drive-by downloads are most dangerous - can infect without clicking the ad
- uBlock Origin ad blocker is most effective protection against malvertising
- Keep browser, plugins, and OS updated - exploits target known vulnerabilities
- Uninstall Adobe Flash and Java browser plugin - frequent exploit targets with no benefit
- Never click ads claiming "your computer is infected" - always scam/malware
- Even major sites (NYT, Yahoo, Spotify) have served malicious ads
- Mobile devices also at risk - install apps only from official stores
- If browser shows unexpected download, cancel immediately and run malware scan
- Ad blockers protect security AND privacy - legitimate use case beyond convenience
- Report suspicious ads to help protect others
- Consider supporting ad-free content through subscriptions or donations', 'https://www.youtube.com/watch?v=hfUSyoJcbxU', 8, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:53:03.794', '2026-01-19 11:42:54.691', '8b832b1a-510f-4c2e-9b41-e33e45b0b6fd');
INSERT INTO public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt", "moduleId") VALUES ('a3bb7545-6740-4e41-90a5-bace05912560', 'Privacy by Design', '# Privacy by Design

## What is Privacy by Design?

**Definition**: A framework and approach that embeds privacy protections into the design and architecture of systems, processes, and technologies from the very beginning, rather than adding them as an afterthought.

**Core principle**: Privacy is proactive, not reactive

**Created by**: Dr. Ann Cavoukian, former Information and Privacy Commissioner of Ontario, Canada (1990s)

## Why Privacy by Design Matters

### The Traditional Problem

**Old approach**:
1. Build system focused on functionality
2. Launch product
3. Privacy breach or regulation requires changes
4. Bolt on privacy features
5. Expensive, incomplete, ineffective

**Result**: Privacy as afterthought leads to vulnerabilities, breaches, and user distrust

### The Privacy by Design Solution

**New approach**:
1. Consider privacy from initial design
2. Build privacy into architecture
3. Make privacy the default
4. Proactive protection
5. Better security, compliance, user trust

**Result**: Privacy is intrinsic, not extrinsic

### Benefits

**For organizations**:
- Reduced breach risk
- Lower compliance costs
- Easier regulatory compliance (GDPR, CCPA, etc.)
- Competitive advantage
- Enhanced reputation
- Fewer costly retrofits

**For users**:
- Better data protection
- More control over information
- Greater transparency
- Reduced privacy risks
- Increased trust

## The 7 Foundational Principles

### 1. Proactive not Reactive; Preventative not Remedial

**What it means**:
- Anticipate privacy issues before they arise
- Prevent privacy breaches rather than fixing after the fact
- Build defenses into systems from the start

**In practice**:
- Conduct Privacy Impact Assessments (PIAs) before building
- Identify risks early in development
- Design with threats in mind
- Plan for privacy from day one

**Example**:
- ❌ Bad: Build social network, then add privacy settings after data leak
- ✅ Good: Design social network with granular privacy controls from launch

### 2. Privacy as the Default Setting

**What it means**:
- Maximum privacy protection should be automatic
- Users shouldn''t need to take action to protect their privacy
- Opt-out for data collection, not opt-in

**In practice**:
- Strongest privacy settings enabled by default
- Minimal data collection unless user explicitly consents
- Privacy-friendly defaults in all configurations
- No action required from user to be protected

**Example**:
- ❌ Bad: Social media profile public by default, user must find settings to make private
- ✅ Good: Profile private by default, user can choose to make public

### 3. Privacy Embedded into Design

**What it means**:
- Privacy is integral component of system, not add-on
- Privacy built into architecture and infrastructure
- Cannot be easily removed or bypassed

**In practice**:
- Privacy requirements in technical specifications
- Data minimization in database design
- Encryption built into storage and transmission
- Access controls embedded in architecture

**Example**:
- ❌ Bad: Store all user data in plaintext, add encryption later
- ✅ Good: Design database with encryption at rest from the start

### 4. Full Functionality – Positive-Sum, not Zero-Sum

**What it means**:
- Privacy and functionality are not trade-offs
- Strong privacy can coexist with full functionality
- Reject false dichotomy of "privacy or features"

**In practice**:
- Innovate to achieve both privacy and functionality
- Use privacy-enhancing technologies
- Design clever solutions that satisfy both needs
- Demonstrate that privacy enables, not restricts

**Example**:
- ❌ Bad: "We need your location 24/7 for the app to work"
- ✅ Good: "We only access location when you use navigation feature"

### 5. End-to-End Security – Full Lifecycle Protection

**What it means**:
- Protect data throughout its entire lifecycle
- From collection to retention to destruction
- Security and privacy from beginning to end

**In practice**:
- Secure collection methods
- Encrypted storage
- Secure transmission
- Controlled access
- Secure deletion when no longer needed
- Continuous monitoring and updates

**Example**:
- Data collected securely → stored encrypted → transmitted via TLS → access logged → deleted after retention period → deletion verified

### 6. Visibility and Transparency – Keep it Open

**What it means**:
- Operations and data practices are visible and transparent
- Users can verify privacy claims
- Independent verification possible
- Open communication about data practices

**In practice**:
- Clear, understandable privacy policies
- Transparent data flows
- User dashboards showing collected data
- Public documentation of practices
- Third-party audits

**Example**:
- ❌ Bad: Vague privacy policy, no visibility into what data is collected
- ✅ Good: Clear policy, dashboard showing all collected data, ability to download data

### 7. Respect for User Privacy – Keep it User-Centric

**What it means**:
- Put users'' interests first
- Strong privacy defaults
- User control over their data
- Respect user choices

**In practice**:
- Easy-to-use privacy controls
- Granular permissions
- Clear consent mechanisms
- Easy data access and deletion
- Respect "do not track" preferences

**Example**:
- ❌ Bad: Complex privacy settings buried in menus, can''t delete account
- ✅ Good: Simple privacy dashboard, one-click account deletion, clear controls

## Implementing Privacy by Design

### Phase 1: Planning and Assessment

**1. Privacy Impact Assessment (PIA)**

**What it is**: Systematic assessment of privacy risks in a project

**When to do it**: Before starting development

**Key questions**:
- What data will be collected?
- Why is this data needed?
- How will it be used?
- Who will have access?
- How long will it be kept?
- What are the privacy risks?
- How will risks be mitigated?

**2. Data Mapping**

**Create inventory of**:
- What data you collect
- Where it comes from
- Where it''s stored
- Who can access it
- Where it goes (third parties)
- When it''s deleted

**3. Threat Modeling**

**Identify**:
- Potential attackers
- Attack vectors
- Vulnerabilities
- Impact of breaches
- Mitigation strategies

### Phase 2: Design and Architecture

**1. Data Minimization**

**Principles**:
- Collect only necessary data
- Store only what''s needed
- Delete when no longer required

**Questions to ask**:
- Do we really need this data?
- Can we use less sensitive alternative?
- Can we use aggregated data instead?
- Can we anonymize or pseudonymize?

**Example**:
- Don''t collect birth date if you only need to verify age 18+
- Don''t store credit card if you only need last 4 digits for display

**2. Pseudonymization and Anonymization**

**Pseudonymization**: Replace identifying data with pseudonyms
- User ID instead of name
- Can be reversed with key
- Reduces risk if data exposed

**Anonymization**: Remove ability to identify individuals
- Aggregate statistics
- Cannot be reversed
- Strongest protection

**3. Encryption**

**Encrypt data**:
- In transit (TLS/SSL)
- At rest (database encryption, disk encryption)
- End-to-end when possible
- Encryption keys managed securely

**4. Access Controls**

**Implement**:
- Role-based access control (RBAC)
- Principle of least privilege
- Need-to-know basis
- Logging and monitoring of access

**5. Privacy-Enhancing Technologies (PETs)**

**Examples**:
- Differential privacy (add statistical noise)
- Homomorphic encryption (compute on encrypted data)
- Secure multi-party computation
- Zero-knowledge proofs
- Federated learning (AI without centralizing data)

### Phase 3: Development

**1. Secure Coding Practices**

**Include**:
- Input validation
- Output encoding
- Parameterized queries (prevent SQL injection)
- Secure session management
- Error handling that doesn''t leak information

**2. Privacy in APIs**

**Design APIs that**:
- Return only necessary data
- Require authentication
- Rate limit to prevent scraping
- Log access for auditing
- Version carefully to maintain privacy commitments

**3. Default Settings**

**Ensure**:
- Maximum privacy protection by default
- Users must opt-in to data sharing
- Clear, understandable options
- Easy to modify settings

### Phase 4: Testing and Validation

**1. Privacy Testing**

**Test for**:
- Data leakage
- Unauthorized access
- Proper encryption
- Correct access controls
- Privacy settings effectiveness

**2. Security Audits**

**Conduct**:
- Code reviews
- Penetration testing
- Vulnerability assessments
- Third-party audits

**3. Compliance Verification**

**Verify**:
- GDPR compliance (if applicable)
- CCPA compliance (if applicable)
- Industry-specific regulations (HIPAA, FERPA, etc.)
- Internal privacy policies

### Phase 5: Deployment and Operations

**1. Privacy Policies**

**Create policies that are**:
- Clear and understandable
- Comprehensive
- Accurate
- Regularly updated
- Easily accessible

**2. User Controls**

**Provide**:
- Privacy dashboard
- Data access (see what you have)
- Data portability (download data)
- Data deletion (right to be forgotten)
- Consent management

**3. Incident Response**

**Prepare for**:
- Breach detection
- Rapid response procedures
- User notification processes
- Regulatory reporting
- Post-incident analysis

**4. Continuous Monitoring**

**Monitor**:
- Access logs
- Data flows
- System changes
- Security alerts
- Compliance status

## Privacy by Design in Practice

### Example 1: Email Service

**Traditional approach**:
- Scan all emails for ads
- Store emails indefinitely
- Share data with third parties
- Vague privacy policy

**Privacy by Design approach**:
- End-to-end encryption
- No email scanning
- Data stored only as long as needed
- No third-party sharing without explicit consent
- Clear, simple privacy controls
- Open source for transparency
- Example: ProtonMail

### Example 2: Messaging App

**Traditional approach**:
- Store all messages on central server
- Collect phone contacts
- Track usage patterns
- Monetize through data

**Privacy by Design approach**:
- End-to-end encryption by default
- Messages deleted after delivery or set time
- Minimal metadata collection
- No contact upload required
- Open protocol for verification
- Example: Signal

### Example 3: Web Analytics

**Traditional approach**:
- Track users across websites
- Create detailed profiles
- Share data with advertisers
- Use invasive tracking (cookies, fingerprinting)

**Privacy by Design approach**:
- No cross-site tracking
- No personal data collection
- Aggregate statistics only
- No cookies needed
- Respect Do Not Track
- Example: Plausible Analytics

### Example 4: Healthcare System

**Privacy by Design approach**:
- Role-based access (doctors see only their patients)
- Encryption at rest and in transit
- Audit logs of all access
- Patient portal for data access
- Anonymization for research
- Strict data retention policies
- HIPAA compliance built-in

## Challenges and Solutions

### Challenge 1: "Privacy costs too much"

**Reality**: Privacy by Design saves money long-term
- Cheaper than retrofitting
- Reduces breach costs
- Avoids regulatory fines
- Maintains customer trust

**Solution**: Calculate total cost of ownership, including breach risk and compliance

### Challenge 2: "Privacy limits functionality"

**Reality**: Privacy enhances functionality through trust
- Users more willing to engage with privacy-respecting services
- Creative solutions achieve both
- Privacy can be differentiator

**Solution**: Innovate with privacy-enhancing technologies; reject false trade-offs

### Challenge 3: "Users don''t care about privacy"

**Reality**: Users care but often feel helpless
- 79% concerned about data usage
- Choose services with better privacy when available
- Lack of alternatives often confused with lack of concern

**Solution**: Make privacy easy and default; market privacy as feature

### Challenge 4: "Too complex for our team"

**Reality**: Privacy by Design is a process, not a single skill
- Start small
- Incremental improvements
- Training and resources available

**Solution**: Begin with privacy impact assessments; build expertise over time

## Regulatory Context

### GDPR (Europe)

**Privacy by Design is required**:
- Article 25 mandates data protection by design and by default
- Organizations must implement appropriate technical and organizational measures
- Fines for non-compliance up to 4% of global revenue

### CCPA/CPRA (California)

**Privacy principles align with**:
- Consumer rights to data access and deletion
- Opt-out requirements
- Transparency obligations

### Other Regulations

**Privacy by Design relevant to**:
- HIPAA (healthcare - US)
- PIPEDA (privacy - Canada)
- LGPD (data protection - Brazil)
- Various sector-specific regulations

## Organizational Culture

### Building Privacy Culture

**Leadership**:
- Executive commitment to privacy
- Privacy officer with authority
- Resources allocated to privacy

**Training**:
- Developer training on privacy
- Regular awareness programs
- Privacy champions in teams

**Processes**:
- Privacy review in development lifecycle
- Privacy impact assessments standard
- Regular privacy audits

**Metrics**:
- Track privacy issues
- Measure compliance
- Monitor user trust indicators

## Future of Privacy by Design

### Emerging Trends

**1. AI and Machine Learning**
- Privacy-preserving AI
- Federated learning
- Differential privacy in models

**2. IoT and Smart Devices**
- Privacy in connected devices
- Edge computing for privacy
- Minimal data collection

**3. Blockchain and Web3**
- Pseudonymization via blockchain
- User control of data
- Decentralized identity

**4. Quantum Computing**
- Post-quantum cryptography
- New privacy challenges
- Advanced privacy techniques

## Practical Checklist

### Privacy by Design Quick Assessment

**For any new project, ask**:

- [ ] Have we conducted a Privacy Impact Assessment?
- [ ] Are we collecting only necessary data?
- [ ] Is privacy the default setting?
- [ ] Have we considered privacy-enhancing technologies?
- [ ] Is data encrypted in transit and at rest?
- [ ] Do we have proper access controls?
- [ ] Can users access, export, and delete their data?
- [ ] Is our privacy policy clear and accurate?
- [ ] Have we planned for data retention and deletion?
- [ ] Are we compliant with relevant regulations?
- [ ] Can we demonstrate our privacy practices?
- [ ] Have we trained our team on privacy requirements?

## Key Takeaways

- Privacy by Design means building privacy into systems from the start, not adding it later
- Seven foundational principles: proactive, default privacy, embedded, positive-sum, end-to-end, transparent, user-centric
- Default to maximum privacy protection - users should not need to take action to be protected
- Data minimization is critical - only collect what you truly need, delete when no longer needed
- GDPR Article 25 makes Privacy by Design a legal requirement in Europe
- Privacy by Design saves money long-term by avoiding breaches, retrofits, and fines
- Privacy and functionality are not trade-offs - innovative design achieves both
- Conduct Privacy Impact Assessments before starting any new project
- Encryption at rest and in transit should be standard, not optional
- Privacy policies must be clear, accurate, and easily accessible to users
- User control is essential - provide data access, portability, and deletion capabilities
- Build privacy culture through leadership commitment, training, and processes', 'https://www.youtube.com/watch?v=vNyJFdzXpnQ', 8, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:53:03.812', '2026-01-19 11:42:54.696', '210e5ba8-c870-47ae-986f-c43c06367e9b');


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('e4fdd7d8-4f95-48eb-bf78-5f09f2278979', 'Understanding Phishing', 'Learn phishing fundamentals', 1, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.729', '2026-01-19 00:52:15.729');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('2a41640e-0fca-4c13-8990-41c941c87a9e', 'Recognizing Phishing', 'Identify phishing attempts', 2, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.733', '2026-01-19 00:52:15.733');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('8b832b1a-510f-4c2e-9b41-e33e45b0b6fd', 'Defense', 'Protect and respond', 3, '7a0f1b41-a422-419a-8f8d-988c85d785b2', '2026-01-19 00:52:15.734', '2026-01-19 00:52:15.734');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('30b0f01a-f00e-4a0f-8ce9-16425e35cbe9', 'Fundamentals', 'Why passwords matter', 1, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.746', '2026-01-19 00:52:15.746');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('b4adbb5f-05cd-4931-a360-adf0d0516bf7', 'Strong Credentials', 'Build secure passwords', 2, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.747', '2026-01-19 00:52:15.747');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('04626f01-23f6-4bf7-965b-1a82fa96a064', 'Advanced Protection', 'Tools and techniques', 3, 'd7f5cb64-b61f-4c9a-8147-6ee0d1e0ac14', '2026-01-19 00:52:15.748', '2026-01-19 00:52:15.748');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('5f2a3709-93e0-4664-81d3-aa45525276a7', 'Foundations', 'What is social engineering', 1, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.755', '2026-01-19 00:52:15.755');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('f133ab15-018b-4b84-b17e-e078e8081ce0', 'Attack Methods', 'Common techniques', 2, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.756', '2026-01-19 00:52:15.756');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('96406223-7051-43d7-901a-55878daeba07', 'Defense', 'Protection strategies', 3, '46919028-1fe7-4e40-b96f-bb5d825f7139', '2026-01-19 00:52:15.758', '2026-01-19 00:52:15.758');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('04aea607-352a-4cf7-b377-f3b3d97ce585', 'Browser Security', 'Security fundamentals', 1, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.77', '2026-01-19 00:52:15.77');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('0b906317-2666-4041-83fd-dea327795ee1', 'Threat Recognition', 'Identify web threats', 2, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.772', '2026-01-19 00:52:15.772');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('210e5ba8-c870-47ae-986f-c43c06367e9b', 'Safe Practices', 'Browse safely', 3, '46ca4918-f919-4f00-812d-bd5df57b3b10', '2026-01-19 00:52:15.774', '2026-01-19 00:52:15.774');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('00a5afc1-3c46-4fca-9fcb-ff0603f95f82', 'Foundations', 'Data types and privacy', 1, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.783', '2026-01-19 00:52:15.783');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('e8dddf00-c067-44b9-b2b9-42e203bcf7fe', 'Protection', 'Safeguard your data', 2, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.784', '2026-01-19 00:52:15.784');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('baf30430-fd72-4ef1-b8dd-7e9ee003353b', 'Incident Response', 'Respond to breaches', 3, '60832135-1fbc-4397-af53-5e1e029e1e0e', '2026-01-19 00:52:15.785', '2026-01-19 00:52:15.785');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('6e75217d-f103-4414-a4ac-a0f2b2dec9fa', 'Threat Intelligence', 'Intelligence frameworks', 1, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.797', '2026-01-19 00:52:15.797');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('d9861794-240a-48f7-a6e2-c4c0afad6e5f', 'Detection', 'Find and analyze', 2, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.798', '2026-01-19 00:52:15.798');
INSERT INTO public.modules (id, title, description, "order", "courseId", "createdAt", "updatedAt") VALUES ('922e8060-e5bc-423b-b208-e2edf1425cbe', 'Response', 'Effective response', 3, '12769777-25e1-4cd4-82a9-990bda9b97de', '2026-01-19 00:52:15.799', '2026-01-19 00:52:15.799');


--
-- Data for Name: phishing_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('dbfcf22a-55c3-4f4a-8ae2-7ab62ab123a1', '789b254a-b66a-4843-b510-213e338def77', 'fea2e938-0f41-429d-b612-8f45f914588d', 'REPORTED', true, 22263, '2026-02-20 18:57:31.884');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('deeb4601-f8c7-4b15-be23-9f8c35634442', '789b254a-b66a-4843-b510-213e338def77', '6d2a44c9-f556-45ed-88dc-2ad2bd7878ad', 'REPORTED', true, 32279, '2026-05-14 06:44:23.41');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('b3f4bb6b-1f33-46d0-9645-4afc173043fc', '789b254a-b66a-4843-b510-213e338def77', '13741d89-7f1e-4a78-8db4-c1ecf0d4bc99', 'REPORTED', true, 7313, '2026-05-09 00:52:41.817');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('edf44c41-f879-4dcf-a24c-22491401fa02', '789b254a-b66a-4843-b510-213e338def77', '52094c9c-cee2-4b0d-9a9b-0add0adb3359', 'DELETED', true, 7262, '2026-03-18 07:55:55.373');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('05d56282-28dc-4c94-b21e-c163895cc679', '789b254a-b66a-4843-b510-213e338def77', '2fc625d9-2d27-47bc-a6ec-b3fbf815c519', 'DELETED', true, 29712, '2026-04-08 07:43:09.78');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('79f82fd4-d615-4f7b-8c4c-07bfec247934', '789b254a-b66a-4843-b510-213e338def77', 'b5fb07f2-2185-4db0-9454-de2fbdce5867', 'REPORTED', true, 34773, '2026-03-03 06:18:15.835');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('f33e71ac-6a73-46d3-b5bf-1d404b7f17f8', '789b254a-b66a-4843-b510-213e338def77', '51ad8f8e-02e5-4ba8-b941-2dfc26d47a4e', 'MARKED_SAFE', true, 14144, '2026-04-19 20:36:36.324');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('f1387063-6e7e-432f-aa5c-7bdf29fa2cf2', '789b254a-b66a-4843-b510-213e338def77', '09c2cd6b-9990-4983-9d68-aa78f617e519', 'MARKED_SAFE', true, 36229, '2026-05-03 20:28:03.668');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('0e01cd63-391b-4ddb-bbbe-b8640b4bfbf7', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '477e03fd-c4a7-44ac-8fec-821672785ca1', 'IGNORED', true, 8822, '2026-03-23 04:08:15.07');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('b6279b1c-b7d2-49a0-8a07-20578c5d2fb3', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'c3bd68ab-9caf-4be0-9c7c-b394b3fc6fae', 'REPORTED', true, 5977, '2026-02-15 23:00:52.024');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('ce8e20da-0c68-4d95-88bc-fd266fa6ac8d', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'fea2e938-0f41-429d-b612-8f45f914588d', 'REPORTED', true, 18891, '2026-05-06 15:23:33.572');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('3da123c2-a046-4778-8e6d-58291bf6c833', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'a1c3baea-6299-45a8-9b59-5ddc315ddb46', 'REPORTED', true, 2855, '2026-02-03 19:46:11.696');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('adcd3a57-b902-4689-9c0a-dea0258be6a8', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '6d2a44c9-f556-45ed-88dc-2ad2bd7878ad', 'REPORTED', true, 5178, '2026-03-14 00:48:50.627');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('95034d6f-effe-4b12-8549-063e1832c3ab', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '76e0beb9-cefd-4acb-b518-58bab6e0f1d9', 'REPORTED', true, 11891, '2026-04-12 15:49:57.627');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('84306e16-8088-4b52-91bb-830eda0b2a46', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'b5fb07f2-2185-4db0-9454-de2fbdce5867', 'DELETED', true, 20555, '2026-05-03 07:49:11.425');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('d7f79ed3-49a2-4774-ab62-201e2bda72ad', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'e14a89d3-067d-4c91-97d0-f3eac92af585', 'IGNORED', true, 17507, '2026-03-06 19:28:12.902');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('9c7ab653-cf02-45de-acb5-c11a894b6a4f', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'c3bd68ab-9caf-4be0-9c7c-b394b3fc6fae', 'REPORTED', true, 5852, '2026-05-17 07:05:06.847');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('4a235d87-1d82-4fc3-b8dc-693060542987', '5376ee99-3223-49c9-b10f-31f5fba93eff', '75d124dc-4990-4504-9eed-90e795de37aa', 'DELETED', true, 31418, '2026-03-22 14:46:10.344');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('151b9895-70f1-493c-a2e4-2d6c693667b7', '5376ee99-3223-49c9-b10f-31f5fba93eff', '4942f3ad-d0ce-432d-9301-2abe09cb0779', 'MARKED_SAFE', true, 42525, '2026-03-19 17:58:43.012');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('c3399fd0-a627-4c25-85e0-dd75cb31a126', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'd0ef058b-7cc9-4a98-b362-40b7fa0e29f6', 'IGNORED', true, 37683, '2026-04-22 08:36:56.643');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('f106b69f-097c-4b66-bc88-3cfea0195a71', '5376ee99-3223-49c9-b10f-31f5fba93eff', '477e03fd-c4a7-44ac-8fec-821672785ca1', 'REPORTED', false, 23453, '2026-03-01 15:02:56.647');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('90d41094-0659-409e-8f21-514abcfd5e99', 'ba73a499-6830-4485-bfc3-969bab02117a', '4d89ad17-cb07-4568-92bc-44de99970ceb', 'MARKED_SAFE', true, 4490, '2026-01-20 14:16:40.094');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('3d9dc10b-6a0e-455b-88f1-16dc3b7858ae', 'ba73a499-6830-4485-bfc3-969bab02117a', 'fbefa77c-c1bf-4efa-871f-2d79ee1a0d4a', 'REPORTED', true, 2935, '2026-03-31 03:44:47.673');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('08398155-f095-4cc5-bfb3-ca1c3fba5a43', 'ba73a499-6830-4485-bfc3-969bab02117a', 'baf36023-77d0-4f62-a55d-5119a7a0ff4a', 'IGNORED', true, 29315, '2026-03-12 21:04:09.523');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('21191155-840e-4993-9fd0-efe24fcc4ae7', 'ba73a499-6830-4485-bfc3-969bab02117a', '4942f3ad-d0ce-432d-9301-2abe09cb0779', 'IGNORED', true, 27710, '2026-05-25 15:09:11.01');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('efb43fd6-3c0f-49b7-9208-9060db94a4de', 'ba73a499-6830-4485-bfc3-969bab02117a', 'e14a89d3-067d-4c91-97d0-f3eac92af585', 'REPORTED', false, 34195, '2026-02-04 16:04:12.386');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('ffe297b1-dbf2-466f-b15f-ac2c8a5dd6c5', 'ba73a499-6830-4485-bfc3-969bab02117a', 'fb179c56-68f7-420c-b674-ab6ffba6da8a', 'REPORTED', true, 27897, '2026-01-16 00:52:42.861');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('a36646e1-f037-476e-9351-33f371eb3efb', 'ba73a499-6830-4485-bfc3-969bab02117a', '52094c9c-cee2-4b0d-9a9b-0add0adb3359', 'REPORTED', true, 18011, '2026-02-23 05:39:20.086');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('1fbd6bdb-0dec-431b-9da4-82e080206a22', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'd0ef058b-7cc9-4a98-b362-40b7fa0e29f6', 'IGNORED', true, 6756, '2026-03-11 17:36:31.481');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('591528e8-356c-447e-8948-5454e72ed229', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '4d89ad17-cb07-4568-92bc-44de99970ceb', 'DELETED', false, 20556, '2026-04-15 08:49:45.859');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('a859c1ae-b388-4c8c-b9d2-92b29303c6e0', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '09c2cd6b-9990-4983-9d68-aa78f617e519', 'MARKED_SAFE', true, 32266, '2026-05-10 13:04:59.454');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('ee6c0af8-dbba-45ed-87ea-4cd184c33fe2', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'fbefa77c-c1bf-4efa-871f-2d79ee1a0d4a', 'IGNORED', false, 39695, '2026-03-02 19:12:39.175');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('ec377262-4ede-436a-9adb-a6f5b008ee82', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '75d124dc-4990-4504-9eed-90e795de37aa', 'DELETED', true, 44660, '2026-01-02 07:17:44.83');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('d44492a7-7506-481f-a7c8-882aced2c791', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'fb179c56-68f7-420c-b674-ab6ffba6da8a', 'IGNORED', false, 39456, '2026-03-20 23:06:54.383');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('6ac1aa13-e618-46ae-ad23-82d9328ba1e3', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'c3bd68ab-9caf-4be0-9c7c-b394b3fc6fae', 'MARKED_SAFE', false, 15062, '2026-03-23 00:53:47.826');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('57d8453d-4927-447e-b599-de805a4d3b3e', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '76e0beb9-cefd-4acb-b518-58bab6e0f1d9', 'DELETED', true, 7892, '2026-04-25 08:56:00.119');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('9383e691-e3c2-44d7-8180-7898eec0078f', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '2fc625d9-2d27-47bc-a6ec-b3fbf815c519', 'REPORTED', true, 8364, '2026-01-28 06:21:21.655');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('84d163eb-a939-4eab-a6e5-7329a923ce40', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '6d2a44c9-f556-45ed-88dc-2ad2bd7878ad', 'MARKED_SAFE', false, 46978, '2026-03-04 15:19:31.234');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('370b4634-c514-4652-96bc-a0b792113e79', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '477e03fd-c4a7-44ac-8fec-821672785ca1', 'DELETED', false, 49519, '2026-04-18 02:03:19.944');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('7db70ffa-77de-4760-9c0b-5bbb29f6dadb', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', 'b5fb07f2-2185-4db0-9454-de2fbdce5867', 'MARKED_SAFE', false, 38643, '2026-03-17 11:03:13.346');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('ef9f66c5-11f2-4d76-aa8f-1112417b54fa', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'fea2e938-0f41-429d-b612-8f45f914588d', 'DELETED', true, 53640, '2026-05-17 19:20:44.901');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('bd5f88cf-88f2-4c59-9c75-b44354e33d4d', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'f551d314-5376-40b4-9eb4-9b2067f90ecf', 'CLICKED_LINK', false, 9087, '2026-01-13 20:53:00.179');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('daa8aba9-e218-48f0-b1f4-4ef260c65559', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'fbefa77c-c1bf-4efa-871f-2d79ee1a0d4a', 'CLICKED_LINK', false, 13379, '2026-02-08 15:44:52.634');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('c604991e-e83a-4183-aecc-ea7b16795740', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '4942f3ad-d0ce-432d-9301-2abe09cb0779', 'REPORTED', false, 5920, '2026-03-27 19:54:24.03');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('3a60cc6d-72ba-4137-ae42-1d7c3c5f538a', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '51ad8f8e-02e5-4ba8-b941-2dfc26d47a4e', 'DELETED', false, 3717, '2026-04-02 14:42:15.513');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('e272a5cd-d5d2-4dc6-bcde-93e72ae0fc06', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '75d124dc-4990-4504-9eed-90e795de37aa', 'REPORTED', true, 9936, '2026-03-18 02:55:32.382');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('1859dda0-ae36-4061-8893-75474e6ca9a8', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'e14a89d3-067d-4c91-97d0-f3eac92af585', 'IGNORED', true, 38410, '2026-04-27 23:36:32.234');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('1959e51a-c9be-44ee-ac6d-9ccc304abcd7', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'd0ef058b-7cc9-4a98-b362-40b7fa0e29f6', 'REPORTED', false, 39337, '2026-01-25 23:14:13.778');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('171e2fb4-8cb0-41f3-9ee9-6196fc1e0f8f', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '13741d89-7f1e-4a78-8db4-c1ecf0d4bc99', 'CLICKED_LINK', false, 41000, '2026-01-31 09:05:15.889');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('3135ea9d-c59e-41cf-83fc-f5a23e664864', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'd0ef058b-7cc9-4a98-b362-40b7fa0e29f6', 'DELETED', false, 52712, '2026-02-04 07:55:40.533');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('a916712a-18a5-4dd3-9932-6e4d464fa21e', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'f551d314-5376-40b4-9eb4-9b2067f90ecf', 'MARKED_SAFE', true, 3319, '2025-12-29 04:15:38.941');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('a42132a7-8622-43ae-a40b-bad172199f37', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '6d2a44c9-f556-45ed-88dc-2ad2bd7878ad', 'CLICKED_LINK', false, 25634, '2026-04-26 15:38:59.78');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('412a3bf0-e29b-4a4f-8cef-1280115020f2', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'b5fb07f2-2185-4db0-9454-de2fbdce5867', 'REPORTED', true, 36738, '2026-01-08 02:55:26.733');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('b0d933ce-0a37-4d50-9bb6-0d21ba7798dd', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'c3bd68ab-9caf-4be0-9c7c-b394b3fc6fae', 'REPORTED', true, 40597, '2026-01-08 12:15:28.789');
INSERT INTO public.phishing_attempts (id, "userId", "scenarioId", "userAction", "isCorrect", "responseTimeMs", "attemptedAt") VALUES ('5b3be0cf-fbd9-454d-baeb-f9ac743e7e24', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '2fc625d9-2d27-47bc-a6ec-b3fbf815c519', 'MARKED_SAFE', false, 42131, '2026-04-11 13:29:01.916');


--
-- Data for Name: phishing_scenarios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('2fc625d9-2d27-47bc-a6ec-b3fbf815c519', 'Fake Bank Security Alert', 'A classic bank phishing email with urgent language and suspicious links', 'Beginner', 'Banking', true, 'Security Team', 'security@bank-secure-alert.com', 'URGENT: Your Account Has Been Compromised!', '<p>Dear Valued Customer,</p>
<p>We have detected <strong>suspicious activity</strong> on your account. Your account has been temporarily suspended due to unauthorized access attempts.</p>
<p><strong style="color: red;">ACTION REQUIRED IMMEDIATELY</strong></p>
<p>Click the link below to verify your identity and restore your account access:</p>
<p><a href="#">https://secure-bank-verify.com/restore-account</a></p>
<p>If you do not verify your account within 24 hours, it will be permanently closed.</p>
<p>Best regards,<br>Bank Security Team</p>', '{}', true, '{"Generic greeting (''Valued Customer'') instead of your name","Suspicious sender domain (bank-secure-alert.com instead of official bank domain)","Creates urgency with threats and deadlines","Asks you to click a link to ''verify'' your account","Poor grammar and excessive capitalization"}', NULL, '2026-02-01 02:37:11.005', '2026-02-01 02:37:11.005');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('fea2e938-0f41-429d-b612-8f45f914588d', 'Prize Winner Notification', 'Lottery scam promising a large cash prize', 'Beginner', 'Prize/Lottery', true, 'International Lottery Commission', 'winner@intl-lottery-prize.org', 'Congratulations! You''ve Won $1,500,000!', '<p>CONGRATULATIONS!!!</p>
<p>Your email address was randomly selected in our international lottery draw and you have won the grand prize of <strong>$1,500,000 USD</strong>!</p>
<p>To claim your prize, please reply with the following information:</p>
<ul>
<li>Full Name</li>
<li>Date of Birth</li>
<li>Address</li>
<li>Phone Number</li>
<li>Bank Account Details</li>
</ul>
<p>You must respond within 48 hours or your prize will be forfeited!</p>
<p>Congratulations again!</p>
<p>Dr. James Williams<br>Prize Claims Manager</p>', '{Claim_Form.exe}', true, '{"You can''t win a lottery you never entered","Requests sensitive personal and financial information","Suspicious attachment with .exe extension","Creates urgency with deadline threats","Poor formatting with excessive punctuation"}', NULL, '2026-02-01 02:37:11.009', '2026-02-01 02:37:11.009');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('c425046e-0396-43cb-8ee0-0ed3b7ac1a5e', 'IT Password Reset', 'Fake IT department asking for password reset', 'Beginner', 'IT Support', true, 'IT Help Desk', 'helpdesk@it-support-dept.net', 'Password Expiration Notice - Immediate Action Required', '<p>Hello,</p>
<p>Our records indicate that your company password will expire in <strong>2 hours</strong>.</p>
<p>To avoid being locked out of your account, please click the link below to update your password immediately:</p>
<p><a href="#">http://company-password-reset.com/update</a></p>
<p>You will need to enter your current password and create a new one.</p>
<p>If you have any questions, please do not reply to this email. Contact support at support@it-support-dept.net</p>
<p>Thank you,<br>IT Help Desk</p>', '{}', true, '{"External email domain, not from your company","Creates artificial urgency (2 hours)","Link goes to external website, not company intranet","Legitimate IT departments don''t ask for current passwords via email","Generic greeting without your name"}', NULL, '2026-02-01 02:37:11.011', '2026-02-01 02:37:11.011');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('52094c9c-cee2-4b0d-9a9b-0add0adb3359', 'CEO Wire Transfer Request', 'Business email compromise impersonating the CEO', 'Intermediate', 'HR/Payroll', true, 'Michael Johnson', 'm.johnson@company-exec.co', 'Urgent Wire Transfer - Confidential', '<p>Hi,</p>
<p>I need you to process an urgent wire transfer for a confidential acquisition we''re finalizing today.</p>
<p>Amount: $45,000<br>
Account: 1234567890<br>
Bank: First National Bank<br>
Routing: 021000021</p>
<p>Please handle this immediately and keep it confidential - we''ll discuss at the board meeting next week.</p>
<p>I''m in meetings all day so email only please.</p>
<p>Thanks,<br>Michael<br><br>
<em>Sent from my iPhone</em></p>', '{}', true, '{"Similar but not exact email domain (company-exec.co vs official domain)","Urgent request bypassing normal approval processes","Request to keep transaction confidential","Sender claims to be unavailable for verification calls","Unusual request from executive to regular employee"}', NULL, '2026-02-01 02:37:11.012', '2026-02-01 02:37:11.012');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('b5fb07f2-2185-4db0-9454-de2fbdce5867', 'Shipping Delivery Notification', 'Fake package delivery notification with malicious tracking link', 'Intermediate', 'Shipping', true, 'UPS Delivery Team', 'delivery@ups-tracking-notify.com', 'Your Package Could Not Be Delivered - Action Required', '<p>Dear Customer,</p>
<p>We attempted to deliver your package today but were unable to complete delivery.</p>
<p><strong>Tracking Number:</strong> 1Z999AA10123456784</p>
<p>Reason: Incorrect address information</p>
<p>To reschedule delivery, please update your address information by clicking below:</p>
<p><a href="#">Track and Update Delivery</a></p>
<p>If we don''t hear from you within 3 business days, your package will be returned to sender.</p>
<p>Thank you for choosing UPS.</p>
<p><img src="#" alt="UPS Logo" /></p>', '{Shipping_Label.pdf}', true, '{"Not from official UPS domain (ups.com)","Generic tracking number format","You may not be expecting a package","Suspicious attachment - legitimate shipping companies don''t send labels this way","Link text doesn''t show actual URL destination"}', NULL, '2026-02-01 02:37:11.013', '2026-02-01 02:37:11.013');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('305dc921-439f-4238-9da3-8403eae87052', 'LinkedIn Connection Request', 'Fake LinkedIn notification with credential harvesting link', 'Intermediate', 'Social Media', true, 'LinkedIn', 'notifications@linkedln-mail.com', 'Sarah Chen wants to connect with you', '<p>Hi,</p>
<p><strong>Sarah Chen</strong>, Senior Recruiter at Google, has sent you a connection request.</p>
<p>"Hi! I came across your profile and I''m impressed with your experience. We have several positions that might interest you. Let''s connect!"</p>
<p><a href="#">Accept Connection</a> | <a href="#">View Profile</a></p>
<hr>
<p style="font-size: 12px; color: gray;">This email was sent to you by LinkedIn. LinkedIn, 1000 W Maude Ave, Sunnyvale, CA 94085</p>', '{}', true, '{"Misspelled domain: ''linkedln'' instead of ''linkedin''","Enticing offer from prestigious company recruiter","Links likely lead to credential harvesting page","Check the actual URL before clicking - hover over links"}', NULL, '2026-02-01 02:37:11.015', '2026-02-01 02:37:11.015');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('c3bd68ab-9caf-4be0-9c7c-b394b3fc6fae', 'DocuSign Contract Review', 'Sophisticated DocuSign impersonation with urgent contract', 'Advanced', 'E-commerce', true, 'DocuSign', 'dse@docusign.net', 'Contract Ready for Your Signature - Expires Today', '<p style="text-align: center;"><img src="#" alt="DocuSign" width="200" /></p>
<p>Hello,</p>
<p>A document has been sent to you for electronic signature by <strong>Legal Department - Acme Corp</strong>.</p>
<p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
<strong>Document:</strong> Employment Agreement Amendment<br>
<strong>Sender:</strong> hr@acme-corp.com<br>
<strong>Expires:</strong> Today at 5:00 PM
</p>
<p style="text-align: center;"><a href="#" style="background: #ffc107; padding: 10px 30px; color: #000; text-decoration: none; border-radius: 3px;">REVIEW DOCUMENT</a></p>
<p style="font-size: 11px; color: gray;">Do not share this email. The link is unique to you.<br>
Powered by DocuSign. Questions? Visit support.docusign.com</p>', '{}', true, '{"DocuSign uses docusign.com, not docusign.net for official emails","Creating urgency with same-day expiration","Verify with sender through separate communication channel","Hover over buttons to check actual link destination","Legitimate DocuSign emails include more account details"}', NULL, '2026-02-01 02:37:11.016', '2026-02-01 02:37:11.016');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('13741d89-7f1e-4a78-8db4-c1ecf0d4bc99', 'Zoom Meeting Recording Available', 'Fake Zoom notification exploiting remote work trends', 'Advanced', 'IT Support', true, 'Zoom Video', 'no-reply@zoom-cloud-recordings.com', 'Cloud Recording: Project Review Meeting is now available', '<p>Hi,</p>
<p>Your cloud recording is now available.</p>
<p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">
<strong>Meeting:</strong> Project Review Meeting<br>
<strong>Host:</strong> Your Manager<br>
<strong>Date:</strong> 1/31/2026<br>
<strong>Duration:</strong> 45 minutes
</p>
<p><a href="#" style="background: #2D8CFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">View Recording</a></p>
<p>This recording will be available for 30 days.</p>
<p style="font-size: 11px; color: gray;">Copyright 2024 Zoom Video Communications, Inc.</p>', '{}', true, '{"Sender domain is not zoom.us","Vague meeting details that could apply to anyone","Link likely leads to credential harvesting page","Verify with your calendar - were you actually in this meeting?","Check with the supposed host before clicking"}', NULL, '2026-02-01 02:37:11.018', '2026-02-01 02:37:11.018');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('d0ef058b-7cc9-4a98-b362-40b7fa0e29f6', 'Company Newsletter', 'Regular company newsletter from verified internal source', 'Beginner', 'General', true, 'Company Communications', 'communications@yourcompany.com', 'January Newsletter: Company Updates & Events', '<p>Hello Team,</p>
<p>Here''s what''s happening at YourCompany this month:</p>
<h3>Company News</h3>
<ul>
<li>Q4 results exceeded expectations - thank you all!</li>
<li>New cafeteria menu starts February 1st</li>
<li>Reminder: Office closed for President''s Day</li>
</ul>
<h3>Upcoming Events</h3>
<ul>
<li>Feb 5: Town Hall Meeting (Building A Auditorium)</li>
<li>Feb 14: Valentine''s Day Potluck</li>
</ul>
<p>Have news to share? Contact communications@yourcompany.com</p>
<p>Best,<br>The Communications Team</p>', '{}', false, '{}', 'This email is from your verified company domain, contains general information without requesting any action or personal data, and matches regular company communication patterns.', '2026-02-01 02:37:11.02', '2026-02-01 02:37:11.02');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('e14a89d3-067d-4c91-97d0-f3eac92af585', 'Calendar Meeting Invitation', 'Standard meeting invitation from a known colleague', 'Beginner', 'General', true, 'Sarah Martinez', 'smartinez@yourcompany.com', 'Meeting: Q1 Planning Session', '<p>Hi,</p>
<p>I''d like to invite you to our Q1 planning session.</p>
<p><strong>When:</strong> Tuesday, February 6th at 2:00 PM<br>
<strong>Where:</strong> Conference Room B / Zoom link in calendar invite<br>
<strong>Duration:</strong> 1 hour</p>
<p><strong>Agenda:</strong></p>
<ol>
<li>Review Q4 outcomes</li>
<li>Discuss Q1 priorities</li>
<li>Resource allocation</li>
</ol>
<p>Please confirm your attendance by accepting the calendar invite.</p>
<p>Thanks,<br>Sarah</p>', '{Q1_Planning_Agenda.pdf}', false, '{}', 'Email is from a colleague at your company domain, contains specific meeting details, references your company calendar system, and doesn''t request sensitive information.', '2026-02-01 02:37:11.022', '2026-02-01 02:37:11.022');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('4d89ad17-cb07-4568-92bc-44de99970ceb', 'Password Expiration Reminder', 'Legitimate IT notification about password policy', 'Intermediate', 'IT Support', true, 'IT Security', 'it-security@yourcompany.com', 'Reminder: Your password expires in 14 days', '<p>Hello,</p>
<p>As part of our security policy, your network password will expire in 14 days.</p>
<p><strong>How to change your password:</strong></p>
<ol>
<li>Press Ctrl+Alt+Delete on your computer</li>
<li>Select "Change a password"</li>
<li>Follow the prompts</li>
</ol>
<p>Or visit the IT Self-Service Portal at <strong>https://selfservice.yourcompany.com</strong> (internal network only)</p>
<p><strong>Password Requirements:</strong></p>
<ul>
<li>Minimum 12 characters</li>
<li>At least one uppercase and lowercase letter</li>
<li>At least one number and special character</li>
<li>Cannot reuse last 10 passwords</li>
</ul>
<p>Questions? Contact the IT Help Desk at ext. 4357 or helpdesk@yourcompany.com</p>
<p>IT Security Team</p>', '{}', false, '{}', 'This email is from your company''s official IT domain, provides instructions to use secure internal methods (Ctrl+Alt+Delete, internal portal), gives reasonable 14-day notice without extreme urgency, and provides legitimate contact information for verification.', '2026-02-01 02:37:11.023', '2026-02-01 02:37:11.023');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('51ad8f8e-02e5-4ba8-b941-2dfc26d47a4e', 'Order Confirmation from Amazon', 'Legitimate Amazon order confirmation', 'Intermediate', 'E-commerce', true, 'Amazon.com', 'auto-confirm@amazon.com', 'Your Amazon.com order #112-3456789-0123456', '<p style="text-align: center;"><img src="#" alt="Amazon" /></p>
<p>Hello,</p>
<p>Thank you for your order. We''ll send a confirmation when your items ship.</p>
<p style="background: #f3f3f3; padding: 15px;">
<strong>Order #112-3456789-0123456</strong><br>
Arriving: Friday, February 9
</p>
<p><strong>Shipping to:</strong><br>
John Smith<br>
123 Main Street<br>
Anytown, ST 12345</p>
<p><strong>Order Summary:</strong><br>
USB-C Cable (2-pack) - $12.99<br>
Shipping: FREE (Prime)<br>
<strong>Order Total: $12.99</strong></p>
<p>Track your package or manage your order at <strong>amazon.com/your-orders</strong></p>
<p style="font-size: 11px;">This email was sent from a notification-only address. Please do not reply.</p>', '{}', false, '{}', 'This email is from amazon.com (official domain), contains specific order details you can verify in your Amazon account, shows your correct shipping address, and directs you to amazon.com to manage orders rather than clicking links.', '2026-02-01 02:37:11.024', '2026-02-01 02:37:11.024');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('f551d314-5376-40b4-9eb4-9b2067f90ecf', 'Two-Factor Authentication Setup', 'Legitimate 2FA setup notification from your bank', 'Advanced', 'Banking', true, 'Wells Fargo Security', 'alerts@notify.wellsfargo.com', 'Your Two-Step Verification has been updated', '<p><img src="#" alt="Wells Fargo" /></p>
<p>Hello JOHN,</p>
<p>Your Two-Step Verification settings were recently updated.</p>
<p><strong>Change Details:</strong></p>
<ul>
<li>New phone number added ending in ****7890</li>
<li>Date: 1/31/2026</li>
<li>Location: San Francisco, CA</li>
</ul>
<p>If you made this change, no action is needed.</p>
<p>If you did not make this change, please sign in to your account at <strong>wellsfargo.com</strong> immediately and review your security settings, or call us at 1-800-869-3557.</p>
<p style="font-size: 11px; color: gray;">Wells Fargo Bank, N.A. Member FDIC<br>
This is an automated message - please do not reply directly.</p>', '{}', false, '{}', 'This email is from Wells Fargo''s verified notification domain, uses your first name, provides specific details you can verify, directs you to type wellsfargo.com directly (not click a link), and provides the official customer service number for verification.', '2026-02-01 02:37:11.026', '2026-02-01 02:37:11.026');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('76e0beb9-cefd-4acb-b518-58bab6e0f1d9', 'Amazon Prize Winner Notification', 'Fake Amazon email claiming user won a prize', 'Intermediate', 'Retail', true, 'Amazon Customer Service', 'prizes@amazon-winners.org', 'Congratulations! You''ve Won a $500 Amazon Gift Card', 'Dear Lucky Winner,

CONGRATULATIONS! Your email address has been randomly selected in our monthly customer appreciation draw.

You have won a $500 Amazon Gift Card!

To claim your prize, please click the link below and enter your details:

CLAIM YOUR PRIZE NOW: http://amazon-claim-prize.xyz/winner

You must claim within 72 hours or the prize will be forfeited to another customer.

This is a limited time offer!

Amazon Customer Rewards Team', '{}', true, '{"Unexpected prize/lottery notification","Suspicious domain (.org and .xyz)","Creates urgency (72 hour deadline)","No official Amazon branding","Asks to enter personal details on external site","Too good to be true"}', NULL, '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('09c2cd6b-9990-4983-9d68-aa78f617e519', 'Software License Renewal', 'Legitimate renewal notice from software vendor', 'Advanced', 'IT Support', true, 'Microsoft Volume Licensing', 'mslicense@microsoft.com', 'Action Required: Your Microsoft 365 licenses expire in 30 days', '<p><img src="#" alt="Microsoft" /></p>
<p>Hello,</p>
<p>Your organization''s Microsoft 365 Business licenses are set to expire in 30 days.</p>
<p><strong>License Details:</strong></p>
<table style="border-collapse: collapse; width: 100%;">
<tr style="background: #f5f5f5;"><td style="padding: 8px;">Agreement Number</td><td style="padding: 8px;">12345678</td></tr>
<tr><td style="padding: 8px;">Product</td><td style="padding: 8px;">Microsoft 365 Business Premium</td></tr>
<tr style="background: #f5f5f5;"><td style="padding: 8px;">Quantity</td><td style="padding: 8px;">50 licenses</td></tr>
<tr><td style="padding: 8px;">Expiration Date</td><td style="padding: 8px;">March 15, 2024</td></tr>
</table>
<p>To renew your licenses:</p>
<ol>
<li>Contact your Microsoft account representative</li>
<li>Or sign in to the Microsoft 365 Admin Center at <strong>admin.microsoft.com</strong></li>
</ol>
<p>If you have questions, contact your Microsoft Partner or call 1-800-426-9400.</p>
<p style="font-size: 11px;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>', '{}', false, '{}', 'Email is from microsoft.com official domain, contains specific account details that can be verified, provides 30 days notice (not urgent deadline), directs to official Microsoft admin portal by name, and provides official contact methods.', '2026-02-01 02:37:11.027', '2026-02-01 02:37:11.027');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('a1c3baea-6299-45a8-9b59-5ddc315ddb46', 'Urgent Account Verification Required', 'Fake PayPal email requesting immediate account verification', 'Beginner', 'Finance', true, 'PayPal Security Team', 'security@paypa1-secure.com', 'URGENT: Verify Your Account Within 24 Hours', 'Dear Valued Customer,

We have detected unusual activity on your PayPal account. For your security, we have temporarily limited your account access.

To restore full access, please verify your information immediately by clicking the link below:

https://paypal-secure-verify.com/account/verify

You have 24 hours to complete this verification, or your account will be permanently suspended.

Thank you for your prompt attention to this matter.

PayPal Security Team', '{}', true, '{"Misspelled domain (paypa1 instead of paypal)","Creates false urgency (24 hour deadline)","Threatening account suspension","Suspicious verification link","Generic greeting instead of personalized"}', NULL, '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('fbefa77c-c1bf-4efa-871f-2d79ee1a0d4a', 'Cryptocurrency Investment Opportunity', 'Fake crypto investment scam email', 'Advanced', 'Finance', true, 'Bitcoin Investment Fund', 'opportunities@crypto-invest-secure.com', 'EXCLUSIVE: Turn $500 into $50,000 in 30 Days', 'Dear Future Millionaire,

You''ve been selected for an EXCLUSIVE opportunity to join our elite Bitcoin investment program.

Our proprietary AI trading algorithm guarantees:
✓ 10,000% returns in 30 days
✓ Zero risk - money-back guarantee
✓ Only 50 spots available
✓ Limited time offer expires in 24 hours

Minimum investment: $500
Expected return: $50,000

CLICK HERE TO SECURE YOUR SPOT:
https://crypto-millionaire-club.net/invest-now

Don''t miss this once-in-a-lifetime opportunity!

Act now before all spots are filled!

Bitcoin Investment Fund
Zurich, Switzerland', '{Investment_Prospectus.exe}', true, '{"Unrealistic returns (10,000% is impossible)","Creates extreme urgency (24 hours)","Too good to be true promises","Suspicious executable attachment (.exe)","No legitimate company information","High-pressure sales tactics","Guaranteed returns (major red flag)"}', NULL, '2026-02-01 14:35:02.575', '2026-02-01 14:35:02.575');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('75d124dc-4990-4504-9eed-90e795de37aa', 'Netflix Subscription Expired', 'Fake Netflix email claiming payment failure', 'Intermediate', 'Entertainment', true, 'Netflix Billing', 'billing@netflix-support.net', 'Your Netflix subscription has been suspended', 'Hi there,

We''re having trouble processing your payment for Netflix.

Your subscription has been suspended. To continue enjoying Netflix, please update your payment information:

UPDATE PAYMENT METHOD: https://netflix-billing.net/update-payment

If we don''t receive your payment within 48 hours, your account will be permanently closed and you will lose access to all your saved preferences and watch history.

The Netflix Team', '{Invoice_Dec2025.pdf}', true, '{"Wrong domain (.net instead of .com)","Creates urgency with account closure threat","Suspicious payment link","Attachment could contain malware","Lacks Netflix official branding"}', NULL, '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('4942f3ad-d0ce-432d-9301-2abe09cb0779', 'Bank Statement Ready', 'Legitimate bank notification about monthly statement', 'Beginner', 'Finance', true, 'Scotia Bank Notifications', 'statements@scotiabank.com', 'Your December 2025 Statement is Ready', 'Dear John Doe,

Your monthly statement for December 2025 is now available.

To view your statement, please log in to online banking through our official website at www.scotiabank.com or mobile app.

Account ending in: **4532
Statement Period: December 1-31, 2025

If you have any questions, please contact us at 1-800-472-6842.

Best regards,
Scotia Bank

This is an automated message. Please do not reply to this email.', '{}', false, '{}', 'Official bank domain, no suspicious links, professional formatting, contains account-specific information', '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('baf36023-77d0-4f62-a55d-5119a7a0ff4a', 'Team Meeting Invitation', 'Legitimate meeting invitation from colleague', 'Beginner', 'Corporate', true, 'Jennifer Martinez', 'jennifer.martinez@company.com', 'Weekly Team Sync - Wednesday 2PM', 'Hi Team,

This is a reminder for our weekly team sync meeting:

Date: Wednesday, January 8, 2026
Time: 2:00 PM - 3:00 PM EST
Location: Conference Room B / Microsoft Teams

Agenda:
1. Project status updates
2. Q1 planning review
3. Upcoming deadlines
4. Open discussion

Teams Link: [Join Microsoft Teams Meeting]
Meeting ID: 123 456 789

See you there!

Jennifer Martinez
Project Manager
Company Name Ltd.
jennifer.martinez@company.com | Ext: 4421', '{}', false, '{}', 'Internal company email, legitimate domain, expected meeting invitation, proper contact information, no suspicious links', '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('fb179c56-68f7-420c-b674-ab6ffba6da8a', 'IRS Tax Refund Processing', 'Fake IRS email claiming tax refund is ready', 'Advanced', 'Government', true, 'Internal Revenue Service', 'refunds@irs-treasury.gov', 'Tax Refund Notification - $1,847.00 Approved', 'INTERNAL REVENUE SERVICE
United States Department of Treasury

Taxpayer ID: ***-**-4532
Tax Year: 2025

Dear Taxpayer,

After reviewing your tax return for fiscal year 2025, we have determined that you are eligible for a tax refund of $1,847.00.

To process your refund, please verify your bank account information by clicking the secure link below:

https://irs.treasury-refund.com/verify

Please note: Failure to verify your information within 7 days will result in your refund being sent via check, which may take 6-8 weeks to process.

For faster processing, please verify immediately.

Internal Revenue Service
Department of Treasury', '{TAX_REFUND_FORM.pdf}', true, '{"Wrong domain (irs-treasury.gov is not official)","IRS never sends unsolicited emails about refunds","Requests sensitive banking information via email","Creates urgency with processing delay threat","Suspicious attachment","IRS uses official IRS.gov domain only"}', NULL, '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('90f16bf0-cf98-4698-893a-069dff86e7d1', 'Company Holiday Schedule', 'Legitimate HR email about company holidays', 'Beginner', 'Corporate', true, 'Human Resources', 'hr@company.com', '2026 Holiday Schedule and Office Closure Dates', 'Dear Team,

Please find below the official holiday schedule for 2026:

New Year''s Day - January 1
Good Friday - April 10
Easter Monday - April 13
Labour Day - May 1
Independence Day - May 26
CARICOM Day - July 6
Emancipation Day - August 1
Christmas Day - December 25
Boxing Day - December 26

Please plan your work accordingly. For any questions regarding leave requests during these periods, please contact HR at extension 2500.

Best regards,
Sarah Johnson
HR Manager
Company Name Ltd.', '{}', false, '{}', 'Internal company email, legitimate HR domain, contains factual information, professional signature with contact details', '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('477e03fd-c4a7-44ac-8fec-821672785ca1', 'Microsoft 365 License Renewal', 'Legitimate Microsoft license renewal notification', 'Intermediate', 'Corporate', true, 'Microsoft 365 Admin', 'admin@microsoft.com', 'Your Microsoft 365 Business License Renewal', 'Hello Administrator,

This is a reminder that your Microsoft 365 Business subscription is due for renewal on January 15, 2026.

Subscription Details:
- Plan: Microsoft 365 Business Standard
- Users: 25
- Renewal Date: January 15, 2026
- Amount: $312.50/month

To manage your subscription or update billing information, please sign in to the Microsoft 365 admin center at https://admin.microsoft.com

If you have questions, contact Microsoft Support at 1-800-642-7676.

Thank you for choosing Microsoft 365.

Microsoft Corporation', '{}', false, '{}', 'Official Microsoft domain, correct admin portal link, provides official support number, professional formatting, no urgency or threats', '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');
INSERT INTO public.phishing_scenarios (id, title, description, difficulty, category, "isActive", "senderName", "senderEmail", subject, body, attachments, "isPhishing", "redFlags", "legitimateReason", "createdAt", "updatedAt") VALUES ('6d2a44c9-f556-45ed-88dc-2ad2bd7878ad', 'IT Department Password Reset', 'Fake internal IT email requesting password reset', 'Beginner', 'Corporate', true, 'IT Support', 'it-support@companyname-helpdesk.com', 'Mandatory Password Reset - Action Required', 'Hello,

As part of our security upgrade, all employees must reset their passwords immediately.

Please click here to reset your password: http://company-portal-login.tk/reset

Failure to complete this within 2 hours will result in account lockout.

IT Department
Internal Extension: 5555', '{}', true, '{"External domain (.tk is a free domain)","Unsolicited password reset request","Creates false urgency (2 hour deadline)","Suspicious reset link","Generic signature with fake extension"}', NULL, '2026-02-01 14:35:02.574', '2026-02-01 14:35:02.574');


--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.platform_settings (id, "platformName", "platformDescription", "supportEmail", "contactEmail", "requireEmailVerification", "minPasswordLength", "sessionTimeout", "enableTwoFactor", "maxLoginAttempts", "autoEnrollNewUsers", "defaultCourseVisibility", "defaultQuizPassingScore", "enableCertificates", "allowCourseReviews", "defaultUserRole", "allowSelfRegistration", "requireProfileCompletion", "enablePublicProfiles", "enableEmailNotifications", "enableEnrollmentEmails", "enableCompletionEmails", "enableWeeklyDigest", "smtpHost", "smtpPort", "smtpUser", "smtpPassword", "primaryColor", "logoUrl", favicon, "customCss", "createdAt", "updatedAt", "accentColor", "borderRadius", "darkModeDefault", "fontFamily", "fontSize", "secondaryColor") VALUES ('singleton', 'CyberGuard AI', 'Advanced cybersecurity training platform for professionals and enthusiasts', 'support@cyberguard.com', 'contact@cyberguard.com', false, 6, 7, false, 5, false, 'public', 70, true, true, 'STUDENT', true, false, false, false, true, true, false, '', '587', '', '', '#10b981', '', '', '', '2026-01-26 16:08:58.302', '2026-02-01 16:29:06.113', '#f3b853', 'medium', false, 'Inter', 'normal', '#10b981');


--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('d45154e0-9f34-4d11-8897-e77e42d3c939', '528d4643-aea9-4c57-85fb-05f435c98ef0', '1c9f650a-57ba-48a0-9c13-feb285d42d46', true, '2026-03-25 11:43:29.434');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('08b3f309-c893-4061-851d-2698cf37ab0b', '528d4643-aea9-4c57-85fb-05f435c98ef0', '81209361-16e1-452b-8c91-fb7617a4a158', true, '2026-03-24 11:43:29.434');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0883af78-b178-44a7-9ffd-0962b88ac7c1', '528d4643-aea9-4c57-85fb-05f435c98ef0', '0d81f2f7-cfee-4de3-b143-a0be638743d0', true, '2026-02-16 10:30:41.705');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('6479c1e2-a15b-4752-be1c-7ddd047a8df6', '528d4643-aea9-4c57-85fb-05f435c98ef0', '94cd37ff-425b-4f64-a64b-7caad74eab20', true, '2026-02-18 10:30:41.705');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('4a5af454-454b-4163-85b6-c1c0904ef10e', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', '1c9f650a-57ba-48a0-9c13-feb285d42d46', true, '2026-03-06 04:30:22.258');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('57db88e5-47f6-4570-9fe5-d4e19fb024c2', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', '81209361-16e1-452b-8c91-fb7617a4a158', true, '2026-03-06 04:30:22.258');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('95c751b6-6131-44a0-8559-751cd11a04f1', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', '565e71ee-82bc-4bcd-8774-a35793a011c0', true, '2026-03-10 04:30:22.258');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('79d21d25-4e83-48f7-960b-c07aee47aa5d', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '0053045f-cff4-46f7-8455-5a7e0c81831d', true, '2025-11-28 17:59:26.86');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('e98e420c-6270-4ce1-8876-00b5d9f47c60', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '407f37a3-03fe-4f4c-b8ca-ad98ff4988f5', true, '2025-12-04 17:59:26.86');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('c97e1b4d-c6da-4859-ae63-1c778aac1981', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '1c9f650a-57ba-48a0-9c13-feb285d42d46', true, '2026-01-05 09:28:59.792');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('bb578eb6-6044-4d09-9c6f-969adc9e685e', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '81209361-16e1-452b-8c91-fb7617a4a158', true, '2026-01-05 09:28:59.792');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('9978461a-c4a0-4e89-88ae-731a0bda9909', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '565e71ee-82bc-4bcd-8774-a35793a011c0', true, '2026-01-10 09:28:59.792');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('c5402c7b-98bd-43f4-9e35-6eb1ee65c309', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'c472dce0-5357-4b1a-a041-b370123b9e99', true, '2026-02-06 21:28:18.03');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('857ca2f4-4fe9-4c58-8948-1224184de32a', '894e4aee-1905-4890-8262-253709d1047b', '0d81f2f7-cfee-4de3-b143-a0be638743d0', true, '2026-01-29 23:43:46.443');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('dcc35c44-4b8c-4210-af8d-e1fddc1284f1', '894e4aee-1905-4890-8262-253709d1047b', '94cd37ff-425b-4f64-a64b-7caad74eab20', true, '2026-02-03 23:43:46.443');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ab3d752c-793e-4e9d-a303-9d30af3fc3b0', 'c5b92394-9515-497a-8158-8098dd0ca649', '1c9f650a-57ba-48a0-9c13-feb285d42d46', true, '2025-11-21 02:51:20.153');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ebe2e6ed-6263-422a-a432-641af79aaf5a', 'c5b92394-9515-497a-8158-8098dd0ca649', '81209361-16e1-452b-8c91-fb7617a4a158', true, '2025-11-21 02:51:20.153');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ce706c4f-ddfb-45ae-ae39-8163592c3993', 'c5b92394-9515-497a-8158-8098dd0ca649', '565e71ee-82bc-4bcd-8774-a35793a011c0', true, '2025-11-21 02:51:20.153');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('90011859-641f-48af-8de3-a64844632b55', 'c5b92394-9515-497a-8158-8098dd0ca649', '94cd37ff-425b-4f64-a64b-7caad74eab20', true, '2026-01-05 22:45:27.993');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0d093edb-0b56-4377-86bc-6fe1c0c69efa', 'c5b92394-9515-497a-8158-8098dd0ca649', 'a55c8b10-ee57-4abd-ac81-0f6189ceea27', true, '2026-01-11 22:45:27.993');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('8f4b9943-a0a5-4b02-af5b-27e9da5f0a78', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '435091d1-3b46-4d20-99c7-b145890c2ff9', true, '2026-01-16 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('f0e990ea-3548-417d-b836-c4f7b81ae9f9', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '1c9f650a-57ba-48a0-9c13-feb285d42d46', true, '2026-01-17 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('c7dec591-74e1-4747-a771-5a00b010d747', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '81209361-16e1-452b-8c91-fb7617a4a158', true, '2026-01-22 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('86703f07-dca2-48d1-afc1-9c0da9686dba', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'fab9c765-0456-4e82-ae96-b86c9ef703a9', true, '2026-01-22 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('c307eac9-cdba-43b8-a434-e4b8aa717b29', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '565e71ee-82bc-4bcd-8774-a35793a011c0', true, '2026-01-24 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('7994f2a0-7fe0-49fb-98ff-d4169f480230', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'ea24c493-5687-4306-a5b0-225092aaf5ef', true, '2026-01-26 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('5fa8f19a-ba02-4d89-94b8-512a5d329c38', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'b2122207-ae2b-4462-8142-9a6522193112', true, '2026-01-27 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('aa9fffa3-bb7f-4307-93fb-3cb5b4e565c6', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'fe0399bb-e87d-4b82-aad5-7e7edebd4ae8', true, '2026-01-30 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('e82278d4-51de-4ffa-b379-36beabd0abbe', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'ac164df2-61d1-4330-a6dd-fdfe2faad2bb', true, '2026-02-02 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('13eb716a-1b08-44ac-a81d-a694e901a068', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '3b22f6a9-3ffb-4a11-970c-9dda18d210dd', true, '2026-02-01 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('bf961ab6-687a-44fa-9ef2-a07e8245e701', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '0d81f2f7-cfee-4de3-b143-a0be638743d0', true, '2025-12-02 12:32:56.674');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('44130c6e-33f4-4753-a716-b5c93eb838dc', 'c5b92394-9515-497a-8158-8098dd0ca649', '0d81f2f7-cfee-4de3-b143-a0be638743d0', true, '2026-01-01 22:45:27.993');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ca89be45-7ea5-4ae3-8d66-8a7f13d4050b', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'b68e58fd-e2fd-467f-a235-60b6c491cb86', true, '2026-02-06 14:01:36.882');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('f9ac35a8-1e94-49d1-9201-c41328373dab', 'ba73a499-6830-4485-bfc3-969bab02117a', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-12-09 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('c9d018fb-bf01-4bc6-988b-2f9dcef54bda', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-11-07 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('55819645-1517-4a5d-9d59-7b465d41dee1', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-11-09 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('e9fde843-f844-4325-b13f-d732c4e16dea', '5dbf085d-36c1-4aed-a7ca-a9e381872044', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-11-10 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('4b18093e-aa6a-42cc-8a59-fe26dc4b1f55', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-11-11 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('6ed8c157-5bb9-4ac7-a91a-f40a39f22b2b', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-11-13 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0667e027-ba82-4e0d-ac44-3b47d1fc1e55', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-11-15 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('eabd0d96-cf9d-4f2d-a0ab-b5786b99ec8f', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-11-16 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('aa10c7f2-4ebf-4cfa-ae78-d6901aa3e2fd', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-11-17 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('77fe02fb-3b8b-4668-a770-cebb134dc02a', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-11-19 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('5a420352-a388-4d36-84d3-8f27c70f13d7', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-11-20 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b84f3fc6-7650-46a0-8eff-9358fd3371b4', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-11-21 00:18:32.92');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ec5d2cd1-55aa-43e3-a910-9814658094a7', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-11-30 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('d0fcf2c7-cfb1-4983-bcae-c5d8ab38fc62', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-12-03 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('32492317-e810-48b1-b4cf-5148aaa31eb6', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-12-06 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('5176d4bb-4083-4ce0-b315-bf2238babb68', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-12-09 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('e40c11ea-f7bd-4d7a-804c-0078223d672f', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-12-12 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('684bd855-82e0-4917-b1d0-7eb0fc46b379', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-12-13 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('5a026082-4dae-4731-b018-d777932a3db6', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-12-14 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('f49d6d42-dd8b-42a8-849f-44143f029869', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-12-15 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('3837468e-58fe-48ae-a4d0-b0e2589d450a', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-12-16 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('2c29b981-d789-4447-a3e7-5cc1b4748512', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-12-19 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('a8aaf7d5-4952-4ac3-a61d-985093caa375', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-12-22 16:54:42.119');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('54410f9f-4da8-40b0-9175-0a3c9f185688', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-12-01 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0cc07181-c341-4f8b-b750-3abd00e273d0', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-12-04 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ed0815a8-03e3-4616-b6a2-ec7da09150b3', '789b254a-b66a-4843-b510-213e338def77', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-11-14 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('cac13149-bfc5-49bf-80af-bf5a7247d79b', '789b254a-b66a-4843-b510-213e338def77', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-11-17 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('e4bbaa0f-6c4c-4983-84e8-8151a6159b24', '789b254a-b66a-4843-b510-213e338def77', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-11-19 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('f93cd785-3a4f-4bd2-a7a4-982cfefbfc66', '789b254a-b66a-4843-b510-213e338def77', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-11-20 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('fdbe010f-42d3-47ae-a8de-4620cbb5d1c8', '789b254a-b66a-4843-b510-213e338def77', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-11-23 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('26f38570-f39b-4dad-bec7-d74fa895b727', '789b254a-b66a-4843-b510-213e338def77', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-11-26 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('a5d45272-4022-448f-9afa-fc20cc7049b4', '789b254a-b66a-4843-b510-213e338def77', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-11-28 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('1b2b1bc9-9a1e-43b3-8b1b-38dd2d95affd', '789b254a-b66a-4843-b510-213e338def77', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-11-29 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('1c633f10-f693-4ff2-8774-257cca0826b5', '789b254a-b66a-4843-b510-213e338def77', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-12-02 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('3c62599a-c5b2-4dff-abf9-c0c4fca10f3a', '789b254a-b66a-4843-b510-213e338def77', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-12-05 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('bc40f573-f2a5-4c30-813f-3dde054476f2', '789b254a-b66a-4843-b510-213e338def77', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-12-06 05:18:26.596');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b1e3a7b6-1597-4f75-8dc2-7f54fc75412d', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-12-09 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('89197b64-fb4e-4525-b9c8-3b221cf73f81', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-12-12 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('aa84b283-5aca-419e-80d7-118951bfc346', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-12-13 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('1e45de31-d0bc-43f3-82de-7406e00cd52e', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-12-16 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('65e252a3-6407-4183-8b55-df195b130266', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-12-19 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('7c09e3ab-7a91-4497-abe3-5769e5613793', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-12-20 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('29804329-8d7c-4513-a635-ab883888da38', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-12-22 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('d7466e15-61c8-49dc-b85d-0eb5e943b958', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-12-25 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('79d55cdd-7f4c-4b3f-bf3b-e4b7e4dd20b9', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-12-27 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0f9b09ff-8647-46de-97b5-9a750108b1f5', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-12-28 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('83abf403-bf4a-4fe5-b1e0-bc7bb4d770db', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-12-30 00:15:25.753');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('49818a16-0acb-4c54-913a-d309ae13d53d', '5376ee99-3223-49c9-b10f-31f5fba93eff', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-12-16 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0e95be36-16f0-4a39-bc03-07dff6bf5990', '5376ee99-3223-49c9-b10f-31f5fba93eff', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-12-19 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('0ecf32aa-4fb0-4a2d-83ae-2b104129a818', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-12-22 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('11fb089e-9930-4d91-afdc-b03774178670', '5376ee99-3223-49c9-b10f-31f5fba93eff', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-12-25 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('a96ffb39-7707-45c8-b08e-ae99e578fd7e', '5376ee99-3223-49c9-b10f-31f5fba93eff', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-12-26 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('5a4181ad-c5bf-4742-af45-c1c3570f1618', '5376ee99-3223-49c9-b10f-31f5fba93eff', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-12-27 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('537eb013-5047-449b-a0a3-3ea62d19a84b', '5376ee99-3223-49c9-b10f-31f5fba93eff', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-12-29 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('67fc3310-6d14-43ba-b22b-468ef48c308f', '5376ee99-3223-49c9-b10f-31f5fba93eff', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2026-01-01 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('68bb5066-cea4-42c2-8a72-3a9d7a27b131', '5376ee99-3223-49c9-b10f-31f5fba93eff', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2026-01-03 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('6b2f5cdf-7486-4535-9ccd-27514cde4bb2', '5376ee99-3223-49c9-b10f-31f5fba93eff', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2026-01-05 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('55a052d0-4ec3-4bf3-8c69-bc2cffe0c852', '5376ee99-3223-49c9-b10f-31f5fba93eff', '559a2965-d990-4577-88fb-27783d94926b', true, '2026-01-07 02:55:55.984');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b5beacde-5a29-488e-b655-4b6d45e674d7', 'ba73a499-6830-4485-bfc3-969bab02117a', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-11-19 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('87338d86-8b39-4385-b68d-21a0617fbcb1', 'ba73a499-6830-4485-bfc3-969bab02117a', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-11-21 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('790a6405-de21-4316-8871-eaa5eb98dbb6', 'ba73a499-6830-4485-bfc3-969bab02117a', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-11-23 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('ee60c1b1-d03a-4618-abf8-c08cc6ceb72d', 'ba73a499-6830-4485-bfc3-969bab02117a', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-11-25 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('44619bac-a50a-470e-8cdc-ff15741f960e', 'ba73a499-6830-4485-bfc3-969bab02117a', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-11-28 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('efc08c1c-4434-47a7-8251-c6019ae70066', 'ba73a499-6830-4485-bfc3-969bab02117a', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-11-29 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('a8de1093-7f45-42ce-bf50-ebf453db014f', 'ba73a499-6830-4485-bfc3-969bab02117a', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-12-01 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('bb173eac-9869-416c-8de7-d108d8e32339', 'ba73a499-6830-4485-bfc3-969bab02117a', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-12-02 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('d570d5b2-fe65-40be-ac91-208b987d6000', 'ba73a499-6830-4485-bfc3-969bab02117a', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-12-03 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('8cd139e8-8995-42b4-b87c-794fdff465b8', 'ba73a499-6830-4485-bfc3-969bab02117a', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-12-06 02:24:48.415');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('48801420-7f3f-4078-8ad0-9ab89d9b165b', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-12-07 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('dc254eb3-becf-40bf-a217-c825c7b9febf', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-12-09 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('cf4bc8ff-3bea-4c16-85fa-3b4932bd0c97', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-12-10 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b1c40858-9110-41f7-849f-4e65fcf199d8', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-12-12 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('c72bdff7-321b-4bf4-966f-6ce3af610884', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-12-13 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('33f07760-ea0d-4a44-9402-001bc90fc700', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-12-16 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('5039cd33-8dca-4069-b689-60846efb8307', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-12-19 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('4935d4c1-0cff-4b7c-bf5b-34b9a31798d9', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-12-22 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('f5a76b7f-7914-4ba5-9cf5-7def376edd95', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-12-24 08:58:01.853');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('420d73a8-ddd9-4692-b6e1-374ce50b234a', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '7212ab3d-6fc2-4500-b8c9-742514fe9bab', true, '2025-11-06 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('7652e763-cd0f-4c1f-a173-da4290655067', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '868def8f-2659-4b41-873e-44d23fc0a9b7', true, '2025-11-09 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b412189c-0333-4c70-9999-f67164d5d5d3', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', 'c4790102-5ca1-4104-ad76-5a694b333682', true, '2025-11-11 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('bdd13060-4fef-45ba-b998-19ffc2341f94', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '651d1978-db00-4f46-8948-dd9bd47efb11', true, '2025-11-13 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('87ca0bac-a099-4229-8c98-ca485aa23bb4', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '9650bd7e-441e-4c15-adfa-9707aebb8372', true, '2025-11-14 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('7ef1e748-0c6f-4b77-b9db-bd510cc63696', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '9aa8493a-86ba-47b7-a8b1-c15da9661c9e', true, '2025-11-15 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('6fb32652-d2ee-45dd-96f9-a2f8e7551bea', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '0d6ac12f-ef43-4bf7-bf5c-64991e69d5c4', true, '2025-11-18 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('6c16aeaa-7a1f-4ec6-8846-cc37f55ef792', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '67b80ac6-701e-4933-9810-8a5b903fe53d', true, '2025-11-20 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('13c94472-1a37-49bc-a32f-4ec58f32aefc', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '14cf2f60-cd10-4568-81a6-701eaaf3ec30', true, '2025-11-22 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b95ed561-ccc2-4fd8-928a-08d33d7ba032', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '9af1a942-aea7-49d0-8c24-282803c58b0a', true, '2025-11-24 10:59:39.772');
INSERT INTO public.progress (id, "userId", "lessonId", completed, "completedAt") VALUES ('b5516f30-5c7a-40d7-9425-f250b49bd096', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '559a2965-d990-4577-88fb-27783d94926b', true, '2025-11-25 10:59:39.772');


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('0fb8bd04-7f8c-4e43-9fe9-faeb27133132', '5f5b139c-adb2-4202-82d2-88402c603383', 'What is the MOST important step to take before clicking a link in an email?', '{"Check if it looks professional","Hover over it to preview the URL","Click it to see where it goes","Forward it to a friend"}', 1, 1);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('9398d191-bfe2-406f-8df4-638b5b90579e', '5f5b139c-adb2-4202-82d2-88402c603383', 'Which type of authentication provides the BEST protection against phishing?', '{"SMS codes","Security questions","Hardware security keys","Email verification"}', 2, 2);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('f60f611d-bbf7-41ee-8c47-60f1b509121a', '5f5b139c-adb2-4202-82d2-88402c603383', 'If you suspect you''ve been phished, what should you do FIRST?', '{"Delete the email","Change your passwords immediately","Wait and see if anything happens","Report it to authorities"}', 1, 3);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('a4bb9639-686d-44b9-bec2-362105d0d896', '5f5b139c-adb2-4202-82d2-88402c603383', 'What percentage of data breaches involve phishing attacks?', '{"About 30%","About 50%","About 70%","Over 90%"}', 3, 4);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('97d540fe-7d65-4a38-84b5-844f794d2d43', '5f5b139c-adb2-4202-82d2-88402c603383', 'Which is a sign that an email might be a phishing attempt?', '{"Sent from a known contact","Contains company logo","Creates urgency to act immediately","Has your correct name"}', 2, 5);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('5986f756-99e0-4e24-a2d5-6b79a782bf6d', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 'What is the minimum recommended password length?', '{"6 characters","8 characters","12 characters","20 characters"}', 2, 1);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('a64a0b0e-81d4-4360-a663-b7642e557415', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 'Which password is the STRONGEST?', '{Password123!,MyDogAte3BluePancakesIn2024!,qwerty12345,admin@123}', 1, 2);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('c05484e8-0576-4468-b649-d36f3e9bd14e', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 'What does MFA stand for?', '{"Multiple Factor Access","Multi-Factor Authentication","Main Firewall Application","Master File Authorization"}', 1, 3);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('e91e47f2-28ba-49fb-bb6c-3f3384805efb', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 'Which MFA method is considered MOST secure?', '{"SMS codes","Email verification","Hardware security keys","Security questions"}', 2, 4);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('300c4c62-65f3-4559-96db-679c63cf55a7', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 'What type of attack uses stolen credentials from one site to try on other sites?', '{"Brute force attack","Dictionary attack","Credential stuffing",Phishing}', 2, 5);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('1167c68a-33ec-4f91-a68f-80faac99a053', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 'What psychological principle do attackers exploit when creating time pressure?', '{Authority,Urgency,Reciprocity,Trust}', 1, 1);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('7b196146-26d3-499a-880d-9eecf052c121', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 'What is "tailgating" in social engineering?', '{"Following someone on social media","Physically following someone into a restricted area","Sending follow-up phishing emails","Tracking someone''s online activity"}', 1, 2);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('cd1121f1-ed86-4cbd-a6e3-b0112e45a120', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 'If someone calls claiming to be IT support and asks for your password, you should:', '{"Give it to them if they sound professional","Hang up and call IT through official channels","Ask them security questions first","Email them the password instead"}', 1, 3);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('4c21f81b-60f5-48e5-b10a-09709462b06e', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 'What is "pretexting"?', '{"Sending text messages","Creating a fake scenario to extract information","Previewing email content","Testing security systems"}', 1, 4);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('d9263672-323f-495e-a77e-11881822f246', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 'What should you do if you suspect you''ve been targeted by social engineering?', '{"Keep it to yourself","Document and report it immediately","Delete all evidence","Try to track down the attacker"}', 1, 5);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('2fe5d0ef-066b-401c-b0d9-ce75b536f527', '4240e225-9dbd-466b-a912-d0e6182e4596', 'What does APT stand for in cybersecurity?', '{"Advanced Phishing Technique","Advanced Persistent Threat","Automated Penetration Testing","Application Protocol Transfer"}', 1, 1);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('b82debe7-68c4-4e8a-97ec-d5661dcff48f', '4240e225-9dbd-466b-a912-d0e6182e4596', 'In the NIST Incident Response Framework, what is the correct order of phases?', '{"Detection, Preparation, Containment, Recovery","Preparation, Detection & Analysis, Containment & Recovery, Post-Incident","Analysis, Response, Containment, Documentation","Identification, Response, Recovery, Prevention"}', 1, 2);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('badf69d5-7247-4225-ae1b-9129986486e0', '4240e225-9dbd-466b-a912-d0e6182e4596', 'What is the primary purpose of the MITRE ATT&CK framework?', '{"To launch cyber attacks legally","To catalog adversary tactics and techniques based on real-world observations","To encrypt sensitive data","To manage firewall rules"}', 1, 3);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('bee50c82-e4b8-4ba5-bef3-3117d9ac0eab', '4240e225-9dbd-466b-a912-d0e6182e4596', 'When collecting digital evidence, which should be collected FIRST according to order of volatility?', '{"Hard drive contents","Backup media",RAM/Memory,"Physical configuration"}', 2, 4);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('90f783f4-4e46-4915-8bad-765f30f00852', '4240e225-9dbd-466b-a912-d0e6182e4596', 'What is "threat hunting"?', '{"Installing antivirus software","Proactively searching for threats that have evaded existing security controls","Blocking malicious IP addresses","Running penetration tests"}', 1, 5);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('16583bf0-5710-40d2-a59d-f0203c340217', '4240e225-9dbd-466b-a912-d0e6182e4596', 'Which of the following is NOT a type of Indicator of Compromise (IOC)?', '{"Hash values of malicious files","Known malicious IP addresses","User satisfaction scores","Malicious domain names"}', 2, 6);
INSERT INTO public.questions (id, "quizId", question, options, "correctAnswer", "order") VALUES ('b1c9a65a-664c-4085-a2f8-569a4f505890', '4240e225-9dbd-466b-a912-d0e6182e4596', 'What is the purpose of maintaining chain of custody in forensic investigations?', '{"To speed up the investigation","To document evidence handling and prove its integrity","To delete unnecessary files","To share evidence publicly"}', 1, 7);


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('dee2fd76-f034-4886-a031-fb6018eeb0a8', '789b254a-b66a-4843-b510-213e338def77', '5f5b139c-adb2-4202-82d2-88402c603383', 93, true, '2025-12-07 05:18:26.596');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('f440cc05-1616-4c3d-a1e9-39ea9f920e46', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '5f5b139c-adb2-4202-82d2-88402c603383', 89, true, '2026-01-01 00:15:25.753');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('1c3a5060-a909-4ead-aa0b-0bbcabb8e294', '5376ee99-3223-49c9-b10f-31f5fba93eff', '5f5b139c-adb2-4202-82d2-88402c603383', 78, true, '2026-01-09 02:55:55.984');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('1e2587a7-1a40-4513-acad-15a09886a7b4', 'ba73a499-6830-4485-bfc3-969bab02117a', '5f5b139c-adb2-4202-82d2-88402c603383', 75, true, '2025-12-11 02:24:48.415');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('48f2fba5-3be4-4139-8a68-170fc5b59380', '5dbf085d-36c1-4aed-a7ca-a9e381872044', '5f5b139c-adb2-4202-82d2-88402c603383', 71, true, '2025-11-23 00:18:32.92');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('6ffe4fda-e468-4e6a-a6e1-a3e51a4a1394', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '5f5b139c-adb2-4202-82d2-88402c603383', 64, false, '2025-12-24 16:54:42.119');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('a28c9b9f-867c-48e5-8c6a-97e6b88251c1', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '5f5b139c-adb2-4202-82d2-88402c603383', 72, true, '2025-12-25 16:54:42.119');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('beccaf88-9f36-45d7-9785-4a85fa8369b6', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '5f5b139c-adb2-4202-82d2-88402c603383', 62, false, '2025-12-25 08:58:01.853');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('85141948-1122-40d2-94ee-2609d592e159', 'ce259eab-9361-45ef-bec8-e416fba6d99c', '5f5b139c-adb2-4202-82d2-88402c603383', 70, true, '2025-12-27 08:58:01.853');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('bf32523b-a53f-4209-9c7d-73a138a1199e', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '5f5b139c-adb2-4202-82d2-88402c603383', 68, false, '2025-11-26 10:59:39.772');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('bf1e0024-d0ec-4535-8eee-30d4b82db894', 'dad37da9-1cff-4983-88d9-1fb08318b5cf', '5f5b139c-adb2-4202-82d2-88402c603383', 68, true, '2025-11-27 10:59:39.772');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('acd22a8c-6488-4b9a-a9ec-14872199bdde', '894e4aee-1905-4890-8262-253709d1047b', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 44, false, '2026-01-29 23:43:46.443');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('3734a69f-c0f5-4ef5-b764-f9d18cd346f4', '894e4aee-1905-4890-8262-253709d1047b', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 39, false, '2026-02-05 23:43:46.443');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('1a9394a6-e4d4-48f9-997b-1636ce356406', '894e4aee-1905-4890-8262-253709d1047b', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 53, false, '2026-02-12 23:43:46.443');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('74004add-9f47-44d3-8d95-5448408224d3', 'c5b92394-9515-497a-8158-8098dd0ca649', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 90, true, '2025-11-17 02:51:20.153');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('778ba6da-c6ce-4f12-8937-2c9b86888e73', 'c5b92394-9515-497a-8158-8098dd0ca649', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 87, true, '2026-01-04 22:45:27.993');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('841d84ea-4f01-4947-b33a-d08510f1ea96', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '4240e225-9dbd-466b-a912-d0e6182e4596', 68, false, '2025-11-30 17:59:26.86');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('ce20a9db-8df2-4cd1-92a8-8cecf38ddbf8', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '4240e225-9dbd-466b-a912-d0e6182e4596', 64, false, '2025-12-05 17:59:26.86');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('829b2f2b-b503-4592-949b-70f15e04d07b', 'b38ff375-ec80-4dfb-8d98-9e64286b6c05', '4240e225-9dbd-466b-a912-d0e6182e4596', 44, false, '2025-12-09 17:59:26.86');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('228a414d-e540-4976-9463-0faa63ee71c4', 'ce259eab-9361-45ef-bec8-e416fba6d99c', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 83, true, '2026-01-03 09:28:59.792');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('606734b0-a804-4c30-a904-b96e6f1ffccb', '5376ee99-3223-49c9-b10f-31f5fba93eff', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 99, true, '2025-11-09 06:36:45.614');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('4d48e618-2701-4c99-bb82-28204b45885d', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 82, true, '2025-12-01 12:32:56.674');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('f05e0362-17e5-4db3-9ec8-60628e23aee9', '1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 81, true, '2026-01-16 14:01:36.882');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('094a1673-a3b4-45d7-a801-e4de9cf3ba77', '789b254a-b66a-4843-b510-213e338def77', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 50, false, '2026-03-04 14:31:02.839');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('c3627f7f-cd8e-4b15-ad3c-b88b8cfdc85e', '528d4643-aea9-4c57-85fb-05f435c98ef0', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 73, true, '2026-03-21 11:43:29.434');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('303bf5c1-b34f-4c4a-afdc-31088144f71d', '528d4643-aea9-4c57-85fb-05f435c98ef0', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 44, false, '2026-02-12 10:30:41.705');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('16024921-721d-43aa-b625-70f40bafbb3d', '528d4643-aea9-4c57-85fb-05f435c98ef0', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 69, false, '2026-02-15 10:30:41.705');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('a47c8d9f-110d-4496-ba56-337e19cec3c2', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 49, false, '2026-03-05 04:30:22.258');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('3d0bcc2c-5958-4454-aac3-f55e8a747af8', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 45, false, '2026-03-09 04:30:22.258');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('ff824df3-c890-4b7e-832f-c9b77a2034a7', '5cc03f21-9e6f-4172-a4e8-b469cc0625cb', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 51, false, '2026-03-16 04:30:22.258');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('474bca0c-a18d-4ceb-bf58-0fc942231a5f', '8d61bf58-7695-4641-8deb-713c95a2f662', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 50, false, '2025-11-28 17:58:02.911');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('3c87cad6-81e2-4f74-a94e-024d320626b0', '8d61bf58-7695-4641-8deb-713c95a2f662', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 38, false, '2025-12-02 17:58:02.911');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('3fbf623a-d6e0-4107-ab05-3b98ecf5a36d', '8d61bf58-7695-4641-8deb-713c95a2f662', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 48, false, '2025-12-08 17:58:02.911');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('3682ea1d-2b24-49c8-98fd-92eb756d093e', '8d61bf58-7695-4641-8deb-713c95a2f662', 'f72ababa-0c01-47bd-9e5b-f353352f06b7', 76, true, '2025-12-15 17:58:02.911');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('6e61c0de-ea2e-488a-91e0-5f980a7b1118', '8d61bf58-7695-4641-8deb-713c95a2f662', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 53, false, '2025-12-08 20:31:41.203');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('19c37e77-ff3c-46d0-9ff0-6884b44b9eb9', '8d61bf58-7695-4641-8deb-713c95a2f662', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 38, false, '2025-12-13 20:31:41.203');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('98c309df-7c7b-4e66-9384-69244726b758', '8d61bf58-7695-4641-8deb-713c95a2f662', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 46, false, '2025-12-16 20:31:41.203');
INSERT INTO public.quiz_attempts (id, "userId", "quizId", score, passed, "attemptedAt") VALUES ('363464ab-106d-49b8-870c-87556c1dc515', '8d61bf58-7695-4641-8deb-713c95a2f662', '842ae87e-d08c-4d47-aa7c-eb2df2170533', 36, false, '2025-12-19 20:31:41.203');


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quizzes (id, "lessonId", title, "passingScore") VALUES ('5f5b139c-adb2-4202-82d2-88402c603383', '559a2965-d990-4577-88fb-27783d94926b', 'Phishing Protection Quiz', 70);
INSERT INTO public.quizzes (id, "lessonId", title, "passingScore") VALUES ('f72ababa-0c01-47bd-9e5b-f353352f06b7', 'b68e58fd-e2fd-467f-a235-60b6c491cb86', 'Password Security Quiz', 70);
INSERT INTO public.quizzes (id, "lessonId", title, "passingScore") VALUES ('842ae87e-d08c-4d47-aa7c-eb2df2170533', '0ca548a6-3c3c-478d-9d9a-2b87cfff6032', 'Social Engineering Defense Quiz', 70);
INSERT INTO public.quizzes (id, "lessonId", title, "passingScore") VALUES ('4240e225-9dbd-466b-a912-d0e6182e4596', 'd270d6a8-2e09-4202-a254-d1e34034014d', 'Advanced Threat Analysis Quiz', 75);


--
-- Data for Name: settings_audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('d56fc576-9fab-4772-9228-416e3f2639bf', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'primaryColor', '#3b82f6', '#3b8280', '::1', '2026-01-27 15:55:02.205');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('5721c5a7-0793-4fc1-ba14-4d751036221c', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'platformDescription', 'Advanced cybersecurity training platform', 'Advanced cybersecurity training platform for professionals and enthusiasts', '::1', '2026-01-27 17:00:24.37');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('b14941cc-0960-4a78-b13c-a13277c55a78', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'primaryColor', '#3b8280', '#3b82f6', '::1', '2026-01-27 17:00:24.37');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('5c52abfd-4950-4a5b-a49e-030da74cde3f', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'primaryColor', '#3b82f6', '#5ee9b5', '::1', '2026-01-27 17:04:08.092');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('4da81d80-e19d-4bf8-9dd8-86ebd7d6ca78', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'secondaryColor', '#10b981', '#2d9966', '::1', '2026-01-27 17:04:08.092');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('8d74f1d1-b630-4f3a-a8ee-3782b6495587', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'primaryColor', '#5ee9b5', '#3b82f6', '::1', '2026-01-27 17:05:02.739');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('a2a07b4e-62ec-4fb5-9907-f19652d40a36', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'secondaryColor', '#2d9966', '#10b981', '::1', '2026-01-27 17:05:02.739');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('cc72fbe1-8f3c-427e-aa33-46ad440cd5b6', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'primaryColor', '#3b82f6', '#10b981', '::1', '2026-01-27 17:06:21.401');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('d4d78fe4-4564-4ca0-ab13-77c0a0a79f0d', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'platformName', 'CyberGuard AI', 'CyberGuard AI - Test', '::1', '2026-01-27 18:28:02.229');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('6dfc966d-74de-4d63-b1db-a82c6cb7bc9b', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'platformName', 'CyberGuard AI - Test', 'CyberGuard AI', '::1', '2026-01-27 18:28:31.847');
INSERT INTO public.settings_audit_log (id, "adminId", "adminEmail", action, "fieldName", "oldValue", "newValue", "ipAddress", "timestamp") VALUES ('0f2fbbd6-863a-4ff3-8c79-3038b7767015', '719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', 'UPDATE', 'accentColor', '#f59e0b', '#f3b853', '::1', '2026-02-01 16:29:06.138');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('dad37da9-1cff-4983-88d9-1fb08318b5cf', 'nadira.mohamed@gmail.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Nadira', 'Mohamed', 'STUDENT', '2025-12-28 10:05:00', '2026-01-19 00:50:42.426', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('894e4aee-1905-4890-8262-253709d1047b', 'maya.ramdass@yahoo.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Maya', 'Ramdass', 'STUDENT', '2025-12-08 14:15:00', '2026-01-19 00:50:42.426', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('5dbf085d-36c1-4aed-a7ca-a9e381872044', 'anita.khan@gmail.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Anita', 'Khan', 'STUDENT', '2025-12-05 16:30:00', '2026-01-19 00:50:42.426', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('b38ff375-ec80-4dfb-8d98-9e64286b6c05', 'rohan.narine@yahoo.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Rohan', 'Narine', 'STUDENT', '2025-11-28 15:40:00', '2026-01-19 00:50:42.426', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('ce259eab-9361-45ef-bec8-e416fba6d99c', 'simran.samaroo@outlook.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Simran', 'Samaroo', 'STUDENT', '2025-12-12 09:25:00', '2026-01-19 00:50:42.426', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('c5b92394-9515-497a-8158-8098dd0ca649', 'vishnu.bisram@outlook.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Vishnu', 'Bisram', 'STUDENT', '2025-11-25 08:00:00', '2026-02-01 15:21:20.083', '2026-02-01 15:21:20.079', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('ba73a499-6830-4485-bfc3-969bab02117a', 'shawn.english@outlook.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Shawn', 'English', 'STUDENT', '2026-01-15 09:45:00', '2026-02-01 15:40:50.299', '2026-02-01 15:40:50.295', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('1b19ada2-a51d-484a-9e9d-8afc6ed4a3ad', 'rajesh.singh@gmail.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Rajesh', 'Singh', 'STUDENT', '2025-12-01 08:15:00', '2026-02-01 18:23:41.687', '2026-02-01 18:23:41.685', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('719acdc3-370e-4adc-ae86-7c293f568063', 'admin@cyberguard.com', '$2a$10$8Ma8iwoLUqbZBevYXLL8FOWJ1FVLVVgthaYWyz9UwUtRM/oJOwLaK', 'Admin', 'User', 'ADMIN', '2026-01-19 00:50:42.332', '2026-02-01 23:10:22.732', '2026-02-01 23:10:22.728', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('5376ee99-3223-49c9-b10f-31f5fba93eff', 'priya.persaud@yahoo.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Priya', 'Persaud', 'STUDENT', '2025-12-10 14:22:00', '2026-02-01 15:08:34.722', '2026-02-01 15:08:34.72', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('8d61bf58-7695-4641-8deb-713c95a2f662', 'deepak.lall@gmail.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Deepak', 'Lall', 'STUDENT', '2026-01-10 12:50:00', '2026-01-19 00:50:42.426', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('81815a1d-28cc-4900-8c3e-fb2b4fe05ddb', 'akeemkippins.gy@gmail.com', '$2a$10$DjjdBxc5pE7SdThpQFhNg.h9622iuNpB/0KBiApounWkImDzBMpyG', 'Akeem', 'Kippins', 'ADMIN', '2026-02-01 04:00:15.767', '2026-02-01 04:00:15.767', NULL, true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('5cc03f21-9e6f-4172-a4e8-b469cc0625cb', 'kavita.ramkissoon@outlook.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Kavita', 'Ramkissoon', 'STUDENT', '2026-01-08 13:20:00', '2026-02-01 15:06:03.963', '2026-02-01 15:06:03.959', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('528d4643-aea9-4c57-85fb-05f435c98ef0', 'arjun.jaipaul@yahoo.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'Arjun', 'Jaipaul', 'STUDENT', '2025-12-20 11:10:00', '2026-02-01 18:46:26.942', '2026-02-01 18:46:26.941', true, true, true, false, true, NULL, NULL, 0);
INSERT INTO public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt", "lastLoginAt", "autoPlayVideos", "courseReminders", "emailNotifications", "marketingEmails", "showProgress", "accountLockedUntil", "lastFailedLogin", "loginAttempts") VALUES ('789b254a-b66a-4843-b510-213e338def77', 'student@example.com', '$2a$10$KwN89/Pr08Dwyy69FzmSveZzHZGBbKlBhN/tD9.ydmpaGCmNKNUmC', 'John', 'Doe', 'STUDENT', '2025-12-15 10:30:00', '2026-02-01 21:37:07.536', '2026-02-01 21:37:07.524', true, true, true, false, true, NULL, NULL, 0);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: full_assessment_attempts full_assessment_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.full_assessment_attempts
    ADD CONSTRAINT full_assessment_attempts_pkey PRIMARY KEY (id);


--
-- Name: intro_assessment_attempts intro_assessment_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_assessment_attempts
    ADD CONSTRAINT intro_assessment_attempts_pkey PRIMARY KEY (id);


--
-- Name: intro_assessments intro_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_assessments
    ADD CONSTRAINT intro_assessments_pkey PRIMARY KEY (id);


--
-- Name: intro_questions intro_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_questions
    ADD CONSTRAINT intro_questions_pkey PRIMARY KEY (id);


--
-- Name: lab_progress lab_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_progress
    ADD CONSTRAINT lab_progress_pkey PRIMARY KEY (id);


--
-- Name: labs labs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT labs_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: phishing_attempts phishing_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phishing_attempts
    ADD CONSTRAINT phishing_attempts_pkey PRIMARY KEY (id);


--
-- Name: phishing_scenarios phishing_scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phishing_scenarios
    ADD CONSTRAINT phishing_scenarios_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: settings_audit_log settings_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_audit_log
    ADD CONSTRAINT settings_audit_log_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: certificates_userId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "certificates_userId_courseId_key" ON public.certificates USING btree ("userId", "courseId");


--
-- Name: enrollments_userId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON public.enrollments USING btree ("userId", "courseId");


--
-- Name: lab_progress_userId_labId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "lab_progress_userId_labId_key" ON public.lab_progress USING btree ("userId", "labId");


--
-- Name: progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "progress_userId_lessonId_key" ON public.progress USING btree ("userId", "lessonId");


--
-- Name: quizzes_lessonId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "quizzes_lessonId_key" ON public.quizzes USING btree ("lessonId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: certificates certificates_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: certificates certificates_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: full_assessment_attempts full_assessment_attempts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.full_assessment_attempts
    ADD CONSTRAINT "full_assessment_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intro_assessment_attempts intro_assessment_attempts_introAssessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_assessment_attempts
    ADD CONSTRAINT "intro_assessment_attempts_introAssessmentId_fkey" FOREIGN KEY ("introAssessmentId") REFERENCES public.intro_assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intro_assessment_attempts intro_assessment_attempts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_assessment_attempts
    ADD CONSTRAINT "intro_assessment_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intro_questions intro_questions_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_questions
    ADD CONSTRAINT "intro_questions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: intro_questions intro_questions_introAssessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intro_questions
    ADD CONSTRAINT "intro_questions_introAssessmentId_fkey" FOREIGN KEY ("introAssessmentId") REFERENCES public.intro_assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lab_progress lab_progress_labId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_progress
    ADD CONSTRAINT "lab_progress_labId_fkey" FOREIGN KEY ("labId") REFERENCES public.labs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lab_progress lab_progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lab_progress
    ADD CONSTRAINT "lab_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: labs labs_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT "labs_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: labs labs_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labs
    ADD CONSTRAINT "labs_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: lessons lessons_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lessons lessons_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: modules modules_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: phishing_attempts phishing_attempts_scenarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phishing_attempts
    ADD CONSTRAINT "phishing_attempts_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES public.phishing_scenarios(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: phishing_attempts phishing_attempts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phishing_attempts
    ADD CONSTRAINT "phishing_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT "progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions questions_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quiz_attempts quiz_attempts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quizzes quizzes_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT "quizzes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict SDz05RccPAunGHrEsa5gWw0h0QqoLutks7C98cZL1HXGkYK3I0naXzbHXJ1qRcD

