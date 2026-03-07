-- Fix 1: Add missing INSERT policy for user_security_logs
CREATE POLICY "Users insert own logs" ON public.user_security_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix 2: Cast 'bf' to text in gen_salt for reset_password_with_otp to fix "function gen_salt(unknown, void) does not exist"
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

  -- Update Password in auth.users securely using pgcrypto
  -- We cast 'bf' to text explicitly AND provide an iteration count explicitly (e.g. 10) to avoid signature mismatch
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf'::text)),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
