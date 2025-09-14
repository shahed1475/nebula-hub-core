import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ServicesSlider from "@/components/ServicesSlider";
import Portfolio from "@/components/Portfolio";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <ServicesSlider />
        <Portfolio />
        <TestimonialsSlider />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
