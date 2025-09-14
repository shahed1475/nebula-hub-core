-- Create documents table for client portal files
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other',
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Admins can manage documents
CREATE POLICY "Admins can manage documents"
ON public.documents
AS PERMISSIVE
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() AND p.is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles p
  WHERE p.user_id = auth.uid() AND p.is_admin = true
));

-- Users can view their project documents
CREATE POLICY "Users can view project documents"
ON public.documents
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE client_user_id = auth.uid()
  )
);

-- Trigger to maintain updated_at
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create private storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Admins can manage documents bucket"
ON storage.objects
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  bucket_id = 'documents' AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true
  )
)
WITH CHECK (
  bucket_id = 'documents' AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true
  )
);

CREATE POLICY "Users can read their project documents"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM public.projects pr
    WHERE pr.id::text = (storage.foldername(name))[1]
      AND pr.client_user_id = auth.uid()
  )
);

-- Allow users to view their own feedback (and via their projects)
CREATE POLICY "Users can view their own feedback"
ON public.feedback
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  (client_id = auth.uid())
  OR (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()))
);