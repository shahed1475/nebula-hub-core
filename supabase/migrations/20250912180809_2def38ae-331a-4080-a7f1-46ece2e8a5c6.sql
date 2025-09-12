-- Fix the missing RPC function and improve admin promotion system  
CREATE OR REPLACE FUNCTION public.has_any_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE is_admin = true);
$$;

-- Update the promote_to_admin function to ensure it works correctly
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text)
RETURNS boolean AS $$
DECLARE
  user_found boolean := false;
BEGIN
  -- Check if user exists and update their admin status
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_found = FOUND;
  
  RETURN user_found;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;