import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientPortal from "./pages/ClientPortal";
import AdminPanel from "./pages/AdminPanel";
import AdminSignup from "./pages/AdminSignup";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/portal/*" element={<ClientPortal />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
