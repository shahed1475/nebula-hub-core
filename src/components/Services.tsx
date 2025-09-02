import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  BarChart3, 
  Palette, 
  Rocket,
  ArrowRight,
  Sparkles
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "AI & Machine Learning",
      description: "Advanced AI solutions including NLP, computer vision, predictive analytics, and AI security systems.",
      features: ["Natural Language Processing", "Computer Vision", "Predictive Analytics", "AI Security"],
      color: "text-primary"
    },
    {
      icon: Smartphone,
      title: "Custom Software Development",
      description: "Bespoke enterprise solutions including ERP, CRM, SaaS platforms, and business automation tools.",
      features: ["ERP Systems", "CRM Solutions", "SaaS Platforms", "Business Automation"],
      color: "text-accent"
    },
    {
      icon: ShoppingCart,
      title: "Web Development",
      description: "Modern web applications from corporate websites to e-commerce platforms and progressive web apps.",
      features: ["Corporate Websites", "E-commerce Platforms", "Content Management", "Progressive Web Apps"],
      color: "text-primary-glow"
    },
    {
      icon: Palette,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications powered by AI for iOS, Android, and hybrid platforms.",
      features: ["iOS Development", "Android Development", "Cross-platform", "AI-powered Apps"],
      color: "text-accent-glow"
    },
    {
      icon: BarChart3,
      title: "CRM & SaaS Tools",
      description: "Intelligent CRM systems and SaaS tools with sales automation and AI-driven analytics dashboards.",
      features: ["Sales Automation", "AI Dashboards", "Customer Analytics", "Lead Management"],
      color: "text-primary"
    },
    {
      icon: Rocket,
      title: "Cloud & DevOps",
      description: "Cloud migration services, CI/CD pipelines, Kubernetes orchestration, and scalable infrastructure.",
      features: ["Cloud Migration", "CI/CD Pipelines", "Kubernetes", "Infrastructure Scaling"],
      color: "text-accent"
    }
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Our Services</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Our Core Services
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We deliver comprehensive AI and software solutions that drive innovation, 
            enhance efficiency, and accelerate your business growth in the digital age.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.title}
                className="p-8 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 group hover:shadow-elegant animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-card/50 border border-primary/20 group-hover:shadow-neon transition-all duration-300 ${service.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:border-primary/60 group-hover:shadow-neon"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-card p-12 rounded-2xl border border-primary/20 shadow-elegant">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Let's Build Together – Your Idea, Our Technology
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to transform your business with AI-powered solutions? Let's discuss how 
              we can bring your vision to life with our proven expertise in cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button variant="hero" size="lg">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                View Our Process
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;