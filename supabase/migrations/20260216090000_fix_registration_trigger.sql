-- Fix existing handle_new_user function to match current table schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    dept_id UUID;
BEGIN
  -- Check for Mentor Role
  IF new.raw_user_meta_data->>'role' = 'mentor' THEN
    -- Verify email domain (backend enforcement)
    IF new.email NOT LIKE '%@mahendracollege.com' THEN
      RAISE EXCEPTION 'Mentor registration restricted to @mahendracollege.com emails';
    END IF;

    -- Insert into mentors table
    -- Handling expertise as array, converting from string
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

  -- Check for Student Role
  ELSIF new.raw_user_meta_data->>'role' = 'student' THEN
    
    -- Attempt to find department_id by name
    -- Assuming 'departments' table has a 'name' column representing the department name
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

    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'student')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is enabled
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
