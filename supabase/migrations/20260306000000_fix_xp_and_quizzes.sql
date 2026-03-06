-- 1. Add `is_mandatory` column to the `quizzes` table if it doesn't already exist.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='quizzes' AND column_name='is_mandatory') THEN
        ALTER TABLE public.quizzes ADD COLUMN is_mandatory BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 2. Ensure RLS on xp_history allows the increment_xp function and API to insert records
-- First, drop existing policies on xp_history to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.xp_history;
DROP POLICY IF EXISTS "Enable read for users based on student_id" ON public.xp_history;

-- Create policies for xp_history
CREATE POLICY "Enable insert for authenticated users" ON public.xp_history
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for users based on student_id" ON public.xp_history
    FOR SELECT
    USING (auth.uid() = student_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 3. Create or replace the security definer function to increment student XP safely
-- This bypasses RLS on the students table so any authenticated action (like clicking "Complete") can award XP.
CREATE OR REPLACE FUNCTION public.increment_xp(user_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_xp integer;
    new_xp integer;
    new_level text;
BEGIN
    -- Get current XP
    SELECT xp INTO current_xp FROM public.students WHERE user_id = increment_xp.user_id;
    
    -- If student not found, exit
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Calculate new XP
    new_xp := COALESCE(current_xp, 0) + amount;

    -- Determine new level
    IF new_xp >= 150 THEN
        new_level := 'Advanced';
    ELSIF new_xp >= 50 THEN
        new_level := 'Intermediate';
    ELSE
        new_level := 'Beginner';
    END IF;

    -- Update student record
    UPDATE public.students 
    SET 
        xp = new_xp, 
        level = new_level
    WHERE user_id = increment_xp.user_id;

END;
$$;
