import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Who We Are Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">About PopupGenix</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
            Who We Are
          </h2>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            PopupGenix is a forward-thinking AI & software company creating intelligent, 
            scalable, and future-proof solutions for businesses worldwide. We combine 
            cutting-edge technology with deep industry expertise to deliver transformative 
            digital experiences.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex p-3 rounded-xl bg-card border border-primary/20 mb-3">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Mission */}
          <Card className="p-8 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 group">
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-xl bg-card/50 border border-primary/20 group-hover:shadow-neon transition-all duration-300">
                <Target className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower businesses with AI-driven software that enhances efficiency, 
              security, and growth. We believe in democratizing advanced technology 
              to make it accessible and valuable for organizations of all sizes.
            </p>
          </Card>

          {/* Vision */}
          <Card className="p-8 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 group">
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-xl bg-card/50 border border-primary/20 group-hover:shadow-neon transition-all duration-300">
                <Eye className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              Becoming a global leader in AI-powered custom software solutions, 
              setting new standards for innovation, quality, and client success 
              in the digital transformation landscape.
            </p>
          </Card>
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
                <Card 
                  key={value.title}
                  className="p-6 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 group text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-card/50 border border-primary/20 group-hover:shadow-neon transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gradient-card p-12 rounded-2xl border border-primary/20 shadow-elegant">
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Ready to Experience the PopupGenix Difference?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the growing list of businesses that have transformed their operations 
                with our innovative AI and software solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button variant="hero" size="lg">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Meet Our Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;