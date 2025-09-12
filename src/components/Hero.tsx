import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <img 
          src={heroImage} 
          alt="Futuristic digital background"
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary-glow/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3 mb-8 animate-glow-pulse">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">AI & Software Solutions</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Building Future-Ready
            </span>
            <br />
            <span className="text-foreground">AI & Software Solutions</span>
            <span className="text-4xl md:text-5xl lg:text-6xl ml-4">🚀</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            PopupGenix creates intelligent, scalable, and future-proof AI solutions 
            that empower businesses worldwide to enhance efficiency, security, and growth 
            through cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link to="/contact">
              <Button variant="hero" size="xl" className="group">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#portfolio">
              <Button variant="neon" size="xl" className="group">
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                View Portfolio
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <div className="text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="text-3xl font-bold text-accent mb-2">25+</div>
              <div className="text-muted-foreground">Global Clients</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.9s" }}>
              <div className="text-3xl font-bold text-accent mb-2">5+</div>
              <div className="text-muted-foreground">Years in Business</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent/50 rounded-full">
          <div className="w-1 h-3 bg-accent rounded-full mx-auto mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;