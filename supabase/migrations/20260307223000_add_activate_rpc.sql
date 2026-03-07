-- RPC to activate pre-registered students safely from anonymous client
CREATE OR REPLACE FUNCTION public.activate_pre_registered_student(p_register_number TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.pre_registered_students
  SET is_activated = true
  WHERE register_number = p_register_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
