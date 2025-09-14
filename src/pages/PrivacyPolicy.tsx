import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentLogos from "@/components/PaymentLogos";
import { Shield, Scale, CreditCard, AlertTriangle, Mail, Phone, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject || "Privacy Policy Inquiry",
          message: contactForm.message
        });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Privacy Policy & Terms of Use
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            PopupGenix.com – Secure. Reliable. Trusted.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Privacy Policy Section */}
        <Card className="mb-12 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl">🔒 Privacy Policy</CardTitle>
            </div>
            <CardDescription className="text-base">
              Last Updated: September 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">1. Information We Collect</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix collects personal information (such as name, email, billing details, payment info) when you register, subscribe, or use our services. We may also collect non-personal technical information such as browser type, IP address, and usage analytics.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">2. How We Use Your Information</h3>
              <p className="text-muted-foreground mb-3">We use your data to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide and improve our services</li>
                <li>Process payments securely</li>
                <li>Communicate important updates</li>
                <li>Prevent fraud and ensure compliance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">3. Data Protection & Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix uses SSL encryption, secure servers, and industry-standard practices to protect your data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">4. Cookies & Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies to enhance your experience and gather analytics. You can disable cookies in your browser at any time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">5. Third-Party Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payment processing and some analytics may be handled by third parties (Stripe, Wise, Visa, Mastercard). We do not store full payment card details.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">6. Your Rights</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may request data access, correction, or deletion at any time by contacting support@popupgenix.com.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">7. Updates to Privacy Policy</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix may update this policy at any time. Changes will be posted here with a "Last Updated" date.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Use Section */}
        <Card className="mb-12 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-accent" />
              <CardTitle className="text-3xl">⚖️ Terms of Use</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground leading-relaxed">
                By using PopupGenix services, you agree to these Terms of Use and all applicable laws. If you do not agree, please discontinue use of our services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">2. Permissible Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may use our services only for lawful purposes. Misuse, illegal activities, spamming, or violations of intellectual property are strictly prohibited.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">3. Accounts & Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for safeguarding your account credentials. PopupGenix is not liable for unauthorized access caused by your negligence.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">4. Payments & Refunds</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>All payments are processed securely through Stripe, Wise, Visa, and Mastercard.</li>
                <li>Refunds are available within 30 days of purchase for eligible services (domains excluded).</li>
                <li>Unauthorized chargebacks may result in account suspension.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">5. Uptime Guarantee</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix guarantees 99.99% uptime for shared hosting. If uptime falls below this, customers may be eligible for compensation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">6. Suspension & Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix may suspend or terminate accounts that violate these Terms. No refunds are issued for terminated accounts due to violations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">7. Limitation of Liability</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix is not liable for indirect damages, data loss, or business interruptions caused by use of our services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">8. Governing Law</h3>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the applicable laws of Bangladesh (or jurisdiction where PopupGenix is registered).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">9. Policy Changes</h3>
              <p className="text-muted-foreground leading-relaxed">
                PopupGenix reserves the right to update these Terms at any time. Continued use of services means acceptance of new terms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payments & Trust Section */}
        <Card className="mb-12 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl">💳 Payments & Trust</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Secure Payment Partners</h3>
              <div className="flex justify-center mb-6">
                <PaymentLogos variant="monochrome" size="lg" title="" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg border border-border/50">
                <h4 className="font-semibold text-primary mb-2">30-Day Refund</h4>
                <p className="text-sm text-muted-foreground">Services only, domains excluded</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg border border-border/50">
                <h4 className="font-semibold text-accent mb-2">99.99% Uptime</h4>
                <p className="text-sm text-muted-foreground">Guaranteed reliability</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg border border-border/50">
                <h4 className="font-semibold text-destructive mb-2">Chargeback Policy</h4>
                <p className="text-sm text-muted-foreground">May cause account suspension</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mb-12 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-accent" />
              <CardTitle className="text-3xl">Contact Us</CardTitle>
            </div>
            <CardDescription>
              Have questions about our privacy policy or terms? Get in touch with us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    placeholder="Subject (Optional)"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Email Support</h4>
                    <p className="text-muted-foreground">hello@popupgenix.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone Support</h4>
                    <p className="text-muted-foreground">+1 479 689 1012</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-muted-foreground">1209 MOUNTAIN ROAD PL NE, STE R, ALBUQUERQUE, NM 87110, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Trust Message */}
        <div className="text-center bg-muted/20 rounded-lg p-8 border border-border/50">
          <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            PopupGenix is committed to secure, fair, and reliable services. By using our platform, you agree to our Privacy Policy and Terms of Use.
          </p>
          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              © 2025 PopupGenix.com – All Rights Reserved
            </p>
            <div className="flex justify-center items-center gap-4 mt-2">
              <PaymentLogos variant="monochrome" size="sm" title="" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;