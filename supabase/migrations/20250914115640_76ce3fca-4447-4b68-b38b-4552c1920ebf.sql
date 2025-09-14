-- Remove the security definer view that was flagged
DROP VIEW IF EXISTS public.public_testimonials;

-- The function approach is safer and already implemented
-- Let's also create a simple policy for the homepage to display testimonials
-- by creating a more secure approach

-- Instead of a view, we'll rely solely on the security definer function
-- which is properly controlled and doesn't expose the underlying table structure

-- Ensure the function is properly secured
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