import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  TrendingUp,
  Sparkles,
  Users,
  Award,
  Globe,
  ArrowRight
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge AI and emerging technologies"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Building robust, secure solutions that protect and empower businesses"
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Delivering scalable solutions that drive sustainable business growth"
    },
    {
      icon: Heart,
      title: "Trust",
      description: "Building lasting partnerships through transparency and reliability"
    },
    {
      icon: Award,
      title: "Scalability",
      description: "Creating future-proof solutions that grow with your business needs"
    }
  ];

  const stats = [
    { number: "50+", label: "Projects Delivered", icon: Target },
    { number: "25+", label: "Global Clients", icon: Globe },
    { number: "5+", label: "Years Experience", icon: Award },
    { number: "100%", label: "Client Satisfaction", icon: Users }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Glowing Orbs for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Who We Are Section - Glassmorphism */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center space-x-2 backdrop-blur-md border rounded-full px-6 py-3 mb-8 animate-fade-in" 
               style={{ 
                 background: 'rgba(255, 255, 255, 0.05)', 
                 borderColor: 'rgba(33, 150, 243, 0.3)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">About PopupGenix</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Who We Are
          </h2>

          {/* Frosted Glass Container */}
          <div className="backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-12 animate-fade-in border" 
               style={{ 
                 background: 'rgba(255, 255, 255, 0.05)', 
                 borderColor: 'rgba(255, 255, 255, 0.1)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                 animationDelay: '0.4s'
               }}>
            <div className="text-left space-y-6">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                PopupGenix is a custom software and AI solutions company helping businesses of all sizes 
                transform their ideas into powerful digital products. We design and build everything from 
                websites and mobile apps to advanced AI-driven platforms. Our team focuses on creating 
                scalable, secure, and user-friendly solutions that are designed to grow with your business.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We provide complete enterprise software such as <span className="text-accent font-medium">CRM systems</span> (Customer 
                Relationship Management) that help companies manage customer interactions, and <span className="text-accent font-medium">ERP 
                systems</span> (Enterprise Resource Planning) that streamline operations like sales, HR, finance, 
                and inventory management.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                In addition, we deliver modern <span className="text-accent font-medium">SaaS platforms</span>, responsive web applications, 
                and intelligent <span className="text-accent font-medium">AI/ML solutions</span> such as predictive analytics, automation, 
                and computer vision. Our mission is simple: to help businesses innovate faster, reduce costs, 
                and serve their customers better with the power of technology.
              </p>
            </div>
          </div>

          {/* Stats Grid - Animated Glass Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center animate-fade-in group cursor-pointer backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 hover:scale-105"
                  style={{ 
                    animationDelay: `${index * 0.1 + 0.6}s`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(33, 150, 243, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div className="inline-flex p-3 rounded-xl mb-3 backdrop-blur-sm border transition-all duration-300 group-hover:scale-110"
                       style={{ 
                         background: 'rgba(33, 150, 243, 0.1)',
                         borderColor: 'rgba(33, 150, 243, 0.3)'
                       }}>
                    <IconComponent className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-1 group-hover:text-primary transition-colors">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision - Futuristic Glass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <div className="p-8 backdrop-blur-xl rounded-3xl border transition-all duration-500 group animate-fade-in hover:scale-[1.02]"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.05)',
                 borderColor: 'rgba(255, 255, 255, 0.1)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                 animationDelay: '0.8s'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.boxShadow = '0 0 40px rgba(33, 150, 243, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)';
                 e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.5)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                 e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
               }}>
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-110"
                   style={{ 
                     background: 'rgba(33, 150, 243, 0.1)',
                     borderColor: 'rgba(33, 150, 243, 0.3)'
                   }}>
                <Target className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_8px_rgba(33,150,243,0.8)] transition-all" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To help businesses innovate faster, reduce costs, and serve their customers better 
              with the power of technology. We believe in making advanced AI and enterprise software 
              accessible to organizations of all sizes, delivering solutions that drive measurable 
              results and sustainable growth.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 backdrop-blur-xl rounded-3xl border transition-all duration-500 group animate-fade-in hover:scale-[1.02]"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.05)',
                 borderColor: 'rgba(255, 255, 255, 0.1)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                 animationDelay: '1s'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)';
                 e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                 e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
               }}>
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-110"
                   style={{ 
                     background: 'rgba(16, 185, 129, 0.1)',
                     borderColor: 'rgba(16, 185, 129, 0.3)'
                   }}>
                <Eye className="w-8 h-8 text-accent group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              Becoming a global leader in AI-powered custom software solutions, 
              setting new standards for innovation, quality, and client success 
              in the digital transformation landscape.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our Core Values
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every solution we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={value.title}
                  className="p-6 backdrop-blur-xl rounded-2xl border transition-all duration-500 group text-center animate-fade-in hover:scale-105"
                  style={{ 
                    animationDelay: `${index * 0.1 + 1.2}s`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(33, 150, 243, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-110"
                         style={{ 
                           background: 'rgba(33, 150, 243, 0.1)',
                           borderColor: 'rgba(33, 150, 243, 0.3)'
                         }}>
                      <IconComponent className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA - Premium Glass Card */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '1.8s' }}>
            <div className="backdrop-blur-xl p-12 rounded-3xl border transition-all duration-500 hover:scale-[1.02]"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.05)',
                   borderColor: 'rgba(255, 255, 255, 0.1)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.boxShadow = '0 0 50px rgba(33, 150, 243, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)';
                   e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.6)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                   e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                 }}>
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Ready to Experience the PopupGenix Difference?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the growing list of businesses that have transformed their operations 
                with our innovative AI and software solutions.
              </p>
              <div className="flex items-center justify-center">
                <Link to="/contact">
                  <Button variant="hero" size="lg" className="hover:scale-110 transition-transform duration-300">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;