-- Delay profile creation until email is verified
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    dept_id UUID;
BEGIN
  -- 1. ONLY process if email is confirmed
  -- This prevents student/mentor records from being created until the 6-digit code is verified
  IF new.email_confirmed_at IS NULL THEN
    RETURN new;
  END IF;

  -- 2. Check if profile already exists to prevent duplicate insertions
  -- (Trigger runs on both INSERT and UPDATE)
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = new.id) THEN
    RETURN new;
  END IF;

  -- 3. Check for Mentor Role
  IF new.raw_user_meta_data->>'role' = 'mentor' THEN
    -- Verify email domain (backend enforcement)
    IF new.email NOT LIKE '%@mahendracollege.com' THEN
      -- Optional: We could just skip insertion instead of raising exception 
      -- to avoid blocking the auth update, but keeping your original logic
      RAISE EXCEPTION 'Mentor registration restricted to @mahendracollege.com emails';
    END IF;

    -- Insert into mentors table
    INSERT INTO public.mentors (user_id, full_name, expertise)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      STRING_TO_ARRAY(new.raw_user_meta_data->>'expertise', ',')
    );
    
    -- Assign role in user_roles table
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'mentor')
    ON CONFLICT (user_id) DO NOTHING;

  -- 4. Check for Student Role
  ELSIF new.raw_user_meta_data->>'role' = 'student' THEN
    
    -- Attempt to find department_id by name
    SELECT id INTO dept_id FROM public.departments WHERE name = (new.raw_user_meta_data->>'department');

    INSERT INTO public.students (
        user_id, 
        full_name, 
        email, 
        department_id, 
        register_number
    )
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      dept_id,
      new.raw_user_meta_data->>'register_number'
    );

    -- Assign role in user_roles table
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'student')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Ensure the trigger runs on UPDATE as well as INSERT
-- This ensures that when the user verifies their email (UPDATE on auth.users),
-- the record is finally created.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
