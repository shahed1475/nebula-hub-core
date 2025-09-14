-- Add deleted_at column to feedback table for soft deletes
ALTER TABLE public.feedback 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create client_updates table for client updates
CREATE TABLE public.client_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  admin_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on client_updates
ALTER TABLE public.client_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for client_updates
CREATE POLICY "Admins can manage client updates" 
ON public.client_updates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.is_admin = true
));

CREATE POLICY "Users can view their project updates" 
ON public.client_updates 
FOR SELECT 
USING (project_id IN (
  SELECT projects.id 
  FROM projects 
  WHERE projects.client_user_id = auth.uid()
));

-- Add trigger for client_updates updated_at
CREATE TRIGGER update_client_updates_updated_at
BEFORE UPDATE ON public.client_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();