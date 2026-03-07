-- PlaceIQ V2.1: Student Access Flow Authentication Updates

-- 1. Pre-Registered Students Table (For Mentor's Student Management)
CREATE TABLE IF NOT EXISTS public.pre_registered_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  register_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT DEFAULT 'AI & Data Science',
  added_by UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
  is_activated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for pre_registered_students
ALTER TABLE public.pre_registered_students ENABLE ROW LEVEL SECURITY;

-- Mentors can view and insert students they manage
CREATE POLICY "Mentors can view all pre_registered_students" ON public.pre_registered_students
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.mentors));

CREATE POLICY "Mentors can insert pre_registered_students" ON public.pre_registered_students
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.mentors));

-- Public can read to verify if register_number exists during "Request Access"
CREATE POLICY "Public can view pre_registered_students" ON public.pre_registered_students
  FOR SELECT USING (true);


-- 2. Password Reset OTPs Table (For Student Profile Updates via Brevo)
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL, -- Storing the plaintext OTP or a hashed version (for MVP, we can keep it simple)
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for password_reset_otps
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- The system needs to create these records and users need to verify them.
-- Since OTP requests can happen before the user is fully logged in (Wait, students are already logged in when modifying password in their dashboard!)
-- Thus, Students can view and insert their own OTPs.
CREATE POLICY "Users can manage own OTPs" ON public.password_reset_otps
  FOR ALL USING (auth.uid() = user_id);

-- Update students table to enforce register_number (already exists in schema but let's ensure it's there)
ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS register_number TEXT UNIQUE;
