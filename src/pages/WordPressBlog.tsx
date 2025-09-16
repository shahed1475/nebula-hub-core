import { useEffect } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface WordPressBlogProps {
  adminLogin?: boolean;
}

const WordPressBlog = ({ adminLogin = false }: WordPressBlogProps) => {
  const wordpressUrl = adminLogin 
    ? "https://shahedalfahad19-xvmtl.wordpress.com/wp-admin/"
    : "https://shahedalfahad19-xvmtl.wordpress.com/";

  useEffect(() => {
    // Inject custom CSS to style the WordPress iframe content and set SEO tags
    const style = document.createElement('style');
    style.textContent = `
      .wordpress-iframe {
        width: 100%;
        min-height: 100vh;
        border: none;
        background: hsl(var(--background));
      }
      
      .wordpress-container {
        background: hsl(var(--background));
        color: hsl(var(--foreground));
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

  return (
    <div className="min-h-screen bg-background">
      {!adminLogin && <Header />}
      
      <main className="wordpress-container">
        <iframe
          src={wordpressUrl}
          className="wordpress-iframe"
          title={adminLogin ? "WordPress Admin Dashboard" : "PopupGenix Blog"}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </main>

      {!adminLogin && <Footer />}
    </div>
  );
};

export default WordPressBlog;