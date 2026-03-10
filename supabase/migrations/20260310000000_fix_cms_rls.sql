-- ============================================================
-- PlaceIQ CMS RLS Fix - Allow Mentors to manage courses,
-- course_modules, and course_lessons
-- ============================================================

-- ── courses ──────────────────────────────────────────────────
-- Enable RLS (safe if already enabled)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist so we can recreate cleanly
DROP POLICY IF EXISTS "Mentors can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Mentors can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Mentors can update courses" ON public.courses;
DROP POLICY IF EXISTS "Mentors can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Students can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;

-- Mentors: full access
CREATE POLICY "Mentors can view all courses" ON public.courses
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can insert courses" ON public.courses
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can update courses" ON public.courses
    FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can delete courses" ON public.courses
    FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.mentors));

-- Students: read published only
CREATE POLICY "Students can view published courses" ON public.courses
    FOR SELECT USING (is_published = true OR auth.uid() IN (SELECT user_id FROM public.mentors));


-- ── course_modules ────────────────────────────────────────────
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentors can view all course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "Mentors can insert course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "Mentors can update course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "Mentors can delete course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "Students can view course_modules" ON public.course_modules;

CREATE POLICY "Mentors can view all course_modules" ON public.course_modules
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can insert course_modules" ON public.course_modules
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can update course_modules" ON public.course_modules
    FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can delete course_modules" ON public.course_modules
    FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.mentors));

-- Students can read modules for published courses
CREATE POLICY "Students can view course_modules" ON public.course_modules
    FOR SELECT USING (
        course_id IN (SELECT id FROM public.courses WHERE is_published = true)
        OR auth.uid() IN (SELECT user_id FROM public.mentors)
    );


-- ── course_lessons ─────────────────────────────────────────────
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentors can view all course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Mentors can insert course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Mentors can update course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Mentors can delete course_lessons" ON public.course_lessons;
DROP POLICY IF EXISTS "Students can view course_lessons" ON public.course_lessons;

CREATE POLICY "Mentors can view all course_lessons" ON public.course_lessons
    FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can insert course_lessons" ON public.course_lessons
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can update course_lessons" ON public.course_lessons
    FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can delete course_lessons" ON public.course_lessons
    FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.mentors));

-- Students can read lessons for published courses
CREATE POLICY "Students can view course_lessons" ON public.course_lessons
    FOR SELECT USING (
        module_id IN (
            SELECT cm.id FROM public.course_modules cm
            INNER JOIN public.courses c ON c.id = cm.course_id
            WHERE c.is_published = true
        )
        OR auth.uid() IN (SELECT user_id FROM public.mentors)
    );
