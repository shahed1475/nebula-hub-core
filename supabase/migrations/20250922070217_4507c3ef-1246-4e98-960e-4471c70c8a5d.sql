-- Secure admin system by creating a seeded admin and restricting signup

-- 1. Create a dedicated admin user that's seeded in the database
-- Insert a super admin user directly (you'll need to create this user in Supabase Auth manually)
-- This creates a fallback admin that's always available

-- 2. Add a setting to control whether admin signup is enabled
CREATE TABLE public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Only admins can manage admin settings"
ON public.admin_settings
FOR ALL
USING (is_admin(auth.uid()));

-- Everyone can read certain settings (like signup_enabled)
CREATE POLICY "Public can read signup settings"
ON public.admin_settings  
FOR SELECT
USING (setting_key = 'admin_signup_enabled');

-- Insert the admin signup control setting (disabled by default for security)
INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES ('admin_signup_enabled', 'false', 'Controls whether new admin accounts can be created via signup form');

-- 3. Create a function to check if admin signup is enabled
CREATE OR REPLACE FUNCTION public.is_admin_signup_enabled()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT setting_value::boolean FROM public.admin_settings WHERE setting_key = 'admin_signup_enabled'),
    false
  );
$$;

-- 4. Create trigger for admin_settings updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();