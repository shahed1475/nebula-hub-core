-- Remove the dangerous public access policy
DROP POLICY IF EXISTS "Everyone can view approved feedback" ON public.feedback;

-- Create a secure view for public testimonials that excludes sensitive data
CREATE OR REPLACE VIEW public.public_testimonials AS
SELECT 
  id,
  testimonial,
  rating,
  created_at,
  client_name,
  client_company,
  -- Exclude sensitive fields: client_email, client_id, project_id
  featured
FROM public.feedback 
WHERE status = 'approved' 
  AND deleted_at IS NULL;

-- Enable RLS on the view (inherits from base table)
ALTER VIEW public.public_testimonials SET (security_barrier = true);

-- Create a policy that allows public read access to the secure view
-- Note: Views inherit RLS from their base tables, so we need to ensure
-- the base table has proper policies for this view to work

-- Create a security definer function for public testimonials access
CREATE OR REPLACE FUNCTION public.get_public_testimonials()
RETURNS TABLE (
  id uuid,
  testimonial text,
  rating integer,
  created_at timestamptz,
  client_name text,
  client_company text,
  featured boolean
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    f.id,
    f.testimonial,
    f.rating,
    f.created_at,
    f.client_name,
    f.client_company,
    f.featured
  FROM public.feedback f
  WHERE f.status = 'approved' 
    AND f.deleted_at IS NULL
  ORDER BY f.created_at DESC;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_testimonials() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_testimonials() TO authenticated;