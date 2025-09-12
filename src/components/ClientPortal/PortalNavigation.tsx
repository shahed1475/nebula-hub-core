import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  LogOut,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PortalNavigation() {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/portal",
      icon: LayoutDashboard,
    },
    {
      name: "Files & Documents",
      href: "/portal/files",
      icon: FolderOpen,
    },
    {
      name: "Feedback",
      href: "/portal/feedback",
      icon: MessageSquare,
    },
  ];

  return (
    <nav className="bg-midnight-light/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <span className="text-white font-semibold">PopupGenix Portal</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Main Site</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" className="text-gray-300">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-700 py-2">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 px-4 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}