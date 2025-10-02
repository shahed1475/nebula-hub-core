import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationBefore = [
    { name: "Home", href: "/", isAnchor: false },
    { name: "About", href: "/#about", isAnchor: false },
    { name: "Portfolio", href: "/#portfolio", isAnchor: false },
  ];

  const navigationAfter = [
    { name: "Contact", href: "/contact", isAnchor: false },
  ];

  const navigationEnd = [
    { name: "Blog", href: "/blog", isAnchor: false },
  ];

  const serviceItems = [
    { name: "AI & Machine Learning", href: "/services/ai-machine-learning" },
    { name: "Custom Software Development", href: "/services/custom-software" },
    { name: "Web Development", href: "/services/web-development" },
    { name: "Mobile Apps", href: "/services/mobile-apps" },
    { name: "CRM & SaaS Tools", href: "/services/crm-saas" },
    { name: "Cloud & DevOps", href: "/services/cloud-devops" },
  ];

  const legalItems = [
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="group flex items-center space-x-3">
              <img 
                src="/popupgenix-logo.svg" 
                alt="PopupGenix Logo" 
                className="h-12 w-auto transition-all duration-500 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] group-hover:scale-105"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-500">
                PopupGenix
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationBefore.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </a>
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
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground hover:text-accent transition-colors duration-300 relative group flex items-center space-x-1 outline-none">
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="backdrop-blur-xl border min-w-[240px]"
                style={{
                  background: 'rgba(20, 20, 30, 0.95)',
                  borderColor: 'rgba(33, 150, 243, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(33, 150, 243, 0.2)'
                }}
              >
                {serviceItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.name} 
                    asChild
                    className="cursor-pointer transition-all duration-300 hover:bg-primary/10"
                    style={{
                      padding: '12px 16px'
                    }}
                  >
                    <Link
                      to={item.href}
                      className="text-foreground hover:text-accent transition-colors flex items-center group/item"
                      style={{
                        textShadow: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textShadow = 'none';
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover/item:opacity-100 transition-opacity" 
                            style={{
                              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
                            }}></span>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navigationAfter.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </a>
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
            
            {/* Legal Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground hover:text-accent transition-colors duration-300 relative group flex items-center space-x-1 outline-none">
                <span>Legal</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="backdrop-blur-xl border min-w-[220px]"
                style={{
                  background: 'rgba(20, 20, 30, 0.95)',
                  borderColor: 'rgba(33, 150, 243, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(33, 150, 243, 0.2)'
                }}
              >
                {legalItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.name} 
                    asChild
                    className="cursor-pointer transition-all duration-300 hover:bg-primary/10"
                    style={{
                      padding: '12px 16px'
                    }}
                  >
                    <Link
                      to={item.href}
                      className="text-foreground hover:text-accent transition-colors flex items-center group/item"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textShadow = 'none';
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            style={{
                              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
                            }}></span>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navigationEnd.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </a>
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
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors z-[60] relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            type="button"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-background/95 backdrop-blur-lg z-[55] md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation Sidebar */}
        <div 
          className={`fixed top-0 right-0 h-full w-[280px] bg-background border-l border-border/50 shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end p-4 border-b border-border/50">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-foreground hover:text-accent transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-6 py-6 space-y-1">
              {navigationBefore.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-3 px-4 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-3 px-4 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Services Section in Mobile */}
              <div className="pt-2">
                <div className="text-foreground font-medium py-3 px-4">Services</div>
                <div className="space-y-1">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-2 px-4 ml-4 rounded-lg text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {navigationAfter.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-3 px-4 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-3 px-4 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Legal Section in Mobile */}
              <div className="pt-2">
                <div className="text-foreground font-medium py-3 px-4">Legal</div>
                <div className="space-y-1">
                  {legalItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-2 px-4 ml-4 rounded-lg text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {navigationEnd.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-3 px-4 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 py-3 px-4 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* CTA Buttons at Bottom */}
            <div className="p-6 border-t border-border/50 space-y-3">
              <Link to="/portal" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Client Portal
                </Button>
              </Link>
              <Link to="/quote" onClick={() => setIsMenuOpen(false)}>
                <Button variant="hero" size="sm" className="w-full">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;