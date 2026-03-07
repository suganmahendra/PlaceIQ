CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- RPC to safely store OTP for a given register number (anonymous access)
CREATE OR REPLACE FUNCTION public.request_password_reset_otp(p_register_number TEXT, p_otp_code TEXT)
RETURNS TEXT AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- Lookup student by register number
  SELECT user_id, email INTO v_user_id, v_email
  FROM public.students
  WHERE register_number = p_register_number;

  IF v_user_id IS NULL THEN
    -- Fallback to pre_registered_students if the student hasn't fully logged in but was created
    SELECT NULL INTO v_user_id;
    SELECT email INTO v_email
    FROM public.pre_registered_students
    WHERE register_number = p_register_number;
    
    IF v_email IS NULL THEN
      RAISE EXCEPTION 'Student not found with this Register Number';
    END IF;
    -- If they don't have a user_id yet, they can't reset a password, they need to Request Access
    RAISE EXCEPTION 'Student profile not active. Please Request Access instead.';
  END IF;

  -- Insert the OTP securely
  INSERT INTO public.password_reset_otps (user_id, email, otp_hash, otp_code, expires_at)
  VALUES (v_user_id, v_email, p_otp_code, p_otp_code, now() + interval '10 minutes');

  -- Return email so the frontend knows where to send the Brevo email
  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to verify the custom OTP and reset the password natively using pgcrypto!
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
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
