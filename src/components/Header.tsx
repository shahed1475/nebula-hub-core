import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";


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
    <>
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
                className="backdrop-blur-xl border border-border min-w-[240px] bg-popover shadow-lg"
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
                className="backdrop-blur-xl border border-border min-w-[220px] bg-popover shadow-lg"
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

          {/* Theme Toggle */}
          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="p-2 text-foreground hover:text-accent transition-colors relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              type="button"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </header>

    {/* Mobile Navigation - Only render when open */}
    {isMenuOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden animate-fade-in"
          style={{ top: '72px' }}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Navigation Panel */}
        <div
          className="fixed top-[72px] left-0 right-0 md:hidden z-[101] animate-slide-down"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="mx-4 mt-2 rounded-xl border border-border/50 bg-background shadow-2xl overflow-hidden">
            {/* Close button */}
            <div className="flex justify-end p-3 border-b border-border/50">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-foreground hover:text-accent transition-colors"
                aria-label="Close menu"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            <div className="p-2 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-1">
                {navigationBefore.map((item) => (
                  item.isAnchor ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-4 py-3 text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block rounded-lg px-4 py-3 text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}

                {/* Services */}
                <div className="pt-2">
                  <div className="px-4 py-3 text-foreground font-medium">Services</div>
                  <div className="flex flex-col gap-1">
                    {serviceItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block rounded-lg px-6 py-2 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors text-sm"
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
                      className="block rounded-lg px-4 py-3 text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block rounded-lg px-4 py-3 text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}

                {/* Legal */}
                <div className="pt-2">
                  <div className="px-4 py-3 text-foreground font-medium">Legal</div>
                  <div className="flex flex-col gap-1">
                    {legalItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block rounded-lg px-6 py-2 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Blog */}
                {navigationEnd.map((item) => (
                  item.isAnchor ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-4 py-3 text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block rounded-lg px-4 py-3 text-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>

            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Header;
