import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#home", isAnchor: true },
    { name: "About", href: "#about", isAnchor: true },
    { name: "Services", href: "#services", isAnchor: true },
    { name: "Portfolio", href: "#portfolio", isAnchor: true },
    { name: "Blog", href: "/blog", isAnchor: false },
    { name: "Contact", href: "/contact", isAnchor: false },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img 
                src="/lovable-uploads/840fc8c0-fd1f-46ff-b59e-8c30eeebac75.png" 
                alt="PopupGenix Logo" 
                className="h-10 w-auto animate-glow-pulse"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              item.isAnchor ? (
                <Link
                  key={item.name}
                  to={`/${item.href}`}
                  className="text-foreground hover:text-accent transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground hover:text-accent transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/portal">
              <Button variant="outline" size="sm">
                Client Portal
              </Button>
            </Link>
            <Link to="/quote">
              <Button variant="hero" size="sm">
                Get a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6 space-y-4 animate-slide-up">
            {navigation.map((item) => (
              item.isAnchor ? (
                <Link
                  key={item.name}
                  to={`/${item.href}`}
                  className="block text-foreground hover:text-accent transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-foreground hover:text-accent transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            <div className="pt-4 space-y-3">
              <Link to="/portal">
                <Button variant="outline" size="sm" className="w-full">
                  Client Portal
                </Button>
              </Link>
              <Link to="/quote">
                <Button variant="hero" size="sm" className="w-full">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;