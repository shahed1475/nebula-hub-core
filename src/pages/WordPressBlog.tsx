import { useEffect, useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface WordPressBlogProps {
  adminLogin?: boolean;
}

const WordPressBlog = ({ adminLogin = false }: WordPressBlogProps) => {
  const wordpressUrl = adminLogin 
    ? "https://shahedalfahad19-xvmtl.wordpress.com/wp-login.php"
    : "https://shahedalfahad19-xvmtl.wordpress.com/";

  // Types and state for public blog feed
  type WPPost = {
    id: number;
    link: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    date: string;
  };

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inject custom CSS to style the WordPress iframe content and set SEO tags
    const style = document.createElement('style');
    style.textContent = `
      .wordpress-iframe {
        width: 100%;
        min-height: calc(100vh - 80px);
        border: none;
        background: hsl(var(--background));
      }
      
      .wordpress-container {
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        min-height: calc(100vh - 80px);
      }
      
      .wordpress-container.admin-mode {
        padding-top: 0;
        min-height: 100vh;
      }
      
      .wordpress-container.admin-mode .wordpress-iframe {
        min-height: 100vh;
      }
    `;
    document.head.appendChild(style);

    // Basic SEO without helmet
    const title = adminLogin ? "Blog Admin - PopupGenix" : "Blog - PopupGenix | Latest Insights & Updates";
    document.title = title;

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

    ensureMeta({ name: 'description' }, adminLogin
      ? 'Admin login for PopupGenix blog management'
      : "Stay updated with the latest insights, tips, and industry updates from PopupGenix. Expert content on digital marketing, popup strategies, and business growth."
    );
    ensureMeta({ name: 'keywords' }, 'PopupGenix blog, digital marketing insights, popup strategies, business growth tips, marketing automation');
    ensureMeta({ property: 'og:title' }, title);
    ensureMeta({ property: 'og:description' }, adminLogin
      ? 'Admin login for PopupGenix blog management'
      : 'Stay updated with the latest insights and expert content from PopupGenix on digital marketing and business growth.'
    );
    ensureMeta({ property: 'og:type' }, 'website');
    ensureMeta({ name: 'twitter:card' }, 'summary_large_image');
    ensureMeta({ name: 'twitter:title' }, title);
    ensureMeta({ name: 'twitter:description' }, adminLogin
      ? 'Admin login for PopupGenix blog management'
      : 'Expert insights on digital marketing, popup strategies, and business growth from PopupGenix.'
    );

    const canonHref = `https://popupgenix.com${adminLogin ? '/blog/admin-login' : '/blog'}`;
    let linkCanon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanon) {
      linkCanon = document.createElement('link');
      linkCanon.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanon);
    }
    linkCanon.setAttribute('href', canonHref);

    return () => {
      document.head.removeChild(style);
    };
  }, [adminLogin]);

  // Redirect admin login to open in WordPress (cannot be embedded due to X-Frame-Options)
  useEffect(() => {
    if (adminLogin) {
      window.location.href = wordpressUrl;
    }
  }, [adminLogin, wordpressUrl]);

  // Fetch public posts when not admin
  useEffect(() => {
    if (adminLogin) return;
    setLoading(true);
    fetch('https://public-api.wordpress.com/wp/v2/sites/shahedalfahad19-xvmtl.wordpress.com/posts?per_page=10&_fields=id,link,title,excerpt,date')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load posts');
        return res.json();
      })
      .then((data: WPPost[]) => {
        setPosts(data);
        setError(null);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [adminLogin]);

  return (
    <div className="min-h-screen bg-background">
      {!adminLogin && <Header />}

      <main className={`wordpress-container ${!adminLogin ? 'pt-20' : ''}`}>
        {adminLogin ? (
          <section className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-semibold">Redirecting to WordPress login…</h1>
            <p className="mt-4 text-muted-foreground">
              If you are not redirected,
              <a href={wordpressUrl} target="_blank" rel="noopener" className="ml-1 underline text-primary">click here</a>.
            </p>
          </section>
        ) : (
          <section className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-semibold mb-8">PopupGenix Blog</h1>

            {loading && <p className="text-muted-foreground">Loading posts…</p>}
            {error && <p className="text-destructive">Failed to load posts: {error}</p>}

            {!loading && !error && (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article key={post.id} className="rounded-lg bg-card p-6 shadow-[var(--shadow-card)]">
                    <h2 className="text-xl font-semibold">
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener"
                        className="hover:underline text-primary"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </h2>
                    <div
                      className="mt-3 text-muted-foreground prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    <div className="mt-4">
                      <a href={post.link} target="_blank" rel="noopener" className="text-primary hover:underline">
                        Read more →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {!adminLogin && <Footer />}
    </div>
  );
};

export default WordPressBlog;