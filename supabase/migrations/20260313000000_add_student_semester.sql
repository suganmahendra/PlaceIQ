-- Add current_semester to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS current_semester INTEGER DEFAULT 1;
