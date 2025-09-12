-- Fix the promote_to_admin function with correct PostgreSQL syntax
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Check if user exists and update their admin status
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE email = user_email;
  
  -- Return true if any rows were affected
  RETURN FOUND;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;