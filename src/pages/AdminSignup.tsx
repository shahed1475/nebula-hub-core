import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, User, Mail, Key, CheckCircle, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkSignupEnabled = async () => {
      try {
        const { data, error } = await supabase.rpc('is_admin_signup_enabled');
        if (error) throw error;
        setSignupEnabled(data);
      } catch (error) {
        console.error('Error checking signup status:', error);
        setSignupEnabled(false);
      }
    };

    checkSignupEnabled();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        // Email confirmation required
        setIsSuccess(true);
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your admin account setup.",
        });
      } else if (data.session) {
        // Auto signed in
        toast({
          title: "Admin account created!",
          description: "Welcome to the admin panel.",
        });
        window.location.href = "/admin";
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create admin account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking signup status
  if (signupEnabled === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show signup disabled message
  if (!signupEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Admin Signup Disabled</h1>
            <p className="text-muted-foreground mb-6">
              Admin account creation is currently disabled for security. 
              Please contact the system administrator if you need admin access.
            </p>
            <div className="space-y-3">
              <Link to="/admin">
                <Button variant="outline" className="w-full">
                  Go to Admin Login
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a confirmation link to <strong>{email}</strong>. 
              Click the link in your email to activate your admin account.
            </p>
            <div className="space-y-3">
              <Link to="/admin">
                <Button variant="outline" className="w-full">
                  Go to Admin Login
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="w-full">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Create Admin Account
          </h1>
          <p className="text-muted-foreground">
            Set up your PopupGenix admin access
          </p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            The first admin account will be automatically granted full admin privileges. 
            Additional admin accounts can be promoted later.
          </AlertDescription>
        </Alert>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Admin Registration</CardTitle>
            <CardDescription>
              Create your administrator account to manage the PopupGenix platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@popupgenix.com"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <Key className="w-4 h-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                  className="bg-input border-border"
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300"
              >
                {isLoading ? "Creating Account..." : "Create Admin Account"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an admin account?
              </p>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Sign In to Admin Panel
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  ← Back to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignup;