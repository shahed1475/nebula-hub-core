import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            Terms and Conditions
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using PopupGenix services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. User Accounts & Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Payment & Subscription Renewals</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Subscription fees are billed in advance on a monthly or annual basis and are non-refundable except as stated in our Refund Policy. Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify our pricing with 30 days' notice. Continued use of our services after price changes constitutes acceptance of the new pricing.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Use of Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PopupGenix provides SaaS products and AI integration services. You agree to use these services only for lawful purposes and in accordance with these Terms. Prohibited uses include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Using our services in any way that violates applicable laws or regulations</li>
                <li>Attempting to gain unauthorized access to any portion of our services</li>
                <li>Engaging in any activity that interferes with or disrupts our services</li>
                <li>Using our AI services to generate illegal, harmful, or misleading content</li>
                <li>Reselling or redistributing our services without explicit permission</li>
              </ul>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of PopupGenix and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You retain all rights to any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with providing the Service.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Termination of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service and cancel your subscription.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In no event shall PopupGenix, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which PopupGenix operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service will be resolved through binding arbitration.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </Card>

            <Card className="p-8 border-border bg-card/50 backdrop-blur bg-primary/5">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <p className="text-foreground font-semibold">
                Email: <a href="mailto:support@popupgenix.com" className="text-primary hover:underline">support@popupgenix.com</a>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
