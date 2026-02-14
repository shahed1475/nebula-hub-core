import { Mail, MessageCircle, ArrowRight } from "lucide-react";

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  showContactInfo?: boolean;
  className?: string;
}

const EMAIL_HREF = `mailto:popupitcompany@gmail.com?subject=${encodeURIComponent("New Project Inquiry – PopupGenix")}&body=${encodeURIComponent("Name:\nCompany:\nBudget:\nProject Details:\n")}`;
const WA_CHAT_HREF = `https://wa.me/8801838580258?text=${encodeURIComponent("Hello PopupGenix, I'd like to discuss a project.")}`;

const ContactSection = ({
  title = "Get In Touch",
  subtitle = "Ready to start your next project? Contact us today!",
  className = "",
}: ContactSectionProps) => {
  return (
    <section className={`py-16 bg-gradient-card ${className}`}>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">{subtitle}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={EMAIL_HREF}
            aria-label="Email PopupGenix"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              background: "linear-gradient(135deg, rgba(138,43,226,0.35), rgba(33,150,243,0.35))",
              border: "1.5px solid rgba(138,43,226,0.5)",
              boxShadow: "0 0 20px rgba(138,43,226,0.2), 0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <Mail className="w-5 h-5 shrink-0" />
            Email Us
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href={WA_CHAT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with PopupGenix on WhatsApp"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            style={{
              background: "linear-gradient(135deg, rgba(37,211,102,0.3), rgba(18,140,60,0.35))",
              border: "1.5px solid rgba(37,211,102,0.5)",
              boxShadow: "0 0 20px rgba(37,211,102,0.2), 0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            Chat on WhatsApp
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
