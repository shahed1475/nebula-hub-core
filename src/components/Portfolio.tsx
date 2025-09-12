import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Calendar,
  Users,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Portfolio = () => {
  const projects = [
    {
      title: "Spendly",
      category: "Finance SaaS",
      description: "AI-powered expense management platform with automated categorization and intelligent budget insights.",
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
      tags: ["AI", "Automation", "Business", "Enterprise"],
      challenge: "End-to-end business process automation",
      approach: "Modular AI systems for different business functions",
      outcome: "60% reduction in manual processes",
      link: "https://inno-ai-main-qk95hz.laravel.cloud/"
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-3 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Our Work</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Portfolio Showcase
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how we've transformed businesses across industries with our 
            innovative AI and software solutions that deliver measurable results.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              className="group bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-elegant overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-muted/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary/20 mix-blend-overlay"></div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="bg-card/80 backdrop-blur-sm hover:bg-primary"
                    aria-label={`Open ${project.title}`}
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <Target className="w-4 h-4 text-accent mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Challenge</div>
                  </div>
                  <div>
                    <Users className="w-4 h-4 text-accent mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Solution</div>
                  </div>
                  <div>
                    <Calendar className="w-4 h-4 text-accent mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Outcome</div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:border-primary/60 group-hover:shadow-neon"
                  onClick={() => window.open(project.link, '_blank')}
                >
                  View the Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-card p-12 rounded-2xl border border-primary/20 shadow-elegant max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's create the next breakthrough solution together. Our proven track record 
              speaks for itself – now let's write your success story.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button variant="hero" size="lg">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
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