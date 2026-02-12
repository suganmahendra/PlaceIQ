-- PlaceIQ Advanced-Level Production Schema [v2.0]
-- Optimized for Scalability, Real-time Analytics, and High-fidelity Data Integrity

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For advanced search

-- 2. Cleanup (Careful in Production)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Core Identity & Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('student', 'mentor', 'admin')) NOT NULL DEFAULT 'student',
  permissions JSONB DEFAULT '{}', -- Advanced granular access control
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Academic Infrastructure
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  head_of_dept TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.departments (name, code, description) VALUES 
('Artificial Intelligence & Data Science', 'AI&DS', 'Focus on ML, Big Data, and AI Engineering'),
('Computer Science & Engineering', 'CSE', 'Core computing, systems, and algorithms'),
('Information Technology', 'IT', 'Software development and enterprise systems')
ON CONFLICT (code) DO NOTHING;

-- 5. Student Management (Enhanced)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) DEFAULT 'Beginner',
  xp INTEGER DEFAULT 0,
  readiness_score INTEGER DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  profile_completion INTEGER DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  social_links JSONB DEFAULT '{"github": "", "linkedin": "", "portfolio": ""}',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Mentor Management (Enhanced)
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  expertise TEXT[],
  years_of_experience INTEGER DEFAULT 0,
  company TEXT,
  verified_status BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Courses & Curriculum Engine
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  estimated_hours INTEGER,
  thumbnail_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.mentors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  duration_mins INTEGER,
  content_markdown TEXT,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Enrollment & Progress Logic
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
  progress_percent INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  watch_time_seconds INTEGER DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(enrollment_id, lesson_id)
);

-- 9. Evaluation & Assessments
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  related_module_id UUID REFERENCES public.course_modules(id),
  title TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  time_limit_mins INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB, -- Map of question_id -> selected_index
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Placement & Career Center
CREATE TABLE IF NOT EXISTS public.job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('Full-time', 'Internship', 'Contract')),
  salary_range TEXT,
  required_skills TEXT[],
  min_readiness_score INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('applied', 'review', 'shortlisted', 'rejected', 'hired')) DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(job_id, student_id)
);

-- 11. Gamification & Ledger
CREATE TABLE IF NOT EXISTS public.xp_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- e.g., 'course_completion', 'quiz_pass', 'daily_login'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  xp_reward INTEGER DEFAULT 50,
  criteria JSONB -- e.g., {"type": "course_count", "value": 5}
);

CREATE TABLE IF NOT EXISTS public.student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, achievement_id)
);

-- 12. Social & Alliances (Networking)
CREATE TABLE IF NOT EXISTS public.student_alliances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_a_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student_b_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_a_id, student_b_id)
);

-- 13. Advanced Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_alliances ENABLE ROW LEVEL SECURITY;

-- 12.5 Security Logs
CREATE TABLE IF NOT EXISTS public.user_security_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  event_type TEXT CHECK (event_type IN ('login', 'logout', 'reset', 'fail', 'register')) NOT NULL,
  ip_address TEXT,
  device_info JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.user_security_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own logs" ON public.user_security_logs FOR SELECT USING (auth.uid() = user_id);

-- 14. Advanced Policies

-- User Roles
CREATE POLICY "Users view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own role" ON public.user_roles FOR UPDATE USING (auth.uid() = user_id);

-- Public Read-Only Sections
CREATE POLICY "Public read deps" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public read modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON public.job_listings FOR SELECT USING (is_active = true);

-- Student-Specific Access
CREATE POLICY "Students can manage own profile" ON public.students 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Enrollment visibility" ON public.enrollments
  FOR ALL USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

CREATE POLICY "Progress tracking student" ON public.lesson_progress
  FOR ALL USING (
    enrollment_id IN (
      SELECT e.id FROM public.enrollments e 
      JOIN public.students s ON e.student_id = s.id 
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Alliance management" ON public.student_alliances
  FOR ALL USING (
    student_a_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
    student_b_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- 15. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_deadline ON public.job_listings(deadline);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- 16. Profile & Verification Engine
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  department TEXT,
  role TEXT CHECK (role IN ('student', 'mentor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 17. Trigger for Verified User Initialization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role TEXT;
  v_dept TEXT;
BEGIN
  -- Only proceed if email is confirmed (Standard Auth or OAuth)
  IF new.email_confirmed_at IS NOT NULL THEN
    
    -- Check if profile already exists to prevent duplicate work
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
      
      v_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
      v_dept := COALESCE(new.raw_user_meta_data->>'department', NULL);

      -- 1. Create Base Profile
      INSERT INTO public.profiles (id, full_name, email, role, department)
      VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
        new.email,
        v_role,
        v_dept
      );

      -- 2. Create Role-Specific Profile (Legacy Support & App Logic)
      INSERT INTO public.user_roles (user_id, role)
      VALUES (new.id, v_role)
      ON CONFLICT (user_id) DO NOTHING;

      IF v_role = 'student' THEN
        INSERT INTO public.students (user_id, full_name, email, level)
        VALUES (
          new.id, 
          COALESCE(new.raw_user_meta_data->>'full_name', 'Student User'),
          new.email,
          'Beginner'
        ) ON CONFLICT (user_id) DO NOTHING;
      ELSIF v_role = 'mentor' THEN
        INSERT INTO public.mentors (user_id, full_name)
        VALUES (
          new.id, 
          COALESCE(new.raw_user_meta_data->>'full_name', 'Mentor User')
        ) ON CONFLICT (user_id) DO NOTHING;
      END IF;

    END IF;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger needs to run on UDPATE (for email verification) and INSERT (for OAuth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_verified
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
