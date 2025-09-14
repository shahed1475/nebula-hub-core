import { supabase } from "@/integrations/supabase/client";

export interface PublicTestimonial {
  id: string;
  testimonial: string;
  rating: number;
  created_at: string;
  client_name: string;
  client_company?: string;
  featured: boolean;
}

/**
 * Securely fetch public testimonials without exposing sensitive customer data
 * This function uses a security definer function to ensure no email addresses
 * or other sensitive information is exposed to the public.
 */
export const getPublicTestimonials = async (): Promise<PublicTestimonial[]> => {
  try {
    const { data, error } = await supabase.rpc('get_public_testimonials');
    
    if (error) {
      console.error('Error fetching public testimonials:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getPublicTestimonials:', error);
    return [];
  }
};

/**
 * Get featured testimonials only (subset of public testimonials)
 */
export const getFeaturedTestimonials = async (): Promise<PublicTestimonial[]> => {
  const testimonials = await getPublicTestimonials();
  return testimonials.filter(t => t.featured);
};