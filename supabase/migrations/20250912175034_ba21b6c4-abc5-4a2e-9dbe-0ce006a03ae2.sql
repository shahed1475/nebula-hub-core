-- Create a function to make the first user an admin automatically
CREATE OR REPLACE FUNCTION public.make_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is the first profile being created, make them admin
  IF (SELECT COUNT(*) FROM public.profiles) = 1 THEN
    NEW.is_admin = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically make first user admin
DROP TRIGGER IF EXISTS make_first_user_admin_trigger ON public.profiles;
CREATE TRIGGER make_first_user_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.make_first_user_admin();

-- Also create a function to manually promote users to admin (for existing users)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;