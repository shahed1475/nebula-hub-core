-- Add missing foreign key constraints for proper table relationships
-- Only add constraints that don't already exist

-- Add foreign key from messages.project_id to projects.id (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'messages_project_id_fkey'
  ) THEN
    ALTER TABLE public.messages
    ADD CONSTRAINT messages_project_id_fkey 
    FOREIGN KEY (project_id) 
    REFERENCES public.projects(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key from client_updates.project_id to projects.id (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'client_updates_project_id_fkey'
  ) THEN
    ALTER TABLE public.client_updates
    ADD CONSTRAINT client_updates_project_id_fkey 
    FOREIGN KEY (project_id) 
    REFERENCES public.projects(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key from client_updates.admin_id to auth.users.id (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'client_updates_admin_id_fkey'
  ) THEN
    ALTER TABLE public.client_updates
    ADD CONSTRAINT client_updates_admin_id_fkey 
    FOREIGN KEY (admin_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key from projects.client_user_id to auth.users.id (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'projects_client_user_id_fkey'
  ) THEN
    ALTER TABLE public.projects
    ADD CONSTRAINT projects_client_user_id_fkey 
    FOREIGN KEY (client_user_id) 
    REFERENCES auth.users(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Add foreign key from feedback.client_id to auth.users.id (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'feedback_client_id_fkey'
  ) THEN
    ALTER TABLE public.feedback
    ADD CONSTRAINT feedback_client_id_fkey 
    FOREIGN KEY (client_id) 
    REFERENCES auth.users(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better query performance on foreign keys (if not exists)
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_client_updates_project_id ON public.client_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_client_updates_admin_id ON public.client_updates(admin_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_user_id ON public.projects(client_user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_client_id ON public.feedback(client_id);