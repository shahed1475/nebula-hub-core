import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
    // Inject custom CSS to style the WordPress iframe content
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

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{adminLogin ? "Blog Admin - PopupGenix" : "Blog - PopupGenix | Latest Insights & Updates"}</title>
        <meta 
          name="description" 
          content={adminLogin ? "Admin login for PopupGenix blog management" : "Stay updated with the latest insights, tips, and industry updates from PopupGenix. Expert content on digital marketing, popup strategies, and business growth."} 
        />
        <meta name="keywords" content="PopupGenix blog, digital marketing insights, popup strategies, business growth tips, marketing automation" />
        <meta property="og:title" content={adminLogin ? "Blog Admin - PopupGenix" : "Blog - PopupGenix | Latest Insights & Updates"} />
        <meta property="og:description" content={adminLogin ? "Admin login for PopupGenix blog management" : "Stay updated with the latest insights and expert content from PopupGenix on digital marketing and business growth."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://popupgenix.com${adminLogin ? '/blog/admin-login' : '/blog'}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={adminLogin ? "Blog Admin - PopupGenix" : "Blog - PopupGenix | Latest Insights & Updates"} />
        <meta name="twitter:description" content={adminLogin ? "Admin login for PopupGenix blog management" : "Expert insights on digital marketing, popup strategies, and business growth from PopupGenix."} />
        <link rel="canonical" href={`https://popupgenix.com${adminLogin ? '/blog/admin-login' : '/blog'}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {!adminLogin && <Header />}
        
        <main className="wordpress-container">
          <iframe
            src={wordpressUrl}
            className="wordpress-iframe"
            title={adminLogin ? "WordPress Admin Dashboard" : "PopupGenix Blog"}
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-navigation allow-popups allow-popups-to-escape-sandbox"
          />
        </main>

        {!adminLogin && <Footer />}
      </div>
    </>
  );
};

export default WordPressBlog;