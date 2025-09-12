import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calculator, CheckCircle, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Quote = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    projectDescription: "",
    budgetRange: "",
    timeline: "",
    additionalRequirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("quote_requests")
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          project_type: formData.projectType,
          project_description: formData.projectDescription,
          budget_range: formData.budgetRange,
          timeline: formData.timeline,
          additional_requirements: formData.additionalRequirements,
          status: "new",
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Quote request submitted successfully!",
        description: "We'll prepare a detailed quote and get back to you within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "Error submitting quote request",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <Header />
        
        <main className="pt-20">
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-12">
                    <div className="mb-8">
                      <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
                      <h1 className="text-3xl font-bold mb-4">Quote Request Received!</h1>
                      <p className="text-muted-foreground text-lg">
                        Thank you for your interest in working with PopupGenix. We've received your quote request and our team is already reviewing your project details.
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-6 mb-8">
                      <h3 className="font-semibold mb-4">What happens next?</h3>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-primary mr-3" />
                          <span>We'll review your requirements within 4-6 hours</span>
                        </div>
                        <div className="flex items-center">
                          <Calculator className="w-5 h-5 text-accent mr-3" />
                          <span>Our team will prepare a detailed quote and project timeline</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-primary mr-3" />
                          <span>You'll receive a comprehensive proposal within 24 hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        onClick={() => window.location.href = "/"}
                        className="bg-gradient-primary hover:shadow-neon"
                      >
                        Return to Homepage
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Questions? Call us at +1 479 689 1012
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              Get Your Custom Quote
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tell us about your project and receive a detailed, personalized quote within 24 hours
            </p>
          </div>
        </section>

        {/* Quote Form */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Project Details</CardTitle>
                  <CardDescription>
                    The more details you provide, the more accurate your quote will be
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Organization</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-input border-border"
                        />
                      </div>
                    </div>

                    {/* Project Information */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type *</Label>
                        <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue placeholder="Select your project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website Development</SelectItem>
                            <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                            <SelectItem value="web-app">Web Application</SelectItem>
                            <SelectItem value="ai-solution">AI Solution</SelectItem>
                            <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                            <SelectItem value="crm">CRM System</SelectItem>
                            <SelectItem value="custom-software">Custom Software</SelectItem>
                            <SelectItem value="other">Other (describe below)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectDescription">Project Description *</Label>
                        <Textarea
                          id="projectDescription"
                          value={formData.projectDescription}
                          onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                          required
                          rows={5}
                          placeholder="Describe your project in detail - goals, features, target audience, etc."
                          className="bg-input border-border resize-none"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="budgetRange">Budget Range *</Label>
                          <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange("budgetRange", value)}>
                            <SelectTrigger className="bg-input border-border">
                              <SelectValue placeholder="Select your budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-5k">Under $5,000</SelectItem>
                              <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                              <SelectItem value="15k-30k">$15,000 - $30,000</SelectItem>
                              <SelectItem value="30k-50k">$30,000 - $50,000</SelectItem>
                              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                              <SelectItem value="100k-plus">$100,000+</SelectItem>
                              <SelectItem value="discuss">Let's discuss</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timeline">Desired Timeline</Label>
                          <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                            <SelectTrigger className="bg-input border-border">
                              <SelectValue placeholder="When do you need this completed?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-month">Within 1 month</SelectItem>
                              <SelectItem value="2-3-months">2-3 months</SelectItem>
                              <SelectItem value="3-6-months">3-6 months</SelectItem>
                              <SelectItem value="6-plus-months">6+ months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                        <Textarea
                          id="additionalRequirements"
                          value={formData.additionalRequirements}
                          onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
                          rows={4}
                          placeholder="Any specific technologies, integrations, or requirements we should know about?"
                          className="bg-input border-border resize-none"
                        />
                      </div>
                    </div>

                    <div className="bg-muted/20 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">What you'll get in your quote:</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          <span>Detailed project breakdown</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          <span>Timeline and milestones</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          <span>Technology recommendations</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-primary mr-2" />
                          <span>Support and maintenance options</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300 text-lg py-6"
                    >
                      {isSubmitting ? (
                        "Submitting Your Request..."
                      ) : (
                        <>
                          <Calculator className="mr-2 h-5 w-5" />
                          Get My Custom Quote
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Free consultation • No obligation • Response within 24 hours
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Quote;