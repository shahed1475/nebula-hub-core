import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, User, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  link: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    author?: Array<{
      name: string;
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      name: string;
      taxonomy: string;
    }>>;
  };
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary WordPress site for demo - replace with your site
  const WORDPRESS_SITE = "https://techcrunch.com"; // You can replace this with your WordPress site

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try to fetch from WordPress REST API
        const response = await fetch(`${WORDPRESS_SITE}/wp-json/wp/v2/posts?per_page=12&_embed`);
        
        if (!response.ok) {
          throw new Error('WordPress site not accessible');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        // Fallback to demo content if WordPress is not available
        setError("WordPress blog not connected yet");
        setPosts([
          {
            id: 1,
            title: { rendered: "The Future of Web Development in 2024" },
            excerpt: { rendered: "<p>Explore the latest trends and technologies shaping the future of web development...</p>" },
            content: { rendered: "" },
            date: "2024-01-15T10:00:00",
            link: "#",
            author: 1,
            categories: [1],
            tags: [1, 2],
            featured_media: 1,
            _embedded: {
              author: [{ name: "PopupGenix Team" }],
              'wp:term': [[{ name: "Technology", taxonomy: "category" }, { name: "Web Development", taxonomy: "post_tag" }]]
            }
          },
          {
            id: 2,
            title: { rendered: "AI Integration in Modern Applications" },
            excerpt: { rendered: "<p>How artificial intelligence is revolutionizing user experience and functionality...</p>" },
            content: { rendered: "" },
            date: "2024-01-10T14:30:00",
            link: "#",
            author: 1,
            categories: [2],
            tags: [2, 3],
            featured_media: 2,
            _embedded: {
              author: [{ name: "PopupGenix Team" }],
              'wp:term': [[{ name: "AI", taxonomy: "category" }, { name: "Innovation", taxonomy: "post_tag" }]]
            }
          },
          {
            id: 3,
            title: { rendered: "Mobile-First Design Best Practices" },
            excerpt: { rendered: "<p>Essential strategies for creating responsive, mobile-optimized applications...</p>" },
            content: { rendered: "" },
            date: "2024-01-05T09:15:00",
            link: "#",
            author: 1,
            categories: [1],
            tags: [1, 4],
            featured_media: 3,
            _embedded: {
              author: [{ name: "PopupGenix Team" }],
              'wp:term': [[{ name: "Design", taxonomy: "category" }, { name: "Mobile", taxonomy: "post_tag" }]]
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getCategories = (post: BlogPost) => {
    return post._embedded?.['wp:term']?.[0]?.filter(term => term.taxonomy === 'category').map(cat => cat.name) || [];
  };

  const getTags = (post: BlogPost) => {
    return post._embedded?.['wp:term']?.[0]?.filter(term => term.taxonomy === 'post_tag').map(tag => tag.name) || [];
  };

  const getFeaturedImage = (post: BlogPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  };

  const getAuthor = (post: BlogPost) => {
    return post._embedded?.author?.[0]?.name || 'PopupGenix Team';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              PopupGenix Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest trends in web development, AI, and digital innovation
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            {error && (
              <div className="mb-8 p-4 bg-muted/20 border border-border rounded-lg">
                <p className="text-muted-foreground text-center">
                  {error} - Showing demo content. Configure your WordPress site URL to display real blog posts.
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="h-48 bg-muted animate-pulse rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted animate-pulse rounded"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                        <div className="h-20 bg-muted animate-pulse rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 group">
                    {getFeaturedImage(post) && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={getFeaturedImage(post)} 
                          alt={post.title.rendered}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {getAuthor(post)}
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                        {stripHtml(post.title.rendered)}
                      </CardTitle>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getCategories(post).slice(0, 2).map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="line-clamp-3 mb-4">
                        {stripHtml(post.excerpt.rendered)}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {getTags(post).slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between group-hover:bg-primary/10 transition-colors"
                        onClick={() => window.open(post.link, '_blank')}
                      >
                        Read More
                        {post.link === "#" ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-4">No blog posts found</h3>
                <p className="text-muted-foreground">
                  Configure your WordPress site to display blog posts here.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;