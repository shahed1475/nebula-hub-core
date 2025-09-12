-- First, let's add the missing columns to projects table to support client portal
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS client_user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS next_milestone TEXT,
ADD COLUMN IF NOT EXISTS eta_date TIMESTAMP WITH TIME ZONE;

-- Create RLS policy for users to see their own projects
CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = client_user_id);

-- Create a profiles trigger to auto-create profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();