-- Create messages table for two-way communication
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'client')),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Admins can manage all messages
CREATE POLICY "Admins can manage messages"
ON public.messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Clients can view and create messages for their projects
CREATE POLICY "Clients can view their project messages"
ON public.messages
FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects
    WHERE client_user_id = auth.uid()
  )
);

CREATE POLICY "Clients can create messages for their projects"
ON public.messages
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects
    WHERE client_user_id = auth.uid()
  )
  AND sender_type = 'client'
  AND sender_id = auth.uid()
);

-- Add file_url and link_url to client_updates table
ALTER TABLE public.client_updates 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed'));

-- Create trigger for updated_at on messages
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_updates_project_id ON public.client_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_client_updates_created_at ON public.client_updates(created_at DESC);