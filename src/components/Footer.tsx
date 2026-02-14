import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import PaymentLogos from "@/components/PaymentLogos";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "/#about", isAnchor: false },
    { name: "Services", href: "/#services", isAnchor: false },
    { name: "Portfolio", href: "/#portfolio", isAnchor: false },
    { name: "Pricing", href: "/pricing", isAnchor: false },
    { name: "Blog", href: "/blog", isAnchor: false },
    { name: "Contact", href: "/contact", isAnchor: false }
  ];

  const services = [
    { name: "AI & Machine Learning", href: "/#services" },
    { name: "Custom Software", href: "/#services" },
    { name: "Web Development", href: "/#services" },
    { name: "Mobile Apps", href: "/#services" },
    { name: "CRM & SaaS Tools", href: "/#services" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61577242150254", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/popupgenix7", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/popupgenix", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-card border-t border-border/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/lovable-uploads/840fc8c0-fd1f-46ff-b59e-8c30eeebac75.png" 
                  alt="PopupGenix Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                PopupGenix creates cutting-edge AI and software solutions that drive business growth 
                and deliver exceptional user experiences through intelligent, scalable technology.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-foreground font-medium">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>hello@popupgenix.com</span>
                </div>
                <div className="flex items-center space-x-3 text-foreground font-medium">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>+1 479 689 1012</span>
                </div>
                <div className="flex items-center space-x-3 text-foreground font-medium">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>1209 MOUNTAIN ROAD PL NE, STE R, ALBUQUERQUE, NM 87110, USA</span>
                </div>
              </div>
              
              {/* Payment Partners */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <PaymentLogos variant="color" size="md" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-foreground">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-accent transition-colors duration-300 relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-foreground">Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link 
                      to={service.href}
                      className="text-muted-foreground hover:text-accent transition-colors duration-300 relative group"
                    >
                      {service.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-foreground">Connect With Us</h4>
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="p-3 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-neon transition-all duration-300 group"
                    >
                      <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </a>
                  );
                })}
              </div>
              <Link to="/portal">
                <Button variant="outline" size="sm" className="w-full">
                  Client Portal Login
                </Button>
              </Link>
            </div>

            {/* Legal & Trust - moved to last position */}
            <div className="order-last lg:order-none">
              <h4 className="text-lg font-semibold mb-6 text-foreground">Legal & Trust</h4>
              <ul className="space-y-3 mb-6">
                <li>
                  <Link 
                    to="/privacy"
                    className="text-muted-foreground hover:text-accent transition-colors duration-300 relative group"
                  >
                    Privacy Policy
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-and-conditions"
                    className="text-muted-foreground hover:text-accent transition-colors duration-300 relative group"
                  >
                    Terms & Conditions
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/refund-policy"
                    className="text-muted-foreground hover:text-accent transition-colors duration-300 relative group"
                  >
                    Refund Policy
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cookie-policy"
                    className="text-muted-foreground hover:text-accent transition-colors duration-300 relative group"
                  >
                    Cookie Policy
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              </ul>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>99.99% Uptime Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>30-Day Refund Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2025 PopupGenix.com – All Rights Reserved
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-accent transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/refund-policy" className="text-muted-foreground hover:text-accent transition-colors">
                Refund Policy
              </Link>
              <Link to="/cookie-policy" className="text-muted-foreground hover:text-accent transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/30">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                PopupGenix is committed to secure, fair, and reliable services. By using our platform, you agree to our Privacy Policy and Terms of Use.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Secure Payments:</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Stripe</span>
                  <span>|</span>
                  <span>Wise</span>
                  <span>|</span>
                  <span>Visa</span>
                  <span>|</span>
                  <span>Mastercard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;