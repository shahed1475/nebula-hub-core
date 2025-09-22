import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientPortal from "./pages/ClientPortal";
import AdminPanel from "./pages/AdminPanel";
import AdminSignup from "./pages/AdminSignup";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import BlogPost from "./pages/BlogPost";
import WordPressBlog from "./pages/WordPressBlog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import ScrollToHash from "@/components/ScrollToHash";



const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<Quote />} />
         <Route path="/blog" element={<WordPressBlog />} />
         <Route path="/blog/:slug" element={<BlogPost />} />
         <Route path="/blog/admin-login" element={<WordPressBlog adminLogin={true} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/portal/*" element={<ClientPortal />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
