import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  BarChart3, 
  Palette, 
  Rocket,
  ArrowRight,
  Sparkles,
  Brain,
  Code,
  Users,
  Cloud
} from "lucide-react";
import ContactSection from "@/components/ContactSection";

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const services = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Advanced AI solutions including NLP, computer vision, predictive analytics, and AI security systems.",
      features: ["Natural Language Processing", "Computer Vision", "Predictive Analytics", "AI Security"],
      color: "text-primary",
      learnMore: "At PopupGenix, we harness the power of Artificial Intelligence and Machine Learning to transform businesses into smarter, data-driven enterprises. Our solutions include Natural Language Processing (NLP) for understanding and analyzing text, Computer Vision for image and video recognition, and Predictive Analytics for accurate forecasting and decision-making. Additionally, our AI Security Systems safeguard your infrastructure and sensitive data from cyber threats. By integrating AI into your workflows, we enable automation, improve operational efficiency, and uncover insights that drive innovation and competitive advantage."
    },
    {
      icon: Code,
      title: "Custom Software Development",
      description: "Bespoke enterprise solutions including ERP, CRM, SaaS platforms, and business automation tools.",
      features: ["ERP Systems", "CRM Solutions", "SaaS Platforms", "Business Automation"],
      color: "text-accent",
      learnMore: "Every business has unique processes, challenges, and goals—your software should reflect that. PopupGenix specializes in building custom ERP systems, CRM solutions, SaaS platforms, and business automation tools tailored to your exact requirements. Our team ensures that every solution integrates seamlessly with your existing operations, optimizes workflows, and provides real-time insights. Whether you need scalable enterprise applications or specialized tools for niche processes, our bespoke software increases productivity, reduces manual work, and accelerates growth."
    },
    {
      icon: Globe,
      title: "Web Development",
      description: "Modern web applications from corporate websites to e-commerce platforms and progressive web apps.",
      features: ["Corporate Websites", "E-commerce Platforms", "Content Management", "Progressive Web Apps"],
      color: "text-primary-glow",
      learnMore: "We design and develop modern, high-performance web applications that are both visually appealing and technically robust. From corporate websites that build brand credibility to e-commerce platforms that drive sales, Content Management Systems (CMS) for easy website management, and Progressive Web Apps (PWAs) for a seamless mobile experience, PopupGenix delivers solutions that scale with your business. Our development approach ensures fast loading times, responsive designs, enhanced security, and integration with advanced analytics and marketing tools."
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications powered by AI for iOS, Android, and hybrid platforms.",
      features: ["iOS Development", "Android Development", "Cross-platform", "AI-powered Apps"],
      color: "text-accent-glow",
      learnMore: "PopupGenix creates native and cross-platform mobile applications designed to engage users and elevate business performance. Our mobile solutions span iOS and Android development, hybrid apps, and AI-powered applications that deliver personalized experiences. We focus on intuitive design, high performance, and seamless integration with backend systems. By leveraging AI within mobile apps, we help businesses enhance user engagement, provide smarter interactions, and gain actionable insights from user behavior—all while maintaining high security and scalability."
    },
    {
      icon: Users,
      title: "CRM & SaaS Tools",
      description: "Intelligent CRM systems and SaaS tools with sales automation and AI-driven analytics dashboards.",
      features: ["Sales Automation", "AI Dashboards", "Customer Analytics", "Lead Management"],
      color: "text-primary",
      learnMore: "Efficiently manage your sales, leads, and customer relationships with our intelligent CRM systems and SaaS tools. PopupGenix integrates AI-powered dashboards, predictive analytics, sales automation, and customer insights to help businesses make informed decisions and optimize performance. Our platforms enable real-time tracking of customer interactions, streamline lead management, automate repetitive tasks, and enhance team collaboration. Whether you are a startup or enterprise, our solutions empower you to increase conversions, improve customer satisfaction, and grow your business intelligently."
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description: "Cloud migration services, CI/CD pipelines, Kubernetes orchestration, and scalable infrastructure.",
      features: ["Cloud Migration", "CI/CD Pipelines", "Kubernetes", "Infrastructure Scaling"],
      color: "text-accent",
      learnMore: "Our Cloud & DevOps services help businesses achieve resilience, scalability, and operational efficiency. PopupGenix provides cloud migration, CI/CD pipeline automation, Kubernetes orchestration, and infrastructure scaling to ensure seamless performance and minimal downtime. By automating deployments and optimizing cloud architecture, we reduce operational costs, enhance application stability, and accelerate development cycles. Our solutions are designed to handle high-traffic workloads, ensure business continuity, and provide the flexibility your enterprise needs to grow securely in the digital age."
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
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:border-primary/60 group-hover:shadow-neon"
                      onClick={() => setSelectedService(service)}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-2xl">
                        <service.icon className="w-6 h-6 mr-3 text-primary" />
                        {service.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {service.learnMore}
                      </p>
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature: string, featureIndex: number) => (
                            <Badge key={featureIndex} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <Link to="/quote">
                          <Button className="w-full">
                            Get a Quote for {service.title}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
              Let's discuss how we can bring your vision to life with our proven expertise in cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Start Your Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection
        title="Let's Work Together"
        subtitle="Let's discuss how our services can help you achieve your goals. Get in touch with our experts today!"
        className="bg-background"
      />
    </section>
  );
};

export default Services;