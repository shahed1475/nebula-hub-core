import stripeIcon from "@/assets/stripe.png";
import wiseIcon from "@/assets/wise.png";
import visaIcon from "@/assets/visa.svg";
import mastercardIcon from "@/assets/mastercard.svg";

interface PaymentLogosProps {
  variant?: "color" | "monochrome";
  size?: "sm" | "md" | "lg";
  title?: string;
}

const PaymentLogos = ({ variant = "monochrome", size = "md", title = "We Accept Secure Payments" }: PaymentLogosProps) => {
  const sizeClasses = {
    sm: "h-4",
    md: "h-6", 
    lg: "h-8"
  };

  const logoClasses = variant === "monochrome" 
    ? `${sizeClasses[size]} object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity`
    : `${sizeClasses[size]} object-contain hover:opacity-80 transition-opacity`;

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-medium text-foreground">{title}</p>
      )}
      <div className="flex items-center gap-4">
        <img src={stripeIcon} alt="Stripe" className={logoClasses} />
        <img src={wiseIcon} alt="Wise" className={logoClasses} />
        <img src={visaIcon} alt="Visa" className={logoClasses} />
        <img src={mastercardIcon} alt="Mastercard" className={logoClasses} />
      </div>
    </div>
  );
};

export default PaymentLogos;