-- Fix security issue: Restrict SELECT access to clients table to admins only
-- Drop the existing broad policy and create specific policies for better security

-- Drop the existing overly broad policy
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;

-- Create specific policies for each operation
-- Only admins can view client information
CREATE POLICY "Only admins can view clients" 
ON public.clients 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Only admins can insert client records
CREATE POLICY "Only admins can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Only admins can update client records
CREATE POLICY "Only admins can update clients" 
ON public.clients 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Only admins can delete client records
CREATE POLICY "Only admins can delete clients" 
ON public.clients 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);