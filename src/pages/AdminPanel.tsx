import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminPanel/AdminSidebar";
import AdminDashboard from "@/components/AdminPanel/AdminDashboard";
import HomepageManager from "@/components/AdminPanel/HomepageManager";
import ServicesManager from "@/components/AdminPanel/ServicesManager";
import TestimonialManager from "@/components/AdminPanel/TestimonialManager";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkAdminStatus(user.email || '');
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.email || '');
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (email: string) => {
    try {
      // Check if user is admin via the profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(profile?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

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
              Admin Panel Login
            </h1>
            <p className="text-gray-300">Access the PopupGenix admin dashboard</p>
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
              }}
              providers={[]}
              redirectTo={`${window.location.origin}/admin`}
            />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 mb-3">
                Don't have an admin account?
              </p>
              <a
                href="/admin-signup"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm"
              >
                Create Admin Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-dark via-midnight to-midnight-light flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-red-300 mb-4">
              You don't have admin privileges for this account ({user.email}).
            </p>
            <p className="text-sm text-gray-400 mb-4">
              If you should have admin access, please contact the system administrator to enable admin privileges for your account.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Sign Out
              </button>
              <a
                href="/admin-signup"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-center"
              >
                Create New Admin Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-dark via-midnight to-midnight-light">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <main className="flex-1">
            {/* Global Header */}
            <header className="h-16 flex items-center border-b border-gray-700 bg-midnight-light/80 backdrop-blur-sm px-6">
              <SidebarTrigger className="text-gray-300 hover:text-white" />
              <div className="ml-4">
                <h2 className="text-white font-semibold">PopupGenix Admin Dashboard</h2>
              </div>
            </header>

            {/* Page Content */}
            <div className="p-6">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/homepage" element={<HomepageManager />} />
                <Route path="/services" element={<ServicesManager />} />
                <Route path="/testimonials" element={<TestimonialManager />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}