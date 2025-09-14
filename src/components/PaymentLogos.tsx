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

  const colorLogoClasses = `${sizeClasses[size]} object-contain hover:opacity-80 transition-opacity`;

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-medium text-foreground">{title}</p>
      )}
      <div className="flex items-center gap-4">
        {variant === "color" ? (
          <>
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stripe/stripe-original.svg" 
              alt="Stripe" 
              className={colorLogoClasses}
            />
            <img 
              src="https://wise.com/public-resources/assets/logos/logo-square.svg" 
              alt="Wise" 
              className={colorLogoClasses}
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              className={colorLogoClasses}
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
              alt="Mastercard" 
              className={colorLogoClasses}
            />
          </>
        ) : (
          <>
            <img 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stripe/stripe-original.svg" 
              alt="Stripe" 
              className={logoClasses}
            />
            <img 
              src="https://wise.com/public-resources/assets/logos/logo-square.svg" 
              alt="Wise" 
              className={logoClasses}
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              className={logoClasses}
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
              alt="Mastercard" 
              className={logoClasses}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentLogos;