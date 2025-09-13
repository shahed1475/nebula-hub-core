import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScrollToHash = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure we keep client-side routing when user clicks links with just a hash (e.g., from footer)
    // If we're not on home and only a hash was provided, push to "/#..."
    if (!location.pathname.startsWith("/") && location.hash) {
      navigate(`/${location.hash}`, { replace: true });
    }

    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Wait a tick to ensure the DOM is ready after route transitions
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      // Scroll to top on route changes without hash
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash, navigate]);

  return null;
};

export default ScrollToHash;

