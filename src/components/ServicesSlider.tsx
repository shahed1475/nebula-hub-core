import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  order_index: number;
  active: boolean;
}

export default function ServicesSlider() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
    return IconComponent;
  };

  const getColorClass = (index: number) => {
    const colors = ['text-primary', 'text-accent', 'text-primary-glow', 'text-accent-glow'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <section id="services" className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Our Services</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

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

        {/* Services Carousel */}
        <div className="relative max-w-7xl mx-auto mb-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {services.map((service, index) => {
                const IconComponent = getIconComponent(service.icon);
                const colorClass = getColorClass(index);
                
                return (
                  <CarouselItem key={service.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full p-8 bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-500 group hover:shadow-elegant">
                      <div className="mb-6">
                        <div className={`inline-flex p-3 rounded-xl bg-card/50 border border-primary/20 group-hover:shadow-neon transition-all duration-300 ${colorClass}`}>
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
                        {service.features.slice(0, 4).map((feature) => (
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
                        {selectedService && selectedService.id === service.id && (
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center text-2xl">
                                <IconComponent className="w-6 h-6 mr-3 text-primary" />
                                {selectedService.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {selectedService.description}
                              </p>
                              <div>
                                <h4 className="font-semibold mb-2">Key Features:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedService.features.map((feature, featureIndex) => (
                                    <Badge key={featureIndex} variant="secondary">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="pt-4 border-t">
                                <Link to="/quote">
                                  <Button className="w-full">
                                    Get a Quote for {selectedService.title}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-background/80 hover:bg-background border-border" />
            <CarouselNext className="right-4 bg-background/80 hover:bg-background border-border" />
          </Carousel>
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
    </section>
  );
}