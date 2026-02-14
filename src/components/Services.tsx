import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { 
  Globe, 
  Smartphone, 
  ArrowRight,
  Sparkles,
  Brain,
  Code,
  Users,
  Cloud
} from "lucide-react";


const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <section ref={sectionRef} id="services" className="py-24 relative overflow-hidden">
      {/* Animated Gradient Waves Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              style={{
                top: `${20 + i * 30}%`,
                animation: `wave-slide ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 backdrop-blur-md rounded-full px-6 py-3 mb-6 animate-fade-in border"
               style={{ 
                 background: 'rgba(255, 255, 255, 0.05)',
                 borderColor: 'rgba(33, 150, 243, 0.3)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(33, 150, 243, 0.2)'
               }}>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
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

        {/* Services Grid - Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div 
                key={service.title}
                className={`relative p-8 backdrop-blur-xl rounded-3xl border transition-all duration-700 group cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: isHovered ? 'rgba(33, 150, 243, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isHovered 
                    ? '0 0 40px rgba(33, 150, 243, 0.4), 0 8px 32px rgba(0, 0, 0, 0.4)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transitionDelay: `${index * 0.1}s`,
                  transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated Background on Hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(33, 150, 243, 0.1), rgba(16, 185, 129, 0.1))',
                    backgroundSize: '200% 200%',
                    animation: isHovered ? 'gradient-shift 3s ease infinite' : 'none'
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Animation */}
                  <div className="mb-6">
                    <div 
                      className={`inline-flex p-4 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${service.color}`}
                      style={{ 
                        background: isHovered ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.08)',
                        borderColor: isHovered ? 'rgba(33, 150, 243, 0.5)' : 'rgba(33, 150, 243, 0.2)',
                        boxShadow: isHovered ? '0 0 30px rgba(33, 150, 243, 0.4)' : 'none',
                        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
                      }}
                    >
                      <IconComponent 
                        className="w-8 h-8 transition-all duration-500" 
                        style={{
                          filter: isHovered ? 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.8))' : 'none'
                        }}
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features with Glow Effect */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li 
                        key={feature} 
                        className="flex items-center space-x-3 group/item"
                      >
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
                          style={{
                            background: isHovered ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 0.6)',
                            boxShadow: isHovered ? '0 0 10px rgba(16, 185, 129, 0.8)' : 'none',
                            animation: isHovered ? `pulse-dot ${1 + featureIndex * 0.2}s ease-in-out infinite` : 'none'
                          }}
                        ></div>
                        <span 
                          className="text-sm transition-colors duration-300"
                          style={{
                            color: isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)'
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Glowing Gradient Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="w-full py-3 px-6 rounded-xl text-sm font-medium transition-all duration-500 relative overflow-hidden group/btn"
                        style={{
                          background: isHovered 
                            ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(33, 150, 243, 0.2))' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: isHovered 
                            ? '1px solid rgba(33, 150, 243, 0.6)' 
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: isHovered 
                            ? '0 0 20px rgba(33, 150, 243, 0.4), inset 0 0 20px rgba(33, 150, 243, 0.1)' 
                            : 'none'
                        }}
                        onClick={() => setSelectedService(service)}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Learn More
                          <ArrowRight 
                            className="w-4 h-4 ml-2 transition-transform duration-300" 
                            style={{
                              transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                            }}
                          />
                        </span>
                        {/* Animated shine effect */}
                        <div 
                          className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                          }}
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto backdrop-blur-xl border"
                      style={{
                        background: 'rgba(20, 20, 30, 0.95)',
                        borderColor: 'rgba(33, 150, 243, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                      }}>
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
                              <Badge 
                                key={featureIndex} 
                                variant="secondary"
                                className="backdrop-blur-sm"
                                style={{
                                  background: 'rgba(33, 150, 243, 0.2)',
                                  borderColor: 'rgba(33, 150, 243, 0.4)'
                                }}
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-primary/20">
                          <Link to="/contact">
                            <Button className="w-full">
                              Get a Quote for {service.title}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default Services;