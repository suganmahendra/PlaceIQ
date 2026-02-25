-- Function to check if a user exists by email
-- This allows the frontend to show "User already exists" error immediately
-- bypassing the "email enumeration protection" behavior for better UX.

CREATE OR REPLACE FUNCTION public.check_user_exists(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres), allowing access to auth.users
SET search_path = public -- Secure search path
AS $$
BEGIN
  -- Check if email exists in auth.users
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_to_check
  );
END;
$$;

-- Grant access to public (anon) and authenticated users
GRANT EXECUTE ON FUNCTION public.check_user_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_user_exists(text) TO authenticated;
