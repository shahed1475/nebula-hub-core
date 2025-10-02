import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

const Portfolio = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const projects = [
    {
      title: "Spendly",
      category: "Finance SaaS",
      description: "AI-powered expense management platform with automated categorization and intelligent budget insights.",
      image: "/portfolio/spendly.png",
      tags: ["AI/ML", "SaaS", "FinTech", "React"],
      challenge: "Complex expense tracking and budget management for businesses",
      approach: "Machine learning algorithms for automatic expense categorization",
      outcome: "40% reduction in expense processing time for clients",
      link: "https://github.com/raihan-js/spendly"
    },
    {
      title: "Clarify AI",
      category: "AI Platform",
      description: "Advanced AI-powered data analysis platform that transforms complex datasets into actionable insights.",
      image: "/portfolio/clarify.png",
      tags: ["AI/ML", "Data Analytics", "Python", "React"],
      challenge: "Making complex data analysis accessible to non-technical users",
      approach: "Natural language processing for intuitive data queries",
      outcome: "300% increase in data-driven decision making",
      link: "https://www.clarify.ai/"
    },
    {
      title: "Pregacare",
      category: "Healthcare App",
      description: "Comprehensive pregnancy tracking mobile app with AI-powered health monitoring and personalized care plans.",
      image: "/portfolio/pregacare.png",
      tags: ["Mobile", "Healthcare", "AI", "React Native"],
      challenge: "Personalized healthcare guidance throughout pregnancy",
      approach: "AI algorithms for personalized health recommendations",
      outcome: "50,000+ active users with 98% satisfaction rate",
      link: "https://github.com/raihan-js/pregacare"
    },
    {
      title: "FlaskColorWorks",
      category: "AI Tool",
      description: "Intelligent color palette generator using computer vision and design principles for creative professionals.",
      image: "/portfolio/flask.png",
      tags: ["AI", "Computer Vision", "Design", "Python"],
      challenge: "Automated color palette generation for designers",
      approach: "Computer vision algorithms analyzing color harmony",
      outcome: "Used by 10,000+ designers worldwide",
      link: "https://github.com/raihan-js/FlaskColorWorks"
    },
    {
      title: "Klevere AI",
      category: "SaaS Platform",
      description: "Business intelligence platform leveraging AI for predictive analytics and automated reporting.",
      image: "/portfolio/klevere.png",
      tags: ["AI", "Business Intelligence", "SaaS", "Analytics"],
      challenge: "Complex business data analysis and forecasting",
      approach: "Predictive AI models for business intelligence",
      outcome: "85% improvement in forecast accuracy",
      link: "https://www.klevere.ai/"
    },
    {
      title: "BlackGPT",
      category: "AI Chatbot",
      description: "Advanced conversational AI chatbot with specialized knowledge base and natural language understanding.",
      image: "/portfolio/blackgpt.png",
      tags: ["AI", "NLP", "Chatbot", "Machine Learning"],
      challenge: "Creating culturally aware and context-sensitive AI",
      approach: "Fine-tuned language models with specialized training",
      outcome: "95% user satisfaction with conversation quality",
      link: "https://blackgpt.us/"
    },
    {
      title: "Inno AI",
      category: "Business AI",
      description: "Comprehensive AI suite for business automation, from customer service to process optimization.",
      image: "/portfolio/inno.png",
      tags: ["AI", "Automation", "Business", "Enterprise"],
      challenge: "End-to-end business process automation",
      approach: "Modular AI systems for different business functions",
      outcome: "60% reduction in manual processes",
      link: "https://inno-ai-main-qk95hz.laravel.cloud/"
    }
  ];

  return (
    <section ref={sectionRef} id="portfolio" className="py-24 relative overflow-hidden">
      {/* Digital Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(33, 150, 243, 0.15) 2px, transparent 2px),
            linear-gradient(90deg, rgba(33, 150, 243, 0.15) 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-2"
            style={{
              top: `${15 + i * 25}%`,
              background: 'linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.4), rgba(33, 150, 243, 0.4), transparent)',
              animation: `wave-horizontal ${5 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'rgba(138, 43, 226, 0.6)' : i % 3 === 1 ? 'rgba(33, 150, 243, 0.6)' : 'rgba(16, 185, 129, 0.6)',
              animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: '0 0 10px currentColor'
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
                 borderColor: 'rgba(138, 43, 226, 0.4)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(138, 43, 226, 0.3)'
               }}>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-medium">Our Work</span>
            <Zap className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Portfolio Showcase
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how we've transformed businesses across industries with our 
            innovative AI and software solutions that deliver measurable results.
          </p>
        </div>

        {/* Portfolio Grid - Futuristic Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => {
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={project.title}
                className={`relative backdrop-blur-xl rounded-3xl border overflow-hidden transition-all duration-700 group cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: isHovered ? 'rgba(138, 43, 226, 0.6)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isHovered
                    ? '0 0 50px rgba(138, 43, 226, 0.5), 0 8px 32px rgba(0, 0, 0, 0.4)'
                    : '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transitionDelay: `${index * 0.15}s`,
                  transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated Border Glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(33, 150, 243, 0.3), rgba(16, 185, 129, 0.3))',
                    backgroundSize: '200% 200%',
                    animation: isHovered ? 'gradient-border 3s ease infinite' : 'none',
                    filter: 'blur(20px)'
                  }}
                />

                {/* Project Image with Parallax Effect */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
                    }}
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
                      opacity: isHovered ? 0.8 : 0.5
                    }}
                  />

                  {/* Animated Overlay Info */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="text-center p-6">
                      <h4 className="text-lg font-bold text-white mb-2">Project Details</h4>
                      <p className="text-sm text-gray-300 mb-4">{project.challenge}</p>
                      <div className="flex items-center justify-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-accent animate-pulse" />
                        <span className="text-accent text-sm font-medium">Click to Explore</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div
                      className="backdrop-blur-md rounded-full px-4 py-2 text-xs font-medium border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(138, 43, 226, 0.4)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {project.category}
                    </div>
                  </div>

                  {/* External Link Button */}
                  <div
                    className="absolute top-4 right-4 transition-all duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'scale(1)' : 'scale(0.8)'
                    }}
                  >
                    <button
                      className="p-3 backdrop-blur-md rounded-xl border transition-all duration-300 hover:scale-110"
                      style={{
                        background: 'rgba(33, 150, 243, 0.2)',
                        borderColor: 'rgba(33, 150, 243, 0.5)',
                        boxShadow: '0 0 20px rgba(33, 150, 243, 0.4)'
                      }}
                      onClick={() => window.open(project.link, '_blank')}
                      aria-label={`Open ${project.title}`}
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Project Content */}
                <div className="relative p-6 z-10">
                  <h3
                    className="text-xl font-bold mb-3 transition-colors duration-300"
                    style={{
                      color: isHovered ? 'rgba(16, 185, 129, 1)' : 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Animated Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-lg border transition-all duration-300 hover:scale-110"
                        style={{
                          background: isHovered
                            ? 'rgba(33, 150, 243, 0.2)'
                            : 'rgba(33, 150, 243, 0.1)',
                          borderColor: isHovered
                            ? 'rgba(33, 150, 243, 0.5)'
                            : 'rgba(33, 150, 243, 0.3)',
                          color: 'rgba(33, 150, 243, 1)',
                          boxShadow: isHovered ? '0 0 15px rgba(33, 150, 243, 0.4)' : 'none',
                          animation: isHovered ? `tag-pulse ${1 + tagIndex * 0.2}s ease-in-out infinite` : 'none'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Glowing Gradient Button */}
                  <button
                    className="w-full py-3 px-6 rounded-xl text-sm font-medium transition-all duration-500 relative overflow-hidden group/btn"
                    style={{
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(33, 150, 243, 0.3))'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: isHovered
                        ? '2px solid rgba(138, 43, 226, 0.6)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isHovered
                        ? '0 0 30px rgba(138, 43, 226, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)'
                        : 'none'
                    }}
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      View the Project
                      <ArrowRight
                        className="w-4 h-4 ml-2 transition-transform duration-300"
                        style={{
                          transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                        }}
                      />
                    </span>
                    {/* Animated shine effect */}
                    <div
                      className="absolute inset-0 transition-transform duration-1000"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)'
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section - Premium Glass Card */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1s' }}>
          <div
            className="backdrop-blur-xl p-12 rounded-3xl border transition-all duration-500 max-w-4xl mx-auto hover:scale-[1.02]"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 60px rgba(138, 43, 226, 0.6), 0 8px 32px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(138, 43, 226, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's create the next breakthrough solution together. Our proven track record
              speaks for itself – now let's write your success story.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/contact">
                <Button variant="hero" size="lg" className="hover:scale-110 transition-transform duration-300">
                  Start Your Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="hover:scale-110 transition-transform duration-300">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;