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
      title: "Custom Web Development",
      description: "Bespoke websites built with cutting-edge technologies for maximum performance and user experience.",
      features: ["React & Next.js", "Performance Optimized", "SEO Ready", "Mobile First"],
      color: "text-primary"
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that engage users and drive business growth.",
      features: ["iOS & Android", "React Native", "App Store Optimization", "Push Notifications"],
      color: "text-accent"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description: "Complete online stores with secure payments, inventory management, and conversion optimization.",
      features: ["Shopify & WooCommerce", "Payment Integration", "Inventory Management", "Analytics"],
      color: "text-primary-glow"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers with proven design principles.",
      features: ["User Research", "Wireframing", "Prototyping", "A/B Testing"],
      color: "text-accent-glow"
    },
    {
      icon: BarChart3,
      title: "Digital Marketing",
      description: "Data-driven marketing strategies that increase your online visibility and drive qualified leads.",
      features: ["SEO & SEM", "Social Media", "Content Marketing", "Analytics"],
      color: "text-primary"
    },
    {
      icon: Rocket,
      title: "Performance Optimization",
      description: "Speed up your website and improve user experience with advanced optimization techniques.",
      features: ["Core Web Vitals", "CDN Setup", "Image Optimization", "Caching Strategy"],
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
            What We Do Best
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer comprehensive digital solutions that transform your ideas into 
            powerful, conversion-focused web experiences.
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
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with our proven expertise 
              and cutting-edge technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button variant="hero" size="lg">
                Get Free Consultation
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