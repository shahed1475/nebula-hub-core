import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PortalNavigation from "@/components/ClientPortal/PortalNavigation";
import Dashboard from "@/components/ClientPortal/Dashboard";
import FilesDocuments from "@/components/ClientPortal/FilesDocuments";
import Feedback from "@/components/ClientPortal/Feedback";
import Updates from "@/components/ClientPortal/Updates";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function ClientPortal() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-midnight-dark via-midnight to-midnight-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-dark via-midnight to-midnight-light flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent mb-2">
              Client Portal Login
            </h1>
            <p className="text-gray-300">Access your project dashboard and files</p>
          </div>
          
          <div className="bg-midnight-light/50 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#8B5CF6',
                      brandAccent: '#3B82F6',
                      brandButtonText: 'white',
                      defaultButtonBackground: '#1F2937',
                      defaultButtonBackgroundHover: '#374151',
                      inputBackground: '#111827',
                      inputBorder: '#4B5563',
                      inputBorderHover: '#8B5CF6',
                      inputBorderFocus: '#3B82F6',
                      inputText: 'white',
                      inputLabelText: '#D1D5DB',
                      inputPlaceholder: '#9CA3AF',
                    },
                  },
                },
                className: {
                  container: 'auth-container',
                  button: 'auth-button',
                  input: 'auth-input',
                  label: 'auth-label',
                },
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/portal`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-dark via-midnight to-midnight-light">
      <PortalNavigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/files" element={<FilesDocuments />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/updates" element={<Updates />} />
              <Route path="*" element={<Navigate to="/portal" replace />} />
            </Routes>
    </div>
  );
}