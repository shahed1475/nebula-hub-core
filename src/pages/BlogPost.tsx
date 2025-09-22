import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

type WPPost = {
  id: number;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  date: string;
  featured_media: number;
  jetpack_featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/shahedalfahad19-xvmtl.wordpress.com/posts/${id}?_embed=1`);
        if (!response.ok) throw new Error('Failed to load post');
        
        const postData: WPPost = await response.json();
        setPost(postData);
        
        // Update SEO metadata
        document.title = `${postData.title.rendered} - PopupGenix Blog`;
        
        const ensureMeta = (attr: { name?: string; property?: string; }, content: string) => {
          const selector = attr.name ? `meta[name="${attr.name}"]` : `meta[property="${attr.property}"]`;
          let el = document.querySelector(selector) as HTMLMetaElement | null;
          if (!el) {
            el = document.createElement('meta');
            if (attr.name) el.setAttribute('name', attr.name);
            if (attr.property) el.setAttribute('property', attr.property);
            document.head.appendChild(el);
          }
          el.setAttribute('content', content);
        };

        const excerpt = postData.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160);
        ensureMeta({ name: 'description' }, excerpt);
        ensureMeta({ property: 'og:title' }, postData.title.rendered);
        ensureMeta({ property: 'og:description' }, excerpt);
        ensureMeta({ property: 'og:type' }, 'article');
        
        const imageUrl = postData._embedded?.['wp:featuredmedia']?.[0]?.source_url || postData.jetpack_featured_media_url;
        if (imageUrl) {
          ensureMeta({ property: 'og:image' }, imageUrl);
          ensureMeta({ name: 'twitter:image' }, imageUrl);
        }

        setError(null);
      } catch (error) {
        console.error('Error loading post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">Sorry, the requested article could not be found.</p>
              <Link to="/blog">
                <Button variant="hero">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || post.jetpack_featured_media_url;
  const imageAlt = post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered;
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Back to Blog */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-64 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-a:hover:text-primary-glow prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary prose-code:text-foreground prose-code:bg-muted prose-pre:bg-muted prose-img:rounded-lg prose-li:text-foreground"
            dangerouslySetInnerHTML={{ 
              __html: post.content?.rendered || post.excerpt.rendered 
            }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Originally published on WordPress
                </p>
                <a 
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-glow transition-colors"
                >
                  <span>View on WordPress</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <Link to="/blog">
                <Button variant="outline">
                  More Articles
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;