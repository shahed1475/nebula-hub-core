-- Remove blog-related tables as we're switching to WordPress
DROP TABLE IF EXISTS public.blog_posts;

-- Remove any blog-related policies
DROP POLICY IF EXISTS "Admin users can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin users can delete blog posts" ON public.blog_posts;