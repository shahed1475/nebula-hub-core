import stripeLogo from "@/assets/stripe.png";
import wiseLogo from "@/assets/wise.png";
import visaLogo from "@/assets/visa.svg";
import mastercardLogo from "@/assets/mastercard.svg";

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

  const base = `${sizeClasses[size]} object-contain transition-opacity`;
  const mono = `${base} grayscale brightness-110 contrast-125 opacity-80 hover:opacity-100`;
  const color = `${base} hover:opacity-90`;

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-medium text-foreground">{title}</p>
      )}
      <div className="flex items-center gap-4">
        <img src={stripeLogo} alt="Stripe secure payments logo" loading="lazy" className={variant === 'monochrome' ? mono : color} />
        <img src={wiseLogo} alt="Wise payments logo" loading="lazy" className={variant === 'monochrome' ? mono : color} />
        <img src={visaLogo} alt="Visa payments logo" loading="lazy" className={variant === 'monochrome' ? mono : color} />
        <img src={mastercardLogo} alt="Mastercard payments logo" loading="lazy" className={variant === 'monochrome' ? mono : color} />
      </div>
    </div>
  );
};

export default PaymentLogos;