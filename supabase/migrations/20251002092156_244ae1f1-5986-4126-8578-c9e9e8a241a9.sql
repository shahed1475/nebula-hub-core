-- Create storage bucket for client update files if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-updates', 'client-updates', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for client update files
CREATE POLICY "Admins can upload client update files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-updates' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can view all client update files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-updates' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Clients can view their project update files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-updates' AND
  (
    name LIKE auth.uid()::text || '/%' OR
    EXISTS (
      SELECT 1 
      FROM public.client_updates cu
      JOIN public.projects p ON cu.project_id = p.id
      WHERE p.client_user_id = auth.uid()
      AND name LIKE cu.id::text || '/%'
    )
  )
);