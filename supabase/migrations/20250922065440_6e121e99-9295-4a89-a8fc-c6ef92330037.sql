-- Fix critical security vulnerabilities in feedback and other tables
-- This migration addresses the exposure of customer contact information

-- 1. First, let's check if there are any existing problematic policies and update the feedback table policies
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;

-- Create a more secure policy for feedback viewing
-- Only allow users to view feedback if they're the actual submitter (by email match) or if they're admins
CREATE POLICY "Users can view their own feedback by email" 
ON public.feedback 
FOR SELECT 
USING (
  -- Admins can see all feedback
  (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))
  OR 
  -- Users can only see feedback they submitted using their authenticated email
  (auth.email() = client_email AND auth.uid() IS NOT NULL)
);

-- 2. Add missing SELECT restriction policy for contact_submissions
-- Currently anyone can potentially read contact submissions
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- 3. Add missing SELECT restriction policy for quote_requests  
-- Currently anyone can potentially read quote requests
CREATE POLICY "Only admins can view quote requests" 
ON public.quote_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- 4. Add missing SELECT restriction policy for newsletter_subscriptions
-- Currently anyone can potentially harvest email addresses
CREATE POLICY "Only admins can view newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- 5. Create a secure function for public testimonials that excludes sensitive data
-- This replaces direct table access for public testimonials
DROP FUNCTION IF EXISTS public.get_public_testimonials();

CREATE OR REPLACE FUNCTION public.get_public_testimonials()
RETURNS TABLE(
  id uuid, 
  testimonial text, 
  rating integer, 
  created_at timestamp with time zone, 
  client_name text, 
  client_company text, 
  featured boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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
  ORDER BY f.featured DESC, f.created_at DESC;
$$;

-- Grant execute permission to authenticated users for the testimonials function
GRANT EXECUTE ON FUNCTION public.get_public_testimonials() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_testimonials() TO anon;