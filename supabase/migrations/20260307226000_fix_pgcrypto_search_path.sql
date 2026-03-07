-- Fix 3: Use the fully qualified "extensions" schema for pgcrypto functions
-- In Supabase, the pgcrypto extension is installed in the "extensions" schema, not public.
CREATE OR REPLACE FUNCTION public.reset_password_with_otp(p_register_number TEXT, p_otp_code TEXT, p_new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_otp_id UUID;
BEGIN
  -- Lookup student by register number
  SELECT user_id INTO v_user_id
  FROM public.students
  WHERE register_number = p_register_number;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Student not found';
  END IF;

  -- Find a valid OTP
  SELECT id INTO v_otp_id
  FROM public.password_reset_otps
  WHERE user_id = v_user_id
    AND otp_code = p_otp_code
    AND is_used = false
    AND expires_at >= now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_otp_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired OTP';
  END IF;

  -- Mark as used
  UPDATE public.password_reset_otps
  SET is_used = true
  WHERE id = v_otp_id;

  -- Update Password in auth.users securely using pgcrypto from extensions schema
  UPDATE auth.users
  SET encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf')),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, extensions;
